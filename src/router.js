import { useSessionStore } from '@/stores/session'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/login/index.vue'
import Employees from '@/pages/employees/index.vue'
import AppLayout from '@/components/Layout/AppLayout.vue'
import Pos from '@/pages/pos/Pos.vue'
import Providers from '@/pages/providers/Providers.vue'
import Stock from '@/pages/stock/Stock.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'employees',
        component: Employees
      },
      {
        path: 'pos',
        component: Pos
      },
      {
        path: 'providers',
        component: Providers
      },
      {
        path: 'stock',
        component: Stock
      }
    ]
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
