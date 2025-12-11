import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // --- State ---
  const isDark = ref(false)
  const sidebarOpen = ref(true)
  const activeTab = ref('info')
  const activeView = ref('graph') // 'graph' or 'dashboard'
  const toasts = ref([])
  const openPanels = ref([])
  const panelData = ref({})
  let toastId = 0

  // --- Getters ---
  const theme = computed(() => isDark.value ? 'dark' : 'light')

  // --- Actions ---
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme !== 'light'
    document.body.classList.toggle('dark', isDark.value)
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', theme.value)
    document.body.classList.toggle('dark', isDark.value)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function switchTab(tabName) {
    activeTab.value = tabName
  }

  function switchView(viewName) {
    if (['graph', 'dashboard'].includes(viewName)) {
      activeView.value = viewName
    }
  }

  function showToast(title, message, type = 'info', duration = 4000) {
    const id = toastId++
    toasts.value.push({ id, title, message, type })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function togglePanel(panelId, data = null) {
    const index = openPanels.value.indexOf(panelId)
    if (index > -1) {
      // 关闭面板
      openPanels.value.splice(index, 1)
      delete panelData.value[panelId]
    } else {
      // 打开面板
      openPanels.value.push(panelId)
      if (data) {
        panelData.value[panelId] = data
      }
    }
  }

  function closePanel(panelId) {
    const index = openPanels.value.indexOf(panelId)
    if (index > -1) {
      openPanels.value.splice(index, 1)
      delete panelData.value[panelId]
    }
  }

  function closeAllPanels() {
    openPanels.value = []
    panelData.value = {}
  }

  return {
    isDark,
    sidebarOpen,
    activeTab,
    activeView,
    toasts,
    openPanels,
    panelData,
    theme,
    initializeTheme,
    toggleTheme,
    toggleSidebar,
    switchTab,
    switchView,
    showToast,
    removeToast,
    togglePanel,
    closePanel,
    closeAllPanels
  }
})