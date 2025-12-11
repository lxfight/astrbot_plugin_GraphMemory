<template>
  <div class="link-panel">
    <p class="description">
      将实体 <strong>{{ entityName }}</strong> 关联到指定会话
    </p>
    <div class="form-group">
      <label class="form-label">目标会话 ID</label>
      <input 
        v-model="sessionId" 
        type="text" 
        class="form-input" 
        :placeholder="defaultSessionId"
      />
    </div>
    <button @click="handleLink" class="btn btn-primary">
      确认关联
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

const entityName = computed(() => props.panelData?.entityName || '')
const defaultSessionId = computed(() => 
  graphStore.currentSessionId !== 'global' ? graphStore.currentSessionId : '输入会话ID...'
)

const sessionId = ref(graphStore.currentSessionId !== 'global' ? graphStore.currentSessionId : '')
const status = ref('')
const statusType = ref('')

async function handleLink() {
  if (!sessionId.value.trim()) {
    status.value = '请输入会话 ID'
    statusType.value = 'error'
    return
  }
  
  status.value = '正在关联...'
  statusType.value = ''
  
  try {
    await api.linkEntityToSession(sessionId.value, entityName.value)
    
    status.value = '关联成功！'
    statusType.value = 'success'
    uiStore.showToast('关联成功', `实体已关联到会话 ${sessionId.value}`, 'success')
    
    setTimeout(() => {
      uiStore.closePanel('link')
      if (graphStore.currentSessionId === sessionId.value) {
        graphStore.loadGraphData(sessionId.value)
      }
    }, 1500)
  } catch (error) {
    console.error('Link failed:', error)
    const message = error.response?.data?.detail || error.message
    status.value = `错误: ${message}`
    statusType.value = 'error'
    uiStore.showToast('关联失败', message, 'error')
  }
}
</script>

<style scoped>
.link-panel {
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