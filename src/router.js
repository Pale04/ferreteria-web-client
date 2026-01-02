import { useSessionStore } from '@/stores/session'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/login/index.vue'
import Employees from '@/pages/employees/index.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { 
    path: '/employees', 
    component: Employees,
    meta: { requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const session = useSessionStore()
  
  if (to.meta.requiresAdmin && !session.isAdmin) {
    if (session.isLoggedIn) {
      next('/pos') 
    } else {
      next('/login')
    }
  } 
  else if (to.path !== '/login' && !session.isLoggedIn) {
    next('/login')
  }
  else {
    next()
  }
})

export default router