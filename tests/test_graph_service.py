from unittest.mock import AsyncMock, MagicMock

import pytest

# Mock the GraphEngine before it's imported by the service
from core.graph_engine import GraphEngine
from core.graph_entities import RelatedToRel
from core.graph_service import GraphService


@pytest.fixture
def mock_engine():
    """Fixture for a mocked GraphEngine."""
    engine = MagicMock(spec=GraphEngine)
    engine.get_all_contexts = AsyncMock(return_value=["session1", "session2"])
    engine.get_full_graph = AsyncMock(return_value={"nodes": [], "edges": []})
    engine.get_global_graph = AsyncMock(return_value={"nodes": ["global"], "edges": []})

    # Mock the embedding provider
    engine.embedding_provider = MagicMock()
    engine.embedding_provider.embed = AsyncMock(return_value=[0.1] * 128)

    engine.search_for_visualization = AsyncMock(return_value={"nodes": ["searched"], "edges": []})
    engine.delete_node_by_id = AsyncMock()
    engine.delete_edge = AsyncMock()
    engine.update_node_properties = AsyncMock()
    engine.batch_delete = AsyncMock(return_value=5)
    engine.add_node_manually = AsyncMock(return_value=True)
    engine.link_entity_to_session = AsyncMock()
    engine.add_relation = AsyncMock()

    return engine

@pytest.fixture
def service(mock_engine):
    """Fixture for a GraphService instance with a mocked engine."""
    return GraphService(mock_engine)

@pytest.mark.asyncio
async def test_get_contexts(service: GraphService, mock_engine: MagicMock):
    """Test retrieving session contexts."""
    contexts = await service.get_contexts()
    mock_engine.get_all_contexts.assert_awaited_once()
    assert contexts == [
        {"session_id": "session1", "persona_id": "default"},
        {"session_id": "session2", "persona_id": "default"},
    ]

@pytest.mark.asyncio
async def test_get_graph_data_specific_session(service: GraphService, mock_engine: MagicMock):
    """Test getting graph data for a specific session."""
    data = await service.get_graph_data("session1")
    mock_engine.get_full_graph.assert_awaited_once_with("session1")
    mock_engine.get_global_graph.assert_not_awaited()
    assert data == {"nodes": [], "edges": []}

@pytest.mark.asyncio
async def test_get_graph_data_global(service: GraphService, mock_engine: MagicMock):
    """Test getting global graph data."""
    data = await service.get_graph_data("global")
    mock_engine.get_global_graph.assert_awaited_once()
    mock_engine.get_full_graph.assert_not_awaited()
    assert data == {"nodes": ["global"], "edges": []}

@pytest.mark.asyncio
async def test_get_graph_data_none_session(service: GraphService, mock_engine: MagicMock):
    """Test getting global graph data when session is None."""
    await service.get_graph_data(None)
    mock_engine.get_global_graph.assert_awaited_once()
    mock_engine.get_full_graph.assert_not_awaited()

@pytest.mark.asyncio
async def test_debug_search_success(service: GraphService, mock_engine: MagicMock):
    """Test successful debug search."""
    result = await service.debug_search("test query", "sid1", 5, 5)
    mock_engine.embedding_provider.embed.assert_awaited_once_with("test query")
    mock_engine.search_for_visualization.assert_awaited_once_with(
        query="test query",
        query_embedding=[0.1] * 128,
        session_id="sid1",
        vector_top_k=5,
        keyword_top_k=5,
    )
    assert result == {"nodes": ["searched"], "edges": []}

@pytest.mark.asyncio
async def test_debug_search_no_embedding_provider(service: GraphService, mock_engine: MagicMock):
    """Test debug search fails when no embedding provider is configured."""
    mock_engine.embedding_provider = None
    with pytest.raises(ValueError, match="未配置 Embedding provider"):
        await service.debug_search("query", "sid1", 1, 1)

@pytest.mark.asyncio
async def test_debug_search_no_session_id(service: GraphService):
    """Test debug search fails when no session ID is provided."""
    with pytest.raises(ValueError, match="调试搜索需要提供 Session ID"):
        await service.debug_search("query", "", 1, 1)

@pytest.mark.asyncio
async def test_delete_node(service: GraphService, mock_engine: MagicMock):
    """Test deleting a node."""
    await service.delete_node("node1", "Entity")
    mock_engine.delete_node_by_id.assert_awaited_once_with("node1", "Entity")

@pytest.mark.asyncio
async def test_delete_edge(service: GraphService, mock_engine: MagicMock):
    """Test deleting an edge."""
    await service.delete_edge("from1", "to1", "RELATES", "Entity", "Entity")
    mock_engine.delete_edge.assert_awaited_once_with("from1", "to1", "RELATES", "Entity", "Entity")

@pytest.mark.asyncio
async def test_update_node(service: GraphService, mock_engine: MagicMock):
    """Test updating a node's properties."""
    props = {"key": "value"}
    await service.update_node("node1", "Entity", props)
    mock_engine.update_node_properties.assert_awaited_once_with("node1", "Entity", props)

@pytest.mark.asyncio
async def test_batch_delete(service: GraphService, mock_engine: MagicMock):
    """Test executing a batch delete task."""
    count = await service.batch_delete("delete_orphans", days=30)
    mock_engine.batch_delete.assert_awaited_once_with("delete_orphans", days=30)
    assert count == 5

@pytest.mark.asyncio
async def test_create_node(service: GraphService, mock_engine: MagicMock):
    """Test creating a node manually."""
    props = {"name": "NewNode"}
    result = await service.create_node("Entity", props)
    mock_engine.add_node_manually.assert_awaited_once_with("Entity", props)
    assert result is True

@pytest.mark.asyncio
async def test_link_entity_to_session(service: GraphService, mock_engine: MagicMock):
    """Test linking an entity to a session."""
    await service.link_entity_to_session("sid1", "MyEntity")
    mock_engine.link_entity_to_session.assert_awaited_once_with("sid1", "MyEntity")

@pytest.mark.asyncio
async def test_create_edge_success(service: GraphService, mock_engine: MagicMock):
    """Test creating an edge between two entities."""
    await service.create_edge("Entity1", "Entity2", "RELATED_TO", "Entity", "Entity")

    # We need to check that add_relation was called with a RelatedToRel object.
    # Since we can't easily check for object equality, we check the call was made
    # and inspect the argument passed to it.
    mock_engine.add_relation.assert_awaited_once()
    call_args = mock_engine.add_relation.call_args
    relation_arg = call_args.args[0]
    assert isinstance(relation_arg, RelatedToRel)
    assert relation_arg.src_entity == "Entity1"
    assert relation_arg.tgt_entity == "Entity2"
    assert relation_arg.relation == "RELATED_TO"

@pytest.mark.asyncio
async def test_create_edge_not_implemented(service: GraphService, mock_engine: MagicMock):
    """Test creating an edge between unsupported types raises NotImplementedError."""
    with pytest.raises(NotImplementedError):
        await service.create_edge("msg1", "entity1", "MENTIONS", "Message", "Entity")
    mock_engine.add_relation.assert_not_awaited()
