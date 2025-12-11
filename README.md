<div align="center">

# astrbot_plugin_GraphMemory

<p>
    <img src="https://img.shields.io/badge/version-0.2.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License">
    <img src="https://img.shields.io/badge/status-beta-orange" alt="Status">
</p>

<h3>基于 KuzuDB 的 GraphRAG 长期记忆插件</h3>

> **注意**: 当前为测试版本，功能可能不稳定。v0.2.0 采用全新数据库 Schema，与旧版本不兼容。

</div>

## 简介

GraphMemory 是一个为 AstrBot 设计的长期记忆插件。它利用图数据库 (KuzuDB) 将对话历史结构化存储，通过 GraphRAG 技术实现智能记忆检索，赋予 Bot 更连贯的上下文理解能力。

## 核心特性

- **自动知识提取**: 通过 LLM 自动从对话中提取用户、实体、消息和关系，构建知识图谱
- **GraphRAG 智能检索**: 结合向量搜索、关键词搜索和图遍历，在 LLM 请求前注入相关记忆上下文
- **记忆巩固机制**: 自动将多轮对话总结为记忆摘要 (MemoryFragment)，减少冗余存储
- **人格记忆隔离**: 支持不同人格拥有独立的记忆空间，互不干扰
- **智能图修剪**: 多阶段清理策略，自动清理过期消息、孤立实体和旧摘要
- **查询重写**: 使用 LLM 将用户问题重写为独立查询，提升检索准确性
- **Agentic 反思**: (可选) 后台自动进行事实修正和关系推断，持续优化知识图谱
- **WebUI 可视化**: 内置 Web 界面，支持图谱可视化查看和管理

## 图数据库 Schema

插件使用以下节点和关系类型:

**节点类型:**
| 节点 | 主键 | 说明 |
|:---|:---|:---|
| `User` | id | 用户节点，包含 name, platform |
| `Session` | id | 会话节点，包含 type, name |
| `Message` | id | 消息节点，包含 content, timestamp, embedding, is_summarized |
| `Entity` | name | 实体节点，包含 type, summary, embedding, last_accessed |
| `MemoryFragment` | id | 记忆摘要节点，包含 text, timestamp, valid_from, valid_until, embedding |

**关系类型:**
| 关系 | 起点 | 终点 | 说明 |
|:---|:---|:---|:---|
| `PARTICIPATED_IN` | User | Session | 用户参与会话 |
| `SENT` | User | Message | 用户发送消息 |
| `POSTED_IN` | Message | Session | 消息发布在会话中 |
| `MENTIONS` | Message | Entity | 消息提及实体 (含 sentiment 属性) |
| `RELATED_TO` | Entity | Entity | 实体间关系 (含 relation 属性) |
| `CONTAINS_ENTITY` | Session | Entity | 会话包含实体 |
| `USER_HAS_MEMORY` | User | MemoryFragment | 用户的记忆片段 |
| `SESSION_HAS_MEMORY` | Session | MemoryFragment | 会话的记忆片段 |

## 工作流程

```
用户消息 -> 缓冲区收集 -> LLM知识提取 -> 存入图数据库
                                              |
用户提问 -> 查询重写 -> 多路召回(向量+关键词) -> 图遍历扩展 -> 重排序 -> 注入Prompt -> LLM回复
```

## 配置说明

配置文件位于 `_conf_schema.json`，可通过 AstrBot 管理面板配置。

### 基础配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_group_learning` | bool | `true` | 是否启用群聊学习 |
| `learning_model_id` | string | `""` | 知识提取使用的 LLM Provider ID，留空使用当前会话模型 |
| `embedding_provider_id` | string | `""` | **[必填]** Embedding Provider ID，用于向量检索 |
| `summarization_provider_id` | string | `""` | 记忆摘要使用的 LLM Provider ID，留空使用 learning_model_id |

### 人格隔离配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_persona_isolation` | bool | `true` | 是否启用人格记忆隔离 |
| `persona_isolation_exceptions` | list | `[]` | 人格隔离例外列表 (unified_msg_origin) |

### 图维护配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `max_global_nodes` | int | `10000` | 全局最大节点数限制 |
| `prune_interval` | int | `3600` | 修剪检查间隔 (秒) |
| `pruning_message_max_days` | int | `90` | 原始消息最大保留天数 |
| `summarize_interval` | int | `1800` | 记忆巩固检查间隔 (秒) |
| `consolidation_threshold` | int | `50` | 触发记忆巩固的未摘要消息阈值 |

### 检索配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_query_rewriting` | bool | `true` | 是否启用查询重写 |
| `recall_vector_top_k` | int | `5` | 向量搜索每类节点的召回数量 |
| `recall_keyword_top_k` | int | `3` | 关键词搜索召回的实体数量 |
| `recall_max_items` | int | `7` | 最终注入 Prompt 的项目总数 |

### WebUI 配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `webui_host` | string | `"0.0.0.0"` | WebUI 监听地址 |
| `webui_port` | int | `8081` | WebUI 监听端口 |
| `webui_key` | string | `""` | 访问密钥，留空则启动时自动生成 |

### 反思配置

| 配置项 | 类型 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `enable_reflection` | bool | `false` | 是否启用 Agentic 反思 |
| `reflection_interval` | int | `7200` | 反思周期间隔 (秒) |

## 指令说明

| 指令 | 参数 | 说明 |
|:---|:---|:---|
| `/memory_stat` | 无 | 显示当前图谱的节点统计信息 |
| `/memory_link_session` | `<target_session_id>` | 将当前会话的记忆摘要关联到目标会话 |
| `/memory_forget` | `<entity_name>` | 删除指定实体及其关联关系 |
| `/memory_dump` | 无 | 导出当前会话的图数据 (JSON格式) |
| `/memory_migrate_v2` | 无 | (已废弃) 旧版数据迁移指令 |

## WebUI 功能

访问 `http://<host>:<port>` 进入 WebUI，支持:

- 图谱可视化浏览 (会话视图/全局视图)
- 节点/边的增删改操作
- 调试搜索测试
- 批量删除操作 (清理孤立实体、过期消息)
- 实时监控 (日志、任务状态、消息流)


## 技术架构

```
main.py                 # 插件入口，注册事件处理器
core/
  ├── plugin_service.py    # 核心业务逻辑
  ├── graph_engine.py      # 图数据库操作引擎
  ├── extractor.py         # LLM 知识提取器
  ├── buffer_manager.py    # 消息缓冲区管理
  ├── reflection_engine.py # Agentic 反思引擎
  ├── web_server.py        # WebUI 服务
  ├── graph_service.py     # WebUI API 服务层
  ├── monitoring_service.py# 实时监控服务
  ├── schema.py            # 数据库 Schema 定义
  ├── queries.py           # Cypher 查询语句
  ├── prompts.py           # LLM Prompt 模板
  └── graph_entities.py    # 数据实体定义
```

## 注意事项

1. **必须配置 Embedding Provider**: 向量检索是 GraphRAG 的核心，未配置将导致检索功能不可用
2. **LLM 消耗**: 知识提取、查询重写、记忆摘要、反思等功能都会消耗 LLM tokens
3. **数据库版本**: v0.2.0 使用全新 Schema，数据库文件位于 `kuzu_db_v2/`
4. **线程安全**: 所有数据库操作通过单线程执行器序列化执行

## 许可证

AGPL-3.0
