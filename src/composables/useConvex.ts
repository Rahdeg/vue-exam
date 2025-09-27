import { ref, computed, onMounted, onUnmounted } from "vue";
import { ConvexHttpClient, type ConnectionState } from "convex/browser";
import { api } from "../../convex/_generated/api";

// Global Convex client instance
let convexClient: ConvexHttpClient | null = null;

export function useConvex() {
  const connectionState = ref<ConnectionState>({
    hasInflightRequests: false,
    isWebSocketConnected: false,
    timeOfOldestInflightRequest: null,
    hasEverConnected: false,
    connectionCount: 0,
    connectionRetries: 0,
    inflightMutations: 0,
    inflightActions: 0,
  });
  const isConnected = computed(
    () => connectionState.value.isWebSocketConnected
  );

  const initializeConvex = async (convexUrl: string) => {
    if (!convexClient) {
      convexClient = new ConvexHttpClient(convexUrl);
    }
    return convexClient;
  };

  const getClient = () => {
    if (!convexClient) {
      throw new Error(
        "Convex client not initialized. Call initializeConvex first."
      );
    }
    return convexClient;
  };

  return {
    connectionState,
    isConnected,
    initializeConvex,
    getClient,
  };
}

// Vue composable for queries
export function useQuery<T>(query: any, args?: any) {
  const data = ref<T | undefined>(undefined);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const executeQuery = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const client = convexClient;
      if (!client) {
        throw new Error("Convex client not initialized");
      }
      const result = await client.query(query, args);
      data.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    executeQuery();
  });

  return {
    data,
    isLoading,
    error,
    refetch: executeQuery,
  };
}

// Vue composable for mutations
export function useMutation<T = any>(mutation: any) {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const mutate = async (args?: any): Promise<T | undefined> => {
    try {
      isLoading.value = true;
      error.value = null;
      const client = convexClient;
      if (!client) {
        throw new Error("Convex client not initialized");
      }
      const result = await client.mutation(mutation, args);
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}

// Vue composable for actions
export function useAction<T = any>(action: any) {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (args?: any): Promise<T | undefined> => {
    try {
      isLoading.value = true;
      error.value = null;
      const client = convexClient;
      if (!client) {
        throw new Error("Convex client not initialized");
      }
      const result = await client.action(action, args);
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    execute,
    isLoading,
    error,
  };
}

// Vue composable for auth state (without lifecycle hooks)
export function useConvexAuth() {
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const user = ref<any>(null);

  const checkAuth = async () => {
    try {
      isLoading.value = true;
      const client = convexClient;
      if (!client) {
        // If client is not initialized, just set as not authenticated
        isAuthenticated.value = false;
        user.value = null;
        isLoading.value = false;
        return;
      }
      // For now, we'll implement a simple auth check
      // This would need to be adapted based on your auth implementation
      const authResult = await client.query(api.users.getCurrentUser);
      isAuthenticated.value = !!authResult;
      user.value = authResult;
    } catch (err) {
      console.log("Auth check error:", err);
      isAuthenticated.value = false;
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    refetch: checkAuth,
  };
}

// Vue composable for auth state with lifecycle hooks (for components only)
export function useConvexAuthWithLifecycle() {
  const auth = useConvexAuth();

  onMounted(() => {
    auth.refetch();
  });

  return auth;
}
