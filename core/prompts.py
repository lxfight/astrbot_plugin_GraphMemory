"""LLM Prompt 模板"""

# 知识提取 Prompt
EXTRACTION_PROMPT = """从以下对话中提取知识图谱信息。

对话记录:
{text}

请提取:
1. 实体: 人物、地点、事物、概念、事件
2. 关系: 实体之间的关系

返回 JSON 格式:
{{
    "entities": [
        {{"name": "实体名", "type": "PERSON|PLACE|THING|CONCEPT|EVENT", "description": "描述"}}
    ],
    "relations": [
        {{"from": "实体1", "to": "实体2", "relation": "关系描述", "evidence": "证据"}}
    ]
}}

注意:
- 只提取明确提到的信息，不要推测
- 实体名称使用原文
- 关系描述要简洁明确
- 证据是支持该关系的对话片段
"""

# 查询重写 Prompt
QUERY_REWRITING_PROMPT = """将用户的问题重写为一个独立的、包含上下文的问题。

最近对话:
{history}

用户问题: {query}

请将问题重写为一个完整的、独立的问题，使其在没有上下文的情况下也能理解。
只返回重写后的问题，不要解释。
"""
