"""
此文件集中管理了所有用于与大语言模型交互的提示。
"""

# --- 知识提取提示 ---

EXTRACTION_PROMPT = """
你是一个超级智能的知识图谱分析师。你的任务是分析一段对话，并从中提取结构化信息。

**输入对话:**
```
{text}
```

**指令:**
1.  **识别核心实体**: 提取提到的关键人物、地点、概念或事件。对它们进行归一化处理（例如："JS" -> "JavaScript"）。
2.  **提取关系**: 寻找实体之间明确的关系（例如："用户A喜欢Python"，"公司X开发了产品Y"）。
3.  **识别说话者和上下文**: 对于每一条信息，识别出说话者（`UserNode`）和对话上下文（`SessionNode`）。
4.  **输出JSON**: 将所有提取的信息格式化为一个单一的JSON对象，其结构如下。不要输出任何其他内容。如果没有发现有价值的信息，返回一个空的JSON对象 {{}}。

**输出JSON结构:**
```json
{{
  "users": [
    {{
      "id": "platform_user_id",
      "name": "nickname",
      "platform": "e.g., qq"
    }}
  ],
  "sessions": [
    {{
      "id": "platform_group_or_private_id",
      "type": "GROUP or PRIVATE",
      "name": "group_name"
    }}
  ],
  "messages": [
    {{
      "id": "message_id",
      "content": "Original message text...",
      "timestamp": 1678886400,
      "sender_id": "platform_user_id",
      "session_id": "platform_group_or_private_id"
    }}
  ],
  "entities": [
    {{
      "name": "Normalized Entity Name",
      "type": "Concept, Person, Location, etc."
    }}
  ],
  "relations": [
    {{
      "src_entity": "Entity1 Name",
      "tgt_entity": "Entity2 Name",
      "relation": "IS_A"
    }}
  ],
  "mentions": [
    {{
      "message_id": "message_id",
      "entity_name": "Entity Name",
      "sentiment": "Positive, Negative, or Neutral"
    }}
  ]
}}
```
"""

# --- 查询重写提示 ---

QUERY_REWRITING_PROMPT = """
根据最近的对话历史和用户的最新查询，将该查询重写为一个独立的、自包含的问题。
这有助于消除代词和上下文依赖，以便进行更准确的向量搜索。

**对话历史:**
{history}

**用户的查询:** "{query}"

**重写后的查询:**
"""

# --- 摘要生成提示 ---

SUMMARIZATION_PROMPT = """
你是一位专业的摘要员。请根据以下的对话记录，以第三人称的视角，创建一个简洁的摘要，总结其中关键的事件、事实和用户观点。

**对话记录:**
```
{text}
```

**指令:**
- 专注于长期相关的信息。
- 忽略闲聊和问候语。
- 摘要应该是一个独立的段落。

**摘要:**
"""

# --- Agentic 反思提示 ---

FACT_CORRECTION_PROMPT = """
你是一个严谨的事实核查与修正专家。这里有一个关于实体 '{entity_name}' 的记忆摘要：'{summary_text}'。
以及与它相关的一些原始对话片段：
```
{context_package}
```
请判断这个摘要是否准确？是否存在过时的信息？如果需要修正，请提供一个更新后的、更精确的摘要。
以JSON格式返回你的分析和操作建议。JSON结构必须如下：
`{{"insight": "你的分析，例如：摘要内容已过时，用户喜好已改变。", "action": "update_summary | no_action", "new_text": "如果 action 是 update_summary，这里是新的摘要文本。"}}`
"""

RELATION_INFERENCE_PROMPT = """
你是一个逻辑推理专家。已知以下事实（节点和关系）：
```
{context_package}
```
根据这些信息，这些实体之间是否存在某种新的、可推断的、有价值的关系？
例如，如果"A认识B"且"B认识C"，你可以推断"A和C可能间接认识"。
如果存在，请以JSON格式返回你的推断。JSON结构必须如下：
`{{"insight": "你的推断理由。", "action": "create_relation | no_action", "source": "源实体名称", "target": "目标实体名称", "relation_label": "推断出的关系标签"}}`
"""
