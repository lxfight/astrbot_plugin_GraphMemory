<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <Icon name="brain" size="1.5rem" />
        <span class="logo-text">GraphMemory</span>
      </div>
      <div class="version">v2.0.0</div>
    </div>

    <nav class="nav-menu">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'active': isActive(item.path) }"
      >
        <Icon :name="item.icon" size="1.25rem" />
        <span class="nav-text">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="toggleTheme" class="theme-toggle" :title="uiStore.isDark ? '切换到亮色模式' : '切换到暗色模式'">
        <Icon :name="uiStore.isDark ? 'sun' : 'moon'" size="1.125rem" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import Icon from '@/components/Icon.vue'

const route = useRoute()
const uiStore = useUiStore()

const menuItems = [
  { path: '/dashboard', label: '仪表板', icon: 'layout-dashboard' },
  { path: '/graph', label: '图谱', icon: 'network' }
]

const isActive = (path) => {
  return route.path.startsWith(path)
}

const toggleTheme = () => {
  uiStore.toggleTheme()
}
</script>

<style scoped>
.sidebar {
  width: 16rem;
  background: #fff;
  border-right: 1px solid rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

body.dark .sidebar {
  background: #0a0a0a;
  border-right-color: rgba(255,255,255,0.08);
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

body.dark .sidebar-header {
  border-bottom-color: rgba(255,255,255,0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
}

body.dark .logo {
  color: #fff;
}

.logo-text {
  /* Inherits color from .logo */
}

.version {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #999;
  padding-left: 2.25rem;
}

.nav-menu {
  flex: 1;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
}

body.dark .nav-item {
  color: #999;
}

.nav-item:hover {
  background: rgba(0,0,0,0.04);
  color: #000;
}

body.dark .nav-item:hover {
  background: rgba(255,255,255,0.04);
  color: #fff;
}

.nav-item.active {
  background: rgba(0,0,0,0.08);
  color: #000;
}

body.dark .nav-item.active {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

.nav-text {
  flex: 1;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
}

body.dark .sidebar-footer {
  border-top-color: rgba(255,255,255,0.08);
}

.theme-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: none;
  background: rgba(0,0,0,0.04);
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

body.dark .theme-toggle {
  background: rgba(255,255,255,0.04);
  color: #999;
}

.theme-toggle:hover {
  background: rgba(0,0,0,0.08);
  color: #000;
}

body.dark .theme-toggle:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
</style>