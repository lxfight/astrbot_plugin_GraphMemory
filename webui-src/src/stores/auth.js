import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '@/api'
import { useUiStore } from './ui'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const sessionChecked = ref(false)
  const router = useRouter()
  const uiStore = useUiStore()

  async function login(key) {
    try {
      const response = await api.login(key)
      if (response.data.token) {
        sessionStorage.setItem('session_token', response.data.token)
        isLoggedIn.value = true
        router.push({ name: 'main' })
        return true
      } else {
        // 如果后端没有返回 token，也视为登录失败
        throw new Error("服务器未返回有效的 token");
      }
    } catch (error) {
      console.error('Login failed:', error)
      const message = error.response?.data?.detail || '登录失败'
      uiStore.showToast('登录失败', message, 'error')
      // 登录失败时，确保状态被清理
      isLoggedIn.value = false
      sessionStorage.removeItem('session_token')
      document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      return false
    }
  }

  function logout() {
    isLoggedIn.value = false
    sessionStorage.removeItem('session_token')
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push({ name: 'login' })
  }

  async function checkSession() {
    const token = sessionStorage.getItem('session_token')
    if (token) {
      try {
        await api.checkSession()
        isLoggedIn.value = true
      } catch (error) {
        console.error('Session check failed:', error)
        // 会话验证失败时，执行完整的登出逻辑
        logout()
      }
    } else {
      isLoggedIn.value = false
    }
    sessionChecked.value = true
  }

  return { isLoggedIn, sessionChecked, login, logout, checkSession }
})