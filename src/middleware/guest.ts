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

// Guest middleware - redirects authenticated users away from guest-only pages
export async function guestMiddleware(
  to: RouteLocationNormalized
): Promise<MiddlewareResult> {
  await waitForAuth();
  const { isAuthenticated } = useConvexAuth();

  // If user is authenticated and trying to access guest-only pages
  if (isAuthenticated.value && to.meta.requiresGuest) {
    return "/dashboard";
  }

  return true;
}
