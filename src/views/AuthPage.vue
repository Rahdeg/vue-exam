<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-muted to-accent">
    <div class="flex h-screen">
      <!-- Left Column - Carousel (Desktop Only) -->
      <div class="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <div class="w-full h-full relative">
          <AppCarousel />
        </div>
      </div>

      <!-- Right Column - Auth Form -->
      <div class="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div class="w-full max-w-md lg:max-w-lg">
          <!-- Mobile Logo -->
          <div class="lg:hidden text-center mb-8">
            <h1 class="text-3xl font-bold text-foreground mb-2">Welcome to TaskyFlow</h1>
            <p class="text-base text-muted-foreground">Sign in to your account or create a new one</p>
          </div>

          <!-- Desktop Header -->
          <div class="hidden lg:block text-center mb-8">
            <h1 class="text-4xl font-bold text-foreground mb-2">
              {{ mode === 'signin' ? 'Welcome Back' : 'Join TaskyFlow' }}
            </h1>
            <p class="text-lg text-muted-foreground">
              {{ mode === 'signin' ? 'Sign in to continue to your dashboard' : 'Create your account to get started' }}
            </p>
          </div>

          <div class="border-0 shadow-2xl bg-card/95 backdrop-blur-sm rounded-lg">
            <div class="pb-6 p-6">
              <div class="flex space-x-1 bg-muted/80 p-1.5 rounded-xl">
                <button
                  @click="mode = 'signin'"
                  :class="`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === 'signin'
                      ? 'bg-card text-card-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`"
                >
                  Sign In
                </button>
                <button
                  @click="mode = 'signup'"
                  :class="`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === 'signup'
                      ? 'bg-card text-card-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div class="px-6 pb-6">
              <SignInCard v-if="mode === 'signin'" />
              <SignUpCard v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AuthMode } from '@/types'
import AppCarousel from '@/components/auth/AppCarousel.vue'
import SignInCard from '@/components/auth/SignInCard.vue'
import SignUpCard from '@/components/auth/SignUpCard.vue'

const mode = ref<AuthMode>('signin')
</script>
