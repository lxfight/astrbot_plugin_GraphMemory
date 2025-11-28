from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core import GraphEngine
from .core.buffer_manager import BufferManager


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

        # 初始化存储路径
        plugin_data_path = StarTools.get_data_dir()
        logger.debug(f"[GraphMemory] Plugin data path: {plugin_data_path}")

        # 初始化图数据库引擎
        self.graph_engine = GraphEngine(plugin_data_path)

        # 初始化缓冲区管理器
        self.buffer_manager = BufferManager(
            flush_callback=self._handle_buffer_flush,
            max_size=10,
            max_wait_seconds=60
        )

    async def _handle_buffer_flush(self, session_id: str, text: str):
        """
        缓冲区刷新回调：处理累积的对话文本
        """
        logger.info(f"[GraphMemory] Flushing buffer for {session_id}, length: {len(text)}")
        # TODO: 调用 LLM 提取三元组
        # triples = await self.llm_extract(text)
        # for src, rel, tgt in triples:
        #     self.graph_engine.add_triplet(src, rel, tgt, session_id)
        pass

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前，检索记忆并注入到 Prompt"""
        session_id = event.unified_msg_origin
        persona_id = await self._get_persona_id(event)

        # 简单的关键词提取（按空格分割前5个词）
        # 实际生产中建议使用 LLM 或 NLP 库提取实体
        keywords = event.message_str.split()[:5]

        # 2跳查询，获取更丰富的上下文
        memory_text = self.graph_engine.search_subgraph(keywords, session_id, persona_id, hops=2)

        if memory_text:
            # 注入到 System Prompt
            req.system_prompt += f"\n\n[Graph Memory Context]\n{memory_text}\n(Reference these relationships if relevant.)"

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听用户消息"""
        await self.buffer_manager.add_user_message(event)

    @filter.after_message_sent()
    async def save_memory(self, event: AstrMessageEvent):
        """监听 Bot 发送的消息"""
        await self.buffer_manager.add_bot_message(event)

    @filter.command("migrate_memory")
    async def cmd_migrate(self, event: AstrMessageEvent, target_session: str):
        """指令：迁移当前会话记忆"""
        old_sid = event.unified_msg_origin
        new_sid = target_session

        self.graph_engine.migrate(
            from_context={"session_id": old_sid},
            to_context={"session_id": new_sid}
        )
        yield event.plain_result(f"Memory migrated from {old_sid} to {new_sid}")

    async def terminate(self):
        """
        AstrBot 生命周期钩子：插件卸载或 Bot 停止时调用。
        用于清理数据库连接等资源。
        """
        logger.info("[GraphMemory] Terminating GraphMemoryPlugin...")

        if hasattr(self, "buffer_manager"):
            await self.buffer_manager.shutdown()

        if hasattr(self, "graph_engine"):
            self.graph_engine.close()

    async def _get_persona_id(self, event):
        # 简单的获取逻辑，根据实际情况修改
        return "default_persona"
