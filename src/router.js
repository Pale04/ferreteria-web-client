import { useSessionStore } from "@/stores/session";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/login/index.vue";
import Employees from "@/pages/employees/Employees.vue";
import AppLayout from "@/components/Layout/AppLayout.vue";
import Pos from "@/pages/pos/Pos.vue";
import Providers from "@/pages/providers/Providers.vue";
import Stock from "@/pages/stock/Stock.vue";
import Purchases from "@/pages/purchases/index.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "employees",
        component: Employees,
        meta: { requiresAdmin: true },
      },
      {
        path: "pos",
        component: Pos,
      },
      {
        path: "providers",
        component: Providers,
      },
      {
        path: "stock",
        component: Stock,
      },
      {
        path: "/stock/category/:id",
        component: () => import("@/pages/stock/CategoryProducts.vue"),
      },
      {
        path: "purchases",
        component: Purchases,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const session = useSessionStore();

  if (to.path !== "/login" && !session.isLoggedIn) {
    next("/login");
  } else if (to.meta.requiresAdmin && !session.isAdmin) {
    next("/pos");
  } else {
    next();
  }
});

export default router;
