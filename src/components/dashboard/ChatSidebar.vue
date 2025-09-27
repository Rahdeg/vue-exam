<template>
  <div class="h-full flex flex-col bg-background">
    <!-- Header -->
    <div class="p-4 border-b border-border bg-background">
      <div class="flex items-center justify-between my-4">
        <h2 class="text-2xl font-bold text-foreground">Messages</h2>
        <button
          @click="showUserSelection = true"
          class="h-9 w-9 rounded-full transition-colors hover:bg-muted flex items-center justify-center"
        >
          <PlusIcon class="w-5 h-5 text-foreground" />
        </button>
      </div>

      <!-- Search -->
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          placeholder="Search conversations..."
          class="w-full pl-10 pr-3 py-2 h-10 bg-muted border border-border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto bg-background">
      <div class="p-3 space-y-2">
        <div v-if="filteredConversations.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <ChatBubbleLeftRightIcon class="w-8 h-8 text-muted-foreground" />
          </div>
          <p class="text-sm text-muted-foreground font-medium">
            {{ searchQuery ? 'No conversations found' : 'No conversations yet' }}
          </p>
          <p class="text-xs text-muted-foreground/70 mt-1">
            {{ searchQuery ? 'Try adjusting your search' : 'Start a new chat to get started' }}
          </p>
        </div>
        
        <div
          v-for="conversation in filteredConversations"
          :key="conversation._id"
          @click="handleConversationClick(conversation._id)"
          class="group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border bg-muted/30"
        >
          <div class="flex items-start space-x-4">
            <div class="relative flex-shrink-0">
              <img
                v-if="conversation.otherUser?.image"
                :src="conversation.otherUser.image"
                :alt="conversation.otherUser.name || 'User'"
                class="h-12 w-12 rounded-full ring-2 ring-background shadow-sm"
              />
              <div
                v-else
                class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold flex items-center justify-center ring-2 ring-background shadow-sm"
              >
                {{ conversation.otherUser?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-green-500 shadow-sm" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <h3 class="text-sm font-semibold text-foreground truncate">
                  {{ conversation.otherUser?.name || 'Unknown User' }}
                </h3>
                <div class="flex items-center space-x-2 ml-2">
                  <span
                    v-if="conversation.unreadCount > 0"
                    class="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-semibold bg-red-500 text-white shadow-sm"
                  >
                    {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground truncate leading-relaxed flex-1">
                  <span v-if="conversation.latestMessage">
                    <span
                      v-if="conversation.latestMessage.senderId === currentUser?._id"
                      class="text-muted-foreground/70"
                    >
                      You: 
                    </span>
                    {{ conversation.latestMessage.body }}
                  </span>
                  <span v-else class="text-muted-foreground/60 italic">
                    No messages yet
                  </span>
                </p>
                <span
                  v-if="conversation.latestMessage"
                  class="text-xs text-muted-foreground/60 ml-2 flex-shrink-0"
                >
                  {{ formatTime(conversation.latestMessage.createdAt) }}
                </span>
              </div>
            </div>

            <button class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-muted flex items-center justify-center">
              <EllipsisVerticalIcon class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Selection Modal -->
    <UserSelection
      :is-open="showUserSelection"
      @close="showUserSelection = false"
      @user-selected="handleUserSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { formatTime } from '@/utils'
import type { Conversation } from '@/types'
import UserSelection from './UserSelection.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const showUserSelection = ref(false)

const currentUser = computed(() => authStore.currentUser)
const conversations = computed(() => (chatStore.conversations.data as any[]) || [])

const filteredConversations = computed(() => {
  if (!conversations.value) return []
  
  return conversations.value.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conv.otherUser?.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conv.latestMessage?.body?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleUserSelected = (userId: string) => {
  // Find the conversation with this user
  const conversation = conversations.value?.find(conv =>
    conv.otherUser?._id === userId
  )
  if (conversation) {
    router.push(`/chat/${conversation._id}`)
  }
}

const handleConversationClick = (conversationId: string) => {
  router.push(`/chat/${conversationId}`)
}
</script>
