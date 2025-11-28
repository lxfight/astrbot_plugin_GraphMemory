import json
import os
import time
from pathlib import Path
from typing import Any

import kuzu

from astrbot.api import logger


class GraphEngine:
    def __init__(self, db_path: Path):
        self.db_path = db_path

        try:
            os.makedirs(os.path.dirname(db_path), exist_ok=True)
        except OSError:
            pass

        # 初始化 kuzu
        self.kuzu_db = kuzu.Database(db_path)
        self.conn: Any = kuzu.Connection(self.kuzu_db)

        # 访问统计缓存 (Lazy Update)
        self._access_cache: set[str] = set()

        self.init_schema()

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
                ("last_accessed", "INT64", "0"),
                ("access_count", "INT64", "0"),
                ("importance", "DOUBLE", "0.5"),
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

    def _gen_pk(self, name: str, session_id: str, persona_id: str) -> str:
        """
        生成复合主键，确保物理隔离
        """
        # TODO 针对中文进行更复杂的规范化处理
        norm_name = name.strip().lower()
        return f"{session_id}::{persona_id}::{norm_name}"

    def close(self):
        """清理资源"""
        if self.conn is not None:
            self.conn.close()
            self.conn = None
        self.kuzu_db = None
        logger.info("[GraphMemory] KuzuDB connection closed.")

    # ================= 增 / 改 (Write) =================

    def add_triplet(
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
        添加三元组 (幂等操作: 存在则更新，不存在则创建)
        """

        now = int(time.time())
        attr_str = json.dumps(attributes or {}, ensure_ascii=False)

        # 生成主键
        src_id = self._gen_pk(src_name, session_id, persona_id)
        tgt_id = self._gen_pk(tgt_name, session_id, persona_id)

        try:
            # 插入/更新 Source 节点
            self.conn.execute(
                """
                MERGE (a:Entity {id: $id})
                ON CREATE SET
                    a.name = $name, a.type = $type,
                    a.session_id = $sid, a.persona_id = $pid,
                    a.attributes = $attr,
                    a.updated_at = $now,
                    a.last_accessed = $now,
                    a.access_count = 1,
                    a.importance = $imp
                ON MATCH SET
                    a.updated_at = $now,
                    a.last_accessed = $now,
                    a.access_count = a.access_count + 1,
                    a.importance = CASE WHEN $imp > a.importance THEN $imp ELSE a.importance END
            """,
                {
                    "id": src_id,
                    "name": src_name,
                    "type": src_type,
                    "sid": session_id,
                    "pid": persona_id,
                    "attr": attr_str,
                    "now": now,
                    "imp": src_importance,
                },
            )

            # 插入/更新 Target 节点
            self.conn.execute(
                """
                MERGE (b:Entity {id: $id})
                ON CREATE SET
                    b.name = $name, b.type = $type,
                    b.session_id = $sid, b.persona_id = $pid,
                    b.updated_at = $now,
                    b.last_accessed = $now,
                    b.access_count = 1,
                    b.importance = $imp
                ON MATCH SET
                    b.updated_at = $now,
                    b.last_accessed = $now,
                    b.access_count = b.access_count + 1,
                    b.importance = CASE WHEN $imp > b.importance THEN $imp ELSE b.importance END
            """,
                {
                    "id": tgt_id,
                    "name": tgt_name,
                    "type": tgt_type,
                    "sid": session_id,
                    "pid": persona_id,
                    "now": now,
                    "imp": tgt_importance,
                },
            )

            # 插入/更新 关系
            self.conn.execute(
                """
                MATCH (a:Entity {id: $src_id}), (b:Entity {id: $tgt_id})
                MERGE (a)-[r:Related {relation: $rel}]->(b)
                ON CREATE SET
                    r.weight = $weight,
                    r.confidence = $conf,
                    r.source_user = $src_user,
                    r.updated_at = $now
                ON MATCH SET
                    r.weight = r.weight + $weight,
                    r.updated_at = $now
            """,
                {
                    "src_id": src_id,
                    "tgt_id": tgt_id,
                    "rel": relation,
                    "now": now,
                    "weight": weight,
                    "conf": confidence,
                    "src_user": source_user,
                },
            )
        except Exception as e:
            logger.error(f"[GraphMemory] Failed to add triplet: {e}")

    # ================= 查 / 召回 (Read) =================

    def search_subgraph(
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
            result: Any = self.conn.execute(find_seeds_cypher, params)
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

        # 循环 hops 次
        for _ in range(hops):
            # 过滤掉已经处理过的节点，防止死循环
            active_seeds = list(current_seed_ids - processed_ids)
            if not active_seeds:
                break

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
                res_out: Any = self.conn.execute(q_out, hop_params)
                while res_out.has_next():
                    row = res_out.get_next()  # [a.name, r.relation, b.name, b.id]
                    # 生成文本: (Node A) --[relation]--> (Node B)
                    collected_triplets.add(f"({row[0]}) --[{row[1]}]--> ({row[2]})")
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
                res_in: Any = self.conn.execute(q_in, hop_params)
                while res_in.has_next():
                    row = res_in.get_next()  # [a.name, r.relation, b.name, a.id]
                    collected_triplets.add(f"({row[0]}) --[{row[1]}]--> ({row[2]})")
                    next_hop_ids.add(row[3])  # 将 A 节点加入下一轮搜索
            except Exception as e:
                logger.error(f"[GraphMemory] Error in incoming hop: {e}")

            # 更新种子，准备下一跳
            current_seed_ids = next_hop_ids

        return "\n".join(collected_triplets)

    # ================= 维护 (Maintenance) =================

    def record_access(self, node_ids: list[str]):
        """
        [Lazy Update] 记录节点被访问。
        仅加入内存集合，等待 flush_access_stats 批量写入。
        """
        if not node_ids:
            return
        self._access_cache.update(node_ids)

    def flush_access_stats(self):
        """
        批量将访问记录回写到数据库 (更新 last_accessed 和 access_count)
        """
        if not self._access_cache:
            return

        node_ids = list(self._access_cache)
        count = len(node_ids)
        self._access_cache.clear()

        now = int(time.time())
        logger.debug(f"[GraphMemory] Flushing access stats for {count} nodes.")

        # 注意：Kuzu 目前对 UPDATE 支持有限，可能需要逐个或者分批 UPDATE
        # 这里使用 UNWIND 尝试批量更新
        # 如果 Kuzu 版本较低不支持 UNWIND + MERGE/SET，则可能需要循环
        # 鉴于 UNWIND 是标准 Cypher，先尝试批量
        try:
            # 构造包含 ID 的 list of dict
            # Kuzu 的 Python API 传递 list 参数可能有限制，取决于版本
            # 安全起见，我们分批处理，每批 50 个，避免 query 过大
            batch_size = 50
            for i in range(0, count, batch_size):
                batch = node_ids[i : i + batch_size]

                # 构建 WHERE id IN [...]
                # 注意：Kuzu 0.6.0+ 支持 LIST 参数，但为了兼容性，我们手动构造
                # 但手动构造 string list 很麻烦，这里使用 Kuzu 的 parameterized list
                # 假设 Kuzu 支持 $ids (LIST[STRING])

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
            # 出错不回滚 cache，避免死循环重试，丢失统计可以接受

    def get_graph_statistics(self) -> dict:
        """
        获取图谱统计信息
        """
        try:
            res: Any = self.conn.execute("MATCH (n:Entity) RETURN count(n)")
            node_count = 0
            if res.has_next():
                node_count = res.get_next()[0]
            return {"node_count": node_count}
        except Exception as e:
            logger.error(f"[GraphMemory] Failed to get stats: {e}")
            return {"node_count": 0}

    def prune_graph(self, max_nodes: int, retention_weights: dict[str, float]) -> int:
        """
        记忆修剪/遗忘机制。
        删除得分最低的节点，直到节点数 <= max_nodes。
        """
        stats = self.get_graph_statistics()
        current_nodes = stats["node_count"]

        if current_nodes <= max_nodes:
            return 0

        # 需要删除的数量 (多删一点作为 buffer，避免频繁触发，例如多删 10%)
        target_delete = int((current_nodes - max_nodes) + (max_nodes * 0.05))
        if target_delete <= 0:
            return 0

        logger.info(
            f"[GraphMemory] Pruning triggered. Current: {current_nodes}, Max: {max_nodes}, Target Delete: {target_delete}"
        )

        # 计算 Retention Score 并删除
        # Score = w1 * (1 / (now - last_accessed + 1)) + w2 * access_count + w3 * importance
        # 为了方便计算，我们使用 SQL/Cypher 表达式
        # 注意：Kuzu 的数学函数可能有限，尽量简化
        # 我们直接按排序取 limit 删除

        w1 = retention_weights.get("recency", 0.4)
        w2 = retention_weights.get("frequency", 0.3)
        w3 = retention_weights.get("importance", 0.3)
        now = int(time.time())

        # 防止除以零，时间差加一个常数 (比如 3600秒，归一化一下)
        # 实际上，我们可以简化为：按 last_accessed 排序，access_count 和 importance 作为加分项
        # Kuzu Cypher:
        # ORDER BY (w1 * n.last_accessed) + (w2 * n.access_count * 1000) + (w3 * n.importance * 100000) ASC
        # 这里系数是为了让量纲接近：
        # last_accessed 是 10^9 级别
        # access_count 是 1-1000 级别
        # importance 是 0-1 级别

        # 这种直接线性组合比较困难，因为 last_accessed 数值太大，会主导结果。
        # 策略调整：
        # 先筛选出 "不够重要" 的节点 (importance < 0.8)，保护重要节点
        # 然后在这些节点中，按 last_accessed (时效性) 排序，删除最老的。
        # access_count 可以在 WHERE 中过滤 (例如只删除 access_count < 5 的)

        # 新策略:
        # 1. 保护机制: importance >= 0.9 (核心实体) 或 access_count > 100 (热门实体) 豁免
        # 2. 删除机制: 剩余节点中，按 last_accessed ASC 排序，删除前 N 个

        try:
            # 1. 查找待删除的 ID
            # 无法在 DELETE 中直接 LIMIT，需要先查 ID
            query = f"""
                MATCH (n:Entity)
                WHERE n.importance < 0.9 AND n.access_count < 50
                RETURN n.id, n.last_accessed
                ORDER BY n.last_accessed ASC
                LIMIT {target_delete}
            """

            res: Any = self.conn.execute(query)
            ids_to_delete = []
            while res.has_next():
                row = res.get_next()
                ids_to_delete.append(row[0])

            if not ids_to_delete:
                logger.info(
                    "[GraphMemory] No eligible nodes to prune (all nodes are important or hot)."
                )
                return 0

            # 2. 执行删除
            # 分批删除
            deleted_count = 0
            batch_size = 50
            for i in range(0, len(ids_to_delete), batch_size):
                batch = ids_to_delete[i : i + batch_size]
                self.conn.execute(
                    """
                    MATCH (n:Entity)
                    WHERE n.id IN $ids
                    DETACH DELETE n
                    """,
                    {"ids": batch},
                )
                deleted_count += len(batch)

            logger.info(
                f"[GraphMemory] Pruning finished. Deleted {deleted_count} nodes."
            )
            return deleted_count

        except Exception as e:
            logger.error(f"[GraphMemory] Pruning failed: {e}")
            return 0

    # ================= 迁移 (Migration) =================

    def migrate(self, from_context: dict[str, str], to_context: dict[str, str]):
        """
        万能迁移函数。
        """
        old_sid = from_context.get("session_id", "")
        old_pid = from_context.get("persona_id", "")

        new_sid = to_context.get("session_id", old_sid)
        new_pid = to_context.get("persona_id", old_pid)

        if old_sid == new_sid and old_pid == new_pid:
            return

        logger.info(
            f"[GraphMemory] Start migrating graph memory from {old_sid}:{old_pid} to {new_sid}:{new_pid}"
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
        nodes_res: Any = self.conn.execute(
            f"""
            MATCH (n:Entity) WHERE {where_clause}
            RETURN n.name, n.type, n.attributes
            """,
            params,
        )

        nodes_data = []
        while nodes_res.has_next():
            nodes_data.append(nodes_res.get_next())

        # 1.5 读取旧数据 (边)
        edges_res: Any = self.conn.execute(
            f"""
            MATCH (a:Entity)-[r:Related]->(b:Entity)
            WHERE {where_clause.replace("n.", "a.")}
            AND {where_clause.replace("n.", "b.")}
            RETURN a.name, r.relation, b.name, r.weight
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
        for name, type_, attr_str in nodes_data:
            attr = json.loads(attr_str or "{}")
            self._force_create_node(name, new_sid, new_pid, type_, attr)

        for src, rel, tgt, weight in edges_data:
            self.add_triplet(src, rel, tgt, new_sid, new_pid)
            # TODO 想严格保留原权重，这里其实应该写专门的 Cypher
            # 但复用 add_triplet (默认+0.5) 对于聊天机器人记忆迁移通常是可以接受的，因为它代表"回忆"了一次

        # 3. 删除旧数据 (Delete)
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

    # ================= 数据清空 =================

    def clear_context(self, session_id: str, persona_id: str | None = None):
        """清空特定上下文的记忆"""
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
