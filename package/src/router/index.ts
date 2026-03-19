import { createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import { useAuthStore } from "@/stores/auth";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/auth/login2",
      component: () => import("@/views/authentication/LoginPageV2.vue"),
      meta: { requiresAuth: false },
    },

    {
      path: "/auth/register2",
      component: () => import("@/views/authentication/auth2/Register.vue"),
      meta: { requiresAuth: false },
    },

    {
      path: "/auth/callback",
      component: () => import("@/views/authentication/auth2/AuthCallback.vue"),
      meta: { requiresAuth: false },
    },

    ...MainRoutes,

  ],
});

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth === true);
  const requiresAdmin = to.matched.some((r) => r.meta.requiresAdmin === true);

  const authStore = useAuthStore();

  if (requiresAuth && !authStore.token) {
    return { path: "/auth/login2", query: to.path !== "/" ? { redirect: to.fullPath } : {} };
  }

  if (requiresAdmin) {
    if (!authStore.token) {
      return { path: "/auth/login2", query: { redirect: to.fullPath } };
    }
    if (!authStore.user) {
      await authStore.fetchMe();
    }
    if (!authStore.isAdmin) {
      return { path: "/" };
    }
  }

  return true;
});
