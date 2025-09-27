import { defineStore } from "pinia";
import { computed, readonly } from "vue";
import { useConvexAuth } from "../composables/useConvex";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const { isAuthenticated, isLoading, user } = useConvexAuth();

  const currentUser = computed<User | null>(() => {
    if (!user.value) return null;
    return {
      _id: user.value._id,
      name: user.value.name,
      email: user.value.email,
      image: user.value.image,
    };
  });

  return {
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    currentUser: readonly(currentUser),
  };
});
