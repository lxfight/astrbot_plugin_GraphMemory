import os
import sys
from unittest.mock import MagicMock

import pytest

# ==================== 1. 修复导入路径 ====================
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ==================== 2. Mock astrbot.api ====================
mock_astrbot_api = MagicMock()
mock_logger = MagicMock()
mock_astrbot_api.logger = mock_logger
sys.modules["astrbot"] = MagicMock()
sys.modules["astrbot.api"] = mock_astrbot_api

# ==================== 3. 导入业务代码 ====================
# 重新绑定 logger 到实际使用的模块
import core.schema as schema_module  # noqa: E402
from core.schema import get_embedding_dim_from_provider, initialize_schema  # noqa: E402

schema_module.logger = mock_logger

# ==================== 4. 测试 Fixtures ====================


@pytest.fixture
def mock_connection():
    """提供一个 mock 的 KuzuDB 连接。"""
    conn = MagicMock()
    conn.execute = MagicMock()
    return conn


@pytest.fixture
def mock_embedding_provider_with_dims():
    """提供一个有 dims 属性的 embedding provider。"""
    provider = MagicMock()
    provider.dims = 768
    return provider


@pytest.fixture
def mock_embedding_provider_without_dims():
    """提供一个没有 dims 属性的 embedding provider。"""
    provider = MagicMock(spec=[])  # 空 spec 表示没有任何属性
    return provider


@pytest.fixture
def mock_embedding_provider_with_none_dims():
    """提供一个 dims 为 None 的 embedding provider。"""
    provider = MagicMock()
    provider.dims = None
    return provider


@pytest.fixture(autouse=True)
def reset_logger_mock():
    """每个测试前重置 logger mock。"""
    mock_logger.reset_mock()
    yield


# ==================== 5. get_embedding_dim_from_provider 测试 ====================


def test_get_embedding_dim_with_valid_dims(mock_embedding_provider_with_dims):
    """测试：从 provider 获取有效的 embedding 维度。"""
    result = get_embedding_dim_from_provider(mock_embedding_provider_with_dims)

    assert result == 768


def test_get_embedding_dim_without_dims_attribute(mock_embedding_provider_without_dims):
    """测试：provider 没有 dims 属性时返回默认值。"""
    result = get_embedding_dim_from_provider(mock_embedding_provider_without_dims)

    assert result == 384
    # 验证警告日志被调用
    assert mock_logger.warning.called


def test_get_embedding_dim_with_none_dims(mock_embedding_provider_with_none_dims):
    """测试：provider 的 dims 为 None 时返回默认值。"""
    result = get_embedding_dim_from_provider(mock_embedding_provider_with_none_dims)

    assert result == 384
    assert mock_logger.warning.called


def test_get_embedding_dim_with_zero_dims():
    """测试：dims 为 0 时返回默认值。"""
    provider = MagicMock()
    provider.dims = 0

    result = get_embedding_dim_from_provider(provider)

    assert result == 384


def test_get_embedding_dim_with_different_values():
    """测试：不同的 dims 值。"""
    test_cases = [128, 256, 512, 1024, 1536]

    for expected_dim in test_cases:
        provider = MagicMock()
        provider.dims = expected_dim

        result = get_embedding_dim_from_provider(provider)
        assert result == expected_dim


# ==================== 6. initialize_schema 基本测试 ====================


def test_initialize_schema_creates_all_tables(mock_connection):
    """测试：初始化模式时创建所有表。"""
    initialize_schema(mock_connection, 384)

    # 验证 execute 被调用了多次（创建所有节点表和关系表）
    assert mock_connection.execute.call_count > 0

    # 验证创建了关键的节点表
    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert "CREATE NODE TABLE User" in execute_str
    assert "CREATE NODE TABLE Session" in execute_str
    assert "CREATE NODE TABLE Message" in execute_str
    assert "CREATE NODE TABLE Entity" in execute_str
    assert "CREATE NODE TABLE MemoryFragment" in execute_str


def test_initialize_schema_creates_all_relationships(mock_connection):
    """测试：初始化模式时创建所有关系表。"""
    initialize_schema(mock_connection, 384)

    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    # 验证创建了关键的关系表
    assert "CREATE REL TABLE PARTICIPATED_IN" in execute_str
    assert "CREATE REL TABLE SENT" in execute_str
    assert "CREATE REL TABLE POSTED_IN" in execute_str
    assert "CREATE REL TABLE MENTIONS" in execute_str
    assert "CREATE REL TABLE RELATED_TO" in execute_str
    assert "CREATE REL TABLE CONTAINS_ENTITY" in execute_str


def test_initialize_schema_with_custom_embedding_dim(mock_connection):
    """测试：使用自定义 embedding 维度。"""
    custom_dim = 768
    initialize_schema(mock_connection, custom_dim)

    # 验证 embedding 维度被正确使用
    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert f"FLOAT[{custom_dim}]" in execute_str


