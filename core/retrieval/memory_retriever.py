"""记忆检索模块"""

import math
from typing import Any

from astrbot.api import logger

from ..models import EntityNode
from ..storage import GraphStore

# 检查 jieba 是否可用
try:
    import jieba.analyse
    JIEBA_AVAILABLE = True
except ImportError:
    JIEBA_AVAILABLE = False


def _load_stopwords(stopwords_path: str) -> set[str]:
    """加载停用词表"""
    try:
        from pathlib import Path
        path = Path(stopwords_path)
        if path.exists():
            with open(path, encoding="utf-8") as f:
                stopwords = {line.strip() for line in f if line.strip()}
            logger.info(f"[GraphMemory] 加载了 {len(stopwords)} 个停用词")
            return stopwords
    except Exception as e:
        logger.warning(f"[GraphMemory] 加载停用词失败: {e}")
    return set()


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
        embedding_provider: Any | None = None,
        stopwords_path: str | None = None,
        vector_weight: float = 0.7,
        keyword_weight: float = 0.3,
    ):
        self.graph_store = graph_store
        self.embedding_provider = embedding_provider
        self.vector_weight = vector_weight
        self.keyword_weight = keyword_weight

        # 加载停用词
        self.stopwords = set()
        if stopwords_path:
            self.stopwords = _load_stopwords(stopwords_path)

    async def search_memory(
        self,
        query: str,
        query_embedding: list[float] | None,
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

        # 3. 合并去重（应用权重）
        all_entities = self._merge_results_with_weights(vector_results, keyword_results)

        # 4. 过滤当前人格相关的实体
        filtered_entities = await self._filter_by_persona(
            all_entities,
            persona_id,
        )

        # 5. 重排序（考虑重要性、访问频率、时间衰减）
        reranked_entities = self._rerank_results(filtered_entities)

        # 6. 取 top_k
        top_entities = reranked_entities[:top_k]

        # 7. 格式化输出
        return self._format_memory_context(top_entities)

    async def _vector_search(
        self,
        query_embedding: list[float],
        top_k: int,
    ) -> list[tuple[EntityNode, float]]:
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
    ) -> list[tuple[EntityNode, float]]:
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

    def _extract_keywords(self, text: str, top_k: int = 5) -> list[str]:
        """提取关键词

        Args:
            text: 文本
            top_k: 返回关键词数量

        Returns:
            关键词列表
        """
        if JIEBA_AVAILABLE:
            try:
                keywords = jieba.analyse.extract_tags(text, topK=top_k * 2)
                # 过滤停用词
                if self.stopwords:
                    keywords = [kw for kw in keywords if kw not in self.stopwords]
                return keywords[:top_k]
            except Exception as e:
                logger.warning(f"[GraphMemory] jieba 提取关键词失败: {e}")

        # 简单的分词（过滤停用词）
        words = text.split()
        if self.stopwords:
            words = [w for w in words if w not in self.stopwords]
        return words[:top_k]

    def _merge_results(
        self,
        vector_results: list[tuple[EntityNode, float]],
        keyword_results: list[tuple[EntityNode, float]],
    ) -> list[tuple[EntityNode, float]]:
        """合并检索结果（旧方法，保留兼容性）

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

    def _merge_results_with_weights(
        self,
        vector_results: list[tuple[EntityNode, float]],
        keyword_results: list[tuple[EntityNode, float]],
    ) -> list[tuple[EntityNode, float]]:
        """合并检索结果（应用权重）

        Args:
            vector_results: 向量检索结果
            keyword_results: 关键词检索结果

        Returns:
            合并后的结果
        """
        # 使用字典去重，加权合并分数
        merged = {}

        # 向量检索结果（应用向量权重）
        for entity, score in vector_results:
            weighted_score = score * self.vector_weight
            if entity.name not in merged:
                merged[entity.name] = [entity, 0.0, False, False]
            merged[entity.name][1] += weighted_score
            merged[entity.name][2] = True  # 标记来自向量检索

        # 关键词检索结果（应用关键词权重）
        for entity, score in keyword_results:
            weighted_score = score * self.keyword_weight
            if entity.name not in merged:
                merged[entity.name] = [entity, 0.0, False, False]
            merged[entity.name][1] += weighted_score
            merged[entity.name][3] = True  # 标记来自关键词检索

        # 如果同时出现在两种检索中，给予额外加分
        for name, data in merged.items():
            if data[2] and data[3]:  # 同时来自向量和关键词检索
                data[1] *= 1.2  # 加分 20%

        # 转换为列表
        return [(data[0], data[1]) for data in merged.values()]

    def _rerank_results(
        self,
        entities: list[tuple[EntityNode, float]],
    ) -> list[tuple[EntityNode, float]]:
        """重排序结果

        考虑因素:
        1. 检索分数
        2. 实体重要性
        3. 访问频率
        4. 时间衰减（通过 importance 已体现）

        Args:
            entities: 实体列表

        Returns:
            重排序后的实体列表
        """
        reranked = []

        for entity, search_score in entities:
            # 计算综合分数
            # 检索分数权重: 60%
            # 重要性权重: 30%
            # 访问频率权重: 10%
            importance_score = entity.importance if entity.importance else 0.5
            access_score = min(entity.access_count / 100.0, 1.0) if entity.access_count else 0.0

            final_score = (
                search_score * 0.6 +
                importance_score * 0.3 +
                access_score * 0.1
            )

            reranked.append((entity, final_score))

        # 按最终分数排序
        reranked.sort(key=lambda x: x[1], reverse=True)

        return reranked

    async def _filter_by_persona(
        self,
        entities: list[tuple[EntityNode, float]],
        persona_id: str,
    ) -> list[tuple[EntityNode, float]]:
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
        entities: list[tuple[EntityNode, float]],
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

        # 添加关系信息
        relations = self._get_relations_between_entities(entities)
        if relations:
            lines.append("")
            lines.append("关系:")
            for rel in relations:
                lines.append(f"- {rel['from']} -> {rel['to']}: {rel['relation']}")

        return "\n".join(lines)

    def _get_relations_between_entities(
        self,
        entities: list[tuple[EntityNode, float]],
    ) -> list[dict]:
        """获取实体之间的关系

        Args:
            entities: 实体列表

        Returns:
            关系列表
        """
        if len(entities) < 2:
            return []

        entity_names = [e[0].name for e in entities]

        try:
            result = self.graph_store.conn.execute(
                """
                MATCH (e1:Entity)-[r:RELATED_TO]->(e2:Entity)
                WHERE e1.name IN $names AND e2.name IN $names
                RETURN e1.name as from, e2.name as to, r.relation as relation, r.strength as strength
                ORDER BY r.strength DESC
                LIMIT 10
                """,
                {"names": entity_names},
            )

            relations = []
            while result.has_next():
                row = result.get_next()
                relations.append({
                    "from": row[0],
                    "to": row[1],
                    "relation": row[2],
                    "strength": row[3],
                })

            return relations
        except Exception as e:
            logger.error(f"[GraphMemory] 获取关系失败: {e}", exc_info=True)
            return []
