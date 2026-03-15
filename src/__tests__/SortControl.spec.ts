import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import SortControl from '@/components/SortControl.vue'
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

describe('SortControl', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('updates sortBy when clicking year tab', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSearchStore()
    store.sortBy = 'relevance'

    const wrapper = mount(SortControl, {
      global: {
        plugins: [pinia],
        stubs: {
          Tabs: { template: '<div><slot /></div>' },
          TabsList: { template: '<div><slot /></div>' },
          TabsTrigger: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(store.sortBy).toBe('published')
  })
})
