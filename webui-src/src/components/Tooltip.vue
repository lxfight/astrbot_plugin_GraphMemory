<template>
  <div v-if="graphStore.hoverNode" class="tooltip" :style="tooltipStyle">
    {{ graphStore.hoverNode.name }} ({{ graphStore.hoverNode.type }})
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useGraphStore } from '@/stores/graph'

const graphStore = useGraphStore()
const tooltipStyle = ref({ left: '0px', top: '0px' })

let mouseX = 0
let mouseY = 0

function updateTooltipPosition(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  tooltipStyle.value = {
    left: `${mouseX}px`,
    top: `${mouseY}px`
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateTooltipPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateTooltipPosition)
})
</script>

<style scoped>
.tooltip {
  position: fixed;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  transform: translate(10px, 10px);
}

body.dark .tooltip {
  background: rgba(255, 255, 255, 0.9);
  color: #000;
}
</style>