"""GraphMemory 核心模块

分层架构:
- models: 数据模型层（实体定义、Schema）
- storage: 存储层（图数据库、缓冲区）
- retrieval: 检索层（知识提取、记忆检索）
- services: 服务层（实体消歧、Function Calling）
- handlers: 处理器层（指令处理）
- utils: 工具层（Prompt 模板）
- manager: 核心管理器
"""

from .handlers import CommandHandler
from .manager import GraphMemoryManager
from .models import (
    BufferedMessage,
    EntityNode,
    ExtractedKnowledge,
    SessionNode,
    UserNode,
)
from .retrieval import KnowledgeExtractor, MemoryRetriever
from .services import EntityDisambiguation, FunctionCallingHandler
from .storage import GraphStore, MemoryBuffer
from .utils import EXTRACTION_PROMPT, QUERY_REWRITING_PROMPT

__all__ = [
    # Manager
    "GraphMemoryManager",
    # Handlers
    "CommandHandler",
    # Models
    "EntityNode",
    "UserNode",
    "SessionNode",
    "ExtractedKnowledge",
    "BufferedMessage",
    # Storage
    "GraphStore",
    "MemoryBuffer",
    # Retrieval
    "KnowledgeExtractor",
    "MemoryRetriever",
    # Services
    "EntityDisambiguation",
    "FunctionCallingHandler",
    # Utils
    "EXTRACTION_PROMPT",
    "QUERY_REWRITING_PROMPT",
]
