import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCompanyMetalBalances, recordMetalDeposit } from '../lib/api'
import type { MetalDepositCreate } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'

export function useCompanyMetalBalances(companyId: number) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['company-metal-balances', companyId],
    queryFn: () => fetchCompanyMetalBalances(companyId),
    enabled: !!companyId,
    staleTime: 2 * 60 * 1000,
  })

  const depositMutation = useMutation({
    mutationFn: (data: MetalDepositCreate) => recordMetalDeposit(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-metal-balances', companyId] })
      showSuccessToast('Metal deposit recorded')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to record deposit'
      showErrorToast(message)
    },
  })

  return {
    balances: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    recordDeposit: depositMutation,
  }
}
