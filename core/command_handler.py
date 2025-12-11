"""
该模块定义了 `CommandHandler` 类，它负责处理所有用户指令。
"""
import json

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent

from .plugin_service import PluginService


class CommandHandler:
    """
    处理所有用户指令，将具体实现委托给 PluginService。
    """

    def __init__(self, service: PluginService):
        self.service = service

    async def handle_stat(self, event: AstrMessageEvent):
        """处理 /memory_stat 指令"""
        stats = await self.service.graph_engine.get_graph_statistics()
        if not stats:
            yield event.plain_result("获取图谱统计信息失败。")
            return

        stat_str = "\n".join([f"- {key}: {value}" for key, value in stats.items()])
        yield event.plain_result(f"图记忆统计:\n{stat_str}")

    async def handle_link_session(self, event: AstrMessageEvent, target_session_id: str):
        """处理 /memory_link_session 指令"""
        if not target_session_id:
            yield event.plain_result("用法: /memory_link_session <目标会话ID>")
            return

        current_session_id = event.unified_msg_origin
        if current_session_id == target_session_id:
            yield event.plain_result("不能将记忆关联到同一会话。")
            return

        try:
            migrated_count = await self.service.graph_engine.migrate_memories(
                current_session_id, target_session_id
            )
            yield event.plain_result(
                f"成功将 {migrated_count} 条记忆片段从 '{current_session_id}' 关联到 '{target_session_id}'。"
            )
        except Exception as e:
            logger.error(f"[GraphMemory] 记忆关联失败: {e}", exc_info=True)
            yield event.plain_result(f"记忆关联过程中发生错误: {e}")

    async def handle_forget(self, event: AstrMessageEvent, *, entity_name: str):
        """处理 /memory_forget 指令"""
        if not entity_name:
            yield event.plain_result("用法: /memory_forget <实体名称>")
            return

        success = await self.service.graph_engine.delete_node_by_id(entity_name, "Entity")
        if success:
            yield event.plain_result(f"已尝试忘记关于 '{entity_name}' 的记忆。")
        else:
            yield event.plain_result(f"在忘记 '{entity_name}' 的过程中发生错误。")

    async def handle_dump(self, event: AstrMessageEvent):
        """处理 /memory_dump 指令"""
        session_id = event.unified_msg_origin
        graph_data = await self.service.graph_engine.get_full_graph(session_id)
        if graph_data:
            yield event.plain_result(
                json.dumps(graph_data, indent=2, ensure_ascii=False)
            )
        else:
            yield event.plain_result(f"无法为会话 {session_id} 导出图数据。")

    async def handle_migrate_v2(self, event: AstrMessageEvent):
        """处理 /memory_migrate_v2 指令"""
        yield event.plain_result(
            "此功能已被废弃。\n"
            "GraphMemory v0.2.0 采用了全新的数据库 Schema 且不兼容旧版本。"
            "旧数据无法迁移，插件将自动在新数据库中开始记录新的记忆。"
        )
