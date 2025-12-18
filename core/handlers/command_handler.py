"""指令处理模块"""

import json
import time
from pathlib import Path

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent

from .manager import GraphMemoryManager


class CommandHandler:
    """指令处理器

    负责处理所有用户指令的具体逻辑
    """

    def __init__(self, manager: GraphMemoryManager, data_dir: Path):
        self.manager = manager
        self.data_dir = data_dir

    async def handle_stat(self, event: AstrMessageEvent) -> str:
        """处理 /memory_stat 指令"""
        try:
            stats = await self.manager.get_stats()
            return f"""图谱统计信息:
- 用户数: {stats.get('users', 0)}
- 会话数: {stats.get('sessions', 0)}
- 实体数: {stats.get('entities', 0)}
- 关系数: {stats.get('relations', 0)}
"""
        except Exception as e:
            logger.error(f"[GraphMemory] 获取统计信息失败: {e}", exc_info=True)
            return f"获取统计信息失败: {e}"

    async def handle_search(self, event: AstrMessageEvent) -> str:
        """处理 /memory_search 指令

        用法:
        /memory_search <关键词>
        /memory_search <关键词> type:<类型> limit:<数量>
        """
        try:
            # 解析参数
            args = event.message_str.strip().split()
            if len(args) < 1:
                return "用法: /memory_search <关键词> [type:<类型>] [limit:<数量>]"

            query = args[0]
            entity_type = None
            limit = 10

            # 解析可选参数
            for arg in args[1:]:
                if arg.startswith("type:"):
                    entity_type = arg.split(":", 1)[1].upper()
                elif arg.startswith("limit:"):
                    try:
                        limit = int(arg.split(":", 1)[1])
                    except ValueError:
                        return f"无效的 limit 参数: {arg}"

            # 搜索实体
            entities = await self.manager.search_entities(query, entity_type, limit)

            if not entities:
                return f"未找到包含 '{query}' 的实体"

            # 格式化输出
            lines = [f"找到 {len(entities)} 个实体:\n"]
            for i, entity in enumerate(entities, 1):
                lines.append(f"{i}. {entity.name} ({entity.type})")
                lines.append(f"   描述: {entity.description}")
                lines.append(f"   重要性: {entity.importance:.2f}, 访问次数: {entity.access_count}")

                # 获取关系
                relations = await self.manager.get_entity_relations(entity.name)
                if relations:
                    lines.append(f"   关系: {len(relations)} 条")
                    for rel in relations[:3]:  # 只显示前3条
                        direction = "→" if rel["direction"] == "outgoing" else "←"
                        target = rel['to'] if rel['direction'] == 'outgoing' else rel['from']
                        lines.append(f"     {direction} {target}: {rel['relation']}")
                    if len(relations) > 3:
                        lines.append(f"     ... 还有 {len(relations) - 3} 条关系")
                lines.append("")

            return "\n".join(lines)

        except Exception as e:
            logger.error(f"[GraphMemory] 搜索失败: {e}", exc_info=True)
            return f"搜索失败: {e}"

    async def handle_forget(self, event: AstrMessageEvent) -> str:
        """处理 /memory_forget 指令

        用法:
        /memory_forget <实体名称> confirm:yes
        """
        try:
            # 解析参数
            args = event.message_str.strip().split()
            if len(args) < 2:
                return "用法: /memory_forget <实体名称> confirm:yes"

            entity_name = args[0]
            confirm = False

            # 检查确认参数
            for arg in args[1:]:
                if arg == "confirm:yes":
                    confirm = True
                    break

            if not confirm:
                return "请添加 confirm:yes 参数以确认删除"

            # 删除实体
            success, relation_count = await self.manager.delete_entity(entity_name)

            if success:
                return f"已删除实体 '{entity_name}' 及其 {relation_count} 条关系"
            else:
                return f"删除实体 '{entity_name}' 失败"

        except Exception as e:
            logger.error(f"[GraphMemory] 删除失败: {e}", exc_info=True)
            return f"删除失败: {e}"

    async def handle_export(self, event: AstrMessageEvent) -> str:
        """处理 /memory_export 指令

        用法:
        /memory_export [persona:<人格ID>]
        """
        try:
            # 解析参数
            args = event.message_str.strip().split()
            persona_id = None

            for arg in args:
                if arg.startswith("persona:"):
                    persona_id = arg.split(":", 1)[1]

            # 导出图谱
            data = await self.manager.export_graph(persona_id)

            if not data:
                return "导出失败或图谱为空"

            # 格式化输出
            entity_count = len(data.get("entities", []))
            relation_count = len(data.get("relations", []))
            session_count = len(data.get("sessions", []))

            # 保存到文件
            filename = f"memory_export_{int(time.time())}.json"
            filepath = self.data_dir / filename

            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            return f"""导出完成:
- 实体数: {entity_count}
- 关系数: {relation_count}
- 会话数: {session_count}
- 文件: {filepath}
"""

        except Exception as e:
            logger.error(f"[GraphMemory] 导出失败: {e}", exc_info=True)
            return f"导出失败: {e}"

    async def handle_import(self, event: AstrMessageEvent) -> str:
        """处理 /memory_import 指令

        用法:
        /memory_import <文件名> [merge:true|false]
        """
        try:
            # 解析参数
            args = event.message_str.strip().split()
            if len(args) < 1:
                return "用法: /memory_import <文件名> [merge:true|false]"

            filename = args[0]
            merge = True

            for arg in args[1:]:
                if arg.startswith("merge:"):
                    merge = arg.split(":", 1)[1].lower() == "true"

            # 读取文件
            filepath = self.data_dir / filename
            if not filepath.exists():
                return f"文件不存在: {filepath}"

            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)

            # 导入图谱
            entity_count, relation_count = await self.manager.import_graph(data, merge)

            return f"""导入完成:
- 导入实体数: {entity_count}
- 导入关系数: {relation_count}
- 合并模式: {'是' if merge else '否'}
"""

        except Exception as e:
            logger.error(f"[GraphMemory] 导入失败: {e}", exc_info=True)
            return f"导入失败: {e}"
