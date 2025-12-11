<template>
  <div id="app-container">
    <ToastContainer />
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import ToastContainer from '@/components/ToastContainer.vue'

const uiStore = useUiStore()

onMounted(() => {
  // 初始化主题
  uiStore.initializeTheme()
})
</script>

<style>
/* 全局样式可以在这里或 main.css 中定义 */
#app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>