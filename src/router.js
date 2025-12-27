import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from '@/stores/session';
import Login from '@/pages/Login.vue'
import AppLayout from "@/components/Layout/AppLayout.vue";
import Providers from "@/pages/Providers.vue";
import Pos from "@/pages/Pos.vue";
import Stock from "@/pages/Stock.vue";
import Users from "@/pages/Users.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: AppLayout,
      children: [
        {
          path: 'providers',
          component: Providers
        },
        {
          path: 'pos',
          component:Pos
        },
        {
          path: 'stock',
          component: Stock
        },
        {
          path: 'users',
          component: Users
        }
      ]
    }
  ],
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (!session.isLoggedIn && to.name !== 'login') {
    return { name: 'login'}
  }
})

export default router;
