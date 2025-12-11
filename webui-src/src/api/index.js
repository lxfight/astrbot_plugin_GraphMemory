import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器，用于附加认证 token
apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('session_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// --- 认证 ---
export const login = (key) => apiClient.post('/login', { key })
export const checkSession = () => apiClient.get('/contexts') // 使用一个需要认证的端点来检查会话

// --- 图数据 ---
export const getContexts = () => apiClient.get('/contexts')
export const getGraphData = (sessionId) => {
  const url = (sessionId && sessionId !== 'global')
    ? `/graph?session_id=${encodeURIComponent(sessionId)}`
    : '/graph'
  return apiClient.get(url)
}
export const debugSearch = (query, sessionId) => apiClient.get(`/debug_search?q=${encodeURIComponent(query)}&session_id=${encodeURIComponent(sessionId)}`)

// --- 节点和边操作 ---
export const deleteNode = (nodeType, nodeId) => apiClient.delete(`/node/${nodeType}/${nodeId}`)
export const updateNode = (nodeType, nodeId, properties) => apiClient.patch(`/node/${nodeType}/${nodeId}`, properties)
export const createNode = (nodeType, properties) => apiClient.post('/node', { node_type: nodeType, properties })

export const deleteEdge = (params) => {
  const queryParams = new URLSearchParams({
    from_id: params.from_id,
    to_id: params.to_id,
    rel_type: params.rel_type,
    from_type: params.from_type,
    to_type: params.to_type
  })
  return apiClient.delete(`/edge?${queryParams.toString()}`)
}
export const createEdge = (payload) => apiClient.post('/edge', payload)

// --- 批量操作 ---
export const batchDelete = (taskName, params = {}) => apiClient.post('/batch-delete', { task_name: taskName, params })
export const linkEntityToSession = (sessionId, entityName) => apiClient.post('/link', { session_id: sessionId, entity_name: entityName })