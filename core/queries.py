# data/plugins/astrbot_plugin_GraphMemory/core/queries.py

"""
此文件集中管理了所有在 `GraphEngine` 中使用的 Cypher 查询语句。
将查询语句作为常量存储在此处，有以下好处：
1.  **代码清晰**：将数据库逻辑与业务逻辑分离。
2.  **易于维护**：可以方便地找到、修改和优化所有查询。
3.  **可重用性**：多个地方可以引用同一个查询。
"""

# ================= 写入/创建/更新 (Write) =================

# 如果用户不存在，则创建新用户；否则不做任何事。
ADD_USER = "MERGE (u:User {id: $id}) ON CREATE SET u.name = $name, u.platform = $platform"

# 如果会话不存在，则创建新会话。
ADD_SESSION = "MERGE (s:Session {id: $id}) ON CREATE SET s.type = $type, s.name = $name"

# 如果实体不存在，则创建新实体并设置其属性。
ADD_ENTITY = "MERGE (e:Entity {name: $name}) ON CREATE SET e.type = $type, e.summary = $summary, e.embedding = $embedding"

# 创建一条消息，并将其与发送者(User)和所在会话(Session)连接起来。
# 同时确保用户和会话之间的 `PARTICIPATED_IN` 关系存在。
ADD_MESSAGE = """
    MERGE (u:User {id: $user_id})
    MERGE (s:Session {id: $session_id})
    MERGE (u)-[:PARTICIPATED_IN]->(s)
    CREATE (m:Message {id: $msg_id, content: $content, timestamp: $timestamp, embedding: $embedding})
    CREATE (u)-[:SENT]->(m)
    CREATE (m)-[:POSTED_IN]->(s)
"""

# 在两个已存在的实体之间创建一条 `RELATED_TO` 关系。
ADD_RELATION = "MATCH (a:Entity {name: $src_name}), (b:Entity {name: $tgt_name}) MERGE (a)-[r:RELATED_TO {relation: $relation}]->(b)"

# 在一条消息和一个实体之间创建一条 `MENTIONS` 关系。
ADD_MENTION = "MATCH (m:Message {id: $msg_id}), (e:Entity {name: $entity_name}) MERGE (m)-[r:MENTIONS]->(e) ON CREATE SET r.sentiment = $sentiment"


# ================= 搜索/召回 (Search) =================

# KuzuDB 向量搜索的基础查询模板。
VECTOR_SEARCH_BASE = "CALL db.index.query_nodes('{table_name}', 'embedding', $vector, {top_k_multiplied}) YIELD node, score"

# 在 Entity 表上进行向量搜索。
VECTOR_SEARCH_ENTITY = VECTOR_SEARCH_BASE + " RETURN node, score LIMIT $top_k"

# 在 Message 表上进行向量搜索，并限定在当前会话内。
VECTOR_SEARCH_MESSAGE = VECTOR_SEARCH_BASE + " WITH node, score MATCH (node)-[:POSTED_IN]->(s:Session {id: $sid}) RETURN node, score LIMIT $top_k"

# 在 MemoryFragment 表上进行向量搜索，并限定在当前会话内。
VECTOR_SEARCH_FRAGMENT = VECTOR_SEARCH_BASE + " WITH node, score MATCH (s:Session {id: $sid})-[:SESSION_HAS_MEMORY]->(node) RETURN node, score LIMIT $top_k"

# 根据关键词列表搜索实体。
KEYWORD_SEARCH_ENTITY = """
    MATCH (e:Entity)
    WHERE e.name IN $keywords
    RETURN e, 1.0 AS score
    LIMIT $limit
"""

# 从一组种子节点出发，进行一跳图遍历，获取其邻居节点和关系。
TRAVERSE_GRAPH = """
    MATCH (n) WHERE (n.id IN $seed_ids OR n.name IN $seed_ids)
    MATCH (n)-[r]-(m)
    RETURN n, r, m
    LIMIT 20
"""

# ================= 维护 (Maintenance) =================

# 计算图中所有节点的总数。
COUNT_ALL_NODES = "MATCH (n) RETURN count(n)"

# 根据 ID 列表删除消息节点及其所有关联关系。
DELETE_MESSAGES_BY_ID = "MATCH (m:Message) WHERE m.id IN $ids DETACH DELETE m"

# 查找消息数量超过阈值且需要进行记忆巩固的会话。
FIND_SESSIONS_FOR_CONSOLIDATION = """
    MATCH (s:Session)<-[:POSTED_IN]-(m:Message)
    WHERE m.is_summarized IS NULL OR m.is_summarized = false
    WITH s, count(m) AS message_count
    WHERE message_count > $threshold
    RETURN s.id
"""

# 获取一个会话中用于巩固的一批最旧的消息及其发送者信息。
GET_MESSAGES_FOR_CONSOLIDATION = """
    MATCH (m:Message)-[:POSTED_IN]->(s:Session {id: $sid})
    WHERE m.is_summarized IS NULL OR m.is_summarized = false
    WITH m ORDER BY m.timestamp ASC LIMIT $limit
    MATCH (u:User)-[:SENT]->(m)
    RETURN m.id, u.id, u.name, m.content
"""

# 创建一个新的 MemoryFragment (记忆摘要) 节点。
CREATE_MEMORY_FRAGMENT = """
    CREATE (mf:MemoryFragment {
        id: $id,
        text: $text,
        timestamp: $ts,
        embedding: $embedding
    })
"""

# 将一个记忆摘要节点连接到一个会话。
LINK_FRAGMENT_TO_SESSION = """
    MATCH (s:Session {id: $sid}), (mf:MemoryFragment {id: $fid})
    CREATE (s)-[:SESSION_HAS_MEMORY]->(mf)
"""

