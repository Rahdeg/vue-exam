import { ref, computed } from "vue";
import { useConvex } from "./useConvex";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const { getClient } = useConvex();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const signIn = async (provider: string, options?: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const client = getClient();

      if (provider === "password") {
        // For password authentication, we'll use a custom mutation
        const result = await client.mutation(api.auth.signInMutation, {
          email: options.email,
          password: options.password,
          flow: options.flow || "signIn",
        });
        return result;
      } else {
        // For OAuth providers, we'll use the Convex auth action
        const result = await client.action(api.auth.signInAction, {
          provider,
          ...options,
        });
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signUp = async (provider: string, options?: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const client = getClient();

      if (provider === "password") {
        // For password authentication, we'll use a custom mutation
        const result = await client.mutation(api.auth.signUpMutation, {
          email: options.email,
          password: options.password,
          name: options.name,
          flow: options.flow || "signUp",
        });
        return result;
      } else {
        // For OAuth providers, we'll use the Convex auth action
        const result = await client.action(api.auth.signUpAction, {
          provider,
          ...options,
        });
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const client = getClient();
      await client.action(api.auth.signOutAction, {});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  };
}
