<template>
  <div class="main-container">
    <AppHeader />
    
    <div v-if="uiStore.activeView === 'graph'" class="graph-view">
      <GraphCanvas />
      <BottomControls />
      <RightToolbar />
      <RightPanel />
      <ConnectModeOverlay />
      <SideBar />
    </div>
    <div v-else class="dashboard-container">
      <DashboardView />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SideBar from '@/components/SideBar.vue' // Now the floating card
import GraphCanvas from '@/components/GraphCanvas.vue'
import BottomControls from '@/components/BottomControls.vue'
import RightToolbar from '@/components/RightToolbar.vue'
import RightPanel from '@/components/RightPanel.vue'
import ConnectModeOverlay from '@/components/ConnectModeOverlay.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import useWebSocket from '@/composables/useWebSocket'

const graphStore = useGraphStore()
const uiStore = useUiStore()
const { connectWebSocket } = useWebSocket()

onMounted(async () => {
  await graphStore.fetchContexts()
  await graphStore.loadGraphData()
  connectWebSocket()
})
</script>

<style scoped>
.main-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}
.graph-view {
  height: 100%;
  width: 100%;
  position: relative;
}
.dashboard-container {
  padding-top: 5.5rem; /* Header height + margin */
  height: 100%;
  overflow-y: auto;
}
</style>