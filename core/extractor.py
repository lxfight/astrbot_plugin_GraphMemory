import json
import logging
import time
from dataclasses import dataclass
from typing import Literal

from astrbot.api.star import Context

from .prompts import GROUP_CHAT_PROMPT, PRIVATE_CHAT_PROMPT, SEARCH_KEYWORDS_PROMPT

logger = logging.getLogger("GraphMemory.Extractor")

try:
    import jieba
    import jieba.analyse

    JIEBA_AVAILABLE = True
except ImportError:
    JIEBA_AVAILABLE = False
    logger.warning(
        "jieba not installed. Local keyword extraction will fallback to simple split."
    )


@dataclass
class Triplet:
    src: str
    rel: str
    tgt: str
    src_type: str = "entity"
    tgt_type: str = "entity"
    weight: float = 1.0
    confidence: float = 1.0
    source_user: str = "unknown"  # Who provided this info


class KnowledgeExtractor:
    def __init__(
        self,
        context: Context,
        provider_id: str | None = None,
        keyword_mode: Literal["local", "llm"] = "local",
        keyword_provider_id: str | None = None,
    ):
        self.context = context
        self.provider_id = provider_id
        self.keyword_mode = keyword_mode
        self.keyword_provider_id = keyword_provider_id

    async def extract(self, text_block: str, is_group: bool = False) -> list[Triplet]:
        """
        从文本块中提取三元组
        """
        if not text_block.strip():
            return []

        start_time = time.time()
        logger.debug(
            f"[GraphMemory] Starting extraction. Group: {is_group}, Length: {len(text_block)}"
        )

        if is_group:
            prompt = GROUP_CHAT_PROMPT.format(text=text_block)
        else:
            prompt = PRIVATE_CHAT_PROMPT.format(text=text_block)

        triplets = await self._call_llm(prompt)

        logger.debug(
            f"[GraphMemory] Extraction finished in {time.time() - start_time:.2f}s. Found {len(triplets)} triplets."
        )
        return triplets

    async def _call_llm(self, prompt: str) -> list[Triplet]:
        """
        调用 LLM 并解析 JSON
        """
        try:
            if not self.provider_id:
                logger.warning(
                    "[GraphMemory] No provider_id configured for extraction."
                )
                return []

            start_req = time.time()
            resp = await self.context.llm_generate(
                chat_provider_id=self.provider_id, prompt=prompt
            )
            logger.debug(
                f"[GraphMemory] LLM request finished in {time.time() - start_req:.2f}s"
            )

            if not resp or not resp.completion_text:
                logger.warning("[GraphMemory] LLM returned empty response.")
                return []

            raw_text = resp.completion_text

            # 尝试解析 JSON
            start = raw_text.find("[")
            end = raw_text.rfind("]")

            if start == -1 or end == -1:
                logger.warning(
                    f"[GraphMemory] Failed to find JSON array in response: {raw_text[:100]}..."
                )
                return []

            json_str = raw_text[start : end + 1]
            data = json.loads(json_str)

            triplets = []
            for item in data:
                triplets.append(
                    Triplet(
                        src=item.get("src", ""),
                        rel=item.get("rel", ""),
                        tgt=item.get("tgt", ""),
                        confidence=item.get("confidence", 1.0),
                        source_user=item.get("source_user", "unknown"),
                    )
                )

            return triplets

        except json.JSONDecodeError:
            logger.error(f"[GraphMemory] JSON Parse Error. Raw text: {raw_text}")
            return []
        except Exception as e:
            logger.error(f"[GraphMemory] LLM extraction error: {e}", exc_info=True)
            return []

    async def extract_keywords(self, query: str) -> list[str]:
        """
        提取搜索关键词
        """
        start_time = time.time()

        if self.keyword_mode == "local":
            keywords = self._extract_keywords_local(query)
            logger.debug(
                f"[GraphMemory] Local keyword extraction: {keywords} (Time: {time.time() - start_time:.4f}s)"
            )
            return keywords
        else:
            keywords = await self._extract_keywords_llm(query)
            logger.debug(
                f"[GraphMemory] LLM keyword extraction: {keywords} (Time: {time.time() - start_time:.2f}s)"
            )
            return keywords

    def _extract_keywords_local(self, query: str) -> list[str]:
        """
        使用 jieba 或简单分割提取关键词
        """
        if not query.strip():
            return []

        if JIEBA_AVAILABLE:
            # 使用 TF-IDF 提取关键词，取前 5 个
            keywords = jieba.analyse.extract_tags(query, topK=5)
            # 如果提取结果为空（例如全是停用词或标点），尝试使用 textrank
            if not keywords:
                keywords = jieba.analyse.textrank(query, topK=5)

            # 如果依然为空，回退到分词
            if not keywords:
                seg_list = jieba.cut(query)
                # 过滤掉长度小于2的词（通常是单字或无意义词），保留英文和数字
                keywords = [w for w in seg_list if len(w) > 1 or w.isalnum()]

            return keywords[:5]
        else:
            # 回退策略：简单按空格分割，取前5个长于2的词
            return [w for w in query.split() if len(w) > 1][:5]

    async def _extract_keywords_llm(self, query: str) -> list[str]:
        """
        使用 LLM 提取关键词
        """
        provider_id = self.keyword_provider_id or self.provider_id
        if not provider_id:
            logger.warning(
                "[GraphMemory] No provider available for LLM keyword extraction. Fallback to local."
            )
            return self._extract_keywords_local(query)

        prompt = SEARCH_KEYWORDS_PROMPT.format(query=query)

        try:
            resp = await self.context.llm_generate(
                chat_provider_id=provider_id, prompt=prompt
            )
            if resp and resp.completion_text:
                text = resp.completion_text.strip()
                text = text.replace("```", "").strip()
                keywords = [k.strip() for k in text.split(",") if k.strip()]
                return keywords
        except Exception as e:
            logger.error(f"[GraphMemory] LLM Keyword extraction error: {e}")

        return []
