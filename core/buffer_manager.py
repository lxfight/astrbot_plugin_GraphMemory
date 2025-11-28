import asyncio
import time
from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from typing import Any

from astrbot.api import logger
from astrbot.api.event import AstrMessageEvent
from astrbot.api.message_components import *  # noqa
from astrbot.core.message.message_event_result import MessageEventResult


@dataclass
class BufferMessage:
    """内部使用的标准化消息对象"""

    sender_id: str  # 用户ID 或 Bot ID
    sender_name: str  # 用户名 或 Bot名
    content: str  # 纯文本内容
    timestamp: float  # 时间戳
    role: str  # 角色: user 或 assistant
    persona_id: str  # 消息所属的人格ID
    is_group: bool = False

    def to_log_str(self) -> str:
        """转化为 LLM 易读的格式: [role:name:id]:content"""
        prefix = f"[{self.role}:{self.sender_name}:{self.sender_id}]"
        return f"{prefix}: {self.content}"


class SessionBuffer:
    def __init__(self, session_id: str, max_size: int = 10, max_seconds: int = 60):
        self.session_id = session_id
        self.max_size = max_size
        self.max_seconds = max_seconds
        
        self.is_group = False # 标记该会话是否为群聊
        self.current_persona_id: str | None = None # 记录当前Buffer所属的人格ID

        self._buffer: list[BufferMessage] = []
        self._last_flush_time = time.time()
        self._last_activity_time = time.time()

    def add(self, message: BufferMessage) -> bool:
        """
        添加消息，并返回是否应该立即触发提取 (Hit Size Limit)
        """
        # 如果是该Buffer的第一条消息，记录状态
        if not self._buffer:
            self.current_persona_id = message.persona_id
            self.is_group = message.is_group

        self._buffer.append(message)
        self._last_activity_time = time.time()

        # 检查是否达到条数限制
        if len(self._buffer) >= self.max_size:
            return True
        return False

    def should_flush_by_time(self) -> bool:
        """检查是否达到时间限制 (Hit Time Limit)"""
        if not self._buffer:
            return False
        # 如果距离上一条消息/上一次清理已经过了很久
        # 这里的逻辑是：如果当前有未处理消息，且距离上次活跃（或flush）超过了阈值
        return (time.time() - self._last_activity_time) >= self.max_seconds

    def flush(self) -> str:
        """
        清空当前缓冲区，并返回格式化后的对话文本
        """
        if not self._buffer:
            return ""

        # 将缓冲区内的消息连接成字符串
        lines = [msg.to_log_str() for msg in self._buffer]
        text_block = "\n".join(lines)

        # 重置
        self._buffer.clear()
        self._last_flush_time = time.time()

        return text_block

    @property
    def message_count(self) -> int:
        return len(self._buffer)


# 定义回调函数类型：当缓冲区flush时调用此函数处理文本
# (session_id, text_content, is_group, persona_id) -> None
# 使用 Coroutine 以满足 asyncio.create_task 的类型检查
FlushCallback = Callable[[str, str, bool, str], Coroutine[Any, Any, None]]


