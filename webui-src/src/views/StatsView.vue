<template>
  <div class="stats-view">
    <div class="view-header">
      <h2>统计分析</h2>
    </div>

    <div class="view-content">
      <transition name="fade" mode="out-in">
        <div v-if="loading" class="loading-state">
          <Loader2 class="spinner" :size="40" />
          <p>加载统计数据...</p>
        </div>
        
        <div v-else class="stats-container">
          <!-- 概览卡片 -->
          <div v-if="stats" class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrapper blue">
                <Database :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">实体总数</div>
                <div class="stat-value">{{ stats.total_entities }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrapper green">
                <GitFork :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">关系总数</div>
                <div class="stat-value">{{ stats.total_relations }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrapper purple">
                <MessageSquare :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">会话数</div>
                <div class="stat-value">{{ stats.total_sessions }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrapper orange">
                <Users :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">用户数</div>
                <div class="stat-value">{{ stats.total_users }}</div>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="charts-container">
            <!-- 实体类型分布饼图 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>实体类型分布</h3>
              </div>
              <div ref="pieChartRef" class="chart"></div>
            </div>

            <!-- 时间线折线图 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>实体创建趋势</h3>
              </div>
              <div ref="lineChartRef" class="chart"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { statsApi } from '@/api/stats'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { Database, GitFork, MessageSquare, Users, Loader2 } from 'lucide-vue-next'

const loading = ref(true)
const stats = ref<any>(null)
const entityTypes = ref<any[] | null>(null)
const timeline = ref<any[] | null>(null)

const pieChartRef = ref<HTMLElement>()
const lineChartRef = ref<HTMLElement>()
let pieChart: ECharts | null = null
let lineChart: ECharts | null = null
const loadStats = async () => {
  loading.value = true
  try {
    const response = await statsApi.getOverview()
    stats.value = response.data
  } catch (err) {
    console.error('Failed to load stats:', err)
  } finally {
    loading.value = false
  }
}

const loadEntityTypes = async () => {
  try {
    const response = await statsApi.getEntityTypes()
    if (response.success && pieChartRef.value) {
      initPieChart(response.data.distribution)
    }
  } catch (err) {
    console.error('Failed to load entity types:', err)
  }
}

const loadTimeline = async () => {
  try {
    const response = await statsApi.getTimeline()
    if (response.success && lineChartRef.value) {
      initLineChart(response.data.timeline)
    }
  } catch (err) {
    console.error('Failed to load timeline:', err)
  }
}

const initPieChart = (distribution: any[]) => {
  console.log('[StatsView] initPieChart called with:', distribution)

  if (!pieChartRef.value) {
    console.error('[StatsView] pieChartRef.value is null')
    return
  }

  if (!distribution || distribution.length === 0) {
    console.warn('[StatsView] No distribution data')
    return
  }

  try {
    // 清理旧实例
    if (pieChart) {
      pieChart.dispose()
      pieChart = null
    }

    console.log('[StatsView] Initializing ECharts on element:', pieChartRef.value)
    pieChart = echarts.init(pieChartRef.value)

    // 获取当前主题颜色变量
    const style = getComputedStyle(document.documentElement)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    // 使用明确的颜色值，确保在两种模式下都可见
    const textColor = isDark ? '#e2e8f0' : '#1f2937'
    const bgColor = isDark ? '#1e293b' : '#ffffff'
    const borderColor = isDark ? '#334155' : '#e5e7eb'

    console.log('[StatsView] Theme:', isDark ? 'dark' : 'light')
    console.log('[StatsView] Theme colors:', { textColor, bgColor, borderColor })

    const chartData = distribution.map((item) => ({
      value: item.count,
      name: item.type,
    }))

    console.log('[StatsView] Chart data:', chartData)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: bgColor,
        borderColor: borderColor,
        textStyle: {
          color: textColor
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: textColor,
          fontSize: 12
        },
      },
      series: [
        {
          name: '实体类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: bgColor,
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
            color: textColor
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              color: textColor
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    }

    pieChart.setOption(option)
    console.log('[StatsView] Pie chart initialized successfully')
  } catch (error) {
    console.error('[StatsView] Failed to initialize pie chart:', error)
  }
}

const initLineChart = (timelineData: any[]) => {
  console.log('[StatsView] initLineChart called with:', timelineData)

  if (!lineChartRef.value) {
    console.error('[StatsView] lineChartRef.value is null')
    return
  }

  if (!timelineData || timelineData.length === 0) {
    console.warn('[StatsView] No timeline data')
    return
  }

  try {
    // 清理旧实例
    if (lineChart) {
      lineChart.dispose()
      lineChart = null
    }

    console.log('[StatsView] Initializing line chart on element:', lineChartRef.value)
    lineChart = echarts.init(lineChartRef.value)

    const dates = timelineData.map((item) => item.date)
    const counts = timelineData.map((item) => item.count)

    console.log('[StatsView] Line chart dates:', dates)
    console.log('[StatsView] Line chart counts:', counts)

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    // 使用明确的颜色值，确保在两种模式下都可见
    const textColorSecondary = isDark ? '#94a3b8' : '#6b7280'
    const borderColor = isDark ? '#334155' : '#e5e7eb'
    const borderLightColor = isDark ? '#1e293b' : '#f3f4f6'
    const accentColor = '#3b82f6'
    const bgColor = isDark ? '#1e293b' : '#ffffff'
    const textColor = isDark ? '#e2e8f0' : '#1f2937'

    console.log('[StatsView] Line chart theme:', isDark ? 'dark' : 'light')
    console.log('[StatsView] Line chart theme colors:', { textColorSecondary, borderColor, accentColor })

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 个实体',
        backgroundColor: bgColor,
        borderColor: borderColor,
        textStyle: {
          color: textColor
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: textColorSecondary,
        },
        axisLine: {
          lineStyle: {
            color: borderColor,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: textColorSecondary,
        },
        axisLine: {
          lineStyle: {
            color: borderColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: borderLightColor,
          },
        },
      },
      series: [
        {
          name: '实体数量',
          type: 'line',
          smooth: true,
          data: counts,
          lineStyle: {
            color: accentColor,
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: accentColor + '40',
                },
                {
                  offset: 1,
                  color: accentColor + '00',
                },
              ],
            },
          },
          itemStyle: {
            color: accentColor,
          },
        },
      ],
    }

    lineChart.setOption(option)
    console.log('[StatsView] Line chart initialized successfully')
  } catch (error) {
    console.error('[StatsView] Failed to initialize line chart:', error)
  }
}

