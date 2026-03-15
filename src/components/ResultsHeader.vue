<template>
  <div
    class="bg-white p-3 sm:p-4 flex gap-3 flex-col sm:flex-row sm:items-center justify-between shadow rounded-lg"
  >
    <ResultsSummary />
    <SortControl />
  </div>
</template>

<script setup lang="ts">
import ResultsSummary from './ResultsSummary.vue'
import SortControl from './SortControl.vue'
</script>
