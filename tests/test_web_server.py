import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

# ==================== 1. 修复导入路径 ====================
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ==================== 2. Mock 所有外部依赖 ====================

# Mock astrbot.api
mock_astrbot_api = MagicMock()
mock_logger = MagicMock()
mock_astrbot_api.logger = mock_logger
sys.modules["astrbot"] = MagicMock()
sys.modules["astrbot.api"] = mock_astrbot_api

# Mock fastapi
mock_fastapi = MagicMock()
mock_fastapi_middleware = MagicMock()
mock_fastapi_responses = MagicMock()

# Mock FastAPI classes
class MockFastAPI:
    def __init__(self, **kwargs):
        self.title = kwargs.get("title", "")
        self.version = kwargs.get("version", "")
        self.routes = []
        self.middleware_stack = []

    def add_middleware(self, middleware_class, **kwargs):
        self.middleware_stack.append((middleware_class, kwargs))

    def get(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("GET", path, func, kwargs))
            return func
        return decorator

    def post(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("POST", path, func, kwargs))
            return func
        return decorator

    def put(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("PUT", path, func, kwargs))
            return func
        return decorator

    def delete(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("DELETE", path, func, kwargs))
            return func
        return decorator

    def websocket(self, path):
        def decorator(func):
            self.routes.append(("WEBSOCKET", path, func, {}))
            return func
        return decorator

class MockHTTPException(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)

class MockRequest:
    def __init__(self, headers=None, cookies=None):
        self.headers = headers or {}
        self.cookies = cookies or {}

class MockWebSocket:
    def __init__(self):
        self.accepted = False
        self.sent_messages = []
        self.received_messages = []
        self.disconnected = False

    async def accept(self):
        self.accepted = True

    async def send_text(self, message):
        self.sent_messages.append(message)

    async def receive_text(self):
        if self.received_messages:
            return self.received_messages.pop(0)
        # Simulate disconnect after some time
        await asyncio.sleep(0.1)
        raise MockWebSocketDisconnect()

class MockWebSocketDisconnect(Exception):
    pass

class MockJSONResponse:
    def __init__(self, content=None, status_code=200):
        self.content = content
        self.status_code = status_code
        self.cookies = {}

    def set_cookie(self, key, value, **kwargs):
        self.cookies[key] = (value, kwargs)

    def delete_cookie(self, key):
        self.cookies[key] = (None, {"deleted": True})

class MockFileResponse:
    def __init__(self, path, media_type=None):
        self.path = path
        self.media_type = media_type

class MockHTMLResponse:
    def __init__(self, content, status_code=200):
        self.content = content
        self.status_code = status_code

class MockBaseModel:
    pass

class MockCORSMiddleware:
    pass

mock_fastapi.FastAPI = MockFastAPI
mock_fastapi.HTTPException = MockHTTPException
mock_fastapi.Request = MockRequest
mock_fastapi.WebSocket = MockWebSocket
mock_fastapi.WebSocketDisconnect = MockWebSocketDisconnect
mock_fastapi.Depends = lambda x: x
mock_fastapi.status = MagicMock()
mock_fastapi.status.HTTP_401_UNAUTHORIZED = 401

mock_fastapi_middleware.cors = MagicMock()
mock_fastapi_middleware.cors.CORSMiddleware = MockCORSMiddleware

mock_fastapi_responses.FileResponse = MockFileResponse
mock_fastapi_responses.HTMLResponse = MockHTMLResponse
mock_fastapi_responses.JSONResponse = MockJSONResponse

sys.modules["fastapi"] = mock_fastapi
sys.modules["fastapi.middleware"] = mock_fastapi_middleware
sys.modules["fastapi.middleware.cors"] = mock_fastapi_middleware.cors
sys.modules["fastapi.responses"] = mock_fastapi_responses

# Mock pydantic
mock_pydantic = MagicMock()
mock_pydantic.BaseModel = MockBaseModel
sys.modules["pydantic"] = mock_pydantic

# Mock monitoring_service
mock_monitoring_service = AsyncMock()
sys.modules["core.monitoring_service"] = MagicMock()
sys.modules["core.monitoring_service"].monitoring_service = mock_monitoring_service