def test_initialize_schema_with_zero_embedding_dim(mock_connection):
    """测试：embedding 维度为 0 时使用默认值。"""
    initialize_schema(mock_connection, 0)

    # 验证使用了默认维度 384
    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert "FLOAT[384]" in execute_str
    # 验证警告日志被调用
    assert mock_logger.warning.called


def test_initialize_schema_with_negative_embedding_dim(mock_connection):
    """测试：embedding 维度为负数时使用默认值。"""
    initialize_schema(mock_connection, -100)

    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert "FLOAT[384]" in execute_str
    assert mock_logger.warning.called


# ==================== 7. 幂等性测试 ====================


def test_initialize_schema_idempotent_on_existing_tables(mock_connection):
    """测试：表已存在时不会引发错误（幂等性）。"""
    # 模拟所有表都已存在（execute 抛出 RuntimeError）
    mock_connection.execute.side_effect = RuntimeError("Table already exists")

    # 不应该抛出异常
    try:
        initialize_schema(mock_connection, 384)
    except RuntimeError:
        pytest.fail("initialize_schema should handle RuntimeError gracefully")


def test_initialize_schema_partial_existing_tables(mock_connection):
    """测试：部分表已存在时继续创建其他表。"""
    # 模拟部分表已存在
    call_count = 0

    def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        # 每隔一个调用抛出 RuntimeError
        if call_count % 2 == 0:
            raise RuntimeError("Table already exists")

    mock_connection.execute.side_effect = side_effect

    # 不应该抛出异常
    try:
        initialize_schema(mock_connection, 384)
    except RuntimeError:
        pytest.fail("initialize_schema should handle partial RuntimeError gracefully")


def test_initialize_schema_multiple_calls(mock_connection):
    """测试：多次调用 initialize_schema。"""
    # 第一次调用
    initialize_schema(mock_connection, 384)
    first_call_count = mock_connection.execute.call_count  # noqa: F841

    # 重置 mock
    mock_connection.reset_mock()

    # 第二次调用（模拟表已存在）
    mock_connection.execute.side_effect = RuntimeError("Table already exists")
    initialize_schema(mock_connection, 384)

    # 验证第二次调用也尝试创建表
    assert mock_connection.execute.call_count > 0


# ==================== 8. 日志测试 ====================


def test_initialize_schema_logs_table_creation(mock_connection):
    """测试：创建表时记录日志。"""
    initialize_schema(mock_connection, 384)

    # 验证日志被调用
    assert mock_logger.info.call_count > 0

    # 验证日志内容
    log_calls = [str(call) for call in mock_logger.info.call_args_list]
    log_str = " ".join(log_calls)

    assert "已创建节点表" in log_str or "已创建关系表" in log_str


def test_initialize_schema_logs_warning_for_invalid_dim(mock_connection):
    """测试：无效维度时记录警告。"""
    initialize_schema(mock_connection, -1)

    # 验证警告日志被调用
    assert mock_logger.warning.called

    # 验证警告内容
    warning_call = mock_logger.warning.call_args[0][0]
    assert "未检测到 Embedding 维度" in warning_call or "默认使用" in warning_call


# ==================== 9. 表结构测试 ====================


def test_user_table_structure(mock_connection):
    """测试：User 表的结构正确。"""
    initialize_schema(mock_connection, 384)

    # 查找 User 表的创建语句
    user_table_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE NODE TABLE User" in sql:
            user_table_call = sql
            break

    assert user_table_call is not None
    assert "id STRING" in user_table_call
    assert "name STRING" in user_table_call
    assert "platform STRING" in user_table_call
    assert "PRIMARY KEY (id)" in user_table_call


def test_message_table_has_embedding(mock_connection):
    """测试：Message 表包含 embedding 字段。"""
    embedding_dim = 512
    initialize_schema(mock_connection, embedding_dim)

    # 查找 Message 表的创建语句
    message_table_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE NODE TABLE Message" in sql:
            message_table_call = sql
            break

    assert message_table_call is not None
    assert f"embedding FLOAT[{embedding_dim}]" in message_table_call


def test_entity_table_has_embedding(mock_connection):
    """测试：Entity 表包含 embedding 字段。"""
    embedding_dim = 768
    initialize_schema(mock_connection, embedding_dim)

    # 查找 Entity 表的创建语句
    entity_table_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE NODE TABLE Entity" in sql:
            entity_table_call = sql
            break

    assert entity_table_call is not None
    assert f"embedding FLOAT[{embedding_dim}]" in entity_table_call


def test_memory_fragment_table_structure(mock_connection):
    """测试：MemoryFragment 表的结构正确。"""
    initialize_schema(mock_connection, 384)

    # 查找 MemoryFragment 表的创建语句
    memory_table_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE NODE TABLE MemoryFragment" in sql:
            memory_table_call = sql
            break

    assert memory_table_call is not None
    assert "id STRING" in memory_table_call
    assert "text STRING" in memory_table_call
    assert "timestamp INT64" in memory_table_call
    assert "valid_from INT64" in memory_table_call
    assert "valid_until INT64" in memory_table_call


