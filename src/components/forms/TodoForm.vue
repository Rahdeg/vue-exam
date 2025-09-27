<template>
  <div class="w-full border-0 shadow-none">
    <div class="pb-4">
      <h2 class="text-lg font-semibold text-foreground">{{ todo ? 'Edit' : 'Create' }} Task</h2>
    </div>
    <div class="pt-0">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div class="space-y-2">
          <label for="title" class="text-sm font-medium text-foreground">Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter task title"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
          <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label for="description" class="text-sm font-medium text-foreground">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Enter task description"
            :disabled="isLoading"
            rows="3"
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 resize-none"
          />
        </div>

        <!-- Status and Priority -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="status" class="text-sm font-medium text-foreground">Status</label>
            <select
              id="status"
              v-model="form.status"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="priority" class="text-sm font-medium text-foreground">Priority</label>
            <select
              id="priority"
              v-model="form.priority"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <!-- Due Date -->
        <div class="space-y-2">
          <label for="dueDate" class="text-sm font-medium text-foreground">Due Date</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            :disabled="isLoading"
            class="w-48 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
          <p v-if="errors.dueDate" class="text-sm text-destructive">{{ errors.dueDate }}</p>
        </div>

        <!-- Tags -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Tags</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              @click="toggleTag(tag)"
              :class="`px-3 py-1 text-xs rounded-md transition-colors ${
                form.tags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Public/Private -->
        <div class="flex items-center space-x-2">
          <input
            id="isPublic"
            v-model="form.isPublic"
            type="checkbox"
            :disabled="isLoading"
            class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
          />
          <label for="isPublic" class="text-sm text-foreground">
            Make this task public (visible to other users)
          </label>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-4">
          <button
            type="button"
            @click="resetForm"
            :disabled="isLoading"
            class="w-full sm:w-auto px-4 py-2 border border-input bg-background text-foreground rounded-md hover:bg-accent transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Saving...' : todo ? 'Update' : 'Create' }} Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useTodosStore } from '@/stores/todos'
import { toast } from 'sonner'
import type { Todo } from '@/types'

interface Props {
  todo?: Todo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
}>()

const todosStore = useTodosStore()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive({
  title: props.todo?.title || '',
  description: props.todo?.description || '',
  status: props.todo?.status || 'TODO',
  priority: props.todo?.priority || 'LOW',
  tags: props.todo?.tags || [],
  dueDate: props.todo?.dueDate ? new Date(props.todo.dueDate).toISOString().split('T')[0] : '',
  isPublic: props.todo?.isPublic ?? false
})

const availableTags = ['Design', 'Development', 'Research', 'Marketing', 'Bug Fix']

const toggleTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else {
    form.tags.push(tag)
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (form.dueDate) {
    const dueDate = new Date(form.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dueDate < today) {
      errors.value.dueDate = 'Due date cannot be in the past'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    const todoData = {
      title: form.title,
      description: form.description,
      status: form.status as 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED',
      priority: form.priority as 'LOW' | 'MEDIUM' | 'HIGH',
      tags: form.tags,
      dueDate: form.dueDate ? new Date(form.dueDate).getTime() : undefined,
      isPublic: form.isPublic
    }
    
    if (props.todo?._id) {
      await todosStore.updateExistingTodo(props.todo._id, todoData)
      toast.success('Task updated successfully')
    } else {
      await todosStore.createNewTodo(todoData)
      toast.success('Task created successfully')
    }
    
    resetForm()
    emit('success')
  } catch (error) {
    console.error('Failed to save task:', error)
    toast.error('Failed to save task')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.status = 'TODO'
  form.priority = 'LOW'
  form.tags = []
  form.dueDate = ''
  form.isPublic = false
  errors.value = {}
}
</script>
