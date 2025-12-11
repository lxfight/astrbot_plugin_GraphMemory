<template>
  <div class="debug-panel">
    <div class="debug-search">
      <input 
        v-model="query" 
        @keyup.enter="performSearch"
        type="text" 
        placeholder="输入调试查询..." 
        class="debug-input"
      />
      <button @click="performSearch" :disabled="loading" class="btn btn-primary">
        <Icon v-if="!loading" name="search" size="0.875rem" />
        <Icon v-else name="loader" size="0.875rem" class="spinning" />
        <span>{{ loading ? '搜索中...' : '搜索' }}</span>
      </button>
    </div>

    <div v-if="result" class="debug-result">
      <div class="result-stats">
        <span>节点: {{ result.nodes?.length || 0 }}</span>
        <span>边: {{ result.edges?.length || 0 }}</span>
      </div>
      
      <button 
        @click="visualizeResult" 
        :disabled="!result.nodes || result.nodes.length === 0"
        class="btn btn-secondary"
        style="margin-top: 1rem; width: 100%;"
      >
        <Icon name="eye" size="0.875rem" />
        <span>可视化结果</span>
      </button>

      <details style="margin-top: 1rem;">
        <summary style="cursor: pointer; font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">
          查看 JSON
        </summary>
        <pre class="json-display">{{ JSON.stringify(result, null, 2) }}</pre>
      </details>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import * as api from '@/api'
import Icon from './Icon.vue'

const graphStore = useGraphStore()
const uiStore = useUiStore()

const query = ref('')
const loading = ref(false)
const result = ref(null)
const error = ref(null)

async function performSearch() {
  if (!query.value.trim()) return
  
  const sessionId = graphStore.currentSessionId
  if (!sessionId) {
    uiStore.showToast('错误', '请先加载会话', 'warning')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await api.debugSearch(query.value, sessionId)
    // 使用 nextTick 确保 DOM 更新完成
    await new Promise(resolve => setTimeout(resolve, 0))
    result.value = response.data
  } catch (err) {
    console.error('Debug search failed:', err)
    error.value = err.response?.data?.detail || '搜索失败: ' + err.message
    uiStore.showToast('搜索失败', error.value, 'error')
  } finally {
    loading.value = false
  }
}

function visualizeResult() {
  if (!result.value || !result.value.nodes) return
  
  const debugNodes = result.value.nodes.map(n => ({
    id: n.id || n.name,
    name: n.name || n.id,
    type: n.type || 'debug',
    group: 'debug',
    importance: n.importance || 0.7,
    properties: n.properties || {},
    observations: n.observations || []
  }))
  
  const debugLinks = (result.value.edges || []).map(e => ({
    source: e.source,
    target: e.target,
    relation: e.relation || 'debug_link',
    weight: e.weight || 1
  }))
  
  // 使用响应式更新
  graphStore.graphData = {
    nodes: debugNodes,
    links: debugLinks
  }
  
  uiStore.switchTab('info')
  uiStore.showToast('可视化成功', `已加载 ${debugNodes.length} 个节点`, 'success')
}
</script>

<style scoped>
.debug-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.debug-search {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.debug-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: background 0.2s;
  color: #333;
}

body.dark .debug-input {
  background: rgba(255,255,255,0.05);
  color: #e0e0e0;
}

.debug-input:focus {
  background: rgba(0,0,0,0.08);
}

body.dark .debug-input:focus {
  background: rgba(255,255,255,0.08);
}

.debug-result {
  padding: 1rem;
  background: rgba(0,0,0,0.03);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

body.dark .debug-result {
  background: rgba(255,255,255,0.03);
}

.result-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #666;
}

body.dark .result-stats {
  color: #999;
}

.json-display {
  padding: 0.75rem;
  background: rgba(0,0,0,0.05);
  border-radius: 0.375rem;
  font-size: 0.625rem;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

body.dark .json-display {
  background: rgba(255,255,255,0.05);
}

.error-message {
  padding: 0.75rem;
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #000;
  color: #fff;
}

body.dark .btn-primary {
  background: #fff;
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.8;
}

.btn-secondary {
  background: rgba(0,0,0,0.05);
  color: #666;
}

body.dark .btn-secondary {
  background: rgba(255,255,255,0.05);
  color: #999;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(0,0,0,0.1);
}

body.dark .btn-secondary:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>