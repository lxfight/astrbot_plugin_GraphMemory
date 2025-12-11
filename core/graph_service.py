"""
该模块定义了 `GraphService` 类，它充当 Web UI 和 `GraphEngine` 之间的服务层。

"""

from astrbot.api import logger

from .graph_engine import GraphEngine
from .graph_entities import RelatedToRel


class GraphService:
    """
    WebUI 和 GraphEngine 之间的服务层。
    封装了所有与图数据相关的业务逻辑，为前端提供清晰的 API。
    """
    def __init__(self, engine: GraphEngine):
        self.engine = engine

    async def get_contexts(self) -> list[dict[str, str]]:
        """获取所有存在记忆的会话上下文列表，用于在 WebUI 下拉菜单中显示。"""
        session_ids = await self.engine.get_all_contexts()
        # 注意：当前实现中，persona_id 的逻辑较为复杂，此处暂时硬编码为 "default"。
        # 在未来的版本中，可以扩展此方法以正确地检索每个人格。
        return [{"session_id": sid, "persona_id": "default"} for sid in session_ids]

    async def get_graph_data(self, session_id: str | None) -> dict | None:
        """
        获取图数据用于 WebUI 可视化。
        如果提供了 session_id，则获取该会话的子图。
        如果 session_id 为 "global" 或 None，则获取全局知识图谱。
        """
        if session_id and session_id != "global":
            logger.info(f"[GraphService] 正在为会话 '{session_id}' 获取图谱数据...")
            return await self.engine.get_full_graph(session_id)
        else:
            logger.info("[GraphService] 正在获取全局图谱数据...")
            return await self.engine.get_global_graph()

    async def debug_search(self, query: str, session_id: str, vector_top_k: int, keyword_top_k: int) -> dict:
        """
        执行一次调试搜索，并返回用于可视化的相关子图。
        这允许开发者在 WebUI 上测试和理解搜索算法的行为。
        """
        if not self.engine.embedding_provider:
            raise ValueError("未配置 Embedding provider，无法执行搜索。")

        if not session_id:
            raise ValueError("调试搜索需要提供 Session ID。")

        # 1. 为查询生成向量
        query_embedding = await self.engine.embedding_provider.embed(query)

        # 2. 调用 GraphEngine 的可视化搜索方法
        graph_data = await self.engine.search_for_visualization(
            query=query,
            query_embedding=query_embedding,
            session_id=session_id,
            vector_top_k=vector_top_k,
            keyword_top_k=keyword_top_k,
        )
        return graph_data

    async def delete_node(self, node_id: str, node_type: str):
        """从图中删除一个指定的节点。"""
        logger.info(f"[GraphService] 正在删除类型为 {node_type} 的节点 {node_id}")
        await self.engine.delete_node_by_id(node_id, node_type)

    async def delete_edge(self, from_id: str, to_id: str, rel_type: str, from_type: str, to_type: str):
        """从图中删除一条指定的关系（边）。"""
        logger.info(f"[GraphService] 正在删除从 {from_id} 到 {to_id} 的 {rel_type} 关系")
        await self.engine.delete_edge(from_id, to_id, rel_type, from_type, to_type)

    async def update_node(self, node_id: str, node_type: str, properties: dict):
        """更新一个节点的属性。"""
        logger.info(f"[GraphService] 正在使用属性 {properties} 更新节点 {node_id}")
        await self.engine.update_node_properties(node_id, node_type, properties)

    async def batch_delete(self, task_name: str, **kwargs) -> int:
        """执行预定义的批量删除任务。"""
        logger.info(f"[GraphService] 正在执行批量删除任务: {task_name}")
        return await self.engine.batch_delete(task_name, **kwargs)

    async def create_node(self, node_type: str, properties: dict) -> bool:
        """手动创建一个新节点。"""
        logger.info(f"[GraphService] 正在创建类型为 {node_type} 的新节点")
        return await self.engine.add_node_manually(node_type, properties)

    async def link_entity_to_session(self, session_id: str, entity_name: str):
        """将一个实体关联到指定会话。"""
        logger.info(f"[GraphService] 正在将实体 '{entity_name}' 关联到会话 '{session_id}'")
        await self.engine.link_entity_to_session(session_id, entity_name)

    async def create_edge(self, from_id: str, to_id: str, rel_type: str, from_type: str, to_type: str):
        """在两个节点之间创建一条新的关系（边）。"""
        # 目前主要支持实体之间的关系创建
        if from_type == "Entity" and to_type == "Entity":
            relation = RelatedToRel(src_entity=from_id, tgt_entity=to_id, relation=rel_type)
            logger.info(f"[GraphService] 正在创建关系: ({from_id})-[{rel_type}]->({to_id})")
            await self.engine.add_relation(relation)
        else:
            # 未来可以扩展以支持更多类型的关系
            logger.warning(f"目前不支持在 '{from_type}' 和 '{to_type}' 之间创建关系。")
            raise NotImplementedError(f"不支持在 '{from_type}' 和 '{to_type}' 之间创建关系。")
