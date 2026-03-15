import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
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

describe('EmptyState', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('shows start message when there is no search query', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    store.$patch({
      searchQuery: '',
      loading: false,
      results: null,
    })

    const wrapper = mount(EmptyState, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.text()).toContain('Start Your Search')
    expect(wrapper.text()).not.toContain('No results found')
  })

  it('shows no results message when search has no items', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    store.$patch({
      searchQuery: 'climate',
      loading: false,
      results: {
        total: 0,
        facets: [],
        items: [],
      },
    })

    const wrapper = mount(EmptyState, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.text()).toContain('No results found')
  })
})
