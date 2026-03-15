<template>
  <ul class="flex flex-col gap-3">
    <li>
      <FiltersCard title="Publication Type" :items="results?.facets?.[0]?.items">
        <template #icon>
          <BookText class="size-4 text-[#94A3B8]" />
        </template>
      </FiltersCard>
    </li>

    <li>
      <FiltersCard title="Publication Year" :items="results?.facets?.[1]?.items">
        <template #icon>
          <CalendarFold class="size-4 text-[#94A3B8]" />
        </template>
      </FiltersCard>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import FiltersCard from './FiltersCard.vue'
import { BookText, CalendarFold } from 'lucide-vue-next'
import { useSearchStore } from '@/store/useSearchStore'

const { results } = storeToRefs(useSearchStore())
</script>
