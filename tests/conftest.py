"""Pytest 配置和共享 fixtures"""

import asyncio
import tempfile
from pathlib import Path

import pytest


@pytest.fixture(scope="session")
def event_loop():
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def temp_dir():
    """创建临时目录"""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


@pytest.fixture
def mock_config():
    """模拟配置"""
    return {
        "embedding_provider_id": "test_embedding",
        "llm_provider_id": "test_llm",
        "enable_group_learning": True,
        "buffer_size_private": 5,
        "buffer_size_group": 10,
        "buffer_timeout": 60,
        "enable_query_rewriting": False,
        "retrieval_top_k": 3,
        "enable_function_calling": False,
        "webui_port": 8082,
        "webui_key": "test_key",
        "prune_interval": 3600,
        "time_decay_rate": 0.95,
        "min_importance_threshold": 0.1,
    }


@pytest.fixture
def sample_entities():
    """示例实体数据"""
    return [
        {
            "name": "张三",
            "type": "人物",
            "description": "一个测试用户",
            "importance": 0.8,
        },
        {
            "name": "北京",
            "type": "地点",
            "description": "中国首都",
            "importance": 0.9,
        },
        {
            "name": "Python",
            "type": "概念",
            "description": "编程语言",
            "importance": 0.7,
        },
    ]


@pytest.fixture
def sample_relations():
    """示例关系数据"""
    return [
        {
            "from": "张三",
            "relation": "居住在",
            "to": "北京",
            "strength": 0.8,
            "evidence": "张三住在北京",
        },
        {
            "from": "张三",
            "relation": "擅长",
            "to": "Python",
            "strength": 0.9,
            "evidence": "张三是 Python 专家",
        },
    ]


@pytest.fixture
def mock_graph_store(temp_dir, mock_config):
    """模拟图数据库"""
    from core.storage.graph_store import GraphStore

    db_path = temp_dir / "test_kuzu_db"
    store = GraphStore(db_path)  # 传递 Path 对象，__init__ 中自动初始化
    yield store
    store.close()


@pytest.fixture
def mock_buffer(temp_dir):
    """模拟缓冲区"""
    from core.storage.memory_buffer import MemoryBuffer

    # 模拟 flush callback
    async def mock_flush_callback(session_id, session_name, text, is_group, persona_id):
        pass

    buffer = MemoryBuffer(
        data_path=temp_dir,
        flush_callback=mock_flush_callback,
        max_size_private=5,
        max_size_group=10,
        max_wait_seconds=60,
    )
    yield buffer
    # MemoryBuffer 没有 close 方法，不需要清理


@pytest.fixture
def test_client(mock_graph_store, mock_config):
    """创建测试客户端"""
    from fastapi.testclient import TestClient
    from webui.app import create_app

    # 创建模拟管理器
    class MockManager:
        def __init__(self):
            self.graph_store = mock_graph_store
            self._core_initialized = True

        async def ensure_initialized(self):
            pass

        async def get_stats(self):
            return await self.graph_store.get_stats()

        async def export_graph(self, persona_id=None):
            return {"entities": [], "relations": []}

        async def import_graph(self, data, merge=True):
            return 0, 0

    manager = MockManager()
    app = create_app(manager, mock_config)

    return TestClient(app)
