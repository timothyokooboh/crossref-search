import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, defineComponent } from 'vue'
import FiltersCard from '@/components/FiltersCard.vue'
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
  ChevronDown: defineComponent({ template: '<svg />' }),
}))

describe('FiltersCard', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('updates filters when selecting a publication type', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    const setFiltersSpy = vi.spyOn(store, 'setFilters')

    const wrapper = mount(FiltersCard, {
      props: {
        title: 'Publication Type',
        items: { Book: 12 },
      },
      global: {
        plugins: [pinia],
        stubs: {
          Collapsible: { template: '<div><slot /></div>' },
          CollapsibleTrigger: { template: '<button><slot /></button>' },
          CollapsibleContent: { template: '<div><slot /></div>' },
          Label: { template: '<label><slot /></label>' },
          Checkbox: {
            template:
              '<button data-test="checkbox" @click="$emit(\'update:model-value\', true)">check</button>',
          },
        },
      },
    })

    await wrapper.find('[data-test="checkbox"]').trigger('click')
    expect(setFiltersSpy).toHaveBeenCalled()
    expect(store.filters).toBe('type-name:Book')
  })
})
