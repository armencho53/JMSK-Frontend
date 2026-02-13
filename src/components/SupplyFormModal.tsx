import { useEffect, useState } from 'react'
import { useLookupValues } from '../lib/useLookupValues'

interface Supply {
  id: number
  name: string
  type: string
  quantity: number
  unit: string
  cost_per_unit: number
  supplier: string
  notes: string
}

interface SupplyFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  supply?: Supply | null
  onSubmit: (data: {
    name: string
    type: string
    quantity: number
    unit: string
    cost_per_unit: number
    supplier: string
    notes: string
  }) => void
  isSubmitting: boolean
}

export default function SupplyFormModal({
  isOpen,
  onClose,
  mode,
  supply,
  onSubmit,
  isSubmitting,
}: SupplyFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    unit: '',
    cost_per_unit: '',
    supplier: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { options: supplyTypeOptions, isLoading: supplyTypeLoading, isError: supplyTypeError, refetch: refetchSupplyTypes } = useLookupValues('supply_type')
  // Initialize form data when modal opens or supply changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && supply) {
        setFormData({
          name: supply.name,
          type: supply.type,
          quantity: supply.quantity.toString(),
          unit: supply.unit,
          cost_per_unit: supply.cost_per_unit?.toString() || '',
          supplier: supply.supplier || '',
          notes: supply.notes || '',
        })
      } else {
        setFormData({
          name: '',
          type: '',
          quantity: '',
          unit: '',
          cost_per_unit: '',
          supplier: '',
          notes: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, supply])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required'
    } else {
      const qty = parseFloat(formData.quantity)
      if (isNaN(qty) || qty <= 0) {
        newErrors.quantity = 'Quantity must be a positive number'
      }
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required'
    }

    if (formData.cost_per_unit.trim()) {
      const cost = parseFloat(formData.cost_per_unit)
      if (isNaN(cost) || cost < 0) {
        newErrors.cost_per_unit = 'Cost per unit must be a positive number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit.trim(),
      cost_per_unit: formData.cost_per_unit.trim() ? parseFloat(formData.cost_per_unit) : 0,
      supplier: formData.supplier.trim(),
      notes: formData.notes.trim(),
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {mode === 'create' ? 'Add New Supply' : 'Edit Supply'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form id="supply-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="supply-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id="supply-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 14K Gold Wire"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Type Dropdown */}
                <div>
                  <label
                    htmlFor="supply-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type <span className="text-red-500">*</span>
                  </label>
                  {supplyTypeError ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-sm text-red-600">Failed to load supply types.</p>
                      <button
                        type="button"
                        onClick={() => refetchSupplyTypes()}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <select
                      id="supply-type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      disabled={supplyTypeLoading}
                      className={`mt-1 block w-full border ${
                        errors.type ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50`}
                    >
                      <option value="">
                        {supplyTypeLoading ? 'Loading...' : 'Select a type'}
                      </option>
                      {supplyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Category of the supply item</p>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                {/* Quantity and Unit Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="supply-quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="supply-quantity"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.quantity ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Current quantity in stock</p>
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="supply-unit"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="supply-unit"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.unit ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="e.g., grams, pieces"
                    />
                    <p className="mt-1 text-xs text-gray-500">Unit of measurement (grams, pieces, etc.)</p>
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                    )}
                  </div>
                </div>

                {/* Cost Per Unit */}
                <div>
                  <label
                    htmlFor="supply-cost"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cost Per Unit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="supply-cost"
                    value={formData.cost_per_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_per_unit: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.cost_per_unit ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">Price per unit in your currency</p>
                  {errors.cost_per_unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.cost_per_unit}</p>
                  )}
                </div>

                {/* Supplier */}
                <div>
                  <label
                    htmlFor="supply-supplier"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Supplier
                  </label>
                  <input
                    type="text"
                    id="supply-supplier"
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., ABC Metals Inc."
                  />
                  <p className="mt-1 text-xs text-gray-500">Name of the supplier or vendor</p>
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="supply-notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="supply-notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Additional information about this supply"
                  />
                  <p className="mt-1 text-xs text-gray-500">Any additional details or specifications</p>
                </div>
              </form>
            </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="supply-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create Supply'
              ) : (
                'Update Supply'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
