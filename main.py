"""GraphMemory 插件入口"""

import asyncio
import platform

from astrbot.api import logger

if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy()) # type: ignore

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.provider import LLMResponse, ProviderRequest
from astrbot.api.star import Context, Star, StarTools, register

from .core.handlers import CommandHandler
from .core.manager import GraphMemoryManager


@register(
    "GraphMemory",
    "lxfight",
    "基于图数据库的长期记忆插件 (v0.4.0)",
    version="0.4.0",
)
class GraphMemory(Star):
    """GraphMemory 插件

    功能:
    - 自动知识提取
    - 智能记忆检索
    - 人格分层共享
    - 时间衰减机制
    """

    def __init__(self, context: Context, config: dict | None = None):
        super().__init__(context)
        self.config = config or {}

        # 获取插件数据目录（必须在 main.py 中调用）
        plugin_data_path = StarTools.get_data_dir()

        # 初始化核心管理器
        self.manager = GraphMemoryManager(context, plugin_data_path, self.config)

        # 初始化指令处理器
        self.cmd_handler = CommandHandler(self.manager, plugin_data_path)

        logger.info("[GraphMemory] 插件构造完成")

    async def initialize(self):
        """插件初始化（在 Provider 加载后调用）"""
        logger.info("[GraphMemory] initialize() 被调用，核心模块将延迟初始化")

    async def terminate(self):
        """插件终止"""
        await self.manager.terminate()

    # ==================== 事件处理 ====================

    @filter.on_llm_request()
    async def inject_memory(self, event: AstrMessageEvent, req: ProviderRequest):
        """在 LLM 请求前注入记忆"""
        await self.manager.inject_memory(event, req)

        # 如果启用了 Function Calling，注册工具
        if self.config.get("enable_function_calling", False):
            await self.manager.ensure_initialized()
            if self.manager.function_calling:
                tool_schema = self.manager.function_calling.get_tool_schema()
                if not hasattr(req, "tools"):
                    req.tools = []
                req.tools.append(tool_schema)
                logger.debug("[GraphMemory] 已注册 Function Calling 工具")

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def on_user_message(self, event: AstrMessageEvent):
        """监听用户消息"""
        await self.manager.on_user_message(event)

    @filter.on_llm_response()
    async def on_llm_resp(self, event: AstrMessageEvent, resp: LLMResponse):
        """监听 LLM 响应"""
        # 处理 Function Calling
        if self.config.get("enable_function_calling", False) and hasattr(resp, "tool_calls"):
            if resp.tool_calls:
                await self.manager.ensure_initialized()
                session_id = event.unified_msg_origin
                persona_id = await self.manager._get_persona_id(event)

                for tool_call in resp.tool_calls:
                    tool_name = tool_call.get("name", "")
                    tool_args = tool_call.get("arguments", {})

                    if tool_name == "search_memory":
                        result = await self.manager.function_calling.handle_tool_call(
                            tool_name, tool_args, session_id, persona_id
                        )
                        # 将结果添加到响应中
                        if not hasattr(resp, "tool_results"):
                            resp.tool_results = []
                        resp.tool_results.append({
                            "tool_call_id": tool_call.get("id", ""),
                            "result": result,
                        })

        if resp.completion_text:
            await self.manager.on_bot_message(event, resp.completion_text)

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
