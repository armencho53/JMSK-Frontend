import { useState } from 'react'
import { useCompanyMetalBalances } from '../hooks/useCompanyMetalBalances'
import { useAuthStore } from '../store/authStore'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import MetalDepositModal from './MetalDepositModal'

const MANAGER_ROLES = new Set(['manager', 'admin'])

interface CompanyMetalBalancesProps {
  companyId: number
}

export default function CompanyMetalBalances({ companyId }: CompanyMetalBalancesProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const { balances, isLoading, isError, recordDeposit } = useCompanyMetalBalances(companyId)
  const user = useAuthStore((s) => s.user)
  const isManager = user ? MANAGER_ROLES.has(user.role.toLowerCase()) : false

  if (isLoading) {
    return <p className="text-sm text-slate-500 py-4">Loading metal balances...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-600 py-4">Failed to load metal balances.</p>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-900">Metal Balances</h3>
        {isManager && (
          <Button variant="primary" size="sm" onClick={() => setIsDepositOpen(true)}>
            Record Deposit
          </Button>
        )}
      </div>

      <Card variant="elevated" padding="none">
        {balances.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No metal balances recorded for this company.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Metal</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance (g)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {balances.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                      {b.metal_name} <span className="text-slate-400 font-mono text-xs">({b.metal_code})</span>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${b.balance_grams < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {b.balance_grams.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <MetalDepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSubmit={(data) => {
          recordDeposit.mutate(data, {
            onSuccess: () => setIsDepositOpen(false),
          })
        }}
        isSubmitting={recordDeposit.isPending}
      />
    </div>
  )
}
