"""图数据库存储模块"""

import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Any, List
import functools

import kuzu

from astrbot.api import logger

from .entities import (
    UserNode,
    SessionNode,
    EntityNode,
    ParticipatedInRel,
    RelatedToRel,
    MentionedInRel,
    KnowsRel,
)
from .schema import initialize_schema, get_embedding_dim_from_provider


class GraphStore:
    """图数据库存储

    负责:
    - 管理 KuzuDB 连接
    - 提供节点和关系的 CRUD 操作
    - 执行图查询
    """

    def __init__(self, db_path: Path, embedding_provider: Optional[Any] = None):
        self.db_path = db_path / "kuzu_db_v3"
        self.db_path.mkdir(parents=True, exist_ok=True)

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
        """添加或更新实体节点"""
        def _add():
            try:
                now = datetime.now(timezone.utc)

                # 生成 embedding
                embedding = entity.embedding
                if not embedding and self.embedding_provider and entity.description:
                    try:
                        embedding = asyncio.run(
                            self.embedding_provider.get_embedding(entity.description)
                        )
                    except Exception as e:
                        logger.warning(f"[GraphMemory] 生成 embedding 失败: {e}")
                        embedding = [0.0] * self.embedding_dim

                if not embedding:
                    embedding = [0.0] * self.embedding_dim

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

    async def get_entity(self, name: str) -> Optional[EntityNode]:
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
