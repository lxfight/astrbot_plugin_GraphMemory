"""知识提取模块"""

import json
import re
from typing import Optional, Any

from astrbot.api import logger
from astrbot.api.star import Context

from .entities import ExtractedKnowledge, EntityNode, RelatedToRel
from .prompts import EXTRACTION_PROMPT, QUERY_REWRITING_PROMPT


class KnowledgeExtractor:
    """知识提取器

    负责:
    - 从对话中提取实体和关系
    - 查询重写
    """

    def __init__(
        self,
        context: Context,
        llm_provider_id: Optional[str] = None,
        embedding_provider: Optional[Any] = None,
    ):
        self.context = context
        self.llm_provider_id = llm_provider_id
        self.embedding_provider = embedding_provider

    async def extract(
        self,
        text: str,
        session_id: str,
    ) -> Optional[ExtractedKnowledge]:
        """从对话文本中提取知识

        Args:
            text: 对话文本
            session_id: 会话ID

        Returns:
            提取的知识，如果失败返回 None
        """
        if not text.strip():
            return None

        # 确定使用的 LLM Provider
        provider_id = self.llm_provider_id
        if not provider_id:
            provider_id = await self.context.get_current_chat_provider_id(session_id)

        if not provider_id:
            logger.warning(f"[GraphMemory] 会话 {session_id} 没有可用的 LLM Provider")
            return None

        # 构建 Prompt
        prompt = EXTRACTION_PROMPT.format(text=text)

        try:
            # 调用 LLM
            resp = await self.context.llm_generate(
                chat_provider_id=provider_id,
                prompt=prompt,
            )

            if not resp or not resp.completion_text:
                logger.warning("[GraphMemory] LLM 返回空响应")
                return None

            raw_text = resp.completion_text
            logger.debug(f"[GraphMemory] LLM 提取响应:\n{raw_text}")

            # 解析 JSON
            json_str = self._find_json_blob(raw_text)
            if not json_str:
                logger.error(f"[GraphMemory] 未找到有效的 JSON: {raw_text}")
                return None

            data = json.loads(json_str)

            # 转换为实体对象
            knowledge = ExtractedKnowledge()

            # 解析实体
            for entity_data in data.get("entities", []):
                entity = EntityNode(
                    name=entity_data.get("name", ""),
                    type=entity_data.get("type", "THING"),
                    description=entity_data.get("description", ""),
                )
                if entity.name:
                    knowledge.entities.append(entity)

            # 解析关系
            for rel_data in data.get("relations", []):
                relation = RelatedToRel(
                    from_entity=rel_data.get("from", ""),
                    to_entity=rel_data.get("to", ""),
                    relation=rel_data.get("relation", ""),
                    evidence=rel_data.get("evidence", ""),
                )
                if relation.from_entity and relation.to_entity:
                    knowledge.relations.append(relation)

            logger.info(
                f"[GraphMemory] 提取完成: {len(knowledge.entities)} 个实体, "
                f"{len(knowledge.relations)} 条关系"
            )

            return knowledge

        except Exception as e:
            logger.error(f"[GraphMemory] 知识提取失败: {e}", exc_info=True)
            return None

    async def rewrite_query(
        self,
        query: str,
        history: str,
        session_id: str,
    ) -> Optional[str]:
        """重写查询

        Args:
            query: 原始查询
            history: 对话历史
            session_id: 会话ID

        Returns:
            重写后的查询，如果失败返回 None
        """
        if not query.strip():
            return None

        # 确定使用的 LLM Provider
        provider_id = self.llm_provider_id
        if not provider_id:
            provider_id = await self.context.get_current_chat_provider_id(session_id)

        if not provider_id:
            logger.warning(f"[GraphMemory] 会话 {session_id} 没有可用的 LLM Provider")
            return None

        # 构建 Prompt
        prompt = QUERY_REWRITING_PROMPT.format(
            history=history or "无",
            query=query,
        )

        try:
            # 调用 LLM
            resp = await self.context.llm_generate(
                chat_provider_id=provider_id,
                prompt=prompt,
            )

            if not resp or not resp.completion_text:
                logger.warning("[GraphMemory] LLM 返回空响应")
                return None

            rewritten = resp.completion_text.strip()
            logger.debug(f"[GraphMemory] 查询重写: '{query}' -> '{rewritten}'")

            return rewritten

        except Exception as e:
            logger.error(f"[GraphMemory] 查询重写失败: {e}", exc_info=True)
            return None

    def _find_json_blob(self, text: str) -> Optional[str]:
        """从文本中提取 JSON 字符串

        Args:
            text: 包含 JSON 的文本

        Returns:
            JSON 字符串，如果未找到返回 None
        """
        # 尝试直接解析
        text = text.strip()
        if text.startswith("{") and text.endswith("}"):
            return text

        # 尝试查找 JSON 代码块
        json_block_pattern = r"```(?:json)?\s*(\{.*?\})\s*```"
        match = re.search(json_block_pattern, text, re.DOTALL)
        if match:
            return match.group(1)

        # 尝试查找第一个完整的 JSON 对象
        brace_count = 0
        start_idx = -1
        for i, char in enumerate(text):
            if char == "{":
                if brace_count == 0:
                    start_idx = i
                brace_count += 1
            elif char == "}":
                brace_count -= 1
                if brace_count == 0 and start_idx != -1:
                    return text[start_idx : i + 1]

        return None
