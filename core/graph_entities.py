"""
此文件使用 Python 的 `dataclasses` 定义了图数据库中的核心实体（节点和关系）。


注意：虽然这些类在 Python 代码中用于数据传输和组织，但 KuzuDB 的 Cypher 查询
是直接通过字符串和字典参数执行的，并不会直接实例化这些关系类（Rel）。
定义关系类主要是为了代码的清晰性和文档目的。
"""

from dataclasses import dataclass
from typing import Literal

# --- 节点定义 (Nodes) ---

@dataclass
class UserNode:
    """代表一个参与对话的用户。"""
    id: str          # 主键: 格式为 {platform}_{user_id}
    name: str        # 用户的昵称
    platform: str    # 用户所在的平台 (例如, "qq")
    # 用户画像的向量表示，用于未来功能，如匹配相似用户
    profile_embedding: list[float] | None = None

@dataclass
class SessionNode:
    """代表一个对话发生的场所，可以是一个群组或私聊。"""
    id: str          # 主键: 格式为 {platform}_{group_id} 或 {platform}_private_{user_id}
    type: Literal["GROUP", "PRIVATE"]  # 会话类型
    name: str | None = None            # 群名称或私聊对象名称

@dataclass
class MessageNode:
    """代表一条原始的对话消息记录。"""
    id: str          # 主键: 由平台提供的唯一消息 ID
    content: str     # 消息的纯文本内容
    timestamp: int   # Unix 时间戳
    sender_id: str   # 发送者的 UserNode.id
    session_id: str  # 所属的 SessionNode.id
    embedding: list[float] | None = None  # 消息内容的向量表示

@dataclass
class EntityNode:
    """代表从对话中提取出的一个知识原子，如一个概念、人物或地点。"""
    name: str        # 主键: 经过归一化处理的实体名称
    type: str = "Concept"  # 实体类型, 例如: Person, Location, Event, Concept
    summary: str | None = None  # 实体的简要描述
    embedding: list[float] | None = None  # 实体名称或描述的向量表示

@dataclass
class MemoryFragmentNode:
    """代表一段经过 LLM 总结和提炼后的高级记忆。"""
    id: str          # 主键: UUID
    text: str        # 总结后的记忆文本
    timestamp: int   # 记忆生成的时间戳
    valid_from: int | None = None   # 记忆有效期的开始时间 (未来功能)
    valid_until: int | None = None  # 记忆有效期的结束时间，用于处理状态变更 (未来功能)
    embedding: list[float] | None = None  # 记忆文本的向量表示

# --- 关系定义 (Relationships) ---
# 虽然 Kuzu 的操作不直接使用这些类，但在此处定义它们有助于保持代码的清晰和一致性。

@dataclass
class ParticipatedInRel:
    """表示 (User)-[PARTICIPATED_IN]->(Session) 的关系。"""
    user_id: str
    session_id: str

@dataclass
class SentRel:
    """表示 (User)-[SENT]->(Message) 的关系。"""
    user_id: str
    message_id: str

@dataclass
class PostedInRel:
    """表示 (Message)-[POSTED_IN]->(Session) 的关系。"""
    message_id: str
    session_id: str

@dataclass
class MentionsRel:
    """表示 (Message)-[MENTIONS]->(Entity) 的关系。"""
    message_id: str
    entity_name: str
    # 关系属性：消息中提到该实体时的情感色彩
    sentiment: Literal["Positive", "Negative", "Neutral"] | None = None

@dataclass
class HasMemoryRel:
    """表示 (User | Session)-[HAS_MEMORY]->(MemoryFragment) 的关系。"""
    source_id: str   # 源节点 ID (可以是 User.id 或 Session.id)
    memory_id: str   # 目标记忆片段节点的 ID

@dataclass
class RelatedToRel:
    """表示 (Entity)-[RELATED_TO]->(Entity) 的关系。"""
    src_entity: str  # 源实体名称
    tgt_entity: str  # 目标实体名称
    relation: str    # 关系的描述 (例如, "is a", "develops", "located in")
