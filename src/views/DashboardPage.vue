<template>
  <div class="min-h-screen bg-background">
    <DashboardHeader @chat-click="showChatDrawer = true" />

    <!-- Main Content -->
    <div class="pt-16 lg:pr-80 overflow-visible">
      <!-- My Tasks Section -->
      <div class="p-4 pt-8 lg:pt-10 lg:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 class="text-2xl font-bold text-card-foreground">My Tasks</h1>
              <p class="text-muted-foreground">Manage your tasks and stay organized</p>
            </div>

            <!-- Mobile: Drawer, Desktop: Modal -->
            <div class="block lg:hidden">
              <button
                @click="showCreateDrawer = true"
                class="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                New Task
              </button>
            </div>

            <div class="hidden lg:block">
              <button
                @click="showCreateModal = true"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors flex items-center"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                New Task
              </button>
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="flex space-x-1 bg-muted p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
            <button
              v-for="filterOption in filterOptions"
              :key="filterOption.value"
              @click="filter = filterOption.value"
              :class="`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === filterOption.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`"
            >
              {{ filterOption.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tasks Content -->
      <div class="p-4 lg:p-6">
        <div class="max-w-4xl mx-auto">
          <TodoList :filter="filter" />
        </div>
      </div>
    </div>

    <!-- Chat Sidebar - Fixed position, hidden on mobile, visible on large screens -->
    <div
      data-chat-sidebar
      class="hidden lg:block fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] border-l border-border bg-background z-10"
    >
      <ChatSidebar />
    </div>

    <!-- Create Task Modal - Desktop only -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showCreateModal = false"
    >
      <div class="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-border">
        <div class="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-card-foreground">Create New Task</h2>
          <button
            @click="showCreateModal = false"
            class="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4">
          <TodoForm @success="showCreateModal = false" />
        </div>
      </div>
    </div>

    <!-- Mobile Create Drawer -->
    <div
      v-if="showCreateDrawer"
      class="fixed inset-0 bg-black/50 z-50"
      @click.self="showCreateDrawer = false"
    >
      <div class="absolute bottom-0 left-0 right-0 bg-card rounded-t-lg max-h-[85vh] overflow-y-auto">
        <div class="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-card-foreground">Create New Task</h2>
          <button
            @click="showCreateDrawer = false"
            class="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4">
          <TodoForm @success="showCreateDrawer = false" />
        </div>
      </div>
    </div>

    <!-- Mobile Chat Drawer -->
    <div
      v-if="showChatDrawer"
      class="fixed inset-0 bg-black/50 z-50"
      @click.self="showChatDrawer = false"
    >
      <div class="absolute right-0 top-0 bottom-0 w-full bg-card">
        <div class="border-b border-border p-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-card-foreground">Messages</h2>
          <button
            @click="showChatDrawer = false"
            class="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="h-full overflow-hidden">
          <ChatSidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FilterType } from '@/types'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
import ChatSidebar from '@/components/dashboard/ChatSidebar.vue'
import TodoForm from '@/components/forms/TodoForm.vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const showCreateModal = ref(false)
const showCreateDrawer = ref(false)
const showChatDrawer = ref(false)
const filter = ref<FilterType>('all')

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'my', label: 'My Tasks' },
  { value: 'public', label: 'Public Tasks' }
]
</script>
