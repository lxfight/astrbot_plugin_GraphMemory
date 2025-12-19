<template>
  <div class="entities-view">
    <div class="view-header">
      <h2>实体管理</h2>
    </div>

    <div class="view-content">
      <!-- 搜索和过滤 -->
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          class="input"
          placeholder="搜索实体名称..."
          @input="handleSearch"
        />
        <select v-model="typeFilter" class="select" @change="loadEntities">
          <option value="">所有类型</option>
          <option value="人物">人物</option>
          <option value="地点">地点</option>
          <option value="事物">事物</option>
          <option value="概念">概念</option>
          <option value="事件">事件</option>
        </select>
        <select v-model="sortBy" class="select" @change="loadEntities">
          <option value="importance">按重要性</option>
          <option value="access_count">按访问次数</option>
          <option value="created_at">按创建时间</option>
        </select>
        <button @click="loadEntities" class="btn">刷新</button>
      </div>

      <!-- 实体列表 -->
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="entities.length === 0" class="empty">
        <p>暂无实体数据</p>
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>重要性</th>
              <th>访问次数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entity in entities" :key="entity.name">
              <td class="entity-name">{{ entity.name }}</td>
              <td>
                <span class="type-badge" :class="`type-${entity.type.toLowerCase()}`">
                  {{ entity.type }}
                </span>
              </td>
              <td class="description">{{ entity.description }}</td>
              <td>
                <div class="importance-bar" :title="`重要性: ${entity.importance}`">
                  <div
                    class="importance-fill"
                    :style="{ width: `${entity.importance * 100}%` }"
                  ></div>
                  <span class="importance-text">{{ entity.importance.toFixed(2) }}</span>
                </div>
              </td>
              <td>{{ entity.access_count }}</td>
              <td>
                <div class="actions">
                  <button @click="viewEntity(entity)" class="btn-action" title="查看详情">
                    <Eye :size="16" />
                  </button>
                  <button
                    @click="deleteEntity(entity)"
                    class="btn-action btn-danger"
                    title="删除"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="total > limit" class="pagination">
        <button
          @click="prevPage"
          class="btn btn-sm"
          :disabled="offset === 0"
        >
          上一页
        </button>
        <span class="page-info">
          {{ Math.floor(offset / limit) + 1 }} / {{ Math.ceil(total / limit) }}
        </span>
        <button
          @click="nextPage"
          class="btn btn-sm"
          :disabled="offset + limit >= total"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 实体详情对话框 -->
    <div v-if="selectedEntity" class="modal" @click.self="selectedEntity = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>实体详情</h3>
          <button @click="selectedEntity = null" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>基本信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">名称:</span>
                <span class="value">{{ selectedEntity.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">类型:</span>
                <span class="value">{{ selectedEntity.type }}</span>
              </div>
              <div class="detail-item">
                <span class="label">描述:</span>
                <span class="value">{{ selectedEntity.description }}</span>
              </div>
              <div class="detail-item">
                <span class="label">重要性:</span>
                <span class="value">{{ selectedEntity.importance.toFixed(2) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">访问次数:</span>
                <span class="value">{{ selectedEntity.access_count }}</span>
              </div>
              <div class="detail-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ selectedEntity.created_at }}</span>
              </div>
              <div class="detail-item">
                <span class="label">最后访问:</span>
                <span class="value">{{ selectedEntity.last_accessed }}</span>
              </div>
            </div>
          </div>

          <div v-if="entityDetails" class="detail-section">
            <h4>关系 ({{ entityDetails.relations?.length || 0 }})</h4>
            <div v-if="entityDetails.relations?.length" class="relations-list">
              <div
                v-for="(rel, index) in entityDetails.relations"
                :key="index"
                class="relation-item"
              >
                <span class="relation-arrow">{{ rel.direction === 'outgoing' ? '→' : '←' }}</span>
                <span class="relation-target">{{ rel.to || rel.from }}</span>
                <span class="relation-type">{{ rel.relation }}</span>
              </div>
            </div>
            <p v-else class="empty-text">暂无关系</p>
          </div>

          <div v-if="entityDetails" class="detail-section">
            <h4>提及记录 ({{ entityDetails.mentioned_in?.length || 0 }})</h4>
            <div v-if="entityDetails.mentioned_in?.length" class="mentions-list">
              <div
                v-for="(mention, index) in entityDetails.mentioned_in"
                :key="index"
                class="mention-item"
              >
                <span class="mention-session">{{ mention.session_name }}</span>
                <span class="mention-count">{{ mention.mention_count }} 次</span>
              </div>
            </div>
            <p v-else class="empty-text">暂无提及记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { entityApi } from '@/api/entities'
import { Eye, Trash2 } from 'lucide-vue-next'

const loading = ref(false)
const error = ref('')
const entities = ref<any[]>([])
const total = ref(0)
const limit = ref(20)
const offset = ref(0)

const searchQuery = ref('')
const typeFilter = ref('')
const sortBy = ref('importance')

const selectedEntity = ref<any>(null)
const entityDetails = ref<any>(null)

let searchTimeout: any = null

const loadEntities = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {
      limit: limit.value,
      offset: offset.value,
      sort_by: sortBy.value,
      order: 'desc',
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (typeFilter.value) {
      params.type = typeFilter.value
    }

    const response = await entityApi.list(params)

    if (response.success) {
      entities.value = response.data.entities
      total.value = response.data.total
    } else {
      error.value = response.message || '加载失败'
    }
  } catch (err: any) {
    error.value = '加载实体列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    offset.value = 0
    loadEntities()
  }, 500)
}

const prevPage = () => {
  if (offset.value >= limit.value) {
    offset.value -= limit.value
    loadEntities()
  }
}

const nextPage = () => {
  if (offset.value + limit.value < total.value) {
    offset.value += limit.value
    loadEntities()
  }
}

const viewEntity = async (entity: any) => {
  selectedEntity.value = entity
  entityDetails.value = null

  try {
    const response = await entityApi.get(entity.name)
    if (response.success) {
      entityDetails.value = response.data
    }
  } catch (err) {
    console.error('Failed to load entity details:', err)
  }
}

const deleteEntity = async (entity: any) => {
  if (!confirm(`确定要删除实体 "${entity.name}" 吗？`)) {
    return
  }

  try {
    const response = await entityApi.delete(entity.name)
    if (response.success) {
      alert('删除成功')
      loadEntities()
    } else {
      alert('删除失败: ' + response.message)
    }
  } catch (err: any) {
    alert('删除失败')
    console.error(err)
  }
}

onMounted(() => {
  loadEntities()
})
</script>

<style scoped>
.entities-view {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-header {
  margin-bottom: 24px;
}

.view-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.view-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  width: 100%;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filters .input {
  flex: 1;
  max-width: 300px;
}

.select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filters .input {
    max-width: 100%;
  }

  .entities-view {
    padding: 16px;
  }
  
  /* 移动端表格优化：保持水平滚动 */
  .table-container {
    margin: 0 -16px; /* 负边距抵消 padding */
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  
  .table th, .table td {
    white-space: nowrap; /* 强制不换行 */
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-primary);
}

.table thead {
  position: sticky;
  top: 0;
  background: var(--color-bg-secondary);
  z-index: 1;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-light);
}

.table tbody tr:hover {
  background: var(--color-bg-hover);
}

.entity-name {
  font-weight: 500;
}

.description {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.type-person { background: #dbeafe; color: #1e40af; }
.type-place { background: #d1fae5; color: #065f46; }
.type-thing { background: #fef3c7; color: #92400e; }
.type-concept { background: #e9d5ff; color: #6b21a8; }
.type-event { background: #fee2e2; color: #991b1b; }

[data-theme="dark"] .type-person { background: #1e3a8a; color: #bfdbfe; }
[data-theme="dark"] .type-place { background: #064e3b; color: #a7f3d0; }
[data-theme="dark"] .type-thing { background: #78350f; color: #fde68a; }
[data-theme="dark"] .type-concept { background: #581c87; color: #e9d5ff; }
[data-theme="dark"] .type-event { background: #7f1d1d; color: #fecaca; }

.importance-bar {
  position: relative;
  width: 100px;
  height: 20px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.importance-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s;
}

.importance-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-primary);
  z-index: 1;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: var(--transition-all);
}

.btn-action:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.btn-danger {
  color: var(--color-text-secondary);
}

.btn-danger:hover {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
}

.page-info {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.loading,
.error,
.empty {
  padding: 48px;
  text-align: center;
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-error);
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.btn-close {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.btn-close:hover {
  color: var(--color-text-primary);
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-tertiary);
}

.detail-item .value {
  font-size: 14px;
  color: var(--color-text-primary);
  word-break: break-word;
}

.relations-list,
.mentions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-item,
.mention-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.relation-arrow {
  font-size: 16px;
  color: var(--color-text-tertiary);
}

.relation-target {
  font-weight: 500;
  color: var(--color-text-primary);
}

.relation-type {
  color: var(--color-text-secondary);
}

.mention-session {
  flex: 1;
  color: var(--color-text-primary);
}

.mention-count {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.empty-text {
  font-size: 13px;
  color: var(--color-text-tertiary);
  font-style: italic;
}
</style>
