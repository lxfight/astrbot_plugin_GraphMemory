"""
此文件定义了图数据库的模式（Schema）。
它负责在 KuzuDB 中创建所有必要的节点表（Node Tables）和关系表（Rel Tables）。
"""

from typing import Any

from astrbot.api import logger


def get_embedding_dim_from_provider(embedding_provider: Any) -> int:
    """从 embedding provider 获取维度，如果失败则返回默认值。"""
    logger.debug("[GraphMemory Schema] 正在尝试获取 Embedding 维度...")
    if not embedding_provider:
        logger.debug("[GraphMemory Schema] embedding_provider 为 None。")
    elif not hasattr(embedding_provider, "get_dim"):
        logger.debug(
            f"[GraphMemory Schema] embedding_provider ({type(embedding_provider)}) 没有 get_dim 属性。"
        )
    elif not callable(embedding_provider.get_dim):
        logger.debug("[GraphMemory Schema] embedding_provider.get_dim 不是可调用方法。")
    else:
        try:
            dim = embedding_provider.get_dim()
            logger.debug(
                f"[GraphMemory Schema] provider.get_dim() 返回: {dim} (类型: {type(dim)})"
            )
            if isinstance(dim, int) and dim > 0:
                logger.info(
                    f"[GraphMemory Schema] 从 Provider 获取到 Embedding 维度: {dim}"
                )
                return dim
            else:
                logger.debug("[GraphMemory Schema] get_dim() 返回了无效的维度值。")
        except Exception as e:
            logger.error(
                f"[GraphMemory Schema] 调用 provider.get_dim() 时出错: {e}",
                exc_info=True,
            )

    default_dim = 1024
    logger.warning(
        f"[GraphMemory Schema] 未能从 Provider 获取 Embedding 维度，将默认使用 {default_dim}。"
    )
    return default_dim


def initialize_schema(conn, embedding_dim: int):
    """
    使用 KuzuDB 的数据定义语言（DDL）来初始化或验证图数据库的模式。

    此函数被设计为幂等的（idempotent），这意味着它可以被安全地多次运行。
    如果表已经存在，`CREATE TABLE` 命令会引发一个 `RuntimeError`，
    我们通过 `try...except` 块来捕获并忽略这个错误，从而确保程序可以继续执行。

    Args:
        conn: 一个活跃的 KuzuDB 连接对象。
        embedding_dim (int): 用于向量字段的维度大小。
    """

    # 如果没有从 embedding provider 获取到维度，使用一个合理的默认值
    if embedding_dim <= 0:
        embedding_dim = 1024
        logger.warning(
            f"[GraphMemory Schema] 未检测到 Embedding 维度，将默认使用 {embedding_dim}。"
        )

    # --- 节点表定义 (Node Tables) ---

    # 用户节点表
    try:
        conn.execute("""
            CREATE NODE TABLE User(
                id STRING,
                name STRING,
                platform STRING,
                PRIMARY KEY (id)
            )
        """)
        logger.info("[GraphMemory Schema] 已创建节点表 'User'。")
    except RuntimeError:
        pass  # 表已存在

    # 会话节点表
    try:
        conn.execute("""
            CREATE NODE TABLE Session(
                id STRING,
                type STRING,
                name STRING,
                PRIMARY KEY (id)
            )
        """)
        logger.info("[GraphMemory Schema] 已创建节点表 'Session'。")
    except RuntimeError:
        pass  # 表已存在

    # 消息节点表 (包含向量索引)
    try:
        conn.execute(f"""
            CREATE NODE TABLE Message(
                id STRING,
                content STRING,
                timestamp INT64,
                embedding FLOAT[{embedding_dim}],
                is_summarized BOOL,
                PRIMARY KEY (id)
            )
        """)
        logger.info("[GraphMemory Schema] 已创建节点表 'Message'。")
    except RuntimeError:
        pass  # 表已存在

    # 实体节点表 (包含向量索引)
    try:
        conn.execute(f"""
            CREATE NODE TABLE Entity(
                name STRING,
                type STRING,
                summary STRING,
                embedding FLOAT[{embedding_dim}],
                last_accessed INT64,
                PRIMARY KEY (name)
            )
        """)
        logger.info("[GraphMemory Schema] 已创建节点表 'Entity'。")
    except RuntimeError:
        pass  # 表已存在

    # 记忆片段节点表 (包含向量索引)
    try:
        conn.execute(f"""
            CREATE NODE TABLE MemoryFragment(
                id STRING,
                text STRING,
                timestamp INT64,
                valid_from INT64,
                valid_until INT64,
                embedding FLOAT[{embedding_dim}],
                PRIMARY KEY (id)
            )
        """)
        logger.info("[GraphMemory Schema] 已创建节点表 'MemoryFragment'。")
    except RuntimeError:
        pass  # 表已存在

    # --- 关系表定义 (Rel Tables) ---

    # (User)-[PARTICIPATED_IN]->(Session)
    try:
        conn.execute("CREATE REL TABLE PARTICIPATED_IN(FROM User TO Session)")
        logger.info("[GraphMemory Schema] 已创建关系表 'PARTICIPATED_IN'。")
    except RuntimeError:
        pass  # 表已存在

    # (User)-[SENT]->(Message)
    try:
        conn.execute("CREATE REL TABLE SENT(FROM User TO Message)")
        logger.info("[GraphMemory Schema] 已创建关系表 'SENT'。")
    except RuntimeError:
        pass  # 表已存在

    # (Message)-[POSTED_IN]->(Session)
    try:
        conn.execute("CREATE REL TABLE POSTED_IN(FROM Message TO Session)")
        logger.info("[GraphMemory Schema] 已创建关系表 'POSTED_IN'。")
    except RuntimeError:
        pass  # 表已存在

    # (Message)-[MENTIONS]->(Entity)
    try:
        conn.execute(
            "CREATE REL TABLE MENTIONS(FROM Message TO Entity, sentiment STRING)"
        )
        logger.info("[GraphMemory Schema] 已创建关系表 'MENTIONS'。")
    except RuntimeError:
        pass  # 表已存在

    # (User|Session)-[HAS_MEMORY]->(MemoryFragment)
    # Kuzu 不支持多类型的源/目标节点，因此需要为 User 和 Session 分别创建独立的关系表。
    try:
        conn.execute("CREATE REL TABLE USER_HAS_MEMORY(FROM User TO MemoryFragment)")
        conn.execute(
            "CREATE REL TABLE SESSION_HAS_MEMORY(FROM Session TO MemoryFragment)"
        )
        logger.info("[GraphMemory Schema] 已创建 HAS_MEMORY 的相关关系表。")
    except RuntimeError:
        pass  # 表已存在

    # (Entity)-[RELATED_TO]->(Entity)
    try:
        conn.execute(
            "CREATE REL TABLE RELATED_TO(FROM Entity TO Entity, relation STRING)"
        )
        logger.info("[GraphMemory Schema] 已创建关系表 'RELATED_TO'。")
    except RuntimeError:
        pass  # 表已存在

    # (Session)-[CONTAINS_ENTITY]->(Entity)
    try:
        conn.execute("CREATE REL TABLE CONTAINS_ENTITY(FROM Session TO Entity)")
        logger.info("[GraphMemory Schema] 已创建关系表 'CONTAINS_ENTITY'。")
    except RuntimeError:
        pass  # 表已存在