# ==================== 3. 导入业务代码 ====================
from core.web_server import WebServer  # noqa: E402

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_graph_engine():
    """提供一个 mock 的 GraphEngine。"""
    engine = AsyncMock()
    return engine


@pytest.fixture
def basic_config():
    """提供基本配置。"""
    return {
        "webui_host": "127.0.0.1",
        "webui_port": 8081,
        "webui_key": "test_key_123",
        "recall_vector_top_k": 5,
        "recall_keyword_top_k": 3,
    }


@pytest.fixture
def web_server(mock_graph_engine, basic_config):
    """提供一个 WebServer 实例。"""
    with patch("core.web_server.GraphService") as mock_service_class:
        mock_service = AsyncMock()
        mock_service_class.return_value = mock_service
        server = WebServer(mock_graph_engine, basic_config)
        server.service = mock_service
        return server


# ==================== 5. 初始化测试 ====================


def test_web_server_initialization_with_config(mock_graph_engine, basic_config):
    """测试：使用配置初始化 WebServer。"""
    with patch("core.web_server.GraphService"):
        server = WebServer(mock_graph_engine, basic_config)

        assert server.host == "127.0.0.1"
        assert server.port == 8081
        assert server.auth_key == "test_key_123"
        assert server.configured_key == "test_key_123"
        assert isinstance(server.sessions, set)
        assert len(server.sessions) == 0


def test_web_server_initialization_without_key(mock_graph_engine):
    """测试：未提供密钥时生成随机密钥。"""
    config = {"webui_host": "0.0.0.0", "webui_port": 8080}

    with patch("core.web_server.GraphService"):
        server = WebServer(mock_graph_engine, config)

        assert server.auth_key is not None
        assert len(server.auth_key) == 16
        assert server.configured_key == ""


def test_generate_key():
    """测试：密钥生成功能。"""
    config = {}

    with patch("core.web_server.GraphService"):
        server = WebServer(AsyncMock(), config)

        key1 = server._generate_key(16)
        key2 = server._generate_key(16)

        assert len(key1) == 16
        assert key1 != key2
        assert key1.isalnum()


# ==================== 6. 认证测试 ====================


def test_check_auth_with_valid_bearer_token(web_server):
    """测试：使用有效的 Bearer token 进行认证。"""
    token = "valid_token_123"
    web_server.sessions.add(token)

    request = MockRequest(headers={"Authorization": f"Bearer {token}"})

    result = web_server._check_auth(request)
    assert result is True


def test_check_auth_with_valid_cookie(web_server):
    """测试：使用有效的 cookie 进行认证。"""
    token = "valid_cookie_token"
    web_server.sessions.add(token)

    request = MockRequest(cookies={"session_token": token})

    result = web_server._check_auth(request)
    assert result is True


def test_check_auth_with_invalid_token(web_server):
    """测试：使用无效 token 认证失败。"""
    request = MockRequest(headers={"Authorization": "Bearer invalid_token"})

    with pytest.raises(MockHTTPException) as exc_info:
        web_server._check_auth(request)

    assert exc_info.value.status_code == 401


def test_check_auth_without_token(web_server):
    """测试：没有 token 时认证失败。"""
    request = MockRequest()

    with pytest.raises(MockHTTPException) as exc_info:
        web_server._check_auth(request)

    assert exc_info.value.status_code == 401


# ==================== 7. 服务器生命周期测试 ====================


@patch("threading.Thread")
def test_start_creates_and_starts_thread(mock_thread_class, web_server):
    """测试：start() 方法创建并启动一个新线程。"""
    mock_thread_instance = MagicMock()
    mock_thread_class.return_value = mock_thread_instance

    web_server.start()

    mock_thread_class.assert_called_once_with(
        target=web_server._run_fastapi_server, daemon=True
    )
    mock_thread_instance.start.assert_called_once()
    assert web_server.server_thread == mock_thread_instance


