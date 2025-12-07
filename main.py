import asyncio
import logging
import platform

from astrbot.api import logger

# 在 Windows 上，默认的 ProactorEventLoop 可能会在 uvicorn 关闭时引发 `AssertionError`。
# 切换到 SelectorEventLoop 可以解决这个问题，因为它在处理管道关闭方面更稳定。
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core.command_handler import CommandHandler
from .core.monitoring_service import monitoring_service
from .core.plugin_service import PluginService
from .core.web_server import WebServer


class MonitoringLogHandler(logging.Handler):
    """一个将日志记录发送到 MonitoringService 的处理器，支持跨线程调用。"""

    def __init__(self):
        super().__init__()
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            self.loop = None

    def emit(self, record: logging.LogRecord):
        if "WebSocket" in record.getMessage():
            return

        coro = monitoring_service.add_log(record.levelname, record.getMessage())

        if self.loop and self.loop.is_running():
            # 如果我们能获取到正在运行的循环，就用线程安全的方式提交任务
            asyncio.run_coroutine_threadsafe(coro, self.loop)
        else:
            # 作为后备，如果无法获取循环（例如在非异步上下文中），尝试直接运行
            # 这在某些情况下可能不理想，但比直接崩溃要好
            try:
                asyncio.run(coro)
            except RuntimeError:
                # 如果已经有循环在运行但我们没获取到，这可能会失败
                # 在这种情况下，我们无能为力，只能放弃记录这条日志
                pass


@register(
    "GraphMemory",
    "lxfight",
    "一个基于图的 AstrBot 记忆插件。",
    version="0.2.0",
)
class GraphMemory(Star):
    """
    GraphMemory 是一个为 AstrBot 设计的长期记忆插件。
    它将对话历史结构化并存储在图数据库中，从而实现更智能、更有上下文的对话。
    """

    def __init__(self, context: Context, config: dict | None = None):
        """初始化 GraphMemory 插件。"""
        super().__init__(context)
        self.config = config or {}

        # 初始化核心服务
        plugin_data_path = StarTools.get_data_dir()
        self.service = PluginService(context, self.config, plugin_data_path)
        self.handler = CommandHandler(self.service)

        # 启动 Web 可视化服务器
        self.web_server = WebServer(self.service.graph_engine, self.config)
        try:
            self.web_server.start()
        except Exception as e:
            logger.error(f"[GraphMemory] 启动 WebUI 失败: {e}")

        # 设置监控日志处理器
        self.log_handler = MonitoringLogHandler()
        # 直接将处理器添加到 astrbot 的根 logger，以捕获所有相关日志
        logger.addHandler(self.log_handler)

        # 启动后台服务
        asyncio.create_task(self.service.start())
        logger.info("[GraphMemory] 初始化完成。")

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入相关记忆。"""
        await self.service.inject_memory(event, req)

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听所有用户消息，并将其添加到缓冲区。"""
        await self.service.process_user_message(event)

    @filter.on_llm_response()
    async def on_llm_resp(self, event: AstrMessageEvent, resp: LLMResponse):
        """监听 LLM 的回复，并将其添加到缓冲区。"""
        await self.service.process_bot_message(event, resp)

    @filter.command("memory_stat")
    async def cmd_stat(self, event: AstrMessageEvent):
        """指令：显示当前图谱统计信息"""
        async for result in self.handler.handle_stat(event):
            yield result

    @filter.command("memory_link_session")
    async def cmd_link_session(self, event: AstrMessageEvent, target_session_id: str):
        """指令：将当前会话的记忆（摘要）关联到目标会话"""
        async for result in self.handler.handle_link_session(event, target_session_id):
            yield result

    @filter.command("memory_forget")
    async def cmd_forget(self, event: AstrMessageEvent, *, entity_name: str):
        """指令：忘记关于某个实体的一切"""
        async for result in self.handler.handle_forget(event, entity_name=entity_name):
            yield result

    @filter.command("memory_dump")
    async def cmd_dump(self, event: AstrMessageEvent):
        """指令：导出当前会话的图数据 (JSON)"""
        async for result in self.handler.handle_dump(event):
            yield result

    @filter.command("memory_migrate_v2")
    async def cmd_migrate_v2(self, event: AstrMessageEvent):
        """指令：将旧版记忆数据迁移到新版数据库"""
        async for result in self.handler.handle_migrate_v2(event):
            yield result

    async def terminate(self):
        """插件终止时调用的清理方法。"""
        logger.info("[GraphMemory] 正在终止 GraphMemory 插件...")

        # 移除日志处理器
        logger.removeHandler(self.log_handler)

        await self.service.shutdown()
        if self.web_server:
            self.web_server.stop()
