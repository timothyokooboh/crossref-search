<template>
  <div class="shadow flex flex-col gap-3 rounded-lg p-4 sm:p-6">
    <section class="flex gap-2">
      <span class="uppercase font-bold rounded text-xs py-1 px-2 bg-[#005999]/10 text-[#005999]">
        {{ result.type }}
      </span>

      <span
        v-if="result.published"
        class="uppercase font-bold rounded text-xs py-1 px-2 bg-gray-200 text-gray-900"
      >
        Published: {{ formatDateParts(result.published) }}
      </span>
    </section>

    <h2 v-if="result.title" class="text-[#0F172A] text-lg max-w-[65ch] font-bold capitalize">
      {{ result.title }}
    </h2>

    <section v-if="result.publisher" class="flex flex-col gap-1">
      <h2 class="flex gap-2 items-center">
        <BookOpenCheck class="text-[#64748B] size-4" role="presentation" />
        <span class="text-[#0F172A] font-semibold text-sm">Publisher</span>
      </h2>

      <p class="text-sm text-[#334155] font-medium">
        {{ result.publisher }}
      </p>
    </section>

    <section v-if="result.authors" class="flex flex-col gap-1">
      <h2 class="flex items-center gap-2">
        <Users class="text-[#64748B] size-4" role="presentation" />
        <span class="text-[#0F172A] font-semibold text-sm">Authors</span>
      </h2>

      <div class="flex flex-wrap gap-2 text-[13px]">
        <span v-for="(author, index) in result.authors" :key="index" class="text-[#475569]">
          <span v-if="author.name">{{ author.name }}</span>
          <span v-else>{{ author.given }} {{ author.family }}</span>
          <span v-if="index !== result.authors.length - 1" class="pl-2">|</span>
        </span>
      </div>
    </section>

    <section v-if="result.abstract" class="flex flex-col gap-1">
      <h2 class="flex items-center gap-2">
        <NotebookText class="text-[#64748B] size-4" role="presentation" />
        <span class="#0F172A font-semibold text-sm">Abstract</span>
      </h2>
      <p v-html="sanitizedAbstract" class="text-sm text-[#475569] leading-7" />
    </section>

    <section class="flex flex-col flex-wrap sm:flex-row sm:items-center gap-2">
      <a
        :href="result.url"
        target="_blank"
        rel="noreferrer"
        class="flex items-center gap-2 w-fit py-1 px-2 font-bold rounded bg-[#005999]/10 text-[#005999] hover:underline hover:decoration-dashed decoration-current"
      >
        <ExternalLink class="size-4" />
        <span class="break-all">{{ result.url }}</span>
      </a>

      <Button
        v-if="isSupported"
        variant="ghost"
        @click="startShare(result.title, result.url)"
        class="w-fit"
      >
        <Share2 class="size-4" />
        <span>Share</span>
      </Button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { BookOpenCheck, ExternalLink, Share2, Users, NotebookText } from 'lucide-vue-next'
import { useShare } from '@vueuse/core'
import { formatDateParts } from '@/lib/utils'
import type { ResultItem } from '@/types'
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  result: ResultItem
}>()

const { share, isSupported } = useShare()
const sanitizedAbstract = computed(() => DOMPurify.sanitize(props.result.abstract ?? ''))

function startShare(text: string | undefined, url: string) {
  share({
    title: 'Crossref metadata',
    text,
    url,
  })
}
</script>
