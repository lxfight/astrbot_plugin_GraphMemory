<template>
  <aside class="floating-card" v-if="graphStore.selectedNode">
    <div class="card-header">
      <h3>节点信息</h3>
      <button @click="graphStore.clearSelection()" class="close-btn">
        <Icon name="x" size="1rem" />
      </button>
    </div>
    <div class="card-content">
      <NodeInfoPanel />
    </div>
  </aside>
</template>

<script setup>
import { useGraphStore } from '@/stores/graph'
import Icon from './Icon.vue'
import NodeInfoPanel from './NodeInfoPanel.vue'

const graphStore = useGraphStore()
</script>

<style scoped>
.floating-card {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 22rem;
  max-height: calc(100vh - 3rem);
  background: #f2f2f2;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

body.dark .floating-card {
  background: #080808;
  border-color: rgba(255,255,255,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  flex-shrink: 0;
}

body.dark .card-header {
  border-bottom-color: rgba(255,255,255,0.05);
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}
body.dark .close-btn {
  color: #999;
}

.card-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>