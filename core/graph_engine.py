# data/plugins/astrbot_plugin_GraphMemory/core/graph_engine.py

"""
该模块定义了 `GraphEngine` 类，它是与 Kuzu 图数据库交互的核心。
它封装了所有数据库操作，包括模式初始化、数据写入、复杂查询和维护任务。
"""

import asyncio
import functools
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

import kuzu

from astrbot.api import logger

from .graph_entities import (
    EntityNode,
    MentionsRel,
    MessageNode,
    RelatedToRel,
    SessionNode,
    UserNode,
)
from .queries import (
    ADD_ENTITY,
    ADD_MENTION,
    ADD_MESSAGE,
    ADD_RELATION,
    ADD_SESSION,
    ADD_USER,
    ARCHIVE_MESSAGES,
    BATCH_DELETE_ISOLATED_ENTITIES,
    BATCH_DELETE_OLD_MESSAGES_BY_DAYS,
    COUNT_ALL_NODES,
    CREATE_MEMORY_FRAGMENT,
    DELETE_EDGE,
    DELETE_NODE_BY_ID,
    FIND_SESSIONS_FOR_CONSOLIDATION,
    GET_ALL_CONTEXTS,
    GET_SESSION_GRAPH_NODES_PART1,
    GET_SESSION_GRAPH_NODES_PART2,
    GET_SESSION_GRAPH_NODES_PART3,
    GET_SESSION_GRAPH_EDGES_PART1,
    GET_SESSION_GRAPH_EDGES_PART2,
    GET_SESSION_GRAPH_EDGES_PART3,
    GET_GLOBAL_GRAPH_EDGES,
    GET_GLOBAL_GRAPH_NODES,
    GET_GLOBAL_GRAPH_OPTIMIZED_EDGES,
    GET_GLOBAL_GRAPH_OPTIMIZED_NODES,
    GET_MESSAGES_FOR_CONSOLIDATION,
    GET_REFLECTION_CANDIDATES,
    KEYWORD_SEARCH_ENTITY,
    LINK_ENTITY_TO_SESSION,
    LINK_FRAGMENT_TO_SESSION,
    LINK_FRAGMENT_TO_USERS,
    MIGRATE_FIND_MEMORIES,
    MIGRATE_LINK_MEMORIES,
    TRAVERSE_GRAPH,
    VECTOR_SEARCH_ENTITY,
    VECTOR_SEARCH_FRAGMENT,
    VECTOR_SEARCH_MESSAGE,
)
from .schema import get_embedding_dim_from_provider, initialize_schema

# 检查可选的 `jieba` 库是否存在，用于中文分词和关键词提取
try:
    import jieba.analyse

    JIEBA_AVAILABLE = True
except ImportError:
    JIEBA_AVAILABLE = False


