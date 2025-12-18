"""数据实体定义"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class UserNode:
    """用户节点"""
    id: str
    name: str
    platform: str
    created_at: Optional[datetime] = None
    last_active: Optional[datetime] = None


@dataclass
class SessionNode:
    """会话节点"""
    id: str
    name: str
    type: str  # PRIVATE / GROUP
    persona_id: str = "default"
    created_at: Optional[datetime] = None
    last_active: Optional[datetime] = None


@dataclass
class EntityNode:
    """实体节点"""
    name: str
    type: str  # PERSON / PLACE / THING / CONCEPT / EVENT
    description: str
    embedding: Optional[list[float]] = None
    importance: float = 1.0
    created_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    access_count: int = 0


@dataclass
class ParticipatedInRel:
    """用户参与会话关系"""
    user_id: str
    session_id: str
    role: str = "MEMBER"  # MEMBER / ADMIN / OWNER
    joined_at: Optional[datetime] = None


@dataclass
class RelatedToRel:
    """实体关系"""
    from_entity: str
    to_entity: str
    relation: str
    strength: float = 1.0
    evidence: str = ""
    created_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None


@dataclass
class MentionedInRel:
    """实体在会话中被提及"""
    entity_name: str
    session_id: str
    first_mentioned: Optional[datetime] = None
    last_mentioned: Optional[datetime] = None
    mention_count: int = 1
    sentiment: str = "NEUTRAL"  # POSITIVE / NEUTRAL / NEGATIVE


@dataclass
class KnowsRel:
    """用户了解实体"""
    user_id: str
    entity_name: str
    first_known: Optional[datetime] = None
    last_updated: Optional[datetime] = None
    familiarity: float = 1.0


@dataclass
class ExtractedKnowledge:
    """从对话中提取的知识"""
    entities: list[EntityNode] = field(default_factory=list)
    relations: list[RelatedToRel] = field(default_factory=list)
    mentions: list[MentionedInRel] = field(default_factory=list)


@dataclass
class BufferedMessage:
    """缓冲区消息"""
    sender_id: str
    sender_name: str
    content: str
    timestamp: float
    role: str  # user / assistant
    persona_id: str = "default"

    def to_log_str(self) -> str:
        """转换为日志格式"""
        return f"[{self.role}:{self.sender_name}:{self.sender_id}]: {self.content}"
