<template>
  <ul v-if="results" class="flex flex-col gap-3">
    <li v-for="data in results.items" :key="data.url">
      <ResultsCard :result="data" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ResultsCard from './ResultsCard.vue'
import { useSearchStore } from '@/store/useSearchStore'

const { results } = storeToRefs(useSearchStore())
</script>
