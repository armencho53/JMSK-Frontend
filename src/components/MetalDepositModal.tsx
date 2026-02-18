import { useEffect, useState } from 'react'
import { useMetals } from '../hooks/useMetals'

interface MetalDepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { metal_id: number; quantity_grams: number; notes?: string }) => void
  isSubmitting: boolean
}

export default function MetalDepositModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: MetalDepositModalProps) {
  const [metalId, setMetalId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { metals, isLoading: metalsLoading } = useMetals()

  useEffect(() => {
    if (isOpen) {
      setMetalId('')
      setQuantity('')
      setNotes('')
      setErrors({})
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!metalId) newErrors.metal_id = 'Metal is required'
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) newErrors.quantity = 'Must be a positive number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      metal_id: metalId as number,
      quantity_grams: parseFloat(quantity),
      notes: notes.trim() || undefined,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Record Metal Deposit</h3>
          </div>
          <div className="px-6 py-4">
            <form id="deposit-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="deposit-metal" className="block text-sm font-medium text-gray-700">
                  Metal <span className="text-red-500">*</span>
                </label>
                <select
                  id="deposit-metal"
                  value={metalId}
                  onChange={(e) => setMetalId(e.target.value ? Number(e.target.value) : '')}
                  disabled={metalsLoading}
                  className={`mt-1 block w-full border ${errors.metal_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">{metalsLoading ? 'Loading...' : 'Select metal'}</option>
                  {metals.filter(m => m.is_active).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({(m.fine_percentage * 100).toFixed(1)}%)
                    </option>
                  ))}
                </select>
                {errors.metal_id && <p className="mt-1 text-sm text-red-600">{errors.metal_id}</p>}
              </div>
              <div>
                <label htmlFor="deposit-qty" className="block text-sm font-medium text-gray-700">
                  Quantity (grams) <span className="text-red-500">*</span>
                </label>
                <input
                  id="deposit-qty"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`mt-1 block w-full border ${errors.quantity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., 50.0"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>
              <div>
                <label htmlFor="deposit-notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="deposit-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Optional notes..."
                />
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="deposit-form"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Record Deposit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
