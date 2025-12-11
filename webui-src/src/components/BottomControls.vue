<template>
  <div class="bottom-controls">
    <div class="stats">
      <span class="stat-item">
        <Icon name="circle" size="0.75rem" />
        节点: {{ graphStore.nodeCount }}
      </span>
      <span class="stat-item">
        <Icon name="git-branch" size="0.75rem" />
        边: {{ graphStore.edgeCount }}
      </span>
    </div>
    <div class="controls">
      <label class="checkbox-label">
        <input type="checkbox" v-model="graphStore.showLabels" />
        <span>显示标签</span>
      </label>
      <button @click="graphStore.loadGraphData(graphStore.currentSessionId)" class="icon-btn" title="重新加载">
        <Icon name="refresh-cw" size="1rem" />
      </button>
      <button @click="graphStore.zoomToFit" class="icon-btn" title="适应视图">
        <Icon name="maximize-2" size="1rem" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGraphStore } from '@/stores/graph'
import Icon from './Icon.vue'

const graphStore = useGraphStore()
</script>

<style scoped>
.bottom-controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  font-size: 0.75rem;
}

body.dark .bottom-controls {
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stats {
  display: flex;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.7rem;
}

body.dark .stat-item {
  color: #999;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

body.dark .controls {
  border-left-color: rgba(255, 255, 255, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.7rem;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 0.875rem;
  height: 0.875rem;
}

.icon-btn {
  padding: 0.375rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
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
  background: rgba(0, 0, 0, 0.05);
}

body.dark .icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>