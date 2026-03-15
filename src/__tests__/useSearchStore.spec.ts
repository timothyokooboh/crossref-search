import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useSearchStore } from '@/store/useSearchStore'
import { searchWorks } from '@/services/api'

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

describe('useSearchStore', () => {
  beforeEach(() => {
    queryState.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('derives selected filters from the route filter string', () => {
    const store = useSearchStore()
    store.setFilters(['Book Set', 'Other'], ['1403'])

    expect(store.filters).toBe('type-name:Book Set,type-name:Other,from-pub-date:1403')
    expect(store.selectedPublicationTypes).toEqual(['Book Set', 'Other'])
    expect(store.selectedPublicationYears).toEqual(['1403'])
  })

  it('clears filters via helper', () => {
    const store = useSearchStore()
    store.setFilters(['Dataset'], ['1900'])
    store.clearSelectedFilters()

    expect(store.filters).toBe('')
    expect(store.selectedPublicationTypes).toEqual([])
    expect(store.selectedPublicationYears).toEqual([])
  })

  it('updates selected filters when route query string changes directly', () => {
    const store = useSearchStore()
    store.filters = 'type-name:Book,from-pub-date:2020'

    expect(store.selectedPublicationTypes).toEqual(['Book'])
    expect(store.selectedPublicationYears).toEqual(['2020'])
  })

  it('builds filter string without trailing separators', () => {
    const store = useSearchStore()
    store.setFilters(['Book Set'], [])

    expect(store.filters).toBe('type-name:Book Set')
    expect(store.selectedPublicationTypes).toEqual(['Book Set'])
    expect(store.selectedPublicationYears).toEqual([])
  })

  it('includes both type and year filters when set', () => {
    const store = useSearchStore()
    store.setFilters(['Dataset'], ['1900', '1903'])

    expect(store.filters).toBe('type-name:Dataset,from-pub-date:1900,from-pub-date:1903')
    expect(store.selectedPublicationTypes).toEqual(['Dataset'])
    expect(store.selectedPublicationYears).toEqual(['1900', '1903'])
  })

  it('calls searchWorks with filters when filters are set', async () => {
    const store = useSearchStore()
    const mockedSearchWorks = vi.mocked(searchWorks)
    mockedSearchWorks.mockClear()

    store.searchQuery = 'climate'
    store.filters = 'type-name:Book,from-pub-date:2019'

    await vi.runAllTimersAsync()
    await Promise.resolve()

    expect(mockedSearchWorks).toHaveBeenCalled()
    const call = mockedSearchWorks.mock.calls[0]
    expect(call).toBeDefined()
    const params = call?.[0] as { [key: string]: unknown } | undefined
    expect(params).toMatchObject({
      'query.bibliographic': 'climate',
      filter: 'type-name:Book,from-pub-date:2019',
    })
  })

  it('does not include filter param when filters are empty', async () => {
    const store = useSearchStore()
    const mockedSearchWorks = vi.mocked(searchWorks)
    mockedSearchWorks.mockClear()

    store.searchQuery = 'climate'
    store.filters = ''

    await vi.runAllTimersAsync()
    await Promise.resolve()

    expect(mockedSearchWorks).toHaveBeenCalled()
    const call = mockedSearchWorks.mock.calls[0]
    expect(call).toBeDefined()
    const params = call?.[0] as { [key: string]: unknown } | undefined
    expect(params).toMatchObject({
      'query.bibliographic': 'climate',
    })
    expect(params?.filter).toBeUndefined()
  })

})
