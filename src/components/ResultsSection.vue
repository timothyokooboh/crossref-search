<template>
  <section class="flex flex-col gap-3">
    <ResultsHeader />

    <div v-if="shouldShowLoadingOrEmptyStates">
      <LoadingState v-if="loading" />
      <EmptyState v-else />
    </div>

    <div v-else>
      <LoadingState v-if="loading" />
      <ResultsList v-else />
    </div>

    <div v-if="results?.items?.length" class="flex flex-col gap-6 mt-8">
      <Pagination
        v-slot="{ page }"
        :items-per-page="10"
        :total="results?.total"
        :page="currentPage"
        @update:page="currentPage = $event"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious class="cursor-pointer" />
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === page"
              :key="Date.now()"
              class="cursor-pointer"
            >
              {{ item.value }}
            </PaginationItem>
          </template>
          <PaginationEllipsis :index="4" />
          <PaginationNext class="cursor-pointer" />
        </PaginationContent>
      </Pagination>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import ResultsHeader from './ResultsHeader.vue'
import ResultsList from './ResultsList.vue'
import EmptyState from './EmptyState.vue'
import LoadingState from './LoadingState.vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/store/useSearchStore'
import { computed } from 'vue'

const { currentPage, results, searchQuery, loading } = storeToRefs(useSearchStore())

const shouldShowLoadingOrEmptyStates = computed(() => {
  return !!searchQuery.value && (results.value?.items?.length ?? 0) === 0
})
</script>
