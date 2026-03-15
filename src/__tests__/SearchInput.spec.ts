import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, defineComponent } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import { useSearchStore } from '@/store/useSearchStore'

const queryState = new Map<string, ReturnType<typeof ref>>()

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (key: string, defaultValue: unknown, options?: { transform?: (v: unknown) => unknown }) => {
    if (!queryState.has(key)) {
      const initial = options?.transform ? options.transform(defaultValue) : defaultValue
      queryState.set(key, ref(initial))
    }
    return queryState.get(key)!
  },
}))

vi.mock('@/services/api', () => ({
  searchWorks: vi.fn().mockResolvedValue({
    data: {
      message: {
        items: [],
        facets: {
          'type-name': { values: {} },
          published: { values: {} },
        },
        'total-results': 0,
      },
    },
  }),
}))

vi.mock('vue-sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('lucide-vue-next', () => ({
  SearchIcon: defineComponent({ template: '<svg />' }),
}))

describe('SearchInput', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('updates search query via v-model', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()

    const wrapper = mount(SearchInput, {
      global: {
        plugins: [pinia],
        stubs: {
          Input: {
            template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" />',
          },
        },
      },
    })

    await wrapper.find('input').setValue('climate')
    expect(store.searchQuery).toBe('climate')
  })
})