def test_multiple_stop_calls(web_server):
    """测试：多次调用 stop 不会出错。"""
    web_server.server_thread = MagicMock()
    web_server.server_thread.is_alive.return_value = False

    # 第一次停止
    web_server.stop()
    assert web_server.stop_event.is_set()

    # 第二次停止
    web_server.stop()
    assert web_server.stop_event.is_set()


# ==================== 8. API 路由处理测试 ====================


@pytest.mark.asyncio
async def test_login_route_success(web_server):
    """测试：登录成功。"""
    data = {"key": web_server.auth_key}

    login_route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/login" and method == "POST"),
        None
    )
    assert login_route is not None, "登录路由未找到"

    response = await login_route(data)

    assert response.status_code == 200
    assert response.content["status"] == "success"
    assert "token" in response.content
    assert "session_token" in response.cookies


@pytest.mark.asyncio
async def test_login_route_failure(web_server):
    """测试：登录失败。"""
    data = {"key": "wrong_key"}

    login_route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/login" and method == "POST"),
        None
    )
    assert login_route is not None, "登录路由未找到"

    response = await login_route(data)

    assert response.status_code == 401
    assert response.cookies["session_token"][1].get("deleted") is True


@pytest.mark.asyncio
async def test_delete_node_route_error(web_server):
    """测试：删除节点路由错误。"""
    web_server.service.delete_node = AsyncMock(side_effect=Exception("Delete failed"))

    route = next(
        (func for method, path, func, _ in web_server.app.routes if "/api/node/{node_type}/{node_id}" in path and method == "DELETE"),
        None
    )
    assert route is not None, "删除节点路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route("Entity", "node_123", True)

    assert exc_info.value.status_code == 500
    assert "Delete failed" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_update_node_route_missing_properties(web_server):
    """测试：更新节点路由缺少属性。"""
    data = {}

    route = next(
        (func for method, path, func, _ in web_server.app.routes if "/api/node/{node_type}/{node_id}" in path and method == "PUT"),
        None
    )
    assert route is not None, "更新节点路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route("Entity", "node_123", data, True)

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_batch_delete_route_missing_task_name(web_server):
    """测试：批量删除路由缺少任务名。"""
    data = {}

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/batch-delete" and method == "POST"),
        None
    )
    assert route is not None, "批量删除路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_batch_delete_route_error(web_server):
    """测试：批量删除路由错误。"""
    web_server.service.batch_delete = AsyncMock(side_effect=Exception("Batch delete failed"))
    data = {"task_name": "delete_old_sessions"}

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/batch-delete" and method == "POST"),
        None
    )
    assert route is not None, "批量删除路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_create_node_route_failure(web_server):
    """测试：创建节点路由失败。"""
    web_server.service.create_node = AsyncMock(return_value=False)
    data = {"node_type": "Entity", "properties": {"name": "Test"}}

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/node" and method == "POST"),
        None
    )
    assert route is not None, "创建节点路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_create_node_route_missing_fields(web_server):
    """测试：创建节点路由缺少字段。"""
    data = {"node_type": "Entity"}  # 缺少 properties

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/node" and method == "POST"),
        None
    )
    assert route is not None, "创建节点路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_link_entity_route_missing_fields(web_server):
    """测试：关联实体路由缺少字段。"""
    data = {"session_id": "session_123"}  # 缺少 entity_name

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/link" and method == "POST"),
        None
    )
    assert route is not None, "关联实体路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_create_edge_route_not_implemented(web_server):
    """测试：创建边路由未实现错误。"""
    web_server.service.create_edge = AsyncMock(side_effect=NotImplementedError("Not supported"))

    class Payload:
        from_id = "from_1"
        to_id = "to_1"
        rel_type = "RELATES"
        from_type = "Entity"
        to_type = "Entity"

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/edge" and method == "POST"),
        None
    )
    assert route is not None, "创建边路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(Payload(), True)

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_debug_search_route_error(web_server):
    """测试：调试搜索路由错误。"""
    web_server.service.debug_search = AsyncMock(side_effect=Exception("Search failed"))

    route = next(
        (func for method, path, func, _ in web_server.app.routes if path == "/api/debug_search" and method == "GET"),
        None
    )
    assert route is not None, "调试搜索路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(q="test", session_id="session_123", _=True)

    assert exc_info.value.status_code == 500


