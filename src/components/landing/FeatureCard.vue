<template>
  <div class="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-lg">
    <div class="p-6">
      <div :class="`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg`">
        <component :is="iconComponent" class="w-7 h-7 text-white" />
      </div>
      <h3 class="text-xl font-semibold text-foreground mb-2">{{ title }}</h3>
      <p class="text-muted-foreground leading-relaxed">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

interface Props {
  icon: string
  title: string
  description: string
  color: string
}

const props = defineProps<Props>()

const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    UsersIcon,
    BoltIcon,
    ShieldCheckIcon,
    ClockIcon
  }
  return iconMap[props.icon] || CheckCircleIcon
})
</script>
