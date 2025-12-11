<template>
  <div class="tools-panel">
    <div class="tool-section">
      <div class="tool-section-title">批量操作</div>
      <div @click="handleTask('delete_isolated_entities')" class="tool-item">
        <Icon name="trash-2" class="tool-item-icon" />
        <div class="tool-item-content">
          <div class="tool-item-title">删除孤立实体</div>
          <div class="tool-item-desc">清理没有任何连接的节点</div>
        </div>
      </div>
      <div @click="handleTask('delete_old_messages', { days: 90 })" class="tool-item">
        <Icon name="clock" class="tool-item-icon" />
        <div class="tool-item-content">
          <div class="tool-item-title">删除旧消息</div>
          <div class="tool-item-desc">删除90天前的原始消息</div>
        </div>
      </div>
    </div>
    <div v-if="status" class="status-message" :class="statusType">
      {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import * as api from '@/api'
import Icon from '../Icon.vue'

defineProps({
  panelData: {
    type: Object,
    default: () => ({})
  }
})

const graphStore = useGraphStore()
const uiStore = useUiStore()

const status = ref('')
const statusType = ref('')

async function handleTask(taskName, params = {}) {
  status.value = '正在执行任务...'
  statusType.value = ''
  
  try {
    const response = await api.batchDelete(taskName, params)
    const result = response.data
    
    status.value = `成功删除 ${result.deleted_count} 个节点`
    statusType.value = 'success'
    
    uiStore.showToast('操作成功', `已删除 ${result.deleted_count} 个节点`, 'success')
    
    setTimeout(() => {
      uiStore.closePanel('tools')
      graphStore.loadGraphData(graphStore.currentSessionId)
    }, 2000)
  } catch (error) {
    console.error('Batch operation failed:', error)
    const message = error.response?.data?.detail || error.message
    status.value = `错误: ${message}`
    statusType.value = 'error'
    uiStore.showToast('操作失败', message, 'error')
  }
}
</script>

<style scoped>
.tools-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

body.dark .tool-section-title {
  color: #999;
}

.tool-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.03);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

body.dark .tool-item {
  background: rgba(255,255,255,0.03);
}

.tool-item:hover {
  background: rgba(0,0,0,0.06);
  transform: translateY(-1px);
}

body.dark .tool-item:hover {
  background: rgba(255,255,255,0.06);
}

.tool-item-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.05);
  border-radius: 0.5rem;
  color: #666;
}

body.dark .tool-item-icon {
  background: rgba(255,255,255,0.05);
  color: #999;
}

.tool-item-content {
  flex: 1;
}

.tool-item-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.tool-item-desc {
  font-size: 0.75rem;
  color: #999;
}

.status-message {
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
}

.status-message.success {
  background: rgba(34,197,94,0.1);
  color: #22c55e;
}

.status-message.error {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
}
</style>