# ==================== 9. 文件服务路由测试 ====================


@pytest.mark.asyncio
async def test_index_route_file_exists(web_server):
    """测试：主页路由文件存在。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/" and method == "GET"), None)
    assert route is not None, "主页路由未找到"

    with patch("core.web_server.os.path.exists", return_value=True):
        response = await route()

        assert isinstance(response, MockFileResponse)
        assert "index.html" in response.path


@pytest.mark.asyncio
async def test_index_route_file_not_exists(web_server):
    """测试：主页路由文件不存在。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/" and method == "GET"), None)
    assert route is not None, "主页路由未找到"

    with patch("core.web_server.os.path.exists", return_value=False):
        response = await route()

        assert isinstance(response, MockHTMLResponse)
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_serve_assets_success(web_server):
    """测试：成功提供静态资源。"""
    route = next((func for method, path, func, _ in web_server.app.routes if "/assets/{file_path:path}" in path and method == "GET"), None)
    assert route is not None, "资源文件路由未找到"

    with patch("core.web_server.os.path.exists", return_value=True):
        # Test JS
        response_js = await route("test.js")
        assert isinstance(response_js, MockFileResponse)
        assert response_js.media_type == "application/javascript"

        # Test CSS
        response_css = await route("test.css")
        assert isinstance(response_css, MockFileResponse)
        assert response_css.media_type == "text/css"

        # Test other file
        response_other = await route("test.png")
        assert isinstance(response_other, MockFileResponse)
        assert response_other.media_type is None


@pytest.mark.asyncio
async def test_serve_assets_not_found(web_server):
    """测试：资源文件不存在。"""
    route = next((func for method, path, func, _ in web_server.app.routes if "/assets/{file_path:path}" in path and method == "GET"), None)
    assert route is not None, "资源文件路由未找到"

    with patch("core.web_server.os.path.exists", return_value=False):
        response = await route("nonexistent.js")

        assert isinstance(response, MockHTMLResponse)
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_serve_app_js_exists(web_server):
    """测试：成功提供 app.js。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/app.js" and method == "GET"), None)
    assert route is not None, "app.js 路由未找到"

    with patch("core.web_server.os.path.exists", return_value=True):
        response = await route()

        assert isinstance(response, MockFileResponse)
        assert "app.js" in response.path
        assert response.media_type == "application/javascript"


@pytest.mark.asyncio
async def test_serve_app_js_not_exists(web_server):
    """测试：服务app.js不存在。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/app.js" and method == "GET"), None)
    assert route is not None, "app.js 路由未找到"

    with patch("core.web_server.os.path.exists", return_value=False):
        response = await route()

        assert isinstance(response, MockHTMLResponse)
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_favicon_not_exists(web_server):
    """测试：favicon不存在。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/favicon.ico" and method == "GET"), None)
    assert route is not None, "favicon 路由未找到"

    with patch("core.web_server.os.path.exists", return_value=False):
        response = await route()

        assert isinstance(response, MockHTMLResponse)
        assert response.status_code == 204


# ==================== 10. WebSocket 测试 ====================


@pytest.mark.asyncio
async def test_websocket_endpoint(web_server):
    """测试：WebSocket端点。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/ws/status" and method == "WEBSOCKET"), None)
    assert route is not None, "WebSocket 路由未找到"

    mock_websocket = MockWebSocket()

    try:
        await route(mock_websocket)
    except MockWebSocketDisconnect:
        pass

    mock_monitoring_service.connect.assert_called_once_with(mock_websocket)
    mock_monitoring_service.disconnect.assert_called_once_with(mock_websocket)


# ==================== 11. 错误处理测试 ====================


@pytest.mark.asyncio
async def test_delete_edge_route_error(web_server):
    """测试：删除边路由错误。"""
    web_server.service.delete_edge = AsyncMock(side_effect=Exception("Delete failed"))

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/edge" and method == "DELETE"), None)
    assert route is not None, "删除边路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route("from_1", "to_1", "RELATES", "Entity", "Entity", True)

    assert exc_info.value.status_code == 500


