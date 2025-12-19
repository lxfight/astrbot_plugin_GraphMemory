<template>
  <div class="graph-view">
    <div class="view-header">
      <h2>图谱可视化</h2>
      <div class="view-actions">
        <select v-model="viewMode" class="select" @change="loadGraph">
          <option value="global">全局视图</option>
          <option value="session">会话视图</option>
        </select>
        <transition name="fade">
          <input
            v-if="viewMode === 'session'"
            v-model="sessionId"
            type="text"
            class="input"
            placeholder="输入会话 ID..."
            style="width: 200px"
          />
        </transition>
        <button @click="loadGraph" class="btn btn-primary" :disabled="loading">
          <component :is="loading ? Loader2 : RefreshCw" :class="{ 'spin': loading }" :size="16" />
          {{ loading ? '加载中' : '刷新' }}
        </button>
      </div>
    </div>

    <div class="graph-container card">
      <transition name="fade" mode="out-in">
        <div v-if="loading" class="state-container">
          <Loader2 class="spinner" :size="40" />
          <p class="state-text">正在构建知识图谱...</p>
        </div>
        
        <div v-else-if="error" class="state-container">
          <AlertCircle class="error-icon" :size="40" />
          <p class="error-text">{{ error }}</p>
          <button @click="loadGraph" class="btn btn-primary">重试</button>
        </div>
        
        <GraphViewer
          v-else-if="graphData.nodes.length > 0"
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :loading="loading"
        />
        
        <div v-else class="state-container">
          <Database class="empty-icon" :size="40" />
          <p class="empty-title">暂无图谱数据</p>
          <p class="empty-text">开始对话以生成记忆图谱</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { graphApi } from '@/api/graph'
import GraphViewer from '@/components/GraphViewer.vue'
import { Loader2, RefreshCw, AlertCircle, Database } from 'lucide-vue-next'

const loading = ref(false)
const error = ref('')
const viewMode = ref('global')
const sessionId = ref('')
const graphData = ref<{ nodes: any[]; edges: any[] }>({
  nodes: [],
  edges: [],
})

const loadGraph = async () => {
  loading.value = true
  error.value = ''

  try {
    let response

    if (viewMode.value === 'session' && sessionId.value) {
      response = await graphApi.getSessionGraph(sessionId.value)
    } else {
      response = await graphApi.getGlobalGraph({ limit: 200 })
    }

    if (response.success) {
      graphData.value = response.data
    } else {
      error.value = response.message || '加载失败'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '加载图谱失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGraph()
})
</script>

<style scoped>
.graph-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
}

@media (max-width: 768px) {
  .graph-view {
    padding: 16px;
    gap: 16px;
  }
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .view-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .select, .input {
    flex: 1;
  }
}

.view-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-all);
}

.select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.graph-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 0; /* Override card padding for full graph */
  display: flex;
  flex-direction: column;
}

.state-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--color-bg-secondary);
}

.spinner {
  color: var(--color-info);
  animation: spin 1s linear infinite;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.error-icon {
  color: var(--color-error);
}

.error-text {
  color: var(--color-error);
  margin-bottom: 8px;
}

.empty-icon {
  color: var(--color-text-tertiary);
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
