"""工具层

包含:
- prompts: Prompt 模板
"""

from .prompts import EXTRACTION_PROMPT, QUERY_REWRITING_PROMPT

__all__ = [
    "EXTRACTION_PROMPT",
    "QUERY_REWRITING_PROMPT",
]
