<template>
  <div class="flex relative max-w-50 sm:max-w-75 md:max-w-125">
    <SearchIcon class="size-4 absolute top-2.5 left-2 text-[#94A3B8]" />
    <Input
      aria-label="Search title, author, DOIs, ORCIDs"
      placeholder="Search title, author, DOIs, ORCIDs..."
      class="flex-1 pl-9 text-sm border-0 bg-[#F1F5F9] text-[#6B7280]"
      v-model="searchQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useSearchStore } from '@/store/useSearchStore'
import { SearchIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const { searchQuery } = storeToRefs(useSearchStore())
</script>
