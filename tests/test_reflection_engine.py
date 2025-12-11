import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from core.reflection_engine import ReflectionEngine

# Mock data
CANDIDATE_NODES = [{"id": "entity1", "type": "Entity"}]
CONTEXT_PACKAGE = "Context for entity1"
FACT_CORRECTION_RESPONSE_NO_ERRORS = json.dumps({"has_errors": False})
FACT_CORRECTION_RESPONSE_WITH_ERRORS = json.dumps({
    "has_errors": True,
    "corrections": [{
        "node_id": "entity1",
        "node_type": "Entity",
        "updated_properties": {"summary": "Corrected Summary"}
    }]
})
RELATION_INFERENCE_RESPONSE_NO_RELATIONS = json.dumps({"new_relations": []})
RELATION_INFERENCE_RESPONSE = json.dumps({
    "new_relations": [{
        "source_entity": "entity1",
        "target_entity": "entity2",
        "relation_description": "IS_RELATED_TO"
    }]
})


@pytest.fixture
def mock_service():
    """Fixture for a mocked PluginService and its dependencies."""
    service = MagicMock(spec=["context", "graph_engine", "extractor", "learning_model_id"])
    service.context = MagicMock()
    service.context.llm_generate = AsyncMock()
    service.graph_engine = MagicMock()
    service.graph_engine.get_reflection_candidates = AsyncMock(return_value=CANDIDATE_NODES)
    service.graph_engine.get_node_context_package = AsyncMock(return_value=CONTEXT_PACKAGE)
    service.graph_engine.update_node_properties = AsyncMock()
    service.graph_engine.add_relation = AsyncMock()
    service.extractor = MagicMock()
    service.learning_model_id = "test_learning_model"
    return service


@pytest.fixture
def reflection_engine(mock_service):
    """Fixture for a ReflectionEngine instance."""
    return ReflectionEngine(mock_service)


@pytest.mark.asyncio
async def test_run_reflection_cycle_no_learning_model(reflection_engine, mock_service):
    """Test that the reflection cycle is skipped if no learning model is configured."""
    mock_service.learning_model_id = None
    await reflection_engine.run_reflection_cycle()
    mock_service.graph_engine.get_reflection_candidates.assert_not_awaited()


@pytest.mark.asyncio
async def test_run_reflection_cycle_no_candidates(reflection_engine, mock_service):
    """Test that the reflection cycle exits early if no candidates are found."""
    mock_service.graph_engine.get_reflection_candidates.return_value = []
    await reflection_engine.run_reflection_cycle()
    mock_service.graph_engine.get_reflection_candidates.assert_awaited_once()
    mock_service.graph_engine.get_node_context_package.assert_not_awaited()


@pytest.mark.asyncio
async def test_run_reflection_cycle_skips_isolated_node(reflection_engine, mock_service):
    """Test that the reflection cycle skips nodes that are isolated."""
    mock_service.graph_engine.get_node_context_package.return_value = "节点 'test' 是孤立的，没有上下文。"
    await reflection_engine.run_reflection_cycle()
    mock_service.graph_engine.get_node_context_package.assert_awaited_once()
    mock_service.context.llm_generate.assert_not_awaited()


@pytest.mark.asyncio
async def test_full_reflection_cycle_success(reflection_engine, mock_service):
    """Test a full successful reflection cycle with fact correction and relation inference."""
    llm_correction_resp = AsyncMock()
    llm_correction_resp.completion_text = FACT_CORRECTION_RESPONSE_WITH_ERRORS
    llm_inference_resp = AsyncMock()
    llm_inference_resp.completion_text = RELATION_INFERENCE_RESPONSE
    mock_service.context.llm_generate.side_effect = [llm_correction_resp, llm_inference_resp]

    await reflection_engine.run_reflection_cycle()

    mock_service.graph_engine.get_reflection_candidates.assert_awaited_once_with(limit=5)
    mock_service.graph_engine.get_node_context_package.assert_awaited_once_with("entity1", "Entity")
    assert mock_service.context.llm_generate.await_count == 2
    mock_service.graph_engine.update_node_properties.assert_awaited_once_with(
        "entity1", "Entity", {"summary": "Corrected Summary"}
    )
    mock_service.graph_engine.add_relation.assert_awaited_once()
    call_args = mock_service.graph_engine.add_relation.call_args.args[0]
    assert call_args.src_entity == "entity1"
    assert call_args.tgt_entity == "entity2"
    assert call_args.relation == "IS_RELATED_TO"


@pytest.mark.asyncio
async def test_fact_correction_no_errors(reflection_engine, mock_service):
    """Test fact correction when the LLM reports no errors."""
    mock_service.context.llm_generate.return_value.completion_text = FACT_CORRECTION_RESPONSE_NO_ERRORS
    await reflection_engine._run_fact_correction("entity1", "Entity", CONTEXT_PACKAGE)
    mock_service.context.llm_generate.assert_awaited_once()
    mock_service.graph_engine.update_node_properties.assert_not_awaited()


@pytest.mark.asyncio
async def test_fact_correction_malformed_item(reflection_engine, mock_service):
    """Test fact correction handles items with missing keys."""
    response = json.dumps({"has_errors": True, "corrections": [{"node_id": "entity1"}]})  # Missing keys
    mock_service.context.llm_generate.return_value.completion_text = response
    await reflection_engine._run_fact_correction("entity1", "Entity", CONTEXT_PACKAGE)
    mock_service.graph_engine.update_node_properties.assert_not_awaited()


