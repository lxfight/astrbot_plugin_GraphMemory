<template>
  <div ref="graphContainer" class="graph-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ForceGraph from 'force-graph'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'

const graphContainer = ref(null)
const graphStore = useGraphStore()
const uiStore = useUiStore()
let graph
let isInitialLoad = true

onMounted(() => {
  initGraph()
  window.addEventListener('resize', resizeGraph)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeGraph)
  if (graph) {
    graph._destructor()
  }
})

// 移除 deep watch 避免力导向模拟触发无限递归
watch(() => graphStore.graphData, (newData, oldData) => {
  if (graph) {
    graph.graphData(newData)
    // 只在初始加载或节点数量变化时自动适配视图
    const nodeCountChanged = !oldData || newData.nodes.length !== oldData.nodes.length
    if (isInitialLoad || nodeCountChanged) {
      setTimeout(() => graph.zoomToFit(400), 200)
      isInitialLoad = false
    }
  }
})

watch(() => uiStore.isDark, () => {
  if (graph) {
    graph.backgroundColor(uiStore.isDark ? '#080808' : '#f2f2f2')
    graph.nodeColor(graph.nodeColor())
    graph.linkColor(graph.linkColor())
    graph.nodeCanvasObject(graph.nodeCanvasObject())
  }
})

// 移除 deep watch，使用 computed 或直接在渲染函数中判断
watch(() => graphStore.highlightNodes, () => {
  if(graph) {
    graph.nodeColor(graph.nodeColor())
    graph.linkColor(graph.linkColor())
    graph.linkWidth(graph.linkWidth())
    graph.linkDirectionalParticles(link => graphStore.highlightLinks.has(link) ? 2 : 0)
    graph.nodeCanvasObject(graph.nodeCanvasObject())
  }
})

watch(() => graphStore.showLabels, () => {
  if (graph) {
    graph.nodeCanvasObject(graph.nodeCanvasObject())
  }
})

function resizeGraph() {
  if (graph && graphContainer.value) {
    graph.width(graphContainer.value.clientWidth)
    graph.height(graphContainer.value.clientHeight)
  }
}

