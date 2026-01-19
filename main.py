"""GraphMemory 插件入口"""

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core.event_handler import EventHandler
from .core.handlers import CommandHandler
from .core.manager import GraphMemoryManager
from .core.webui_manager import WebUIManager


@register(
    "GraphMemory",
    "lxfight",
    "基于图数据库的长期记忆插件 (v0.5.0)",
    version="0.5.0",
)
class GraphMemory(Star):
    """GraphMemory 插件

    功能:
    - 自动知识提取
    - 智能记忆检索
    - 人格分层共享
    - 时间衰减机制
    - WebUI 可视化管理
    """

    def __init__(self, context: Context, config: dict | None = None):
        super().__init__(context)
        self.config = config or {}

        # 获取插件数据目录
        plugin_data_path = StarTools.get_data_dir()

        # 初始化核心管理器
        self.manager = GraphMemoryManager(context, plugin_data_path, self.config)

        # 初始化事件处理器
        self.event_handler = EventHandler(self.manager, self.config)

        # 初始化指令处理器
        self.cmd_handler = CommandHandler(self.manager, plugin_data_path)

        # 初始化 WebUI 管理器
        self.webui_manager = WebUIManager(self.manager, self.config)

        logger.info("[GraphMemory] 插件构造完成")

    async def initialize(self):
        """插件初始化"""
        logger.info("[GraphMemory] initialize() 被调用，核心模块将延迟初始化")
        await self.webui_manager.start()

    async def terminate(self):
        """插件终止"""
        await self.webui_manager.stop()
        await self.manager.terminate()

    # ==================== 事件处理 ====================

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入记忆"""
        await self.event_handler.on_llm_request(event, req)

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听用户消息"""
        await self.event_handler.on_user_message(event)

    @filter.on_llm_response()
    async def on_llm_resp(self, event: AstrMessageEvent, resp: LLMResponse):
        """监听 LLM 响应"""
        await self.event_handler.on_llm_response(event, resp)

    # ==================== 指令处理 ====================

    @filter.command("memory_stat")
    async def cmd_stat(self, event: AstrMessageEvent):
        """显示图谱统计信息"""
        result = await self.cmd_handler.handle_stat(event)
        yield result

    @filter.command("memory_search")
    async def cmd_search(self, event: AstrMessageEvent):
        """搜索记忆"""
        result = await self.cmd_handler.handle_search(event)
        yield result

    @filter.command("memory_forget")
    async def cmd_forget(self, event: AstrMessageEvent):
        """删除记忆"""
        result = await self.cmd_handler.handle_forget(event)
        yield result

    @filter.command("memory_export")
    async def cmd_export(self, event: AstrMessageEvent):
        """导出记忆"""
        result = await self.cmd_handler.handle_export(event)
        yield result

    @filter.command("memory_import")
    async def cmd_import(self, event: AstrMessageEvent):
        """导入记忆"""
        result = await self.cmd_handler.handle_import(event)
        yield result

    @filter.command("memory_disambiguate")
    async def cmd_disambiguate(self, event: AstrMessageEvent):
        """实体消歧"""
        result = await self.cmd_handler.handle_disambiguate(event)
        yield result
