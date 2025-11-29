import asyncio
import functools
import json
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

import kuzu

from astrbot.api import logger


class GraphEngine:
    def __init__(self, db_path: Path):
        self.db_path = (db_path / "kuzu_db").resolve().as_posix()
        self.kuzu_db = kuzu.Database(self.db_path)
        self.conn: Any = kuzu.Connection(self.kuzu_db)

        # 线程安全与异步支持
        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(
            max_workers=1, thread_name_prefix="GraphEngine"
        )

        # 访问统计缓存 (Lazy Update)
        self._access_cache: set[str] = set()
        self._last_flush_time = time.time()
        self._flush_threshold = 50  # 缓存积压阈值
        self._flush_interval = 60  # 强制刷新时间间隔 (秒)

        self.init_schema()

    def _run_query(self, query: str, params: dict | None = None) -> Any:
        """
        线程安全地执行 Cypher 查询
        """
        with self._lock:
            return self.conn.execute(query, params or {})

    def init_schema(self):
        """
        定义图谱 schema
        """

        # 1. 实体表 (Entity)
        # id: 复合主键 (session_id::persona_id::normalized_name)
        try:
            self.conn.execute("""
                CREATE NODE TABLE Entity (
                    id STRING,
                    name STRING,
                    type STRING,
                    session_id STRING,
                    persona_id STRING,
                    attributes STRING,
                    updated_at INT64,
                    last_accessed INT64,
                    access_count INT64,
                    importance DOUBLE,
                    PRIMARY KEY (id)
                )
            """)
            logger.info("[GraphMemory] Created node table 'Entity'.")
        except RuntimeError:
            # Schema 变更策略: 尝试添加新列
            cols = [
                ("last_accessed", "INT64", 0),
                ("access_count", "INT64", 0),
                ("importance", "DOUBLE", 0.5),
            ]
            for col_name, col_type, default_val in cols:
                try:
                    self.conn.execute(
                        f"ALTER TABLE Entity ADD {col_name} {col_type} DEFAULT {default_val}"
                    )
                except RuntimeError:
                    pass

        # 2. 关系表
        try:
            self.conn.execute("""
                CREATE REL TABLE Related (
                    FROM Entity TO Entity,
                    relation STRING,
                    weight DOUBLE,
                    confidence DOUBLE,
                    source_user STRING,
                    updated_at INT64
                )
            """)
            logger.info("[GraphMemory] Created relationship table 'Related'.")
        except RuntimeError:
            # 尝试添加新字段
            try:
                self.conn.execute(
                    "ALTER TABLE Related ADD confidence DOUBLE DEFAULT 1.0"
                )
                self.conn.execute(
                    "ALTER TABLE Related ADD source_user STRING DEFAULT 'unknown'"
                )
            except RuntimeError:
                pass

        # 3. 元数据表 (Metadata) - 用于版本控制
        try:
            self.conn.execute("""
                CREATE NODE TABLE _Metadata (
                    id STRING,
                    version INT64,
                    updated_at INT64,
                    PRIMARY KEY (id)
                )
            """)
            # 初始化版本号
            now = int(time.time())
            self.conn.execute(
                f"CREATE (:_Metadata {{id: 'schema_version', version: 1, updated_at: {now}}})"
            )
            logger.info("[GraphMemory] Created metadata table '_Metadata'.")
        except RuntimeError:
            pass

    def _gen_pk(self, name: str, session_id: str, persona_id: str) -> str:
        """
        生成复合主键，确保物理隔离
        """
        # TODO 针对中文进行更复杂的规范化处理
        norm_name = name.strip().lower()
        return f"{session_id}::{persona_id}::{norm_name}"

    def close(self):
        """清理资源"""
        self._executor.shutdown(wait=True)
        with self._lock:
            if self.conn is not None:
                self.conn.close()
                self.conn = None
            self.kuzu_db = None
        logger.info("[GraphMemory] KuzuDB connection closed.")

    # ================= 增 / 改 (Write) =================

    async def add_triplet(
        self,
        src_name: str,
        relation: str,
        tgt_name: str,
        session_id: str,
        persona_id: str = "default",
        src_type: str = "entity",
        tgt_type: str = "entity",
        attributes: dict | None = None,
        weight: float = 1.0,
        confidence: float = 1.0,
        source_user: str = "unknown",
        src_importance: float = 0.5,
        tgt_importance: float = 0.5,
    ):
        """
        [Async] 添加三元组 (幂等操作: 存在则更新，不存在则创建)
        """
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            self._executor,
            functools.partial(
                self._add_triplet_sync,
                src_name=src_name,
                relation=relation,
                tgt_name=tgt_name,
                session_id=session_id,
                persona_id=persona_id,
                src_type=src_type,
                tgt_type=tgt_type,
                attributes=attributes,
                weight=weight,
                confidence=confidence,
                source_user=source_user,
                src_importance=src_importance,
                tgt_importance=tgt_importance,
            ),
        )

    def _add_triplet_sync(
        self,
        src_name: str,
        relation: str,
        tgt_name: str,
        session_id: str,
        persona_id: str = "default",
        src_type: str = "entity",
        tgt_type: str = "entity",
        attributes: dict | None = None,
        weight: float = 1.0,
        confidence: float = 1.0,
        source_user: str = "unknown",
        src_importance: float = 0.5,
        tgt_importance: float = 0.5,
    ):
        """
        [Sync] 内部同步方法：添加三元组
        """

        now = int(time.time())
        attr_str = json.dumps(attributes or {}, ensure_ascii=False)

        # 生成主键
        src_id = self._gen_pk(src_name, session_id, persona_id)
        tgt_id = self._gen_pk(tgt_name, session_id, persona_id)

        # 原子化 Cypher 查询
        # 这里为了逻辑清晰，仍然先 MERGE 节点，再 MERGE 关系
        query = """
            MERGE (a:Entity {id: $src_id})
            ON CREATE SET
                a.name = $src_name, a.type = $src_type,
                a.session_id = $sid, a.persona_id = $pid,
                a.attributes = $attr,
                a.updated_at = $now,
                a.last_accessed = $now,
                a.access_count = 1,
                a.importance = $src_imp
            ON MATCH SET
                a.updated_at = $now,
                a.last_accessed = $now,
                a.access_count = a.access_count + 1,
                a.importance = CASE WHEN $src_imp > a.importance THEN $src_imp ELSE a.importance END

            MERGE (b:Entity {id: $tgt_id})
            ON CREATE SET
                b.name = $tgt_name, b.type = $tgt_type,
                b.session_id = $sid, b.persona_id = $pid,
                b.updated_at = $now,
                b.last_accessed = $now,
                b.access_count = 1,
                b.importance = $tgt_imp
            ON MATCH SET
                b.updated_at = $now,
                b.last_accessed = $now,
                b.access_count = b.access_count + 1,
                b.importance = CASE WHEN $tgt_imp > b.importance THEN $tgt_imp ELSE b.importance END

            MERGE (a)-[r:Related {relation: $rel}]->(b)
            ON CREATE SET
                r.weight = $weight,
                r.confidence = $conf,
                r.source_user = $src_user,
                r.updated_at = $now
            ON MATCH SET
                r.weight = r.weight + $weight,
                r.updated_at = $now
        """

        params = {
            "src_id": src_id,
            "src_name": src_name,
            "src_type": src_type,
            "sid": session_id,
            "pid": persona_id,
            "attr": attr_str,
            "now": now,
            "src_imp": src_importance,
            "tgt_id": tgt_id,
            "tgt_name": tgt_name,
            "tgt_type": tgt_type,
            "tgt_imp": tgt_importance,
            "rel": relation,
            "weight": weight,
            "conf": confidence,
            "src_user": source_user,
        }

        try:
            logger.debug(f"[GraphMemory DEBUG] Executing Cypher (Add Triplet): {src_name} --[{relation}]--> {tgt_name}")
            self._run_query(query, params)
        except Exception as e:
            logger.error(f"[GraphMemory] Failed to add triplet: {e}")

    # ================= 查 / 召回 (Read) =================

    async def search_subgraph(
        self, keywords: list[str], session_id: str, persona_id: str, hops: int = 2
    ) -> str:
        """
        [Async] 基于 BFS 的多跳图检索
        """
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            self._executor,
            functools.partial(
                self._search_subgraph_sync,
                keywords=keywords,
                session_id=session_id,
                persona_id=persona_id,
                hops=hops,
            ),
        )

    def _search_subgraph_sync(
        self, keywords: list[str], session_id: str, persona_id: str, hops: int = 2
    ) -> str:
        """
        基于 BFS 的多跳图检索。
        相比直接使用 Cypher 的 Variable Length Paths，这种方式能更好地控制每一层的数据量，
        并更容易生成清晰的三元组文本。
        """
        if not keywords:
            return ""

        # 1. 查找种子节点 (Seeds)
        seeds_conditions = []
        params = {"sid": session_id, "pid": persona_id}

        # 动态构造 OR 查询
        for i, kw in enumerate(keywords):
            key = f"kw{i}"
            # Kuzu 的 CONTAINS 大小写敏感取决于配置，存的时候统一小写或者这里加 lower()
            seeds_conditions.append(f"n.name CONTAINS ${key}")
            params[key] = kw

        where_clause = " OR ".join(seeds_conditions)

        # 限制种子节点数量，防止一次性查出太多
        find_seeds_cypher = f"""
            MATCH (n:Entity)
            WHERE n.session_id = $sid AND n.persona_id = $pid AND ({where_clause})
            RETURN n.id, n.name
            LIMIT 5
        """

        logger.debug(
            f"[GraphMemory] Search query: {find_seeds_cypher.strip()} | Params: {params}"
        )

        try:
            result: Any = self._run_query(find_seeds_cypher, params)
        except Exception as e:
            logger.error(f"[GraphMemory] Search seeds failed: {e}")
            return ""

        current_seed_ids = set()
        while result.has_next():
            row = result.get_next()
            current_seed_ids.add(row[0])  # n.id

        logger.debug(f"[GraphMemory] Found {len(current_seed_ids)} seed nodes.")

        if not current_seed_ids:
            return ""

        # 记录访问 (Lazy Update)
        self.record_access(list(current_seed_ids))

        # 2. BFS 分层遍历
        collected_triplets = set()
        processed_ids = set()

        logger.debug(f"[GraphMemory DEBUG] Starting BFS search (Hops: {hops})")

        # 循环 hops 次
        for i in range(hops):
            # 过滤掉已经处理过的节点，防止死循环
            active_seeds = list(current_seed_ids - processed_ids)
            if not active_seeds:
                break

            logger.debug(f"[GraphMemory DEBUG] Hop {i+1}: {len(active_seeds)} active seeds.")

            # 标记为已处理
            processed_ids.update(active_seeds)

            next_hop_ids = set()

            # 查询参数
            hop_params = {"seeds": active_seeds}

            # --- 方向 1: Outgoing (Seed -> Other) ---
            q_out = """
                MATCH (a:Entity)-[r:Related]->(b:Entity)
                WHERE a.id IN $seeds
                RETURN a.name, r.relation, b.name, b.id
                LIMIT 20
            """

            try:
                res_out: Any = self._run_query(q_out, hop_params)
                while res_out.has_next():
                    row = res_out.get_next()  # [a.name, r.relation, b.name, b.id]
                    # 生成文本: (Node A) --[relation]--> (Node B)
                    triplet_str = f"({row[0]}) --[{row[1]}]--> ({row[2]})"
                    collected_triplets.add(triplet_str)
                    next_hop_ids.add(row[3])  # 将 B 节点加入下一轮搜索
            except Exception as e:
                logger.error(f"[GraphMemory] Error in outgoing hop: {e}")

            # --- 方向 2: Incoming (Other -> Seed) ---
            q_in = """
                MATCH (a:Entity)-[r:Related]->(b:Entity)
                WHERE b.id IN $seeds
                RETURN a.name, r.relation, b.name, a.id
                LIMIT 20
            """

            try:
                res_in: Any = self._run_query(q_in, hop_params)
                while res_in.has_next():
                    row = res_in.get_next()  # [a.name, r.relation, b.name, a.id]
                    triplet_str = f"({row[0]}) --[{row[1]}]--> ({row[2]})"
                    collected_triplets.add(triplet_str)
                    next_hop_ids.add(row[3])  # 将 A 节点加入下一轮搜索
            except Exception as e:
                logger.error(f"[GraphMemory] Error in incoming hop: {e}")

            logger.debug(f"[GraphMemory DEBUG] Hop {i+1} found {len(next_hop_ids)} new nodes.")
            # 更新种子，准备下一跳
            current_seed_ids = next_hop_ids

        logger.debug(f"[GraphMemory DEBUG] Search finished. Total triplets found: {len(collected_triplets)}")
        return "\n".join(collected_triplets)

    # ================= 维护 (Maintenance) =================

    def record_access(self, node_ids: list[str]):
        """
        [Lazy Update] 记录节点被访问。
        仅加入内存集合，等待 flush_access_stats 批量写入。
        如果积压过多或距离上次刷新过久，则立即刷新。
        """
        if not node_ids:
            return

        should_flush = False
        with self._lock:
            self._access_cache.update(node_ids)
            current_cache_size = len(self._access_cache)
            time_since_flush = time.time() - self._last_flush_time

            if (
                current_cache_size >= self._flush_threshold
                or time_since_flush >= self._flush_interval
            ):
                should_flush = True

        if should_flush:
            # 这里调用的是 sync 方法，因为 record_access 通常在 executor 线程中被 search_subgraph 调用
            self._flush_access_stats_sync()

    async def flush_access_stats(self):
        """
        [Async] 批量将访问记录回写到数据库
        """
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(self._executor, self._flush_access_stats_sync)

    def _flush_access_stats_sync(self):
        """
        [Sync] 批量将访问记录回写到数据库 (更新 last_accessed 和 access_count)
        """
        with self._lock:
            if not self._access_cache:
                return
            node_ids = list(self._access_cache)
            self._access_cache.clear()
            self._last_flush_time = time.time()

        count = len(node_ids)
        now = int(time.time())
        logger.debug(f"[GraphMemory] Flushing access stats for {count} nodes.")

        try:
            # 安全起见，我们分批处理，每批 50 个，避免 query 过大
            batch_size = 50
            for i in range(0, count, batch_size):
                batch = node_ids[i : i + batch_size]

                # 再次获取锁进行 DB 操作
                with self._lock:
                    self.conn.execute(
                        """
                        MATCH (n:Entity)
                        WHERE n.id IN $ids
                        SET n.last_accessed = $now,
                        n.access_count = n.access_count + 1
                        """,
                        {"ids": batch, "now": now},
                    )
        except Exception as e:
            logger.error(f"[GraphMemory] Failed to flush access stats: {e}")

    def get_graph_statistics(self) -> dict:
        """
        获取图谱统计信息 (Sync Helper)
        """
        try:
            res: Any = self._run_query("MATCH (n:Entity) RETURN count(n)")
            node_count = 0
            if res.has_next():
                node_count = res.get_next()[0]
            return {"node_count": node_count}
        except Exception as e:
            logger.error(f"[GraphMemory] Failed to get stats: {e}")
            return {"node_count": 0}

    async def prune_graph(
        self, max_nodes: int, retention_weights: dict[str, float]
    ) -> int:
        """
        [Async] 记忆修剪/遗忘机制
        """
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            self._executor,
            functools.partial(
                self._prune_graph_sync,
                max_nodes=max_nodes,
                retention_weights=retention_weights,
            ),
        )

    def _prune_graph_sync(
        self, max_nodes: int, retention_weights: dict[str, float]
    ) -> int:
        """
        [Sync] 记忆修剪/遗忘机制
        智能剪枝策略：
        1. 孤岛节点优先清理 (度为0的非重要节点)
        2. 基于生命周期评分清理 (Importance + Frequency + Recency)
        """
        stats = self.get_graph_statistics()
        current_nodes = stats["node_count"]

        if current_nodes <= max_nodes:
            return 0

        # 需要删除的数量 (多删一点作为 buffer)
        target_delete = int((current_nodes - max_nodes) + (max_nodes * 0.05))
        if target_delete <= 0:
            return 0

        logger.info(
            f"[GraphMemory] Pruning triggered. Current: {current_nodes}, Max: {max_nodes}, Target Delete: {target_delete}"
        )

        deleted_count = 0

        try:
            # ----------------------------------------------------
            # 1. 孤岛清理 (Orphan Cleanup)
            # 删除没有任何连接 且 重要性低 的节点
            # ----------------------------------------------------
            if deleted_count < target_delete:
                orphan_limit = target_delete - deleted_count

                # 查询度为0的节点
                # 注意: Kuzu 的 degree() 函数可能需要特定版本
                # 备选: MATCH (n) WHERE NOT (n)-[]-()
                orphan_query = f"""
                    MATCH (n:Entity)
                    WHERE NOT (n)-[]-() AND n.importance < 0.8
                    RETURN n.id
                    LIMIT {orphan_limit}
                """

                res_orphan = self._run_query(orphan_query)
                orphan_ids = []
                while res_orphan.has_next():
                    orphan_ids.append(res_orphan.get_next()[0])

                if orphan_ids:
                    self._batch_delete(orphan_ids)
                    deleted_count += len(orphan_ids)
                    logger.info(f"[GraphMemory] Pruned {len(orphan_ids)} orphan nodes.")

            # ----------------------------------------------------
            # 2. 末位淘汰 (Retention Score Pruning)
            # ----------------------------------------------------
            if deleted_count < target_delete:
                remaining_target = target_delete - deleted_count

                # 评分策略:
                # 豁免: importance >= 0.9 (核心实体)
                # 排序: last_accessed ASC (越老越删)
                # 辅助: access_count < 10 (只删冷门)

                # 简化的 Cypher 评分查询
                score_query = f"""
                    MATCH (n:Entity)
                    WHERE n.importance < 0.9 AND n.access_count < 20
                    RETURN n.id, n.last_accessed
                    ORDER BY n.last_accessed ASC
                    LIMIT {remaining_target}
                """

                res_score = self._run_query(score_query)
                score_ids = []
                while res_score.has_next():
                    score_ids.append(res_score.get_next()[0])

                if score_ids:
                    self._batch_delete(score_ids)
                    deleted_count += len(score_ids)
                    logger.info(
                        f"[GraphMemory] Pruned {len(score_ids)} low-score nodes."
                    )

            return deleted_count

        except Exception as e:
            logger.error(f"[GraphMemory] Pruning failed: {e}")
            return deleted_count

    def _batch_delete(self, node_ids: list[str]):
        """
        [辅助] 批量删除节点
        """
        if not node_ids:
            return

        batch_size = 50
        for i in range(0, len(node_ids), batch_size):
            batch = node_ids[i : i + batch_size]
            with self._lock:
                self.conn.execute(
                    """
                    MATCH (n:Entity)
                    WHERE n.id IN $ids
                    DETACH DELETE n
                    """,
                    {"ids": batch},
                )

    # ================= 迁移 (Migration) =================

    async def migrate(self, from_context: dict[str, str], to_context: dict[str, str]):
        """
        [Async] 万能迁移函数。
        """
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            self._executor,
            functools.partial(
                self._migrate_sync, from_context=from_context, to_context=to_context
            ),
        )

    def _migrate_sync(self, from_context: dict[str, str], to_context: dict[str, str]):
        """
        [Sync] 万能迁移函数。
        """
        old_sid = from_context.get("session_id", "")
        old_pid = from_context.get("persona_id", "")

        target_sid = to_context.get("session_id")
        target_pid = to_context.get("persona_id")

        if not target_sid and not target_pid:
            # 没有任何目标，无法迁移
            return

        # 如果没有指定 target_sid，则保留原来的 sid（虽然这种情况很少见）
        # 如果没有指定 target_pid，则保留原来的 pid

        logger.info(
            f"[GraphMemory] Start migrating graph memory from {old_sid}:{old_pid} to {target_sid}:{target_pid}"
        )

        query_filter = []
        params = {}
        if old_sid:
            query_filter.append("n.session_id = $osid")
            params["osid"] = old_sid
        if old_pid:
            query_filter.append("n.persona_id = $opid")
            params["opid"] = old_pid

        where_clause = " AND ".join(query_filter) if query_filter else "true"

        # 1. 读取旧数据 (节点)
        # 读取时多读一个 n.persona_id，以便在 target_pid 为空时保留原值
        nodes_res: Any = self.conn.execute(
            f"""
            MATCH (n:Entity) WHERE {where_clause}
            RETURN n.name, n.type, n.attributes, n.persona_id
            """,
            params,
        )

        nodes_data = []
        while nodes_res.has_next():
            nodes_data.append(nodes_res.get_next())

        # 1.5 读取旧数据 (边)
        # 增加读取 confidence 和 source_user，保证数据完整性
        edges_res: Any = self.conn.execute(
            f"""
            MATCH (a:Entity)-[r:Related]->(b:Entity)
            WHERE {where_clause.replace("n.", "a.")}
            AND {where_clause.replace("n.", "b.")}
            RETURN a.name, r.relation, b.name, r.weight, a.persona_id, b.persona_id, r.confidence, r.source_user
            """,
            params,
        )
        edges_data = []
        while edges_res.has_next():
            edges_data.append(edges_res.get_next())

        logger.info(
            f"[GraphMemory] Loaded {len(nodes_data)} nodes and {len(edges_data)} edges for migration."
        )

        # 2. 写入新数据 (Clone)
        for name, type_, attr_str, original_pid in nodes_data:
            attr = json.loads(attr_str or "{}")
            pid_to_use = target_pid if target_pid else original_pid
            sid_to_use = target_sid if target_sid else old_sid
            self._force_create_node(name, sid_to_use, pid_to_use, type_, attr)

        # 3. 写入新数据 (Clone Edges)
        for src, rel, tgt, weight, src_pid, tgt_pid, conf, src_user in edges_data:
            # 分别计算 source 和 target 在迁移后的归属
            # 如果 target_pid 未指定（即全量迁移保持原人格），则分别保留各自的原 pid
            final_src_pid = target_pid if target_pid else src_pid
            final_tgt_pid = target_pid if target_pid else tgt_pid

            sid_to_use = target_sid if target_sid else old_sid
            # 显式生成两个节点在 "新世界" 的 ID
            # 这样即使 src 和 tgt 属于不同人格，ID 也能正确指向 Step 2 中创建的对应节点
            new_src_id = self._gen_pk(src, sid_to_use, final_src_pid)
            new_tgt_id = self._gen_pk(tgt, sid_to_use, final_tgt_pid)
            # 使用底层方法创建连接
            self._force_create_edge(
                src_id=new_src_id,
                tgt_id=new_tgt_id,
                relation=rel,
                weight=weight,
                confidence=conf if conf is not None else 1.0,
                source_user=src_user if src_user else "unknown",
            )

        # 4. 删除旧数据 (Delete)
        self.conn.execute(
            f"""
            MATCH (n:Entity) WHERE {where_clause}
            DETACH DELETE n
            """,
            params,
        )
        logger.info("[GraphMemory] Migration completed.")

    def _force_create_node(self, name: str, sid: str, pid: str, type_: str, attr: dict):
        """
        [辅助方法] 强制创建一个节点（纯节点，不带边）
        """
        import time

        now = int(time.time())
        attr_str = json.dumps(attr, ensure_ascii=False)

        # 生成新的主键 ID
        nid = self._gen_pk(name, sid, pid)

        # 执行 Cypher: 仅 MERGE 节点
        self.conn.execute(
            """
            MERGE (a:Entity {id: $id})
            ON CREATE SET
                a.name = $name,
                a.type = $type,
                a.session_id = $sid,
                a.persona_id = $pid,
                a.attributes = $attr,
                a.updated_at = $now
            ON MATCH SET
                a.updated_at = $now
        """,
            {
                "id": nid,
                "name": name,
                "type": type_,
                "sid": sid,
                "pid": pid,
                "attr": attr_str,
                "now": now,
            },
        )

    def _force_create_edge(
        self,
        src_id: str,
        tgt_id: str,
        relation: str,
        weight: float,
        confidence: float = 1.0,
        source_user: str = "unknown",
    ):
        """
        [辅助方法] 强制创建边（用于迁移或恢复），不触发业务逻辑（如访问计数更新）。
        """
        import time

        now = int(time.time())

        query = """
            MATCH (a:Entity {id: $src_id}), (b:Entity {id: $tgt_id})
            MERGE (a)-[r:Related {relation: $rel}]->(b)
            ON CREATE SET
                r.weight = $weight,
                r.confidence = $conf,
                r.source_user = $src_user,
                r.updated_at = $now
            ON MATCH SET
                r.weight = $weight, /* 迁移通常意味着覆盖或保留原权重 */
                r.updated_at = $now
        """
        params = {
            "src_id": src_id,
            "tgt_id": tgt_id,
            "rel": relation,
            "weight": weight,
            "conf": confidence,
            "src_user": source_user,
            "now": now,
        }

        # 即使其中一个节点不存在（理论上 Step 2 已创建），Cypher 也不会报错，只是不创建边
        self.conn.execute(query, params)

    # ================= 数据清空 =================

    async def clear_context(self, session_id: str, persona_id: str | None = None):
        """[Async] 清空特定上下文的记忆"""
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            self._executor,
            functools.partial(
                self._clear_context_sync, session_id=session_id, persona_id=persona_id
            ),
        )

    def _clear_context_sync(self, session_id: str, persona_id: str | None = None):
        """[Sync] 清空特定上下文的记忆"""
        filter_sql = "n.session_id = $sid"
        params = {"sid": session_id}

        if persona_id:
            filter_sql += " AND n.persona_id = $pid"
            params["pid"] = persona_id

        self.conn.execute(
            f"""
            MATCH (n:Entity)
            WHERE {filter_sql}
            DETACH DELETE n
        """,
            params,
        )
        logger.info(
            f"[GraphMemory] Cleared memory for session_id={session_id}, persona_id={persona_id}"
        )
