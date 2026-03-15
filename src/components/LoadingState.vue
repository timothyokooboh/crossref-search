<template>
  <div :class="{ ' md:grid-cols-[320px_1fr]': !results }" class="grid gap-4">
    <div v-if="!results" class="flex flex-col gap-3">
      <div class="flex justify-between">
        <Skeleton class="w-20 h-8" />
        <Skeleton class="w-20 h-8" />
      </div>

      <Skeleton class="h-50 w-full" />

      <Skeleton class="h-50 w-full" />
    </div>

    <div class="flex flex-col gap-3">
      <Skeleton v-if="!results" class="h-10 w-full" />
      <Skeleton v-for="n in 10" :key="n" class="h-30 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Skeleton } from './ui/skeleton'
import { useSearchStore } from '@/store/useSearchStore'

const { results } = storeToRefs(useSearchStore())
</script>
