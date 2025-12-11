<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in uiStore.toasts" :key="toast.id" :class="['toast', toast.type]">
        <Icon :name="iconMap[toast.type]" class="toast-icon" />
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
        </div>
        <button @click="uiStore.removeToast(toast.id)" class="toast-close">
          <Icon name="x" size="1rem" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import Icon from './Icon.vue'

const uiStore = useUiStore()

const iconMap = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info'
}
</script>

<style scoped>
.toast-container {
  position: fixed; top: 4.5rem; right: 1.5rem;
  z-index: 200; display: flex; flex-direction: column;
  gap: 0.75rem; pointer-events: none;
}
.toast {
  min-width: 20rem; max-width: 24rem;
  padding: 1rem 1.25rem; border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: flex; align-items: flex-start; gap: 0.75rem;
  pointer-events: auto;
}
body.dark .toast {
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.toast-icon {
  flex-shrink: 0; width: 1.25rem; height: 1.25rem; margin-top: 0.125rem;
}
.toast.success .toast-icon { color: #22c55e; }
.toast.error .toast-icon { color: #ef4444; }
.toast.warning .toast-icon { color: #f59e0b; }
.toast.info .toast-icon { color: #3b82f6; }

.toast-content { flex: 1; font-size: 0.875rem; line-height: 1.5; }
.toast-title { font-weight: 600; margin-bottom: 0.25rem; }
.toast-message { color: #666; font-size: 0.8125rem; }
body.dark .toast-message { color: #999; }

.toast-close {
  flex-shrink: 0; width: 1.5rem; height: 1.5rem;
  border: none; background: transparent; cursor: pointer;
  opacity: 0.5; transition: opacity 0.2s; padding: 0;
  display: flex; align-items: center; justify-content: center;
}
.toast-close:hover { opacity: 1; }

.toast-enter-active {
  animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  animation: toastSlideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
}
@keyframes toastSlideIn {
  from { opacity: 0; transform: translateX(100%) scale(0.8); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toastSlideOut {
  to { opacity: 0; transform: translateX(120%) scale(0.9); }
}
</style>