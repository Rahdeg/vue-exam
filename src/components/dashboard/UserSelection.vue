<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-card rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg border border-border">
      <div class="p-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-semibold text-card-foreground">Start a new conversation</h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      
      <div class="p-4">
        <!-- Search -->
        <div class="relative mb-4">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            placeholder="Search users..."
            class="w-full pl-10 pr-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <!-- Users List -->
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div v-if="filteredUsers.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No users found</p>
          </div>
          
          <div
            v-for="user in filteredUsers"
            :key="user._id"
            @click="handleUserSelect(user._id)"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
          >
            <img
              v-if="user.image"
              :src="user.image"
              :alt="user.name || 'User'"
              class="w-10 h-10 rounded-full"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
            >
              {{ user.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">
                {{ user.name || 'Unknown User' }}
              </p>
              <p class="text-xs text-muted-foreground truncate">
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import type { User } from '@/types'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'user-selected': [userId: string]
}>()

const searchQuery = ref('')

// Mock users data - in a real app, you'd fetch this from Convex
const users = ref<User[]>([
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    _id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  },
  {
    _id: 'user3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    _id: 'user4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleUserSelect = (userId: string) => {
  emit('user-selected', userId)
  emit('close')
}
</script>
