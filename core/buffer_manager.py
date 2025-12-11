import asyncio
import sqlite3
import time
from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent

from .monitoring_service import monitoring_service


@dataclass
class BufferMessage:
    """
    一个标准化的内部消息对象，用于在缓冲区中统一表示用户和机器人的消息。
    这简化了后续处理，使其不依赖于原始的事件格式。
    """

    sender_id: str      # 发送者ID (用户ID 或 Bot ID)
    sender_name: str    # 发送者名称 (用户名 或 Bot名)
    content: str        # 消息的纯文本内容
    timestamp: float    # 消息的时间戳
    role: str           # 角色: 'user' 或 'assistant'
    persona_id: str     # 消息所属的人格ID
    is_group: bool = False  # 是否为群聊消息

    def to_log_str(self) -> str:
        """
        将消息转换为 LLM 易于解析的日志格式。
        格式: [role:sender_name:sender_id]: content
        """
        prefix = f"[{self.role}:{self.sender_name}:{self.sender_id}]"
        return f"{prefix}: {self.content}"


# 定义回调函数类型：当缓冲区flush时，调用此异步函数处理文本块。
# 参数: (session_id, text_content, is_group, persona_id)
FlushCallback = Callable[[str, str, bool, str], Coroutine[Any, Any, None]]


