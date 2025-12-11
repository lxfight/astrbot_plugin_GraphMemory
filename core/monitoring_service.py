import asyncio
import json
from collections import deque
from datetime import datetime, timezone

from fastapi import WebSocket


class MonitoringService:
    """
    管理 WebSocket 连接和广播监控数据（日志、任务、消息）。
    包含用于存储历史记录的固定大小的缓冲区。
    """

    def __init__(self, max_buffer_size: int = 100):
        """
        初始化监控服务。

        Args:
            max_buffer_size (int): 每种数据类型的最大历史记录条数。
        """
        self.active_connections: list[WebSocket] = []
        self.log_buffer: deque[dict] = deque(maxlen=max_buffer_size)
        self.task_buffer: deque[dict] = deque(maxlen=max_buffer_size)
        self.message_buffer: deque[dict] = deque(maxlen=max_buffer_size)
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        """
        接受一个新的 WebSocket 连接，并发送历史记录。
        """
        await websocket.accept()
        async with self.lock:
            self.active_connections.append(websocket)

        # 发送历史记录
        history = list(self.log_buffer) + list(self.task_buffer) + list(self.message_buffer)
        # 按时间戳排序
        history.sort(key=lambda x: x["payload"]["timestamp"])

        for record in history:
            await websocket.send_text(json.dumps(record))

    async def disconnect(self, websocket: WebSocket):
        """
        断开一个 WebSocket 连接。
        """
        async with self.lock:
            try:
                self.active_connections.remove(websocket)
            except ValueError:
                pass  # 连接可能已被其他协程移除

    async def _broadcast(self, data: dict):
        """
        将数据广播到所有活动的 WebSocket 连接。
        """
        message = json.dumps(data)
        # 使用列表副本以避免在迭代时修改列表
        connections = self.active_connections[:]
        for connection in connections:
            try:
                await connection.send_text(message)
            except Exception:
                # 连接可能已关闭，从活动列表中移除
                # 使用 try-except 块以避免因单个连接失败而中断广播
                try:
                    self.active_connections.remove(connection)
                except ValueError:
                    pass  # 可能已被其他协程移除

    async def _add_and_broadcast(self, buffer: deque[dict], record: dict):
        """
        将记录添加到指定的缓冲区并广播。
        """
        buffer.append(record)
        await self._broadcast(record)

    async def add_log(self, level: str, message: str):
        """
        添加一条日志记录。
        """
        record = {
            "type": "log",
            "payload": {
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
                "level": level,
                "message": message,
            },
        }
        await self._add_and_broadcast(self.log_buffer, record)

    async def add_task(self, task_description: str):
        """
        添加一个任务状态更新。
        """
        record = {
            "type": "task",
            "payload": {
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
                "content": task_description,
            },
        }
        await self._add_and_broadcast(self.task_buffer, record)

    async def add_message(self, sender: str, text: str):
        """
        添加一条消息记录。
        """
        record = {
            "type": "message",
            "payload": {
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
                "sender": sender,
                "text": text,
            },
        }
        await self._add_and_broadcast(self.message_buffer, record)


# 创建一个单例，以便在整个插件中共享
monitoring_service = MonitoringService()