# 将一个记忆摘要节点连接到多个相关的用户。
LINK_FRAGMENT_TO_USERS = """
    MATCH (u:User), (mf:MemoryFragment {id: $fid})
    WHERE u.id IN $uids
    CREATE (u)-[:USER_HAS_MEMORY]->(mf)
"""

# 将一批消息标记为已摘要/已归档。
ARCHIVE_MESSAGES = """
    MATCH (m:Message)
    WHERE m.id IN $ids
    SET m.is_summarized = true
"""

# ================= 管理/WebUI (Admin/WebUI) =================

# 批量删除没有任何关系的孤立实体。
BATCH_DELETE_ISOLATED_ENTITIES = """
    MATCH (e:Entity)
    WHERE NOT (e)--()
    WITH e LIMIT 1000
    DETACH DELETE e
    RETURN count(e)
"""

# 批量删除早于指定天数的、未被总结的原始消息。
BATCH_DELETE_OLD_MESSAGES_BY_DAYS = """
    MATCH (m:Message)
    WHERE m.timestamp < ($current_ts_ms - ($days * 24 * 3600 * 1000)) AND (m.is_summarized IS NULL OR m.is_summarized = false)
    WITH m LIMIT 1000
    DETACH DELETE m
    RETURN count(m)
"""

# 获取所有会话的 ID。
GET_ALL_CONTEXTS = "MATCH (s:Session) RETURN s.id"

# 将一个手动创建的实体直接关联到一个会话。
LINK_ENTITY_TO_SESSION = """
    MATCH (s:Session {id: $sid}), (e:Entity {name: $ename})
    MERGE (s)-[:CONTAINS_ENTITY]->(e)
"""

# 为 WebUI 获取指定会话的所有相关节点 - 分为三个独立查询
GET_SESSION_GRAPH_NODES_PART1 = """
    MATCH (s:Session {id: $sid})
    RETURN s AS node
"""

GET_SESSION_GRAPH_NODES_PART2 = """
    MATCH (s:Session {id: $sid})--(n)
    RETURN n AS node
"""

GET_SESSION_GRAPH_NODES_PART3 = """
    MATCH (s:Session {id: $sid})<-[:POSTED_IN]-(:Message)-[:MENTIONS]->(e:Entity)
    RETURN e AS node
"""

# 为 WebUI 获取指定会话的所有相关关系 - 分为三个独立查询
GET_SESSION_GRAPH_EDGES_PART1 = """
    MATCH (s:Session {id: $sid})-[r]-(n)
    RETURN s AS a, r, n AS b
"""

GET_SESSION_GRAPH_EDGES_PART2 = """
    MATCH (s:Session {id: $sid})<-[:POSTED_IN]-(m:Message)-[r:MENTIONS]->(e:Entity)
    RETURN m AS a, r, e AS b
"""

GET_SESSION_GRAPH_EDGES_PART3 = """
    MATCH (s:Session {id: $sid})<-[:POSTED_IN]-(:Message)-[:MENTIONS]->(e1:Entity)-[r:RELATED_TO]->(e2:Entity)
    RETURN e1 AS a, r, e2 AS b
"""

# 优化后的全局图谱查询：仅查询 Entity 和 MemoryFragment 及其关系，忽略 Message 以减少数据量。
GET_GLOBAL_GRAPH_OPTIMIZED_NODES = """
    MATCH (n:Entity|MemoryFragment)
    RETURN n
"""

GET_GLOBAL_GRAPH_OPTIMIZED_EDGES = """
    MATCH (a:Entity|MemoryFragment)-[r]->(b:Entity|MemoryFragment)
    RETURN a, r, b
"""

# 根据 ID 和类型删除一个节点。
DELETE_NODE_BY_ID = "MATCH (n:{node_type} {{{id_field}: $node_id}}) DETACH DELETE n"

# 根据起点、终点和关系类型删除一条边。
DELETE_EDGE = """
    MATCH (a:{from_type} {{{from_id_field}: $from_id}})-[r:{rel_type}]->(b:{to_type} {{{to_id_field}: $to_id}})
    DELETE r
"""

# 查找源会话的所有记忆摘要 ID，用于迁移。
MIGRATE_FIND_MEMORIES = """
    MATCH (s:Session {id: $sid})-[:SESSION_HAS_MEMORY]->(mf:MemoryFragment)
    RETURN mf.id
"""

# 将一批记忆摘要关联到一个新的目标会话。
MIGRATE_LINK_MEMORIES = """
    MATCH (s:Session {id: $sid}), (mf:MemoryFragment)
    WHERE mf.id IN $mf_ids
    MERGE (s)-[:SESSION_HAS_MEMORY]->(mf)
"""

# 获取全局图谱的所有节点。
GET_GLOBAL_GRAPH_NODES = "MATCH (n) RETURN n"


# 获取全局图谱的所有关系。
GET_GLOBAL_GRAPH_EDGES = "MATCH (a)-[r]->(b) RETURN a, r, b"

# ================= Agentic 反思 (Reflection) =================

# 获取用于反思的候选节点：包括最近的记忆片段和连接最广的实体。
GET_REFLECTION_CANDIDATES = """
    // 获取最近的5个记忆片段
    MATCH (n:MemoryFragment)
    RETURN n.id AS id, 'MemoryFragment' AS type, n.timestamp AS order_key
    ORDER BY n.timestamp DESC
    LIMIT 5
    UNION ALL
    // 获取连接度最高的5个实体
    MATCH (n:Entity)
    WITH n, size((n)--()) AS degree
    RETURN n.name AS id, 'Entity' AS type, degree AS order_key
    ORDER BY degree DESC
    LIMIT 5
"""
