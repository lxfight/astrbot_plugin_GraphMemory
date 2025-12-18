"""KuzuDB Schema 定义和初始化"""

import kuzu
from pathlib import Path
from astrbot.api import logger


def get_embedding_dim_from_provider(embedding_provider) -> int:
    """从 Embedding Provider 获取向量维度

    Args:
        embedding_provider: Embedding Provider 实例

    Returns:
        向量维度，默认 1536 (OpenAI text-embedding-ada-002)
    """
    if not embedding_provider:
        return 1536

    # 尝试从 provider 获取维度信息
    if hasattr(embedding_provider, 'embedding_dim'):
        return embedding_provider.embedding_dim

    # 默认维度
    return 1536


def initialize_schema(db: kuzu.Database, conn: kuzu.Connection, embedding_dim: int = 1536):
    """初始化 KuzuDB Schema

    Args:
        db: KuzuDB 数据库实例
        conn: KuzuDB 连接实例
        embedding_dim: 向量维度
    """
    logger.info(f"[GraphMemory] 初始化 Schema (向量维度: {embedding_dim})...")

    # 创建节点表
    _create_node_tables(conn, embedding_dim)

    # 创建关系表
    _create_rel_tables(conn)

    logger.info("[GraphMemory] Schema 初始化完成")


def _create_node_tables(conn: kuzu.Connection, embedding_dim: int):
    """创建节点表"""

    # User 节点
    try:
        conn.execute(f"""
            CREATE NODE TABLE IF NOT EXISTS User (
                id STRING PRIMARY KEY,
                name STRING,
                platform STRING,
                created_at TIMESTAMP,
                last_active TIMESTAMP
            )
        """)
        logger.debug("[GraphMemory] User 节点表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] User 节点表已存在或创建失败: {e}")

    # Session 节点
    try:
        conn.execute(f"""
            CREATE NODE TABLE IF NOT EXISTS Session (
                id STRING PRIMARY KEY,
                name STRING,
                type STRING,
                persona_id STRING,
                created_at TIMESTAMP,
                last_active TIMESTAMP
            )
        """)
        logger.debug("[GraphMemory] Session 节点表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] Session 节点表已存在或创建失败: {e}")

    # Entity 节点
    try:
        conn.execute(f"""
            CREATE NODE TABLE IF NOT EXISTS Entity (
                name STRING PRIMARY KEY,
                type STRING,
                description STRING,
                embedding FLOAT[{embedding_dim}],
                importance FLOAT,
                created_at TIMESTAMP,
                last_accessed TIMESTAMP,
                access_count INT64
            )
        """)
        logger.debug("[GraphMemory] Entity 节点表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] Entity 节点表已存在或创建失败: {e}")


def _create_rel_tables(conn: kuzu.Connection):
    """创建关系表"""

    # PARTICIPATED_IN: User -> Session
    try:
        conn.execute("""
            CREATE REL TABLE IF NOT EXISTS PARTICIPATED_IN (
                FROM User TO Session,
                role STRING,
                joined_at TIMESTAMP
            )
        """)
        logger.debug("[GraphMemory] PARTICIPATED_IN 关系表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] PARTICIPATED_IN 关系表已存在或创建失败: {e}")

    # RELATED_TO: Entity -> Entity
    try:
        conn.execute("""
            CREATE REL TABLE IF NOT EXISTS RELATED_TO (
                FROM Entity TO Entity,
                relation STRING,
                strength FLOAT,
                evidence STRING,
                created_at TIMESTAMP,
                last_updated TIMESTAMP
            )
        """)
        logger.debug("[GraphMemory] RELATED_TO 关系表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] RELATED_TO 关系表已存在或创建失败: {e}")

    # MENTIONED_IN: Entity -> Session
    try:
        conn.execute("""
            CREATE REL TABLE IF NOT EXISTS MENTIONED_IN (
                FROM Entity TO Session,
                first_mentioned TIMESTAMP,
                last_mentioned TIMESTAMP,
                mention_count INT64,
                sentiment STRING
            )
        """)
        logger.debug("[GraphMemory] MENTIONED_IN 关系表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] MENTIONED_IN 关系表已存在或创建失败: {e}")

    # KNOWS: User -> Entity
    try:
        conn.execute("""
            CREATE REL TABLE IF NOT EXISTS KNOWS (
                FROM User TO Entity,
                first_known TIMESTAMP,
                last_updated TIMESTAMP,
                familiarity FLOAT
            )
        """)
        logger.debug("[GraphMemory] KNOWS 关系表已创建")
    except Exception as e:
        logger.debug(f"[GraphMemory] KNOWS 关系表已存在或创建失败: {e}")
