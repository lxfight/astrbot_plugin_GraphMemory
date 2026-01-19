"""WebUI 管理器"""

import asyncio
import socket

from astrbot.api import logger


class WebUIManager:
    """WebUI 服务器管理器"""

    def __init__(self, manager, config: dict):
        self.manager = manager
        self.config = config
        self.server: "uvicorn.Server | None" = None  # type: ignore
        self.task: asyncio.Task | None = None
        self._started = False

    def _is_port_available(self, host: str, port: int) -> bool:
        """检查端口是否可用"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind((host, port))
                return True
        except OSError:
            return False

    async def start(self):
        """启动 WebUI 服务器"""
        try:
            import uvicorn

            from ..webui.app import create_app

            port = self.config.get("webui_port", 8081)
            host = "0.0.0.0"

            # 检查端口是否可用
            if not self._is_port_available(host, port):
                logger.warning(
                    f"[GraphMemory] 端口 {port} 已被占用，WebUI 功能暂时不可用。"
                    f"请稍后重试或更换端口。"
                )
                return

            # 生成或获取访问密钥
            webui_key = self.config.get("webui_key", "")
            if not webui_key:
                import secrets
                webui_key = secrets.token_urlsafe(32)
                logger.info(f"[GraphMemory] WebUI 访问密钥: {webui_key}")
                logger.info("[GraphMemory] 请妥善保管此密钥，或在配置中设置 webui_key")

            # 创建 FastAPI 应用
            app = create_app(self.manager, self.config)

            # 创建 uvicorn 配置
            config = uvicorn.Config(
                app,
                host=host,
                port=port,
                log_level="warning",  # 降低日志级别，减少噪音
            )
            self.server = uvicorn.Server(config)

            # 禁用 uvicorn 的 sys.exit 行为
            self.server.install_signal_handlers = lambda: None

            # 在后台任务中运行服务器，捕获所有异常
            self.task = asyncio.create_task(self._run_server())
            self._started = True

            logger.info(f"[GraphMemory] WebUI 已启动: http://{host}:{port}")
            logger.info(f"[GraphMemory] 访问地址: http://localhost:{port}?key={webui_key}")

        except ImportError:
            logger.warning("[GraphMemory] 未安装 FastAPI 或 uvicorn，WebUI 功能不可用")
            logger.warning("[GraphMemory] 请运行: pip install fastapi uvicorn")
        except Exception as e:
            logger.error(f"[GraphMemory] WebUI 启动失败: {e}", exc_info=True)

    async def _run_server(self):
        """运行服务器，捕获所有异常防止进程退出"""
        try:
            await self.server.serve()
        except SystemExit as e:
            # 捕获 uvicorn 的 sys.exit 调用，防止杀死整个进程
            logger.warning(f"[GraphMemory] WebUI 服务器异常退出 (code={e.code})，但不影响主程序")
        except asyncio.CancelledError:
            # 正常取消，忽略
            pass
        except Exception as e:
            logger.error(f"[GraphMemory] WebUI 服务器运行错误: {e}", exc_info=True)
        finally:
            self._started = False

    async def stop(self):
        """停止 WebUI 服务器"""
        if not self._started:
            logger.debug("[GraphMemory] WebUI 服务器未启动，无需停止")
            return

        logger.info("[GraphMemory] 正在停止 WebUI 服务器...")

        if self.server:
            self.server.should_exit = True

        if self.task:
            # 等待服务器优雅关闭，最多等待 5 秒
            try:
                await asyncio.wait_for(self.task, timeout=5.0)
            except asyncio.TimeoutError:
                logger.warning("[GraphMemory] WebUI 服务器关闭超时，强制取消")
                self.task.cancel()
                try:
                    await self.task
                except asyncio.CancelledError:
                    pass
            except asyncio.CancelledError:
                pass

        # 额外等待一小段时间让端口完全释放
        await asyncio.sleep(0.5)

        self.server = None
        self.task = None
        self._started = False

        logger.info("[GraphMemory] WebUI 服务器已停止")
