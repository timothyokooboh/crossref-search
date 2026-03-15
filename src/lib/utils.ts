import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { format, isValid } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isCanceledError(err: unknown): err is { name?: string; code?: string } {
  return !!err && typeof err === 'object'
}

export function formatDateParts(parts: [number, number, number]) {
  if (!parts) return

  const [year, month, day] = parts
  if (!month || !day) return year

  const date = new Date(year, month - 1, day)

  if (!isValid(date)) return

  return format(date, 'do MMM, yyyy')
}

export function parseFiltersString(input: string): { pubTypes: string[]; pubYears: string[] } {
  if (!input) return { pubTypes: [], pubYears: [] }

  // strip optional leading "filter=" and whitespace
  const raw = input.replace(/^filter=\s*/i, '').trim()
  if (!raw) return { pubTypes: [], pubYears: [] }

  const pubTypes: string[] = []
  const pubYears: string[] = []

  for (const part of raw.split(',')) {
    const token = part.trim()
    if (!token) continue

    if (token.startsWith('type-name:')) {
      const value = token.slice('type-name:'.length).trim()
      if (value) pubTypes.push(value)
      continue
    }

    if (token.startsWith('from-pub-date:')) {
      const value = token.slice('from-pub-date:'.length).trim()
      if (value) pubYears.push(value)
    }
  }

  return { pubTypes, pubYears }
}
