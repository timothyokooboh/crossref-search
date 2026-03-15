export type SearchParams = {
  'query.bibliographic'?: string
  facet?: 'type-name:*,published:*'
  filter?: string
  sort?: 'published' | 'relevance'
  offset?: number
  rows?: number
}

export type ApiResponse = {
  data: {
    message: {
      'total-results': number
      items: ApiResponseItem[]
      facets: {
        'type-name': {
          values: Record<string, number>
        }
        published: {
          values: Record<number, number>
        }
      }
    }
  }
}

export type ApiResponseItem = {
  title?: string[]
  'container-title': string[]
  URL: string
  published?: {
    'date-parts': [number, number, number][]
  }
  publisher: string
  abstract: string
  type: string
  author: { name?: string; firstName?: string; lastName?: string }[]
}

export type FacetItem = Record<string | number, number>

export type Facet = {
  groupTitle: string
  items: FacetItem
}

export type Facets = Facet[]

export type ResultItem = {
  url: string
  title?: string
  published?: [number, number, number]
  publisher: string
  type: string
  abstract?: string
  authors: { name?: string; given?: string; family?: string }[]
}

export type Results = {
  total: number
  facets: Facets
  items: ResultItem[]
}
