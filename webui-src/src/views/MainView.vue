<template>
  <div class="main-app">
    <AppHeader />
    <div class="content-wrapper">
      <SideBar />
      <GraphCanvas />
    </div>
    <BottomControls />
    <RightToolbar />
    <RightPanel />
    <ConnectModeOverlay />
    <Tooltip />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SideBar from '@/components/SideBar.vue'
import GraphCanvas from '@/components/GraphCanvas.vue'
import BottomControls from '@/components/BottomControls.vue'
import RightToolbar from '@/components/RightToolbar.vue'
import RightPanel from '@/components/RightPanel.vue'
import ConnectModeOverlay from '@/components/ConnectModeOverlay.vue'
import Tooltip from '@/components/Tooltip.vue'
import { useGraphStore } from '@/stores/graph'
import useWebSocket from '@/composables/useWebSocket'

const graphStore = useGraphStore()
const { connectWebSocket } = useWebSocket()

onMounted(async () => {
  await graphStore.fetchContexts()
  await graphStore.loadGraphData()
  connectWebSocket()
})
</script>

<style scoped>
.main-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content-wrapper {
  display: flex;
  flex: 1;
  margin-top: 3.5rem; /* Header height */
  height: calc(100vh - 3.5rem);
  overflow: hidden;
}
</style>