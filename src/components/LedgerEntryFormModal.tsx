/**
 * LedgerEntryFormModal — Create/edit ledger entries for department metal flow.
 *
 * Features:
 * - Department pre-filled from page filter
 * - Order searchable dropdown showing order_number — description (metal_name)
 * - Metal type auto-filled from selected order's metal_id, editable dropdown from metals API
 * - Direction IN/OUT radio toggle with green/red styling
 * - Quantity and Weight inputs
 * - Calculated fine weight display with formula
 * - Date defaults to today, Notes textarea
 * - Handles both create and edit modes
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */
import { useEffect, useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { createLedgerEntry, updateLedgerEntry } from '../lib/ledgerApi'
import { computeFineWeight, getPurityLabel } from '../lib/fineWeight'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import type { LedgerEntry, LedgerEntryCreate, LedgerEntryUpdate } from '../types/ledger'
import type { Metal } from '../types/metal'
import type { Order } from '../types/order'

interface Department {
  id: number
  name: string
  is_active: boolean
}

interface LedgerEntryFormModalProps {
  isOpen: boolean
  onClose: () => void
  entry: LedgerEntry | null  // null for create, populated for edit
  departmentId?: number       // pre-fill from page filter
  onSuccess: () => void
}

export default function LedgerEntryFormModal({
  isOpen,
  onClose,
  entry,
  departmentId,
  onSuccess,
}: LedgerEntryFormModalProps) {
  const isEditMode = entry !== null

  // Form state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>('')
  const [selectedOrderId, setSelectedOrderId] = useState<number | ''>('')
  const [metalId, setMetalId] = useState<number | ''>('')
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN')
  const [quantity, setQuantity] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/departments/')
      return response.data as Department[]
    },
    enabled: isOpen,
  })

  // Fetch orders
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data as Order[]
    },
    enabled: isOpen,
  })

  // Fetch metals
  const { data: metals } = useQuery({
    queryKey: ['metals'],
    queryFn: async () => {
      const response = await api.get('/metals')
      return response.data as Metal[]
    },
    enabled: isOpen,
  })

  // Initialize / reset form when modal opens or entry changes
  useEffect(() => {
    if (!isOpen) return

    if (isEditMode && entry) {
      setSelectedDepartmentId(entry.department_id)
      setSelectedOrderId(entry.order_id)
      setMetalId(entry.metal_id)
      setDirection(entry.direction)
      setQuantity(
        entry.direction === 'IN'
          ? String(entry.qty_in ?? '')
          : String(entry.qty_out ?? '')
      )
      setWeight(
        entry.direction === 'IN'
          ? String(entry.weight_in ?? '')
          : String(entry.weight_out ?? '')
      )
      setDate(entry.date)
      setNotes(entry.notes ?? '')
      setOrderSearch('')
    } else {
      // Create mode
      setSelectedDepartmentId(departmentId ?? '')
      setSelectedOrderId('')
      setMetalId('')
      setDirection('IN')
      setQuantity('')
      setWeight('')
      setDate(new Date().toISOString().slice(0, 10))
      setNotes('')
      setOrderSearch('')
    }
    setErrors({})
    setIsOrderDropdownOpen(false)
  }, [isOpen, entry, departmentId, isEditMode])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Selected order object
  const selectedOrder = useMemo(
    () => orders?.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  )

  // Auto-fill metal_id from selected order (Req 8.3)
  useEffect(() => {
    if (selectedOrder?.metal_id) {
      setMetalId(selectedOrder.metal_id)
    }
  }, [selectedOrder])

  // Filtered orders for searchable dropdown (Req 8.2)
  const filteredOrders = useMemo(() => {
    if (!orders) return []
    if (!orderSearch.trim()) return orders
    const q = orderSearch.toLowerCase()
    return orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        (o.product_description ?? '').toLowerCase().includes(q) ||
        (o.metal_name ?? '').toLowerCase().includes(q)
    )
  }, [orders, orderSearch])

  // Current metal object for fine weight calculation
  const currentMetal = useMemo(
    () => metals?.find((m) => m.id === metalId) ?? null,
    [metals, metalId]
  )

  // Calculated fine weight (Req 8.4, 8.5)
  const weightNum = parseFloat(weight) || 0
  const fineWeightValue =
    currentMetal && weightNum > 0
      ? computeFineWeight(weightNum, currentMetal.fine_percentage, direction)
      : null
  const purityLabel =
    currentMetal ? getPurityLabel(currentMetal.name, currentMetal.fine_percentage) : null

  // Mutations
  const createMutation = useMutation({
    mutationFn: createLedgerEntry,
    onSuccess: () => {
      showSuccessToast('Ledger entry created')
      onSuccess()
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.detail || 'Failed to create entry')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: LedgerEntryUpdate) => updateLedgerEntry(entry!.id, data),
    onSuccess: () => {
      showSuccessToast('Ledger entry updated')
      onSuccess()
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.detail || 'Failed to update entry')
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!selectedDepartmentId) newErrors.department = 'Department is required'
    if (!selectedOrderId) newErrors.order = 'Order is required'
    if (!metalId) newErrors.metalType = 'Metal type is required'
    if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = 'Quantity must be positive'
    if (!weight || parseFloat(weight) <= 0) newErrors.weight = 'Weight must be positive'
    if (!date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (isEditMode) {
      const data: LedgerEntryUpdate = {
        date,
        department_id: selectedDepartmentId as number,
        order_id: selectedOrderId as number,
        metal_id: metalId as number,
        direction,
        quantity: parseFloat(quantity),
        weight: parseFloat(weight),
        notes: notes.trim() || undefined,
      }
      updateMutation.mutate(data)
    } else {
      const data: LedgerEntryCreate = {
        date,
        department_id: selectedDepartmentId as number,
        order_id: selectedOrderId as number,
        metal_id: metalId as number,
        direction,
        quantity: parseFloat(quantity),
        weight: parseFloat(weight),
        notes: notes.trim() || undefined,
      }
      createMutation.mutate(data)
    }
  }

  // Format order label for dropdown (Req 8.2)
  const formatOrderLabel = (order: Order) => {
    const desc = order.product_description ? ` — ${order.product_description}` : ''
    const metal = order.metal_name ? ` (${order.metal_name})` : ''
    return `${order.order_number}${desc}${metal}`
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="ledger-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="ledger-modal-title">
                {isEditMode ? 'Edit Ledger Entry' : 'Add Ledger Entry'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <form id="ledger-entry-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Department (Req 8.1 — pre-filled from filter) */}
              <div>
                <label htmlFor="ledger-department" className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="ledger-department"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value ? Number(e.target.value) : '')}
                  className={`mt-1 block w-full border ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select department</option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              {/* Order — searchable dropdown (Req 8.1, 8.2) */}
              <div className="relative">
                <label htmlFor="ledger-order-search" className="block text-sm font-medium text-gray-700">
                  Order <span className="text-red-500">*</span>
                </label>
                <input
                  id="ledger-order-search"
                  type="text"
                  placeholder={selectedOrder ? formatOrderLabel(selectedOrder) : 'Search orders...'}
                  value={isOrderDropdownOpen ? orderSearch : (selectedOrder ? formatOrderLabel(selectedOrder) : '')}
                  onChange={(e) => {
                    setOrderSearch(e.target.value)
                    if (!isOrderDropdownOpen) setIsOrderDropdownOpen(true)
                  }}
                  onFocus={() => setIsOrderDropdownOpen(true)}
                  className={`mt-1 block w-full border ${
                    errors.order ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  autoComplete="off"
                />
                {isOrderDropdownOpen && (
                  <>
                    {/* Click-away overlay */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOrderDropdownOpen(false)} />
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <li
                            key={order.id}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                              order.id === selectedOrderId ? 'bg-indigo-100 font-medium' : ''
                            }`}
                            onClick={() => {
                              setSelectedOrderId(order.id)
                              setOrderSearch('')
                              setIsOrderDropdownOpen(false)
                            }}
                          >
                            {formatOrderLabel(order)}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-gray-500">No orders found</li>
                      )}
                    </ul>
                  </>
                )}
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                )}
              </div>

              {/* Metal Type (Req 8.1, 8.3 — auto-filled from order, editable) */}
              <div>
                <label htmlFor="ledger-metal-type" className="block text-sm font-medium text-gray-700">
                  Metal Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="ledger-metal-type"
                  value={metalId}
                  onChange={(e) => setMetalId(e.target.value ? Number(e.target.value) : '')}
                  className={`mt-1 block w-full border ${
                    errors.metalType ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select metal type</option>
                  {metals?.filter((m) => m.is_active).map((metal) => (
                    <option key={metal.id} value={metal.id}>
                      {metal.name} ({metal.code})
                    </option>
                  ))}
                </select>
                {errors.metalType && (
                  <p className="mt-1 text-sm text-red-600">{errors.metalType}</p>
                )}
              </div>

              {/* Direction IN/OUT radio toggle (Req 8.1, 8.6) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection('IN')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border-2 transition-colors ${
                      direction === 'IN'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    ↓ IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('OUT')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border-2 transition-colors ${
                      direction === 'OUT'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    ↑ OUT
                  </button>
                </div>
              </div>

              {/* Quantity and Weight row (Req 8.1) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ledger-quantity" className="block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ledger-quantity"
                    min="0"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.quantity ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="ledger-weight" className="block text-sm font-medium text-gray-700">
                    Weight (g) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ledger-weight"
                    min="0"
                    step="0.001"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.weight ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="0.000"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* Calculated Fine Weight display (Req 8.4, 8.5) */}
              {fineWeightValue !== null && purityLabel && (
                <div className={`rounded-md p-3 border ${
                  direction === 'IN'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Fine Weight
                  </div>
                  <div className={`text-lg font-bold ${
                    direction === 'IN' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {direction === 'IN' ? '+' : '−'}{Math.abs(fineWeightValue).toFixed(3)}g
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    = {weightNum.toFixed(3)}g × {purityLabel}
                  </div>
                </div>
              )}

              {/* Date (Req 8.1 — defaults to today) */}
              <div>
                <label htmlFor="ledger-date" className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="ledger-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`mt-1 block w-full border ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Notes (Req 8.1 — optional) */}
              <div>
                <label htmlFor="ledger-notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="ledger-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Optional notes..."
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
                form="ledger-entry-form"
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
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditMode ? (
                  'Update Entry'
                ) : (
                  'Create Entry'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
