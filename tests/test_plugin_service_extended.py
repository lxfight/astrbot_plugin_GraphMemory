import asyncio
import json
import os
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

# ==================== 1. 修复导入路径 ====================
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ==================== 2. Mock astrbot 和其他依赖 ====================
mock_astrbot = MagicMock()
mock_api = MagicMock()
mock_core = MagicMock()

sys.modules["astrbot"] = mock_astrbot
sys.modules["astrbot.api"] = mock_api
sys.modules["astrbot.core"] = mock_core

# 模拟 astrbot.api 的子模块
mock_api_event = MagicMock()
mock_api_provider = MagicMock()
mock_api_star = MagicMock()
mock_api_message_components = MagicMock()
sys.modules["astrbot.api.event"] = mock_api_event
sys.modules["astrbot.api.provider"] = mock_api_provider
sys.modules["astrbot.api.star"] = mock_api_star
sys.modules["astrbot.api.message_components"] = mock_api_message_components

# 模拟 astrbot.core 的子模块
mock_core_message = MagicMock()
mock_core_message_event_result = MagicMock()
sys.modules["astrbot.core.message"] = mock_core_message
sys.modules["astrbot.core.message.message_event_result"] = mock_core_message_event_result

# 在 mock 模块上设置预期的属性
mock_api.logger = MagicMock()
mock_api_event.AstrMessageEvent = MagicMock()
mock_api_provider.LLMResponse = MagicMock()
mock_api_provider.ProviderRequest = MagicMock()
mock_api_star.Context = MagicMock()
mock_core_message_event_result.MessageEventResult = MagicMock()

# Mock 核心组件 - 不要 mock reflection_engine，因为会影响其他测试
sys.modules["core.graph_engine"] = MagicMock()
sys.modules["core.extractor"] = MagicMock()
sys.modules["core.buffer_manager"] = MagicMock()
sys.modules["core.monitoring_service"] = MagicMock()

# ==================== 3. 导入业务代码 ====================
from core.plugin_service import PluginService  # noqa: E402

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_context():
    """提供一个 mock 的 AstrBot Context 对象。"""
    context = MagicMock()
    context.conversation_manager.get_curr_conversation_id = AsyncMock(return_value="conv1")
    context.conversation_manager.get_conversation = AsyncMock()
    context.provider_manager.get_provider_by_id = MagicMock(return_value=MagicMock())
    return context


@pytest.fixture
def mock_config():
    """提供一个默认的插件配置字典。"""
    return {
        "enable_query_rewriting": True,
        "recall_vector_top_k": 3,
        "recall_keyword_top_k": 2,
        "recall_max_items": 5,
        "enable_reflection": False,
        "embedding_provider_id": "test_embedding",
        "summarization_provider_id": "test_summarization",
        "prune_interval": 3600,
        "max_global_nodes": 10000,
        "consolidation_threshold": 50,
    }


@pytest.fixture
@patch("core.plugin_service.GraphEngine")
@patch("core.plugin_service.KnowledgeExtractor")
@patch("core.plugin_service.BufferManager")
@patch("core.plugin_service.ReflectionEngine")
def service(
    MockReflectionEngine,
    MockBufferManager,
    MockExtractor,
    MockGraphEngine,
    mock_context,
    mock_config,
):
    """提供一个带有 mock 依赖的 PluginService 实例。"""
    mock_graph_engine = MockGraphEngine.return_value
    mock_extractor = MockExtractor.return_value
    mock_buffer_manager = MockBufferManager.return_value
    mock_reflection_engine = MockReflectionEngine.return_value

    # 设置 mock 方法
    mock_graph_engine.search = AsyncMock(return_value="[图记忆上下文]\n- (A)-[is]->(B)")
    mock_graph_engine.prune_graph = AsyncMock(return_value=5)
    mock_graph_engine.find_sessions_for_consolidation = AsyncMock(return_value=["session1"])
    mock_graph_engine.get_messages_for_consolidation = MagicMock(
        return_value=(["msg1", "msg2"], "message text", ["user1"])
    )
    mock_graph_engine.consolidate_memory = AsyncMock()
    mock_graph_engine.close = MagicMock()

    mock_extractor.extract = AsyncMock()
    mock_extractor.summarize = AsyncMock(return_value="Summary text")

    mock_buffer_manager.shutdown = AsyncMock()
    mock_reflection_engine.start = AsyncMock()
    mock_reflection_engine.stop = AsyncMock()

    # 创建 PluginService 实例
    plugin_data_path = Path("/tmp/fake_path")
    service_instance = PluginService(mock_context, mock_config, plugin_data_path)

    # 手动替换 mock 实例
    service_instance.graph_engine = mock_graph_engine
    service_instance.extractor = mock_extractor
    service_instance.buffer_manager = mock_buffer_manager
    service_instance.reflection_engine = mock_reflection_engine

    # 模拟 embedding provider
    service_instance.embedding_provider = MagicMock()
    service_instance.embedding_provider.embed = AsyncMock(return_value=[0.1, 0.2, 0.3])

    return service_instance


# ==================== 5. 生命周期测试 ====================


