"""图数据库存储模块"""

import asyncio
import functools
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import kuzu

from astrbot.api import logger

from ..models import (
    EntityNode,
    RelatedToRel,
    SessionNode,
    UserNode,
    get_embedding_dim_from_provider,
    initialize_schema,
)


class GraphStore:
    """图数据库存储

    负责:
    - 管理 KuzuDB 连接
    - 提供节点和关系的 CRUD 操作
    - 执行图查询
    """

    def __init__(self, db_path: Path, embedding_provider: Any | None = None):
        self.db_path = db_path / "kuzu_db_v3"
        # 只创建父目录，让 KuzuDB 自己创建数据库目录
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        self.embedding_provider = embedding_provider
        self.embedding_dim = get_embedding_dim_from_provider(embedding_provider)

        # 初始化数据库
        self.db = kuzu.Database(str(self.db_path))
        self.conn = kuzu.Connection(self.db)

        # 初始化 Schema
        initialize_schema(self.db, self.conn, self.embedding_dim)

        # 单线程执行器，确保线程安全
        self._executor = ThreadPoolExecutor(max_workers=1)

        logger.info(f"[GraphMemory] GraphStore 初始化完成 (路径: {self.db_path})")

    def close(self):
        """关闭数据库连接"""
        if self._executor:
            self._executor.shutdown(wait=True)
        logger.info("[GraphMemory] GraphStore 已关闭")

    async def _execute_in_thread(self, func, *args, **kwargs):
        """在线程池中执行数据库操作"""
        loop = asyncio.get_event_loop()
        partial_func = functools.partial(func, *args, **kwargs)
        return await loop.run_in_executor(self._executor, partial_func)

    # ==================== User 节点操作 ====================

    async def add_user(self, user: UserNode) -> bool:
        """添加或更新用户节点"""
        def _add():
            try:
                now = datetime.now(timezone.utc)
                self.conn.execute(
                    """
                    MERGE (u:User {id: $id})
                    ON CREATE SET
                        u.name = $name,
                        u.platform = $platform,
                        u.created_at = $created_at,
                        u.last_active = $last_active
                    ON MATCH SET
                        u.name = $name,
                        u.last_active = $last_active
                    """,
                    {
                        "id": user.id,
                        "name": user.name,
                        "platform": user.platform,
                        "created_at": user.created_at or now,
                        "last_active": user.last_active or now,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 添加用户失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_add)

    # ==================== Session 节点操作 ====================

    async def add_session(self, session: SessionNode) -> bool:
        """添加或更新会话节点"""
        def _add():
            try:
                now = datetime.now(timezone.utc)
                self.conn.execute(
                    """
                    MERGE (s:Session {id: $id})
                    ON CREATE SET
                        s.name = $name,
                        s.type = $type,
                        s.persona_id = $persona_id,
                        s.created_at = $created_at,
                        s.last_active = $last_active
                    ON MATCH SET
                        s.name = $name,
                        s.persona_id = $persona_id,
                        s.last_active = $last_active
                    """,
                    {
                        "id": session.id,
                        "name": session.name,
                        "type": session.type,
                        "persona_id": session.persona_id,
                        "created_at": session.created_at or now,
                        "last_active": session.last_active or now,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 添加会话失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_add)

    # ==================== Entity 节点操作 ====================

    async def add_entity(self, entity: EntityNode) -> bool:
        """添加或更新实体节点

        注意: entity.embedding 应该在调用此方法前已经生成
        """
        # 如果没有 embedding，在这里生成（异步）
        if not entity.embedding and self.embedding_provider and entity.description:
            try:
                entity.embedding = await self.embedding_provider.get_embedding(entity.description)
            except Exception as e:
                logger.warning(f"[GraphMemory] 生成 embedding 失败: {e}")
                entity.embedding = [0.0] * self.embedding_dim

        if not entity.embedding:
            entity.embedding = [0.0] * self.embedding_dim

        def _add():
            try:
                now = datetime.now(timezone.utc)
                embedding = entity.embedding

                self.conn.execute(
                    """
                    MERGE (e:Entity {name: $name})
                    ON CREATE SET
                        e.type = $type,
                        e.description = $description,
                        e.embedding = $embedding,
                        e.importance = $importance,
                        e.created_at = $created_at,
                        e.last_accessed = $last_accessed,
                        e.access_count = $access_count
                    ON MATCH SET
                        e.description = $description,
                        e.embedding = $embedding,
                        e.last_accessed = $last_accessed,
                        e.access_count = e.access_count + 1,
                        e.importance = CASE
                            WHEN e.importance < 1.0 THEN e.importance + 0.1
                            ELSE 1.0
                        END
                    """,
                    {
                        "name": entity.name,
                        "type": entity.type,
                        "description": entity.description,
                        "embedding": embedding,
                        "importance": entity.importance,
                        "created_at": entity.created_at or now,
                        "last_accessed": entity.last_accessed or now,
                        "access_count": entity.access_count,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 添加实体失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_add)

    async def get_entity(self, name: str) -> EntityNode | None:
        """获取实体节点"""
        def _get():
            try:
                result = self.conn.execute(
                    "MATCH (e:Entity {name: $name}) RETURN e",
                    {"name": name},
                )
                if result.has_next():
                    row = result.get_next()
                    e = row[0]
                    return EntityNode(
                        name=e["name"],
                        type=e["type"],
                        description=e["description"],
                        embedding=e.get("embedding"),
                        importance=e.get("importance", 1.0),
                        created_at=e.get("created_at"),
                        last_accessed=e.get("last_accessed"),
                        access_count=e.get("access_count", 0),
                    )
                return None
            except Exception as e:
                logger.error(f"[GraphMemory] 获取实体失败: {e}", exc_info=True)
                return None

        return await self._execute_in_thread(_get)

    # ==================== 关系操作 ====================

    async def add_relation(self, relation: RelatedToRel) -> bool:
        """添加或更新实体关系"""
        def _add():
            try:
                now = datetime.now(timezone.utc)
                self.conn.execute(
                    """
                    MATCH (e1:Entity {name: $from}), (e2:Entity {name: $to})
                    MERGE (e1)-[r:RELATED_TO]->(e2)
                    ON CREATE SET
                        r.relation = $relation,
                        r.strength = $strength,
                        r.evidence = $evidence,
                        r.created_at = $created_at,
                        r.last_updated = $last_updated
                    ON MATCH SET
                        r.relation = $relation,
                        r.evidence = $evidence,
                        r.last_updated = $last_updated,
                        r.strength = CASE
                            WHEN r.strength < 1.0 THEN r.strength + 0.1
                            ELSE 1.0
                        END
                    """,
                    {
                        "from": relation.from_entity,
                        "to": relation.to_entity,
                        "relation": relation.relation,
                        "strength": relation.strength,
                        "evidence": relation.evidence,
                        "created_at": relation.created_at or now,
                        "last_updated": relation.last_updated or now,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 添加关系失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_add)

    async def link_entity_to_session(
        self,
        entity_name: str,
        session_id: str,
        sentiment: str = "NEUTRAL",
    ) -> bool:
        """将实体关联到会话"""
        def _link():
            try:
                now = datetime.now(timezone.utc)
                self.conn.execute(
                    """
                    MATCH (e:Entity {name: $entity_name}), (s:Session {id: $session_id})
                    MERGE (e)-[r:MENTIONED_IN]->(s)
                    ON CREATE SET
                        r.first_mentioned = $now,
                        r.last_mentioned = $now,
                        r.mention_count = 1,
                        r.sentiment = $sentiment
                    ON MATCH SET
                        r.last_mentioned = $now,
                        r.mention_count = r.mention_count + 1
                    """,
                    {
                        "entity_name": entity_name,
                        "session_id": session_id,
                        "now": now,
                        "sentiment": sentiment,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 关联实体到会话失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_link)

    async def link_user_to_session(
        self,
        user_id: str,
        session_id: str,
        role: str = "MEMBER",
    ) -> bool:
        """将用户关联到会话"""
        def _link():
            try:
                now = datetime.now(timezone.utc)
                self.conn.execute(
                    """
                    MATCH (u:User {id: $user_id}), (s:Session {id: $session_id})
                    MERGE (u)-[r:PARTICIPATED_IN]->(s)
                    ON CREATE SET
                        r.role = $role,
                        r.joined_at = $joined_at
                    """,
                    {
                        "user_id": user_id,
                        "session_id": session_id,
                        "role": role,
                        "joined_at": now,
                    },
                )
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 关联用户到会话失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_link)

    # ==================== 统计查询 ====================

    async def get_stats(self) -> dict:
        """获取图谱统计信息"""
        def _get_stats():
            try:
                stats = {}

                # 统计节点数
                result = self.conn.execute("MATCH (u:User) RETURN COUNT(u) as count")
                stats["users"] = result.get_next()[0] if result.has_next() else 0

                result = self.conn.execute("MATCH (s:Session) RETURN COUNT(s) as count")
                stats["sessions"] = result.get_next()[0] if result.has_next() else 0

                result = self.conn.execute("MATCH (e:Entity) RETURN COUNT(e) as count")
                stats["entities"] = result.get_next()[0] if result.has_next() else 0

                # 统计关系数
                result = self.conn.execute("MATCH ()-[r:RELATED_TO]->() RETURN COUNT(r) as count")
                stats["relations"] = result.get_next()[0] if result.has_next() else 0

                return stats
            except Exception as e:
                logger.error(f"[GraphMemory] 获取统计信息失败: {e}", exc_info=True)
                return {}

        return await self._execute_in_thread(_get_stats)

    # ==================== 维护操作 ====================

    async def apply_time_decay(self, decay_rate: float = 0.95):
        """应用时间衰减"""
        def _decay():
            try:
                # 衰减实体重要性
                self.conn.execute(
                    """
                    MATCH (e:Entity)
                    SET e.importance = e.importance * $decay_rate
                    """,
                    {"decay_rate": decay_rate},
                )

                # 衰减关系强度
                self.conn.execute(
                    """
                    MATCH ()-[r:RELATED_TO]->()
                    SET r.strength = r.strength * $decay_rate
                    """,
                    {"decay_rate": decay_rate},
                )

                logger.info(f"[GraphMemory] 时间衰减完成 (衰减率: {decay_rate})")
                return True
            except Exception as e:
                logger.error(f"[GraphMemory] 时间衰减失败: {e}", exc_info=True)
                return False

        return await self._execute_in_thread(_decay)

    async def prune_low_importance_entities(self, threshold: float = 0.1) -> int:
        """清理低重要性实体"""
        def _prune():
            try:
                # 删除低重要性实体
                result = self.conn.execute(
                    """
                    MATCH (e:Entity)
                    WHERE e.importance < $threshold
                    DETACH DELETE e
                    RETURN COUNT(e) as count
                    """,
                    {"threshold": threshold},
                )
                count = result.get_next()[0] if result.has_next() else 0
                logger.info(f"[GraphMemory] 清理了 {count} 个低重要性实体")
                return count
            except Exception as e:
                logger.error(f"[GraphMemory] 清理实体失败: {e}", exc_info=True)
                return 0

        return await self._execute_in_thread(_prune)

    # ==================== 搜索和管理操作 ====================

    async def search_entities(
        self,
        query: str,
        entity_type: str | None = None,
        limit: int = 10,
    ) -> list[EntityNode]:
        """搜索实体

        Args:
            query: 搜索关键词
            entity_type: 实体类型过滤（可选）
            limit: 返回结果数量

        Returns:
            实体列表
        """
        def _search():
            try:
                # 构建查询条件
                where_clauses = []
                params = {"query": query, "limit": limit}

                # 关键词匹配
                where_clauses.append("(e.name CONTAINS $query OR e.description CONTAINS $query)")

                # 类型过滤
                if entity_type:
                    where_clauses.append("e.type = $entity_type")
                    params["entity_type"] = entity_type

                where_clause = " AND ".join(where_clauses)

                # 执行查询
                result = self.conn.execute(
                    f"""
                    MATCH (e:Entity)
                    WHERE {where_clause}
                    RETURN e
                    ORDER BY e.importance DESC, e.access_count DESC
                    LIMIT $limit
                    """,
                    params,
                )

                entities = []
                while result.has_next():
                    row = result.get_next()
                    e = row[0]
                    entity = EntityNode(
                        name=e["name"],
                        type=e["type"],
                        description=e["description"],
                        importance=e.get("importance", 1.0),
                        created_at=e.get("created_at"),
                        last_accessed=e.get("last_accessed"),
                        access_count=e.get("access_count", 0),
                    )
                    entities.append(entity)

                return entities
            except Exception as e:
                logger.error(f"[GraphMemory] 搜索实体失败: {e}", exc_info=True)
                return []

        return await self._execute_in_thread(_search)

    async def get_entity_relations(self, entity_name: str) -> list[dict]:
        """获取实体的所有关系

        Args:
            entity_name: 实体名称

        Returns:
            关系列表
        """
        def _get_relations():
            try:
                relations = []

                # 获取出边关系
                result = self.conn.execute(
                    """
                    MATCH (e1:Entity {name: $name})-[r:RELATED_TO]->(e2:Entity)
                    RETURN e1.name as from, e2.name as to, r.relation as relation,
                           r.strength as strength, r.evidence as evidence
                    """,
                    {"name": entity_name},
                )

                while result.has_next():
                    row = result.get_next()
                    relations.append({
                        "from": row[0],
                        "to": row[1],
                        "relation": row[2],
                        "strength": row[3],
                        "evidence": row[4],
                        "direction": "outgoing",
                    })

                # 获取入边关系
                result = self.conn.execute(
                    """
                    MATCH (e1:Entity)-[r:RELATED_TO]->(e2:Entity {name: $name})
                    RETURN e1.name as from, e2.name as to, r.relation as relation,
                           r.strength as strength, r.evidence as evidence
                    """,
                    {"name": entity_name},
                )

                while result.has_next():
                    row = result.get_next()
                    relations.append({
                        "from": row[0],
                        "to": row[1],
                        "relation": row[2],
                        "strength": row[3],
                        "evidence": row[4],
                        "direction": "incoming",
                    })

                return relations
            except Exception as e:
                logger.error(f"[GraphMemory] 获取实体关系失败: {e}", exc_info=True)
                return []

        return await self._execute_in_thread(_get_relations)

    async def delete_entity(self, entity_name: str) -> tuple[bool, int]:
        """删除实体及其所有关系

        Args:
            entity_name: 实体名称

        Returns:
            (是否成功, 删除的关系数量)
        """
        def _delete():
            try:
                # 统计关系数量
                result = self.conn.execute(
                    """
                    MATCH (e:Entity {name: $name})-[r]-()
                    RETURN COUNT(r) as count
                    """,
                    {"name": entity_name},
                )
                relation_count = result.get_next()[0] if result.has_next() else 0

                # 删除实体（DETACH DELETE 会自动删除所有关系）
                self.conn.execute(
                    """
                    MATCH (e:Entity {name: $name})
                    DETACH DELETE e
                    """,
                    {"name": entity_name},
                )

                logger.info(f"[GraphMemory] 删除实体 '{entity_name}' 及其 {relation_count} 条关系")
                return True, relation_count
            except Exception as e:
                logger.error(f"[GraphMemory] 删除实体失败: {e}", exc_info=True)
                return False, 0

        return await self._execute_in_thread(_delete)

    async def export_graph(self, persona_id: str | None = None) -> dict:
        """导出图谱数据

        Args:
            persona_id: 人格ID过滤（可选）

        Returns:
            图谱数据字典
        """
        def _export():
            try:
                data = {
                    "version": "0.4.0",
                    "entities": [],
                    "relations": [],
                    "sessions": [],
                }

                # 导出实体
                if persona_id:
                    # 只导出指定人格相关的实体
                    result = self.conn.execute(
                        """
                        MATCH (e:Entity)-[:MENTIONED_IN]->(s:Session {persona_id: $persona_id})
                        RETURN DISTINCT e
                        """,
                        {"persona_id": persona_id},
                    )
                else:
                    # 导出所有实体
                    result = self.conn.execute("MATCH (e:Entity) RETURN e")

                while result.has_next():
                    row = result.get_next()
                    e = row[0]
                    data["entities"].append({
                        "name": e["name"],
                        "type": e["type"],
                        "description": e["description"],
                        "importance": e.get("importance", 1.0),
                        "access_count": e.get("access_count", 0),
                    })

                # 导出关系
                entity_names = [e["name"] for e in data["entities"]]
                if entity_names:
                    result = self.conn.execute(
                        """
                        MATCH (e1:Entity)-[r:RELATED_TO]->(e2:Entity)
                        WHERE e1.name IN $names AND e2.name IN $names
                        RETURN e1.name, e2.name, r.relation, r.strength, r.evidence
                        """,
                        {"names": entity_names},
                    )

                    while result.has_next():
                        row = result.get_next()
                        data["relations"].append({
                            "from": row[0],
                            "to": row[1],
                            "relation": row[2],
                            "strength": row[3],
                            "evidence": row[4],
                        })

                # 导出会话信息（可选）
                if persona_id:
                    result = self.conn.execute(
                        """
                        MATCH (s:Session {persona_id: $persona_id})
                        RETURN s
                        """,
                        {"persona_id": persona_id},
                    )
                else:
                    result = self.conn.execute("MATCH (s:Session) RETURN s")

                while result.has_next():
                    row = result.get_next()
                    s = row[0]
                    data["sessions"].append({
                        "id": s["id"],
                        "name": s["name"],
                        "type": s["type"],
                        "persona_id": s.get("persona_id", "default"),
                    })

                return data
            except Exception as e:
                logger.error(f"[GraphMemory] 导出图谱失败: {e}", exc_info=True)
                return {}

        return await self._execute_in_thread(_export)

    async def import_graph(self, data: dict, merge: bool = True) -> tuple[int, int]:
        """导入图谱数据

        Args:
            data: 图谱数据字典
            merge: 是否合并（True）或覆盖（False）

        Returns:
            (导入的实体数, 导入的关系数)
        """
        entity_count = 0
        relation_count = 0

        try:
            # 导入实体
            for entity_data in data.get("entities", []):
                entity = EntityNode(
                    name=entity_data["name"],
                    type=entity_data["type"],
                    description=entity_data["description"],
                    importance=entity_data.get("importance", 1.0),
                    access_count=entity_data.get("access_count", 0),
                )
                if await self.add_entity(entity):
                    entity_count += 1

            # 导入关系
            for relation_data in data.get("relations", []):
                relation = RelatedToRel(
                    from_entity=relation_data["from"],
                    to_entity=relation_data["to"],
                    relation=relation_data["relation"],
                    strength=relation_data.get("strength", 1.0),
                    evidence=relation_data.get("evidence", ""),
                )
                if await self.add_relation(relation):
                    relation_count += 1

            logger.info(f"[GraphMemory] 导入完成: {entity_count} 个实体, {relation_count} 条关系")
            return entity_count, relation_count

        except Exception as e:
            logger.error(f"[GraphMemory] 导入图谱失败: {e}", exc_info=True)
            return entity_count, relation_count
