import { BalanceBreakdown } from '../types/customer'

interface BalanceCardProps {
  balance: BalanceBreakdown
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Balance Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Total Balance</p>
          <p className="mt-2 text-3xl font-bold text-indigo-900">
            ${balance.total.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-900">
            ${balance.pending.toFixed(2)}
          </p>
          <p className="text-xs text-yellow-700 mt-1">Pending & In Progress</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-900">
            ${balance.completed.toFixed(2)}
          </p>
          <p className="text-xs text-green-700 mt-1">Completed & Shipped</p>
        </div>
      </div>
    </div>
  )
}