class GraphEngine:
    """
    图数据库引擎，负责管理所有与 Kuzu DB 的交互。

    主要职责:
    - 初始化数据库连接和图模式 (Schema)。
    - 提供异步接口用于添加、更新和删除图中的节点与关系。
    - 实现复杂的多阶段搜索逻辑，用于从图中检索相关记忆。
    - 执行后台维护任务，如剪枝和记忆巩固。

    线程模型:
    为了确保数据库操作的线程安全，所有数据库的读写操作都在一个
    最大工作线程为1的 `ThreadPoolExecutor` 中执行。这有效地将所有
    数据库访问序列化，防止了并发写入可能导致的数据损坏。
    """

    def __init__(self, db_path: Path, embedding_provider: Any | None):
        """
        初始化 GraphEngine。

        Args:
            db_path (Path): 存放数据库文件的目录路径。
            embedding_provider (Any | None): 用于生成向量的 Embedding Provider 实例，可以为 None。
        """
        self.db_version = 2
        self.db_path = (db_path / f"kuzu_db_v{self.db_version}").resolve().as_posix()
        self.kuzu_db = kuzu.Database(self.db_path)
        self.conn: Any = kuzu.Connection(self.kuzu_db)
        self.embedding_provider = embedding_provider

        embedding_dim = get_embedding_dim_from_provider(embedding_provider)

        # 使用锁和单线程执行器来序列化所有数据库访问，确保线程安全
        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(
            max_workers=1, thread_name_prefix="GraphEngine"
        )

        logger.info(f"正在初始化 KuzuDB schema v{self.db_version} at {self.db_path}")
        initialize_schema(self.conn, embedding_dim)

    def set_embedding_provider(self, embedding_provider: Any):
        """延迟设置 embedding provider 并重新检查 schema。"""
        self.embedding_provider = embedding_provider
        embedding_dim = get_embedding_dim_from_provider(embedding_provider)

        # 重新初始化 schema 以确保维度正确
        logger.info(
            f"检测到 Embedding Provider 更新，重新检查 Schema (维度: {embedding_dim})..."
        )
        initialize_schema(self.conn, embedding_dim)

    def execute_query(self, query: str, params: dict | None = None) -> Any:
        """
        在锁的保护下同步执行一个 Cypher 查询。

        Args:
            query (str): 要执行的 Cypher 查询语句。
            params (dict | None): 查询参数。

        Returns:
            Any: Kuzu 的查询结果对象。
        """
        with self._lock:
            return self.conn.execute(query, params or {})

    def close(self):
        """关闭数据库连接并释放资源。"""
        self._executor.shutdown(wait=True)
        self.kuzu_db = None
        logger.info("[GraphMemory] KuzuDB 资源已释放。")

    async def _run_in_executor(self, func, *args, **kwargs):
        """
        一个异步帮助函数，用于在专用的线程池中运行同步的、阻塞的数据库操作，
        从而避免阻塞主 asyncio 事件循环。
        """
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            self._executor, functools.partial(func, *args, **kwargs)
        )

    # ================= 增 / 改 (Write) =================

    async def add_user(self, user: UserNode):
        """异步添加一个用户节点。"""
        params = {"id": user.id, "name": user.name, "platform": user.platform}
        await self._run_in_executor(self.execute_query, ADD_USER, params)

    async def add_session(self, session: SessionNode):
        """异步添加一个会话节点。"""
        params = {"id": session.id, "type": session.type, "name": session.name}
        await self._run_in_executor(self.execute_query, ADD_SESSION, params)

    async def add_entity(self, entity: EntityNode):
        """异步添加一个实体节点，如果需要，会先生成 embedding。"""
        if entity.embedding is None and self.embedding_provider:
            entity.embedding = await self.embedding_provider.embed(entity.name)
        params = {
            "name": entity.name,
            "type": entity.type,
            "summary": entity.summary,
            "embedding": entity.embedding,
        }
        await self._run_in_executor(self.execute_query, ADD_ENTITY, params)

    async def add_message(self, message: MessageNode):
        """异步添加一个消息节点，并将其连接到用户和会话。如果需要，会先生成 embedding。"""
        if message.embedding is None and self.embedding_provider:
            message.embedding = await self.embedding_provider.embed(message.content)
        params = {
            "user_id": message.sender_id,
            "session_id": message.session_id,
            "msg_id": message.id,
            "content": message.content,
            "timestamp": message.timestamp,
            "embedding": message.embedding,
        }
        await self._run_in_executor(self.execute_query, ADD_MESSAGE, params)

    async def add_relation(self, rel: RelatedToRel):
        """异步添加一个实体间的 `RELATED_TO` 关系。"""
        params = {
            "src_name": rel.src_entity,
            "tgt_name": rel.tgt_entity,
            "relation": rel.relation,
        }
        await self._run_in_executor(self.execute_query, ADD_RELATION, params)

    async def add_mention(self, mention: MentionsRel):
        """异步添加一个从消息到实体的 `MENTIONS` 关系。"""
        params = {
            "msg_id": mention.message_id,
            "entity_name": mention.entity_name,
            "sentiment": mention.sentiment,
        }
        await self._run_in_executor(self.execute_query, ADD_MENTION, params)

    async def link_entity_to_session(self, session_id: str, entity_name: str):
        """异步将一个实体关联到指定会话。"""
        params = {"sid": session_id, "ename": entity_name}
        await self._run_in_executor(self.execute_query, LINK_ENTITY_TO_SESSION, params)

    # ================= 查 / 召回 (Read) =================

    async def search(
        self,
        query: str,
        query_embedding: list[float],
        session_id: str,
        vector_top_k: int,
        keyword_top_k: int,
        max_items: int,
    ) -> str:
        """
        执行多阶段的记忆搜索，并返回格式化为文本的上下文。
        """
        return await self._run_in_executor(
            self._search_sync,
            query,
            query_embedding,
            session_id,
            vector_top_k,
            keyword_top_k,
            max_items,
        )

    def _search_sync(
        self,
        query: str,
        query_embedding: list[float],
        session_id: str,
        vector_top_k: int,
        keyword_top_k: int,
        max_items: int,
    ) -> str:
        """搜索逻辑的同步实现。"""
        recalled_items = []

        entity_res = self._vector_search(
            "Entity", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [{"type": "Entity", "score": r["score"], **r["node"]} for r in entity_res]
        )

        msg_res = self._vector_search(
            "Message", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [{"type": "Message", "score": r["score"], **r["node"]} for r in msg_res]
        )

        frag_res = self._vector_search(
            "MemoryFragment", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [
                {"type": "MemoryFragment", "score": r["score"], **r["node"]}
                for r in frag_res
            ]
        )

        keywords = self._extract_keywords_local(query)
        kw_entity_res = self._keyword_search(keywords, session_id, limit=keyword_top_k)
        existing_entity_names = {
            item["name"] for item in recalled_items if item["type"] == "Entity"
        }
        for r in kw_entity_res:
            if r["node"]["name"] not in existing_entity_names:
                recalled_items.append(
                    {"type": "Entity", "score": r["score"], **r["node"]}
                )

        if not recalled_items:
            return ""

        seed_ids = {item.get("id") or item.get("name") for item in recalled_items}
        traversal_context = self._traverse_graph(list(seed_ids))

        return self._rerank_and_format_context(
            recalled_items, traversal_context, max_items
        )

    def _vector_search(
        self, table_name: str, vector: list[float], session_id: str, top_k: int = 3
    ) -> list[dict]:
        """
        在指定的表上执行向量搜索。
        """
        params = {"vector": vector, "sid": session_id, "top_k": top_k}

        if table_name == "Entity":
            query = VECTOR_SEARCH_ENTITY.format(
                table_name=table_name, top_k_multiplied=top_k * 5
            )
        elif table_name == "Message":
            query = VECTOR_SEARCH_MESSAGE.format(
                table_name=table_name, top_k_multiplied=top_k * 5
            )
        elif table_name == "MemoryFragment":
            query = VECTOR_SEARCH_FRAGMENT.format(
                table_name=table_name, top_k_multiplied=top_k * 5
            )
        else:
            return []

        results = []
        try:
            res = self.execute_query(query, params)
            while res.has_next():
                node_data, score = res.get_next()
                results.append({"node": node_data, "score": score})
        except Exception as e:
            logger.error(f"[GraphMemory] 在 '{table_name}' 上进行向量搜索失败: {e}")
        return results

    def _extract_keywords_local(self, query: str) -> list[str]:
        """使用 jieba (如果可用) 或简单的空格分割来提取关键词。"""
        if JIEBA_AVAILABLE:
            keywords = jieba.analyse.extract_tags(query, topK=3, withWeight=False)
            return [str(k) for k in keywords]
        else:
            return [w for w in query.split() if len(w) > 2][:3]

    def _keyword_search(
        self, keywords: list[str], session_id: str, limit: int = 3
    ) -> list[dict]:
        """在实体名称上执行关键词搜索。"""
        if not keywords:
            return []

        params = {"keywords": keywords, "limit": limit}
        results = []
        try:
            res = self.execute_query(KEYWORD_SEARCH_ENTITY, params)
            while res.has_next():
                node_data, score = res.get_next()
                results.append({"node": node_data, "score": score})
        except Exception as e:
            logger.error(f"[GraphMemory] 关键词搜索失败: {e}")
        return results

    def _traverse_graph(self, seed_ids: list[str], hops: int = 1) -> dict[str, list]:
        """
        从一组种子节点出发，在图上遍历指定跳数，返回邻近的节点和关系。
        """
        context = {"nodes": [], "edges": []}
        if not seed_ids:
            return context

        params = {"seed_ids": seed_ids}

        try:
            res = self.execute_query(TRAVERSE_GRAPH, params)
            while res.has_next():
                n, r, m = res.get_next()
                context["nodes"].append(n)
                context["nodes"].append(m)
                edge_info = {
                    "from": n.get("id") or n.get("name"),
                    "to": m.get("id") or m.get("name"),
                    "label": r["_label"],
                    "properties": {k: v for k, v in r.items() if not k.startswith("_")},
                }
                context["edges"].append(edge_info)
        except Exception as e:
            logger.error(f"[GraphMemory] 图遍历失败: {e}")

        return context

    def _rerank_and_format_context(
        self, recalled_items: list[dict], traversal_context: dict, max_items: int
    ) -> str:
        """
        对所有召回和扩展的上下文信息进行重排序，并格式化为最终的文本输出。
        """
        import time
        from datetime import datetime

        context_items = []
        processed_ids = set()

        for item in recalled_items:
            item_id = item.get("id") or item.get("name")
            if item_id in processed_ids:
                continue

            score = item.get("score", 0.0)
            type_weights = {"MemoryFragment": 1.5, "Entity": 1.2, "Message": 1.0}
            score *= type_weights.get(item["type"], 1.0)

            timestamp = item.get("timestamp")
            if timestamp:
                age_days = (time.time() - timestamp) / (3600 * 24)
                decay_factor = 1 / (1 + age_days * 0.1)
                score *= decay_factor

            context_items.append({"id": item_id, "data": item, "score": score})
            processed_ids.add(item_id)

        traversed_nodes = {
            (n.get("id") or n.get("name")): n for n in traversal_context["nodes"]
        }
        for node_id, node_data in traversed_nodes.items():
            if node_id in processed_ids:
                continue
            context_items.append({"id": node_id, "data": node_data, "score": 0.5})
            processed_ids.add(node_id)

        context_items.sort(key=lambda x: x["score"], reverse=True)

        formatted_lines = []
        final_items_to_show = max_items

        summaries = [
            item for item in context_items if item["data"]["_label"] == "MemoryFragment"
        ]
        if summaries:
            formatted_lines.append("相关记忆摘要:")
            for s_item in summaries[:2]:
                ts = datetime.fromtimestamp(s_item["data"]["timestamp"]).strftime(
                    "%Y-%m-%d"
                )
                formatted_lines.append(f"- [日期: {ts}]: {s_item['data']['text']}")
                final_items_to_show -= 1

        entities = [
            item for item in context_items if item["data"]["_label"] == "Entity"
        ]
        if entities:
            formatted_lines.append("\n相关概念:")
            for e_item in entities[:3]:
                formatted_lines.append(f"- 概念: {e_item['data']['name']}")
                final_items_to_show -= 1

        if traversal_context["edges"]:
            formatted_lines.append("\n相关事实:")
            for edge in traversal_context["edges"][:3]:
                formatted_lines.append(
                    f"- 事实: ({edge['from']})-[{edge['label']}]->({edge['to']})"
                )
                final_items_to_show -= 1

        messages = [
            item for item in context_items if item["data"]["_label"] == "Message"
        ]
        if messages and final_items_to_show > 0:
            formatted_lines.append("\n相关历史消息:")
            for m_item in messages[:final_items_to_show]:
                ts = datetime.fromtimestamp(m_item["data"]["timestamp"]).strftime(
                    "%Y-%m-%d"
                )
                formatted_lines.append(
                    f"- [日期: {ts}]: ...{m_item['data']['content'][:80]}..."
                )

        return "\n".join(formatted_lines)

    async def search_for_visualization(
        self,
        query: str,
        query_embedding: list[float],
        session_id: str,
        vector_top_k: int,
        keyword_top_k: int,
    ) -> dict:
        """[异步] 执行搜索并返回用于可视化的原始图组件。"""
        return await self._run_in_executor(
            self._search_for_visualization_sync,
            query,
            query_embedding,
            session_id,
            vector_top_k,
            keyword_top_k,
        )

    def _search_for_visualization_sync(
        self,
        query: str,
        query_embedding: list[float],
        session_id: str,
        vector_top_k: int,
        keyword_top_k: int,
    ) -> dict:
        """[同步] 执行搜索并返回一个包含 'nodes' 和 'edges' 的字典。"""
        recalled_items = []
        entity_res = self._vector_search(
            "Entity", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [{"type": "Entity", "score": r["score"], **r["node"]} for r in entity_res]
        )
        msg_res = self._vector_search(
            "Message", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [{"type": "Message", "score": r["score"], **r["node"]} for r in msg_res]
        )
        frag_res = self._vector_search(
            "MemoryFragment", query_embedding, session_id, top_k=vector_top_k
        )
        recalled_items.extend(
            [
                {"type": "MemoryFragment", "score": r["score"], **r["node"]}
                for r in frag_res
            ]
        )

        keywords = self._extract_keywords_local(query)
        kw_entity_res = self._keyword_search(keywords, session_id, limit=keyword_top_k)
        existing_entity_names = {
            item["name"] for item in recalled_items if item["type"] == "Entity"
        }
        for r in kw_entity_res:
            if r["node"]["name"] not in existing_entity_names:
                recalled_items.append(
                    {"type": "Entity", "score": r["score"], **r["node"]}
                )

        if not recalled_items:
            return {"nodes": [], "edges": []}

        seed_ids = {item.get("id") or item.get("name") for item in recalled_items}
        traversal_context = self._traverse_graph(list(seed_ids))

        all_nodes = {
            (n.get("id") or n.get("name")): n for n in traversal_context["nodes"]
        }
        for item in recalled_items:
            node_id = item.get("id") or item.get("name")
            if node_id not in all_nodes:
                node_data = item.copy()
                if "_label" not in node_data:
                    node_data["_label"] = node_data.get("type", "Unknown")
                all_nodes[node_id] = node_data

        vis_nodes = []
        nodes_seen = set()
        for node_id, node_data in all_nodes.items():
            if node_id not in nodes_seen:
                vis_node = {
                    "id": node_id,
                    "label": node_data.get("name") or node_data.get("content", "")[:30],
                    "group": node_data["_label"],
                    "title": "\n".join(f"{k}: {v}" for k, v in node_data.items()),
                }
                vis_nodes.append(vis_node)
                nodes_seen.add(node_id)

        return {"nodes": vis_nodes, "edges": traversal_context["edges"]}

    # ================= 维护 (Maintenance) =================
    async def prune_graph(self, max_nodes: int, message_max_days: int) -> int:
        """
        [异步] 剪枝图谱，移除最旧的 Message 节点以将节点总数保持在限制内。
        """
        return await self._run_in_executor(
            self._prune_graph_sync, max_nodes, message_max_days
        )

    def _prune_graph_sync(self, max_nodes: int, message_max_days: int) -> int:
        """[同步] 剪枝图谱的实现。"""
        import time

        total_deleted_count = 0
        try:
            while True:
                res = self.execute_query(COUNT_ALL_NODES)
                current_nodes = res.get_next()[0] if res.has_next() else 0

                if current_nodes <= max_nodes:
                    if total_deleted_count > 0:
                        logger.info(
                            f"[GraphMemory] 剪枝完成。总共删除 {total_deleted_count} 个节点。当前节点数: {current_nodes}"
                        )
                    else:
                        logger.debug(
                            f"[GraphMemory] 节点数 ({current_nodes}) 在限制 ({max_nodes}) 内，无需剪枝。"
                        )
                    return total_deleted_count

                logger.info(
                    f"[GraphMemory] 需要剪枝。当前: {current_nodes}, 限制: {max_nodes}。"
                )

                max_days_ms = message_max_days * 24 * 3600 * 1000
                current_ts_ms = time.time() * 1000
                query_stage1 = """
                    MATCH (m:Message)
                    WHERE m.timestamp < ($current_ts_ms - $max_days_ms) AND (m.is_summarized IS NULL OR m.is_summarized = false)
                    WITH m LIMIT 1000
                    DETACH DELETE m
                    RETURN count(m)
                """
                res_stage1 = self.execute_query(
                    query_stage1,
                    {"current_ts_ms": current_ts_ms, "max_days_ms": max_days_ms},
                )
                deleted_count = res_stage1.get_next()[0] if res_stage1.has_next() else 0
                if deleted_count > 0:
                    total_deleted_count += deleted_count
                    logger.info(
                        f"[GraphMemory Pruning - Stage 1] 删除了 {deleted_count} 个过期的原始消息。"
                    )
                    continue

                query_stage2 = """
                    MATCH (e:Entity)
                    WHERE NOT (e)--()
                    WITH e LIMIT 1000
                    DETACH DELETE e
                    RETURN count(e)
                """
                res_stage2 = self.execute_query(query_stage2)
                deleted_count = res_stage2.get_next()[0] if res_stage2.has_next() else 0
                if deleted_count > 0:
                    total_deleted_count += deleted_count
                    logger.info(
                        f"[GraphMemory Pruning - Stage 2] 删除了 {deleted_count} 个孤立的实体。"
                    )
                    continue

                query_stage3 = """
                    MATCH (mf:MemoryFragment)
                    WITH mf ORDER BY mf.timestamp ASC LIMIT 500
                    DETACH DELETE mf
                    RETURN count(mf)
                """
                res_stage3 = self.execute_query(query_stage3)
                deleted_count = res_stage3.get_next()[0] if res_stage3.has_next() else 0
                if deleted_count > 0:
                    total_deleted_count += deleted_count
                    logger.info(
                        f"[GraphMemory Pruning - Stage 3] 删除了 {deleted_count} 个最旧的记忆摘要。"
                    )
                    continue

                logger.warning(
                    f"[GraphMemory] 剪枝无法减少节点数，尽管当前 ({current_nodes}) 仍超过限制 ({max_nodes})。可能是图结构密集。"
                )
                break

            return total_deleted_count
        except Exception as e:
            logger.error(f"[GraphMemory] 图剪枝过程中发生错误: {e}", exc_info=True)
            return total_deleted_count

    async def flush_access_stats(self):
        """(占位) 刷新访问统计信息，当前版本未实现。"""
        logger.warning("flush_access_stats 函数在新版 GraphEngine 中尚未实现。")
        pass

    async def find_sessions_for_consolidation(self, threshold: int) -> list[str]:
        """
        [异步] 查找有足够多未归档消息、需要进行记忆巩固的会话。
        """
        return await self._run_in_executor(
            self._find_sessions_for_consolidation_sync, threshold
        )

    def _find_sessions_for_consolidation_sync(self, threshold: int) -> list[str]:
        """[同步] 查找需要巩固的会话的实现。"""
        try:
            res = self.execute_query(
                FIND_SESSIONS_FOR_CONSOLIDATION, {"threshold": threshold}
            )
            return [row[0] for row in res.get_all()] if res.has_next() else []
        except Exception as e:
            logger.error(f"[GraphMemory] 查找需要巩固的会话失败: {e}")
            return []

    def get_messages_for_consolidation(
        self, session_id: str, limit: int = 50
    ) -> tuple[list[str], str, list[str]] | None:
        """
        获取一个会话中用于巩固的一批最旧的消息。
        """
        params = {"sid": session_id, "limit": limit}

        try:
            res = self.execute_query(GET_MESSAGES_FOR_CONSOLIDATION, params)
            if not res.has_next():
                return None

            message_ids = []
            user_ids = set()
            log_lines = []
            while res.has_next():
                mid, uid, user_name, content = res.get_next()
                message_ids.append(mid)
                user_ids.add(uid)
                log_lines.append(f"[{user_name}]: {content}")

            return message_ids, "\n".join(log_lines), list(user_ids)
        except Exception as e:
            logger.error(f"[GraphMemory] 获取用于巩固的消息失败: {e}")
            return None

    async def consolidate_memory(
        self,
        session_id: str,
        summary_text: str,
        message_ids: list[str],
        user_ids: list[str],
    ):
        """
        [异步] 执行记忆巩固：创建摘要节点，并归档旧消息。
        """
        if not self.embedding_provider:
            logger.warning(
                "[GraphMemory] 未配置 embedding provider，无法创建记忆片段。"
            )
            return

        try:
            summary_embedding = await self.embedding_provider.embed(summary_text)
            await self._run_in_executor(
                self._consolidate_memory_sync,
                session_id,
                summary_text,
                message_ids,
                user_ids,
                summary_embedding,
            )
        except Exception as e:
            logger.error(
                f"为摘要生成 embedding 或执行巩固时失败: {e}",
                exc_info=True,
            )

    def _consolidate_memory_sync(
        self,
        session_id: str,
        summary_text: str,
        message_ids: list[str],
        user_ids: list[str],
        summary_embedding: list[float],
    ):
        """[同步] 记忆巩固的实现。"""
        import time
        import uuid

        fragment_id = str(uuid.uuid4())
        ts = int(time.time())

        self.execute_query(
            CREATE_MEMORY_FRAGMENT,
            {
                "id": fragment_id,
                "text": summary_text,
                "ts": ts,
                "embedding": summary_embedding,
            },
        )

        self.execute_query(
            LINK_FRAGMENT_TO_SESSION, {"sid": session_id, "fid": fragment_id}
        )

        if user_ids:
            self.execute_query(
                LINK_FRAGMENT_TO_USERS, {"fid": fragment_id, "uids": user_ids}
            )

        batch_size = 100
        for i in range(0, len(message_ids), batch_size):
            batch = message_ids[i : i + batch_size]
            self.execute_query(ARCHIVE_MESSAGES, {"ids": batch})

        logger.info(
            f"[GraphMemory] 已将 {len(message_ids)} 条消息巩固为会话 {session_id} 的一个记忆片段，并关联了 {len(user_ids)} 个用户。"
        )

    async def get_graph_statistics(self) -> dict[str, int] | None:
        """[异步] 获取图谱中各类节点的数量统计。"""
        return await self._run_in_executor(self._get_graph_statistics_sync)

    def _get_graph_statistics_sync(self) -> dict[str, int] | None:
        """[同步] 获取图谱统计的实现。"""
        stats = {}
        node_types = ["User", "Session", "Message", "Entity", "MemoryFragment"]
        try:
            for node_type in node_types:
                res = self.execute_query(f"MATCH (n:{node_type}) RETURN count(n)")
                stats[f"{node_type}_count"] = res.get_next()[0] if res.has_next() else 0
            return stats
        except Exception as e:
            logger.error(f"[GraphMemory] 获取图谱统计失败: {e}")
            return None

    async def migrate_memories(
        self, source_session_id: str, target_session_id: str
    ) -> int:
        """
        [异步] 将一个会话的记忆（摘要）迁移（即关联）到另一个会话。
        """
        return await self._run_in_executor(
            self._migrate_memories_sync, source_session_id, target_session_id
        )

    def _migrate_memories_sync(
        self, source_session_id: str, target_session_id: str
    ) -> int:
        """[同步] 记忆迁移的实现。"""
        self.execute_query("MERGE (s:Session {id: $sid})", {"sid": target_session_id})

        res = self.execute_query(MIGRATE_FIND_MEMORIES, {"sid": source_session_id})
        if not res.has_next():
            return 0

        memory_fragment_ids = [row[0] for row in res.get_all()]

        if not memory_fragment_ids:
            return 0

        self.execute_query(
            MIGRATE_LINK_MEMORIES,
            {"sid": target_session_id, "mf_ids": memory_fragment_ids},
        )

        logger.info(
            f"已将 {len(memory_fragment_ids)} 条记忆从 {source_session_id} 迁移到 {target_session_id}。"
        )
        return len(memory_fragment_ids)

    async def get_all_contexts(self) -> list[str]:
        """[异步] 获取数据库中所有会话的 ID 列表。"""
        return await self._run_in_executor(self._get_all_contexts_sync)

    def _get_all_contexts_sync(self) -> list[str]:
        """[同步] 获取所有会话 ID 的实现。"""
        try:
            res = self.execute_query(GET_ALL_CONTEXTS)
            return [row[0] for row in res.get_all()] if res.has_next() else []
        except Exception as e:
            logger.error(f"[GraphMemory] 获取所有上下文失败: {e}")
            return []

    async def get_full_graph(self, session_id: str) -> dict | None:
        """[异步] 导出指定会话的完整子图，用于 WebUI 可视化。"""
        return await self._run_in_executor(self._get_full_graph_sync, session_id)

    def _get_full_graph_sync(self, session_id: str) -> dict | None:
        """[同步] 导出完整子图的实现。"""
        try:
            return self._get_session_graph_custom(session_id)
        except Exception as e:
            logger.error(
                f"[GraphMemory] 为会话 '{session_id}' 导出图失败: {e}",
                exc_info=True,
            )
            return None

    async def get_global_graph(self) -> dict | None:
        """[异步] 导出完整的全局知识图谱，用于 WebUI 可视化。"""
        return await self._run_in_executor(self._get_global_graph_sync)

    def _get_global_graph_sync(self) -> dict | None:
        """[同步] 导出全局图谱的实现。"""
        return self._get_global_graph_common(
            GET_GLOBAL_GRAPH_NODES, GET_GLOBAL_GRAPH_EDGES
        )

    async def get_global_graph_optimized(self) -> dict | None:
        """[异步] 导出优化的全局知识图谱（仅实体和记忆片段），用于 WebUI 可视化。"""
        return await self._run_in_executor(self._get_global_graph_optimized_sync)

    def _get_global_graph_optimized_sync(self) -> dict | None:
        """[同步] 导出优化全局图谱的实现。"""
        return self._get_global_graph_common(
            GET_GLOBAL_GRAPH_OPTIMIZED_NODES, GET_GLOBAL_GRAPH_OPTIMIZED_EDGES
        )

    def _get_session_graph_custom(self, session_id: str) -> dict | None:
        """[Helper] 会话图谱导出的自定义逻辑，使用三个独立查询。"""
        graph = {"nodes": [], "edges": []}
        nodes_seen = set()
        params = {"sid": session_id}

        def add_node(node_data):
            if not node_data:
                return None

            node_id = node_data.get("id") or node_data.get("name")
            if not node_id:
                return None

            if node_id in nodes_seen:
                return node_id

            name = node_data.get("name")
            text = node_data.get("text")
            content = node_data.get("content")

            if name:
                label = name
            elif text:
                label = text[:30] if len(text) > 30 else text
            elif content:
                label = content[:30] if len(content) > 30 else content
            else:
                label = str(node_id)[:30]

            node_type = node_data.get("_label", "Unknown")

            vis_node = {
                "id": node_id,
                "name": label,
                "type": node_type,
                "group": node_type,
                "title": "\n".join(
                    f"{k}: {v}" for k, v in node_data.items() if v is not None
                ),
                "properties": {
                    k: v
                    for k, v in node_data.items()
                    if not k.startswith("_") and v is not None
                },
            }
            graph["nodes"].append(vis_node)
            nodes_seen.add(node_id)
            return node_id

        try:
            # 执行三个独立的节点查询
            for query in [GET_SESSION_GRAPH_NODES_PART1, GET_SESSION_GRAPH_NODES_PART2, GET_SESSION_GRAPH_NODES_PART3]:
                res_nodes = self.execute_query(query, params)
                while res_nodes.has_next():
                    node = res_nodes.get_next()[0]
                    add_node(node)

            # 执行三个独立的边查询
            for query in [GET_SESSION_GRAPH_EDGES_PART1, GET_SESSION_GRAPH_EDGES_PART2, GET_SESSION_GRAPH_EDGES_PART3]:
                res_edges = self.execute_query(query, params)
                while res_edges.has_next():
                    a, r, b = res_edges.get_next()
                    if not a or not b or not r:
                        continue

                    from_id = add_node(a)
                    to_id = add_node(b)

                    if from_id and to_id:
                        label = r.get("relation") or r.get("_label", "UNKNOWN")
                        graph["edges"].append(
                            {
                                "source": from_id,
                                "target": to_id,
                                "relation": label,
                                "label": label,
                            }
                        )

            logger.info(
                f"[GraphMemory] 会话图谱导出成功: {len(graph['nodes'])} 个节点, {len(graph['edges'])} 条边"
            )
            return graph
        except Exception as e:
            logger.error(f"[GraphMemory] 导出会话图谱失败: {e}", exc_info=True)
            return {"nodes": [], "edges": []}

    def _get_global_graph_common(
        self, nodes_query: str, edges_query: str, params: dict | None = None
    ) -> dict | None:
        """[Helper] 全局图谱导出的通用逻辑。"""
        graph = {"nodes": [], "edges": []}
        nodes_seen = set()

        def add_node(node_data):
            if not node_data:
                return None

            node_id = node_data.get("id") or node_data.get("name")
            if not node_id:
                return None

            if node_id in nodes_seen:
                return node_id

            name = node_data.get("name")
            text = node_data.get("text")
            content = node_data.get("content")

            if name:
                label = name
            elif text:
                label = text[:30] if len(text) > 30 else text
            elif content:
                label = content[:30] if len(content) > 30 else content
            else:
                label = str(node_id)[:30]

            node_type = node_data.get("_label", "Unknown")

            vis_node = {
                "id": node_id,
                "name": label,
                "type": node_type,
                "group": node_type,
                "title": "\n".join(
                    f"{k}: {v}" for k, v in node_data.items() if v is not None
                ),
                "properties": {
                    k: v
                    for k, v in node_data.items()
                    if not k.startswith("_") and v is not None
                },
            }
            graph["nodes"].append(vis_node)
            nodes_seen.add(node_id)
            return node_id

        try:
            res_nodes = self.execute_query(nodes_query, params)
            while res_nodes.has_next():
                node = res_nodes.get_next()[0]
                add_node(node)

            res_edges = self.execute_query(edges_query, params)
            while res_edges.has_next():
                a, r, b = res_edges.get_next()
                if not a or not b or not r:
                    continue

                from_id = add_node(a)
                to_id = add_node(b)

                if from_id and to_id:
                    label = r.get("relation") or r.get("_label", "UNKNOWN")
                    graph["edges"].append(
                        {
                            "source": from_id,
                            "target": to_id,
                            "relation": label,
                            "label": label,
                        }
                    )

            logger.info(
                f"[GraphMemory] 全局图谱导出成功: {len(graph['nodes'])} 个节点, {len(graph['edges'])} 条边"
            )
            return graph
        except Exception as e:
            logger.error(f"[GraphMemory] 导出全局图谱失败: {e}", exc_info=True)
            return {"nodes": [], "edges": []}

    async def delete_node_by_id(self, node_id: str, node_type: str) -> bool:
        """[异步] 根据 ID 和类型删除一个节点及其关联的边。"""
        return await self._run_in_executor(
            self._delete_node_by_id_sync, node_id, node_type
        )

    def _delete_node_by_id_sync(self, node_id: str, node_type: str) -> bool:
        """[同步] 删除节点的实现。"""
        id_field = "name" if node_type == "Entity" else "id"
        try:
            query = DELETE_NODE_BY_ID.format(node_type=node_type, id_field=id_field)
            self.execute_query(query, {"node_id": node_id})
            logger.info(
                f"[GraphMemory] 已删除类型为 '{node_type}' 的节点 '{node_id}'。"
            )
            return True
        except Exception as e:
            logger.error(f"[GraphMemory] 删除节点 '{node_id}' 失败: {e}")
            return False

    async def delete_edge(
        self, from_id: str, to_id: str, rel_type: str, from_type: str, to_type: str
    ) -> bool:
        """[异步] 删除一条边。"""
        return await self._run_in_executor(
            self._delete_edge_sync, from_id, to_id, rel_type, from_type, to_type
        )

    def _delete_edge_sync(
        self, from_id: str, to_id: str, rel_type: str, from_type: str, to_type: str
    ) -> bool:
        """[同步] 删除边的实现。"""
        from_id_field = "name" if from_type == "Entity" else "id"
        to_id_field = "name" if to_type == "Entity" else "id"
        try:
            query = DELETE_EDGE.format(
                from_type=from_type,
                from_id_field=from_id_field,
                rel_type=rel_type,
                to_type=to_type,
                to_id_field=to_id_field,
            )
            self.execute_query(query, {"from_id": from_id, "to_id": to_id})
            logger.info(
                f"[GraphMemory] 已删除从 '{from_id}' 到 '{to_id}' 的 `[{rel_type}]` 边。"
            )
            return True
        except Exception as e:
            logger.error(f"[GraphMemory] 删除边失败: {e}")
            return False

    async def migrate_from_v1(self) -> bool:
        """[异步] (占位) 从 v1 数据库迁移数据。"""
        logger.warning("migrate_from_v1 尚未实现。")
        return True

    async def update_node_properties(
        self, node_id: str, node_type: str, properties: dict
    ) -> bool:
        """[异步] 更新节点的属性。"""
        return await self._run_in_executor(
            self._update_node_properties_sync, node_id, node_type, properties
        )

    def _update_node_properties_sync(
        self, node_id: str, node_type: str, properties: dict
    ) -> bool:
        """[同步] 更新节点属性的实现。"""
        id_field = "name" if node_type == "Entity" else "id"

        allowed_updates = {
            "Entity": ["summary", "type"],
            "MemoryFragment": ["text"],
        }

        if node_type not in allowed_updates:
            logger.warning(f"不允许更新节点类型 '{node_type}' 的属性。")
            return False

        set_clauses = []
        params = {"node_id": node_id}

        for key, value in properties.items():
            if key in allowed_updates[node_type]:
                set_clauses.append(f"n.{key} = ${key}")
                params[key] = value

        if not set_clauses:
            logger.warning(f"没有为节点 '{node_id}' 提供有效的待更新属性。")
            return False

        query = f"""
            MATCH (n:{node_type} {{{id_field}: $node_id}})
            SET {", ".join(set_clauses)}
        """

        try:
            self.execute_query(query, params)
            logger.info(f"已更新节点 '{node_id}' 的属性: {list(properties.keys())}")
            return True
        except Exception as e:
            logger.error(f"更新节点 '{node_id}' 失败: {e}")
            return False

    async def add_node_manually(self, node_type: str, properties: dict) -> bool:
        """[异步] 手动创建一个新节点。"""
        return await self._run_in_executor(
            self._add_node_manually_sync, node_type, properties
        )

    def _add_node_manually_sync(self, node_type: str, properties: dict) -> bool:
        """[同步] 手动创建节点的实现。"""
        import time
        import uuid

        try:
            if node_type == "Entity":
                if "name" not in properties:
                    raise ValueError("创建实体时必须提供 'name' 属性。")

                # 从 properties 中提取 session_id（如果存在），但不传给 EntityNode
                session_id = properties.pop("session_id", None)

                entity = EntityNode(**properties)
                params = {
                    "name": entity.name,
                    "type": entity.type,
                    "summary": entity.summary,
                    "embedding": None,
                }
                self.execute_query(ADD_ENTITY, params)
                logger.info(f"[GraphMemory] 已手动创建实体: {entity.name}")

                # 如果提供了 session_id，则直接将会话和实体链接
                if session_id:
                    self.execute_query(
                        LINK_ENTITY_TO_SESSION,
                        {"sid": session_id, "ename": entity.name},
                    )
                    logger.info(
                        f"已将新实体 '{entity.name}' 关联到会话 '{session_id}'。"
                    )

            elif node_type == "MemoryFragment":
                if "text" not in properties:
                    raise ValueError("创建记忆片段时必须提供 'text' 属性。")

                fragment_id = str(uuid.uuid4())
                ts = int(time.time())
                params = {
                    "id": fragment_id,
                    "text": properties["text"],
                    "ts": ts,
                    "embedding": None,
                }
                self.execute_query(CREATE_MEMORY_FRAGMENT, params)

                if "session_id" in properties:
                    self.execute_query(
                        LINK_FRAGMENT_TO_SESSION,
                        {"sid": properties["session_id"], "fid": fragment_id},
                    )

                logger.info(
                    f"[GraphMemory] 已手动创建记忆片段: {properties['text'][:30]}..."
                )
            else:
                raise ValueError(f"不支持手动创建类型为 '{node_type}' 的节点。")

            return True
        except Exception as e:
            logger.error(f"手动创建节点失败: {e}", exc_info=True)
            return False

    async def batch_delete(self, task_name: str, **kwargs) -> int:
        """[异步] 执行预定义的批量删除任务。"""
        return await self._run_in_executor(self._batch_delete_sync, task_name, **kwargs)

    def _batch_delete_sync(self, task_name: str, **kwargs) -> int:
        """[同步] 批量删除的实现。"""
        deleted_count = 0
        if task_name == "delete_isolated_entities":
            res = self.execute_query(BATCH_DELETE_ISOLATED_ENTITIES)
            deleted_count = res.get_next()[0] if res.has_next() else 0
            logger.info(f"[GraphMemory Batch] 删除了 {deleted_count} 个孤立的实体。")
        elif task_name == "delete_old_messages":
            import time

            days = kwargs.get("days", 90)
            params = {"days": days, "current_ts_ms": time.time() * 1000}
            res = self.execute_query(BATCH_DELETE_OLD_MESSAGES_BY_DAYS, params)
            deleted_count = res.get_next()[0] if res.has_next() else 0
            logger.info(
                f"[GraphMemory Batch] 删除了 {deleted_count} 个超过 {days} 天的原始消息。"
            )
        else:
            logger.warning(f"[GraphMemory Batch] 未知的批量删除任务: {task_name}")

        return deleted_count

    # ================= 反思 (Reflection) =================

    async def get_reflection_candidates(self, limit: int = 5) -> list[dict]:
        """[异步] 获取用于反思的候选节点列表。"""
        return await self._run_in_executor(self._get_reflection_candidates_sync, limit)

    def _get_reflection_candidates_sync(self, limit: int) -> list[dict]:
        """[同步] 获取反思候选节点的实现。"""
        try:
            res = self.execute_query(GET_REFLECTION_CANDIDATES, {"limit": limit})
            return (
                [dict(zip(["id", "type", "order_key"], row)) for row in res.get_all()]
                if res.has_next()
                else []
            )
        except Exception as e:
            logger.error(f"[GraphMemory] 获取反思候选节点失败: {e}")
            return []

    async def get_node_context_package(self, node_id: str, node_type: str) -> str:
        """[异步] 为指定节点构建一个包含其邻居信息的文本上下文包。"""
        return await self._run_in_executor(
            self._get_node_context_package_sync, node_id, node_type
        )

    def _get_node_context_package_sync(self, node_id: str, node_type: str) -> str:
        """[同步] 构建上下文包的实现。"""
        id_field = "name" if node_type == "Entity" else "id"
        query = f"""
            MATCH (n:{node_type} {{{id_field}: $node_id}})-[r]-(m)
            RETURN n, r, m
        """
        try:
            res = self.execute_query(query, {"node_id": node_id})
            if not res.has_next():
                return "节点是孤立的，没有上下文。"

            package_lines = []
            main_node_added = False
            while res.has_next():
                n, r, m = res.get_next()
                if not main_node_added:
                    package_lines.append(f"中心节点: {node_type}({node_id})")
                    package_lines.append(f"  - 属性: {n}")
                    main_node_added = True

                relation_label = r["_label"]
                neighbor_label = m["_label"]
                neighbor_id = m.get("id") or m.get("name")

                package_lines.append(
                    f"关系: (中心节点)-[{relation_label}]->{neighbor_label}({neighbor_id})"
                )
                package_lines.append(f"  - 邻居属性: {m}")

            return "\n".join(package_lines)
        except Exception as e:
            logger.error(f"为节点 {node_id} 构建上下文包失败: {e}")
            return ""
