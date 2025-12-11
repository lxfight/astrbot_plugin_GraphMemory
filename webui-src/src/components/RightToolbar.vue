<template>
  <div class="right-toolbar">
    <div
      v-for="tool in tools"
      :key="tool.id"
      class="tool-bookmark"
      :class="{ active: uiStore.openPanels.includes(tool.id) }"
      @click="handleToolClick(tool)"
      @mouseenter="hoveredTool = tool.id"
      @mouseleave="hoveredTool = null"
    >
      <div class="bookmark-tab">
        <Icon :name="tool.icon" size="1.125rem" />
      </div>
      <transition name="label-slide">
        <div v-if="hoveredTool === tool.id" class="bookmark-label">
          {{ tool.label }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useGraphStore } from '@/stores/graph'
import Icon from './Icon.vue'

const uiStore = useUiStore()
const graphStore = useGraphStore()
const hoveredTool = ref(null)

const tools = [
  { id: 'monitor', label: '监控', icon: 'activity', action: 'switchTab' },
  { id: 'debug', label: '调试', icon: 'bug', action: 'switchTab' },
  { id: 'tools', label: '高级工具', icon: 'wrench', action: 'openPanel' },
  { id: 'link', label: '关联到会话', icon: 'link', action: 'linkEntity' },
  { id: 'connect', label: '连接节点', icon: 'share-2', action: 'toggleConnect' }
]

const handleToolClick = (tool) => {
  if (tool.id === 'connect') {
    // 连接模式特殊处理
    graphStore.isConnecting = !graphStore.isConnecting
    graphStore.connectionStartNode = null
    if (graphStore.isConnecting) {
      uiStore.showToast('连接模式', '请依次点击两个节点以创建关系', 'info', 3000)
      uiStore.togglePanel('connect')
    } else {
      uiStore.closePanel('connect')
    }
    return
  }
  
  if (tool.id === 'link') {
    // 关联实体特殊处理
    if (!graphStore.selectedNode || graphStore.selectedNode.type !== 'Entity') {
      uiStore.showToast('无法关联', '请先选择一个实体节点', 'warning')
      return
    }
    uiStore.togglePanel(tool.id, { entityName: graphStore.selectedNode.name })
    return
  }
  
  // 其他面板直接切换
  uiStore.togglePanel(tool.id)
}
</script>

<style scoped>
.right-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 100;
}

.tool-bookmark {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.bookmark-tab {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #666;
  border-right: 2px solid transparent;
}

body.dark .bookmark-tab {
  background: rgba(8, 8, 8, 0.95);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  color: #999;
}

.tool-bookmark:hover .bookmark-tab {
  transform: translateX(-0.25rem);
  color: #000;
}

body.dark .tool-bookmark:hover .bookmark-tab {
  color: #fff;
}

.tool-bookmark.active .bookmark-tab {
  background: rgba(96, 165, 250, 0.15);
  border-right-color: #60a5fa;
  color: #60a5fa;
}

body.dark .tool-bookmark.active .bookmark-tab {
  background: rgba(96, 165, 250, 0.2);
}

.bookmark-label {
  position: absolute;
  right: 100%;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.98);
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 0.5rem;
  pointer-events: none;
  box-shadow: -2px 2px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

body.dark .bookmark-label {
  background: rgba(8, 8, 8, 0.98);
  color: #e0e0e0;
  box-shadow: -2px 2px 12px rgba(0, 0, 0, 0.4);
}

.label-slide-enter-active,
.label-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.label-slide-enter-from {
  opacity: 0;
  transform: translateX(0.75rem);
}

.label-slide-leave-to {
  opacity: 0;
  transform: translateX(0.75rem);
}
</style>