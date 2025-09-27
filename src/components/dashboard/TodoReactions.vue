<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="reaction in commonReactions"
      :key="reaction.emoji"
      @click="handleReactionToggle(reaction.emoji)"
      :class="`p-1 rounded-md transition-colors ${
        userReactions.includes(reaction.emoji)
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`"
    >
      <span class="text-sm">{{ reaction.emoji }}</span>
      <span v-if="reaction.count > 0" class="ml-1 text-xs">{{ reaction.count }}</span>
    </button>
    
    <button
      @click="showEmojiPicker = !showEmojiPicker"
      class="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
    >
      <FaceSmileIcon class="w-4 h-4" />
    </button>

    <!-- Emoji Picker -->
    <div
      v-if="showEmojiPicker"
      class="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50"
    >
      <div class="grid grid-cols-6 gap-1">
        <button
          v-for="emoji in emojiList"
          :key="emoji"
          @click="handleReactionToggle(emoji)"
          class="p-2 text-lg hover:bg-accent rounded-md transition-colors"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { onClickOutside } from '@/composables/useClickOutside'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'

interface Props {
  todoId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'reaction-toggle': [emoji: string]
}>()

const showEmojiPicker = ref(false)

// Mock reactions data - in a real app, you'd fetch this from Convex
const reactions = ref([
  { emoji: '👍', count: 3, users: ['user1', 'user2', 'user3'] },
  { emoji: '❤️', count: 1, users: ['user1'] },
  { emoji: '🎉', count: 2, users: ['user2', 'user4'] }
])

const commonReactions = computed(() => reactions.value)

const userReactions = computed(() => {
  // Mock current user reactions - in a real app, you'd get this from the store
  return ['👍', '❤️']
})

const emojiList = ['👍', '❤️', '🎉', '😂', '😮', '😢', '😡', '👏', '🔥', '💯', '✨', '🚀']

const handleReactionToggle = (emoji: string) => {
  emit('reaction-toggle', emoji)
  showEmojiPicker.value = false
}

// Close emoji picker when clicking outside
onClickOutside(document.body, () => {
  showEmojiPicker.value = false
})
</script>