# ==================== 12. API 成功路径测试 ====================


@pytest.mark.asyncio
async def test_get_contexts_success(web_server):
    """测试：成功获取上下文。"""
    expected_contexts = ["session1", "session2"]
    web_server.service.get_contexts = AsyncMock(return_value=expected_contexts)

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/contexts"), None)
    assert route is not None

    response = await route(_=True)

    assert response == expected_contexts
    web_server.service.get_contexts.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_graph_data_success(web_server):
    """测试：成功获取图数据。"""
    expected_data = {"nodes": [], "edges": []}
    web_server.service.get_graph_data = AsyncMock(return_value=expected_data)

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/graph"), None)
    assert route is not None

    response = await route(session_id="s1", _=True)

    assert response == expected_data
    web_server.service.get_graph_data.assert_awaited_once_with("s1")


@pytest.mark.asyncio
async def test_debug_search_success(web_server):
    """测试：成功进行调试搜索。"""
    expected_result = {"data": "search_result"}
    web_server.service.debug_search = AsyncMock(return_value=expected_result)

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/debug_search"), None)
    assert route is not None

    response = await route(q="query", session_id="s1", _=True)

    assert response == expected_result
    web_server.service.debug_search.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_node_success(web_server):
    """测试：成功删除节点。"""
    web_server.service.delete_node = AsyncMock()

    route = next((func for method, path, func, _ in web_server.app.routes if "/api/node/{node_type}/{node_id}" in path and method == "DELETE"), None)
    assert route is not None

    response = await route(node_type="Entity", node_id="n1", _=True)

    assert response == {"status": "success"}
    web_server.service.delete_node.assert_awaited_once_with("n1", "Entity")


@pytest.mark.asyncio
async def test_delete_edge_success(web_server):
    """测试：成功删除边。"""
    web_server.service.delete_edge = AsyncMock()

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/edge" and method == "DELETE"), None)
    assert route is not None

    response = await route(from_id="f1", to_id="t1", rel_type="REL", from_type="FT", to_type="TT", _=True)

    assert response == {"status": "success"}
    web_server.service.delete_edge.assert_awaited_once_with("f1", "t1", "REL", "FT", "TT")


@pytest.mark.asyncio
async def test_update_node_success(web_server):
    """测试：成功更新节点。"""
    web_server.service.update_node = AsyncMock()
    data = {"properties": {"key": "value"}}

    route = next((func for method, path, func, _ in web_server.app.routes if "/api/node/{node_type}/{node_id}" in path and method == "PUT"), None)
    assert route is not None

    response = await route(node_type="Entity", node_id="n1", data=data, _=True)

    assert response == {"status": "success"}
    web_server.service.update_node.assert_awaited_once_with("n1", "Entity", {"key": "value"})


@pytest.mark.asyncio
async def test_batch_delete_success(web_server):
    """测试：成功执行批量删除。"""
    web_server.service.batch_delete = AsyncMock(return_value=5)
    data = {"task_name": "test_task", "params": {"days": 7}}

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/batch-delete"), None)
    assert route is not None

    response = await route(data=data, _=True)

    assert response == {"status": "success", "deleted_count": 5}
    web_server.service.batch_delete.assert_awaited_once_with("test_task", days=7)


@pytest.mark.asyncio
async def test_create_node_success(web_server):
    """测试：成功创建节点。"""
    web_server.service.create_node = AsyncMock(return_value=True)
    data = {"node_type": "Entity", "properties": {"name": "Test"}}

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/node" and method == "POST"), None)
    assert route is not None

    response = await route(data=data, _=True)

    assert response == {"status": "success"}
    web_server.service.create_node.assert_awaited_once_with("Entity", {"name": "Test"})


@pytest.mark.asyncio
async def test_link_entity_success(web_server):
    """测试：成功关联实体。"""
    web_server.service.link_entity_to_session = AsyncMock()
    data = {"session_id": "s1", "entity_name": "e1"}

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/link" and method == "POST"), None)
    assert route is not None

    response = await route(data=data, _=True)

    assert response == {"status": "success"}
    web_server.service.link_entity_to_session.assert_awaited_once_with("s1", "e1")


