import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, defineComponent } from 'vue'
import FiltersList from '@/components/FiltersList.vue'
import { useSearchStore } from '@/store/useSearchStore'

const queryState = new Map<string, ReturnType<typeof ref>>()

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (
    key: string,
    defaultValue: unknown,
    options?: { transform?: (v: unknown) => unknown },
  ) => {
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
  BookText: defineComponent({ template: '<svg />' }),
  CalendarFold: defineComponent({ template: '<svg />' }),
}))

describe('FiltersList', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders both filter cards when facets exist', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    store.results = {
      total: 0,
      facets: [
        { groupTitle: 'Publication Type', items: { Book: 10 } },
        { groupTitle: 'Publication Year', items: { 2020: 4 } },
      ],
      items: [],
    }

    const wrapper = mount(FiltersList, {
      global: {
        plugins: [pinia],
        stubs: {
          FiltersCard: {
            props: ['title', 'items'],
            template: '<div class="filters-card">{{ title }}</div>',
          },
        },
      },
    })

    const cards = wrapper.findAll('.filters-card')
    expect(cards).toHaveLength(2)
    expect(cards[0]?.text()).toContain('Publication Type')
    expect(cards[1]?.text()).toContain('Publication Year')
  })
})
