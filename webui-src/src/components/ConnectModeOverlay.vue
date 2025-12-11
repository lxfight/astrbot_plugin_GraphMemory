<template>
  <transition name="overlay-fade">
    <div v-if="graphStore.isConnecting" class="connect-mode-overlay">
      <div class="connect-mode-banner">
        <div class="banner-icon">
          <Icon name="share-2" size="1.5rem" />
        </div>
        <div class="banner-content">
          <div class="banner-title">连接模式已激活</div>
          <div class="banner-desc">
            <template v-if="!graphStore.connectionStartNode">
              点击第一个节点作为起始节点
            </template>
            <template v-else>
              已选择 <strong>{{ graphStore.connectionStartNode.name }}</strong>，点击第二个节点完成连接
            </template>
          </div>
        </div>
        <button @click="cancelConnectMode" class="banner-close">
          <Icon name="x" size="1.25rem" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useGraphStore } from '@/stores/graph'
import { useUiStore } from '@/stores/ui'
import Icon from './Icon.vue'

const graphStore = useGraphStore()
const uiStore = useUiStore()

function cancelConnectMode() {
  graphStore.isConnecting = false
  graphStore.connectionStartNode = null
  graphStore.highlightNodes.clear()
  uiStore.closePanel('connect')
}
</script>

<style scoped>
.connect-mode-overlay {
  position: fixed;
  top: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  pointer-events: none;
}

.connect-mode-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(96, 165, 250, 0.95);
  color: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.4);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  min-width: 400px;
}

body.dark .connect-mode-banner {
  background: rgba(96, 165, 250, 0.9);
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.5);
}

.banner-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.banner-desc {
  font-size: 0.75rem;
  opacity: 0.9;
}

.banner-desc strong {
  font-weight: 600;
  text-decoration: underline;
}

.banner-close {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.375rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.banner-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: all 0.3s ease;
}

.overlay-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-1rem);
}

.overlay-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-1rem);
}
</style>