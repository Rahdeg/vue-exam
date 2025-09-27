<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <EllipsisVerticalIcon class="w-4 h-4" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
    >
      <div class="py-2">
        <button
          @click="handleEdit"
          class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <PencilIcon class="w-4 h-4 mr-3" />
          Edit
        </button>
        <button
          v-if="canDelete"
          @click="handleDelete"
          class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <TrashIcon class="w-4 h-4 mr-3" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodosStore } from '@/stores/todos'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'
import { onClickOutside } from '@/composables/useClickOutside'
import type { Todo } from '@/types'
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [todo: Todo]
}>()

const todosStore = useTodosStore()
const authStore = useAuthStore()

const showDropdown = ref(false)

const currentUser = computed(() => authStore.currentUser)
const canDelete = computed(() => currentUser.value?._id === props.todo.userId)

const handleEdit = () => {
  emit('edit', props.todo)
  showDropdown.value = false
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return
  }

  try {
    await todosStore.removeTodo(props.todo._id)
    toast.success('Task deleted successfully')
  } catch (error) {
    console.error('Failed to delete task:', error)
    toast.error('Failed to delete task')
  }

  showDropdown.value = false
}

// Close dropdown when clicking outside
onClickOutside(document.body, () => {
  showDropdown.value = false
})
</script>
