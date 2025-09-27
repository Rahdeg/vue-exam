<template>
  <div v-if="isInitialized">
    <slot />
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-muted-foreground">Initializing...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConvex } from '../composables/useConvex'

interface Props {
  convexUrl: string
}

const props = defineProps<Props>()
const { initializeConvex } = useConvex()
const isInitialized = ref(false)

onMounted(async () => {
  try {
    await initializeConvex(props.convexUrl)
    isInitialized.value = true
  } catch (error) {
    console.error('Failed to initialize Convex:', error)
    // Still show the app even if Convex fails to initialize
    isInitialized.value = true
  }
})
</script>
