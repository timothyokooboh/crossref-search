<template>
  <main class="px-3 py-5 mx-auto sm:px-5">
    <h1 class="sr-only">Crossref search</h1>

    <div v-if="shouldShowLandingState">
      <LoadingState v-if="loading" />
      <EmptyState v-else />
    </div>
    <div v-else class="grid md:grid-cols-[320px_1fr] gap-4">
      <FiltersSidebar />
      <ResultsSection />
    </div>
  </main>
</template>

<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue'
import FiltersSidebar from '@/components/FiltersSidebar.vue'
import LoadingState from '@/components/LoadingState.vue'
import ResultsSection from '@/components/ResultsSection.vue'
import { useSearchStore } from '@/store/useSearchStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { loading, results, searchQuery } = storeToRefs(useSearchStore())

const shouldShowLandingState = computed(() => {
  return !results.value || ((results.value.items?.length ?? 0) === 0 && !searchQuery.value)
})
</script>
