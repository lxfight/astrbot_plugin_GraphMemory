<template>
  <div class="panels-container">
    <transition-group name="panel-slide" tag="div" class="panels-wrapper">
      <div
        v-for="(panelId, index) in uiStore.openPanels"
        :key="panelId"
        class="right-panel"
        :style="getPanelStyle(index)"
      >
        <div class="panel-header">
          <h3 class="panel-title">{{ getPanelTitle(panelId) }}</h3>
          <button @click="uiStore.closePanel(panelId)" class="icon-btn">
            <Icon name="x" size="1rem" />
          </button>
        </div>
        <div class="panel-content">
          <component :is="getPanelComponent(panelId)" v-if="getPanelComponent(panelId)" :panel-data="uiStore.panelData[panelId]" />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useUiStore } from '@/stores/ui'
import Icon from './Icon.vue'

const uiStore = useUiStore()

const ToolsPanel = defineAsyncComponent(() => import('./panels/ToolsPanel.vue'))
const LinkPanel = defineAsyncComponent(() => import('./panels/LinkPanel.vue'))
const ConnectPanel = defineAsyncComponent(() => import('./panels/ConnectPanel.vue'))

const MonitorPanel = defineAsyncComponent(() => import('./MonitorPanel.vue'))
const DebugPanel = defineAsyncComponent(() => import('./DebugPanel.vue'))

const panelTitles = {
  monitor: '监控',
  debug: '调试',
  tools: '高级工具',
  link: '关联实体到会话',
  connect: '连接节点'
}

const panelComponents = {
  monitor: MonitorPanel,
  debug: DebugPanel,
  tools: ToolsPanel,
  link: LinkPanel,
  connect: ConnectPanel
}

const getPanelTitle = (panelId) => panelTitles[panelId] || ''
const getPanelComponent = (panelId) => panelComponents[panelId] || null

const getPanelStyle = (index) => {
  const panelCount = uiStore.openPanels.length
  const panelWidth = 22 // rem
  const gap = 1 // rem
  const totalWidth = panelCount * panelWidth + (panelCount - 1) * gap
  const startOffset = 3 // 从右侧3rem开始
  
  return {
    right: `${startOffset + index * (panelWidth + gap)}rem`
  }
}
</script>

<style scoped>
.panels-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 200;
}

.panels-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.right-panel {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 22rem;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  box-shadow: -4px 0 20px rgba(0,0,0,0.12);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

body.dark .right-panel {
  background: rgba(8, 8, 8, 0.98);
  border-color: rgba(255,255,255,0.08);
  box-shadow: -4px 0 20px rgba(0,0,0,0.4);
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(100%);
}

.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.95);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  flex-shrink: 0;
}

body.dark .panel-header {
  border-bottom-color: rgba(255,255,255,0.05);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.icon-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

body.dark .icon-btn {
  color: #999;
}

.icon-btn:hover {
  background: rgba(0,0,0,0.05);
}

body.dark .icon-btn:hover {
  background: rgba(255,255,255,0.1);
}
</style>