"""
该模块定义了 `PluginService` 类，它封装了 GraphMemory 插件的核心业务逻辑。
"""

import asyncio
import json
from pathlib import Path
from typing import Any

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context

from .buffer_manager import BufferManager
from .extractor import KnowledgeExtractor
from .graph_engine import JIEBA_AVAILABLE, GraphEngine
from .monitoring_service import monitoring_service
from .reflection_engine import ReflectionEngine
from .web_server import WebServer


class PluginService:
    """
    封装插件的核心业务逻辑，包括组件初始化、记忆注入和后台维护。
    """

    DEFAULT_PERSONA_ID = "default"

    def _handle_task_exception(self, task: asyncio.Task):
        """处理异步任务中的异常"""
        try:
            task.result()
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"[GraphMemory] 后台任务异常: {e}", exc_info=True)

    def _create_monitored_task(self, coro) -> asyncio.Task:
        """创建一个带错误日志的异步任务"""
        task = asyncio.create_task(coro)
        task.add_done_callback(self._handle_task_exception)
        return task

    def __init__(self, context: Context, config: dict, plugin_data_path: Path):
        self.context = context
        self.config = config or {}
        self.plugin_data_path = plugin_data_path
        self._maintenance_task = None

        # --- 配置加载 ---
        # 是否启用群聊学习，开启后机器人将从群聊消息中提取知识
        self.enable_group_learning = self.config.get("enable_group_learning", True)
        # 知识提取使用的 LLM Provider ID，留空则使用当前会话的默认模型
        self.learning_model_id = self.config.get("learning_model_id")
        # Embedding Provider ID，用于向量检索，是 GraphRAG 的核心组件
        self.embedding_provider_id = self.config.get("embedding_provider_id")
        # 记忆摘要使用的 LLM Provider ID，留空则使用 learning_model_id
        self.summarization_provider_id = self.config.get("summarization_provider_id")
        # 是否启用人格记忆隔离，开启后不同人格拥有独立的记忆空间
        self.enable_persona_isolation = self.config.get(
            "enable_persona_isolation", True
        )
        # 人格隔离的例外列表，列表中的会话将反转隔离规则
        self.persona_isolation_exceptions = set(
            self.config.get("persona_isolation_exceptions", [])
        )
        # 全局最大节点数限制，超过时触发图修剪
        self.max_global_nodes = self.config.get("max_global_nodes", 10000)
        # 图修剪检查间隔（秒）
        self.prune_interval = self.config.get("prune_interval", 3600)
        # 原始消息最大保留天数，超过此天数的消息将在修剪时被删除
        self.pruning_message_max_days = self.config.get("pruning_message_max_days", 90)
        # 记忆巩固阈值，当会话中未摘要的消息数超过此值时触发巩固
        self.consolidation_threshold = self.config.get("consolidation_threshold", 50)
        # 是否启用查询重写，使用 LLM 将用户问题重写为独立查询以提升检索准确性
        self.enable_query_rewriting = self.config.get("enable_query_rewriting", True)
        # 向量搜索时每类节点（实体/消息/摘要）的召回数量
        self.recall_vector_top_k = self.config.get("recall_vector_top_k", 5)
        # 关键词搜索召回的实体数量
        self.recall_keyword_top_k = self.config.get("recall_keyword_top_k", 3)
        # 最终注入 Prompt 的上下文项目总数
        self.recall_max_items = self.config.get("recall_max_items", 7)
        # 是否启用 Agentic 反思，开启后后台自动进行事实修正和关系推断
        self.enable_reflection = self.config.get("enable_reflection", False)
        # 反思周期间隔（秒）
        self.reflection_interval = self.config.get("reflection_interval", 7200)
        # 缓冲区配置
        self.buffer_max_messages_private = self.config.get("buffer_max_messages_private", 10)
        self.buffer_max_messages_group = self.config.get("buffer_max_messages_group", 20)
        self.buffer_max_wait_seconds = self.config.get("buffer_max_wait_seconds", 60)

        logger.debug(f"[GraphMemory] 插件数据路径: {plugin_data_path}")

        # --- 核心组件初始化 (延迟到 start 方法) ---
        self.embedding_provider: Any = None
        self.graph_engine: GraphEngine | None = None
        self.extractor: KnowledgeExtractor | None = None
        self.web_server: WebServer | None = None

        self.buffer_manager = BufferManager(
            flush_callback=self._handle_buffer_flush,
            data_path=plugin_data_path,
            max_size_private=self.buffer_max_messages_private,
            max_size_group=self.buffer_max_messages_group,
            max_wait_seconds=self.buffer_max_wait_seconds,
        )
        self.reflection_engine = ReflectionEngine(self)

        if not JIEBA_AVAILABLE:
            logger.warning(
                "[GraphMemory] 未找到 'jieba' 库，关键词搜索功能将受限。为了在非英语语言上获得更好的性能，请运行 'pip install jieba'。"
            )

    async def start(self):
        """启动服务和后台任务。"""
        # 1. 获取 embedding provider
        if self.embedding_provider_id:
            try:
                provider = self.context.get_provider_by_id(self.embedding_provider_id)
                if provider:
                    self.embedding_provider = provider
                    logger.info(
                        f"[GraphMemory] 成功获取 embedding provider: '{self.embedding_provider_id}'"
                    )
                else:
                    logger.error(
                        f"[GraphMemory] 未找到 ID 为 '{self.embedding_provider_id}' 的 embedding provider。"
                    )
            except Exception as e:
                logger.error(
                    f"[GraphMemory] 获取 embedding provider '{self.embedding_provider_id}' 失败: {e}",
                    exc_info=True,
                )
        else:
            logger.warning(
                "[GraphMemory] 未配置 embedding_provider_id，向量相关功能将不可用。"
            )

        # 2. 初始化 GraphEngine
        self.graph_engine = GraphEngine(self.plugin_data_path, self.embedding_provider)

        # 3. 初始化 Extractor
        self.extractor = KnowledgeExtractor(
            context=self.context,
            llm_provider_id=self.learning_model_id,
            embedding_provider=self.embedding_provider,
        )

        # 4. 初始化并启动 WebServer
        self.web_server = WebServer(self.graph_engine, self.config)
        try:
            self.web_server.start()
            logger.info("[GraphMemory] WebUI 已启动。")
        except Exception as e:
            logger.error(f"[GraphMemory] 启动 WebUI 失败: {e}")

        # 5. 启动后台任务
        await self.buffer_manager.startup()
        self._maintenance_task = asyncio.create_task(self._maintenance_loop())
        if self.enable_reflection:
            await self.reflection_engine.start(self.reflection_interval)
        logger.info(
            f"[GraphMemory] PluginService 已启动。群聊学习状态: {self.enable_group_learning}"
        )

    async def shutdown(self):
        """停止服务和后台任务。"""
        if self._maintenance_task:
            self._maintenance_task.cancel()
            try:
                await self._maintenance_task
            except asyncio.CancelledError:
                pass
        await self.buffer_manager.shutdown()
        await self.reflection_engine.stop()
        if self.web_server:
            self.web_server.stop()
        if self.graph_engine:
            self.graph_engine.close()

    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入相关记忆。"""
        if not self.graph_engine or not self.extractor or not self.embedding_provider:
            logger.debug("[GraphMemory] 核心组件未初始化，跳过记忆注入。")
            return

        self._create_monitored_task(
            monitoring_service.add_task(
                f"正在为会话 {event.unified_msg_origin} 注入记忆..."
            )
        )
        session_id = event.unified_msg_origin

        try:
            query_to_embed = event.message_str
            if self.enable_query_rewriting:
                history = await self._get_recent_history(session_id, limit=5)
                rewritten_query = await self.extractor.rewrite_query(
                    event.message_str, history
                )
                if rewritten_query:
                    query_to_embed = rewritten_query
                    logger.debug(
                        f"[GraphMemory] 重写查询: '{event.message_str}' -> '{rewritten_query}'"
                    )

            if not query_to_embed:
                return

            query_embedding = await self.embedding_provider.embed(query_to_embed)
            memory_text = await self.graph_engine.search(
                query=query_to_embed,
                query_embedding=query_embedding,
                session_id=session_id,
                vector_top_k=self.recall_vector_top_k,
                keyword_top_k=self.recall_keyword_top_k,
                max_items=self.recall_max_items,
            )

            if memory_text:
                logger.debug(
                    f"[GraphMemory] 发现相关上下文 (长度: {len(memory_text)}). 正在注入..."
                )
                injection = (
                    f"\n\n[图记忆上下文]\n{memory_text}\n(如果相关，请参考这些关系。)"
                )
                req.system_prompt = (req.system_prompt or "") + injection
            else:
                logger.debug("[GraphMemory] 图搜索未发现相关上下文。")
        except Exception as e:
            logger.error(f"[GraphMemory] 记忆注入过程中发生错误: {e}", exc_info=True)

    async def process_user_message(self, event: AstrMessageEvent):
        """处理用户消息，将其添加到缓冲区。"""
        persona_id = await self._get_persona_id(event)
        # 将消息发送到监控服务
        self._create_monitored_task(
            monitoring_service.add_message(
                sender=event.get_sender_name(), text=event.get_message_outline()
            )
        )
        await self.buffer_manager.add_user_message(event, persona_id)

    async def process_bot_message(self, event: AstrMessageEvent, resp: LLMResponse):
        """处理机器人消息，将其添加到缓冲区。"""
        persona_id = await self._get_persona_id(event)
        if resp.completion_text:
            # 将消息发送到监控服务
            self._create_monitored_task(
                monitoring_service.add_message(sender="Bot", text=resp.completion_text)
            )
            await self.buffer_manager.add_bot_message(
                event, persona_id, content=resp.completion_text
            )

    async def _handle_buffer_flush(
        self, session_id: str, text: str, is_group: bool, persona_id: str
    ):
        """处理缓冲区刷新事件，提取知识并存入图数据库。"""
        if is_group and not self.enable_group_learning:
            return

        if not self.graph_engine or not self.extractor:
            logger.warning("[GraphMemory] 核心组件未初始化，无法处理缓冲区刷新。")
            return

        task_description = f"正在刷新会话 {session_id} (人格: {persona_id}) 的缓冲区, 文本长度: {len(text)}"
        logger.info(f"[GraphMemory] {task_description}")
        self._create_monitored_task(monitoring_service.add_task(task_description))
        extracted_data = await self.extractor.extract(
            text_block=text, session_id=session_id
        )
        if not extracted_data:
            logger.debug("[GraphMemory] 未从缓冲区提取到结构化数据。")
            return

        tasks = [self.graph_engine.add_user(user) for user in extracted_data.users]
        tasks.extend(
            [
                self.graph_engine.add_session(session)
                for session in extracted_data.sessions
            ]
        )
        tasks.extend(
            [self.graph_engine.add_entity(entity) for entity in extracted_data.entities]
        )
        await asyncio.gather(*tasks)

        tasks = [
            self.graph_engine.add_message(message)
            for message in extracted_data.messages
        ]
        await asyncio.gather(*tasks)

        tasks = [
            self.graph_engine.add_relation(rel) for rel in extracted_data.relations
        ]
        tasks.extend(
            [
                self.graph_engine.add_mention(mention)
                for mention in extracted_data.mentions
            ]
        )
        await asyncio.gather(*tasks)

        logger.info(f"[GraphMemory] 已为会话 {session_id} 注入结构化数据。")

    async def _maintenance_loop(self):
        """后台维护循环，定期执行图修剪和记忆巩固。"""
        prune_counter = 0
        summarize_counter = 0
        check_interval = 60

        while True:
            try:
                await asyncio.sleep(check_interval)

                if not self.graph_engine:
                    continue

                summarize_interval = self.config.get("summarize_interval", 1800)
                summarize_counter += check_interval
                if summarize_counter >= summarize_interval:
                    summarize_counter = 0
                    await self._run_consolidation_cycle()

                prune_counter += check_interval
                if prune_counter >= self.prune_interval:
                    prune_counter = 0
                    await self.graph_engine.prune_graph(
                        max_nodes=self.max_global_nodes,
                        message_max_days=self.pruning_message_max_days,
                    )
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[GraphMemory] 维护循环出错: {e}")

    async def _run_consolidation_cycle(self):
        """执行一轮记忆巩固。"""
        if not self.graph_engine or not self.extractor:
            return

        logger.debug("[GraphMemory] 正在运行记忆巩固周期...")
        try:
            sessions_to_process = (
                await self.graph_engine.find_sessions_for_consolidation(
                    self.consolidation_threshold
                )
            )
            if not sessions_to_process:
                logger.debug("[GraphMemory] 没有需要巩固的会话。")
                return

            logger.info(
                f"[GraphMemory] 发现 {len(sessions_to_process)} 个会话需要进行记忆巩固。"
            )
            for session_id in sessions_to_process:
                try:
                    consolidation_result = (
                        self.graph_engine.get_messages_for_consolidation(session_id)
                    )
                    if not consolidation_result:
                        continue

                    message_ids, text_block, user_ids = consolidation_result
                    if not text_block:
                        continue

                    summary = await self.extractor.summarize(
                        text_block, provider_id=self.summarization_provider_id
                    )
                    if summary:
                        await self.graph_engine.consolidate_memory(
                            session_id, summary, message_ids, user_ids
                        )
                except Exception as e:
                    logger.error(
                        f"为会话 {session_id} 进行巩固时出错: {e}", exc_info=True
                    )
        except Exception as e:
            logger.error(f"查找需要巩固的会话失败: {e}", exc_info=True)

    async def _get_persona_id(self, event: AstrMessageEvent) -> str:
        """根据事件和配置确定当前应使用的 Persona ID。"""
        umo = event.unified_msg_origin
        should_isolate = self.enable_persona_isolation

        if umo in self.persona_isolation_exceptions:
            should_isolate = not should_isolate

        if not should_isolate:
            return self.DEFAULT_PERSONA_ID

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

        return self.DEFAULT_PERSONA_ID

    async def _get_recent_history(self, session_id: str, limit: int = 10) -> str:
        """获取最近的对话历史用于查询重写。"""
        try:
            conv_mgr = self.context.conversation_manager
            cid = await conv_mgr.get_curr_conversation_id(session_id)
            if not cid:
                return ""

            conversation = await conv_mgr.get_conversation(session_id, cid)
            if not conversation or not conversation.history:
                return ""

            history_str = conversation.history
            num_messages_to_find = limit * 2
            search_str = '"role"'
            idx = -1
            for _ in range(num_messages_to_find):
                idx = history_str.rfind(search_str, 0, idx)
                if idx == -1:
                    break

            if idx != -1:
                start_brace_idx = history_str.rfind("{", 0, idx)
                if start_brace_idx != -1:
                    partial_history_str = "[" + history_str[start_brace_idx:-1]
                    try:
                        history_list = json.loads(partial_history_str)
                    except json.JSONDecodeError:
                        history_list = json.loads(history_str[-50000:])
                else:
                    history_list = json.loads(history_str)[-(limit * 2) :]
            else:
                history_list = json.loads(history_str)

            formatted_lines = []
            for msg in history_list:
                role = msg.get("role", "unknown")
                content_text = ""
                if isinstance(msg.get("content"), list):
                    for part in msg["content"]:
                        if part.get("type") == "text":
                            content_text += part.get("text", "")
                elif isinstance(msg.get("content"), str):
                    content_text = msg.get("content")

                if content_text:
                    formatted_lines.append(f"{role}: {content_text}")

            return "\n".join(formatted_lines)
        except Exception as e:
            logger.error(
                f"[GraphMemory] 获取会话 {session_id} 的最近历史失败: {e}",
                exc_info=True,
            )
            return ""
