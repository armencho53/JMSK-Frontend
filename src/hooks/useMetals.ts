import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMetals, createMetal, updateMetal, deactivateMetal } from '../lib/api'
import type { MetalCreate, MetalUpdate } from '../types/metal'
import { showSuccessToast, showErrorToast } from '../lib/toast'

export function useMetals(includeInactive = false) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['metals', includeInactive],
    queryFn: () => fetchMetals(includeInactive),
    staleTime: 5 * 60 * 1000,
  })

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['metals'] })
    queryClient.invalidateQueries({ queryKey: ['supplies'] })
  }

  const createMutation = useMutation({
    mutationFn: (data: MetalCreate) => createMetal(data),
    onSuccess: () => {
      invalidateRelatedQueries()
      showSuccessToast('Metal created successfully')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to create metal'
      showErrorToast(message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MetalUpdate }) => updateMetal(id, data),
    onSuccess: () => {
      invalidateRelatedQueries()
      showSuccessToast('Metal updated successfully')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to update metal'
      showErrorToast(message)
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateMetal(id),
    onSuccess: () => {
      invalidateRelatedQueries()
      showSuccessToast('Metal deactivated')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to deactivate metal'
      showErrorToast(message)
    },
  })

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => updateMetal(id, { is_active: true }),
    onSuccess: () => {
      invalidateRelatedQueries()
      showSuccessToast('Metal reactivated')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to reactivate metal'
      showErrorToast(message)
    },
  })

  return {
    metals: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createMetal: createMutation,
    updateMetal: updateMutation,
    deactivateMetal: deactivateMutation,
    reactivateMetal: reactivateMutation,
  }
}
