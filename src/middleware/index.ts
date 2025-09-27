import type { RouteLocationNormalized } from "vue-router";
import { authMiddleware } from "./auth";
import { guestMiddleware } from "./guest";
import type { MiddlewareResult } from "./types";

// Define public routes that don't require authentication
export const publicRoutes = ["/auth", "/admin"];
export const adminRoutes = ["/admin"];

// Check if a route is public
export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path.startsWith(route));
}

// Check if a route requires admin access
export function isAdminRoute(path: string): boolean {
  return adminRoutes.some((route) => path.startsWith(route));
}

// Combined middleware that handles all authentication logic
export async function globalMiddleware(
  to: RouteLocationNormalized
): Promise<MiddlewareResult> {
  // First check guest middleware (redirects authenticated users from guest pages)
  const guestResult = await guestMiddleware(to);
  if (guestResult !== true) {
    return guestResult;
  }

  // Then check auth middleware (handles authentication and admin requirements)
  const authResult = await authMiddleware(to);
  if (authResult !== true) {
    return authResult;
  }

  // Allow the route to proceed
  return true;
}

// Export individual middlewares for specific use cases
export { authMiddleware, guestMiddleware };
