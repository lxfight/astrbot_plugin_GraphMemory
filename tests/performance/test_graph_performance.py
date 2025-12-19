"""图数据库性能测试"""

import asyncio
import time
from datetime import datetime

import pytest


@pytest.mark.slow
@pytest.mark.asyncio
async def test_bulk_entity_creation(mock_graph_store):
    """测试批量创建实体的性能"""
    from core.models.entities import EntityNode

    num_entities = 100
    start_time = time.time()

    # 批量创建实体
    tasks = []
    for i in range(num_entities):
        entity = EntityNode(
            name=f"实体_{i}",
            type="测试",
            description=f"测试实体 {i}",
            importance=0.5,
            created_at=datetime.now(),
        )
        task = mock_graph_store.add_entity(entity)
        tasks.append(task)

    await asyncio.gather(*tasks)

    elapsed = time.time() - start_time
    avg_time = elapsed / num_entities

    print(f"\n创建 {num_entities} 个实体耗时: {elapsed:.2f}s")
    print(f"平均每个实体: {avg_time*1000:.2f}ms")

    # 性能断言
    assert elapsed < 10.0, f"批量创建耗时过长: {elapsed:.2f}s"
    assert avg_time < 0.1, f"单个实体创建耗时过长: {avg_time:.2f}s"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_bulk_relation_creation(mock_graph_store):
    """测试批量创建关系的性能"""
    from core.models.entities import EntityNode, RelatedToRel

    # 先创建实体
    for i in range(10):
        entity = EntityNode(
            name=f"实体_{i}",
            type="测试",
            description=f"测试实体 {i}",
            importance=0.5,
            created_at=datetime.now(),
        )
        await mock_graph_store.add_entity(entity)

    num_relations = 50
    start_time = time.time()

    # 批量创建关系
    tasks = []
    for i in range(num_relations):
        from_idx = i % 10
        to_idx = (i + 1) % 10
        relation = RelatedToRel(
            from_entity=f"实体_{from_idx}",
            to_entity=f"实体_{to_idx}",
            relation="关联",
            strength=0.8,
            evidence=f"测试关系 {i}",
            created_at=datetime.now(),
        )
        task = mock_graph_store.add_relation(relation)
        tasks.append(task)

    await asyncio.gather(*tasks)

    elapsed = time.time() - start_time
    avg_time = elapsed / num_relations

    print(f"\n创建 {num_relations} 条关系耗时: {elapsed:.2f}s")
    print(f"平均每条关系: {avg_time*1000:.2f}ms")

    assert elapsed < 10.0, f"批量创建关系耗时过长: {elapsed:.2f}s"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_search_performance(mock_graph_store):
    """测试搜索性能"""
    from core.models.entities import EntityNode

    # 创建测试数据
    for i in range(50):
        entity = EntityNode(
            name=f"测试实体_{i}",
            type="人物" if i % 2 == 0 else "地点",
            description=f"这是测试实体 {i}",
            importance=0.5 + (i % 10) * 0.05,
            created_at=datetime.now(),
        )
        await mock_graph_store.add_entity(entity)

    # 测试搜索性能
    start_time = time.time()

    for _ in range(10):
        await mock_graph_store.search_entities(
            query="测试", entity_type=None, limit=10
        )

    elapsed = time.time() - start_time
    avg_time = elapsed / 10

    print(f"\n执行 10 次搜索耗时: {elapsed:.2f}s")
    print(f"平均每次搜索: {avg_time*1000:.2f}ms")

    assert avg_time < 1.0, f"搜索耗时过长: {avg_time:.2f}s"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_stats_performance(mock_graph_store):
    """测试统计查询性能"""
    from core.models.entities import EntityNode

    # 创建测试数据
    for i in range(30):
        entity = EntityNode(
            name=f"实体_{i}",
            type="测试",
            description=f"测试实体 {i}",
            importance=0.5,
            created_at=datetime.now(),
        )
        await mock_graph_store.add_entity(entity)

    # 测试统计性能
    start_time = time.time()

    for _ in range(10):
        await mock_graph_store.get_stats()

    elapsed = time.time() - start_time
    avg_time = elapsed / 10

    print(f"\n执行 10 次统计查询耗时: {elapsed:.2f}s")
    print(f"平均每次查询: {avg_time*1000:.2f}ms")

    assert avg_time < 0.5, f"统计查询耗时过长: {avg_time:.2f}s"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_concurrent_operations(mock_graph_store):
    """测试并发操作性能"""
    from core.models.entities import EntityNode

    start_time = time.time()

    # 并发创建实体和查询
    tasks = []

    # 创建任务
    for i in range(20):
        entity = EntityNode(
            name=f"并发实体_{i}",
            type="测试",
            description=f"并发测试 {i}",
            importance=0.5,
            created_at=datetime.now(),
        )
        tasks.append(mock_graph_store.add_entity(entity))

    # 查询任务
    for _ in range(10):
        tasks.append(mock_graph_store.get_stats())

    # 并发执行
    await asyncio.gather(*tasks)

    elapsed = time.time() - start_time

    print(f"\n并发执行 30 个操作耗时: {elapsed:.2f}s")

    assert elapsed < 5.0, f"并发操作耗时过长: {elapsed:.2f}s"