@pytest.mark.asyncio
async def test_create_edge_success(web_server):
    """测试：成功创建边。"""
    web_server.service.create_edge = AsyncMock()

    class Payload:
        from_id = "f1"
        to_id = "t1"
        rel_type = "REL"
        from_type = "FT"
        to_type = "TT"

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/edge" and method == "POST"), None)
    assert route is not None

    response = await route(payload=Payload(), _=True)

    assert response == {"status": "success"}
    web_server.service.create_edge.assert_awaited_once_with("f1", "t1", "REL", "FT", "TT")


@pytest.mark.asyncio
async def test_check_session_success(web_server):
    """测试：成功检查会话。"""
    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/session"), None)
    assert route is not None

    response = await route()

    assert response.status_code == 200
    assert response.content == {"status": "ok"}


# ==================== 13. 服务器生命周期详细测试 ====================


@patch("builtins.__import__")
@patch("core.web_server.asyncio")
@patch("core.web_server.threading.Thread")
def test_run_fastapi_server_and_shutdown(mock_thread, mock_asyncio, mock_import, web_server):
    """测试：服务器运行与关闭的完整流程。"""
    # --- Setup Mocks ---
    mock_loop = MagicMock()
    mock_asyncio.new_event_loop.return_value = mock_loop

    mock_uvicorn = MagicMock()
    mock_server_instance = MagicMock()
    mock_uvicorn.Server.return_value = mock_server_instance

    # 当代码尝试 `import uvicorn` 时，返回我们的 mock
    def import_side_effect(name, *args, **kwargs):
        if name == "uvicorn":
            return mock_uvicorn
        return __builtins__.__import__(name, *args, **kwargs)
    mock_import.side_effect = import_side_effect

    # --- Start Server ---
    web_server.start()
    mock_thread.assert_called_once()

    # --- Stop Server ---
    web_server.uvicorn_server = mock_server_instance
    web_server.server_loop = mock_loop

    # 模拟 shutdown 协程
    shutdown_coro = asyncio.Future()
    shutdown_coro.set_result(None)
    mock_server_instance.shutdown.return_value = shutdown_coro

    # 模拟 run_coroutine_threadsafe
    future = MagicMock()
    mock_asyncio.run_coroutine_threadsafe.return_value = future

    web_server.stop()

    # --- Assertions ---
    mock_asyncio.run_coroutine_threadsafe.assert_called_once_with(
        mock_server_instance.shutdown(),
        mock_loop
    )
    future.result.assert_called_once_with(timeout=3.0)


@pytest.mark.asyncio
async def test_update_node_route_error(web_server):
    """测试：更新节点路由错误。"""
    web_server.service.update_node = AsyncMock(side_effect=Exception("Update failed"))
    data = {"properties": {"name": "New Name"}}

    route = next((func for method, path, func, _ in web_server.app.routes if "/api/node/{node_type}/{node_id}" in path and method == "PUT"), None)
    assert route is not None, "更新节点路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route("Entity", "node_123", data, True)

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_link_entity_route_error(web_server):
    """测试：关联实体路由错误。"""
    web_server.service.link_entity_to_session = AsyncMock(side_effect=Exception("Link failed"))
    data = {"session_id": "session_123", "entity_name": "entity_1"}

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/link" and method == "POST"), None)
    assert route is not None, "关联实体路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(data, True)

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_create_edge_route_error(web_server):
    """测试：创建边路由错误。"""
    web_server.service.create_edge = AsyncMock(side_effect=Exception("Create failed"))

    class Payload:
        from_id = "from_1"
        to_id = "to_1"
        rel_type = "RELATES"
        from_type = "Entity"
        to_type = "Entity"

    route = next((func for method, path, func, _ in web_server.app.routes if path == "/api/edge" and method == "POST"), None)
    assert route is not None, "创建边路由未找到"

    with pytest.raises(MockHTTPException) as exc_info:
        await route(Payload(), True)

    assert exc_info.value.status_code == 500
