import json
from unittest.mock import AsyncMock, MagicMock

import pytest
from core.extractor import ExtractedData, KnowledgeExtractor
from core.prompts import QUERY_REWRITING_PROMPT, SUMMARIZATION_PROMPT

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_context():
    """提供一个 mock 的 AstrBot Context 对象。"""
    context = MagicMock()
    context.get_current_chat_provider_id = AsyncMock(return_value="test_provider")
    context.llm_generate = AsyncMock()
    return context


@pytest.fixture
def extractor(mock_context):
    """提供一个 KnowledgeExtractor 实例。"""
    return KnowledgeExtractor(
        context=mock_context,
        llm_provider_id="default_provider",
        embedding_provider=None,
    )


# ==================== 5. 测试用例 ====================


@pytest.mark.asyncio
async def test_extract_success(extractor, mock_context):
    """测试：成功从文本中提取结构化数据。"""
    # 准备
    text_block = "用户A: 你好. Bot: 你好，有什么可以帮忙的？"
    session_id = "test_session"
    mock_response = {
        "users": [{"id": "user_a", "name": "用户A", "platform": "test"}],
        "entities": [{"name": "你好", "type": "Greeting"}],
        "relations": [],
        "mentions": [],
        "messages": [],
        "sessions": [],
    }
    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = json.dumps(mock_response)
    mock_context.llm_generate.return_value = mock_llm_resp

    # 执行
    result = await extractor.extract(text_block, session_id)

    # 验证
    assert isinstance(result, ExtractedData)
    assert len(result.users) == 1
    assert result.users[0].name == "用户A"
    assert len(result.entities) == 1
    assert result.entities[0].name == "你好"
    mock_context.llm_generate.assert_called_once()


@pytest.mark.asyncio
async def test_extract_with_markdown(extractor, mock_context):
    """测试：LLM 响应被 Markdown 代码块包裹时也能正确解析。"""
    # 准备
    text_block = "用户B: 晚安"
    session_id = "test_session_2"
    mock_response = {"entities": [{"name": "晚安", "type": "Farewell"}]}
    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = f"```json\n{json.dumps(mock_response)}\n```"
    mock_context.llm_generate.return_value = mock_llm_resp

    # 执行
    result = await extractor.extract(text_block, session_id)

    # 验证
    assert result is not None
    assert len(result.entities) == 1
    assert result.entities[0].name == "晚安"


@pytest.mark.asyncio
async def test_extract_empty_or_invalid_json(extractor, mock_context):
    """测试：LLM 返回空响应或无效 JSON 时，应返回 None。"""
    # 准备
    text_block = "一些无关紧要的文本"
    session_id = "test_session_3"

    # 场景 1: 空响应
    mock_context.llm_generate.return_value = None
    result1 = await extractor.extract(text_block, session_id)
    assert result1 is None

    # 场景 2: 无效 JSON
    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = "这不是一个JSON"
    mock_context.llm_generate.return_value = mock_llm_resp
    result2 = await extractor.extract(text_block, session_id)
    assert result2 is None


@pytest.mark.asyncio
async def test_rewrite_query(extractor, mock_context):
    """测试：查询重写功能。"""
    # 准备
    query = "它怎么样？"
    history = (
        "用户A: 我想了解一下关于 AstrBot 的信息。\nBot: 好的，AstrBot 是一个开源项目。"
    )
    rewritten_query = "AstrBot 怎么样？"

    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = rewritten_query
    mock_context.llm_generate.return_value = mock_llm_resp

    # 执行
    result = await extractor.rewrite_query(query, history)

    # 验证
    assert result == rewritten_query
    expected_prompt = QUERY_REWRITING_PROMPT.format(history=history, query=query)
    mock_context.llm_generate.assert_called_with(
        chat_provider_id="default_provider", prompt=expected_prompt
    )


