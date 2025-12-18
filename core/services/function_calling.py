"""Function Calling 支持模块"""

from typing import TYPE_CHECKING, Any

from astrbot.api import logger

if TYPE_CHECKING:
    from ..manager import GraphMemoryManager


class FunctionCallingHandler:
    """Function Calling 处理器

    负责处理 LLM 的主动记忆检索请求
    """

    def __init__(self, manager: "GraphMemoryManager"):
        self.manager = manager

    def get_tool_schema(self) -> dict:
        """获取记忆检索工具的 Schema

        Returns:
            工具 Schema 定义
        """
        return {
            "type": "function",
            "function": {
                "name": "search_memory",
                "description": "搜索长期记忆图谱中的实体和关系。当需要回忆之前对话中提到的信息时使用此工具。",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "搜索关键词，可以是实体名称、概念或相关描述",
                        },
                        "entity_type": {
                            "type": "string",
                            "enum": ["PERSON", "PLACE", "THING", "CONCEPT", "EVENT"],
                            "description": "实体类型过滤（可选）",
                        },
                        "limit": {
                            "type": "integer",
                            "description": "返回结果数量，默认 5",
                            "default": 5,
                        },
                    },
                    "required": ["query"],
                },
            },
        }

    async def handle_tool_call(
        self,
        tool_name: str,
        tool_args: dict[str, Any],
        session_id: str,
        persona_id: str,
    ) -> str:
        """处理工具调用

        Args:
            tool_name: 工具名称
            tool_args: 工具参数
            session_id: 会话ID
            persona_id: 人格ID

        Returns:
            工具执行结果（JSON 字符串）
        """
        if tool_name != "search_memory":
            return f'{{"error": "未知的工具: {tool_name}"}}'

        try:
            # 解析参数
            query = tool_args.get("query", "")
            entity_type = tool_args.get("entity_type")
            limit = tool_args.get("limit", 5)

            if not query:
                return '{"error": "缺少 query 参数"}'

            logger.info(f"[GraphMemory] Function Calling: 搜索 '{query}' (类型: {entity_type}, 限制: {limit})")

            # 搜索实体
            entities = await self.manager.search_entities(query, entity_type, limit)

            if not entities:
                return f'{{"result": "未找到与 \\"{query}\\" 相关的记忆"}}'

            # 格式化结果
            results = []
            for entity in entities:
                # 获取关系
                relations = await self.manager.get_entity_relations(entity.name)

                entity_info = {
                    "name": entity.name,
                    "type": entity.type,
                    "description": entity.description,
                    "importance": round(entity.importance, 2),
                    "relations": [],
                }

                # 添加关系信息
                for rel in relations[:3]:  # 只返回前3条关系
                    entity_info["relations"].append({
                        "target": rel["to"] if rel["direction"] == "outgoing" else rel["from"],
                        "relation": rel["relation"],
                        "direction": rel["direction"],
                    })

                results.append(entity_info)

            # 返回 JSON 格式结果
            import json
            return json.dumps({"result": results}, ensure_ascii=False)

        except Exception as e:
            logger.error(f"[GraphMemory] Function Calling 处理失败: {e}", exc_info=True)
            return f'{{"error": "搜索失败: {str(e)}"}}'
