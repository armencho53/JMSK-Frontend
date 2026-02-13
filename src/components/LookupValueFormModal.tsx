import { useEffect, useState } from 'react'
import type { LookupValue } from '../types/lookupValue'

interface LookupValueFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  category: string
  value: LookupValue | null
  onSubmit: (data: { code: string; display_label: string; sort_order: number }) => void
  isSubmitting: boolean
  apiError?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  metal_type: 'Metal Types',
  step_type: 'Step Types',
  supply_type: 'Supply Types',
}

export default function LookupValueFormModal({
  isOpen,
  onClose,
  mode,
  category,
  value,
  onSubmit,
  isSubmitting,
  apiError,
}: LookupValueFormModalProps) {
  const [formData, setFormData] = useState({ code: '', display_label: '', sort_order: 0 })
  const [validationError, setValidationError] = useState('')

  // Reset form when modal opens or mode/value changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && value) {
        setFormData({
          code: value.code,
          display_label: value.display_label,
          sort_order: value.sort_order,
        })
      } else {
        setFormData({ code: '', display_label: '', sort_order: 0 })
      }
      setValidationError('')
    }
  }, [isOpen, mode, value])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (mode === 'create' && !formData.code.trim()) {
      setValidationError('Code is required')
      return
    }
    if (!formData.display_label.trim()) {
      setValidationError('Display label is required')
      return
    }

    onSubmit({
      code: formData.code.trim().toUpperCase(),
      display_label: formData.display_label.trim(),
      sort_order: formData.sort_order,
    })
  }

  if (!isOpen) return null

  const displayError = validationError || apiError
  const categoryLabel = CATEGORY_LABELS[category] || category

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="lookup-value-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="lookup-value-modal-title">
              {mode === 'create' ? 'Add Value' : 'Edit Value'} — {categoryLabel}
            </h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {displayError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            <form id="lookup-value-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lv-code" className="block text-sm font-medium text-gray-700">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="lv-code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  disabled={mode === 'edit'}
                  placeholder="e.g. GOLD_24K"
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    mode === 'edit' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                  }`}
                />
                {mode === 'edit' && (
                  <p className="mt-1 text-xs text-gray-400">Code cannot be changed after creation</p>
                )}
              </div>

              <div>
                <label htmlFor="lv-label" className="block text-sm font-medium text-gray-700">
                  Display Label <span className="text-red-500">*</span>
                </label>
                <input
                  id="lv-label"
                  type="text"
                  value={formData.display_label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_label: e.target.value }))}
                  placeholder="e.g. Gold 24K"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lv-sort" className="block text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  id="lv-sort"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lookup-value-form"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </>
                ) : mode === 'create' ? (
                  'Create'
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
