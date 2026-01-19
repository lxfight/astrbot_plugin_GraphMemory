<template>
  <div class="login-container">
    <div class="login-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <div class="logo-wrapper">
          <Brain class="logo-icon" :size="48" />
        </div>
        <h1>GraphMemory</h1>
        <p>图谱记忆可视化管理界面</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="key">访问密钥</label>
          <div class="input-wrapper">
            <Key class="input-icon" :size="18" />
            <input
              id="key"
              v-model="key"
              type="password"
              class="input input-with-icon"
              placeholder="请输入访问密钥"
              required
            />
          </div>
        </div>

        <transition name="slide-up">
          <div v-if="error" class="error-message">
            <AlertCircle :size="16" />
            {{ error }}
          </div>
        </transition>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <Loader2 v-if="loading" class="animate-spin" :size="18" />
          <LogIn v-else :size="18" />
          {{ loading ? '验证中...' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        <div class="hint">
          <Info :size="14" />
          <p>访问密钥在插件启动日志中</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { statsApi } from '@/api/stats'
import { Brain, Key, LogIn, Loader2, AlertCircle, Info } from 'lucide-vue-next'

const router = useRouter()
const key = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!key.value.trim()) {
    error.value = '请输入访问密钥'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 保存密钥
    localStorage.setItem('webui_key', key.value)

    // 验证密钥
    await statsApi.getOverview()

    // 验证成功，跳转到主页
    router.push('/')
  } catch (err: any) {
    // 验证失败
    localStorage.removeItem('webui_key')
    error.value = '访问密钥无效'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--color-accent);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-info);
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--color-success);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 20px) scale(0.95);
  }
  75% {
    transform: translate(-20px, -10px) scale(1.02);
  }
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-bg-glass);
  backdrop-filter: var(--backdrop-blur) var(--backdrop-saturate);
  -webkit-backdrop-filter: var(--backdrop-blur) var(--backdrop-saturate);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-gradient);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glow);
}

.logo-icon {
  color: white;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.input-with-icon {
  padding-left: 44px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-error-light);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 20px;
}

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  border-radius: var(--radius-md);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-tertiary);
  font-size: 13px;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