class BufferManager:
    """
    管理所有会话的消息缓冲区，使用 SQLite 持久化存储。
    支持私聊和群聊分开配置消息数量限制。
    """

    def __init__(
        self,
        flush_callback: FlushCallback,
        data_path: Path,
        max_size_private: int = 10,
        max_size_group: int = 20,
        max_wait_seconds: int = 60,
    ):
        self.flush_callback = flush_callback
        self.data_path = data_path
        self.max_size_private = max_size_private
        self.max_size_group = max_size_group
        self.max_wait_seconds = max_wait_seconds

        self._stop_event = asyncio.Event()
        self._timer_task = None
        self._lock = asyncio.Lock()

        # 初始化数据库
        self._db_path = data_path / "buffer.db"
        self._init_db()

    def _init_db(self):
        """初始化 SQLite 数据库表结构。"""
        with sqlite3.connect(self._db_path) as conn:
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
                    is_group INTEGER NOT NULL DEFAULT 0,
                    created_at REAL NOT NULL DEFAULT (strftime('%s', 'now'))
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_buffer_session
                ON buffer_messages(session_id)
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS buffer_sessions (
                    session_id TEXT PRIMARY KEY,
                    is_group INTEGER NOT NULL DEFAULT 0,
                    current_persona_id TEXT,
                    last_activity_time REAL NOT NULL
                )
            """)
            conn.commit()

    def _get_connection(self) -> sqlite3.Connection:
        """获取数据库连接。"""
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        return conn

    async def startup(self):
        """启动后台任务。"""
        if not self._timer_task:
            self._timer_task = asyncio.create_task(self._time_checker())
        logger.info("[GraphMemory Buffer] 缓冲区管理器已启动 (SQLite 持久化)")

    def _get_session_key(self, event: AstrMessageEvent) -> str:
        """根据事件计算会话的唯一标识符。"""
        return event.unified_msg_origin

    def _outline_chain(self, chain: list) -> str:
        """将复杂的消息链转换为带有占位符的纯文本字符串。"""
        if not chain:
            return ""

        parts = []
        for i in chain:
            comp_type = getattr(i, "type", "Unknown")

            if comp_type == "Plain":
                parts.append(getattr(i, "text", str(i)))
            elif comp_type == "Image":
                parts.append("[图片]")
            elif comp_type == "Face":
                parts.append(f"[表情:{getattr(i, 'id', '')}]")
            elif comp_type == "At":
                parts.append(f"[At:{getattr(i, 'qq', '')}]")
            elif comp_type == "AtAll":
                parts.append("[At:全体成员]")
            elif comp_type == "Forward":
                parts.append("[转发消息]")
            elif comp_type == "Reply":
                message_str = getattr(i, "message_str", "")
                sender_nickname = getattr(i, "sender_nickname", "")
                if message_str:
                    parts.append(f"[引用消息({sender_nickname}: {message_str})]")
                else:
                    parts.append("[引用消息]")
            else:
                parts.append(f"[{comp_type}]")
            parts.append(" ")
        return "".join(parts).strip()

    def _get_max_size(self, is_group: bool) -> int:
        """根据会话类型返回对应的最大消息数限制。"""
        return self.max_size_group if is_group else self.max_size_private

    def _get_session_info(self, conn: sqlite3.Connection, session_id: str) -> dict | None:
        """获取会话信息。"""
        row = conn.execute(
            "SELECT * FROM buffer_sessions WHERE session_id = ?",
            (session_id,)
        ).fetchone()
        if row:
            return dict(row)
        return None

    def _get_message_count(self, conn: sqlite3.Connection, session_id: str) -> int:
        """获取会话中的消息数量。"""
        row = conn.execute(
            "SELECT COUNT(*) as cnt FROM buffer_messages WHERE session_id = ?",
            (session_id,)
        ).fetchone()
        return row["cnt"] if row else 0

    def _add_message_to_db(self, conn: sqlite3.Connection, session_id: str, msg: BufferMessage):
        """将消息添加到数据库。"""
        conn.execute("""
            INSERT INTO buffer_messages
            (session_id, sender_id, sender_name, content, timestamp, role, persona_id, is_group)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            msg.sender_id,
            msg.sender_name,
            msg.content,
            msg.timestamp,
            msg.role,
            msg.persona_id,
            1 if msg.is_group else 0
        ))

    def _update_session_info(self, conn: sqlite3.Connection, session_id: str, is_group: bool, persona_id: str):
        """更新或创建会话信息。"""
        conn.execute("""
            INSERT INTO buffer_sessions (session_id, is_group, current_persona_id, last_activity_time)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(session_id) DO UPDATE SET
                is_group = excluded.is_group,
                current_persona_id = excluded.current_persona_id,
                last_activity_time = excluded.last_activity_time
        """, (session_id, 1 if is_group else 0, persona_id, time.time()))

    def _flush_session(self, conn: sqlite3.Connection, session_id: str) -> tuple[str, bool, str] | None:
        """
        刷新会话缓冲区，返回 (文本块, is_group, persona_id) 或 None。
        """
        session_info = self._get_session_info(conn, session_id)
        if not session_info:
            return None

        rows = conn.execute("""
            SELECT * FROM buffer_messages
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,)).fetchall()

        if not rows:
            return None

        lines = []
        for row in rows:
            prefix = f"[{row['role']}:{row['sender_name']}:{row['sender_id']}]"
            lines.append(f"{prefix}: {row['content']}")

        text_block = "\n".join(lines)
        is_group = bool(session_info["is_group"])
        persona_id = session_info["current_persona_id"] or "default"

        log_message = f"[GraphMemory Buffer] 正在刷新会话 {session_id} 的 {len(lines)} 条消息 (人格: {persona_id})"
        logger.debug(log_message)
        asyncio.create_task(monitoring_service.add_task(f"刷新会话 {session_id} 的缓冲区"))

        # 删除已刷新的消息
        conn.execute("DELETE FROM buffer_messages WHERE session_id = ?", (session_id,))
        conn.execute("DELETE FROM buffer_sessions WHERE session_id = ?", (session_id,))
        conn.commit()

        return text_block, is_group, persona_id

    async def add_user_message(self, event: AstrMessageEvent, persona_id: str):
        """处理来自用户的消息，并将其添加到相应的缓冲区。"""
        session_id = self._get_session_key(event)
        is_group = bool(event.get_group_id())
        content = event.get_message_outline()

        logger.debug(f"[GraphMemory DEBUG] 向缓冲区添加用户消息: {content[:50]}... (会话: {session_id}, 人格: {persona_id})")

        msg = BufferMessage(
            sender_id=event.get_sender_id(),
            sender_name=event.get_sender_name(),
            content=content,
            timestamp=time.time(),
            role="user",
            persona_id=persona_id,
            is_group=is_group
        )
        await self._push_to_buffer(session_id, msg)

    async def add_bot_message(self, event: AstrMessageEvent, persona_id: str, content: str | None = None):
        """处理来自机器人的消息，并将其添加到相应的缓冲区。"""
        session_id = self._get_session_key(event)

        bot_content = ""
        if content:
            bot_content = content
        else:
            result = event.get_result()
            if not result:
                return

            if hasattr(result, "chain") and result.chain:
                bot_content = self._outline_chain(result.chain)
            elif isinstance(result, str):
                bot_content = result
            else:
                return

        if not bot_content:
            return

        logger.debug(f"[GraphMemory DEBUG] 向缓冲区添加机器人消息: {bot_content[:50]}... (会话: {session_id}, 人格: {persona_id})")

        msg = BufferMessage(
            sender_id=event.message_obj.self_id,
            sender_name="Bot",
            content=bot_content,
            timestamp=time.time(),
            role="assistant",
            persona_id=persona_id,
            is_group=bool(event.get_group_id())
        )
        await self._push_to_buffer(session_id, msg)

    async def _push_to_buffer(self, session_id: str, msg: BufferMessage):
        """内部方法：将消息推入缓冲区，并处理上下文切换和缓冲区溢出。"""
        async with self._lock:
            with self._get_connection() as conn:
                session_info = self._get_session_info(conn, session_id)
                current_count = self._get_message_count(conn, session_id)

                # 检查人格是否发生变化 (上下文切换)
                if session_info and current_count > 0:
                    old_persona = session_info.get("current_persona_id")
                    if old_persona and old_persona != msg.persona_id:
                        logger.debug(
                            f"[GraphMemory Buffer] 会话 {session_id} 检测到人格切换 "
                            f"({old_persona} -> {msg.persona_id})。正在刷新旧的缓冲区。"
                        )
                        result = self._flush_session(conn, session_id)
                        if result:
                            text, is_group, persona = result
                            # 在同步锁中，使用 create_task 避免阻塞
                            asyncio.create_task(self.flush_callback(session_id, text, is_group, persona))
                        current_count = 0

                # 检查是否达到大小限制 (在添加新消息之前)
                max_size = self._get_max_size(msg.is_group)
                if current_count >= max_size:
                    logger.debug(
                        f"[GraphMemory Buffer] 会话 {session_id} 达到大小限制 ({max_size})。正在刷新。"
                    )
                    result = self._flush_session(conn, session_id)
                    if result:
                        text, is_group, persona = result
                        # 在同步锁中，使用 create_task 避免阻塞
                        asyncio.create_task(self.flush_callback(session_id, text, is_group, persona))
                    # 重置计数器
                    current_count = 0

                # 添加新消息到数据库
                self._add_message_to_db(conn, session_id, msg)
                self._update_session_info(conn, session_id, msg.is_group, msg.persona_id)
                conn.commit()

    async def _time_checker(self):
        """后台任务：每隔一段时间检查是否有因超时而需要刷新的缓冲区。"""
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(5)

                async with self._lock:
                    with self._get_connection() as conn:
                        now = time.time()
                        threshold = now - self.max_wait_seconds

                        # 查找超时的会话
                        rows = conn.execute("""
                            SELECT session_id FROM buffer_sessions
                            WHERE last_activity_time < ?
                        """, (threshold,)).fetchall()

                        for row in rows:
                            session_id = row["session_id"]
                            # 检查是否有消息
                            if self._get_message_count(conn, session_id) > 0:
                                logger.debug(
                                    f"[GraphMemory Buffer] 会话 {session_id} 达到时间限制。正在刷新。"
                                )
                                result = self._flush_session(conn, session_id)
                                if result:
                                    text, is_group, persona = result
                                    asyncio.create_task(
                                        self.flush_callback(session_id, text, is_group, persona)
                                    )
            except Exception as e:
                logger.error(f"[GraphMemory Buffer] 定时检查循环出错: {e}")

    async def shutdown(self):
        """关闭管理器，确保所有剩余的消息都被处理。"""
        self._stop_event.set()
        if self._timer_task:
            self._timer_task.cancel()

        logger.info("[GraphMemory Buffer] 正在关闭并刷新所有剩余的缓冲区...")

        async with self._lock:
            with self._get_connection() as conn:
                rows = conn.execute("SELECT session_id FROM buffer_sessions").fetchall()

                for row in rows:
                    session_id = row["session_id"]
                    result = self._flush_session(conn, session_id)
                    if result:
                        text, is_group, persona = result
                        await self.flush_callback(session_id, text, is_group, persona)
