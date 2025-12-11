<template>
  <i :data-lucide="name" :style="style"></i>
</template>

<script setup>
import { defineProps, computed, onMounted, onUpdated, watch, nextTick } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '1rem'
  }
})

const style = computed(() => ({
  width: props.size,
  height: props.size
}))

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

onMounted(() => {
  nextTick(() => createIcons())
})

onUpdated(() => {
  nextTick(() => createIcons())
})

watch(() => props.name, () => {
  nextTick(() => createIcons())
})
</script>