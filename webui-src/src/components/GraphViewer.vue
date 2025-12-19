<template>
  <div class="graph-viewer">
    <div ref="cyContainer" class="cy-container"></div>

    <!-- 节点详情面板 -->
    <div v-if="selectedNode" class="node-details">
      <div class="details-header">
        <h3>{{ selectedNode.properties.name }}</h3>
        <button @click="selectedNode = null" class="btn-close">×</button>
      </div>
      <div class="details-body">
        <div class="detail-item">
          <span class="label">类型:</span>
          <span class="value">{{ selectedNode.properties.type }}</span>
        </div>
        <div class="detail-item">
          <span class="label">描述:</span>
          <span class="value">{{ selectedNode.properties.description }}</span>
        </div>
        <div class="detail-item">
          <span class="label">重要性:</span>
          <span class="value">{{ selectedNode.properties.importance?.toFixed(2) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">访问次数:</span>
          <span class="value">{{ selectedNode.properties.access_count }}</span>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="controls">
      <button @click="fitGraph" class="btn btn-sm" title="适应画布">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>
      <button @click="changeLayout('cose')" class="btn btn-sm" title="力导向布局">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      <button @click="changeLayout('circle')" class="btn btn-sm" title="环形布局">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </button>
      <button @click="changeLayout('grid')" class="btn btn-sm" title="网格布局">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import cytoscape from 'cytoscape'
import type { Core, NodeSingular } from 'cytoscape'

interface GraphNode {
  id: string
  label: string
  properties: Record<string, any>
}

interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  properties: Record<string, any>
}

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const props = defineProps<Props>()

const cyContainer = ref<HTMLElement>()
let cy: Core | null = null
const selectedNode = ref<GraphNode | null>(null)

// 实体类型颜色映射（浅色系，柔和配色）
const typeColors: Record<string, string> = {
  // 英文
  PERSON: '#60a5fa',    // 浅蓝色
  PLACE: '#34d399',     // 浅绿色
  THING: '#fbbf24',     // 浅黄色
  CONCEPT: '#a78bfa',   // 浅紫色
  EVENT: '#f87171',     // 浅红色
  // 中文
  '人物': '#60a5fa',
  '地点': '#34d399',
  '事物': '#fbbf24',
  '概念': '#a78bfa',
  '事件': '#f87171',
  default: '#94a3b8',   // 浅灰色
}

// 获取实体类型颜色
const getNodeColor = (type: string): string => {
  return typeColors[type] || typeColors.default
}

// 初始化 Cytoscape
const initCytoscape = () => {
  if (!cyContainer.value) {
    console.error('[GraphViewer] 容器元素未找到')
    return
  }

  console.log('[GraphViewer] 初始化 Cytoscape, 容器尺寸:', {
    width: cyContainer.value.clientWidth,
    height: cyContainer.value.clientHeight,
  })

  cy = cytoscape({
    container: cyContainer.value,
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'width': 'data(size)',
          'height': 'data(size)',
          'font-size': '12px',
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#fff',
          'text-outline-color': '#000',
          'text-outline-width': 2,
        },
      },
      {
        selector: 'edge',
        style: {
          'width': 'data(width)',
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '10px',
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
        },
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 3,
          'border-color': '#000',
        },
      },
    ],
    layout: {
      name: 'cose',
      animate: true,
      animationDuration: 500,
    },
  })

  // 节点点击事件
  cy.on('tap', 'node', (event) => {
    const node = event.target
    const nodeData = node.data()
    selectedNode.value = {
      id: nodeData.id,
      label: nodeData.label,
      properties: nodeData.properties || {},
    }
  })

  // 画布点击事件（取消选择）
  cy.on('tap', (event) => {
    if (event.target === cy) {
      selectedNode.value = null
    }
  })
}

// 更新图谱数据
const updateGraph = () => {
  if (!cy) return

  console.log('[GraphViewer] 更新图谱数据:', {
    nodes: props.nodes.length,
    edges: props.edges.length,
  })

  // 转换节点数据
  const cyNodes = props.nodes.map((node) => {
    const importance = node.properties.importance || 0.5
    const size = 20 + importance * 40 // 20-60px
    const color = getNodeColor(node.properties.type)

    return {
      data: {
        id: node.id,
        label: node.properties.name,
        color,
        size,
        properties: node.properties,
      },
    }
  })

  // 转换边数据
  const cyEdges = props.edges.map((edge) => {
    const strength = edge.properties.strength || 0.5
    const width = 1 + strength * 4 // 1-5px

    return {
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.properties.relation || '',
        width,
      },
    }
  })

  console.log('[GraphViewer] 转换后的数据:', {
    cyNodes: cyNodes.length,
    cyEdges: cyEdges.length,
  })

  // 更新图谱
  cy.elements().remove()
  cy.add([...cyNodes, ...cyEdges])

  // 应用布局
  cy.layout({
    name: 'cose',
    animate: true,
    animationDuration: 500,
  }).run()
}

// 适应画布
const fitGraph = () => {
  if (cy) {
    cy.fit(undefined, 50)
  }
}

// 切换布局
const changeLayout = (layoutName: string) => {
  if (!cy) return

  cy.layout({
    name: layoutName,
    animate: true,
    animationDuration: 500,
  }).run()
}

// 监听数据变化
watch(() => [props.nodes, props.edges], updateGraph, { deep: true })

onMounted(() => {
  // 延迟初始化，确保DOM完全渲染
  setTimeout(() => {
    initCytoscape()
    updateGraph()
  }, 100)
})

onUnmounted(() => {
  if (cy) {
    cy.destroy()
  }
})
</script>

<style scoped>
.graph-viewer {
  position: relative;
  width: 100%;
  height: 100%;
}

.cy-container {
  width: 100%;
  height: 100%;
  background: var(--color-bg-secondary);
}

.node-details {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.details-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.btn-close {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);
}

.btn-close:hover {
  color: var(--color-text-primary);
}

.details-body {
  padding: 16px;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  flex-shrink: 0;
  width: 80px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.detail-item .value {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-primary);
  word-break: break-word;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.btn-sm {
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 18px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.btn-sm:hover {
  background: var(--color-bg-hover);
}
</style>
