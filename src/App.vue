<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'

import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="max-w-400 mx-auto">
    <TheHeader />
    <RouterView />
    <Toaster rich-colors />
  </div>
</template>
