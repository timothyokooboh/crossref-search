import { parseFiltersString, isCanceledError } from '@/lib/utils'
import { searchWorks } from '@/services/api'
import type { Facet, Item, Results, SearchParams } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, watch, onWatcherCleanup } from 'vue'
import { debounce } from 'lodash-es'
import { useRouteQuery } from '@vueuse/router'
import { toast } from 'vue-sonner'

export const useSearchStore = defineStore('search', () => {
  const loading = ref(false)
  const currentPage = useRouteQuery('page', 1, { transform: Number })
  const searchQuery = useRouteQuery('q', '')
  const sortBy = useRouteQuery<undefined | 'relevance' | 'published'>('sortBy', 'relevance')
  const filters = useRouteQuery<string>('filters', '')
  const results = ref<Results | null>(null)
  const formattedFacets = ref<Facet[]>([])
  const lastFacetQuery = ref<string | null>(null)
  const DEBOUNCE_DELAY = 1200
  const ROWS = 10

  const offset = computed(() => (currentPage.value - 1) * ROWS)
  const selectedPublicationTypes = computed(() => parseFiltersString(filters.value).pubTypes)
  const selectedPublicationYears = computed(() => parseFiltersString(filters.value).pubYears)
  const hasSelectedFacets = computed(() => {
    return selectedPublicationTypes.value.length > 0 || selectedPublicationYears.value.length > 0
  })

  const shouldReplaceFacets = computed(() => {
    return (
      !formattedFacets.value.length ||
      !results.value ||
      !hasSelectedFacets.value ||
      lastFacetQuery.value !== searchQuery.value
    )
  })

  const updateSelectedFacetCounts = (
    facetIndex: number,
    selectedKeys: string[],
    responseValues: Record<string, number> | undefined,
  ) => {
    if (!formattedFacets.value[facetIndex]) return

    const currentFacet = formattedFacets.value[facetIndex]
    const updatedItems = { ...currentFacet.items }

    for (const key of selectedKeys) {
      updatedItems[key] = responseValues?.[key] ?? 0
    }

    const nextFacets = [...formattedFacets.value]
    nextFacets[facetIndex] = {
      ...currentFacet,
      items: updatedItems,
    }
    formattedFacets.value = nextFacets
  }

  // helper to update filters from arrays
  const setFilters = (pubTypes: string[], pubYears: string[]) => {
    const parts = [
      ...pubTypes.map((v) => `type-name:${v}`),
      ...pubYears.map((v) => `from-pub-date:${v}`),
    ]
    filters.value = parts.join(',')
  }

  const clearSelectedFilters = () => {
    setFilters([], [])
  }

  // reset current page when user changes query/filter/sort
  let skipInitialReset = true

  watch(
    () => [searchQuery.value, filters.value, sortBy.value],
    () => {
      if (skipInitialReset) {
        skipInitialReset = false
        return
      }
      if (currentPage.value !== 1) {
        currentPage.value = 1
      }
    },
  )

  watch(
    () => [searchQuery.value, sortBy.value, offset.value, filters.value],
    () => {
      const controller = new AbortController()
      getWorks(controller.signal)
      onWatcherCleanup(() => controller.abort())
    },
  )

  const getWorks = debounce(async (signal: AbortSignal) => {
    try {
      loading.value = true

      const params: SearchParams = {
        'query.bibliographic': searchQuery.value,
        facet: 'type-name:*,published:*',
        sort: sortBy.value,
        offset: offset.value,
        rows: ROWS,
      }

      if (filters.value) {
        params.filter = filters.value
      }

      const response = await searchWorks({ ...params }, signal)
      const data = response?.data

      if (data) {
        const items = data.message?.items
        const facets = data.message?.facets

        const pubTypesFacets: Facet = {
          groupTitle: 'Publication Type',
          items: facets['type-name']?.values,
        }

        const pubYearsFacets: Facet = {
          groupTitle: 'Publication Year',
          items: facets.published?.values,
        }

        if (shouldReplaceFacets.value) {
          formattedFacets.value = [pubTypesFacets, pubYearsFacets]
          lastFacetQuery.value = searchQuery.value
        } else {
          updateSelectedFacetCounts(0, selectedPublicationTypes.value, facets['type-name']?.values)
          updateSelectedFacetCounts(1, selectedPublicationYears.value, facets.published?.values)
        }

        results.value = {
          total: data.message['total-results'],
          facets: formattedFacets.value,
          items: items.map((item: Item) => ({
            url: item.URL,
            title: item.title?.[0] ?? item['container-title']?.[0],
            published: item.published?.['date-parts'][0],
            publisher: item.publisher,
            abstract: item.abstract,
            type: item.type,
            authors: item.author,
          })),
        }
      } else {
        results.value = null
      }
    } catch (err) {
      if (isCanceledError(err) && (err.name === 'CanceledError' || err.code === 'ERR_CANCELED')) {
        return
      }

      results.value = null
      toast.error('Error', {
        description: 'Unable to fetch data, please try again',
        position: 'top-right',
        unstyled: false,
      })
    } finally {
      loading.value = false
    }
  }, DEBOUNCE_DELAY)

  return {
    loading,
    currentPage,
    offset,
    searchQuery,
    sortBy,
    results,
    filters,
    selectedPublicationTypes,
    selectedPublicationYears,
    setFilters,
    clearSelectedFilters,
    formattedFacets,
  }
})
