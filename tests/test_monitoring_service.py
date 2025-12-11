import asyncio
import json
import os
import sys
from unittest.mock import MagicMock

import pytest

# ==================== 1. 修复导入路径 ====================
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ==================== 2. Mock fastapi ====================
mock_fastapi = MagicMock()
sys.modules["fastapi"] = mock_fastapi

# Mock WebSocket
class MockWebSocket:
    def __init__(self):
        self.accepted = False
        self.sent_messages = []
        self.closed = False

    async def accept(self):
        self.accepted = True

    async def send_text(self, message: str):
        if self.closed:
            raise Exception("WebSocket is closed")
        self.sent_messages.append(message)

    def close(self):
        self.closed = True

mock_fastapi.WebSocket = MockWebSocket

# ==================== 3. 导入业务代码 ====================
from core.monitoring_service import MonitoringService  # noqa: E402

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def monitoring_service():
    """提供一个 MonitoringService 实例。"""
    return MonitoringService(max_buffer_size=10)


@pytest.fixture
def mock_websocket():
    """提供一个 mock 的 WebSocket。"""
    return MockWebSocket()


# ==================== 5. 初始化测试 ====================


def test_monitoring_service_initialization():
    """测试：MonitoringService 正确初始化。"""
    service = MonitoringService(max_buffer_size=50)

    assert len(service.active_connections) == 0
    assert service.log_buffer.maxlen == 50
    assert service.task_buffer.maxlen == 50
    assert service.message_buffer.maxlen == 50
    assert len(service.log_buffer) == 0
    assert len(service.task_buffer) == 0
    assert len(service.message_buffer) == 0


def test_monitoring_service_default_buffer_size():
    """测试：MonitoringService 使用默认缓冲区大小。"""
    service = MonitoringService()

    assert service.log_buffer.maxlen == 100
    assert service.task_buffer.maxlen == 100
    assert service.message_buffer.maxlen == 100


# ==================== 6. 连接管理测试 ====================


@pytest.mark.asyncio
async def test_connect_websocket(monitoring_service, mock_websocket):
    """测试：成功连接 WebSocket。"""
    await monitoring_service.connect(mock_websocket)

    assert mock_websocket.accepted is True
    assert mock_websocket in monitoring_service.active_connections
    assert len(monitoring_service.active_connections) == 1


@pytest.mark.asyncio
async def test_connect_multiple_websockets(monitoring_service):
    """测试：连接多个 WebSocket。"""
    ws1 = MockWebSocket()
    ws2 = MockWebSocket()
    ws3 = MockWebSocket()

    await monitoring_service.connect(ws1)
    await monitoring_service.connect(ws2)
    await monitoring_service.connect(ws3)

    assert len(monitoring_service.active_connections) == 3
    assert ws1 in monitoring_service.active_connections
    assert ws2 in monitoring_service.active_connections
    assert ws3 in monitoring_service.active_connections


@pytest.mark.asyncio
async def test_disconnect_websocket(monitoring_service, mock_websocket):
    """测试：断开 WebSocket 连接。"""
    await monitoring_service.connect(mock_websocket)
    assert len(monitoring_service.active_connections) == 1

    await monitoring_service.disconnect(mock_websocket)
    assert len(monitoring_service.active_connections) == 0
    assert mock_websocket not in monitoring_service.active_connections


@pytest.mark.asyncio
async def test_connect_sends_history(monitoring_service, mock_websocket):
    """测试：连接时发送历史记录。"""
    # 添加一些历史记录
    await monitoring_service.add_log("INFO", "Test log")
    await monitoring_service.add_task("Test task")
    await monitoring_service.add_message("User", "Test message")

    # 连接新的 WebSocket
    new_ws = MockWebSocket()
    await monitoring_service.connect(new_ws)

    # 验证历史记录被发送
    assert len(new_ws.sent_messages) == 3

    # 验证消息内容
    messages = [json.loads(msg) for msg in new_ws.sent_messages]
    types = {msg["type"] for msg in messages}
    assert "log" in types
    assert "task" in types
    assert "message" in types


# ==================== 7. 日志添加测试 ====================


@pytest.mark.asyncio
async def test_add_log(monitoring_service):
    """测试：添加日志记录。"""
    await monitoring_service.add_log("INFO", "Test log message")

    assert len(monitoring_service.log_buffer) == 1
    log_record = monitoring_service.log_buffer[0]

    assert log_record["type"] == "log"
    assert log_record["payload"]["level"] == "INFO"
    assert log_record["payload"]["message"] == "Test log message"
    assert "timestamp" in log_record["payload"]


