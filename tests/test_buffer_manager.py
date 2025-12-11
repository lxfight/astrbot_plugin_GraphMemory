import asyncio
import time
from unittest import mock
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from core.buffer_manager import BufferManager, BufferMessage, SessionBuffer

# --- Fixtures ---

@pytest.fixture
def buffer_message():
    return BufferMessage("user123", "TestUser", "Hello", time.time(), "user", "p1", False)

@pytest.fixture
def session_buffer():
    return SessionBuffer(session_id="s1", max_size=3, max_seconds=5)

@pytest.fixture
def flush_callback():
    return AsyncMock()

@pytest.fixture
async def buffer_manager(flush_callback):
    manager = BufferManager(flush_callback, max_size=3, max_wait_seconds=2)
    await manager.startup()
    yield manager
    await manager.shutdown()

@pytest.fixture
def mock_event():
    event = MagicMock()
    event.unified_msg_origin = "platform:private:session1"
    event.get_sender_id.return_value = "user1"
    event.get_sender_name.return_value = "MockUser"
    event.get_message_outline.return_value = "Test content"
    event.get_group_id.return_value = None
    event.message_obj.self_id = "bot1"
    event.get_result.return_value = None
    return event

# --- BufferMessage Tests ---

def test_buffer_message_to_log_str(buffer_message):
    log_str = buffer_message.to_log_str()
    assert "[user:TestUser:user123]: Hello" == log_str

# --- SessionBuffer Tests ---

def test_session_buffer_add_and_full(session_buffer):
    assert session_buffer.add(BufferMessage("u1", "U1", "m1", time.time(), "user", "p1")) is False
    assert session_buffer.add(BufferMessage("u2", "U2", "m2", time.time(), "user", "p1")) is False
    assert session_buffer.message_count == 2
    assert session_buffer.current_persona_id == "p1"
    assert session_buffer.is_group is False
    assert session_buffer.add(BufferMessage("u3", "U3", "m3", time.time(), "user", "p1")) is True
    assert session_buffer.message_count == 3

def test_session_buffer_should_flush_by_time(session_buffer, buffer_message):
    assert session_buffer.should_flush_by_time() is False
    session_buffer.add(buffer_message)
    assert session_buffer.should_flush_by_time() is False
    session_buffer._last_activity_time = time.time() - 10
    assert session_buffer.should_flush_by_time() is True

@pytest.mark.asyncio
async def test_session_buffer_flush(session_buffer, buffer_message):
    session_buffer.add(buffer_message)
    text = session_buffer.flush()
    assert "Hello" in text
    assert session_buffer.message_count == 0

@pytest.mark.asyncio
async def test_session_buffer_flush_empty(session_buffer):
    assert session_buffer.flush() == ""

# --- BufferManager Tests ---

@pytest.mark.asyncio
async def test_add_user_message(buffer_manager, mock_event, flush_callback):
    await buffer_manager.add_user_message(mock_event, "p1")
    assert "platform:private:session1" in buffer_manager.buffers
    assert buffer_manager.buffers["platform:private:session1"].message_count == 1
    flush_callback.assert_not_called()

@pytest.mark.asyncio
async def test_add_bot_message_from_content(buffer_manager, mock_event, flush_callback):
    await buffer_manager.add_bot_message(mock_event, "p1", content="Bot reply")
    buffer = buffer_manager.buffers["platform:private:session1"]
    assert buffer.message_count == 1
    assert buffer._buffer[0].content == "Bot reply"
    flush_callback.assert_not_called()

@pytest.mark.asyncio
async def test_add_bot_message_from_str_result(buffer_manager, mock_event):
    mock_event.get_result.return_value = "Bot reply from str"
    await buffer_manager.add_bot_message(mock_event, "p1")
    buffer = buffer_manager.buffers["platform:private:session1"]
    assert buffer._buffer[0].content == "Bot reply from str"

@pytest.mark.asyncio
async def test_add_bot_message_from_chain_result(buffer_manager, mock_event):
    from astrbot.core.message.message_event_result import MessageEventResult

    result = MagicMock(spec=MessageEventResult)

    # 修复：手动创建完全可控的 mock 对象
    plain_instance = MagicMock()
    plain_instance.type = "Plain"
    plain_instance.text = "Bot reply from chain"

    result.chain = [plain_instance]
    mock_event.get_result.return_value = result

    await buffer_manager.add_bot_message(mock_event, "p1")

    assert "platform:private:session1" in buffer_manager.buffers, f"Buffers: {buffer_manager.buffers}"
    buffer = buffer_manager.buffers["platform:private:session1"]
    assert buffer.message_count == 1
    assert buffer._buffer[0].content == "Bot reply from chain"