@pytest.mark.asyncio
async def test_start_with_embedding_provider(service, mock_context):
    """测试：start 方法成功获取 embedding provider。"""
    # 准备
    mock_provider = MagicMock()
    mock_provider.embed = AsyncMock(return_value=[0.1] * 128)
    mock_context.provider_manager.get_provider_by_id.return_value = mock_provider

    # 执行
    await service.start()

    # 验证
    mock_context.provider_manager.get_provider_by_id.assert_called_with("test_embedding")
    assert service.embedding_provider == mock_provider


@pytest.mark.asyncio
async def test_start_without_embedding_provider(service, mock_context):
    """测试：start 方法在没有 embedding provider 时记录警告。"""
    # 准备
    service.embedding_provider_id = None

    # 执行
    await service.start()

    # 验证
    mock_context.provider_manager.get_provider_by_id.assert_not_called()


@pytest.mark.asyncio
async def test_start_with_reflection_enabled(service):
    """测试：start 方法在启用反思时启动反思引擎。"""
    # 准备
    service.enable_reflection = True
    service.reflection_interval = 7200

    # 执行
    await service.start()

    # 验证
    service.reflection_engine.start.assert_called_once_with(7200)


@pytest.mark.asyncio
async def test_shutdown(service):
    """测试：shutdown 方法正确清理所有组件。"""
    # 准备 - 创建一个真实的任务而不是 AsyncMock
    async def dummy_task():
        try:
            await asyncio.sleep(100)
        except asyncio.CancelledError:
            pass

    service._maintenance_task = asyncio.create_task(dummy_task())

    # 执行
    await service.shutdown()

    # 验证
    assert service._maintenance_task.cancelled()
    service.buffer_manager.shutdown.assert_called_once()
    service.reflection_engine.stop.assert_called_once()
    service.graph_engine.close.assert_called_once()


# ==================== 6. 维护循环测试 ====================


@pytest.mark.asyncio
async def test_run_consolidation_cycle_success(service):
    """测试：成功执行记忆巩固周期。"""
    # 执行
    await service._run_consolidation_cycle()

    # 验证
    service.graph_engine.find_sessions_for_consolidation.assert_called_once_with(50)
    service.extractor.summarize.assert_called_once()
    service.graph_engine.consolidate_memory.assert_called_once()


@pytest.mark.asyncio
async def test_run_consolidation_cycle_no_sessions(service):
    """测试：没有需要巩固的会话时跳过。"""
    # 准备
    service.graph_engine.find_sessions_for_consolidation.return_value = []

    # 执行
    await service._run_consolidation_cycle()

    # 验证
    service.extractor.summarize.assert_not_called()
    service.graph_engine.consolidate_memory.assert_not_called()


@pytest.mark.asyncio
async def test_run_consolidation_cycle_no_messages(service):
    """测试：会话没有消息时跳过巩固。"""
    # 准备
    service.graph_engine.get_messages_for_consolidation.return_value = None

    # 执行
    await service._run_consolidation_cycle()

    # 验证
    service.extractor.summarize.assert_not_called()


@pytest.mark.asyncio
async def test_run_consolidation_cycle_with_custom_provider(service):
    """测试：使用自定义 summarization provider。"""
    # 准备
    service.summarization_provider_id = "custom_provider"

    # 执行
    await service._run_consolidation_cycle()

    # 验证
    service.extractor.summarize.assert_called_once()
    call_args = service.extractor.summarize.call_args
    assert call_args[1]["provider_id"] == "custom_provider"


# ==================== 7. 历史获取测试 ====================


@pytest.mark.asyncio
async def test_get_recent_history_success(service, mock_context):
    """测试：成功获取最近的对话历史。"""
    # 准备
    mock_conversation = MagicMock()
    mock_conversation.history = json.dumps([
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there"}
    ])
    mock_context.conversation_manager.get_conversation.return_value = mock_conversation

    # 执行
    result = await service._get_recent_history("session1", limit=5)

    # 验证
    assert "user: Hello" in result
    assert "assistant: Hi there" in result


@pytest.mark.asyncio
async def test_get_recent_history_no_conversation(service, mock_context):
    """测试：没有对话时返回空字符串。"""
    # 准备
    mock_context.conversation_manager.get_curr_conversation_id.return_value = None

    # 执行
    result = await service._get_recent_history("session1")

    # 验证
    assert result == ""


@pytest.mark.asyncio
async def test_get_recent_history_empty_history(service, mock_context):
    """测试：对话历史为空时返回空字符串。"""
    # 准备
    mock_conversation = MagicMock()
    mock_conversation.history = None
    mock_context.conversation_manager.get_conversation.return_value = mock_conversation

    # 执行
    result = await service._get_recent_history("session1")

    # 验证
    assert result == ""


