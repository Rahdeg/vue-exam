import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import type { Value } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

const CustomPassword = Password<DataModel>({
  profile(params: Record<string, Value | undefined>) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google, CustomPassword],
});

// Custom auth mutations for Vue.js frontend
export const signInMutation = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    flow: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This is a placeholder - in a real implementation, you'd handle password authentication
    // For now, we'll just return a success response
    return { success: true, message: "Sign in successful" };
  },
});

export const signUpMutation = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    flow: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This is a placeholder - in a real implementation, you'd handle user registration
    // For now, we'll just return a success response
    return { success: true, message: "Sign up successful" };
  },
});

export const signInAction = action({
  args: {
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    // This is a placeholder - in a real implementation, you'd handle OAuth authentication
    // For now, we'll just return a success response
    return { success: true, message: `${args.provider} sign in successful` };
  },
});

export const signUpAction = action({
  args: {
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    // This is a placeholder - in a real implementation, you'd handle OAuth registration
    // For now, we'll just return a success response
    return { success: true, message: `${args.provider} sign up successful` };
  },
});

export const signOutAction = action({
  args: {},
  handler: async (ctx, args) => {
    // This is a placeholder - in a real implementation, you'd handle sign out
    // For now, we'll just return a success response
    return { success: true, message: "Sign out successful" };
  },
});
