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
import fcose from 'cytoscape-fcose'
import type { Core, NodeSingular } from 'cytoscape'
import { getIconComponent } from '@/utils/icons'
import { X, Maximize, Share2, Circle, Grid, Target } from 'lucide-vue-next'

// 注册 fcose 布局扩展
cytoscape.use(fcose)

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

// 实体类型颜色映射（现代渐变配色）
const typeColors: Record<string, string> = {
  // 英文
  PERSON: '#6366f1',    // 靛蓝
  PLACE: '#10b981',     // 翠绿
  THING: '#f59e0b',     // 琥珀
  CONCEPT: '#8b5cf6',   // 紫罗兰
  EVENT: '#ec4899',     // 粉红
  // 中文
  '人物': '#6366f1',
  '地点': '#10b981',
  '事物': '#f59e0b',
  '概念': '#8b5cf6',
  '事件': '#ec4899',
  default: '#64748b',   // 石板灰
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
          'background-opacity': 0.85,
          'border-width': 2,
          'border-color': 'data(color)',
          'border-opacity': 1,
          'label': 'data(label)',
          'width': 'data(size)',
          'height': 'data(size)',
          // 标签样式优化 - 防止重叠
          'font-size': '10px',
          'font-weight': '500',
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'ellipsis',
          'text-max-width': '60px',
          'text-overflow-wrap': 'anywhere',
          'color': '#ffffff',
          'text-outline-color': 'data(color)',
          'text-outline-width': 2,
          'text-outline-opacity': 0.8,
          // 添加阴影效果
          'shadow-blur': 8,
          'shadow-color': 'data(color)',
          'shadow-opacity': 0.4,
          'shadow-offset-x': 0,
          'shadow-offset-y': 2,
          // 平滑过渡
          'transition-property': 'background-opacity, border-width, width, height, shadow-blur, shadow-opacity',
          'transition-duration': 300,
          'transition-timing-function': 'ease-out',
        } as any,
      },
      {
        selector: 'node:hover',
        style: {
          'background-opacity': 0.95,
          'border-width': 3,
          'z-index': 999,
          'shadow-blur': 15,
          'shadow-opacity': 0.6,
          'width': (ele: NodeSingular) => (ele.data('size') || 40) * 1.15,
          'height': (ele: NodeSingular) => (ele.data('size') || 40) * 1.15,
        } as any,
      },
      {
        selector: 'edge',
        style: {
          'width': 'data(width)',
          'line-color': isDark ? '#475569' : '#cbd5e1',
          'target-arrow-color': isDark ? '#475569' : '#cbd5e1',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'arrow-scale': 0.8,
          'opacity': 0.4,
          // 边标签默认隐藏，减少视觉噪音
          'label': '',
          'font-size': '9px',
          'color': isDark ? '#94a3b8' : '#64748b',
          'text-rotation': 'autorotate',
          'text-background-color': isDark ? '#1e293b' : '#ffffff',
          'text-background-opacity': 0.9,
          'text-background-padding': '3px',
          'text-background-shape': 'roundrectangle',
          // 边的过渡效果
          'transition-property': 'line-color, target-arrow-color, width, opacity',
          'transition-duration': 200,
          'transition-timing-function': 'ease-in-out',
        } as any,
      },
      {
        selector: 'edge:hover',
        style: {
          'width': (ele: any) => (ele.data('width') || 2) * 1.8,
          'opacity': 0.9,
          'line-color': isDark ? '#818cf8' : '#6366f1',
          'target-arrow-color': isDark ? '#818cf8' : '#6366f1',
          'z-index': 100,
          // 悬停时显示边标签
          'label': 'data(label)',
        } as any,
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 5,
          'background-opacity': 0.85,
          'width': (ele: NodeSingular) => (ele.data('size') || 40) * 1.25,
          'height': (ele: NodeSingular) => (ele.data('size') || 40) * 1.25,
          'shadow-blur': 25,
          'shadow-opacity': 0.6,
          'z-index': 1000,
        } as any,
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': '#3b82f6',
          'target-arrow-color': '#3b82f6',
          'width': 4,
          'opacity': 1,
          'z-index': 99,
        } as any,
      },
      // 关联高亮样式 - 增强效果
      {
        selector: '.highlighted',
        style: {
          'background-opacity': 0.8,
          'border-width': 4,
          'line-color': '#3b82f6',
          'target-arrow-color': '#3b82f6',
          'opacity': 1,
          'shadow-blur': 15,
          'shadow-opacity': 0.5,
          'transition-duration': 400,
        } as any,
      },
      {
        selector: '.faded',
        style: {
          'opacity': 0.08,
          'label': '',
          'transition-duration': 400,
        } as any,
      }
    ],
    layout: { name: 'preset' }
  })

  // 节点点击 - 增强动画效果
  cy.on('tap', 'node', (event) => {
    const node = event.target
    selectedNode.value = {
      id: node.data('id'),
      label: node.data('label'),
      properties: node.data('properties') || {},
    }

    // 高亮邻居 - 添加波纹动画效果
    cy?.elements().removeClass('highlighted faded')
    const neighborhood = node.neighborhood().add(node)

    // 先淡化所有元素
    cy?.elements().not(neighborhood).addClass('faded')

    // 延迟高亮邻居，创建波纹效果
    setTimeout(() => {
      neighborhood.addClass('highlighted')
    }, 50)

    // 节点脉冲动画
    node.animate({
      style: {
        'border-width': 6,
        'shadow-blur': 30,
      },
      duration: 300,
      easing: 'ease-out'
    }).animate({
      style: {
        'border-width': 5,
        'shadow-blur': 25,
      },
      duration: 200,
      easing: 'ease-in'
    })
  })

  // 画布点击（取消选择）- 添加淡入动画
  cy.on('tap', (event) => {
    if (event.target === cy) {
      selectedNode.value = null

      // 先移除高亮
      cy?.elements().removeClass('highlighted')

      // 延迟恢复，创建淡入效果
      setTimeout(() => {
        cy?.elements().removeClass('faded')
      }, 100)
    }
  })

  // 鼠标悬停边时高亮连接的节点
  cy.on('mouseover', 'edge', (event) => {
    const edge = event.target
    const source = edge.source()
    const target = edge.target()

    source.addClass('highlighted')
    target.addClass('highlighted')
  })

  cy.on('mouseout', 'edge', (event) => {
    const edge = event.target
    const source = edge.source()
    const target = edge.target()

    // 只有在节点未被选中时才移除高亮
    if (!source.selected()) source.removeClass('highlighted')
    if (!target.selected()) target.removeClass('highlighted')
  })

}


