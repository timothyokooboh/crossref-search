<template>
  <aside>
    <div class="sticky top-5">
      <FiltersHeader class="mb-4" />
      <FiltersList />
    </div>
  </aside>
</template>

<script setup lang="ts">
import FiltersHeader from './FiltersHeader.vue'
import FiltersList from './FiltersList.vue'
</script>
