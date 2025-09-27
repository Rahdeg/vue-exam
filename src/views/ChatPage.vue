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

          <!-- Chat Info -->
          <div class="flex items-center space-x-3">
            <img
              v-if="conversation?.otherUser?.image"
              :src="conversation.otherUser.image"
              :alt="conversation.otherUser.name || 'User'"
              class="w-8 h-8 rounded-full"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
            >
              {{ conversation?.otherUser?.name?.charAt(0) || 'U' }}
            </div>
            <div>
              <h1 class="font-semibold text-foreground">
                {{ conversation?.otherUser?.name || 'Unknown User' }}
              </h1>
              <p class="text-sm text-muted-foreground">Online</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button class="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <PhoneIcon class="w-5 h-5" />
            </button>
            <button class="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <VideoCameraIcon class="w-5 h-5" />
            </button>
            <button class="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <EllipsisVerticalIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading messages...</p>
      </div>

      <div v-else-if="messages.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">No messages yet</h3>
        <p class="text-muted-foreground">Start the conversation by sending a message below.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="message in messages"
          :key="message._id"
          :class="`flex ${message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`"
        >
          <div
            :class="`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === currentUser?._id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`"
          >
            <p class="text-sm">{{ message.body }}</p>
            <p
              :class="`text-xs mt-1 ${
                message.senderId === currentUser?._id
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground'
              }`"
            >
              {{ formatTime(message.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-border bg-card p-4">
      <form @submit.prevent="handleSendMessage" class="flex items-center space-x-2">
        <button
          type="button"
          class="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <PaperClipIcon class="w-5 h-5" />
        </button>
        <div class="flex-1 relative">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            :disabled="isSending"
          />
        </div>
        <button
          type="submit"
          :disabled="!newMessage.trim() || isSending"
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'
import { formatTime } from '@/utils'
import type { Message, Conversation } from '@/types'
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const chatStore = useChatStore()
const authStore = useAuthStore()

const newMessage = ref('')
const isSending = ref(false)
const isLoading = ref(true)

const conversationId = computed(() => route.params.conversationId as string)
const currentUser = computed(() => authStore.currentUser)

// Mock data - in a real app, you'd fetch this from Convex
const conversation = ref<Conversation | null>({
  _id: conversationId.value,
  type: 'dm',
  participants: ['user1', 'user2'],
  createdBy: 'user1',
  createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  lastMessageAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  otherUser: {
    _id: 'user2',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  unreadCount: 0
})

const messages = ref<Message[]>([
  {
    _id: '1',
    body: 'Hey! How are you doing?',
    type: 'text',
    conversationId: conversationId.value,
    senderId: 'user2',
    createdAt: Date.now() - 1000 * 60 * 60, // 1 hour ago
    sender: {
      _id: 'user2',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    _id: '2',
    body: 'I\'m doing great! Thanks for asking. How about you?',
    type: 'text',
    conversationId: conversationId.value,
    senderId: 'user1',
    createdAt: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    sender: {
      _id: 'user1',
      name: 'You',
      email: 'you@example.com'
    }
  },
  {
    _id: '3',
    body: 'Pretty good! Just working on some new features for the project.',
    type: 'text',
    conversationId: conversationId.value,
    senderId: 'user2',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    sender: {
      _id: 'user2',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  }
])

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true
  
  try {
    await chatStore.sendNewMessage(conversationId.value, newMessage.value)
    
    // Add message to local list (in a real app, this would be handled by Convex)
    const message: Message = {
      _id: Date.now().toString(),
      body: newMessage.value,
      type: 'text',
      conversationId: conversationId.value,
      senderId: currentUser.value?._id || 'user1',
      createdAt: Date.now(),
      sender: {
        _id: currentUser.value?._id || 'user1',
        name: currentUser.value?.name || 'You',
        email: currentUser.value?.email || 'you@example.com'
      }
    }
    
    messages.value.push(message)
    newMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
    toast.error('Failed to send message')
  } finally {
    isSending.value = false
  }
}

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
