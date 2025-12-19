"""缓冲区模块测试"""

from unittest.mock import MagicMock

import pytest


class MockAstrMessageEvent:
    """模拟 AstrMessageEvent"""

    def __init__(
        self,
        session_id: str,
        sender_id: str,
        sender_name: str,
        message_str: str,
        group_id: str | None = None,
        group_name: str | None = None,
    ):
        self.unified_msg_origin = session_id
        self.message_str = message_str
        self._sender_id = sender_id
        self._sender_name = sender_name
        self._group_id = group_id
        self._group_name = group_name

    def get_sender_id(self):
        return self._sender_id

    def get_sender_name(self):
        return self._sender_name

    def get_group_id(self):
        return self._group_id

    async def get_group(self, group_id: str):
        if self._group_id == group_id and self._group_name:
            mock_group = MagicMock()
            mock_group.group_name = self._group_name
            return mock_group
        return None


@pytest.mark.unit
@pytest.mark.asyncio
async def test_buffer_initialization(mock_buffer):
    """测试缓冲区初始化"""
    assert mock_buffer is not None
    assert mock_buffer._db_path.exists()


@pytest.mark.unit
@pytest.mark.asyncio
async def test_add_user_message(mock_buffer):
    """测试添加用户消息"""
    event = MockAstrMessageEvent(
        session_id="test_session",
        sender_id="user_123",
        sender_name="张三",
        message_str="你好",
    )

    await mock_buffer.add_user_message(event, persona_id="default")

    # 验证消息已添加
    persona_id = mock_buffer.get_last_persona_id("test_session")
    assert persona_id == "default"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_add_bot_message(mock_buffer):
    """测试添加机器人消息"""
    event = MockAstrMessageEvent(
        session_id="test_session",
        sender_id="user_123",
        sender_name="张三",
        message_str="你好",
    )

    await mock_buffer.add_bot_message(event, persona_id="default", content="你好！")

    # 验证消息已添加
    persona_id = mock_buffer.get_last_persona_id("test_session")
    assert persona_id == "default"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_buffer_flush_on_size(mock_buffer):
    """测试缓冲区大小触发刷新"""
    # 修改缓冲区大小为 3
    mock_buffer.max_size_private = 3

    event = MockAstrMessageEvent(
        session_id="test_session",
        sender_id="user_123",
        sender_name="张三",
        message_str="测试消息",
    )

    # 添加 3 条消息，应该触发刷新
    for i in range(3):
        await mock_buffer.add_user_message(event, persona_id="default")

    # 验证缓冲区已刷新（通过检查数据库中的消息数量）
    with mock_buffer._get_connection() as conn:
        count = conn.execute(
            "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
            ("test_session",),
        ).fetchone()["cnt"]
        # 刷新后应该为 0
        assert count == 0


@pytest.mark.unit
@pytest.mark.asyncio
async def test_persona_switch(mock_buffer):
    """测试人格切换触发刷新"""
    event = MockAstrMessageEvent(
        session_id="test_session",
        sender_id="user_123",
        sender_name="张三",
        message_str="你好",
    )

    # 添加第一条消息（人格 A）
    await mock_buffer.add_user_message(event, persona_id="persona_a")

    # 验证人格 A
    persona_id = mock_buffer.get_last_persona_id("test_session")
    assert persona_id == "persona_a"

    # 添加第二条消息（人格 B），应该触发刷新
    await mock_buffer.add_user_message(event, persona_id="persona_b")

    # 验证人格已切换
    persona_id = mock_buffer.get_last_persona_id("test_session")
    assert persona_id == "persona_b"

    # 验证缓冲区已刷新
    with mock_buffer._get_connection() as conn:
        count = conn.execute(
            "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
            ("test_session",),
        ).fetchone()["cnt"]
        # 刷新后只有新人格的消息
        assert count == 1


@pytest.mark.unit
@pytest.mark.asyncio
async def test_multiple_sessions(mock_buffer):
    """测试多会话隔离"""
    event1 = MockAstrMessageEvent(
        session_id="session_1",
        sender_id="user_1",
        sender_name="张三",
        message_str="消息1",
    )

    event2 = MockAstrMessageEvent(
        session_id="session_2",
        sender_id="user_2",
        sender_name="李四",
        message_str="消息2",
    )

    await mock_buffer.add_user_message(event1, persona_id="default")
    await mock_buffer.add_user_message(event2, persona_id="default")

    # 验证两个会话的人格ID都正确
    persona1 = mock_buffer.get_last_persona_id("session_1")
    persona2 = mock_buffer.get_last_persona_id("session_2")

    assert persona1 == "default"
    assert persona2 == "default"

    # 验证消息隔离
    with mock_buffer._get_connection() as conn:
        count1 = conn.execute(
            "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
            ("session_1",),
        ).fetchone()["cnt"]
        count2 = conn.execute(
            "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
            ("session_2",),
        ).fetchone()["cnt"]

        assert count1 == 1
        assert count2 == 1