class BufferManager:
    def __init__(
        self,
        flush_callback: FlushCallback,
        max_size: int = 10,
        max_wait_seconds: int = 60,
    ):
        self.buffers: dict[str, SessionBuffer] = {}
        self.flush_callback = flush_callback
        self.max_size = max_size
        self.max_wait_seconds = max_wait_seconds
        self._stop_event = asyncio.Event()

        # 启动后台定时检查任务
        self._timer_task = asyncio.create_task(self._time_checker())

    def _get_session_key(self, event: AstrMessageEvent) -> str:
        """
        计算会话唯一Key。
        使用 unified_msg_origin，格式为 platform_name:message_type:session_id
        """
        return event.unified_msg_origin

    def _outline_chain(self, chain: list) -> str:
        """将消息链转换为带有占位符的字符串"""
        if not chain:
            return ""

        parts = []
        for i in chain:
            if isinstance(i, Plain):
                parts.append(i.text)
            elif isinstance(i, Image):
                parts.append("[图片]")
            elif isinstance(i, Face):
                parts.append(f"[表情:{i.id}]")
            elif isinstance(i, At):
                parts.append(f"[At:{i.qq}]")
            elif isinstance(i, AtAll):
                parts.append("[At:全体成员]")
            elif isinstance(i, Forward):
                parts.append("[转发消息]")
            elif isinstance(i, Reply):
                if i.message_str:
                    parts.append(f"[引用消息({i.sender_nickname}: {i.message_str})]")
                else:
                    parts.append("[引用消息]")
            else:
                parts.append(f"[{i.type}]")
            parts.append(" ")
        return "".join(parts).strip()

    async def add_user_message(self, event: AstrMessageEvent, persona_id: str):
        """处理用户接收的消息"""
        session_id = self._get_session_key(event)
        is_group = bool(event.get_group_id())

        # 使用 get_message_outline 获取包含占位符的消息内容
        content = event.get_message_outline()

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

    async def add_bot_message(self, event: AstrMessageEvent, persona_id: str):
        """处理 Bot 发出的消息 (通过 after_message_sent 钩子)"""
        session_id = self._get_session_key(event)

        # 获取 Bot 回复的内容
        result = event.get_result()
        if not result:
            return

        bot_content = ""
        if isinstance(result, MessageEventResult) and result.chain:
            bot_content = self._outline_chain(result.chain)
        elif isinstance(result, str):
            bot_content = result
        else:
            return

        if not bot_content:
            return

        # Bot 消息通常沿用会话属性，但为了严谨，我们认为 Bot 消息不改变群聊属性（因为它在同一个会话中）
        # persona_id 应该由上层传入
        msg = BufferMessage(
            sender_id=event.message_obj.self_id,  # Bot 自己的 ID
            sender_name="Bot",
            content=bot_content,
            timestamp=time.time(),
            role="assistant",
            persona_id=persona_id,
            is_group=bool(event.get_group_id())
        )
        await self._push_to_buffer(session_id, msg)

    async def _push_to_buffer(self, session_id: str, msg: BufferMessage):
        """内部方法：推入队列并检查是否溢出"""
        if session_id not in self.buffers:
            self.buffers[session_id] = SessionBuffer(
                session_id, self.max_size, self.max_wait_seconds
            )

        buffer = self.buffers[session_id]

        # 检查 Persona 是否发生变化 (Context Switch)
        # 如果 buffer 中已有消息，且新消息的 persona_id 与 buffer 的 current_persona_id 不一致
        if buffer.message_count > 0 and buffer.current_persona_id != msg.persona_id:
             logger.debug(
                f"[GraphMemory Buffer] Session {session_id} persona switch detected "
                f"({buffer.current_persona_id} -> {msg.persona_id}). Flushing previous buffer."
            )
             # 强制 Flush 旧的 buffer
             old_persona = buffer.current_persona_id
             is_group = buffer.is_group
             text = buffer.flush()
             if text and old_persona: # 类型检查
                 await self.flush_callback(session_id, text, is_group, old_persona)
        
        # 此时 buffer 为空（或者是新建的，或者是刚 flush 过的），add 会重置 current_persona_id
        should_flush = buffer.add(msg)

        if should_flush:
            logger.debug(
                f"[GraphMemory Buffer] Session {session_id} hit size limit ({self.max_size}). Flushing."
            )
            current_persona = buffer.current_persona_id
            is_group = buffer.is_group
            text = buffer.flush()
            if text and current_persona:
                await self.flush_callback(session_id, text, is_group, current_persona)

    async def _time_checker(self):
        """后台任务：每隔一段时间检查是否有超时的缓冲区"""
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(5)  # 每5秒轮询一次

                # 遍历所有缓冲区 (建立副本以防止迭代时修改)
                # 注意：Python字典在迭代时不能修改大小，但这里只是读取
                for session_id, buffer in list(self.buffers.items()):
                    if buffer.should_flush_by_time():
                        logger.debug(
                            f"[GraphMemory Buffer] Session {session_id} hit time limit. Flushing."
                        )
                        # 保存状态用于回调
                        persona_id = buffer.current_persona_id
                        is_group = buffer.is_group
                        
                        text = buffer.flush()
                        if text and persona_id:
                            # 异步调用 callback，避免阻塞检查循环
                            asyncio.create_task(self.flush_callback(session_id, text, is_group, persona_id))
            except Exception as e:
                logger.error(f"[GraphMemory Buffer] Timer loop error: {e}")

    async def shutdown(self):
        """关闭管理器，处理剩余消息"""
        self._stop_event.set()
        self._timer_task.cancel()

        # 可选：关闭时将所有残留消息强制 Flush
        for session_id, buffer in self.buffers.items():
            persona_id = buffer.current_persona_id
            is_group = buffer.is_group
            text = buffer.flush()
            if text and persona_id:
                await self.flush_callback(session_id, text, is_group, persona_id)
