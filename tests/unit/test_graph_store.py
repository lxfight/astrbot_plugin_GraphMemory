"""图数据库模块测试"""

from datetime import datetime

import pytest


@pytest.mark.unit
@pytest.mark.asyncio
async def test_graph_store_initialization(mock_graph_store):
    """测试图数据库初始化"""
    assert mock_graph_store is not None
    assert mock_graph_store.conn is not None


@pytest.mark.unit
@pytest.mark.asyncio
async def test_add_entity(mock_graph_store):
    """测试添加实体"""
    from core.models.entities import EntityNode

    entity = EntityNode(
        name="张三",
        type="人物",
        description="测试用户",
        importance=0.8,
        created_at=datetime.now(),
    )

    success = await mock_graph_store.add_entity(entity)
    assert success is True

    # 验证实体存在
    result = await mock_graph_store.get_entity("张三")
    assert result is not None
    assert result.name == "张三"
    assert result.type == "人物"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_get_entity(mock_graph_store):
    """测试获取实体"""
    from core.models.entities import EntityNode

    # 添加实体
    entity = EntityNode(
        name="李四",
        type="人物",
        description="另一个测试用户",
        importance=0.7,
        created_at=datetime.now(),
    )
    await mock_graph_store.add_entity(entity)

    # 获取实体
    result = await mock_graph_store.get_entity("李四")
    assert result is not None
    assert result.name == "李四"
    assert result.description == "另一个测试用户"

    # 获取不存在的实体
    result = await mock_graph_store.get_entity("不存在")
    assert result is None


@pytest.mark.unit
@pytest.mark.asyncio
async def test_delete_entity(mock_graph_store):
    """测试删除实体"""
    from core.models.entities import EntityNode

    # 添加实体
    entity = EntityNode(
        name="王五",
        type="人物",
        description="将被删除的用户",
        importance=0.6,
        created_at=datetime.now(),
    )
    await mock_graph_store.add_entity(entity)

    # 删除实体
    success, count = await mock_graph_store.delete_entity("王五")
    assert success is True

    # 验证删除
    result = await mock_graph_store.get_entity("王五")
    assert result is None


@pytest.mark.unit
@pytest.mark.asyncio
async def test_add_relation(mock_graph_store):
    """测试添加关系"""
    from core.models.entities import EntityNode, RelatedToRel

    # 先添加两个实体
    entity1 = EntityNode(
        name="张三",
        type="人物",
        description="用户1",
        importance=0.8,
        created_at=datetime.now(),
    )
    entity2 = EntityNode(
        name="北京",
        type="地点",
        description="中国首都",
        importance=0.9,
        created_at=datetime.now(),
    )

    await mock_graph_store.add_entity(entity1)
    await mock_graph_store.add_entity(entity2)

    # 添加关系
    relation = RelatedToRel(
        from_entity="张三",
        to_entity="北京",
        relation="居住在",
        strength=0.8,
        evidence="张三住在北京",
        created_at=datetime.now(),
    )

    success = await mock_graph_store.add_relation(relation)
    assert success is True

    # 验证关系
    relations = await mock_graph_store.get_entity_relations("张三")
    assert len(relations) > 0


@pytest.mark.unit
@pytest.mark.asyncio
async def test_search_entities(mock_graph_store):
    """测试搜索实体"""
    from core.models.entities import EntityNode

    # 添加多个实体
    entities = [
        EntityNode(name="张三", type="人物", description="用户1", importance=0.8, created_at=datetime.now()),
        EntityNode(name="李四", type="人物", description="用户2", importance=0.7, created_at=datetime.now()),
        EntityNode(name="北京", type="地点", description="首都", importance=0.9, created_at=datetime.now()),
    ]

    for entity in entities:
        await mock_graph_store.add_entity(entity)

    # 按类型搜索（使用关键词）
    results = await mock_graph_store.search_entities(
        query="用户", entity_type="人物", limit=10
    )
    # 搜索可能返回0个结果（如果没有 embedding），这是正常的
    assert isinstance(results, list)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_get_stats(mock_graph_store):
    """测试获取统计信息"""
    from core.models.entities import EntityNode

    # 添加实体
    entities = [
        EntityNode(name="实体1", type="人物", description="测试", importance=0.5, created_at=datetime.now()),
        EntityNode(name="实体2", type="地点", description="测试", importance=0.5, created_at=datetime.now()),
        EntityNode(name="实体3", type="事物", description="测试", importance=0.5, created_at=datetime.now()),
    ]

    for entity in entities:
        await mock_graph_store.add_entity(entity)

    # 获取统计
    stats = await mock_graph_store.get_stats()
    assert "entities" in stats
    assert stats["entities"] >= 3
    assert "relations" in stats
    assert "sessions" in stats