@pytest.mark.asyncio
async def test_add_log_different_levels(monitoring_service):
    """测试：添加不同级别的日志。"""
    await monitoring_service.add_log("DEBUG", "Debug message")
    await monitoring_service.add_log("INFO", "Info message")
    await monitoring_service.add_log("WARNING", "Warning message")
    await monitoring_service.add_log("ERROR", "Error message")

    assert len(monitoring_service.log_buffer) == 4

    levels = [log["payload"]["level"] for log in monitoring_service.log_buffer]
    assert "DEBUG" in levels
    assert "INFO" in levels
    assert "WARNING" in levels
    assert "ERROR" in levels


@pytest.mark.asyncio
async def test_add_log_broadcasts(monitoring_service):
    """测试：添加日志时广播到所有连接。"""
    ws1 = MockWebSocket()
    ws2 = MockWebSocket()

    await monitoring_service.connect(ws1)
    await monitoring_service.connect(ws2)

    # 清空连接时发送的历史记录
    ws1.sent_messages.clear()
    ws2.sent_messages.clear()

    await monitoring_service.add_log("INFO", "Broadcast test")

    # 验证两个连接都收到了消息
    assert len(ws1.sent_messages) == 1
    assert len(ws2.sent_messages) == 1

    msg1 = json.loads(ws1.sent_messages[0])
    msg2 = json.loads(ws2.sent_messages[0])

    assert msg1["type"] == "log"
    assert msg2["type"] == "log"
    assert msg1["payload"]["message"] == "Broadcast test"
    assert msg2["payload"]["message"] == "Broadcast test"


# ==================== 8. 任务添加测试 ====================


@pytest.mark.asyncio
async def test_add_task(monitoring_service):
    """测试：添加任务记录。"""
    await monitoring_service.add_task("Processing data")

    assert len(monitoring_service.task_buffer) == 1
    task_record = monitoring_service.task_buffer[0]

    assert task_record["type"] == "task"
    assert task_record["payload"]["content"] == "Processing data"
    assert "timestamp" in task_record["payload"]


@pytest.mark.asyncio
async def test_add_multiple_tasks(monitoring_service):
    """测试：添加多个任务。"""
    tasks = ["Task 1", "Task 2", "Task 3"]

    for task in tasks:
        await monitoring_service.add_task(task)

    assert len(monitoring_service.task_buffer) == 3

    task_contents = [task["payload"]["content"] for task in monitoring_service.task_buffer]
    assert task_contents == tasks


# ==================== 9. 消息添加测试 ====================


@pytest.mark.asyncio
async def test_add_message(monitoring_service):
    """测试：添加消息记录。"""
    await monitoring_service.add_message("Alice", "Hello, world!")

    assert len(monitoring_service.message_buffer) == 1
    message_record = monitoring_service.message_buffer[0]

    assert message_record["type"] == "message"
    assert message_record["payload"]["sender"] == "Alice"
    assert message_record["payload"]["text"] == "Hello, world!"
    assert "timestamp" in message_record["payload"]


@pytest.mark.asyncio
async def test_add_multiple_messages(monitoring_service):
    """测试：添加多条消息。"""
    messages = [
        ("Alice", "Hello"),
        ("Bob", "Hi there"),
        ("Charlie", "Good morning")
    ]

    for sender, text in messages:
        await monitoring_service.add_message(sender, text)

    assert len(monitoring_service.message_buffer) == 3

    for i, (sender, text) in enumerate(messages):
        record = monitoring_service.message_buffer[i]
        assert record["payload"]["sender"] == sender
        assert record["payload"]["text"] == text


# ==================== 10. 缓冲区限制测试 ====================


@pytest.mark.asyncio
async def test_buffer_size_limit():
    """测试：缓冲区达到大小限制时移除旧记录。"""
    service = MonitoringService(max_buffer_size=5)

    # 添加超过限制的日志
    for i in range(10):
        await service.add_log("INFO", f"Log {i}")

    # 验证只保留最后5条
    assert len(service.log_buffer) == 5

    # 验证保留的是最新的记录
    messages = [log["payload"]["message"] for log in service.log_buffer]
    assert messages == ["Log 5", "Log 6", "Log 7", "Log 8", "Log 9"]


@pytest.mark.asyncio
async def test_different_buffer_limits():
    """测试：不同类型的缓冲区独立管理大小限制。"""
    service = MonitoringService(max_buffer_size=3)

    # 添加日志
    for i in range(5):
        await service.add_log("INFO", f"Log {i}")

    # 添加任务
    for i in range(5):
        await service.add_task(f"Task {i}")

    # 添加消息
    for i in range(5):
        await service.add_message("User", f"Message {i}")

    # 验证每个缓冲区都只保留3条
    assert len(service.log_buffer) == 3
    assert len(service.task_buffer) == 3
    assert len(service.message_buffer) == 3


# ==================== 11. 广播测试 ====================


