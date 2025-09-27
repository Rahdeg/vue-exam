<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
    >
      <img
        v-if="currentUser?.image"
        :src="currentUser.image"
        :alt="currentUser.name || 'User'"
        class="w-8 h-8 rounded-full"
      />
      <div
        v-else
        class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
      >
        {{ currentUser?.name?.charAt(0) || 'U' }}
      </div>
      <ChevronDownIcon class="w-4 h-4 text-muted-foreground" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
    >
      <div class="py-2">
        <div class="px-4 py-2 border-b border-border">
          <p class="text-sm font-medium text-foreground">{{ currentUser?.name || 'User' }}</p>
          <p class="text-xs text-muted-foreground">{{ currentUser?.email }}</p>
        </div>
        <router-link
          to="/settings"
          class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          @click="showDropdown = false"
        >
          <CogIcon class="w-4 h-4 mr-3" />
          Settings
        </router-link>
        <button
          @click="handleSignOut"
          class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'
import { onClickOutside } from '@/composables/useClickOutside'
import {
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { signOut } = useAuth()
const authStore = useAuthStore()

const showDropdown = ref(false)
const currentUser = computed(() => authStore.currentUser)

const handleSignOut = async () => {
  try {
    await signOut()
    toast.success('Signed out successfully')
    router.push('/')
    showDropdown.value = false
  } catch (error) {
    console.error('Sign out error:', error)
    toast.error('Failed to sign out')
  }
}

// Close dropdown when clicking outside
onClickOutside(document.body, () => {
  showDropdown.value = false
})
</script>
