<template>
  <div class="dashboard-view">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="database" size="1.5rem" />
        </div>
        <div class="stat-content">
          <div class="stat-label">总节点数</div>
          <div class="stat-value">{{ graphStore.nodeCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="git-branch" size="1.5rem" />
        </div>
        <div class="stat-content">
          <div class="stat-label">总边数</div>
          <div class="stat-value">{{ graphStore.edgeCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="message-circle" size="1.5rem" />
        </div>
        <div class="stat-content">
          <div class="stat-label">会话数量</div>
          <div class="stat-value">{{ graphStore.contexts.length }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="activity" size="1.5rem" />
        </div>
        <div class="stat-content">
          <div class="stat-label">系统状态</div>
          <div class="stat-value status online">
            运行中
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="section">
        <h2 class="section-title">
          <Icon name="list" size="1.25rem" />
          <span>最近会话</span>
        </h2>
        <div class="session-list">
          <div 
            v-for="context in recentContexts" 
            :key="context.session_id"
            class="session-item"
            @click="navigateToGraph(context.session_id)"
          >
            <div class="session-info">
              <div class="session-name">{{ context.session_id }}</div>
              <div class="session-meta">
                <span>{{ context.node_count }} 节点</span>
                <span>{{ context.edge_count }} 边</span>
              </div>
            </div>
            <Icon name="chevron-right" size="1rem" />
          </div>
          <div v-if="recentContexts.length === 0" class="empty-state">
            <Icon name="inbox" size="2rem" />
            <p>暂无会话数据</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">
          <Icon name="zap" size="1.25rem" />
          <span>快速操作</span>
        </h2>
        <div class="quick-actions">
          <button @click="navigateToGraph()" class="action-btn">
            <Icon name="network" size="1.25rem" />
            <span>进入图谱</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import Icon from '@/components/Icon.vue'

const graphStore = useGraphStore()
const uiStore = useUiStore()

const recentContexts = computed(() => {
  return graphStore.contexts.slice(0, 5)
})

const navigateToGraph = (sessionId = null) => {
  if (sessionId) {
    graphStore.loadGraphData(sessionId)
  }
  uiStore.switchView('graph')
}


onMounted(async () => {
  // Data is likely already fetched by the main GraphView
  if (graphStore.contexts.length === 0) {
    await graphStore.fetchContexts()
  }
})
</script>

<style scoped>
.dashboard-view {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

body.dark .stat-card {
  background: #0f0f0f;
  border-color: rgba(255,255,255,0.08);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

body.dark .stat-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

body.dark .stat-icon {
  background: rgba(255,255,255,0.04);
  color: #e0e0e0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #000;
}

body.dark .stat-value {
  color: #fff;
}

.stat-value.status {
  font-size: 1.25rem;
  color: #ef4444;
}

.stat-value.status.online {
  color: #10b981;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

.section {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(0,0,0,0.08);
}

body.dark .section {
  background: #0f0f0f;
  border-color: rgba(255,255,255,0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #000;
}

body.dark .section-title {
  color: #fff;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0,0,0,0.02);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

body.dark .session-item {
  background: rgba(255,255,255,0.02);
}

.session-item:hover {
  background: rgba(0,0,0,0.04);
  transform: translateX(4px);
}

body.dark .session-item:hover {
  background: rgba(255,255,255,0.04);
}

.session-info {
  flex: 1;
}

.session-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
}

body.dark .session-name {
  color: #e0e0e0;
}

.session-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.empty-state p {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

body.dark .action-btn {
  background: rgba(255,255,255,0.02);
  border-color: rgba(255,255,255,0.08);
  color: #e0e0e0;
}

.action-btn:hover {
  background: rgba(0,0,0,0.04);
  border-color: rgba(0,0,0,0.12);
  color: #000;
  transform: translateY(-2px);
}

body.dark .action-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.12);
  color: #fff;
}
</style>