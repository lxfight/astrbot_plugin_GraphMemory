import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/api'
import { useUiStore } from './ui'

export const useGraphStore = defineStore('graph', () => {
  const uiStore = useUiStore()

  // --- State ---
  const graphData = ref({ nodes: [], links: [] })
  const contexts = ref([])
  const currentSessionId = ref('global')
  const selectedNode = ref(null)
  const hoverNode = ref(null)
  const highlightNodes = ref(new Set())
  const highlightLinks = ref(new Set())
  const showLabels = ref(true)
  const isConnecting = ref(false)
  const connectionStartNode = ref(null)
  const graphInstance = ref(null)

  // --- Getters ---
  const nodeCount = computed(() => graphData.value.nodes.length)
  const edgeCount = computed(() => graphData.value.links.length)

  // --- Actions ---
  function setGraphInstance(instance) {
    graphInstance.value = instance
  }

  function focusNode(node, graph = graphInstance.value) {
    if (!graph || !node) return
    graph.centerAt(node.x, node.y, 1000)
    graph.zoom(3, 1000)
  }

  function zoomToFit() {
    if (graphInstance.value) {
      graphInstance.value.zoomToFit(400)
    }
  }

  function performSearch(query) {
    if (!query.trim()) {
      highlightNodes.value.clear()
      highlightLinks.value.clear()
      return
    }
    
    const lowerQuery = query.toLowerCase()
    const matchedNodes = graphData.value.nodes.filter(node =>
      node.name.toLowerCase().includes(lowerQuery) ||
      node.type.toLowerCase().includes(lowerQuery) ||
      node.id.toLowerCase().includes(lowerQuery)
    )
    
    if (matchedNodes.length > 0) {
      highlightNodes.value.clear()
      highlightLinks.value.clear()
      matchedNodes.forEach(node => highlightNodes.value.add(node.id))
      
      if (matchedNodes.length === 1) {
        selectedNode.value = matchedNodes[0]
        focusNode(matchedNodes[0])
      }
    }
  }

  function showConnectPanel(fromNode, toNode) {
    uiStore.togglePanel('connect', { fromNode, toNode })
  }
  async function fetchContexts() {
    try {
      const response = await api.getContexts()
      contexts.value = response.data || []
    } catch (error) {
      console.error('Failed to fetch contexts:', error)
      uiStore.showToast('错误', '无法获取会话列表', 'error')
    }
  }

  async function loadGraphData(sessionId = 'global') {
    currentSessionId.value = sessionId
    try {
      const response = await api.getGraphData(sessionId)
      const data = response.data
      
      if (!data) {
        graphData.value = { nodes: [], links: [] }
        return
      }

      const validNodes = (data.nodes || []).filter(n => n && n.id)
      const nodeIds = new Set(validNodes.map(n => n.id))
      const validEdges = (data.edges || []).filter(e =>
        e && e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target)
      )

      graphData.value = {
        nodes: validNodes,
        links: validEdges
      }
    } catch (error) {
      console.error('Failed to load graph data:', error)
      uiStore.showToast('加载失败', '无法加载图谱数据', 'error')
      graphData.value = { nodes: [], links: [] }
    }
  }

  function selectNode(node) {
    selectedNode.value = node
    highlightNetwork(node)
  }

  function clearSelection() {
    selectedNode.value = null
    highlightNodes.value.clear()
    highlightLinks.value.clear()
  }

  function highlightNetwork(node) {
    highlightNodes.value.clear()
    highlightLinks.value.clear()
    
    if (!node) return
    
    highlightNodes.value.add(node.id)
    graphData.value.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source
      const targetId = typeof link.target === 'object' ? link.target.id : link.target
      
      if (sourceId === node.id) {
        highlightLinks.value.add(link)
        highlightNodes.value.add(targetId)
      }
      if (targetId === node.id) {
        highlightLinks.value.add(link)
        highlightNodes.value.add(sourceId)
      }
    })
  }

  async function deleteSelectedNode() {
    if (!selectedNode.value) return
    try {
      await api.deleteNode(selectedNode.value.type, selectedNode.value.id)
      uiStore.showToast('删除成功', '节点已删除', 'success')
      clearSelection()
      await loadGraphData(currentSessionId.value)
    } catch (error) {
      console.error('Failed to delete node:', error)
      const message = error.response?.data?.detail || '删除失败'
      uiStore.showToast('删除失败', message, 'error')
    }
  }

  return {
    graphData,
    contexts,
    currentSessionId,
    selectedNode,
    hoverNode,
    highlightNodes,
    highlightLinks,
    showLabels,
    isConnecting,
    connectionStartNode,
    graphInstance,
    nodeCount,
    edgeCount,
    fetchContexts,
    loadGraphData,
    selectNode,
    clearSelection,
    highlightNetwork,
    deleteSelectedNode,
    setGraphInstance,
    focusNode,
    zoomToFit,
    performSearch,
    showConnectPanel
  }
})