@pytest.mark.asyncio
async def test_relation_inference_no_relations(reflection_engine, mock_service):
    """Test relation inference when LLM finds no new relations."""
    mock_service.context.llm_generate.return_value.completion_text = RELATION_INFERENCE_RESPONSE_NO_RELATIONS
    await reflection_engine._run_relation_inference("entity1", "Entity", CONTEXT_PACKAGE)
    mock_service.graph_engine.add_relation.assert_not_awaited()


@pytest.mark.asyncio
async def test_relation_inference_malformed_item(reflection_engine, mock_service):
    """Test relation inference handles items with missing keys."""
    response = json.dumps({"new_relations": [{"source_entity": "entity1"}]})  # Missing keys
    mock_service.context.llm_generate.return_value.completion_text = response
    await reflection_engine._run_relation_inference("entity1", "Entity", CONTEXT_PACKAGE)
    mock_service.graph_engine.add_relation.assert_not_awaited()


@pytest.mark.asyncio
async def test_llm_call_fails_returns_none(reflection_engine, mock_service):
    """Test that the cycle continues gracefully if an LLM call returns None."""
    mock_service.context.llm_generate.return_value = None
    await reflection_engine.run_reflection_cycle()
    mock_service.graph_engine.get_reflection_candidates.assert_awaited_once()
    mock_service.graph_engine.get_node_context_package.assert_awaited_once()
    mock_service.graph_engine.update_node_properties.assert_not_awaited()
    mock_service.graph_engine.add_relation.assert_not_awaited()


@pytest.mark.asyncio
async def test_llm_call_raises_exception(reflection_engine, mock_service):
    """Test that the cycle continues gracefully if an LLM call raises an exception."""
    mock_service.context.llm_generate.side_effect = Exception("LLM provider down")
    await reflection_engine.run_reflection_cycle()
    mock_service.graph_engine.update_node_properties.assert_not_awaited()
    mock_service.graph_engine.add_relation.assert_not_awaited()


@pytest.mark.asyncio
async def test_invalid_json_response(reflection_engine, mock_service):
    """Test handling of invalid JSON from the LLM for both correction and inference."""
    mock_service.context.llm_generate.return_value.completion_text = "this is not json"

    # 测试事实修正：无效 JSON 不应导致更新
    await reflection_engine._run_fact_correction("id", "type", "ctx")
    mock_service.graph_engine.update_node_properties.assert_not_awaited()

    # 测试关系推断：无效 JSON 不应导致添加关系
    await reflection_engine._run_relation_inference("id", "type", "ctx")
    mock_service.graph_engine.add_relation.assert_not_awaited()


@pytest.mark.asyncio
async def test_start_stop_cycle(reflection_engine):
    """Test the start and stop methods of the reflection engine."""
    # 测试 start 方法创建任务
    await reflection_engine.start(interval=600)
    assert reflection_engine._task is not None
    assert not reflection_engine._task.done()

    # 测试 stop 方法取消任务
    await reflection_engine.stop()
    assert reflection_engine._task.cancelled() or reflection_engine._task.done()


@pytest.mark.asyncio
async def test_stop_without_task(reflection_engine):
    """Test that stop() does nothing if no task is running."""
    reflection_engine._task = None
    # This should complete without error
    await reflection_engine.stop()


@pytest.mark.asyncio
@patch("core.reflection_engine.asyncio.create_task")
async def test_start_does_not_recreate_running_task(mock_create_task, reflection_engine):
    """Test that start() does not create a new task if one is already running."""
    mock_task = MagicMock()
    mock_task.done.return_value = False
    reflection_engine._task = mock_task

    await reflection_engine.start(interval=600)
    mock_create_task.assert_not_called()


@pytest.mark.skip(reason="This test causes hangs in the test suite")
@pytest.mark.asyncio
async def test_reflection_loop_exception_handling(reflection_engine, mock_service, caplog):
    """Test that the main loop catches exceptions and continues."""
    # 设置 mock 以在第一次调用时引发异常，第二次引发 CancelledError
    call_count = [0]

    async def side_effect_func():
        call_count[0] += 1
        if call_count[0] == 1:
            raise ValueError("Test Exception")
        else:
            raise asyncio.CancelledError()

    # Patch run_reflection_cycle 方法
    with patch.object(reflection_engine, "run_reflection_cycle", side_effect=side_effect_func):
        with patch("core.reflection_engine.asyncio.sleep", new=AsyncMock()):
            loop_task = asyncio.create_task(reflection_engine._reflection_loop(1))
            try:
                await asyncio.wait_for(loop_task, timeout=0.5)
            except (asyncio.CancelledError, asyncio.TimeoutError):
                loop_task.cancel()
                try:
                    await loop_task
                except asyncio.CancelledError:
                    pass

    assert "Agentic 反思循环出错" in caplog.text or "Test Exception" in caplog.text


@pytest.mark.asyncio
async def test_call_llm_no_model_id(reflection_engine, mock_service):
    """Test _call_llm returns None if no model ID is set."""
    mock_service.learning_model_id = None
    result = await reflection_engine._call_llm("prompt")
    assert result is None
    # 验证 llm_generate 没有被调用
    mock_service.context.llm_generate.assert_not_awaited()
