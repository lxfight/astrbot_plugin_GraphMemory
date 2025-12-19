<template>
  <div class="graph-viewer">
    <div ref="cyContainer" class="cy-container"></div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>正在构建图谱...</span>
    </div>

    <!-- 节点详情面板 -->
    <transition name="slide-fade">
      <div v-if="selectedNode" class="node-details glass-panel">
        <div class="details-header">
          <div class="header-content">
            <component 
              :is="getIconComponent(selectedNode.properties.type)" 
              class="node-icon"
              :size="24"
              :color="getNodeColor(selectedNode.properties.type)"
            />
            <h3>{{ selectedNode.properties.name }}</h3>
          </div>
          <button @click="selectedNode = null" class="btn-close">
            <X :size="20" />
          </button>
        </div>
        
        <div class="details-body">
          <div class="detail-section">
            <span class="section-title">基本信息</span>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">类型</span>
                <span class="value tag" :style="{ borderColor: getNodeColor(selectedNode.properties.type), color: getNodeColor(selectedNode.properties.type) }">
                  {{ selectedNode.properties.type }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">重要性</span>
                <div class="progress-bar">
                  <div class="progress-value" :style="{ width: `${(selectedNode.properties.importance || 0) * 100}%`, backgroundColor: getNodeColor(selectedNode.properties.type) }"></div>
                </div>
              </div>
              <div class="detail-item">
                <span class="label">访问次数</span>
                <span class="value">{{ selectedNode.properties.access_count }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="selectedNode.properties.description">
            <span class="section-title">描述</span>
            <p class="description">{{ selectedNode.properties.description }}</p>
          </div>

          <div class="detail-section" v-if="Object.keys(selectedNode.properties).length > 5">
            <span class="section-title">其他属性</span>
            <div class="json-view">
              <div v-for="(value, key) in filterProps(selectedNode.properties)" :key="key" class="json-item">
                <span class="key">{{ key }}:</span>
                <span class="val">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 控制面板 -->
    <div class="controls glass-panel">
      <button @click="fitGraph" class="btn-control" title="适应画布">
        <Maximize :size="20" />
      </button>
      <div class="divider"></div>
      <button @click="changeLayout('cose')" class="btn-control" :class="{ active: currentLayout === 'cose' }" title="力导向布局">
        <Share2 :size="20" />
      </button>
      <button @click="changeLayout('circle')" class="btn-control" :class="{ active: currentLayout === 'circle' }" title="环形布局">
        <Circle :size="20" />
      </button>
      <button @click="changeLayout('grid')" class="btn-control" :class="{ active: currentLayout === 'grid' }" title="网格布局">
        <Grid :size="20" />
      </button>
      <button @click="changeLayout('concentric')" class="btn-control" :class="{ active: currentLayout === 'concentric' }" title="同心圆布局">
        <Target :size="20" />
      </button>
    </div>

    <!-- 图例 -->
    <div class="legend glass-panel">
      <div v-for="(color, type) in visibleTypeColors" :key="type" class="legend-item">
        <span class="dot" :style="{ backgroundColor: color }"></span>
        <span class="name">{{ type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import cytoscape from 'cytoscape'
import type { Core, NodeSingular } from 'cytoscape'
import { getIconSvg, getIconComponent } from '@/utils/icons'
import { X, Maximize, Share2, Circle, Grid, Target } from 'lucide-vue-next'

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
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const cyContainer = ref<HTMLElement>()
let cy: Core | null = null
const selectedNode = ref<GraphNode | null>(null)
const currentLayout = ref('cose')

// 实体类型颜色映射（浅色系，柔和清新）
const typeColors: Record<string, string> = {
  // 英文
  PERSON: '#3b82f6',    // 蓝色
  PLACE: '#10b981',     // 绿色
  THING: '#f59e0b',     // 橙色
  CONCEPT: '#8b5cf6',   // 紫色
  EVENT: '#ef4444',     // 红色
  // 中文
  '人物': '#3b82f6',
  '地点': '#10b981',
  '事物': '#f59e0b',
  '概念': '#8b5cf6',
  '事件': '#ef4444',
  default: '#64748b',   // 灰蓝
}

const visibleTypeColors = computed(() => {
  const result: Record<string, string> = {}
  Object.keys(typeColors).forEach(key => {
    if (key !== 'default' && ['人物', '地点', '事物', '概念', '事件'].includes(key)) {
      result[key] = typeColors[key]
    }
  })
  return result
})

// 获取实体类型颜色
const getNodeColor = (type: string): string => {
  return typeColors[type] || typeColors.default
}

// 过滤掉已展示的属性
const filterProps = (props: Record<string, any>) => {
  const { name, type, description, importance, access_count, ...rest } = props
  return rest
}

// 初始化 Cytoscape
const initCytoscape = () => {
  if (!cyContainer.value) return

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f8fafc'

  cy = cytoscape({
    container: cyContainer.value,
    elements: [],
    minZoom: 0.2,
    maxZoom: 3,
    wheelSensitivity: 0.2,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'background-opacity': 0.1,
          'border-width': 2,
          'border-color': 'data(color)',
          'label': 'data(label)',
          'width': 'data(size)',
          'height': 'data(size)',
          'font-size': '12px',
          'font-weight': '600',
          'text-valign': 'bottom',
          'text-margin-y': 8,
          'color': isDark ? '#e2e8f0' : '#475569',
          'text-background-color': bgColor,
          'text-background-opacity': 0.8,
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle',
          'background-image': 'data(icon)',
          'background-fit': 'contain',
          'background-image-opacity': 1,
          'transition-property': 'background-opacity, border-width, width, height, font-size',
          'transition-duration': 300,
        } as any, // type cast to avoid strict typing issues with specific cytoscape properties
      },
      {
        selector: 'node:hover',
        style: {
          'background-opacity': 0.2,
          'border-width': 3,
          'font-size': '14px',
          'text-background-opacity': 1,
          'z-index': 999,
        } as any,
      },
      {
        selector: 'edge',
        style: {
          'width': 'data(width)',
          'line-color': isDark ? '#334155' : '#cbd5e1',
          'target-arrow-color': isDark ? '#334155' : '#cbd5e1',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'arrow-scale': 0.8,
          'opacity': 0.6,
          'label': 'data(label)',
          'font-size': '10px',
          'color': isDark ? '#94a3b8' : '#94a3b8',
          'text-rotation': 'autorotate',
          'text-background-color': bgColor,
          'text-background-opacity': 0.8,
          'text-background-padding': '2px',
        } as any,
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 4,
          'background-opacity': 0.3,
          'width': (ele: NodeSingular) => (ele.data('size') || 40) * 1.2,
          'height': (ele: NodeSingular) => (ele.data('size') || 40) * 1.2,
        } as any,
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': '#3b82f6',
          'target-arrow-color': '#3b82f6',
          'width': 3,
          'opacity': 1,
          'z-index': 99,
        } as any,
      },
      // 关联高亮样式
      {
        selector: '.highlighted',
        style: {
          'background-opacity': 0.3,
          'line-color': '#3b82f6',
          'target-arrow-color': '#3b82f6',
          'transition-duration': 300,
        } as any,
      },
      {
        selector: '.faded',
        style: {
          'opacity': 0.1,
          'label': '',
        } as any,
      }
    ],
    layout: { name: 'preset' } // 初始空布局
  })

  // 节点点击
  cy.on('tap', 'node', (event) => {
    const node = event.target
    selectedNode.value = {
      id: node.data('id'),
      label: node.data('label'),
      properties: node.data('properties') || {},
    }

    // 高亮邻居
    cy?.elements().removeClass('highlighted faded')
    const neighborhood = node.neighborhood().add(node)
    cy?.elements().not(neighborhood).addClass('faded')
    neighborhood.addClass('highlighted')
  })

  // 画布点击（取消选择）
  cy.on('tap', (event) => {
    if (event.target === cy) {
      selectedNode.value = null
      cy?.elements().removeClass('highlighted faded')
    }
  })
}

