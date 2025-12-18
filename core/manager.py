"""GraphMemory 核心管理器"""

import asyncio
from pathlib import Path
from typing import Any

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent
from astrbot.api.provider import ProviderRequest
from astrbot.api.star import Context

from .handlers import CommandHandler
from .models import SessionNode
from .retrieval import KnowledgeExtractor, MemoryRetriever
from .services import EntityDisambiguation, FunctionCallingHandler
from .storage import GraphStore, MemoryBuffer


class GraphMemoryManager:
    """GraphMemory 核心管理器

    负责:
    - 核心模块的延迟初始化
    - 记忆注入
    - 缓冲区刷新处理
    - 维护循环
    """

    DEFAULT_PERSONA_ID = "default"

    def __init__(
        self,
        context: Context,
        data_path: Path,
        config: dict,
    ):
        self.context = context
        self.data_path = data_path
        self.config = config

        # 延迟初始化标志
        self._core_initialized = False
        self._init_lock = asyncio.Lock()

        # 后台任务引用
        self._maintenance_task = None

        # 核心组件（延迟初始化）
        self.embedding_provider = None
        self.graph_store = None
        self.extractor = None
        self.retriever = None
        self.buffer = None
        self.function_calling = None
        self.disambiguation = None
        self._disambiguation_task = None

    async def ensure_initialized(self):
        """确保核心模块已初始化（延迟初始化）"""
        if self._core_initialized:
            return

        async with self._init_lock:
            # 双重检查
            if self._core_initialized:
                return

            logger.info("[GraphMemory] 开始延迟初始化核心模块...")

            # Embedding Provider
            embedding_provider_id = self.config.get("embedding_provider_id", "")
            if embedding_provider_id:
                self.embedding_provider = self.context.get_provider_by_id(embedding_provider_id)
                if self.embedding_provider:
                    logger.info(f"[GraphMemory] 使用 Embedding Provider: {embedding_provider_id}")
                else:
                    logger.warning(f"[GraphMemory] 未找到 Embedding Provider: {embedding_provider_id}，将使用默认向量维度")
            else:
                logger.warning("[GraphMemory] 未配置 Embedding Provider，向量检索功能将不可用")

            # 初始化核心模块
            self.graph_store = GraphStore(self.data_path, self.embedding_provider)
            self.extractor = KnowledgeExtractor(
                self.context,
                self.config.get("llm_provider_id", ""),
                self.embedding_provider,
            )

            # 停用词路径
            stopwords_path = Path(__file__).parent.parent / "static" / "stopwords_hit.txt"

            self.retriever = MemoryRetriever(
                self.graph_store,
                self.embedding_provider,
                str(stopwords_path) if stopwords_path.exists() else None,
                vector_weight=self.config.get("vector_search_weight", 0.7),
                keyword_weight=self.config.get("keyword_search_weight", 0.3),
            )
            self.buffer = MemoryBuffer(
                self.data_path,
                self._handle_buffer_flush,
                self.config.get("buffer_size_private", 10),
                self.config.get("buffer_size_group", 20),
                self.config.get("buffer_timeout", 1800),
            )

            # Function Calling 处理器
            self.function_calling = FunctionCallingHandler(self)

            # 实体消歧器
            self.disambiguation = EntityDisambiguation(
                self.context,
                self.graph_store,
                self.embedding_provider,
                self.config.get("llm_provider_id", ""),
            )

            # 启动后台任务
            await self._startup()

            self._core_initialized = True
            logger.info("[GraphMemory] 核心模块延迟初始化完成")

    async def _startup(self):
        """启动后台任务"""
        await self.buffer.startup()
        self._maintenance_task = asyncio.create_task(self._maintenance_loop())
        logger.info("[GraphMemory] 后台任务已启动")

    async def terminate(self):
        """终止管理器"""
        logger.info("[GraphMemory] 正在终止管理器...")

        # 只有在核心模块已初始化时才执行清理
        if not self._core_initialized:
            logger.info("[GraphMemory] 核心模块未初始化，无需清理")
            return

        # 取消维护任务
        if self._maintenance_task:
            self._maintenance_task.cancel()
            try:
                await self._maintenance_task
            except asyncio.CancelledError:
                logger.debug("[GraphMemory] 维护任务已取消")

        # 关闭缓冲区和数据库
        if self.buffer:
            await self.buffer.shutdown()
        if self.graph_store:
            self.graph_store.close()
        logger.info("[GraphMemory] 管理器已终止")

    # ==================== 记忆注入 ====================

    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入记忆"""
        await self.ensure_initialized()

        session_id = event.unified_msg_origin
        persona_id = await self._get_persona_id(event)

        logger.debug(f"[GraphMemory] 为会话 {session_id} 注入记忆 (人格: {persona_id})")

        if not self.embedding_provider:
            logger.debug("[GraphMemory] 未配置 Embedding Provider，跳过记忆注入")
            return

        try:
            # 查询重写
            query = event.message_str
            if self.config.get("enable_query_rewriting", False):
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
                self.config.get("retrieval_top_k", 7),
            )

            if memory_text:
                logger.debug(f"[GraphMemory] 找到相关记忆 (长度: {len(memory_text)})")
                injection = f"\n\n{memory_text}\n"
                req.system_prompt = (req.system_prompt or "") + injection
            else:
                logger.debug("[GraphMemory] 未找到相关记忆")

        except Exception as e:
            logger.error(f"[GraphMemory] 记忆注入失败: {e}", exc_info=True)

    # ==================== 消息处理 ====================

    async def on_user_message(self, event: AstrMessageEvent):
        """处理用户消息"""
        await self.ensure_initialized()
        persona_id = await self._get_persona_id(event)
        await self.buffer.add_user_message(event, persona_id)

    async def on_bot_message(self, event: AstrMessageEvent, content: str):
        """处理机器人消息"""
        await self.ensure_initialized()
        persona_id = await self._get_persona_id(event)
        await self.buffer.add_bot_message(event, persona_id, content)

    # ==================== 统计查询 ====================

    async def get_stats(self) -> dict:
        """获取图谱统计信息"""
        await self.ensure_initialized()
        return await self.graph_store.get_stats()

    # ==================== 管理操作 ====================

    async def search_entities(
        self,
        query: str,
        entity_type: str | None = None,
        limit: int = 10,
    ) -> list:
        """搜索实体"""
        await self.ensure_initialized()
        return await self.graph_store.search_entities(query, entity_type, limit)

    async def get_entity_relations(self, entity_name: str) -> list[dict]:
        """获取实体关系"""
        await self.ensure_initialized()
        return await self.graph_store.get_entity_relations(entity_name)

    async def delete_entity(self, entity_name: str) -> tuple[bool, int]:
        """删除实体"""
        await self.ensure_initialized()
        return await self.graph_store.delete_entity(entity_name)

    async def export_graph(self, persona_id: str | None = None) -> dict:
        """导出图谱"""
        await self.ensure_initialized()
        return await self.graph_store.export_graph(persona_id)

    async def import_graph(self, data: dict, merge: bool = True) -> tuple[int, int]:
        """导入图谱"""
        await self.ensure_initialized()
        return await self.graph_store.import_graph(data, merge)

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
        enable_group_learning = self.config.get("enable_group_learning", True)
        if is_group and not enable_group_learning:
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
        prune_interval = self.config.get("prune_interval", 3600)
        time_decay_rate = self.config.get("time_decay_rate", 0.95)
        min_importance_threshold = self.config.get("min_importance_threshold", 0.1)
        disambiguation_interval = self.config.get("disambiguation_interval", 7200)
        enable_disambiguation = self.config.get("enable_entity_disambiguation", False)

        last_disambiguation_time = 0

        while True:
            try:
                await asyncio.sleep(prune_interval)

                logger.info("[GraphMemory] 开始图谱维护...")

                # 应用时间衰减
                await self.graph_store.apply_time_decay(time_decay_rate)

                # 清理低重要性实体
                count = await self.graph_store.prune_low_importance_entities(
                    min_importance_threshold
                )

                logger.info(f"[GraphMemory] 图谱维护完成，清理了 {count} 个实体")

                # 实体消歧（如果启用且到达间隔时间）
                import time
                current_time = time.time()
                if enable_disambiguation and (current_time - last_disambiguation_time) >= disambiguation_interval:
                    if self.disambiguation:
                        logger.info("[GraphMemory] 开始实体消歧...")
                        result = await self.disambiguation.run_disambiguation(
                            similarity_threshold=0.85,
                            auto_merge=False,
                        )
                        logger.info(
                            f"[GraphMemory] 实体消歧完成: 找到 {result['found']} 对相似实体，"
                            f"合并了 {result['merged']} 对"
                        )
                        last_disambiguation_time = current_time

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[GraphMemory] 维护循环失败: {e}", exc_info=True)
