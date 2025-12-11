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
# 创建独立的 mock 模块以解决 'is not a package' 问题
mock_astrbot = MagicMock()
mock_api = MagicMock()
mock_core = MagicMock()

# 将顶层包注册到 sys.modules
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
sys.modules["astrbot.core.message.message_event_result"] = (
    mock_core_message_event_result
)

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

# Mock monitoring_service 模块和单例对象
mock_monitoring_module = MagicMock()
mock_monitoring_service_instance = MagicMock()
mock_monitoring_service_instance.add_task = AsyncMock()
mock_monitoring_service_instance.add_message = AsyncMock()
mock_monitoring_module.monitoring_service = mock_monitoring_service_instance
sys.modules["core.monitoring_service"] = mock_monitoring_module

# ==================== 3. 导入业务代码 ====================
from core.plugin_service import PluginService  # noqa: E402

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_context():
    """提供一个 mock 的 AstrBot Context 对象。"""
    context = MagicMock()
    context.conversation_manager.get_curr_conversation_id = AsyncMock(
        return_value="conv1"
    )
    context.conversation_manager.get_conversation = AsyncMock()
    return context


@pytest.fixture
def mock_config():
    """提供一个默认的插件配置字典。"""
    return {
        "enable_query_rewriting": True,
        "recall_vector_top_k": 3,
        "recall_keyword_top_k": 2,
        "recall_max_items": 5,
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
    # 实例化 mocks
    mock_graph_engine = MockGraphEngine.return_value
    mock_extractor = MockExtractor.return_value
    mock_buffer_manager = MockBufferManager.return_value

    # 设置 mock 方法
    mock_graph_engine.search = AsyncMock(return_value="[图记忆上下文]\n- (A)-[is]->(B)")
    mock_graph_engine.add_user = AsyncMock()
    mock_graph_engine.add_entity = AsyncMock()
    mock_graph_engine.add_relation = AsyncMock()
    mock_extractor.rewrite_query = AsyncMock(return_value="rewritten_query")
    mock_buffer_manager.add_user_message = AsyncMock()
    mock_buffer_manager.add_bot_message = AsyncMock()

    # 创建 PluginService 实例
    plugin_data_path = Path("/tmp/fake_path")
    service_instance = PluginService(mock_context, mock_config, plugin_data_path)

    # 手动替换 mock 实例
    service_instance.graph_engine = mock_graph_engine
    service_instance.extractor = mock_extractor
    service_instance.buffer_manager = mock_buffer_manager

    # 模拟 embedding provider
    service_instance.embedding_provider = MagicMock()
    service_instance.embedding_provider.embed = AsyncMock(return_value=[0.1, 0.2, 0.3])

    return service_instance


# ==================== 5. 测试用例 ====================


@pytest.mark.asyncio
async def test_inject_memory_with_rewriting(service):
    """测试：在启用查询重写的情况下成功注入记忆。"""
    # 准备
    event = MagicMock()
    event.unified_msg_origin = "test_session"
    event.message_str = "原始查询"

    req = MagicMock()
    req.system_prompt = "原始系统提示."

    # 模拟 get_recent_history 返回一些历史记录
    with patch.object(
        service, "_get_recent_history", new=AsyncMock(return_value="历史记录...")
    ):
        # 执行
        await service.inject_memory(event, req)

    # 验证
    # 1. 查询被重写
    service.extractor.rewrite_query.assert_called_once()
    # 2. 使用重写后的查询进行 embedding
    service.embedding_provider.embed.assert_called_with("rewritten_query")
    # 3. 使用 embedding 和重写后的查询进行图搜索
    service.graph_engine.search.assert_called_once()
    # 4. 系统提示被成功注入
    assert "[图记忆上下文]" in req.system_prompt
    assert "原始系统提示." in req.system_prompt


@pytest.mark.asyncio
async def test_inject_memory_no_provider(service):
    """测试：在没有 embedding provider 时跳过记忆注入。"""
    # 准备
    service.embedding_provider = None
    event = MagicMock()
    req = MagicMock()
    req.system_prompt = "原始系统提示."

    # 执行
    await service.inject_memory(event, req)

    # 验证
    service.graph_engine.search.assert_not_called()
    assert req.system_prompt == "原始系统提示."


@pytest.mark.asyncio
async def test_inject_memory_no_results(service):
    """测试：图搜索没有返回结果时，不修改系统提示。"""
    # 准备
    service.graph_engine.search.return_value = ""  # 模拟空搜索结果
    event = MagicMock()
    req = MagicMock()
    req.system_prompt = "原始系统提示."

    # 执行
    await service.inject_memory(event, req)

    # 验证
    service.graph_engine.search.assert_called_once()
    assert req.system_prompt == "原始系统提示."


@pytest.mark.asyncio
async def test_process_messages(service):
    """测试：用户和机器人的消息被正确添加到缓冲区。"""
    # 准备
    user_event = MagicMock()
    bot_event = MagicMock()
    bot_resp = MagicMock()
    bot_resp.completion_text = "机器人回复"

    # 模拟 _get_persona_id
    with patch.object(
        service, "_get_persona_id", new=AsyncMock(return_value="test_persona")
    ):
        # 执行
        await service.process_user_message(user_event)
        await service.process_bot_message(bot_event, bot_resp)

    # 验证
    service.buffer_manager.add_user_message.assert_called_once_with(
        user_event, "test_persona"
    )
    service.buffer_manager.add_bot_message.assert_called_once_with(
        bot_event, "test_persona", content="机器人回复"
    )


@pytest.mark.asyncio
async def test_handle_buffer_flush(service):
    """测试：缓冲区刷新时，成功提取知识并存入图数据库。"""
    # 准备
    session_id = "flush_session"
    text = "对话内容"
    persona_id = "default"

    mock_extracted_data = MagicMock()
    mock_extracted_data.users = [MagicMock()]
    mock_extracted_data.entities = [MagicMock()]
    mock_extracted_data.relations = [MagicMock()]
    mock_extracted_data.messages = []
    mock_extracted_data.sessions = []
    mock_extracted_data.mentions = []

    service.extractor.extract = AsyncMock(return_value=mock_extracted_data)

    # 执行
    await service._handle_buffer_flush(
        session_id, text, is_group=False, persona_id=persona_id
    )

    # 验证
    service.extractor.extract.assert_called_once_with(
        text_block=text, session_id=session_id
    )
    service.graph_engine.add_user.assert_called()
    service.graph_engine.add_entity.assert_called()
    service.graph_engine.add_relation.assert_called()


@pytest.mark.asyncio
async def test_get_persona_id(service, mock_context):
    """测试：根据配置和会话状态正确获取 Persona ID。"""
    # 场景 1: 启用隔离，成功获取到 persona
    service.enable_persona_isolation = True
    mock_conv = MagicMock()
    mock_conv.persona_id = "super_maid"
    mock_context.conversation_manager.get_conversation.return_value = mock_conv

    result1 = await service._get_persona_id(MagicMock())
    assert result1 == "super_maid"

    # 场景 2: 禁用隔离，应返回默认 persona
    service.enable_persona_isolation = False
    result2 = await service._get_persona_id(MagicMock())
    assert result2 == service.DEFAULT_PERSONA_ID

    # 场景 3: 启用隔离，但获取失败，应返回默认 persona
    service.enable_persona_isolation = True
    mock_context.conversation_manager.get_conversation.return_value = None
    result3 = await service._get_persona_id(MagicMock())
    assert result3 == service.DEFAULT_PERSONA_ID
