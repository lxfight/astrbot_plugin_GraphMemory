<template>
  <div class="relations-view">
    <div class="view-header">
      <h2>关系管理</h2>
    </div>

    <div class="view-content">
      <!-- 过滤器 -->
      <div class="filters">
        <input
          v-model="fromFilter"
          type="text"
          class="input"
          placeholder="起点实体..."
        />
        <input
          v-model="toFilter"
          type="text"
          class="input"
          placeholder="终点实体..."
        />
        <input
          v-model.number="minStrength"
          type="number"
          class="input"
          placeholder="最小强度"
          min="0"
          max="1"
          step="0.1"
          style="width: 150px"
        />
        <button @click="loadRelations" class="btn">搜索</button>
        <button @click="resetFilters" class="btn">重置</button>
      </div>

      <!-- 关系列表 -->
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="relations.length === 0" class="empty">
        <p>暂无关系数据</p>
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>起点实体</th>
              <th>关系</th>
              <th>终点实体</th>
              <th>强度</th>
              <th>证据</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rel, index) in relations" :key="index">
              <td class="entity-name">{{ rel.from }}</td>
              <td class="relation-type">{{ rel.relation }}</td>
              <td class="entity-name">{{ rel.to }}</td>
              <td>
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :style="{ width: `${rel.strength * 100}%` }"
                  ></div>
                  <span class="strength-text">{{ rel.strength.toFixed(2) }}</span>
                </div>
              </td>
              <td class="evidence">{{ rel.evidence || '-' }}</td>
              <td class="timestamp">{{ formatDate(rel.last_updated) }}</td>
              <td>
                <button
                  @click="deleteRelation(rel)"
                  class="btn-action btn-danger"
                  title="删除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { relationApi } from '@/api/relations'

const loading = ref(false)
const error = ref('')
const relations = ref<any[]>([])
const total = ref(0)
const limit = ref(20)
const offset = ref(0)

const fromFilter = ref('')
const toFilter = ref('')
const minStrength = ref(0)

const loadRelations = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {
      limit: limit.value,
      offset: offset.value,
    }

    if (fromFilter.value) {
      params.from_entity = fromFilter.value
    }

    if (toFilter.value) {
      params.to_entity = toFilter.value
    }

    if (minStrength.value > 0) {
      params.min_strength = minStrength.value
    }

    const response = await relationApi.list(params)

    if (response.success) {
      relations.value = response.data.relations
      total.value = response.data.total
    } else {
      error.value = response.message || '加载失败'
    }
  } catch (err: any) {
    error.value = '加载关系列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  fromFilter.value = ''
  toFilter.value = ''
  minStrength.value = 0
  offset.value = 0
  loadRelations()
}

const prevPage = () => {
  if (offset.value >= limit.value) {
    offset.value -= limit.value
    loadRelations()
  }
}

const nextPage = () => {
  if (offset.value + limit.value < total.value) {
    offset.value += limit.value
    loadRelations()
  }
}

const deleteRelation = async (rel: any) => {
  if (!confirm(`确定要删除关系 "${rel.from} -> ${rel.to}" 吗？`)) {
    return
  }

  try {
    const response = await relationApi.delete(rel.from, rel.to)
    if (response.success) {
      alert('删除成功')
      loadRelations()
    } else {
      alert('删除失败: ' + response.message)
    }
  } catch (err: any) {
    alert('删除失败')
    console.error(err)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('zh-CN')
  } catch {
    return dateStr
  }
}

onMounted(() => {
  loadRelations()
})
</script>

<style scoped>
.relations-view {
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
  max-width: 200px;
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
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

.relation-type {
  color: var(--color-accent);
  font-weight: 500;
}

.evidence {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.timestamp {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.strength-bar {
  position: relative;
  width: 100px;
  height: 20px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.strength-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s;
}

.strength-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-primary);
  z-index: 1;
}

.btn-action {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  transition: var(--transition);
}

.btn-action:hover {
  transform: scale(1.2);
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
</style>
