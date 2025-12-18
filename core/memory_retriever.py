"""记忆检索模块"""

import math
from typing import List, Optional, Any, Tuple

from astrbot.api import logger

from .graph_store import GraphStore
from .entities import EntityNode


# 检查 jieba 是否可用
try:
    import jieba.analyse
    JIEBA_AVAILABLE = True
except ImportError:
    JIEBA_AVAILABLE = False


class MemoryRetriever:
    """记忆检索器

    负责:
    - 向量检索
    - 关键词检索
    - 混合检索
    - 结果格式化
    """

    def __init__(
        self,
        graph_store: GraphStore,
        embedding_provider: Optional[Any] = None,
    ):
        self.graph_store = graph_store
        self.embedding_provider = embedding_provider

    async def search_memory(
        self,
        query: str,
        query_embedding: Optional[List[float]],
        session_id: str,
        persona_id: str,
        top_k: int = 7,
    ) -> str:
        """混合检索记忆

        Args:
            query: 查询文本
            query_embedding: 查询向量
            session_id: 会话ID
            persona_id: 人格ID
            top_k: 返回结果数量

        Returns:
            格式化的记忆文本
        """
        # 1. 向量检索
        vector_results = []
        if query_embedding:
            vector_results = await self._vector_search(query_embedding, top_k * 2)

        # 2. 关键词检索
        keyword_results = await self._keyword_search(query, top_k)

        # 3. 合并去重
        all_entities = self._merge_results(vector_results, keyword_results)

        # 4. 过滤当前人格相关的实体
        filtered_entities = await self._filter_by_persona(
            all_entities,
            persona_id,
        )

        # 5. 排序并取 top_k
        sorted_entities = sorted(
            filtered_entities,
            key=lambda x: x[1],  # 按分数排序
            reverse=True,
        )[:top_k]

        # 6. 格式化输出
        return self._format_memory_context(sorted_entities)

    async def _vector_search(
        self,
        query_embedding: List[float],
        top_k: int,
    ) -> List[Tuple[EntityNode, float]]:
        """向量检索

        Args:
            query_embedding: 查询向量
            top_k: 返回结果数量

        Returns:
            (实体, 相似度分数) 列表
        """
        def _search():
            try:
                # 使用余弦相似度搜索
                result = self.graph_store.conn.execute(
                    """
                    MATCH (e:Entity)
                    WHERE e.embedding IS NOT NULL
                    WITH e,
                        array_cosine_similarity(e.embedding, $query_embedding) as similarity
                    WHERE similarity > 0.5
                    RETURN e, similarity
                    ORDER BY similarity DESC
                    LIMIT $top_k
                    """,
                    {
                        "query_embedding": query_embedding,
                        "top_k": top_k,
                    },
                )

                results = []
                while result.has_next():
                    row = result.get_next()
                    e = row[0]
                    similarity = row[1]

                    entity = EntityNode(
                        name=e["name"],
                        type=e["type"],
                        description=e["description"],
                        importance=e.get("importance", 1.0),
                    )
                    results.append((entity, similarity))

                return results
            except Exception as e:
                logger.error(f"[GraphMemory] 向量检索失败: {e}", exc_info=True)
                return []

        return await self.graph_store._execute_in_thread(_search)

    async def _keyword_search(
        self,
        query: str,
        top_k: int,
    ) -> List[Tuple[EntityNode, float]]:
        """关键词检索

        Args:
            query: 查询文本
            top_k: 返回结果数量

        Returns:
            (实体, 匹配分数) 列表
        """
        # 提取关键词
        keywords = self._extract_keywords(query)
        if not keywords:
            return []

        def _search():
            try:
                results = []
                for keyword in keywords:
                    result = self.graph_store.conn.execute(
                        """
                        MATCH (e:Entity)
                        WHERE e.name CONTAINS $keyword OR e.description CONTAINS $keyword
                        RETURN e
                        LIMIT $top_k
                        """,
                        {
                            "keyword": keyword,
                            "top_k": top_k,
                        },
                    )

                    while result.has_next():
                        row = result.get_next()
                        e = row[0]

                        entity = EntityNode(
                            name=e["name"],
                            type=e["type"],
                            description=e["description"],
                            importance=e.get("importance", 1.0),
                        )
                        # 简单的匹配分数
                        score = 0.8 if keyword in e["name"] else 0.6
                        results.append((entity, score))

                return results
            except Exception as e:
                logger.error(f"[GraphMemory] 关键词检索失败: {e}", exc_info=True)
                return []

        return await self.graph_store._execute_in_thread(_search)

    def _extract_keywords(self, text: str, top_k: int = 5) -> List[str]:
        """提取关键词

        Args:
            text: 文本
            top_k: 返回关键词数量

        Returns:
            关键词列表
        """
        if JIEBA_AVAILABLE:
            try:
                keywords = jieba.analyse.extract_tags(text, topK=top_k)
                return keywords
            except Exception as e:
                logger.warning(f"[GraphMemory] jieba 提取关键词失败: {e}")

        # 简单的分词
        words = text.split()
        return words[:top_k]

    def _merge_results(
        self,
        vector_results: List[Tuple[EntityNode, float]],
        keyword_results: List[Tuple[EntityNode, float]],
    ) -> List[Tuple[EntityNode, float]]:
        """合并检索结果

        Args:
            vector_results: 向量检索结果
            keyword_results: 关键词检索结果

        Returns:
            合并后的结果
        """
        # 使用字典去重，保留最高分数
        merged = {}
        for entity, score in vector_results + keyword_results:
            if entity.name not in merged or merged[entity.name][1] < score:
                merged[entity.name] = (entity, score)

        return list(merged.values())

    async def _filter_by_persona(
        self,
        entities: List[Tuple[EntityNode, float]],
        persona_id: str,
    ) -> List[Tuple[EntityNode, float]]:
        """过滤当前人格相关的实体

        Args:
            entities: 实体列表
            persona_id: 人格ID

        Returns:
            过滤后的实体列表
        """
        def _filter():
            try:
                filtered = []
                for entity, score in entities:
                    # 查询实体是否在当前人格的会话中被提及
                    result = self.graph_store.conn.execute(
                        """
                        MATCH (e:Entity {name: $entity_name})-[:MENTIONED_IN]->(s:Session)
                        WHERE s.persona_id = $persona_id
                        RETURN COUNT(s) as count
                        """,
                        {
                            "entity_name": entity.name,
                            "persona_id": persona_id,
                        },
                    )

                    if result.has_next():
                        count = result.get_next()[0]
                        if count > 0:
                            # 根据提及次数调整分数
                            adjusted_score = score * (1 + math.log(count + 1) * 0.1)
                            filtered.append((entity, adjusted_score))

                return filtered
            except Exception as e:
                logger.error(f"[GraphMemory] 人格过滤失败: {e}", exc_info=True)
                return entities  # 失败时返回原始结果

        return await self.graph_store._execute_in_thread(_filter)

    def _format_memory_context(
        self,
        entities: List[Tuple[EntityNode, float]],
    ) -> str:
        """格式化记忆上下文

        Args:
            entities: 实体列表

        Returns:
            格式化的文本
        """
        if not entities:
            return ""

        lines = ["[记忆上下文]", ""]
        lines.append("实体:")
        for entity, score in entities:
            lines.append(f"- {entity.name} ({entity.type}): {entity.description}")

        # TODO: 添加关系信息

        return "\n".join(lines)
