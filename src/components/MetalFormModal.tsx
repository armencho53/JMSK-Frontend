import { useEffect, useState } from 'react'
import type { Metal } from '../types/metal'

interface MetalFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  metal?: Metal | null
  onSubmit: (data: { code: string; name: string; fine_percentage: number; average_cost_per_gram?: number | null }) => void
  isSubmitting: boolean
  apiError?: string
}

export default function MetalFormModal({
  isOpen,
  onClose,
  mode,
  metal,
  onSubmit,
  isSubmitting,
  apiError,
}: MetalFormModalProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [finePercentage, setFinePercentage] = useState('')
  const [avgCost, setAvgCost] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && metal) {
        setCode(metal.code)
        setName(metal.name)
        setFinePercentage((metal.fine_percentage * 100).toString())
        setAvgCost(metal.average_cost_per_gram?.toString() || '')
      } else {
        setCode('')
        setName('')
        setFinePercentage('')
        setAvgCost('')
      }
      setErrors({})
    }
  }, [isOpen, mode, metal])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!code.trim()) newErrors.code = 'Code is required'
    if (!name.trim()) newErrors.name = 'Name is required'
    const pct = parseFloat(finePercentage)
    if (isNaN(pct) || pct < 0 || pct > 100) {
      newErrors.fine_percentage = 'Must be between 0 and 100'
    }
    if (avgCost && (isNaN(parseFloat(avgCost)) || parseFloat(avgCost) < 0)) {
      newErrors.average_cost_per_gram = 'Must be a non-negative number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      fine_percentage: parseFloat(finePercentage) / 100,
      average_cost_per_gram: avgCost ? parseFloat(avgCost) : null,
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
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Add Metal' : 'Edit Metal'}
            </h3>
          </div>
          <div className="px-6 py-4">
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{apiError}</div>
            )}
            <form id="metal-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="metal-code" className="block text-sm font-medium text-gray-700">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="metal-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={mode === 'edit'}
                  className={`mt-1 block w-full border ${errors.code ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="e.g., GOLD_18K"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>
              <div>
                <label htmlFor="metal-name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="metal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., Gold 18K"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="metal-fine-pct" className="block text-sm font-medium text-gray-700">
                  Fine Percentage (%) <span className="text-red-500">*</span>
                </label>
                <input
                  id="metal-fine-pct"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={finePercentage}
                  onChange={(e) => setFinePercentage(e.target.value)}
                  className={`mt-1 block w-full border ${errors.fine_percentage ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., 75.0"
                />
                <p className="mt-1 text-xs text-gray-500">Enter as percentage (e.g., 58.5 for 14K gold)</p>
                {errors.fine_percentage && <p className="mt-1 text-sm text-red-600">{errors.fine_percentage}</p>}
              </div>
              <div>
                <label htmlFor="metal-avg-cost" className="block text-sm font-medium text-gray-700">
                  Avg Cost per Gram
                </label>
                <input
                  id="metal-avg-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={avgCost}
                  onChange={(e) => setAvgCost(e.target.value)}
                  className={`mt-1 block w-full border ${errors.average_cost_per_gram ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors.average_cost_per_gram && <p className="mt-1 text-sm text-red-600">{errors.average_cost_per_gram}</p>}
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
              form="metal-form"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