@pytest.mark.asyncio
async def test_add_bot_message_empty(buffer_manager, mock_event):
    await buffer_manager.add_bot_message(mock_event, "p1", content="")
    await buffer_manager.add_bot_message(mock_event, "p1", content=None)
    assert "platform:private:session1" not in buffer_manager.buffers

@pytest.mark.asyncio
async def test_flush_on_size_limit(buffer_manager, mock_event, flush_callback):
    for _ in range(3):
        await buffer_manager.add_user_message(mock_event, "p1")
    flush_callback.assert_called_once_with("platform:private:session1", mock.ANY, False, "p1")

@pytest.mark.asyncio
async def test_flush_on_persona_switch(buffer_manager, mock_event, flush_callback):
    await buffer_manager.add_user_message(mock_event, "p1")
    flush_callback.assert_not_called()
    await buffer_manager.add_user_message(mock_event, "p2")
    flush_callback.assert_called_once_with("platform:private:session1", mock.ANY, False, "p1")
    assert buffer_manager.buffers["platform:private:session1"].current_persona_id == "p2"

@pytest.mark.asyncio
async def test_no_flush_if_persona_id_is_none(buffer_manager, mock_event, flush_callback):
    """测试在人格ID为空时，即使满足刷新条件也不刷新。"""
    buffer = buffer_manager.buffers.setdefault("s1", SessionBuffer("s1", 3, 5))
    buffer.add(BufferMessage("u1", "U1", "m1", time.time(), "user", "p1"))
    buffer.current_persona_id = None
    mock_event.unified_msg_origin = "s1"
    await buffer_manager.add_user_message(mock_event, "p2")
    flush_callback.assert_not_called()

@pytest.mark.asyncio
async def test_time_based_flush(flush_callback):
    manager = BufferManager(flush_callback, max_size=10, max_wait_seconds=1)
    await manager.startup()
    event = MagicMock()
    event.unified_msg_origin = "test:private:timeout"
    event.get_sender_id.return_value = "user1"
    event.get_sender_name.return_value = "User1"
    event.get_message_outline.return_value = "Timeout test"
    event.get_group_id.return_value = None

    await manager.add_user_message(event, "p1")
    flush_callback.assert_not_called()
    await asyncio.sleep(1.5)
    await asyncio.sleep(4)
    flush_callback.assert_called_once()
    await manager.shutdown()

@pytest.mark.asyncio
async def test_shutdown_flushes_remaining(buffer_manager, mock_event, flush_callback):
    await buffer_manager.add_user_message(mock_event, "p1")
    await buffer_manager.add_user_message(mock_event, "p1")
    flush_callback.assert_not_called()
    await buffer_manager.shutdown()
    flush_callback.assert_called_once()

@pytest.mark.asyncio
async def test_group_message_handling(buffer_manager, mock_event, flush_callback):
    mock_event.get_group_id.return_value = "group1"
    for _ in range(3):
        await buffer_manager.add_user_message(mock_event, "p1")
    flush_callback.assert_called_once_with(mock.ANY, mock.ANY, True, "p1")

@pytest.mark.asyncio
async def test_outline_chain(buffer_manager):
    # 修复：手动创建完全可控的 mock 对象列表
    chain = [
        MagicMock(type="Plain", text="Hello"),
        MagicMock(type="Image"),
        MagicMock(type="Face", id=123),
        MagicMock(type="At", qq="456"),
        MagicMock(type="AtAll"),
        MagicMock(type="Forward"),
        MagicMock(type="Reply", message_str="Hi", sender_nickname="UserA"),
        MagicMock(type="Unknown")
    ]

    outline = buffer_manager._outline_chain(chain)

    expected_parts = [
        "Hello",
        "[图片]",
        "[表情:123]",
        "[At:456]",
        "[At:全体成员]",
        "[转发消息]",
        "[引用消息(UserA: Hi)]",
        "[Unknown]"
    ]

    for part in expected_parts:
        assert part in outline

@pytest.mark.asyncio
async def test_time_checker_exception(buffer_manager):
    """测试 _time_checker 循环中的异常被捕获并且不会中断循环。"""
    await buffer_manager.shutdown()

    mock_buffer = MagicMock()
    mock_buffer.should_flush_by_time.side_effect = ValueError("Test Error")

    with patch.object(buffer_manager, "buffers", new={"s1": mock_buffer}):
        try:
            await buffer_manager._time_checker()
        except Exception as e:
            pytest.fail(f"_time_checker 抛出了未捕获的异常: {e}")

# --- Diagnostic Tests ---

@pytest.fixture
async def simple_async_fixture():
    """一个简单的异步 fixture 用于诊断。"""
    await asyncio.sleep(0.01)
    yield "hello"

@pytest.mark.asyncio
async def test_simple_async(simple_async_fixture):
    """测试一个简单的异步 fixture 是否能正常工作。"""
    assert simple_async_fixture == "hello"
