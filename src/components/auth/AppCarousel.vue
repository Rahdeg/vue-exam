<template>
  <div class="relative w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
      <div class="max-w-md text-center">
        <!-- Logo -->
        <div class="mb-8">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <img src="/todo.svg" alt="TaskyFlow" class="w-10 h-10" />
          </div>
          <h2 class="text-3xl font-bold mb-2">TaskyFlow</h2>
          <p class="text-blue-100">Collaborative Task Management</p>
        </div>

        <!-- Features List -->
        <div class="space-y-6 mb-8">
          <div v-for="(feature, index) in features" :key="index" class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <h3 class="font-semibold">{{ feature.title }}</h3>
              <p class="text-sm text-blue-100">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Demo Preview -->
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold">My Tasks</h4>
              <PlusIcon class="w-5 h-5" />
            </div>
            <div class="space-y-3">
              <div v-for="task in demoTasks" :key="task.title" class="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                <span class="text-sm">{{ task.title }}</span>
                <span class="px-2 py-1 rounded text-xs font-medium" :class="task.badgeClass">
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2 text-sm">
              <ChatBubbleLeftRightIcon class="w-4 h-4" />
              <span>3 new comments</span>
              <HeartIcon class="w-4 h-4 ml-auto" />
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BoltIcon,
  PlusIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const features = [
  {
    icon: CheckCircleIcon,
    title: 'Smart Task Management',
    description: 'Organize tasks with priorities and due dates'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Real-time Collaboration',
    description: 'Comment and react to tasks instantly'
  },
  {
    icon: UsersIcon,
    title: 'Team Communication',
    description: 'Direct messaging and notifications'
  },
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description: 'Real-time updates across all devices'
  }
]

const demoTasks = [
  { title: 'Design new landing page', priority: 'High', badgeClass: 'bg-yellow-500 text-white' },
  { title: 'Review user feedback', priority: 'Medium', badgeClass: 'bg-blue-500 text-white' },
  { title: 'Update documentation', priority: 'Low', badgeClass: 'bg-green-500 text-white' }
]
</script>
