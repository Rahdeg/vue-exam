import { useConvexAuth } from "../composables/useConvex";
import type { RouteLocationNormalized } from "vue-router";
import type { MiddlewareResult } from "./types";

// Wait for authentication to load
async function waitForAuth() {
  const { isLoading } = useConvexAuth();

  // Wait for auth to load, but with a timeout to prevent infinite waiting
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait time

  while (isLoading.value && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
}

// Check if user is authenticated
export async function checkAuth(): Promise<boolean> {
  await waitForAuth();
  const { isAuthenticated } = useConvexAuth();
  return isAuthenticated.value;
}

// Check if user is admin (you can implement this based on your user roles)
export async function checkAdmin(): Promise<boolean> {
  await waitForAuth();
  const { isAuthenticated, user } = useConvexAuth();

  if (!isAuthenticated.value || !user.value) {
    return false;
  }

  // Add your admin check logic here
  // For now, we'll assume all authenticated users can access admin
  // In a real app, you'd check user roles or permissions
  return true;
}

// Auth middleware
export async function authMiddleware(
  to: RouteLocationNormalized
): Promise<MiddlewareResult> {
  const isAuthenticated = await checkAuth();

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return "/auth";
  }

  // If route requires admin and user is not admin
  if (to.meta.requiresAdmin && !(await checkAdmin())) {
    return "/auth";
  }

  // If route requires guest (like auth pages) and user is authenticated
  if (to.meta.requiresGuest && isAuthenticated) {
    return "/dashboard";
  }

  return true;
}
