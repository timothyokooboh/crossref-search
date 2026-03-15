import { describe, it, expect } from 'vitest'
import { formatDateParts, parseFiltersString } from '@/lib/utils'

describe('utils', () => {
  it('parses filter strings into pub types and years', () => {
    const input =
      'filter=type-name:Dataset,type-name:Component,from-pub-date:1900,from-pub-date:1903'
    const result = parseFiltersString(input)

    expect(result.pubTypes).toEqual(['Dataset', 'Component'])
    expect(result.pubYears).toEqual(['1900', '1903'])
  })

  it('formats date parts with day and month', () => {
    expect(formatDateParts([1991, 12, 31])).toBe('31st Dec, 1991')
  })

  it('returns year when month/day are missing', () => {
    expect(formatDateParts([1991, 0, 0] as [number, number, number])).toBe(1991)
  })
})
