<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <ListFilterPlus class="text-[#005999] size-4" />
      <span class="text-[#0F172A] text-lg">Filters</span>
    </div>

    <Button
      @click="clearSelectedFilters"
      size="sm"
      variant="ghost"
      class="cursor-pointer text-[#005999]"
      >Clear all</Button
    >
  </div>
</template>

<script setup lang="ts">
import { ListFilterPlus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/store/useSearchStore'

const { clearSelectedFilters } = useSearchStore()
</script>
