<template>
  <section
    class="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[75vh] text-center"
  >
    <img src="/empty-state.svg" alt="Search illustration" />
    <h2 class="text-3xl font-bold leading-9 mb-2">
      <span v-if="showNoResults">No results found</span>
      <span v-else>Start Your Search</span>
    </h2>

    <div class="text-lg leading-7 text-[#475569] text-pretty">
      <p v-if="showNoResults">There are no results for your search query or selected filters</p>
      <p v-else>
        Enter a title, author, DOIs, or ORCIDs to explore millions of scholarly records and
        metadata.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/store/useSearchStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { searchQuery, results, loading } = storeToRefs(useSearchStore())

const showNoResults = computed(() => {
  return (
    !!searchQuery.value &&
    !loading.value &&
    !!results.value &&
    (results.value.items?.length ?? 0) === 0
  )
})
</script>
