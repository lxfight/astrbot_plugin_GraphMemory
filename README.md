<div align="center">

# astrbot_plugin_GraphMemory

<p>
    <img src="https://img.shields.io/badge/version-0.1.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License">
    <img src="https://img.shields.io/badge/status-beta-orange" alt="Status">
</p>

<h3> 基于 kuzu 的图数据库记忆插件 </h3>

> **注意**：当前为测试版本，功能可能不稳定。

</div>

## 简介

一个简单的图数据库记忆插件，基于 kuzu 实现。它能够自动从对话中提取实体和关系，构建知识图谱，并在后续的对话中检索相关信息，赋予 Bot 更连贯的上下文理解能力。

## 核心特性

*   **自动旁听学习**: 能够分析群聊和私聊中的对话，自动提取关键信息存入图数据库。
*   **智能记忆检索**: 在 Bot 回复前，根据用户消息的关键词自动检索相关记忆，并注入到 Prompt 中。
*   **人格隔离**: 支持不同人格拥有独立的记忆空间，互不干扰；也支持配置特定会话共享记忆。
*   **自动修剪**: 设置最大节点数限制，定期清理陈旧或不重要的记忆，保持数据库高效。

## 配置详解

配置文件位于插件目录下的 `_conf_schema.json` (或通过 AstrBot 管理面板配置)。

| 配置项 | 类型 | 默认值 | 说明 |
| :--- | :---: | :---: | :--- |
| `enable_group_learning` | bool | `true` | 是否开启群聊旁听学习。开启后，Bot 将会分析群聊中非直接对话并提取记忆。 |
| `learning_model_id` | string | `""` | 用于记忆提取的专用 LLM 模型 ID。建议使用价格较低且指令遵循能力强的模型。留空则复用当前会话的模型。 |
| `confidence_threshold` | float | `0.6` | 记忆采纳的置信度阈值 (0.0 - 1.0)。低于此置信度的关系将被丢弃。 |
| `enable_persona_isolation` | bool | `true` | 是否默认开启人格记忆隔离。 |
| `persona_isolation_exceptions` | list | `[]` | 人格隔离例外列表。填写 `unified_msg_origin`。 |
| `keyword_extraction_mode` | string | `"local"` | 记忆检索的关键词提取模式。`local` (使用 jieba，速度快且免费) 或 `llm` (使用 LLM，更智能但有成本)。 |
| `keyword_extraction_provider` | string | `""` | 如果关键词提取模式为 llm，指定使用的模型 ID。留空则复用 `learning_model_id` 或当前会话模型。 |
| `max_global_nodes` | int | `5000` | 全局最大节点数限制。当节点总数超过此值时，会触发清理机制。 |
| `prune_interval` | int | `3600` | 记忆清理检查间隔（秒）。 |

## 指令说明

```bash
migrate_memory <target_session>
```
将当前会话的记忆迁移到目标会话。

## 未来开发计划

- [ ] 优化消息缓冲区处理策略，提高提取效率。
- [ ] 添加 WebUI 功能，支持可视化查看和管理知识图谱。
- [ ] 注册更多插件指令，方便手动管理记忆。