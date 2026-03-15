<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-[#64748B]">Sorted by:</span>

    <Tabs :default-value="sortBy">
      <TabsList>
        <TabsTrigger value="relevance" @click="sortBy = 'relevance'"> Relevance </TabsTrigger>
        <TabsTrigger value="published" @click="sortBy = 'published'"> Year </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchStore } from '@/store/useSearchStore'
import { storeToRefs } from 'pinia'

const { sortBy } = storeToRefs(useSearchStore())
</script>
