import { ref } from 'vue'

const logs = ref([])
const tasks = ref([])
const messages = ref([])
let ws = null

export default function useWebSocket() {
  function connectWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}/ws/status`
    ws = new WebSocket(url)

    ws.onopen = () => {
      console.log('WebSocket connected')
      addLog({ level: 'INFO', message: '监控服务已连接。' })
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'log':
            addLog(data.payload)
            break
          case 'task':
            tasks.value.push(data.payload)
            break
          case 'message':
            messages.value.push(data.payload)
            break
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected. Retrying in 3 seconds...')
      addLog({ level: 'WARNING', message: '监控服务已断开，3秒后重试...' })
      setTimeout(connectWebSocket, 3000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      addLog({ level: 'ERROR', message: '监控服务连接错误。' })
      ws.close()
    }
  }

  function addLog(log) {
    logs.value.push({ ...log, timestamp: log.timestamp || new Date().toISOString() })
  }

  return {
    logs,
    tasks,
    messages,
    connectWebSocket
  }
}