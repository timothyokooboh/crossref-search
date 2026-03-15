import type { ApiResponse, SearchParams } from '@/types'
import { http } from './http'

export const searchWorks = async (
  params: SearchParams,
  signal: AbortSignal,
): Promise<null | ApiResponse> => {
  if (!params['query.bibliographic']) return null
  return http.get('/works', { params, signal })
}
