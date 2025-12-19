"""WebUI API 集成测试"""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_client(mock_graph_store, mock_config):
    """创建测试客户端"""
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


@pytest.mark.integration
@pytest.mark.webui
def test_get_system_status(test_client):
    """测试获取系统状态"""
    response = test_client.get("/api/system/status?key=test_key")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "version" in data["data"]


@pytest.mark.integration
@pytest.mark.webui
def test_get_entities_list(test_client):
    """测试获取实体列表"""
    response = test_client.get("/api/entities?key=test_key")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "entities" in data["data"]
    assert "total" in data["data"]


@pytest.mark.integration
@pytest.mark.webui
def test_search_entities(test_client):
    """测试搜索实体"""
    response = test_client.get("/api/entities?key=test_key&query=测试")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True


@pytest.mark.integration
@pytest.mark.webui
def test_get_relations_list(test_client):
    """测试获取关系列表"""
    response = test_client.get("/api/relations?key=test_key")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "relations" in data["data"]


@pytest.mark.integration
@pytest.mark.webui
def test_get_stats_overview(test_client):
    """测试获取统计概览"""
    response = test_client.get("/api/stats/overview?key=test_key")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "total_entities" in data["data"]


@pytest.mark.integration
@pytest.mark.webui
def test_export_graph(test_client):
    """测试导出图谱"""
    response = test_client.get("/api/system/export?key=test_key")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "content" in data["data"]


@pytest.mark.integration
@pytest.mark.webui
def test_import_graph(test_client):
    """测试导入图谱"""
    import_data = {
        "content": '{"entities": [], "relations": []}',
        "merge": True,
    }

    response = test_client.post(
        "/api/system/import?key=test_key",
        json=import_data,
    )
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True


@pytest.mark.integration
@pytest.mark.webui
def test_unauthorized_access(test_client):
    """测试未授权访问"""
    response = test_client.get("/api/system/status?key=wrong_key")
    assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.webui
def test_missing_key(test_client):
    """测试缺少密钥"""
    response = test_client.get("/api/system/status")
    assert response.status_code == 422  # Validation error
