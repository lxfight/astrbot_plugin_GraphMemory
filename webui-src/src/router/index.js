import { createRouter, createWebHashHistory } from 'vue-router'
import GraphView from '../views/GraphView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: GraphView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 首次进入或刷新时检查会话
  if (!authStore.sessionChecked) {
    await authStore.checkSession()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    next({ name: 'main' })
  } else {
    next()
  }
})

export default router