# ==================== 10. 关系表测试 ====================


def test_mentions_relationship_has_sentiment(mock_connection):
    """测试：MENTIONS 关系包含 sentiment 属性。"""
    initialize_schema(mock_connection, 384)

    # 查找 MENTIONS 关系的创建语句
    mentions_rel_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE REL TABLE MENTIONS" in sql:
            mentions_rel_call = sql
            break

    assert mentions_rel_call is not None
    assert "sentiment STRING" in mentions_rel_call


def test_related_to_relationship_has_relation(mock_connection):
    """测试：RELATED_TO 关系包含 relation 属性。"""
    initialize_schema(mock_connection, 384)

    # 查找 RELATED_TO 关系的创建语句
    related_rel_call = None
    for call_obj in mock_connection.execute.call_args_list:
        sql = call_obj[0][0]
        if "CREATE REL TABLE RELATED_TO" in sql:
            related_rel_call = sql
            break

    assert related_rel_call is not None
    assert "relation STRING" in related_rel_call


def test_has_memory_relationships_created(mock_connection):
    """测试：创建 USER_HAS_MEMORY 和 SESSION_HAS_MEMORY 关系。"""
    initialize_schema(mock_connection, 384)

    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert "USER_HAS_MEMORY" in execute_str
    assert "SESSION_HAS_MEMORY" in execute_str


# ==================== 11. 边界条件测试 ====================


def test_initialize_schema_with_very_large_embedding_dim(mock_connection):
    """测试：使用非常大的 embedding 维度。"""
    large_dim = 10000
    initialize_schema(mock_connection, large_dim)

    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert f"FLOAT[{large_dim}]" in execute_str


def test_initialize_schema_with_small_embedding_dim(mock_connection):
    """测试：使用较小的 embedding 维度。"""
    small_dim = 64
    initialize_schema(mock_connection, small_dim)

    execute_calls = [str(call) for call in mock_connection.execute.call_args_list]
    execute_str = " ".join(execute_calls)

    assert f"FLOAT[{small_dim}]" in execute_str


def test_get_embedding_dim_with_string_dims():
    """测试：dims 为字符串时的处理。"""
    provider = MagicMock()
    provider.dims = "768"  # 字符串而不是整数

    # 应该返回字符串值（函数不做类型转换）
    result = get_embedding_dim_from_provider(provider)
    assert result == "768"


# ==================== 12. 异常处理测试 ====================


def test_initialize_schema_handles_other_exceptions(mock_connection):
    """测试：处理非 RuntimeError 的其他异常。"""
    # 模拟其他类型的异常
    mock_connection.execute.side_effect = ValueError("Unexpected error")

    # 应该抛出异常（不是 RuntimeError）
    with pytest.raises(ValueError):
        initialize_schema(mock_connection, 384)


def test_initialize_schema_continues_after_runtime_error(mock_connection):
    """测试：遇到 RuntimeError 后继续执行。"""
    call_count = 0

    def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        # 第一次调用抛出 RuntimeError，后续正常
        if call_count == 1:
            raise RuntimeError("Table already exists")

    mock_connection.execute.side_effect = side_effect

    initialize_schema(mock_connection, 384)

    # 验证后续调用仍然执行
    assert call_count > 1


# ==================== 13. 集成测试 ====================


def test_full_schema_initialization_flow(mock_connection):
    """测试：完整的模式初始化流程。"""
    embedding_dim = 512

    # 执行初始化
    initialize_schema(mock_connection, embedding_dim)

    # 验证所有必需的表都被尝试创建
    execute_calls = [call_obj[0][0] for call_obj in mock_connection.execute.call_args_list]

    # 节点表
    node_tables = ["User", "Session", "Message", "Entity", "MemoryFragment"]
    for table in node_tables:
        assert any(f"CREATE NODE TABLE {table}" in sql for sql in execute_calls)

    # 关系表
    rel_tables = ["PARTICIPATED_IN", "SENT", "POSTED_IN", "MENTIONS", "RELATED_TO", "CONTAINS_ENTITY"]
    for table in rel_tables:
        assert any(f"CREATE REL TABLE {table}" in sql for sql in execute_calls)


def test_embedding_provider_to_schema_flow():
    """测试：从 embedding provider 到 schema 初始化的完整流程。"""
    # 创建 mock provider
    provider = MagicMock()
    provider.dims = 1024

    # 获取维度
    dim = get_embedding_dim_from_provider(provider)
    assert dim == 1024

    # 使用该维度初始化 schema
    mock_conn = MagicMock()
    initialize_schema(mock_conn, dim)

    # 验证维度被正确使用
    execute_calls = [str(call) for call in mock_conn.execute.call_args_list]
    execute_str = " ".join(execute_calls)
    assert "FLOAT[1024]" in execute_str
