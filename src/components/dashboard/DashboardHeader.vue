<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src="/todo.svg" alt="TaskyFlow" class="w-6 h-6" />
          </div>
          <span class="text-xl font-bold text-foreground">TaskyFlow</span>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link
            to="/dashboard"
            class="text-muted-foreground hover:text-foreground transition-colors"
            :class="{ 'text-foreground': $route.name === 'dashboard' }"
          >
            Dashboard
          </router-link>
          <router-link
            to="/settings"
            class="text-muted-foreground hover:text-foreground transition-colors"
            :class="{ 'text-foreground': $route.name === 'settings' }"
          >
            Settings
          </router-link>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            @click="showNotifications = !showNotifications"
            class="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <BellIcon class="w-5 h-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <!-- Mobile Chat Button -->
          <button
            @click="$emit('chat-click')"
            class="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChatBubbleLeftRightIcon class="w-5 h-5" />
          </button>

          <!-- User Button -->
          <UserButton />
        </div>
      </div>
    </div>

    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="absolute right-4 top-16 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
    >
      <div class="p-4 border-b border-border">
        <h3 class="font-semibold text-foreground">Notifications</h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-muted-foreground">
          No notifications
        </div>
        <div
          v-for="notification in notifications"
          :key="notification._id"
          class="p-4 border-b border-border hover:bg-accent transition-colors"
        >
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground">{{ notification.title }}</p>
              <p class="text-sm text-muted-foreground">{{ notification.message }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ formatTime(notification.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import UserButton from '@/components/auth/UserButton.vue'
import { formatTime } from '@/utils'
import { BellIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

defineEmits<{
  'chat-click': []
}>()

const showNotifications = ref(false)

// Mock notifications for now - in a real app, you'd fetch these from Convex
const notifications = ref([
  {
    _id: '1',
    title: 'New comment on task',
    message: 'John commented on "Design new landing page"',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    isRead: false
  },
  {
    _id: '2',
    title: 'Task status updated',
    message: 'Sarah marked "Review user feedback" as completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    isRead: false
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
</script>