@pytest.mark.asyncio
async def test_summarize(extractor, mock_context):
    """测试：文本摘要功能。"""
    # 准备
    text_block = "这是一段非常非常长的对话历史..."
    summary = "对话核心是关于..."

    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = summary
    mock_context.llm_generate.return_value = mock_llm_resp

    # 执行
    result = await extractor.summarize(text_block)

    # 验证
    assert result == summary
    expected_prompt = SUMMARIZATION_PROMPT.format(text=text_block)
    mock_context.llm_generate.assert_called_with(
        chat_provider_id="default_provider", prompt=expected_prompt
    )


@pytest.mark.asyncio
async def test_extract_no_provider(extractor, mock_context):
    """测试：在没有可用 LLM Provider 时，提取操作应失败。"""
    # 准备
    extractor.llm_provider_id = None
    mock_context.get_current_chat_provider_id.return_value = None

    # 执行
    result = await extractor.extract("一些文本", "some_session")

    # 验证
    assert result is None
    mock_context.llm_generate.assert_not_called()


@pytest.mark.asyncio
async def test_extract_empty_text(extractor):
    """测试：当输入文本为空或只有空白时，提取应返回 None。"""
    result = await extractor.extract("   ", "session_id")
    assert result is None


@pytest.mark.asyncio
async def test_extract_json_decode_error(extractor, mock_context):
    """测试：当 LLM 响应是无效 JSON 时，提取应返回 None。"""
    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = "{'key': 'value'"  # 无效 JSON
    mock_context.llm_generate.return_value = mock_llm_resp

    result = await extractor.extract("some text", "session_id")
    assert result is None


@pytest.mark.asyncio
async def test_extract_llm_exception(extractor, mock_context):
    """测试：当 LLM 调用抛出异常时，提取应返回 None。"""
    mock_context.llm_generate.side_effect = Exception("LLM is down")
    result = await extractor.extract("some text", "session_id")
    assert result is None


@pytest.mark.asyncio
async def test_rewrite_query_no_history(extractor):
    """测试：当没有历史记录时，查询重写应返回原始查询。"""
    query = "它怎么样？"
    result = await extractor.rewrite_query(query, "")
    assert result == query


@pytest.mark.asyncio
async def test_rewrite_query_no_provider(extractor, mock_context):
    """测试：当没有可用的 provider 时，查询重写应返回原始查询。"""
    extractor.llm_provider_id = None
    mock_context.get_current_chat_provider_id.return_value = None
    query = "它怎么样？"
    history = "Some history"
    result = await extractor.rewrite_query(query, history)
    assert result == query


@pytest.mark.asyncio
async def test_rewrite_query_exception(extractor, mock_context):
    """测试：当查询重写时 LLM 抛出异常，应返回原始查询。"""
    mock_context.llm_generate.side_effect = Exception("LLM error")
    query = "它怎么样？"
    history = "Some history"
    result = await extractor.rewrite_query(query, history)
    assert result == query


@pytest.mark.asyncio
async def test_summarize_no_provider(extractor, mock_context):
    """测试：当没有可用的 provider 时，摘要应返回 None。"""
    extractor.llm_provider_id = None
    mock_context.get_current_chat_provider_id.return_value = None
    result = await extractor.summarize("long text")
    assert result is None


@pytest.mark.asyncio
async def test_summarize_exception(extractor, mock_context):
    """测试：当摘要生成时 LLM 抛出异常，应返回 None。"""
    mock_context.llm_generate.side_effect = Exception("LLM error")
    result = await extractor.summarize("long text")
    assert result is None


@pytest.mark.asyncio
async def test_summarize_empty_response(extractor, mock_context):
    """测试：当 LLM 为摘要返回空响应时，应返回 None。"""
    mock_llm_resp = MagicMock()
    mock_llm_resp.completion_text = ""
    mock_context.llm_generate.return_value = mock_llm_resp
    result = await extractor.summarize("long text")
    assert result is None


def test_set_embedding_provider(extractor):
    """测试：set_embedding_provider 方法能正确设置 provider。"""
    mock_provider = MagicMock()
    extractor.set_embedding_provider(mock_provider)
    assert extractor.embedding_provider == mock_provider
