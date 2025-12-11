<template>
  <div class="node-info-panel">
    <div v-if="!graphStore.selectedNode" class="node-info-empty">
      <Icon name="mouse-pointer-2" size="2rem" style="margin: 0 auto 0.75rem; stroke-width: 1;" />
      <p style="font-size: 0.75rem; letter-spacing: 0.05em;">选择一个节点</p>
    </div>
    <div v-else class="node-info-detail">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">{{ graphStore.selectedNode.name }}</h3>
        <div style="display: flex; gap: 0.5rem; font-size: 0.625rem; font-family: 'Courier New', monospace; color: #666;">
          <span style="padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.05); border-radius: 0.25rem;">{{ graphStore.selectedNode.type }}</span>
          <span style="padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.05); border-radius: 0.25rem;">{{ graphStore.selectedNode.id }}</span>
        </div>
      </div>

      <!-- Properties -->
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h4 class="section-title">属性</h4>
          <button @click="toggleEdit" class="icon-btn" title="编辑属性">
            <Icon :name="isEditing ? 'x' : 'edit'" size="0.875rem" />
          </button>
        </div>
        <div v-if="!isEditing">
          <div v-if="hasProperties" class="property-list">
            <div v-for="([key, value]) in Object.entries(graphStore.selectedNode.properties || {})" :key="key" class="property-item">
              <span class="property-key">{{ key }}:</span>
              <span class="property-value">{{ formatValue(value) }}</span>
            </div>
          </div>
          <div v-else class="empty-message">无属性</div>
        </div>
        <div v-else>
          <div v-if="hasEditableProperties" class="edit-form">
            <div v-for="key in editableProps" :key="key" class="form-group">
              <label class="form-label">{{ key }}</label>
              <input 
                v-model="editValues[key]" 
                type="text" 
                class="form-input"
              />
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <button @click="saveProperties" class="btn btn-primary">保存</button>
              <button @click="cancelEdit" class="btn btn-secondary">取消</button>
            </div>
          </div>
          <div v-else class="empty-message">此节点类型无可编辑属性</div>
        </div>
      </div>

      <!-- Observations -->
      <div style="margin-bottom: 1.5rem;">
        <h4 class="section-title">观察</h4>
        <div v-if="hasObservations" class="observation-list">
          <div v-for="(obs, index) in graphStore.selectedNode.observations" :key="index" class="observation-item">
            {{ obs }}
          </div>
        </div>
        <div v-else class="empty-message">无观察</div>
      </div>

      <!-- Connected Nodes -->
      <div style="margin-bottom: 1.5rem;">
        <h4 class="section-title">连接节点</h4>
        <div v-if="neighbors.length > 0" class="neighbor-list">
          <div v-for="neighbor in neighbors" :key="neighbor.link.source + '-' + neighbor.link.target" class="neighbor-item">
            <span @click="selectNeighbor(neighbor.node)" class="neighbor-info">
              <span class="neighbor-name">{{ neighbor.node.name }}</span>
              <span class="neighbor-relation">({{ neighbor.relation }})</span>
            </span>
            <button @click="deleteRelation(neighbor)" class="icon-btn delete-btn" title="删除关系">
              <Icon name="x" size="0.875rem" />
            </button>
          </div>
        </div>
        <div v-else class="empty-message">无连接</div>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05);">
        <button @click="handleDeleteNode" class="btn btn-secondary" style="background: rgba(239,68,68,0.1); color: #ef4444; width: 100%;">
          <Icon name="trash-2" size="0.875rem" />
          <span>删除节点</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import * as api from '@/api'
import Icon from './Icon.vue'

const graphStore = useGraphStore()
const uiStore = useUiStore()

const isEditing = ref(false)
const editValues = ref({})
const editableProps = ['summary', 'type', 'text']

const hasProperties = computed(() => {
  const props = graphStore.selectedNode?.properties
  return props && Object.keys(props).length > 0
})

const hasEditableProperties = computed(() => {
  const props = graphStore.selectedNode?.properties
  if (!props) return false
  return editableProps.some(key => key in props)
})

const hasObservations = computed(() => {
  const obs = graphStore.selectedNode?.observations
  return obs && obs.length > 0
})

