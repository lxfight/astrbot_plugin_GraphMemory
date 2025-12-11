import json
from unittest.mock import AsyncMock, MagicMock

import pytest
from core.command_handler import CommandHandler

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_service():
    """提供一个 mock 的 PluginService 对象。"""
    service = MagicMock()
    service.graph_engine = MagicMock()
    service.graph_engine.get_graph_statistics = AsyncMock()
    service.graph_engine.migrate_memories = AsyncMock()
    service.graph_engine.delete_node_by_id = AsyncMock()
    service.graph_engine.get_full_graph = AsyncMock()
    return service


@pytest.fixture
def mock_event():
    """提供一个 mock 的 AstrMessageEvent 对象。"""
    event = MagicMock()
    event.unified_msg_origin = "session_123"
    event.plain_result = MagicMock(side_effect=lambda x: x)
    return event


@pytest.fixture
def handler(mock_service):
    """提供一个 CommandHandler 实例。"""
    return CommandHandler(mock_service)


# ==================== 5. 辅助函数 ====================


async def get_async_generator_result(gen):
    """从异步生成器中获取所有结果。"""
    return [item async for item in gen]


# ==================== 6. 测试用例 ====================


@pytest.mark.asyncio
async def test_handle_stat_success(handler, mock_service, mock_event):
    """测试：成功获取并格式化图谱统计信息。"""
    # 准备
    stats = {"node_count": 100, "edge_count": 200}
    mock_service.graph_engine.get_graph_statistics.return_value = stats

    # 执行
    results = await get_async_generator_result(handler.handle_stat(mock_event))

    # 验证
    assert len(results) == 1
    assert "node_count: 100" in results[0]
    assert "edge_count: 200" in results[0]
    mock_service.graph_engine.get_graph_statistics.assert_called_once()


@pytest.mark.asyncio
async def test_handle_stat_failure(handler, mock_service, mock_event):
    """测试：获取统计信息失败时返回错误消息。"""
    # 准备
    mock_service.graph_engine.get_graph_statistics.return_value = None

    # 执行
    results = await get_async_generator_result(handler.handle_stat(mock_event))

    # 验证
    assert results[0] == "获取图谱统计信息失败。"


@pytest.mark.asyncio
async def test_handle_link_session(handler, mock_service, mock_event):
    """测试：成功关联会话记忆。"""
    # 准备
    target_session_id = "session_456"
    mock_service.graph_engine.migrate_memories.return_value = 5

    # 执行
    results = await get_async_generator_result(
        handler.handle_link_session(mock_event, target_session_id)
    )

    # 验证
    assert "成功将 5 条记忆片段" in results[0]
    mock_service.graph_engine.migrate_memories.assert_called_once_with(
        "session_123", target_session_id
    )


@pytest.mark.asyncio
async def test_handle_link_session_to_self(handler, mock_event):
    """测试：不能将记忆关联到当前会话本身。"""
    # 准备
    target_session_id = "session_123"

    # 执行
    results = await get_async_generator_result(
        handler.handle_link_session(mock_event, target_session_id)
    )

    # 验证
    assert results[0] == "不能将记忆关联到同一会话。"


@pytest.mark.asyncio
async def test_handle_forget(handler, mock_service, mock_event):
    """测试：成功忘记一个实体。"""
    # 准备
    entity_name = "旧知识"
    mock_service.graph_engine.delete_node_by_id.return_value = True

    # 执行
    results = await get_async_generator_result(
        handler.handle_forget(mock_event, entity_name=entity_name)
    )

    # 验证
    assert f"已尝试忘记关于 '{entity_name}' 的记忆。" in results[0]
    mock_service.graph_engine.delete_node_by_id.assert_called_once_with(
        entity_name, "Entity"
    )


@pytest.mark.asyncio
async def test_handle_dump(handler, mock_service, mock_event):
    """测试：成功导出当前会话的图数据。"""
    # 准备
    graph_data = {"nodes": [{"id": "a"}], "edges": []}
    mock_service.graph_engine.get_full_graph.return_value = graph_data

    # 执行
    results = await get_async_generator_result(handler.handle_dump(mock_event))

    # 验证
    dumped_json = json.loads(results[0])
    assert dumped_json == graph_data
    mock_service.graph_engine.get_full_graph.assert_called_once_with("session_123")


@pytest.mark.asyncio
async def test_handle_migrate_v2(handler, mock_event):
    """测试：迁移指令返回废弃信息。"""
    # 执行
    results = await get_async_generator_result(handler.handle_migrate_v2(mock_event))

    # 验证
    assert "此功能已被废弃" in results[0]


@pytest.mark.asyncio
async def test_handle_link_session_no_target(handler, mock_event):
    """测试：当 target_session_id 为空时，返回用法信息。"""
    # 执行
    results = await get_async_generator_result(
        handler.handle_link_session(mock_event, "")
    )
    # 验证
    assert "用法" in results[0]


@pytest.mark.asyncio
async def test_handle_link_session_exception(handler, mock_service, mock_event):
    """测试：当 migrate_memories 抛出异常时，返回错误信息。"""
    # 准备
    target_session_id = "session_456"
    error_message = "数据库连接失败"
    mock_service.graph_engine.migrate_memories.side_effect = Exception(error_message)

    # 执行
    results = await get_async_generator_result(
        handler.handle_link_session(mock_event, target_session_id)
    )

    # 验证
    assert f"记忆关联过程中发生错误: {error_message}" in results[0]


@pytest.mark.asyncio
async def test_handle_forget_no_entity(handler, mock_event):
    """测试：当 entity_name 为空时，返回用法信息。"""
    # 执行
    results = await get_async_generator_result(
        handler.handle_forget(mock_event, entity_name="")
    )
    # 验证
    assert "用法" in results[0]


@pytest.mark.asyncio
async def test_handle_forget_failure(handler, mock_service, mock_event):
    """测试：当 delete_node_by_id 返回 False 时，返回错误信息。"""
    # 准备
    entity_name = "不存在的知识"
    mock_service.graph_engine.delete_node_by_id.return_value = False

    # 执行
    results = await get_async_generator_result(
        handler.handle_forget(mock_event, entity_name=entity_name)
    )

    # 验证
    assert f"在忘记 '{entity_name}' 的过程中发生错误。" in results[0]


@pytest.mark.asyncio
async def test_handle_dump_failure(handler, mock_service, mock_event):
    """测试：当 get_full_graph 返回 None 时，返回错误信息。"""
    # 准备
    mock_service.graph_engine.get_full_graph.return_value = None

    # 执行
    results = await get_async_generator_result(handler.handle_dump(mock_event))

    # 验证
    assert f"无法为会话 {mock_event.unified_msg_origin} 导出图数据。" in results[0]
