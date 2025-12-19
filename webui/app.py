"""FastAPI 应用主文件"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .api import entities, graph, relations, search, stats, system


def create_app(manager, config: dict) -> FastAPI:
    """创建 FastAPI 应用

    Args:
        manager: GraphMemoryManager 实例
        config: 插件配置
    """
    app = FastAPI(
        title="GraphMemory WebUI",
        description="图谱记忆可视化管理界面",
        version="0.5.0",
    )

    # CORS 配置
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 存储 manager 和 config 到 app.state
    app.state.manager = manager
    app.state.config = config

    # 注册 API 路由（优先级最高）
    app.include_router(graph.router, prefix="/api/graph", tags=["图谱数据"])
    app.include_router(entities.router, prefix="/api/entities", tags=["实体管理"])
    app.include_router(relations.router, prefix="/api/relations", tags=["关系管理"])
    app.include_router(search.router, prefix="/api/search", tags=["搜索功能"])
    app.include_router(stats.router, prefix="/api/stats", tags=["统计分析"])
    app.include_router(system.router, prefix="/api/system", tags=["系统管理"])

    # 静态文件服务（前端构建产物）
    static_dir = Path(__file__).parent / "static"
    if static_dir.exists():
        index_file = static_dir / "index.html"

        # 挂载静态资源目录（assets, favicon等）
        assets_dir = static_dir / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

        # 根路径返回 index.html
        @app.get("/")
        async def serve_root():
            """返回首页"""
            if index_file.exists():
                return FileResponse(index_file)
            return {"error": "Frontend not built"}

        # SPA 路由处理：所有非 API、非 assets 路由都返回 index.html
        @app.get("/{full_path:path}")
        async def serve_spa(full_path: str):
            """处理 SPA 路由，返回 index.html"""
            # 返回 index.html，让前端路由处理
            if index_file.exists():
                return FileResponse(index_file)
            return {"error": "Frontend not built"}

    return app
