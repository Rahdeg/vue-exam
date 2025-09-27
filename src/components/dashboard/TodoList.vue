<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <div class="px-4 py-2 rounded-md text-sm font-medium bg-muted-foreground/10 animate-pulse">
          Loading...
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div class="h-4 bg-muted-foreground/10 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-muted-foreground/10 rounded w-1/2 mb-4"></div>
          <div class="h-3 bg-muted-foreground/10 rounded w-full mb-4"></div>
          <div class="flex justify-between">
            <div class="h-3 bg-muted-foreground/10 rounded w-1/4"></div>
            <div class="h-3 bg-muted-foreground/10 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="space-y-6">
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon class="w-8 h-8 text-destructive" />
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">Authentication Required</h3>
        <p class="text-muted-foreground">Please sign in to view your tasks.</p>
      </div>
    </div>

    <!-- Todo Cards -->
    <div v-else class="space-y-4">
      <div
        v-for="todo in filteredTodos"
        :key="todo._id"
        class="bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-foreground">{{ todo.title }}</h3>
                <span
                  v-if="!todo.isPublic"
                  class="px-2 py-1 text-xs border border-border rounded-md"
                >
                  Private
                </span>
              </div>
              <p class="text-sm text-muted-foreground">{{ todo.description }}</p>
            </div>
            <TodoActions :todo="todo" />
          </div>

          <div class="mt-4">
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span
                :class="`px-2 py-1 text-xs font-medium rounded-md ${statusColor[todo.status.toLowerCase()]}`"
              >
                {{ todo.status.replace('_', ' ') }}
              </span>
              <span
                :class="`px-2 py-1 text-xs font-medium rounded-md border ${priorityColor[todo.priority.toLowerCase()]}`"
              >
                {{ todo.priority }}
              </span>
              <span
                v-for="tag in todo.tags"
                :key="tag"
                class="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {{ tag }}
              </span>
            </div>

            <div class="space-y-3">
              <!-- User info and metadata -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div class="flex items-center space-x-1">
                    <img
                      v-if="todo.user?.image"
                      :src="todo.user.image"
                      :alt="todo.user.name || 'User'"
                      class="w-5 h-5 rounded-full"
                    />
                    <div
                      v-else
                      class="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                    >
                      {{ todo.user?.name?.charAt(0) || 'U' }}
                    </div>
                    <span>{{ todo.user?.name || 'Unknown User' }}</span>
                  </div>

                  <div v-if="todo.dueDate" class="flex items-center space-x-1">
                    <CalendarIcon class="w-4 h-4" />
                    <span>{{ formatDate(todo.dueDate) }}</span>
                  </div>

                  <div class="flex items-center space-x-1">
                    <ClockIcon class="w-4 h-4" />
                    <span>{{ getTimeAgo(todo.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Reactions and Comments Section -->
              <div class="flex items-center justify-between pt-2 border-t border-border">
                <TodoReactions
                  :todo-id="todo._id"
                  @reaction-toggle="(emoji) => handleReactionToggle(todo._id, emoji)"
                />
                <div class="flex items-center space-x-2">
                  <!-- Chat Button - only show if not the current user's todo -->
                  <button
                    v-if="currentUser && currentUser._id !== todo.userId"
                    @click="handleChatClick(todo)"
                    class="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    :title="`Chat with ${todo.user?.name}`"
                  >
                    <ChatBubbleLeftRightIcon class="w-4 h-4" />
                  </button>
                  <!-- Comment Button -->
                  <button
                    @click="selectedTodoId = todo._id"
                    class="p-1 text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    <ChatBubbleLeftRightIcon class="w-4 h-4" />
                    <span class="ml-1">{{ todo.commentCount || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTodos.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">No tasks found</h3>
        <p class="text-muted-foreground">
          {{ getEmptyStateMessage() }}
        </p>
      </div>
    </div>

    <!-- Comment Sheet -->
    <CommentSheet
      v-if="selectedTodoId"
      :todo-id="selectedTodoId"
      :is-open="!!selectedTodoId"
      @close="selectedTodoId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { useTodosStore } from '@/stores/todos'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { toast } from 'sonner'
import type { Todo, FilterType } from '@/types'
import { statusColor, priorityColor, formatDate, getTimeAgo } from '@/utils'
import TodoActions from './TodoActions.vue'
import TodoReactions from './TodoReactions.vue'
import CommentSheet from './CommentSheet.vue'
import {
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

interface Props {
  filter: FilterType
}

const props = defineProps<Props>()

const router = useRouter()
const todosStore = useTodosStore()
const authStore = useAuthStore()
const chatStore = useChatStore()

const selectedTodoId = ref<string | null>(null)
const toggleReaction = useMutation(api.reactions.toggle)

const currentUser = computed(() => authStore.currentUser)
const isLoading = computed(() => todosStore.myTodos === undefined || todosStore.publicTodos === undefined)
const hasError = computed(() => todosStore.myTodos === null || todosStore.publicTodos === null)
const filteredTodos = computed(() => todosStore.getFilteredTodos(props.filter))

const handleReactionToggle = async (todoId: string, emoji: string) => {
  try {
    await toggleReaction.mutate({
      emoji,
      todoId
    })
  } catch (error) {
    console.error('Failed to toggle reaction:', error)
  }
}

const handleChatClick = async (todo: Todo) => {
  if (!currentUser.value) {
    toast.error('You must be logged in to send messages')
    return
  }

  // Don't allow messaging yourself
  if (currentUser.value._id === todo.userId) {
    toast.info("You can't message yourself about your own todo")
    return
  }

  if (!todo.userId) {
    toast.error('Cannot start chat - user not found')
    return
  }

  try {
    toast.loading('Creating conversation...')

    // Create or get existing conversation with the todo owner
    const conversationId = await chatStore.createConversation(todo.userId)

    // Navigate to the chat page
    router.push(`/chat/${conversationId}`)

    toast.dismiss() // Remove loading toast
    toast.success('Starting chat...')
  } catch (error) {
    console.error('Failed to create conversation:', error)
    toast.dismiss() // Remove loading toast
    toast.error('Failed to create conversation. Please try again.')
  }
}

const getEmptyStateMessage = () => {
  switch (props.filter) {
    case 'my':
      return "You haven't created any tasks yet."
    case 'public':
      return 'No public tasks available.'
    default:
      return 'No tasks match your current filter.'
  }
}
</script>