const handleResize = () => {
  pieChart?.resize()
  lineChart?.resize()
}

// 初始化图表的函数
const initCharts = async () => {
  console.log('[StatsView] initCharts called')

  // 等待 DOM 渲染
  await nextTick()
  await nextTick()

  // 等待 transition 动画完成（fade 动画通常是 300ms）
  setTimeout(() => {
    console.log('[StatsView] After transition delay')
    console.log('[StatsView] pieChartRef.value:', pieChartRef.value)
    console.log('[StatsView] lineChartRef.value:', lineChartRef.value)

    if (entityTypes.value && entityTypes.value.length > 0 && pieChartRef.value) {
      console.log('[StatsView] Initializing pie chart')
      initPieChart(entityTypes.value)
    } else {
      console.error('[StatsView] Cannot init pie chart:', {
        hasData: !!(entityTypes.value && entityTypes.value.length > 0),
        hasRef: !!pieChartRef.value
      })
    }

    if (timeline.value && timeline.value.length > 0 && lineChartRef.value) {
      console.log('[StatsView] Initializing line chart')
      initLineChart(timeline.value)
    } else {
      console.error('[StatsView] Cannot init line chart:', {
        hasData: !!(timeline.value && timeline.value.length > 0),
        hasRef: !!lineChartRef.value
      })
    }
  }, 350)
}

// 监听 loading 状态变化
watch(loading, async (newVal, oldVal) => {
  console.log('[StatsView] Loading changed:', { from: oldVal, to: newVal })

  if (oldVal === true && newVal === false) {
    // loading 从 true 变为 false，说明数据加载完成，DOM 即将渲染
    console.log('[StatsView] Loading finished, initializing charts')
    await initCharts()
  }
})

// 主题变化观察器
let themeObserver: MutationObserver | null = null

onMounted(async () => {
  console.log('[StatsView] Component mounted')

  loading.value = true
  try {
    const [statsRes, typesRes, timelineRes] = await Promise.all([
      statsApi.getOverview(),
      statsApi.getEntityTypes(),
      statsApi.getTimeline(),
    ])

    console.log('[StatsView] API responses:', { statsRes, typesRes, timelineRes })

    if (statsRes.success) {
      stats.value = statsRes.data
      console.log('[StatsView] Stats loaded:', stats.value)
    }

    if (typesRes.success) {
      entityTypes.value = typesRes.data.distribution
      console.log('[StatsView] Entity types loaded:', entityTypes.value)
    }

    if (timelineRes.success) {
      timeline.value = timelineRes.data.timeline
      console.log('[StatsView] Timeline loaded:', timeline.value)
    }
  } catch (err) {
    console.error('[StatsView] Failed to load stats data:', err)
  } finally {
    loading.value = false
    console.log('[StatsView] Loading finished')
  }

  // 监听主题变化
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        console.log('[StatsView] Theme changed, reinitializing charts')
        if (pieChart && entityTypes.value) {
          initPieChart(entityTypes.value)
        }
        if (lineChart && timeline.value) {
          initLineChart(timeline.value)
        }
      }
    })
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  themeObserver?.disconnect()
  pieChart?.dispose()
  lineChart?.dispose()
})
</script>

<style scoped>
.stats-view {
  padding: 24px;
  height: 100%;
  overflow: auto;
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
  max-width: 1400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.stat-icon-wrapper.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.stat-icon-wrapper.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.stat-icon-wrapper.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

[data-theme="dark"] .stat-icon-wrapper.blue { background: rgba(59, 130, 246, 0.2); }
[data-theme="dark"] .stat-icon-wrapper.green { background: rgba(16, 185, 129, 0.2); }
[data-theme="dark"] .stat-icon-wrapper.purple { background: rgba(139, 92, 246, 0.2); }
[data-theme="dark"] .stat-icon-wrapper.orange { background: rgba(249, 115, 22, 0.2); }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.chart-card:hover {
  box-shadow: var(--shadow-md);
}

.chart-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.chart {
  width: 100%;
  height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--color-text-secondary);
  gap: 16px;
}

.spinner {
  color: var(--color-info);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
