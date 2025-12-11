<template>
  <div class="login-screen">
    <div class="login-box glass">
      <div style="margin-bottom: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h.01"/><path d="M12 8h.01"/><path d="M12 12h.01"/><path d="M12 16h.01"/><path d="M16 12h.01"/><path d="M8 12v-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V12"/><path d="M12 12v-1.5a.5.5 0 0 1 .5-.5h3.5"/><path d="M12 12v1.5a.5.5 0 0 0 .5.5h3.5"/><path d="M12 8v1.5a.5.5 0 0 0 .5.5h3.5"/></svg>
      </div>
      <h2 style="font-size: 1.25rem; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 0.5rem;">图谱记忆</h2>
      <p style="font-size: 0.75rem; color: #999; margin-bottom: 2.5rem; letter-spacing: 0.05em;">可视化知识图谱</p>
      <input
        type="password"
        v-model="apiKey"
        @keyup.enter="handleLogin"
        placeholder="访问密钥"
        class="login-key-input"
      />
      <button @click="handleLogin" class="login-btn">
        <span v-if="!loading">连接</span>
        <div v-else class="loader"></div>
      </button>
      <p v-if="error" class="login-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const apiKey = ref('')
const loading = ref(false)
const error = ref('')

const authStore = useAuthStore()
const uiStore = useUiStore()

async function handleLogin() {
  if (!apiKey.value.trim()) return
  loading.value = true
  error.value = ''
  
  const success = await authStore.login(apiKey.value)
  
  if (!success) {
    error.value = '访问密钥无效或连接失败'
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-screen {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background: #f2f2f2;
}
body.dark .login-screen { background: #080808; }

.login-box {
  padding: 3rem 2.5rem; border-radius: 1rem;
  width: 100%; max-width: 24rem; text-align: center;
}

.login-key-input {
  width: 100%; padding: 0.75rem 1rem;
  border: none; border-bottom: 1px solid #ccc;
  background: transparent; text-align: center;
  font: 0.875rem 'Courier New', monospace;
  letter-spacing: 0.2em; outline: none;
  transition: border-color 0.2s;
  color: #333;
}
.login-key-input:focus { border-bottom-color: #000; }
body.dark .login-key-input { color: #e0e0e0; border-bottom-color: #666; }
body.dark .login-key-input:focus { border-bottom-color: #fff; }

.login-btn {
  width: 100%; padding: 0.75rem; margin-top: 1.5rem;
  background: #000; color: #fff;
  border: none; font-size: 0.75rem; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  cursor: pointer; transition: opacity 0.2s;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-btn:hover { opacity: 0.8; }
body.dark .login-btn { background: #fff; color: #000; }

.login-error {
  margin-top: 1.5rem; color: #ef4444; font-size: 0.75rem;
}
</style>