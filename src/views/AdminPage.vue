<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Back Button -->
          <button
            @click="$router.back()"
            class="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back</span>
          </button>

          <!-- Title -->
          <h1 class="text-xl font-semibold text-foreground">Admin Dashboard</h1>

          <!-- User Button -->
          <UserButton />
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="bg-card border border-border rounded-lg p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-foreground">{{ stat.value }}</p>
            </div>
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`">
              <component :is="stat.icon" class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="mt-4">
            <span :class="`text-sm font-medium ${stat.changeColor}`">
              {{ stat.change }}
            </span>
            <span class="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center space-x-3"
            >
              <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`">
                <component :is="activity.icon" class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground">{{ activity.title }}</p>
                <p class="text-xs text-muted-foreground">{{ activity.description }}</p>
              </div>
              <span class="text-xs text-muted-foreground">{{ activity.time }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="action.action"
              class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <component :is="action.icon" class="w-5 h-5 text-muted-foreground" />
              <span class="text-sm font-medium text-foreground">{{ action.title }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Data Tables -->
      <div class="mt-8 space-y-6">
        <!-- Users Table -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Users</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">Tasks</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user._id"
                  class="border-b border-border hover:bg-accent/50"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-3">
                      <img
                        v-if="user.image"
                        :src="user.image"
                        :alt="user.name || 'User'"
                        class="w-8 h-8 rounded-full"
                      />
                      <div
                        v-else
                        class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold"
                      >
                        {{ user.name?.charAt(0) || 'U' }}
                      </div>
                      <span class="font-medium text-foreground">{{ user.name || 'Unknown User' }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-muted-foreground">{{ user.email }}</td>
                  <td class="py-3 px-4 text-sm text-muted-foreground">{{ user.taskCount }}</td>
                  <td class="py-3 px-4 text-sm text-muted-foreground">{{ formatDate(user.joinedAt) }}</td>
                  <td class="py-3 px-4">
                    <button class="text-sm text-primary hover:text-primary/80 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Tasks -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Recent Tasks</h2>
          <div class="space-y-3">
            <div
              v-for="task in recentTasks"
              :key="task._id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div :class="`w-3 h-3 rounded-full ${getStatusColor(task.status)}`"></div>
                <span class="font-medium text-foreground">{{ task.title }}</span>
                <span :class="`px-2 py-1 text-xs rounded-md ${getPriorityColor(task.priority)}`">
                  {{ task.priority }}
                </span>
              </div>
              <span class="text-sm text-muted-foreground">{{ formatTime(task.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserButton from '@/components/auth/UserButton.vue'
import { formatDate, formatTime } from '@/utils'
import {
  ArrowLeftIcon,
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeColor: 'text-green-600',
    color: 'bg-blue-500',
    icon: UsersIcon
  },
  {
    title: 'Total Tasks',
    value: '5,678',
    change: '+8%',
    changeColor: 'text-green-600',
    color: 'bg-green-500',
    icon: DocumentTextIcon
  },
  {
    title: 'Messages Sent',
    value: '12,345',
    change: '+15%',
    changeColor: 'text-green-600',
    color: 'bg-purple-500',
    icon: ChatBubbleLeftRightIcon
  },
  {
    title: 'Active Conversations',
    value: '89',
    change: '+3%',
    changeColor: 'text-green-600',
    color: 'bg-orange-500',
    icon: ChatBubbleLeftRightIcon
  }
]

const recentActivity = [
  {
    id: 1,
    title: 'New user registered',
    description: 'John Doe joined the platform',
    time: '2 minutes ago',
    color: 'bg-blue-500',
    icon: UserPlusIcon
  },
  {
    id: 2,
    title: 'Task completed',
    description: 'Sarah completed "Design new landing page"',
    time: '5 minutes ago',
    color: 'bg-green-500',
    icon: CheckCircleIcon
  },
  {
    id: 3,
    title: 'New message sent',
    description: 'Mike sent a message to Jane',
    time: '10 minutes ago',
    color: 'bg-purple-500',
    icon: ChatBubbleLeftRightIcon
  },
  {
    id: 4,
    title: 'System warning',
    description: 'High memory usage detected',
    time: '15 minutes ago',
    color: 'bg-yellow-500',
    icon: ExclamationTriangleIcon
  }
]

const quickActions = [
  {
    title: 'Add New User',
    icon: UserPlusIcon,
    action: () => console.log('Add new user')
  },
  {
    title: 'System Settings',
    icon: CogIcon,
    action: () => console.log('Open system settings')
  },
  {
    title: 'View Analytics',
    icon: ChartBarIcon,
    action: () => console.log('View analytics')
  },
  {
    title: 'Export Data',
    icon: DocumentTextIcon,
    action: () => console.log('Export data')
  }
]

const users = ref([
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    taskCount: 12,
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 days ago
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    taskCount: 8,
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 15 // 15 days ago
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    taskCount: 15,
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 // 7 days ago
  }
])

const recentTasks = ref([
  {
    _id: '1',
    title: 'Design new landing page',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: Date.now() - 1000 * 60 * 30 // 30 minutes ago
  },
  {
    _id: '2',
    title: 'Review user feedback',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: Date.now() - 1000 * 60 * 60 // 1 hour ago
  },
  {
    _id: '3',
    title: 'Update documentation',
    status: 'DONE',
    priority: 'LOW',
    createdAt: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'TODO': return 'bg-gray-400'
    case 'IN_PROGRESS': return 'bg-blue-400'
    case 'DONE': return 'bg-green-400'
    case 'CANCELLED': return 'bg-red-400'
    default: return 'bg-gray-400'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW': return 'bg-green-100 text-green-800'
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
    case 'HIGH': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
