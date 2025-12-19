<template>
  <div class="main-layout">
    <!-- 侧边导航栏 -->
    <!-- 移动端顶部导航 -->
    <header class="mobile-header" v-if="isMobile">
      <button @click="toggleSidebar" class="btn btn-icon btn-ghost">
        <Menu :size="24" />
      </button>
      <div class="logo-container">
        <Brain class="logo-icon" :size="28" />
        <h1 class="logo-text">GraphMemory</h1>
      </div>
      <div style="width: 40px"></div> <!-- 占位保持居中 -->
    </header>

    <!-- 侧边导航栏 -->
    <aside :class="['sidebar', { 'sidebar-collapsed': isCollapsed && !isMobile, 'mobile-open': isMobileOpen }]">
      <div class="sidebar-header">
        <div class="logo-container">
          <Brain class="logo-icon" :size="32" />
          <h1 class="logo-text" v-show="!isCollapsed || isMobile">GraphMemory</h1>
        </div>
        <button v-if="!isMobile" @click="toggleSidebar" class="btn btn-icon btn-ghost toggle-btn">
          <ChevronLeft v-if="!isCollapsed" :size="20" />
          <ChevronRight v-else :size="20" />
        </button>
      </div>

      <nav class="nav-menu">
        <router-link to="/graph" class="nav-item" title="图谱" @click="isMobileOpen = false">
          <Share2 :size="22" />
          <span v-show="!isCollapsed || isMobile">图谱概览</span>
        </router-link>
        <router-link to="/entities" class="nav-item" title="实体" @click="isMobileOpen = false">
          <Database :size="22" />
          <span v-show="!isCollapsed || isMobile">实体列表</span>
        </router-link>
        <router-link to="/relations" class="nav-item" title="关系" @click="isMobileOpen = false">
          <GitFork :size="22" />
          <span v-show="!isCollapsed || isMobile">关系管理</span>
        </router-link>
        <router-link to="/search" class="nav-item" title="搜索" @click="isMobileOpen = false">
          <Search :size="22" />
          <span v-show="!isCollapsed || isMobile">全库搜索</span>
        </router-link>
        <router-link to="/stats" class="nav-item" title="统计" @click="isMobileOpen = false">
          <BarChart2 :size="22" />
          <span v-show="!isCollapsed || isMobile">数据统计</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/system" class="nav-item" title="系统" @click="isMobileOpen = false">
          <Settings :size="22" />
          <span v-show="!isCollapsed || isMobile">系统设置</span>
        </router-link>
        
        <button @click="toggleTheme" class="nav-item theme-btn" title="切换主题">
          <Sun v-if="theme === 'light'" :size="22" />
          <Moon v-else :size="22" />
          <span v-show="!isCollapsed || isMobile">{{ theme === 'light' ? '日间模式' : '夜间模式' }}</span>
        </button>

        <button @click="handleLogout" class="nav-item logout-btn" title="退出登录">
          <LogOut :size="22" />
          <span v-show="!isCollapsed || isMobile">退出登录</span>
        </button>

        <div class="author-info" v-show="!isCollapsed || isMobile">
          <p>Plugin by lxfight</p>
          <p>AstrBot by Soulter</p>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  <div class="sidebar-overlay" @click="isMobileOpen = false" v-if="isMobileOpen"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import {
  Brain,
  Share2,
  Database,
  GitFork,
  Search,
  BarChart2,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-vue-next'

const router = useRouter()
const { theme, toggleTheme } = useTheme()

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
const isMobile = ref(window.innerWidth <= 768)

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

const toggleSidebar = () => {
  if (isMobile.value) {
    isMobileOpen.value = !isMobileOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

const handleLogout = () => {
  localStorage.removeItem('webui_key')
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--color-bg-secondary);
}

/* 移动端Header */
.mobile-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 40;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  box-shadow: var(--shadow-md);
}

.sidebar-collapsed {
  width: 72px;
}

/* 适配移动端的Main Layout */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  color: var(--color-info);
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.toggle-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
}

.nav-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.nav-item.router-link-active {
  background: var(--color-bg-tertiary);
  color: var(--color-info);
  font-weight: 600;
}

.nav-item :deep(svg) {
  flex-shrink: 0;
}

/* 底部区域 */
.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logout-btn:hover {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.author-info {
  margin-top: 12px;
  padding: 8px 12px;
  font-size: 11px;
  color: var(--color-text-tertiary);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.author-info p {
  margin-bottom: 2px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: var(--color-bg-secondary);
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    width: 260px !important;
    transition: transform 0.3s ease-in-out;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: var(--shadow-xl);
  }

  .main-content {
    margin-left: 0 !important;
  }
  
  /* 添加移动端遮罩层 */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    display: none;
  }
  
  .sidebar.mobile-open + .sidebar-overlay {
    display: block;
  }
}
</style>
