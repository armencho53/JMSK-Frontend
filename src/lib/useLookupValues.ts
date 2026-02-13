import { useQuery } from '@tanstack/react-query'
import { fetchLookupValues } from './api'
import type { LookupValue } from '../types/lookupValue'

/**
 * Dropdown option format for use in select/dropdown components.
 * Maps lookup value code (UPPER_CASE) to value, display_label to label.
 *
 * Requirements: 8.2
 */
export interface LookupOption {
  value: string
  label: string
}

/**
 * Custom hook to fetch and cache tenant-scoped lookup values for a given category.
 *
 * Uses React Query with a 5-minute stale time so dropdown options are cached
 * across component mounts without excessive API calls.
 *
 * Returns both the raw LookupValue[] (as `data`) and a mapped `options` array
 * in { value, label } format ready for dropdown components.
 *
 * Requirements: 7.1, 7.2, 8.2
 */
export function useLookupValues(category: string) {
  const query = useQuery<LookupValue[]>({
    queryKey: ['lookup-values', category],
    queryFn: () => fetchLookupValues(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const options: LookupOption[] =
    query.data?.map((lv) => ({
      value: lv.code,
      label: lv.display_label,
    })) ?? []

  return {
    data: query.data,
    options,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
