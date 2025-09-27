<template>
  <ConvexProvider :convex-url="convexUrl">
    <div id="app">
      <router-view />
    </div>
  </ConvexProvider>
</template>

<script setup lang="ts">
import ConvexProvider from './components/ConvexProvider.vue'

const convexUrl = import.meta.env.VITE_CONVEX_URL
</script>
