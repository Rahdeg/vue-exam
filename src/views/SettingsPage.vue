<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Back Button -->
          <button
            @click="$router.back()"
            class="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back</span>
          </button>

          <!-- Title -->
          <h1 class="text-xl font-semibold text-foreground">Settings</h1>

          <!-- Save Button -->
          <button
            @click="handleSave"
            :disabled="!hasChanges"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="max-w-4xl mx-auto p-6">
      <div class="space-y-8">
        <!-- Account Settings -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Account Settings</h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <img
                v-if="currentUser?.image"
                :src="currentUser.image"
                :alt="currentUser.name || 'User'"
                class="w-16 h-16 rounded-full"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold"
              >
                {{ currentUser?.name?.charAt(0) || 'U' }}
              </div>
              <div>
                <button class="text-sm text-primary hover:text-primary/80 font-medium">
                  Change Avatar
                </button>
                <p class="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  v-model="settings.name"
                  type="text"
                  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  v-model="settings.email"
                  type="email"
                  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Notification Settings</h2>
          <div class="space-y-4">
            <div
              v-for="setting in notificationSettings"
              :key="setting.key"
              class="flex items-center justify-between"
            >
              <div>
                <h3 class="text-sm font-medium text-foreground">{{ setting.title }}</h3>
                <p class="text-xs text-muted-foreground">{{ setting.description }}</p>
              </div>
              <input
                v-model="(settings as any)[setting.key]"
                type="checkbox"
                class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
              />
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Privacy Settings</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-foreground">Profile Visibility</h3>
                <p class="text-xs text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <input
                v-model="settings.profileVisible"
                type="checkbox"
                class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
              />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-foreground">Show Online Status</h3>
                <p class="text-xs text-muted-foreground">Let others see when you're online</p>
              </div>
              <input
                v-model="settings.showOnlineStatus"
                type="checkbox"
                class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
              />
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-card border border-destructive/20 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-foreground">Delete Account</h3>
                <p class="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <button
                @click="handleDeleteAccount"
                class="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md font-medium transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const settings = reactive({
  name: currentUser.value?.name || '',
  email: currentUser.value?.email || '',
  profileVisible: true,
  showOnlineStatus: true,
  taskComments: true,
  taskStatusChanges: true,
  taskAssignments: true,
  taskDueReminders: true,
  commentReplies: true,
  reactions: true,
  directMessages: true,
  mentions: true,
  emailNotifications: true,
  pushNotifications: true
})

const notificationSettings = [
  {
    key: 'taskComments',
    title: 'Task Comments',
    description: 'Get notified when someone comments on your tasks'
  },
  {
    key: 'taskStatusChanges',
    title: 'Task Status Changes',
    description: 'Get notified when task status changes'
  },
  {
    key: 'taskAssignments',
    title: 'Task Assignments',
    description: 'Get notified when you\'re assigned to a task'
  },
  {
    key: 'taskDueReminders',
    title: 'Due Date Reminders',
    description: 'Get reminded about upcoming due dates'
  },
  {
    key: 'commentReplies',
    title: 'Comment Replies',
    description: 'Get notified when someone replies to your comments'
  },
  {
    key: 'reactions',
    title: 'Reactions',
    description: 'Get notified when someone reacts to your tasks or comments'
  },
  {
    key: 'directMessages',
    title: 'Direct Messages',
    description: 'Get notified of new direct messages'
  },
  {
    key: 'mentions',
    title: 'Mentions',
    description: 'Get notified when someone mentions you'
  },
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive notifications via email'
  },
  {
    key: 'pushNotifications',
    title: 'Push Notifications',
    description: 'Receive push notifications in your browser'
  }
]

const hasChanges = computed(() => {
  return settings.name !== currentUser.value?.name ||
         settings.email !== currentUser.value?.email
})

const handleSave = async () => {
  try {
    // In a real app, you'd save these settings to Convex
    toast.success('Settings saved successfully')
  } catch (error) {
    console.error('Failed to save settings:', error)
    toast.error('Failed to save settings')
  }
}

const handleDeleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return
  }

  try {
    // In a real app, you'd delete the account via Convex
    toast.success('Account deleted successfully')
    router.push('/')
  } catch (error) {
    console.error('Failed to delete account:', error)
    toast.error('Failed to delete account')
  }
}
</script>
