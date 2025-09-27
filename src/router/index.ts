import { createRouter, createWebHistory } from "vue-router";
import { globalMiddleware } from "@/middleware";
import type { RouteLocationNormalized } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/LandingPage.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthPage.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/chat/:conversationId",
      name: "chat",
      component: () => import("../views/ChatPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminPage.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

// Navigation guards
router.beforeEach(async (to: RouteLocationNormalized) => {
  return await globalMiddleware(to);
});

export default router;
