<div align="center">

# astrbot_plugin_GraphMemory

<p>
    <img src="https://img.shields.io/badge/version-0.5.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License">
    <img src="https://img.shields.io/badge/status-stable-green" alt="Status">
</p>

<h3>基于 KuzuDB 的 GraphRAG 长期记忆插件</h3>

> **v0.5.0**: 完整的 WebUI 实现，支持图谱可视化、实体管理、统计分析等功能

</div>

## 简介

GraphMemory 是一个为 AstrBot 设计的长期记忆插件。它利用图数据库 (KuzuDB) 将对话历史结构化存储，通过 GraphRAG 技术实现智能记忆检索，赋予 Bot 更连贯的上下文理解能力。

## 核心特性

- **自动知识提取**: 通过 LLM 自动从对话中提取实体和关系，构建知识图谱
- **智能记忆检索**: 结合向量搜索、关键词搜索和图遍历，在 LLM 请求前注入相关记忆
- **人格分层共享**: 支持不同人格的记忆隔离和共享策略
- **时间衰减机制**: 自动降低旧记忆的重要性，保持图谱活跃
- **实体消歧**: 自动识别和合并重复实体
- **Function Calling**: LLM 可主动调用记忆检索工具
- **WebUI 可视化**: 完整的 Web 管理界面

## WebUI 功能

访问 `http://localhost:8081` 进入 WebUI (默认端口)，支持:

- **图谱可视化**: 使用 Cytoscape.js 展示知识图谱
  - 会话图谱和全局图谱切换
  - 节点大小表示重要性
  - 边宽度表示关系强度
  - 拖拽、缩放、搜索

- **实体管理**: 完整的 CRUD 操作
  - 列表、搜索、过滤
  - 查看详情、编辑、删除
  - 分页浏览

- **关系管理**: 关系列表和管理
  - 过滤、删除
  - 分页浏览

- **搜索测试**: 三种搜索模式
  - 混合搜索
  - 向量搜索
  - 关键词搜索

- **统计分析**: 图谱统计和可视化
  - 概览卡片
  - 实体类型分布饼图 (ECharts)
  - 实体创建趋势折线图 (ECharts)

- **系统管理**: 图谱维护功能
  - 系统状态查看
  - 图谱导出 (JSON)
  - 图谱导入 (合并/覆盖)
  - 清理低重要性实体
  - 应用时间衰减

- **主题切换**: 明暗主题支持

## 安装说明

### 方式一: 从 Release 下载 (推荐)

