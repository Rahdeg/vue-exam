import type { RouteLocationNormalized } from "vue-router";

export type MiddlewareResult = string | boolean | void;
export type MiddlewareFunction = (
  to: RouteLocationNormalized
) => Promise<MiddlewareResult> | MiddlewareResult;

export interface MiddlewareContext {
  to: RouteLocationNormalized;
  from?: RouteLocationNormalized;
  next: (result?: MiddlewareResult) => void;
}

export interface MiddlewareOptions {
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  requiresGuest?: boolean;
  redirectTo?: string;
}
