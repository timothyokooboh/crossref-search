<template>
  <section>
    <h2 class="text-xl text-[#0F172A] font-bold">{{ results?.total }} results</h2>
    <div class="text-sm">
      <span class="text-[#64748B]">Search results for </span>
      <em class="#0F172A">"{{ searchQuery }}"</em>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useSearchStore } from '@/store/useSearchStore'
import { storeToRefs } from 'pinia'

const { results, searchQuery } = storeToRefs(useSearchStore())
</script>