const neighbors = computed(() => {
  if (!graphStore.selectedNode) return []
  
  const node = graphStore.selectedNode
  const result = []
  
  graphStore.graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source
    const targetId = typeof link.target === 'object' ? link.target.id : link.target
    
    if (sourceId === node.id || targetId === node.id) {
      const otherId = sourceId === node.id ? targetId : sourceId
      const otherNode = graphStore.graphData.nodes.find(n => n.id === otherId)
      if (otherNode) {
        result.push({
          node: otherNode,
          link: link,
          relation: link.relation || link.label || 'RELATED_TO'
        })
      }
    }
  })
  
  return result
})

watch(() => graphStore.selectedNode, () => {
  isEditing.value = false
  editValues.value = {}
})

function formatValue(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    const props = graphStore.selectedNode.properties || {}
    editValues.value = {}
    editableProps.forEach(key => {
      if (key in props) {
        editValues.value[key] = props[key]
      }
    })
  }
}

function cancelEdit() {
  isEditing.value = false
  editValues.value = {}
}

async function saveProperties() {
  if (!graphStore.selectedNode) return
  
  try {
    await api.updateNode(
      graphStore.selectedNode.type,
      graphStore.selectedNode.id,
      editValues.value
    )
    uiStore.showToast('更新成功', '属性已更新', 'success')
    isEditing.value = false
    await graphStore.loadGraphData(graphStore.currentSessionId)
  } catch (error) {
    console.error('Failed to update node:', error)
    const message = error.response?.data?.detail || '更新失败'
    uiStore.showToast('更新失败', message, 'error')
  }
}

function selectNeighbor(node) {
  graphStore.selectNode(node)
  graphStore.focusNode(node)
}

async function deleteRelation(neighbor) {
  const confirmed = confirm(`确定要删除关系 "${neighbor.relation}" 吗？`)
  if (!confirmed) return
  
  try {
    const link = neighbor.link
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source
    const targetId = typeof link.target === 'object' ? link.target.id : link.target
    const fromNode = graphStore.graphData.nodes.find(n => n.id === sourceId)
    const toNode = graphStore.graphData.nodes.find(n => n.id === targetId)
    
    await api.deleteEdge({
      from_id: sourceId,
      to_id: targetId,
      rel_type: neighbor.relation,
      from_type: fromNode.type,
      to_type: toNode.type
    })
    
    uiStore.showToast('删除成功', '关系已删除', 'success')
    await graphStore.loadGraphData(graphStore.currentSessionId)
  } catch (error) {
    console.error('Failed to delete edge:', error)
    const message = error.response?.data?.detail || '删除失败'
    uiStore.showToast('删除失败', message, 'error')
  }
}

function handleDeleteNode() {
  if (confirm(`确定要删除节点 "${graphStore.selectedNode.name}" 吗？此操作不可撤销。`)) {
    graphStore.deleteSelectedNode()
  }
}
</script>

<style scoped>
.node-info-panel {
  height: 100%;
}

.node-info-empty {
  text-align: center;
  padding: 3rem 0;
  opacity: 0.4;
}

.node-info-detail {
  font-size: 0.875rem;
}

body.dark .node-info-detail span {
  background: rgba(255,255,255,0.05) !important;
}

.section-title {
  font-size: 0.625rem;
  font-weight: 700;
  color: #666;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

body.dark .section-title {
  color: #999;
}

.property-list, .observation-list, .neighbor-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-item {
  font-size: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.property-key {
  color: #999;
  flex-shrink: 0;
}

.property-value {
  word-break: break-word;
}

.observation-item {
  padding: 0.5rem;
  background: rgba(0,0,0,0.03);
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

body.dark .observation-item {
  background: rgba(255,255,255,0.03);
}

.neighbor-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(0,0,0,0.03);
  border-radius: 0.375rem;
  transition: background 0.2s;
  font-size: 0.75rem;
}

body.dark .neighbor-item {
  background: rgba(255,255,255,0.03);
}

.neighbor-item:hover {
  background: rgba(0,0,0,0.06);
}

body.dark .neighbor-item:hover {
  background: rgba(255,255,255,0.06);
}

.neighbor-info {
  cursor: pointer;
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.neighbor-name {
  font-weight: 500;
}

.neighbor-relation {
  color: #999;
  font-size: 0.625rem;
}

.delete-btn {
  color: #ef4444;
}

.empty-message {
  color: #999;
  font-size: 0.75rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.625rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.75rem;
  color: inherit;
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
  background: rgba(0,0,0,0.05);
}

body.dark .icon-btn:hover {
  background: rgba(255,255,255,0.1);
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