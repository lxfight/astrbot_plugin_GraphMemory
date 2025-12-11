<template>
  <div class="monitor-panel">
    <div class="monitor-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeMonitorTab = tab.id"
        class="monitor-tab"
        :class="{ active: activeMonitorTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="monitor-controls">
      <select v-if="activeMonitorTab === 'logs'" v-model="logLevel" class="log-filter">
        <option value="ALL">全部</option>
        <option value="INFO">INFO</option>
        <option value="WARNING">WARNING</option>
        <option value="ERROR">ERROR</option>
      </select>
      <button @click="togglePause" class="btn btn-secondary btn-sm">
        {{ paused ? '继续' : '暂停' }}
      </button>
      <button @click="clearLogs" class="btn btn-secondary btn-sm">
        清空
      </button>
    </div>

    <div class="monitor-content">
      <div v-if="activeMonitorTab === 'logs'" class="log-list">
        <div v-for="(log, index) in filteredLogs" :key="index" class="log-entry" :data-level="log.level">
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-level">[{{ log.level }}]</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
        <div v-if="filteredLogs.length === 0" class="empty-message">
          暂无日志
        </div>
      </div>

      <div v-if="activeMonitorTab === 'tasks'" class="task-list">
        <div v-for="(task, index) in tasks" :key="index" class="task-entry">
          <span class="task-time">{{ formatTime(task.timestamp) }}</span>
          <span class="task-content" v-html="task.content"></span>
        </div>
        <div v-if="tasks.length === 0" class="empty-message">
          暂无任务
        </div>
      </div>

      <div v-if="activeMonitorTab === 'messages'" class="message-list">
        <div v-for="(msg, index) in messages" :key="index" class="message-entry">
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
          <strong class="message-sender">{{ msg.sender }}:</strong>
          <span class="message-text">{{ msg.text }}</span>
        </div>
        <div v-if="messages.length === 0" class="empty-message">
          暂无消息
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const activeMonitorTab = ref('logs')
const logLevel = ref('ALL')
const paused = ref(false)

const logs = ref([])
const tasks = ref([])
const messages = ref([])

const tabs = [
  { id: 'logs', label: '日志' },
  { id: 'tasks', label: '任务' },
  { id: 'messages', label: '消息' }
]

const filteredLogs = computed(() => {
  if (logLevel.value === 'ALL') {
    return logs.value
  }
  return logs.value.filter(log => log.level === logLevel.value)
})

let ws = null

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})

function connectWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const url = `${protocol}//${window.location.host}/ws/status`
  
  ws = new WebSocket(url)
  
  ws.onopen = () => {
    console.log('Monitor WebSocket connected')
    addLog({
      level: 'INFO',
      message: '监控服务已连接',
      timestamp: new Date().toISOString()
    })
  }
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'log':
          addLog(data.payload)
          break
        case 'task':
          addTask(data.payload)
          break
        case 'message':
          addMessage(data.payload)
          break
      }
    } catch (e) {
      console.error('Error parsing WebSocket message:', e)
    }
  }
  
  ws.onclose = () => {
    console.log('Monitor WebSocket disconnected. Retrying in 3 seconds...')
    addLog({
      level: 'WARNING',
      message: '监控服务已断开，3秒后重试...',
      timestamp: new Date().toISOString()
    })
    setTimeout(connectWebSocket, 3000)
  }
  
  ws.onerror = (error) => {
    console.error('Monitor WebSocket error:', error)
    addLog({
      level: 'ERROR',
      message: '监控服务连接错误',
      timestamp: new Date().toISOString()
    })
  }
}

function addLog(log) {
  if (!paused.value) {
    // 只显示 GraphMemory 插件相关的日志
    const message = log.message || ''
    if (message.includes('GraphMemory') || message.includes('graph_memory') || message.includes('astrbot_plugin_GraphMemory')) {
      logs.value.push(log)
      if (logs.value.length > 1000) {
        logs.value.shift()
      }
    }
  }
}

function addTask(task) {
  if (!paused.value) {
    tasks.value.push(task)
    if (tasks.value.length > 100) {
      tasks.value.shift()
    }
  }
}

function addMessage(message) {
  if (!paused.value) {
    messages.value.push(message)
    if (messages.value.length > 100) {
      messages.value.shift()
    }
  }
}

function togglePause() {
  paused.value = !paused.value
}

function clearLogs() {
  if (activeMonitorTab.value === 'logs') {
    logs.value = []
  } else if (activeMonitorTab.value === 'tasks') {
    tasks.value = []
  } else if (activeMonitorTab.value === 'messages') {
    messages.value = []
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString()
}
</script>

<style scoped>
.monitor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.monitor-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  background: rgba(0,0,0,0.05);
  border-radius: 0.5rem;
}

body.dark .monitor-tabs {
  background: rgba(255,255,255,0.05);
}

.monitor-tab {
  flex: 1;
  padding: 0.375rem 0;
  border: none;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
  color: #666;
}

body.dark .monitor-tab {
  color: #999;
}

.monitor-tab.active {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  color: #000;
}

body.dark .monitor-tab.active {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.monitor-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.log-filter {
  flex: 1;
  padding: 0.375rem 0.5rem;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: inherit;
  cursor: pointer;
}

body.dark .log-filter {
  background: rgba(255,255,255,0.05);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.monitor-content {
  flex: 1;
  overflow-y: auto;
  background: rgba(0,0,0,0.03);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

body.dark .monitor-content {
  background: rgba(255,255,255,0.03);
}

.log-list, .task-list, .message-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
}

.log-entry, .task-entry, .message-entry {
  display: flex;
  gap: 0.5rem;
  padding: 0.375rem;
  background: rgba(0,0,0,0.02);
  border-radius: 0.25rem;
}

body.dark .log-entry,
body.dark .task-entry,
body.dark .message-entry {
  background: rgba(255,255,255,0.02);
}

.log-time, .task-time, .message-time {
  color: #999;
  flex-shrink: 0;
}

.log-level {
  flex-shrink: 0;
  font-weight: 600;
}

.log-entry[data-level="INFO"] .log-level {
  color: #60a5fa;
}

.log-entry[data-level="WARNING"] .log-level {
  color: #fcd34d;
}

.log-entry[data-level="ERROR"] .log-level {
  color: #ef4444;
}

.log-message, .task-content, .message-text {
  flex: 1;
  word-break: break-word;
}

.message-sender {
  flex-shrink: 0;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 2rem 0;
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

.btn-secondary {
  background: rgba(0,0,0,0.05);
  color: #666;
}

body.dark .btn-secondary {
  background: rgba(255,255,255,0.05);
  color: #999;
}

.btn-secondary:hover {
  background: rgba(0,0,0,0.1);
}

body.dark .btn-secondary:hover {
  background: rgba(255,255,255,0.1);
}
</style>