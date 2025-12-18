"""GraphMemory 插件入口"""

import asyncio
import platform

from astrbot.api import logger

if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core.memory_buffer import MemoryBuffer
from .core.knowledge_extractor import KnowledgeExtractor
from .core.graph_store import GraphStore
from .core.memory_retriever import MemoryRetriever
from .core.entities import UserNode, SessionNode


@register(
    "GraphMemory",
    "lxfight",
    "基于图数据库的长期记忆插件 (v0.3.0)",
    version="0.3.0",
)
class GraphMemory(Star):
    """GraphMemory 插件

    功能:
    - 自动知识提取
    - 智能记忆检索
    - 人格分层共享
    - 时间衰减机制
    """

    DEFAULT_PERSONA_ID = "default"

    def __init__(self, context: Context, config: dict | None = None):
        super().__init__(context)
        self.config = config or {}

        # 加载配置
        self._load_config()

        # 初始化核心组件
        plugin_data_path = StarTools.get_data_dir()

        # Embedding Provider
        self.embedding_provider = None
        if self.embedding_provider_id:
            self.embedding_provider = context.get_provider_by_id(self.embedding_provider_id)
            if self.embedding_provider:
                logger.info(f"[GraphMemory] 使用 Embedding Provider: {self.embedding_provider_id}")
            else:
                logger.error(f"[GraphMemory] 未找到 Embedding Provider: {self.embedding_provider_id}")
        else:
            logger.warning("[GraphMemory] 未配置 Embedding Provider，向量检索功能将不可用")

        # 初始化核心模块
        self.graph_store = GraphStore(plugin_data_path, self.embedding_provider)
        self.extractor = KnowledgeExtractor(
            context,
            self.llm_provider_id,
            self.embedding_provider,
        )
        self.retriever = MemoryRetriever(self.graph_store, self.embedding_provider)
        self.buffer = MemoryBuffer(
            plugin_data_path,
            self._handle_buffer_flush,
            self.buffer_size_private,
            self.buffer_size_group,
            self.buffer_timeout,
        )

        # 启动后台任务
        asyncio.create_task(self._startup())

        logger.info("[GraphMemory] 插件初始化完成")

    def _load_config(self):
        """加载配置"""
        self.embedding_provider_id = self.config.get("embedding_provider_id", "")
        self.llm_provider_id = self.config.get("llm_provider_id", "")
        self.enable_group_learning = self.config.get("enable_group_learning", True)
        self.buffer_size_private = self.config.get("buffer_size_private", 10)
        self.buffer_size_group = self.config.get("buffer_size_group", 20)
        self.buffer_timeout = self.config.get("buffer_timeout", 180)
        self.enable_query_rewriting = self.config.get("enable_query_rewriting", True)
        self.retrieval_top_k = self.config.get("retrieval_top_k", 7)
        self.enable_function_calling = self.config.get("enable_function_calling", False)
        self.prune_interval = self.config.get("prune_interval", 3600)
        self.time_decay_rate = self.config.get("time_decay_rate", 0.95)
        self.min_importance_threshold = self.config.get("min_importance_threshold", 0.1)

    async def _startup(self):
        """启动后台任务"""
        await self.buffer.startup()
        asyncio.create_task(self._maintenance_loop())
        logger.info("[GraphMemory] 后台任务已启动")

    async def terminate(self):
        """插件终止"""
        logger.info("[GraphMemory] 正在终止插件...")
        await self.buffer.shutdown()
        self.graph_store.close()
        logger.info("[GraphMemory] 插件已终止")

    # ==================== 事件处理 ====================

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入记忆"""
        session_id = event.unified_msg_origin
        persona_id = await self._get_persona_id(event)

        logger.debug(f"[GraphMemory] 为会话 {session_id} 注入记忆 (人格: {persona_id})")

        if not self.embedding_provider:
            logger.debug("[GraphMemory] 未配置 Embedding Provider，跳过记忆注入")
            return

        try:
            # 查询重写
            query = event.message_str
            if self.enable_query_rewriting:
                history = await self._get_recent_history(session_id, limit=5)
                rewritten = await self.extractor.rewrite_query(query, history, session_id)
                if rewritten:
                    query = rewritten
                    logger.debug(f"[GraphMemory] 查询重写: '{event.message_str}' -> '{query}'")

            # 生成查询向量
            query_embedding = await self.embedding_provider.get_embedding(query)

            # 检索记忆
            memory_text = await self.retriever.search_memory(
                query,
                query_embedding,
                session_id,
                persona_id,
                self.retrieval_top_k,
            )

            if memory_text:
                logger.debug(f"[GraphMemory] 找到相关记忆 (长度: {len(memory_text)})")
                injection = f"\n\n{memory_text}\n"
                req.system_prompt = (req.system_prompt or "") + injection
            else:
                logger.debug("[GraphMemory] 未找到相关记忆")

        except Exception as e:
            logger.error(f"[GraphMemory] 记忆注入失败: {e}", exc_info=True)

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听用户消息"""
        persona_id = await self._get_persona_id(event)
        await self.buffer.add_user_message(event, persona_id)

    @filter.on_llm_response()
    async def on_llm_resp(self, event: AstrMessageEvent, resp: LLMResponse):
        """监听 LLM 响应"""
        persona_id = await self._get_persona_id(event)
        if resp.completion_text:
            await self.buffer.add_bot_message(event, persona_id, resp.completion_text)

    # ==================== 指令处理 ====================

    @filter.command("memory_stat")
    async def cmd_stat(self, event: AstrMessageEvent):
        """显示图谱统计信息"""
        try:
            stats = await self.graph_store.get_stats()
            text = f"""图谱统计信息:
- 用户数: {stats.get('users', 0)}
- 会话数: {stats.get('sessions', 0)}
- 实体数: {stats.get('entities', 0)}
- 关系数: {stats.get('relations', 0)}
"""
            yield text
        except Exception as e:
            logger.error(f"[GraphMemory] 获取统计信息失败: {e}", exc_info=True)
            yield f"获取统计信息失败: {e}"

    # ==================== 内部方法 ====================

    async def _handle_buffer_flush(
        self,
        session_id: str,
        session_name: str,
        text: str,
        is_group: bool,
        persona_id: str,
    ):
        """处理缓冲区刷新"""
        if is_group and not self.enable_group_learning:
            logger.debug(f"[GraphMemory] 群聊学习已禁用，跳过会话 {session_id}")
            return

        logger.info(f"[GraphMemory] 处理会话 {session_id} ({session_name}) 的缓冲区刷新")

        try:
            # 提取知识
            knowledge = await self.extractor.extract(text, session_id)
            if not knowledge:
                logger.warning(f"[GraphMemory] 会话 {session_id} 未提取到知识")
                return

            # 确保 Session 节点存在
            session_node = SessionNode(
                id=session_id,
                name=session_name,
                type="GROUP" if is_group else "PRIVATE",
                persona_id=persona_id,
            )
            await self.graph_store.add_session(session_node)

            # 添加实体
            for entity in knowledge.entities:
                await self.graph_store.add_entity(entity)
                # 关联到会话
                await self.graph_store.link_entity_to_session(entity.name, session_id)

            # 添加关系
            for relation in knowledge.relations:
                await self.graph_store.add_relation(relation)

            logger.info(
                f"[GraphMemory] 会话 {session_id} 知识提取完成: "
                f"{len(knowledge.entities)} 个实体, {len(knowledge.relations)} 条关系"
            )

        except Exception as e:
            logger.error(f"[GraphMemory] 缓冲区刷新处理失败: {e}", exc_info=True)

    async def _get_persona_id(self, event: AstrMessageEvent) -> str:
        """获取当前人格ID"""
        try:
            session_id = event.unified_msg_origin
            cid = await self.context.conversation_manager.get_curr_conversation_id(session_id)
            if not cid:
                return self.DEFAULT_PERSONA_ID

            conversation = await self.context.conversation_manager.get_conversation(session_id, cid)
            if not conversation or not conversation.persona_id:
                return self.DEFAULT_PERSONA_ID

            return conversation.persona_id
        except Exception as e:
            logger.warning(f"[GraphMemory] 获取人格ID失败: {e}")
            return self.DEFAULT_PERSONA_ID

    async def _get_recent_history(self, session_id: str, limit: int = 10) -> str:
        """获取最近对话历史"""
        try:
            conv_mgr = self.context.conversation_manager
            cid = await conv_mgr.get_curr_conversation_id(session_id)
            if not cid:
                return ""

            conversation = await conv_mgr.get_conversation(session_id, cid)
            if not conversation or not conversation.history:
                return ""

            import json
            history_list = json.loads(conversation.history)

            # 取最近的消息
            recent = history_list[-limit * 2:] if len(history_list) > limit * 2 else history_list

            lines = []
            for msg in recent:
                role = msg.get("role", "unknown")
                content = msg.get("content", "")
                if isinstance(content, list):
                    content = " ".join([p.get("text", "") for p in content if p.get("type") == "text"])
                if content:
                    lines.append(f"{role}: {content}")

            return "\n".join(lines)
        except Exception as e:
            logger.error(f"[GraphMemory] 获取对话历史失败: {e}", exc_info=True)
            return ""

    async def _maintenance_loop(self):
        """维护循环"""
        while True:
            try:
                await asyncio.sleep(self.prune_interval)

                logger.info("[GraphMemory] 开始图谱维护...")

                # 应用时间衰减
                await self.graph_store.apply_time_decay(self.time_decay_rate)

                # 清理低重要性实体
                count = await self.graph_store.prune_low_importance_entities(
                    self.min_importance_threshold
                )

                logger.info(f"[GraphMemory] 图谱维护完成，清理了 {count} 个实体")

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[GraphMemory] 维护循环失败: {e}", exc_info=True)
