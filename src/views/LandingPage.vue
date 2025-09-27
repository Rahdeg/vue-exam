<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-card to-muted">
    <!-- Navigation -->
    <nav class="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/todo.svg" alt="TaskyFlow" class="w-6 h-6" />
            </div>
            <span class="text-xl font-bold text-foreground">TaskyFlow</span>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <UserButton />
            </template>
            <template v-else>
              <router-link to="/auth">
                <button class="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                  Sign In
                </button>
              </router-link>
              <router-link to="/auth">
                <button class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors">
                  Get Started
                </button>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <div class="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-secondary text-secondary-foreground">
          🚀 New: Real-time collaboration features
        </div>
        <h1 class="text-4xl sm:text-6xl font-bold text-foreground mb-6">
          Organize Your Life with
          <span class="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            Smart Tasks
          </span>
        </h1>
        <p class="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The ultimate collaborative task management platform. Create, organize, and collaborate on tasks with real-time updates, comments, and direct messaging.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link :to="isAuthenticated ? '/dashboard' : '/auth'">
            <button class="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors flex items-center justify-center">
              {{ isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial' }}
              <ArrowRightIcon class="ml-2 w-4 h-4" />
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 to-accent/50 dark:from-muted/20 dark:to-accent/20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to stay organized
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to boost your productivity and keep your team in sync.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            v-for="feature in features"
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
            :color="feature.color"
          />
        </div>
      </div>
    </section>

    <!-- Interactive Demo Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              See TaskyFlow in action
            </h2>
            <p class="text-xl text-muted-foreground mb-8">
              Watch how easy it is to create tasks, collaborate with your team, and stay organized.
            </p>
            <div class="space-y-4">
              <div v-for="benefit in benefits" :key="benefit" class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon class="w-4 h-4 text-white" />
                </div>
                <span class="text-foreground">{{ benefit }}</span>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">My Tasks</h3>
                  <PlusIcon class="w-5 h-5" />
                </div>
                <div class="space-y-3">
                  <div v-for="task in demoTasks" :key="task.title" class="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                    <span>{{ task.title }}</span>
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
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to boost your productivity?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Join thousands of users who are already organized with TaskyFlow.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link :to="isAuthenticated ? '/dashboard' : '/auth'">
            <button class="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-md font-medium transition-colors flex items-center justify-center">
              {{ isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial' }}
              <ArrowRightIcon class="ml-2 w-4 h-4" />
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-6 h-6 rounded-lg flex items-center justify-center">
                <img src="/todo.svg" alt="TaskyFlow" class="w-5 h-5" />
              </div>
              <span class="text-lg font-bold text-foreground">TaskyFlow</span>
            </div>
            <p class="text-muted-foreground">
              The ultimate collaborative task management platform.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-4">Product</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><a href="#" class="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-foreground transition-colors">Updates</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-4">Company</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><a href="#" class="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" class="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-4">Support</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><a href="#" class="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 TaskyFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserButton from '@/components/auth/UserButton.vue'
import FeatureCard from '@/components/landing/FeatureCard.vue'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const features = [
  {
    icon: 'CheckCircleIcon',
    title: 'Smart Task Management',
    description: 'Create, organize, and track tasks with priority levels, due dates, and custom tags.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Real-time Comments',
    description: 'Collaborate with your team through threaded comments and instant notifications.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: 'UsersIcon',
    title: 'Direct Messaging',
    description: 'Communicate seamlessly with team members through integrated chat functionality.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: 'BoltIcon',
    title: 'Lightning Fast',
    description: 'Experience real-time updates and instant synchronization across all devices.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy controls.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: 'ClockIcon',
    title: 'Smart Notifications',
    description: 'Get timely reminders and stay updated with intelligent notification system.',
    color: 'from-indigo-500 to-indigo-600'
  }
]

const benefits = [
  'Create tasks in seconds',
  'Real-time collaboration',
  'Instant messaging'
]

const demoTasks = [
  { title: 'Design new landing page', priority: 'High', badgeClass: 'bg-yellow-500 text-white' },
  { title: 'Review user feedback', priority: 'Medium', badgeClass: 'bg-blue-500 text-white' },
  { title: 'Update documentation', priority: 'Low', badgeClass: 'bg-green-500 text-white' }
]
</script>
