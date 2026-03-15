import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import ResultsSummary from '@/components/ResultsSummary.vue'
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

describe('ResultsSummary', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders total results and query text', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    store.searchQuery = 'climate'
    store.results = {
      total: 42,
      facets: [],
      items: [],
    } as any

    const wrapper = mount(ResultsSummary, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.text()).toContain('42 results')
    expect(wrapper.text()).toContain('"climate"')
  })
})
