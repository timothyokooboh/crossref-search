<template>
  <header class="flex items-center h-16 px-3 sm:px-5 bg-white shadow">
    <img src="/crossref-logo.png" width="100px" height="50px" alt="" class="object-contain" />

    <div class="flex flex-1 justify-end sm:justify-center">
      <SearchInput class="flex-1" />
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchInput from './SearchInput.vue'
</script>