function initGraph() {
  if (!graphContainer.value) return

  const getNodeColor = (node) => {
    if (graphStore.selectedNode && node.id === graphStore.selectedNode.id) {
      return uiStore.isDark ? '#fff' : '#000'
    }
    
    // 连接模式下不变暗其他节点
    if (!graphStore.isConnecting && graphStore.highlightNodes.size > 0 && !graphStore.highlightNodes.has(node.id)) {
      return uiStore.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    }
    
    // 根据后端定义的节点类型使用亮色方案
    const type = node.type || node.group || ''
    switch(type) {
      case 'User':
        return '#60a5fa'  // 亮蓝色
      case 'Session':
        return '#a78bfa'  // 亮紫色
      case 'Message':
        return '#34d399'  // 亮绿色
      case 'Entity':
        return '#fbbf24'  // 亮黄色
      case 'MemoryFragment':
        return '#f472b6'  // 亮粉色
      default:
        return '#9ca3af'  // 灰色
    }
  }

  const getLinkColor = (link) => {
    const isDimmed = graphStore.highlightLinks.size > 0 && !graphStore.highlightLinks.has(link)
    if (isDimmed) {
      return uiStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    }
    return uiStore.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  }

  graph = ForceGraph()(graphContainer.value)
    .backgroundColor(uiStore.isDark ? '#080808' : '#f2f2f2')
    .nodeLabel(null)  // 禁用默认tooltip，使用自定义Tooltip组件
    .nodeColor(getNodeColor)
    .nodeVal(node => (node.importance || 0.5) * 5)
    .nodeRelSize(4)
    .linkColor(getLinkColor)
    .linkWidth(link => graphStore.highlightLinks.has(link) ? 2.5 : 1)
    .linkDirectionalParticles(link => graphStore.highlightLinks.has(link) ? 3 : 0)
    .linkDirectionalParticleWidth(3)
    .cooldownTime(3000)      // 初始布局3秒
    .d3AlphaDecay(0.02)      // 较慢衰减，确保3秒内不会停止
    .d3VelocityDecay(0.3)    // 适中减速
    .d3AlphaMin(0.001)       // 较低的最小阈值
    .onNodeClick((node, event) => {
      // 单击选择节点
      if (graphStore.isConnecting) {
        handleConnectModeClick(node)
      } else {
        graphStore.selectNode(node)
        graphStore.focusNode(node, graph)
        uiStore.switchTab('info')
        if (!uiStore.sidebarOpen) uiStore.toggleSidebar()
      }
    })
    .onNodeHover(node => {
      graphStore.hoverNode = node
      graphContainer.value.style.cursor = node ? 'pointer' : null
    })
    .onNodeDrag(node => {
      // 拖动节点时重启短时间模拟
      if (graph) {
        graph.d3ReheatSimulation()
        graph.cooldownTime(500)  // 拖动后只模拟0.5秒
        graph.d3AlphaDecay(0.1)  // 拖动时快速衰减
      }
    })
    .onNodeDragEnd(node => {
      // 拖动结束后恢复正常冷却时间
      if (graph) {
        graph.cooldownTime(3000)
        graph.d3AlphaDecay(0.02)  // 恢复慢速衰减
      }
    })
    .onBackgroundClick(() => graphStore.clearSelection())
    .nodeCanvasObject((node, ctx, globalScale) => {
      const r = Math.sqrt(Math.max(0, (node.importance || 0.5) * 5)) * 4
      const isSelected = graphStore.selectedNode && node.id === graphStore.selectedNode.id
      const isHighlighted = graphStore.highlightNodes.has(node.id)
      // 连接模式下不变暗节点
      const isDimmed = !graphStore.isConnecting && graphStore.highlightNodes.size > 0 && !isHighlighted
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false)
      ctx.fillStyle = isDimmed
        ? (uiStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
        : getNodeColor(node)
      ctx.fill()
      
      if (isSelected) {
        ctx.strokeStyle = uiStore.isDark ? '#fff' : '#333'
        ctx.lineWidth = 2 / globalScale
        ctx.stroke()
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 1.5, 0, 2 * Math.PI, false)
        ctx.strokeStyle = uiStore.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
        ctx.lineWidth = 1 / globalScale
        ctx.stroke()
      }
      
      if (graphStore.showLabels || isSelected || isHighlighted) {
        const label = node.name
        const fontSize = (isSelected ? 14 : 10) / globalScale
        ctx.font = `${isSelected ? 'bold' : ''} ${fontSize}px 'Inter', sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        const currentTextColor = uiStore.isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
        const dimmedColor = uiStore.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
        
        ctx.fillStyle = isDimmed ? dimmedColor : currentTextColor
        
        if (isSelected) {
          const textWidth = ctx.measureText(label).width
          const bgHeight = fontSize * 1.2
          ctx.fillStyle = uiStore.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'
          ctx.fillRect(node.x - textWidth/2 - 2, node.y + r + 2, textWidth + 4, bgHeight)
          ctx.fillStyle = isDimmed ? dimmedColor : currentTextColor
        }
        
        ctx.fillText(label, node.x, node.y + r + 2)
      }
    })
    .graphData(graphStore.graphData)
  
  graphStore.setGraphInstance(graph)
  resizeGraph()
}

function handleConnectModeClick(node) {
  if (!graphStore.connectionStartNode) {
    // 选择第一个节点
    graphStore.connectionStartNode = node
    uiStore.showToast('已选择起始节点', `${node.name}，请点击第二个节点`, 'info', 3000)
    // 高亮起始节点
    graphStore.highlightNodes.clear()
    graphStore.highlightNodes.add(node.id)
  } else {
    // 选择第二个节点
    if (graphStore.connectionStartNode.id === node.id) {
      uiStore.showToast('无法连接', '不能连接节点自身', 'warning')
      return
    }
    
    // 只在选择两个节点后才弹出连接面板
    const fromNode = graphStore.connectionStartNode
    const toNode = node
    
    // 先清理连接模式状态
    graphStore.isConnecting = false
    graphStore.connectionStartNode = null
    graphStore.highlightNodes.clear()
    
    // 然后打开连接面板
    graphStore.showConnectPanel(fromNode, toNode)
  }
}
</script>

<style scoped>
.graph-container {
  flex: 1;
  position: relative;
  z-index: 1;
  overflow: hidden;
}
</style>