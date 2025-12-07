# data/plugins/astrbot_plugin_GraphMemory/core/web_server.py

"""
该模块定义了 `WebServer` 类，它使用 FastAPI 和 Uvicorn 启动一个轻量级的 Web 服务器，
为图记忆插件提供一个可视化的 Web 界面（WebUI）。
"""

import asyncio
import os
import platform
import secrets
import string
import threading

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Request,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel

from astrbot.api import logger

from .graph_engine import GraphEngine
from .graph_service import GraphService
from .monitoring_service import monitoring_service


# --- Pydantic Models for Request Bodies ---
class CreateEdgePayload(BaseModel):
    from_id: str
    to_id: str
    rel_type: str
    from_type: str
    to_type: str


class WebServer:
    """
    管理插件的 Web 服务器，提供用于图可视化的 API 和前端资源。
    """
    def __init__(self, engine: GraphEngine, config: dict):
        """
        初始化 WebServer。

        Args:
            engine (GraphEngine): GraphEngine 的实例，用于数据交互。
            config (dict): 插件的配置字典。
        """
        self.config = config
        self.host = config.get("webui_host", "0.0.0.0")
        self.port = config.get("webui_port", 8081)
        self.configured_key = config.get("webui_key", "")

        self.service = GraphService(engine)

        # 如果未在配置中提供密钥，则生成一个随机密钥用于认证
        self.auth_key = self.configured_key or self._generate_key()
        if not self.configured_key:
            logger.warning(f"\n{'='*40}\n[GraphMemory] WebUI 访问密钥: {self.auth_key}\n{'='*40}")

        self.sessions = set()  # 用于存储有效的会话令牌

        # 初始化 FastAPI 应用
        self.app = FastAPI(title="GraphMemory WebUI", version="2.0.0")
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # 允许所有来源的跨域请求
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self._setup_routes()

        self.server_thread = None
        self.stop_event = threading.Event()

    def _generate_key(self, length=16) -> str:
        """生成一个指定长度的随机字母数字密钥。"""
        chars = string.ascii_letters + string.digits
        return "".join(secrets.choice(chars) for _ in range(length))

    def _check_auth(self, request: Request):
        """
        一个 FastAPI 依赖项，用于检查请求是否已通过身份验证。
        它会检查请求头中的 `Authorization` Bearer 令牌或 cookie 中的会话令牌。
        """
        auth_header = request.headers.get("Authorization")
        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = request.cookies.get("session_token")

        if token and token in self.sessions:
            return True

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="未经授权")

    def _setup_routes(self):
        """设置 FastAPI 应用的所有路由。"""
        current_dir = os.path.dirname(os.path.abspath(__file__))
        resources_dir = os.path.join(current_dir, "../resources")

        # --- 静态文件路由 ---
        @self.app.get("/", response_class=HTMLResponse)
        async def index():
            """提供 WebUI 的主页 `index.html`。"""
            index_path = os.path.join(resources_dir, "index.html")
            return FileResponse(index_path) if os.path.exists(index_path) else HTMLResponse("<h1>WebUI 未找到。</h1>", 404)

        @self.app.get("/app.js")
        async def serve_app_js():
            """提供 WebUI 的 JavaScript 文件 `app.js`。"""
            app_js_path = os.path.join(resources_dir, "app.js")
            return FileResponse(app_js_path, media_type="application/javascript") if os.path.exists(app_js_path) else HTMLResponse("app.js not found", 404)

        @self.app.get("/favicon.ico", status_code=204)
        async def favicon():
            """为浏览器图标请求返回一个空响应。"""
            return HTMLResponse(content="")

        # --- 认证 API ---
        @self.app.post("/api/login")
        async def login(data: dict):
            """处理登录请求，验证密钥并创建会话。"""
            if data.get("key") == self.auth_key:
                token = secrets.token_hex(16)
                self.sessions.add(token)
                response = JSONResponse(content={"status": "success", "token": token})
                response.set_cookie(key="session_token", value=token, httponly=True)
                return response
            raise HTTPException(status_code=401, detail="无效的密钥")

        # --- 图数据 API (受保护) ---

        @self.app.get("/api/contexts")
        async def get_contexts(_: bool = Depends(self._check_auth)):
            """API: 获取所有可用的会话上下文列表。"""
            return await self.service.get_contexts()

        @self.app.get("/api/graph")
        async def get_graph_data(session_id: str | None = None, _: bool = Depends(self._check_auth)):
            """API: 获取图数据。如果提供了 session_id，则为该会话的子图；否则为全局图谱。"""
            return await self.service.get_graph_data(session_id)

        @self.app.get("/api/debug_search")
        async def debug_search(q: str, session_id: str, _: bool = Depends(self._check_auth)):
            """API: 执行调试搜索并返回相关的子图数据。"""
            try:
                vector_top_k = self.config.get("recall_vector_top_k", 5)
                keyword_top_k = self.config.get("recall_keyword_top_k", 3)

                result = await self.service.debug_search(
                    query=q,
                    session_id=session_id,
                    vector_top_k=vector_top_k,
                    keyword_top_k=keyword_top_k
                )
                return result
            except Exception as e:
                logger.error(f"[GraphMemory WebUI] 调试搜索失败: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.delete("/api/node/{node_type}/{node_id}")
        async def delete_node(node_type: str, node_id: str, _: bool = Depends(self._check_auth)):
            """API: 删除图中的一个指定节点。"""
            try:
                await self.service.delete_node(node_id, node_type)
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.delete("/api/edge")
        async def delete_edge(from_id: str, to_id: str, rel_type: str, from_type: str, to_type: str, _: bool = Depends(self._check_auth)):
            """API: 删除图中的一条指定关系（边）。"""
            try:
                await self.service.delete_edge(from_id, to_id, rel_type, from_type, to_type)
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.put("/api/node/{node_type}/{node_id}")
        async def update_node(node_type: str, node_id: str, data: dict, _: bool = Depends(self._check_auth)):
            """API: 更新一个节点的属性。"""
            properties = data.get("properties", {})
            if not properties:
                raise HTTPException(status_code=400, detail="请求体中缺少 'properties' 字段。")
            try:
                await self.service.update_node(node_id, node_type, properties)
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/api/batch-delete")
        async def batch_delete(data: dict, _: bool = Depends(self._check_auth)):
            """API: 执行预定义的批量删除任务。"""
            task_name = data.get("task_name")
            if not task_name:
                raise HTTPException(status_code=400, detail="请求体中缺少 'task_name' 字段。")

            try:
                kwargs = data.get("params", {})
                deleted_count = await self.service.batch_delete(task_name, **kwargs)
                return {"status": "success", "deleted_count": deleted_count}
            except Exception as e:
                logger.error(f"[GraphMemory WebUI] 批量删除任务 '{task_name}' 失败: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/api/node")
        async def create_node(data: dict, _: bool = Depends(self._check_auth)):
            """API: 手动创建一个新节点。"""
            node_type = data.get("node_type")
            properties = data.get("properties")
            if not node_type or not properties:
                raise HTTPException(status_code=400, detail="请求体中缺少 'node_type' 或 'properties' 字段。")

            try:
                success = await self.service.create_node(node_type, properties)
                if success:
                    return {"status": "success"}
                else:
                    raise HTTPException(status_code=500, detail="创建节点失败。")
            except Exception as e:
                logger.error(f"[GraphMemory WebUI] 创建节点失败: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/api/link")
        async def link_entity(data: dict, _: bool = Depends(self._check_auth)):
            """API: 将实体关联到会话。"""
            session_id = data.get("session_id")
            entity_name = data.get("entity_name")
            if not session_id or not entity_name:
                raise HTTPException(status_code=400, detail="请求体中缺少 'session_id' 或 'entity_name' 字段。")

            try:
                await self.service.link_entity_to_session(session_id, entity_name)
                return {"status": "success"}
            except Exception as e:
                logger.error(f"[GraphMemory WebUI] 关联实体失败: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/api/edge")
        async def create_edge(payload: CreateEdgePayload, _: bool = Depends(self._check_auth)):
            """API: 在两个节点之间创建一条新的关系（边）。"""
            try:
                await self.service.create_edge(
                    payload.from_id,
                    payload.to_id,
                    payload.rel_type,
                    payload.from_type,
                    payload.to_type,
                )
                return {"status": "success"}
            except NotImplementedError as e:
                raise HTTPException(status_code=400, detail=str(e))
            except Exception as e:
                logger.error(f"[GraphMemory WebUI] 创建关系失败: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        # --- 监控 WebSocket API ---
        @self.app.websocket("/ws/status")
        async def websocket_endpoint(websocket: WebSocket):
            """处理监控数据的 WebSocket 连接。"""
            await monitoring_service.connect(websocket)
            try:
                while True:
                    # 保持连接开放以接收广播
                    # 客户端不需要发送数据，但我们需要一个循环来检测断开连接
                    await websocket.receive_text()
            except WebSocketDisconnect:
                logger.info("[GraphMemory WebUI] WebSocket 客户端断开连接。")
            finally:
                await monitoring_service.disconnect(websocket)

    def _run_fastapi_server(self):
        """在单独的线程中运行 FastAPI 服务器。"""
        # 在 Windows 上，为这个线程创建一个新的 SelectorEventLoop
        if platform.system() == "Windows":
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        # 为这个线程创建新的事件循环
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # 使用 uvicorn 但在新的事件循环中运行
            import uvicorn

            config = uvicorn.Config(
                app=self.app,
                host=self.host,
                port=self.port,
                log_level="info",
                loop="asyncio"
            )
            server = uvicorn.Server(config)

            # 在当前线程的事件循环中运行服务器
            loop.run_until_complete(server.serve())
        except Exception as e:
            logger.error(f"[GraphMemory] WebUI 服务器运行时出错: {e}", exc_info=True)
        finally:
            loop.close()

    def start(self):
        """在后台线程中启动 FastAPI 服务器。"""
        self.stop_event.clear()
        self.server_thread = threading.Thread(target=self._run_fastapi_server, daemon=True)
        self.server_thread.start()
        logger.info(f"[GraphMemory] WebUI 已启动，访问地址: http://{self.host}:{self.port}")

    def stop(self):
        """停止 FastAPI 服务器。"""
        self.stop_event.set()
        # 对于 daemon 线程，等待其结束
        if self.server_thread and self.server_thread.is_alive():
            self.server_thread.join(timeout=2.0)
            if self.server_thread.is_alive():
                logger.warning("[GraphMemory] WebUI 服务器线程未能在超时时间内停止")
        logger.info("[GraphMemory] WebUI 服务器已停止")
