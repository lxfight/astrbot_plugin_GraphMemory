"""消息缓冲管理模块"""

import asyncio
import sqlite3
import time
from collections.abc import Callable, Coroutine
from pathlib import Path
from typing import Any

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent

from ..models import BufferedMessage

# 刷新回调类型: (session_id, session_name, text, is_group, persona_id)
FlushCallback = Callable[[str, str, str, bool, str], Coroutine[Any, Any, None]]


class MemoryBuffer:
    """消息缓冲管理器

    使用 SQLite 持久化存储消息，支持:
    - 私聊/群聊分别配置缓冲区大小
    - 超时自动刷新
    - 人格切换检测
    """

    def __init__(
        self,
        data_path: Path,
        flush_callback: FlushCallback,
        max_size_private: int = 10,
        max_size_group: int = 20,
        max_wait_seconds: int = 180,
    ):
        self.data_path = data_path
        self.flush_callback = flush_callback
        self.max_size_private = max_size_private
        self.max_size_group = max_size_group
        self.max_wait_seconds = max_wait_seconds

        self._db_path = data_path / "buffer.db"
        self._stop_event = asyncio.Event()
        self._timer_task: asyncio.Task | None = None
        self._lock = asyncio.Lock()

        # 初始化数据库
        self._init_db()

    def _init_db(self):
        """初始化 SQLite 数据库"""
        with sqlite3.connect(self._db_path) as conn:
            # 消息表
            conn.execute("""
                CREATE TABLE IF NOT EXISTS buffer_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    sender_id TEXT NOT NULL,
                    sender_name TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp REAL NOT NULL,
                    role TEXT NOT NULL,
                    persona_id TEXT NOT NULL,
                    created_at REAL NOT NULL DEFAULT (strftime('%s', 'now'))
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_buffer_session
                ON buffer_messages(session_id)
            """)

            # 会话元数据表
            conn.execute("""
                CREATE TABLE IF NOT EXISTS buffer_sessions (
                    session_id TEXT PRIMARY KEY,
                    session_name TEXT,
                    is_group INTEGER NOT NULL DEFAULT 0,
                    current_persona_id TEXT,
                    last_activity_time REAL NOT NULL
                )
            """)

            conn.commit()
            logger.debug("[GraphMemory] 缓冲区数据库初始化完成")

    def _get_connection(self) -> sqlite3.Connection:
        """获取数据库连接"""
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        return conn

    async def startup(self):
        """启动后台任务"""
        if not self._timer_task:
            self._timer_task = asyncio.create_task(self._time_checker())
        logger.info("[GraphMemory] 缓冲区管理器已启动")

    async def shutdown(self):
        """停止后台任务"""
        self._stop_event.set()
        if self._timer_task:
            self._timer_task.cancel()
            try:
                await self._timer_task
            except asyncio.CancelledError:
                pass
        logger.info("[GraphMemory] 缓冲区管理器已停止")

    async def add_user_message(self, event: AstrMessageEvent, persona_id: str):
        """添加用户消息到缓冲区"""
        session_id = event.unified_msg_origin
        sender_id = event.get_sender_id() or "unknown"
        sender_name = event.get_sender_name() or "User"
        content = event.message_str
        is_group = event.get_group_id() is not None

        # 获取会话名称
        session_name = await self._get_session_name(event)

        message = BufferedMessage(
            sender_id=sender_id,
            sender_name=sender_name,
            content=content,
            timestamp=time.time(),
            role="user",
            persona_id=persona_id,
        )

        await self._add_message(session_id, session_name, message, is_group)

    async def add_bot_message(
        self,
        event: AstrMessageEvent,
        persona_id: str,
        content: str,
    ):
        """添加机器人消息到缓冲区"""
        session_id = event.unified_msg_origin
        is_group = event.get_group_id() is not None

        # 获取会话名称
        session_name = await self._get_session_name(event)

        message = BufferedMessage(
            sender_id="bot",
            sender_name="Assistant",
            content=content,
            timestamp=time.time(),
            role="assistant",
            persona_id=persona_id,
        )

        await self._add_message(session_id, session_name, message, is_group)

    async def _add_message(
        self,
        session_id: str,
        session_name: str,
        message: BufferedMessage,
        is_group: bool,
    ):
        """添加消息到数据库"""
        async with self._lock:
            with self._get_connection() as conn:
                # 检查人格切换
                session_info = conn.execute(
                    "SELECT current_persona_id FROM buffer_sessions WHERE session_id = ?",
                    (session_id,),
                ).fetchone()

                if session_info:
                    old_persona = session_info["current_persona_id"]
                    if old_persona and old_persona != message.persona_id:
                        logger.info(
                            f"[GraphMemory] 检测到人格切换: {old_persona} -> {message.persona_id}，"
                            f"正在刷新缓冲区..."
                        )
                        # 刷新旧人格的缓冲区
                        await self._flush_buffer(session_id, conn)

                # 插入消息
                conn.execute(
                    """
                    INSERT INTO buffer_messages
                    (session_id, sender_id, sender_name, content, timestamp, role, persona_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        session_id,
                        message.sender_id,
                        message.sender_name,
                        message.content,
                        message.timestamp,
                        message.role,
                        message.persona_id,
                    ),
                )

                # 更新会话元数据
                conn.execute(
                    """
                    INSERT INTO buffer_sessions (session_id, session_name, is_group, current_persona_id, last_activity_time)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(session_id) DO UPDATE SET
                        session_name = excluded.session_name,
                        current_persona_id = excluded.current_persona_id,
                        last_activity_time = excluded.last_activity_time
                    """,
                    (session_id, session_name, 1 if is_group else 0, message.persona_id, time.time()),
                )

                conn.commit()

                # 检查是否需要刷新
                count = conn.execute(
                    "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
                    (session_id,),
                ).fetchone()["cnt"]

                max_size = self.max_size_group if is_group else self.max_size_private
                if count >= max_size:
                    logger.debug(f"[GraphMemory] 会话 {session_id} 缓冲区已满 ({count}/{max_size})，触发刷新")
                    await self._flush_buffer(session_id, conn)

    async def _flush_buffer(self, session_id: str, conn: sqlite3.Connection):
        """刷新缓冲区"""
        # 获取会话信息
        session_info = conn.execute(
            "SELECT * FROM buffer_sessions WHERE session_id = ?",
            (session_id,),
        ).fetchone()

        if not session_info:
            return

        # 获取所有消息
        messages = conn.execute(
            """
            SELECT * FROM buffer_messages
            WHERE session_id = ?
            ORDER BY timestamp ASC
            """,
            (session_id,),
        ).fetchall()

        if not messages:
            return

        # 格式化为文本
        lines = []
        for msg in messages:
            role = msg["role"]
            sender_name = msg["sender_name"]
            sender_id = msg["sender_id"]
            content = msg["content"]
            lines.append(f"[{role}:{sender_name}:{sender_id}]: {content}")

        text_block = "\n".join(lines)
        session_name = session_info["session_name"]
        is_group = bool(session_info["is_group"])
        persona_id = session_info["current_persona_id"] or "default"

        logger.info(
            f"[GraphMemory] 刷新会话 {session_id} ({session_name}) 的缓冲区: "
            f"{len(messages)} 条消息 (人格: {persona_id})"
        )

        # 清空缓冲区
        conn.execute("DELETE FROM buffer_messages WHERE session_id = ?", (session_id,))
        conn.commit()

        # 调用回调
        try:
            await self.flush_callback(session_id, session_name, text_block, is_group, persona_id)
        except Exception as e:
            logger.error(f"[GraphMemory] 缓冲区刷新回调失败: {e}", exc_info=True)

    async def _time_checker(self):
        """定时检查超时的缓冲区"""
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(60)  # 每分钟检查一次

                async with self._lock:
                    with self._get_connection() as conn:
                        # 查找超时的会话
                        timeout_sessions = conn.execute(
                            """
                            SELECT session_id FROM buffer_sessions
                            WHERE last_activity_time < ?
                            AND session_id IN (SELECT DISTINCT session_id FROM buffer_messages)
                            """,
                            (time.time() - self.max_wait_seconds,),
                        ).fetchall()

                        for row in timeout_sessions:
                            session_id = row["session_id"]
                            logger.debug(f"[GraphMemory] 会话 {session_id} 缓冲区超时，触发刷新")
                            await self._flush_buffer(session_id, conn)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[GraphMemory] 定时检查失败: {e}", exc_info=True)

    async def _get_session_name(self, event: AstrMessageEvent) -> str:
        """获取会话名称"""
        if event.get_group_id():
            try:
                group = await event.get_group(event.get_group_id())
                if group and group.group_name:
                    return group.group_name
            except Exception as e:
                logger.warning(f"获取群组名称失败: {e}")

        sender_name = event.get_sender_name()
        if sender_name:
            return sender_name

        return event.unified_msg_origin

    def get_last_persona_id(self, session_id: str) -> str | None:
        """获取会话的最后人格ID"""
        with self._get_connection() as conn:
            row = conn.execute(
                "SELECT current_persona_id FROM buffer_sessions WHERE session_id = ?",
                (session_id,),
            ).fetchone()
            return row["current_persona_id"] if row else None
