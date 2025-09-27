<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-border">
      <div class="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-card-foreground">Comments</h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      
      <div class="p-4">
        <!-- Comments List -->
        <div class="space-y-4 mb-6">
          <div
            v-for="comment in comments"
            :key="comment._id"
            class="flex space-x-3"
          >
            <img
              v-if="comment.user?.image"
              :src="comment.user.image"
              :alt="comment.user.name || 'User'"
              class="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0"
            >
              {{ comment.user?.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-sm font-medium text-foreground">
                  {{ comment.user?.name || 'Unknown User' }}
                </span>
                <span class="text-xs text-muted-foreground">
                  {{ formatTime(comment.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-foreground">{{ comment.body }}</p>
            </div>
          </div>
        </div>

        <!-- Add Comment Form -->
        <div class="border-t border-border pt-4">
          <form @submit.prevent="handleAddComment" class="space-y-4">
            <div>
              <textarea
                v-model="newComment"
                placeholder="Add a comment..."
                rows="3"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                required
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!newComment.trim() || isSubmitting"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { formatTime } from '@/utils'
import type { Comment } from '@/types'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  todoId: string
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const newComment = ref('')
const isSubmitting = ref(false)
const addComment = useMutation(api.comments.create)

// Mock comments data - in a real app, you'd fetch this from Convex
const comments = ref<Comment[]>([
  {
    _id: '1',
    body: 'This looks great! When do you think it will be ready?',
    todoId: props.todoId,
    userId: 'user1',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    updatedAt: Date.now() - 1000 * 60 * 30,
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    _id: '2',
    body: 'I can help with the testing once the initial version is done.',
    todoId: props.todoId,
    userId: 'user2',
    createdAt: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    updatedAt: Date.now() - 1000 * 60 * 15,
    user: {
      _id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  }
])

const handleAddComment = async () => {
  if (!newComment.value.trim()) return

  isSubmitting.value = true
  try {
    await addComment.mutate({
      body: newComment.value,
      todoId: props.todoId
    })
    
    // Add the comment to the local list (in a real app, this would be handled by Convex)
    comments.value.unshift({
      _id: Date.now().toString(),
      body: newComment.value,
      todoId: props.todoId,
      userId: 'current-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      user: {
        _id: 'current-user',
        name: 'You',
        email: 'you@example.com'
      }
    })
    
    newComment.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
