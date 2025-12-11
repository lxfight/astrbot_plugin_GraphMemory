<template>
  <div class="connect-panel">
    <p class="description">
      创建从 <strong>{{ fromNode?.name }}</strong> 到 <strong>{{ toNode?.name }}</strong> 的关系
    </p>
    <div class="form-group">
      <label class="form-label">关系类型</label>
      <input 
        v-model="relationType" 
        type="text" 
        class="form-input" 
        placeholder="例如: IS_A, PART_OF, RELATED_TO"
      />
    </div>
    <button @click="handleConnect" class="btn btn-primary">
      创建关系
    </button>
    <div v-if="status" class="status-message" :class="statusType">
      {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import * as api from '@/api'

const props = defineProps({
  panelData: {
    type: Object,
    default: () => ({})
  }
})

const graphStore = useGraphStore()
const uiStore = useUiStore()

const fromNode = computed(() => props.panelData?.fromNode)
const toNode = computed(() => props.panelData?.toNode)

const relationType = ref('')
const status = ref('')
const statusType = ref('')

async function handleConnect() {
  if (!relationType.value.trim()) {
    status.value = '请输入关系名称'
    statusType.value = 'error'
    return
  }
  
  status.value = '正在创建关系...'
  statusType.value = ''
  
  try {
    const payload = {
      from_id: fromNode.value.id,
      to_id: toNode.value.id,
      rel_type: relationType.value,
      from_type: fromNode.value.type,
      to_type: toNode.value.type
    }
    
    await api.createEdge(payload)
    
    status.value = '关系创建成功！'
    statusType.value = 'success'
    uiStore.showToast('创建成功', `已创建 ${relationType.value} 关系`, 'success')
    
    setTimeout(() => {
      uiStore.closePanel('connect')
      graphStore.loadGraphData(graphStore.currentSessionId)
    }, 1500)
  } catch (error) {
    console.error('Create edge failed:', error)
    const message = error.response?.data?.detail || error.message
    status.value = `错误: ${message}`
    statusType.value = 'error'
    uiStore.showToast('创建失败', message, 'error')
  }
}
</script>

<style scoped>
.connect-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

body.dark .description {
  color: #999;
}

.description strong {
  color: #000;
}

body.dark .description strong {
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
}

body.dark .form-label {
  color: #999;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  background: transparent;
  font-size: 0.875rem;
  color: inherit;
  transition: border-color 0.2s;
}

body.dark .form-input {
  border-color: rgba(255,255,255,0.1);
}

.form-input:focus {
  outline: none;
  border-color: rgba(0,0,0,0.3);
}

body.dark .form-input:focus {
  border-color: rgba(255,255,255,0.3);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #000;
  color: #fff;
}

body.dark .btn-primary {
  background: #fff;
  color: #000;
}

.btn-primary:hover {
  opacity: 0.8;
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