import asyncio

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core import GraphEngine
from .core.buffer_manager import BufferManager
from .core.extractor import KnowledgeExtractor


@register(
    "GraphMemory",
    "lxfight",
    "A graph-based memory plugin for AstrBot.",
    version="0.1.0",
)
class GraphMemory(Star):
    def __init__(
        self,
        context: Context,
        config: dict | None = None,
    ):
        super().__init__(context)
        self.config = config or {}

        # 配置项
        self.enable_group_learning = self.config.get("enable_group_learning", True)
        self.learning_model_id = self.config.get("learning_model_id", "")
        self.confidence_threshold = self.config.get("confidence_threshold", 0.6)

        self.keyword_extraction_mode = self.config.get(
            "keyword_extraction_mode", "local"
        )
        self.keyword_extraction_provider = self.config.get(
            "keyword_extraction_provider", ""
        )

        # 人格隔离配置
        self.enable_persona_isolation = self.config.get(
            "enable_persona_isolation", True
        )
        self.persona_isolation_exceptions = set(
            self.config.get("persona_isolation_exceptions", [])
        )

        # 记忆修剪配置
        self.max_global_nodes = self.config.get("max_global_nodes", 5000)
        self.prune_interval = self.config.get("prune_interval", 3600)

        # 初始化存储路径
        plugin_data_path = StarTools.get_data_dir()
        logger.debug(f"[GraphMemory] Plugin data path: {plugin_data_path}")

        # 初始化图数据库引擎
        self.graph_engine = GraphEngine(plugin_data_path)

        # 启动维护任务 (清理 + Lazy Update)
        self._maintenance_task = asyncio.create_task(self._maintenance_loop())

        # 初始化提取器
        self.extractor = KnowledgeExtractor(
            context=context,
            keyword_mode=self.keyword_extraction_mode,
            keyword_provider_id=self.keyword_extraction_provider,
        )

        # 初始化缓冲区管理器
        self.buffer_manager = BufferManager(
            flush_callback=self._handle_buffer_flush,
            max_size=20
            if self.enable_group_learning
            else 10,  # 群聊可能需要更大的 buffer
            max_wait_seconds=60,
        )
        logger.info(
            f"[GraphMemory] Initialized. GroupLearning:{self.enable_group_learning}, KeywordMode:{self.keyword_extraction_mode}"
        )

    async def _handle_buffer_flush(
        self, session_id: str, text: str, is_group: bool, persona_id: str
    ):
        """
        缓冲区刷新回调：处理累积的对话文本
        """
        if is_group and not self.enable_group_learning:
            logger.debug(
                f"[GraphMemory DEBUG] Skipping flush for group {session_id} (group learning disabled)"
            )
            return

        logger.info(
            f"[GraphMemory] Flushing buffer for {session_id} (Group: {is_group}, Persona: {persona_id}), length: {len(text)}"
        )
        logger.debug(f"[GraphMemory DEBUG] Flushed content preview: {text[:100]}...")

        # 确定 Provider ID
        provider_id = self.learning_model_id
        if not provider_id:
            # 尝试获取该会话当前的 provider
            # session_id 即为 unified_msg_origin
            provider_id = await self.context.get_current_chat_provider_id(session_id)

        if not provider_id:
            logger.warning(
                f"[GraphMemory] No provider available for extraction in session {session_id}"
            )
            return

        logger.debug(f"[GraphMemory DEBUG] Using provider {provider_id} for extraction")

        triplets = await self.extractor.extract(
            text, is_group=is_group, provider_id=provider_id
        )

        count = 0
        for t in triplets:
            if t.confidence < self.confidence_threshold:
                continue

            await self.graph_engine.add_triplet(
                src_name=t.src,
                relation=t.rel,
                tgt_name=t.tgt,
                session_id=session_id,
                persona_id=persona_id,
                src_type=t.src_type,
                tgt_type=t.tgt_type,
                weight=t.weight,
                confidence=t.confidence,
                source_user=t.source_user,
                src_importance=t.src_importance,
                tgt_importance=t.tgt_importance,
            )
            count += 1

        if count > 0:
            logger.info(
                f"[GraphMemory] Extracted and saved {count} triplets. (Persona: {persona_id})"
            )

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前，检索记忆并注入到 Prompt"""
        session_id = event.unified_msg_origin
        persona_id = await self._get_persona_id(event)

        # 获取当前 Provider ID (仅当 LLM 模式时需要)
        # 如果是 Local 模式，extractor 不需要 provider_id 也能工作
        provider_id = await self.context.get_current_chat_provider_id(session_id)

        # 提取关键词
        keywords = await self.extractor.extract_keywords(
            event.message_str, provider_id=provider_id
        )

        if not keywords:
            logger.debug(
                "[GraphMemory DEBUG] No keywords extracted, skipping memory injection."
            )
            return

        logger.debug(f"[GraphMemory DEBUG] Searching memory with keywords: {keywords}")

        # 2跳查询，获取更丰富的上下文
        memory_text = await self.graph_engine.search_subgraph(
            keywords, session_id, persona_id, hops=2
        )

        if memory_text:
            logger.debug(
                f"[GraphMemory DEBUG] Found relevant context ({len(memory_text)} chars). Injecting:\n{memory_text[:200]}..."
            )
            # 注入到 System Prompt
            req.system_prompt += f"\n\n[Graph Memory Context]\n{memory_text}\n(Reference these relationships if relevant.)"
        else:
            logger.debug("[GraphMemory DEBUG] No relevant context found.")

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听用户消息"""
        persona_id = await self._get_persona_id(event)
        await self.buffer_manager.add_user_message(event, persona_id)

    @filter.on_llm_response()
    async def on_llm_resp(self, event: AstrMessageEvent, resp: LLMResponse):
        """监听 LLM 响应 (替代 after_message_sent)"""
        persona_id = await self._get_persona_id(event)

        # 优先使用 completion_text
        content = resp.completion_text

        logger.debug(
            f"[GraphMemory DEBUG] on_llm_resp triggered. Content length: {len(content) if content else 0}"
        )

        if content:
            await self.buffer_manager.add_bot_message(
                event, persona_id, content=content
            )
        else:
            logger.debug(
                f"[GraphMemory DEBUG] LLM response content is empty. Raw resp type: {type(resp)}"
            )

    @filter.command("migrate_memory")
    async def cmd_migrate(self, event: AstrMessageEvent, target_session: str):
        """指令：迁移当前会话记忆"""
        old_sid = event.unified_msg_origin
        new_sid = target_session

        # 迁移整个会话（包含所有 Persona），保持原有的 Persona ID
        await self.graph_engine.migrate(
            from_context={"session_id": old_sid},
            to_context={"session_id": new_sid},
            # 注意：不指定 persona_id，migrate 内部会保留原记录的 persona_id
        )
        yield event.plain_result(f"Memory migrated from {old_sid} to {new_sid}")

    async def _maintenance_loop(self):
        """
        后台维护循环：定期清理 + 频繁 Flush Access Stats
        """
        # 分离两个间隔：prune (很久一次) 和 flush_stats (频繁)
        prune_counter = 0
        flush_interval = 60  # 每分钟回写一次访问统计

        while True:
            try:
                await asyncio.sleep(flush_interval)

                # 1. Flush Access Stats
                await self.graph_engine.flush_access_stats()

                # 2. Check Pruning
                prune_counter += flush_interval
                if prune_counter >= self.prune_interval:
                    prune_counter = 0
                    await self.graph_engine.prune_graph(
                        max_nodes=self.max_global_nodes,
                        retention_weights={
                            "recency": 0.4,
                            "frequency": 0.3,
                            "importance": 0.3,
                        },
                    )

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[GraphMemory] Maintenance loop error: {e}")

    async def terminate(self):
        """
        AstrBot 生命周期钩子：插件卸载或 Bot 停止时调用。
        用于清理数据库连接等资源。
        """
        logger.info("[GraphMemory] Terminating GraphMemoryPlugin...")

        if hasattr(self, "_maintenance_task"):
            self._maintenance_task.cancel()
            try:
                await self._maintenance_task
            except asyncio.CancelledError:
                pass

        if hasattr(self, "buffer_manager"):
            await self.buffer_manager.shutdown()

        if hasattr(self, "graph_engine"):
            # 退出前最后一次 Flush Access Stats (如果需要的话，但此时最好确保 executor 可用)
            # await self.graph_engine.flush_access_stats()
            self.graph_engine.close()

    async def _get_persona_id(self, event: AstrMessageEvent) -> str:
        """
        获取当前事件应该使用的人格 ID。
        支持细粒度配置。
        """
        umo = event.unified_msg_origin

        # 1. 检查是否开启隔离
        should_isolate = self.enable_persona_isolation

        # 2. 检查例外列表
        if umo in self.persona_isolation_exceptions:
            should_isolate = not should_isolate  # 反转

        if not should_isolate:
            return "default"

        # 3. 获取实际 Persona ID
        # 尝试从 conversation manager 获取
        try:
            cid = await self.context.conversation_manager.get_curr_conversation_id(umo)
            if cid:
                conv = await self.context.conversation_manager.get_conversation(
                    umo, cid
                )
                if conv and conv.persona_id:
                    return conv.persona_id
        except Exception:
            pass

        return "default"

    async def _resolve_persona_id_for_session(self, session_id: str) -> str:
        """
        在没有 event 的情况下解析 session_id 的 persona_id
        """
        # 逻辑同 _get_persona_id，只是入参不同
        should_isolate = self.enable_persona_isolation
        if session_id in self.persona_isolation_exceptions:
            should_isolate = not should_isolate

        if not should_isolate:
            return "default"

        try:
            # 需要先获取当前活跃的 cid
            cid = await self.context.conversation_manager.get_curr_conversation_id(
                session_id
            )
            if cid:
                conv = await self.context.conversation_manager.get_conversation(
                    session_id, cid
                )
                if conv and conv.persona_id:
                    return conv.persona_id
        except Exception:
            pass

        return "default"