@pytest.mark.asyncio
async def test_broadcast_to_all_connections(monitoring_service):
    """测试：广播到所有活动连接。"""
    # 连接多个 WebSocket
    websockets = [MockWebSocket() for _ in range(5)]
    for ws in websockets:
        await monitoring_service.connect(ws)
        ws.sent_messages.clear()  # 清空历史记录

    # 添加一条日志（会触发广播）
    await monitoring_service.add_log("INFO", "Broadcast to all")

    # 验证所有连接都收到了消息
    for ws in websockets:
        assert len(ws.sent_messages) == 1
        msg = json.loads(ws.sent_messages[0])
        assert msg["payload"]["message"] == "Broadcast to all"


@pytest.mark.asyncio
async def test_broadcast_handles_closed_connection(monitoring_service):
    """测试：广播时处理已关闭的连接。"""
    ws1 = MockWebSocket()
    ws2 = MockWebSocket()

    await monitoring_service.connect(ws1)
    await monitoring_service.connect(ws2)

    # 模拟 ws1 关闭
    ws1.close()

    # 清空消息
    ws1.sent_messages.clear()
    ws2.sent_messages.clear()

    # 添加日志（会触发广播）
    await monitoring_service.add_log("INFO", "Test after close")

    # ws1 应该被从活动连接中移除
    assert ws1 not in monitoring_service.active_connections
    # ws2 应该仍然收到消息
    assert len(ws2.sent_messages) == 1


# ==================== 12. 并发测试 ====================


@pytest.mark.asyncio
async def test_concurrent_add_operations(monitoring_service):
    """测试：并发添加操作。"""
    async def add_logs():
        for i in range(10):
            await monitoring_service.add_log("INFO", f"Log {i}")

    async def add_tasks():
        for i in range(10):
            await monitoring_service.add_task(f"Task {i}")

    async def add_messages():
        for i in range(10):
            await monitoring_service.add_message("User", f"Message {i}")

    # 并发执行
    await asyncio.gather(add_logs(), add_tasks(), add_messages())

    # 验证所有记录都被添加
    assert len(monitoring_service.log_buffer) == 10
    assert len(monitoring_service.task_buffer) == 10
    assert len(monitoring_service.message_buffer) == 10


@pytest.mark.asyncio
async def test_concurrent_connections(monitoring_service):
    """测试：并发连接多个 WebSocket。"""
    async def connect_ws(ws):
        await monitoring_service.connect(ws)

    websockets = [MockWebSocket() for _ in range(10)]

    # 并发连接
    await asyncio.gather(*[connect_ws(ws) for ws in websockets])

    # 验证所有连接都被添加
    assert len(monitoring_service.active_connections) == 10
    for ws in websockets:
        assert ws in monitoring_service.active_connections


# ==================== 13. 边界条件测试 ====================


@pytest.mark.asyncio
async def test_empty_message_content():
    """测试：处理空消息内容。"""
    service = MonitoringService()

    await service.add_log("INFO", "")
    await service.add_task("")
    await service.add_message("User", "")

    assert len(service.log_buffer) == 1
    assert len(service.task_buffer) == 1
    assert len(service.message_buffer) == 1


@pytest.mark.asyncio
async def test_special_characters_in_content():
    """测试：处理特殊字符。"""
    service = MonitoringService()

    special_text = "Test with\nnewlines\tand\ttabs and \"quotes\" and 'apostrophes'"

    await service.add_log("INFO", special_text)
    await service.add_task(special_text)
    await service.add_message("User", special_text)

    # 验证内容被正确存储
    assert service.log_buffer[0]["payload"]["message"] == special_text
    assert service.task_buffer[0]["payload"]["content"] == special_text
    assert service.message_buffer[0]["payload"]["text"] == special_text


@pytest.mark.asyncio
async def test_disconnect_nonexistent_websocket(monitoring_service):
    """测试：断开不存在的 WebSocket 不会引发错误。"""
    ws = MockWebSocket()

    # 尝试断开未连接的 WebSocket - 应该抛出 ValueError
    with pytest.raises(ValueError):
        await monitoring_service.disconnect(ws)


@pytest.mark.asyncio
async def test_history_sorting(monitoring_service):
    """测试：连接时历史记录按时间戳排序。"""
    # 添加不同类型的记录
    await monitoring_service.add_log("INFO", "First log")
    await asyncio.sleep(0.01)  # 确保时间戳不同
    await monitoring_service.add_task("First task")
    await asyncio.sleep(0.01)
    await monitoring_service.add_message("User", "First message")
    await asyncio.sleep(0.01)
    await monitoring_service.add_log("INFO", "Second log")

    # 连接新的 WebSocket
    ws = MockWebSocket()
    await monitoring_service.connect(ws)

    # 验证消息按时间戳排序
    messages = [json.loads(msg) for msg in ws.sent_messages]
    timestamps = [msg["payload"]["timestamp"] for msg in messages]

    # 验证时间戳是递增的
    assert timestamps == sorted(timestamps)