@pytest.mark.asyncio
async def test_get_recent_history_with_complex_content(service, mock_context):
    """测试：处理复杂的消息内容（列表格式）。"""
    # 准备
    mock_conversation = MagicMock()
    mock_conversation.history = json.dumps([
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Hello"},
                {"type": "image", "url": "http://example.com/image.jpg"}
            ]
        },
        {"role": "assistant", "content": "Hi"}
    ])
    mock_context.conversation_manager.get_conversation.return_value = mock_conversation

    # 执行
    result = await service._get_recent_history("session1")

    # 验证
    assert "user: Hello" in result
    assert "assistant: Hi" in result


@pytest.mark.asyncio
async def test_get_recent_history_with_limit(service, mock_context):
    """测试：限制返回的历史消息数量。"""
    # 准备
    messages = [{"role": "user", "content": f"Message {i}"} for i in range(20)]
    mock_conversation = MagicMock()
    mock_conversation.history = json.dumps(messages)
    mock_context.conversation_manager.get_conversation.return_value = mock_conversation

    # 执行
    result = await service._get_recent_history("session1", limit=5)

    # 验证 - 应该只包含最近的消息
    assert "Message 19" in result or "Message 18" in result


@pytest.mark.asyncio
async def test_get_recent_history_exception_handling(service, mock_context):
    """测试：获取历史时发生异常返回空字符串。"""
    # 准备
    async def raise_exception(*args, **kwargs):
        raise Exception("Test error")
    mock_context.conversation_manager.get_curr_conversation_id.side_effect = raise_exception

    # 执行
    result = await service._get_recent_history("session1")

    # 验证
    assert result == ""


# ==================== 8. Persona 隔离测试 ====================


@pytest.mark.asyncio
async def test_get_persona_id_with_exception(service, mock_context):
    """测试：获取 persona 时发生异常返回默认值。"""
    # 准备
    service.enable_persona_isolation = True
    async def raise_exception(*args, **kwargs):
        raise Exception("Test error")
    mock_context.conversation_manager.get_curr_conversation_id.side_effect = raise_exception

    event = MagicMock()
    event.unified_msg_origin = "test_session"

    # 执行
    result = await service._get_persona_id(event)

    # 验证
    assert result == service.DEFAULT_PERSONA_ID


@pytest.mark.asyncio
async def test_get_persona_id_with_isolation_exception(service, mock_context):
    """测试：persona_isolation_exceptions 反转隔离行为。"""
    # 准备
    service.enable_persona_isolation = True
    service.persona_isolation_exceptions = {"exception_session"}

    event = MagicMock()
    event.unified_msg_origin = "exception_session"

    # 执行
    result = await service._get_persona_id(event)

    # 验证 - 应该返回默认 persona（因为异常列表反转了行为）
    assert result == service.DEFAULT_PERSONA_ID


# ==================== 9. 缓冲区刷新测试 ====================


@pytest.mark.asyncio
async def test_handle_buffer_flush_skip_group_learning_disabled(service):
    """测试：禁用群聊学习时跳过群聊消息。"""
    # 准备
    service.enable_group_learning = False

    # 执行
    await service._handle_buffer_flush("session1", "text", is_group=True, persona_id="default")

    # 验证
    service.extractor.extract.assert_not_awaited()


@pytest.mark.asyncio
@patch("core.plugin_service.monitoring_service")
async def test_handle_buffer_flush_no_extracted_data(mock_monitoring, service):
    """测试：提取器返回 None 时不进行图操作。"""
    # 准备
    mock_monitoring.add_task = AsyncMock()
    service.extractor.extract.return_value = None

    # 执行
    await service._handle_buffer_flush("session1", "text", is_group=False, persona_id="default")

    # 验证
    service.extractor.extract.assert_called_once()
    mock_monitoring.add_task.assert_called_once()
    # 不应该调用图引擎的添加方法（因为没有数据）


# ==================== 10. 配置测试 ====================


@patch("core.plugin_service.GraphEngine")
def test_plugin_service_default_config(MockGraphEngine, mock_context):
    """测试：PluginService 使用默认配置初始化。"""
    # Mock GraphEngine 以避免文件系统操作
    mock_graph = MagicMock()
    MockGraphEngine.return_value = mock_graph

    service = PluginService(mock_context, {}, Path("/tmp/test"))

    assert service.enable_group_learning is True
    assert service.enable_persona_isolation is True
    assert service.max_global_nodes == 10000
    assert service.prune_interval == 3600
    assert service.enable_reflection is False


@patch("core.plugin_service.GraphEngine")
def test_plugin_service_custom_config(MockGraphEngine, mock_context):
    """测试:PluginService 使用自定义配置初始化。"""
    # Mock GraphEngine 以避免文件系统操作
    mock_graph = MagicMock()
    MockGraphEngine.return_value = mock_graph

    custom_config = {
        "enable_group_learning": False,
        "enable_persona_isolation": False,
        "max_global_nodes": 5000,
        "prune_interval": 1800,
        "enable_reflection": True,
        "reflection_interval": 3600,
    }

    service = PluginService(mock_context, custom_config, Path("/tmp/test"))

    assert service.enable_group_learning is False
    assert service.enable_persona_isolation is False
    assert service.max_global_nodes == 5000
    assert service.prune_interval == 1800
    assert service.enable_reflection is True
    assert service.reflection_interval == 3600
