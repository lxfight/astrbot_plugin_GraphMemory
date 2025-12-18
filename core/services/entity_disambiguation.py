"""实体消歧模块"""

from typing import Any

from astrbot.api import logger
from astrbot.api.star import Context

from ..models import EntityNode
from ..storage import GraphStore


class EntityDisambiguation:
    """实体消歧器

    负责:
    - 识别相似实体
    - 判断是否为同一实体
    - 合并重复实体
    """

    def __init__(
        self,
        context: Context,
        graph_store: GraphStore,
        embedding_provider: Any | None = None,
        llm_provider_id: str | None = None,
    ):
        self.context = context
        self.graph_store = graph_store
        self.embedding_provider = embedding_provider
        self.llm_provider_id = llm_provider_id

    async def find_similar_entities(
        self,
        similarity_threshold: float = 0.85,
        limit: int = 100,
    ) -> list[tuple[EntityNode, EntityNode, float]]:
        """查找相似的实体对

        Args:
            similarity_threshold: 相似度阈值
            limit: 检查的实体数量限制

        Returns:
            相似实体对列表 [(实体1, 实体2, 相似度)]
        """
        if not self.embedding_provider:
            logger.warning("[GraphMemory] 未配置 Embedding Provider，无法进行实体消歧")
            return []

        def _find():
            try:
                # 获取所有实体
                result = self.graph_store.conn.execute(
                    """
                    MATCH (e:Entity)
                    WHERE e.embedding IS NOT NULL
                    RETURN e
                    ORDER BY e.importance DESC
                    LIMIT $limit
                    """,
                    {"limit": limit},
                )

                entities = []
                while result.has_next():
                    row = result.get_next()
                    e = row[0]
                    entity = EntityNode(
                        name=e["name"],
                        type=e["type"],
                        description=e["description"],
                        embedding=e.get("embedding"),
                        importance=e.get("importance", 1.0),
                    )
                    entities.append(entity)

                # 计算相似度
                similar_pairs = []
                for i in range(len(entities)):
                    for j in range(i + 1, len(entities)):
                        e1, e2 = entities[i], entities[j]

                        # 跳过类型不同的实体
                        if e1.type != e2.type:
                            continue

                        # 计算余弦相似度
                        if e1.embedding and e2.embedding:
                            similarity = self._cosine_similarity(e1.embedding, e2.embedding)
                            if similarity >= similarity_threshold:
                                similar_pairs.append((e1, e2, similarity))

                # 按相似度排序
                similar_pairs.sort(key=lambda x: x[2], reverse=True)

                return similar_pairs

            except Exception as e:
                logger.error(f"[GraphMemory] 查找相似实体失败: {e}", exc_info=True)
                return []

        return await self.graph_store._execute_in_thread(_find)

    def _cosine_similarity(self, vec1: list[float], vec2: list[float]) -> float:
        """计算余弦相似度"""
        import math

        if len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    async def should_merge(self, entity1: EntityNode, entity2: EntityNode) -> bool:
        """使用 LLM 判断两个实体是否应该合并

        Args:
            entity1: 实体1
            entity2: 实体2

        Returns:
            是否应该合并
        """
        # 确定使用的 LLM Provider
        provider_id = self.llm_provider_id
        if not provider_id:
            # 使用默认 Provider
            provider_id = None

        prompt = f"""判断以下两个实体是否指向同一个事物：

实体1:
- 名称: {entity1.name}
- 类型: {entity1.type}
- 描述: {entity1.description}

实体2:
- 名称: {entity2.name}
- 类型: {entity2.type}
- 描述: {entity2.description}

请仔细分析两个实体的名称和描述，判断它们是否指向同一个事物。
只回答 "是" 或 "否"，不要解释。
"""

        try:
            resp = await self.context.llm_generate(
                chat_provider_id=provider_id,
                prompt=prompt,
            )

            if not resp or not resp.completion_text:
                return False

            answer = resp.completion_text.strip().lower()
            return "是" in answer or "yes" in answer

        except Exception as e:
            logger.error(f"[GraphMemory] LLM 判断失败: {e}", exc_info=True)
            return False

    async def merge_entities(self, entity1_name: str, entity2_name: str) -> bool:
        """合并两个实体

        将 entity2 合并到 entity1，保留 entity1 的名称和描述，
        合并所有关系，删除 entity2

        Args:
            entity1_name: 保留的实体名称
            entity2_name: 要合并的实体名称

        Returns:
            是否成功
        """
        def _merge():
            try:
                # 1. 获取两个实体
                e1 = self.graph_store.conn.execute(
                    "MATCH (e:Entity {name: $name}) RETURN e",
                    {"name": entity1_name},
                )
                e2 = self.graph_store.conn.execute(
                    "MATCH (e:Entity {name: $name}) RETURN e",
                    {"name": entity2_name},
                )

                if not e1.has_next() or not e2.has_next():
                    logger.warning(f"[GraphMemory] 实体不存在: {entity1_name} 或 {entity2_name}")
                    return False

                # 2. 合并重要性和访问次数
                self.graph_store.conn.execute(
                    """
                    MATCH (e1:Entity {name: $name1}), (e2:Entity {name: $name2})
                    SET e1.importance = e1.importance + e2.importance,
                        e1.access_count = e1.access_count + e2.access_count
                    """,
                    {"name1": entity1_name, "name2": entity2_name},
                )

                # 3. 将 entity2 的所有出边关系转移到 entity1
                self.graph_store.conn.execute(
                    """
                    MATCH (e2:Entity {name: $name2})-[r:RELATED_TO]->(target:Entity)
                    WHERE target.name <> $name1
                    MATCH (e1:Entity {name: $name1})
                    MERGE (e1)-[new_r:RELATED_TO]->(target)
                    ON CREATE SET
                        new_r.relation = r.relation,
                        new_r.strength = r.strength,
                        new_r.evidence = r.evidence,
                        new_r.created_at = r.created_at,
                        new_r.last_updated = r.last_updated
                    ON MATCH SET
                        new_r.strength = new_r.strength + r.strength,
                        new_r.evidence = new_r.evidence + '; ' + r.evidence
                    """,
                    {"name1": entity1_name, "name2": entity2_name},
                )

                # 4. 将 entity2 的所有入边关系转移到 entity1
                self.graph_store.conn.execute(
                    """
                    MATCH (source:Entity)-[r:RELATED_TO]->(e2:Entity {name: $name2})
                    WHERE source.name <> $name1
                    MATCH (e1:Entity {name: $name1})
                    MERGE (source)-[new_r:RELATED_TO]->(e1)
                    ON CREATE SET
                        new_r.relation = r.relation,
                        new_r.strength = r.strength,
                        new_r.evidence = r.evidence,
                        new_r.created_at = r.created_at,
                        new_r.last_updated = r.last_updated
                    ON MATCH SET
                        new_r.strength = new_r.strength + r.strength,
                        new_r.evidence = new_r.evidence + '; ' + r.evidence
                    """,
                    {"name1": entity1_name, "name2": entity2_name},
                )

                # 5. 转移 MENTIONED_IN 关系
                self.graph_store.conn.execute(
                    """
                    MATCH (e2:Entity {name: $name2})-[r:MENTIONED_IN]->(s:Session)
                    MATCH (e1:Entity {name: $name1})
                    MERGE (e1)-[new_r:MENTIONED_IN]->(s)
                    ON CREATE SET
                        new_r.first_mentioned = r.first_mentioned,
                        new_r.last_mentioned = r.last_mentioned,
                        new_r.mention_count = r.mention_count,
                        new_r.sentiment = r.sentiment
                    ON MATCH SET
                        new_r.mention_count = new_r.mention_count + r.mention_count,
                        new_r.last_mentioned = CASE
                            WHEN r.last_mentioned > new_r.last_mentioned THEN r.last_mentioned
                            ELSE new_r.last_mentioned
                        END
                    """,
                    {"name1": entity1_name, "name2": entity2_name},
                )

                # 6. 删除 entity2
                self.graph_store.conn.execute(
                    """
                    MATCH (e:Entity {name: $name})
                    DETACH DELETE e
                    """,
                    {"name": entity2_name},
                )

                logger.info(f"[GraphMemory] 成功合并实体: {entity2_name} -> {entity1_name}")
                return True

            except Exception as e:
                logger.error(f"[GraphMemory] 合并实体失败: {e}", exc_info=True)
                return False

        return await self.graph_store._execute_in_thread(_merge)

    async def run_disambiguation(
        self,
        similarity_threshold: float = 0.85,
        auto_merge: bool = False,
    ) -> dict:
        """运行实体消歧

        Args:
            similarity_threshold: 相似度阈值
            auto_merge: 是否自动合并（不使用 LLM 判断）

        Returns:
            消歧结果统计
        """
        logger.info("[GraphMemory] 开始实体消歧...")

        # 查找相似实体
        similar_pairs = await self.find_similar_entities(similarity_threshold)

        if not similar_pairs:
            logger.info("[GraphMemory] 未找到相似实体")
            return {"found": 0, "merged": 0}

        logger.info(f"[GraphMemory] 找到 {len(similar_pairs)} 对相似实体")

        # 合并实体
        merged_count = 0
        for e1, e2, similarity in similar_pairs:
            # 判断是否应该合并
            should_merge = auto_merge or await self.should_merge(e1, e2)

            if should_merge:
                success = await self.merge_entities(e1.name, e2.name)
                if success:
                    merged_count += 1
                    logger.info(
                        f"[GraphMemory] 合并实体: {e2.name} -> {e1.name} (相似度: {similarity:.2f})"
                    )

        logger.info(f"[GraphMemory] 实体消歧完成，合并了 {merged_count} 对实体")

        return {
            "found": len(similar_pairs),
            "merged": merged_count,
        }