1. 访问 [Releases](https://github.com/your-repo/releases) 页面
2. 下载最新版本的 `.tar.gz` 或 `.zip`
3. 解压到 AstrBot 插件目录
4. 直接使用，WebUI 已预构建

### 方式二: 从源码安装

如果从源码克隆，需要手动构建前端:

**Linux/macOS**:
```bash
cd astrbot_plugin_GraphMemory
bash scripts/build.sh
```

**Windows**:
```cmd
cd astrbot_plugin_GraphMemory
scripts\build.bat
```

## 配置说明

配置文件位于 `_conf_schema.json`，可通过 AstrBot 管理面板配置。

### 必填配置

| 配置项 | 类型 | 说明 |
|:---|:---:|:---|
| `embedding_provider_id` | string | **[必填]** Embedding Provider ID，用于向量检索 |

### 基础配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_group_learning` | bool | `true` | 是否启用群聊学习 |
| `llm_provider_id` | string | `""` | 知识提取使用的 LLM Provider ID，留空使用当前会话模型 |

### 缓冲区配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `buffer_size_private` | int | `10` | 私聊缓冲区大小 |
| `buffer_size_group` | int | `20` | 群聊缓冲区大小 |
| `buffer_timeout` | int | `300` | 缓冲区超时时间 (秒) |

### 检索配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_query_rewriting` | bool | `true` | 是否启用查询重写 |
| `retrieval_top_k` | int | `5` | 检索结果数量 |
| `enable_function_calling` | bool | `false` | 是否启用主动检索 |

### WebUI 配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `webui_port` | int | `8081` | WebUI 监听端口 |
| `webui_key` | string | `""` | 访问密钥，留空则启动时自动生成 |

### 维护配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `prune_interval` | int | `86400` | 图谱维护间隔 (秒) |
| `time_decay_rate` | float | `0.95` | 时间衰减率 |
| `min_importance_threshold` | float | `0.1` | 最小重要性阈值 |

## 指令说明

| 指令 | 参数 | 说明 |
|:---|:---|:---|
| `/memory_stat` | 无 | 显示图谱统计信息 |
| `/memory_search` | `<query>` | 搜索记忆 |
| `/memory_forget` | `<entity_name>` | 删除指定实体 |
| `/memory_export` | 无 | 导出图谱数据 |
| `/memory_import` | `<json_data>` | 导入图谱数据 |
| `/memory_disambiguate` | 无 | 执行实体消歧 |

## 图数据库 Schema

### 节点类型

| 节点 | 主键 | 说明 |
|:---|:---|:---|
| `User` | id | 用户节点 |
| `Session` | id | 会话节点 |
| `Entity` | name | 实体节点 (人物/地点/事物/概念/事件) |

### 关系类型

| 关系 | 起点 | 终点 | 说明 |
|:---|:---|:---|:---|
| `PARTICIPATED_IN` | User | Session | 用户参与会话 |
| `RELATED_TO` | Entity | Entity | 实体间关系 |
| `MENTIONED_IN` | Entity | Session | 实体在会话中被提及 |
| `KNOWS` | User | Entity | 用户知道实体 |

## 工作流程

```
用户消息 -> 缓冲区收集 -> LLM知识提取 -> 存入图数据库
                                              |
用户提问 -> 查询重写 -> 混合检索 -> 图遍历扩展 -> 注入Prompt -> LLM回复
```

## 技术架构

### 后端

- **Python 3.10+**
- **KuzuDB**: 图数据库
- **SQLite**: 缓冲区存储
- **FastAPI**: WebUI 后端
- **Uvicorn**: ASGI 服务器

### 前端

- **Vue 3**: 前端框架 (Composition API)
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Cytoscape.js**: 图谱可视化
- **ECharts**: 统计图表
- **Axios**: HTTP 客户端

### 目录结构

```
astrbot_plugin_GraphMemory/
├── main.py                 # 插件入口
├── core/                   # 核心模块
│   ├── manager.py          # 核心管理器
│   ├── event_handler.py    # 事件处理
│   ├── webui_manager.py    # WebUI 管理
│   ├── handlers.py         # 指令处理
│   ├── extractor.py        # 知识提取
│   ├── retriever.py        # 记忆检索
│   ├── disambiguator.py    # 实体消歧
│   └── storage/            # 存储层
│       ├── buffer.py       # 缓冲区
│       └── graph_store.py  # 图数据库
├── webui/                  # WebUI 后端
│   ├── app.py              # FastAPI 应用
│   ├── api/                # API 路由
│   └── static/             # 前端构建产物 (CI/CD 生成)
├── webui-src/              # 前端源码
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── api/            # API 客户端
│   │   └── assets/         # 静态资源
│   └── package.json
├── scripts/                # 构建脚本
│   ├── build.sh            # Linux/macOS 构建
│   ├── build.bat           # Windows 构建
│   └── README.md           # 构建说明
└── docs/                   # 文档
    ├── README.md           # 文档导航
    ├── WebUI使用指南.md    # WebUI 使用手册
    └── [设计文档]
```

## CI/CD 自动构建

项目配置了 GitHub Actions 自动构建:

- **build-frontend.yml**: 自动构建前端，上传 Artifacts
- **release.yml**: Release 时自动构建并打包完整插件

用户从 Release 下载的包已包含构建好的前端，无需手动构建。

## 开发说明

### 前端开发

```bash
cd webui-src
npm install
npm run dev
```

访问 `http://localhost:5173` 进行开发。

### 构建前端

```bash
bash scripts/build.sh
```

### 运行测试

```bash
# 安装测试依赖
pip install -r requirements-test.txt

# 运行所有测试
pytest

# 运行特定类型
pytest -m unit          # 单元测试
pytest -m integration   # 集成测试
pytest -m slow          # 性能测试

# 生成覆盖率报告
pytest --cov=. --cov-report=html

# 使用脚本
bash scripts/run_tests.sh
bash scripts/run_tests.sh coverage
```

详见 [测试文档](tests/README.md) 和 [测试总结](TESTING_SUMMARY.md)。

## 注意事项

1. **必须配置 Embedding Provider**: 向量检索是 GraphRAG 的核心
2. **LLM 消耗**: 知识提取、查询重写等功能会消耗 LLM tokens
3. **数据库位置**: 数据库文件位于插件数据目录的 `kuzu_db/`
4. **WebUI 访问**: 首次启动会生成访问密钥，请妥善保管

## 更新日志

### v0.5.0 (2025-12-18)

- ✅ 完整的 WebUI 实现
- ✅ 图谱可视化 (Cytoscape.js)
- ✅ 实体/关系管理
- ✅ 搜索测试 (混合/向量/关键词)
- ✅ 统计分析 (ECharts 图表)
- ✅ 系统管理 (导入/导出/清理)
- ✅ 明暗主题切换
- ✅ CI/CD 自动构建

### v0.4.0

- 实体消歧功能
- Function Calling 支持
- 性能优化

### v0.3.0

- 全新架构重构
- 简化 Schema
- 人格分层共享策略

## 文档

- [WebUI 使用指南](docs/WebUI使用指南.md)
- [设计文档](docs/README.md)
- [构建说明](scripts/README.md)

## 许可证

AGPL-3.0

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**作者**: lxfight
**项目**: astrbot_plugin_GraphMemory
**版本**: v0.5.0
