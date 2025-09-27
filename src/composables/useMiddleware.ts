import { useConvexAuth } from "./useConvex";
import { computed } from "vue";

export function useAuth() {
  const { isAuthenticated, isLoading, user } = useConvexAuth();

  const isAuthenticatedUser = computed(() => isAuthenticated.value);
  const isLoadingAuth = computed(() => isLoading.value);
  const currentUser = computed(() => user.value);

  // Check if user is admin (implement based on your user roles)
  const isAdmin = computed(() => {
    if (!isAuthenticatedUser.value || !currentUser.value) {
      return false;
    }

    // Add your admin check logic here
    // For now, we'll assume all authenticated users can access admin
    // In a real app, you'd check user roles or permissions
    return true;
  });

  return {
    isAuthenticated: isAuthenticatedUser,
    isLoading: isLoadingAuth,
    user: currentUser,
    isAdmin,
  };
}

export function usePermissions() {
  const { isAuthenticated, isAdmin } = useAuth();

  const canAccessAdmin = computed(() => isAuthenticated.value && isAdmin.value);
  const canCreateTasks = computed(() => isAuthenticated.value);
  const canComment = computed(() => isAuthenticated.value);
  const canReact = computed(() => isAuthenticated.value);

  return {
    canAccessAdmin,
    canCreateTasks,
    canComment,
    canReact,
  };
}