// 更新图谱数据
const updateGraph = async () => {
  if (!cy) return

  try {
    // 转换节点
    const cyNodes = await Promise.all(props.nodes.map(async (node) => {
      const importance = node.properties.importance || 0.5
      // 减小节点基础尺寸，从 30-60px 调整为 20-40px
      const size = 20 + importance * 20
      const color = getNodeColor(node.properties.type)
      
      let icon = ''
      try {
        // 异步生成 SVG 图标
        icon = await getIconSvg(node.properties.type, color)
      } catch (e) {
        console.warn('Failed to generate icon for node:', node.properties.name, e)
      }

      return {
        data: {
          id: node.id,
          label: node.properties.name,
          color,
          size,
          icon,
          properties: node.properties,
        },
      }
    }))

    // 转换边
    const cyEdges = props.edges.map((edge) => {
      const strength = edge.properties.strength || 0.5
      const width = 1 + strength * 2

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

    // 批量更新
    cy.elements().remove()
    cy.add([...cyNodes, ...cyEdges])

    // 给节点设置随机初始位置，确保有动画效果
    cy.nodes().forEach((node) => {
      const containerWidth = cy.width()
      const containerHeight = cy.height()
      node.position({
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight
      })
    })

    // 重新布局
    // 使用 setTimeout 确保 DOM 更新后再运行布局
    setTimeout(() => {
      runLayout()
    }, 100)
  } catch (err) {
    console.error('Error updating graph:', err)
  }
}

const runLayout = () => {
  if (!cy) return

  console.log('[GraphViewer] Running layout:', currentLayout.value)
  console.log('[GraphViewer] Node count:', cy.nodes().length)
  console.log('[GraphViewer] Edge count:', cy.edges().length)

  const layoutConfig: any = {
    name: currentLayout.value,
    animate: true,
    animationDuration: 1000,
    animationEasing: 'ease-out',
    padding: 50,
  }

  // 特定布局参数优化
  if (currentLayout.value === 'cose') {
    Object.assign(layoutConfig, {
      // 开启随机化以确保每次都有"展开"动画
      randomize: true,

      // 动画配置
      animate: true,
      animationDuration: 2000,
      animationEasing: 'ease-in-out',

      // 布局物理参数 - 减少迭代次数让动画可见
      componentSpacing: 80,
      nodeRepulsion: (node: any) => 20000,
      idealEdgeLength: (edge: any) => 100,
      edgeElasticity: (edge: any) => 100,
      nestingFactor: 1.2,
      gravity: 0.1,
      numIter: 50,
      initialTemp: 100,
      coolingFactor: 0.99,
      minTemp: 1.0,

      // 启用刷新以展示过程动画
      refresh: 10,
      fit: true,

      // 避免重叠
      nodeOverlap: 20,
      avoidOverlap: true,
    })
  } else if (currentLayout.value === 'concentric') {
    Object.assign(layoutConfig, {
      minNodeSpacing: 30,
      avoidOverlap: true,
      levelWidth: (nodes: any) => 2,
    })
  }

  console.log('[GraphViewer] Layout config:', layoutConfig)

  const layout = cy.layout(layoutConfig)

  layout.on('layoutstart', () => {
    console.log('[GraphViewer] Layout started')
  })

  layout.on('layoutstop', () => {
    console.log('[GraphViewer] Layout stopped')
  })

  layout.run()
}

const fitGraph = () => cy?.fit(undefined, 50)

const changeLayout = (name: string) => {
  currentLayout.value = name
  runLayout()
}

// 监听数据变化
watch(() => [props.nodes, props.edges], updateGraph, { deep: true })

// 监听主题变化以更新样式
const updateThemeStyles = () => {
  if (!cy) return
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f8fafc'
  
  // 重新初始化以应用新主题样式（Cytoscape 样式更新较繁琐，直接重绘可能更简单，或者使用 stylesheet api）
  // 这里简单处理：更新颜色变量
  cy.style()
    .selector('node')
    .style({
      'color': isDark ? '#e2e8f0' : '#475569',
      'text-background-color': bgColor,
    })
    .selector('edge')
    .style({
      'line-color': isDark ? '#334155' : '#cbd5e1',
      'target-arrow-color': isDark ? '#334155' : '#cbd5e1',
      'color': isDark ? '#94a3b8' : '#94a3b8',
      'text-background-color': bgColor,
    })
    .update()
}

// 观察主题变化
const observer = new MutationObserver(updateThemeStyles)

onMounted(() => {
  setTimeout(() => {
    initCytoscape()
    updateGraph()
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  }, 100)
})

onUnmounted(() => {
  cy?.destroy()
  observer.disconnect()
})
</script>

<style scoped>
.graph-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-bg-secondary);
  overflow: hidden;
}

.cy-container {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--color-border-light) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-bg-glass);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  gap: 16px;
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-info);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 节点详情面板 */
.node-details {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 320px;
  max-height: calc(100% - 48px);
  overflow-y: auto;
  border-radius: var(--radius-lg);
  z-index: 20;
}

.details-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.details-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.value {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.tag {
  padding: 2px 8px;
  border: 1px solid;
  border-radius: var(--radius-full);
  font-size: 12px;
  background: transparent;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-value {
  height: 100%;
  border-radius: var(--radius-full);
}

.description {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.json-view {
  background: var(--color-bg-tertiary);
  padding: 12px;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 12px;
}

.json-item {
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
}

.json-item .key {
  color: var(--color-text-tertiary);
}

/* 控制面板 */
.controls {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: var(--radius-full);
  z-index: 20;
}

.btn-control {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-control:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.btn-control.active {
  background: var(--color-bg-active);
  color: var(--color-info);
}

.divider {
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 4px;
}

/* 图例 */
.legend {
  position: absolute;
  bottom: 24px;
  right: 24px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  display: flex;
  gap: 16px;
  z-index: 20;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.name {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
