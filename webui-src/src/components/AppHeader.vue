<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <Icon name="brain" size="1.5rem" />
        <span>GraphMemory</span>
      </div>
      <div class="view-switcher">
        <select v-model="uiStore.activeView" class="btn btn-secondary">
          <option value="graph">图谱</option>
          <option value="dashboard">仪表板</option>
        </select>
      </div>
    </div>
    <div class="header-right">
      <div class="search-box">
        <Icon name="search" class="search-icon" />
        <input type="text" v-model="searchQuery" placeholder="搜索节点..." class="search-input" />
      </div>
      <div class="session-selector">
        <select v-model="graphStore.currentSessionId" @change="onSessionChange" class="btn btn-secondary">
          <option value="global">全局视图</option>
          <option v-for="ctx in graphStore.contexts" :key="ctx.session_id" :value="ctx.session_id">
            {{ formatSessionId(ctx.session_id) }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import Icon from './Icon.vue'

const graphStore = useGraphStore()
const uiStore = useUiStore()

const searchQuery = ref('')

watch(searchQuery, (newQuery) => {
  graphStore.performSearch(newQuery)
})

function onSessionChange(event) {
  graphStore.loadGraphData(event.target.value)
}

function formatSessionId(sessionId) {
  return sessionId.length > 20 ? `...${sessionId.slice(-17)}` : sessionId
}
</script>

<style scoped>
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(242, 242, 242, 0.8);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  backdrop-filter: blur(8px);
  z-index: 20;
}
body.dark .app-header {
  background: rgba(8, 8, 8, 0.8);
  border-bottom-color: rgba(255,255,255,0.05);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.search-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #999;
}
.search-input {
  width: 15rem;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: background 0.2s;
}
body.dark .search-input {
  background: rgba(255,255,255,0.05);
  color: #e0e0e0;
}
.search-input:focus {
  background: rgba(0,0,0,0.08);
}
body.dark .search-input:focus {
  background: rgba(255,255,255,0.08);
}

.btn.btn-secondary {
  min-width: 10rem;
}
</style>