<template>
  <div>
    <Collapsible default-open @update:open="isOpen = $event" class="bg-white shadow rounded-lg">
      <CollapsibleTrigger class="p-3 sm:p-4 w-full flex items-center justify-between">
        <div class="flex gap-2 items-center">
          <slot name="icon" />
          <span class="text-sm font-bold text-[#0F172A]">{{ title }}</span>
        </div>

        <ChevronDown
          class="duration-200 size-5"
          :class="{ 'rotate-180': isOpen, 'rotate-0': !isOpen }"
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul
          class="max-h-[35vh] overflow-y-auto snap-y snap-start flex flex-col gap-3 text-sm pb-3 px-3 sm:px-4"
        >
          <li
            v-for="(value, key) in items"
            class="flex items-center justify-between text-[#334155]"
            :key="`${key}_${value}`"
          >
            <div class="flex items-center gap-3">
              <Checkbox
                :id="`${key}_${value}`"
                :default-value="isSelected(key)"
                :key="`${key}_${value}_${isSelected(key)}`"
                @update:model-value="handleSelection($event as boolean, key)"
              />
              <Label :for="`${key}_${value}`">
                <span v-if="title === 'Publication Year'">Since</span>
                <span>{{ key }}</span>
              </Label>
            </div>

            <span v-if="title === 'Publication Type'">{{ formatCount(value) }}</span>
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<script setup lang="ts">
import type { FacetItem } from '@/types'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { ChevronDown } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/store/useSearchStore'
import { formatCount } from '@/lib/utils'

const props = defineProps<{
  title: 'Publication Type' | 'Publication Year'
  items: FacetItem | undefined
}>()

const isOpen = ref(true)

const { setFilters } = useSearchStore()
const { selectedPublicationTypes, selectedPublicationYears } = storeToRefs(useSearchStore())

const getSelectedItems = () => {
  return props.title === 'Publication Type'
    ? selectedPublicationTypes.value
    : selectedPublicationYears.value
}

const handleSelection = (checked: boolean, value: string) => {
  const pubTypes = [...selectedPublicationTypes.value]
  const pubYears = [...selectedPublicationYears.value]

  if (props.title === 'Publication Type') {
    if (checked && !pubTypes.includes(value)) pubTypes.push(value)
    if (!checked) {
      const idx = pubTypes.indexOf(value)
      if (idx >= 0) pubTypes.splice(idx, 1)
    }
  } else {
    if (checked && !pubYears.includes(value)) pubYears.push(value)
    if (!checked) {
      const idx = pubYears.indexOf(value)
      if (idx >= 0) pubYears.splice(idx, 1)
    }
  }

  setFilters(pubTypes, pubYears)
}

const isSelected = (key: string) => getSelectedItems().includes(key)
</script>