// 更新图谱数据
const updateGraph = async () => {
  if (!cy) return

  try {
    // 转换节点
    const cyNodes = props.nodes.map((node) => {
      const importance = node.properties.importance || 0.5
      // 节点尺寸：基础 28px，重要性加成最多 22px，范围 28-50px
      const size = 28 + importance * 22
      const color = getNodeColor(node.properties.type)
      // 截断过长的名称
      const label = node.properties.name.length > 8 
        ? node.properties.name.substring(0, 7) + '…' 
        : node.properties.name

      return {
        data: {
          id: node.id,
          label,
          fullLabel: node.properties.name,
          color,
          size,
          properties: node.properties,
        },
      }
    })

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
    animationDuration: 600,
    animationEasing: 'ease-out',
    padding: 50,
    fit: true,
  }

  // 特定布局参数优化
  if (currentLayout.value === 'cose') {
    // 使用 fcose 布局替代 cose，提供更好的力导向效果
    Object.assign(layoutConfig, {
      name: 'fcose',
      quality: 'default',
      randomize: true,
      animate: true,
      animationDuration: 800,
      animationEasing: 'ease-out',

      // 力导向参数 - 增加间距防止重叠
      nodeSeparation: 150,
      idealEdgeLength: 150,
      edgeElasticity: 0.35,
      nestingFactor: 0.1,
      gravity: 0.15,
      numIter: 3000,

      // 初始温度和冷却
      initialEnergyOnIncremental: 0.3,
      gravityRangeCompound: 1.5,
      gravityCompound: 1.0,
      gravityRange: 4.0,

      // 避免重叠 - 增强排斥力
      nodeRepulsion: 8000,

      fit: true,
      padding: 50,
    })
  } else if (currentLayout.value === 'circle') {
    Object.assign(layoutConfig, {
      animationDuration: 500,
      avoidOverlap: true,
      radius: undefined,
      startAngle: 0,
      sweep: undefined,
      clockwise: true,
      spacingFactor: 1.2,
    })
  } else if (currentLayout.value === 'grid') {
    Object.assign(layoutConfig, {
      animationDuration: 500,
      avoidOverlap: true,
      avoidOverlapPadding: 10,
      condense: false,
      rows: undefined,
      cols: undefined,
    })
  } else if (currentLayout.value === 'concentric') {
    Object.assign(layoutConfig, {
      animationDuration: 500,
      minNodeSpacing: 40,
      avoidOverlap: true,
      levelWidth: (nodes: any) => 2,
      concentric: (node: any) => node.degree(),
      startAngle: 0,
      sweep: undefined,
      clockwise: true,
      equidistant: false,
      spacingFactor: 1.2,
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

/* 控制面板 - 现代化设计 */
.controls {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: var(--radius-full);
  z-index: 20;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease-out;
}

.btn-control {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.btn-control::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-bg-hover);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-control:hover::before {
  opacity: 1;
  transform: scale(1);
}

.btn-control:hover {
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.btn-control:active {
  transform: translateY(0);
}

.btn-control.active {
  color: var(--color-info);
}

.btn-control.active::before {
  opacity: 1;
  background: var(--color-bg-active);
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 6px;
  opacity: 0.5;
}

/* 图例 - 现代化设计 */
.legend {
  position: absolute;
  bottom: 24px;
  right: 24px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  display: flex;
  gap: 18px;
  z-index: 20;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease-out 0.1s backwards;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: default;
}

.legend-item:hover {
  transform: translateY(-1px);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  transition: all 0.3s ease;
}

.legend-item:hover .dot {
  transform: scale(1.2);
  box-shadow: 0 0 12px currentColor;
}

.name {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.2s ease;
}

.legend-item:hover .name {
  color: var(--color-text-primary);
}

/* 淡入上升动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 - 增强效果 */
.slide-fade-enter-active {
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-fade-leave-active {
  animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(20px) scale(0.98);
    opacity: 0;
  }
}
</style>
