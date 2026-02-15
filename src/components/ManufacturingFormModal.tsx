import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useLookupValues } from '../lib/useLookupValues'
import { STEP_STATUS_OPTIONS } from '../lib/constants'

interface ManufacturingStep {
  id: number
  order_id: number
  parent_step_id?: number
  step_type?: string
  description?: string
  status: string
  department?: string
  worker_name?: string
  started_at?: string
  completed_at?: string
  received_at?: string
  transferred_by?: string
  received_by?: string
  quantity_received?: number
  quantity_returned?: number
  weight_received?: number
  weight_returned?: number
  notes?: string
  created_at?: string
  updated_at?: string
  children?: ManufacturingStep[]
}

interface Order {
  id: number
  order_number: string
  contact_name: string
}

interface Department {
  id: number
  name: string
  is_active: boolean
}

interface ManufacturingFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'transfer'
  step?: ManufacturingStep | null
  onSubmit: (data: ManufacturingFormData | TransferFormData) => void
  isSubmitting: boolean
}

interface TransferFormData {
  quantity: number
  weight: number
  next_step_type: string
  received_by: string
  department?: string
}

interface ManufacturingFormData {
  order_id: number
  step_type: string
  description?: string
  status?: string
  department?: string
  worker_name?: string
  quantity_received?: number
  quantity_returned?: number
  weight_received?: number
  weight_returned?: number
  transferred_by?: string
  received_by?: string
  notes?: string
}

export default function ManufacturingFormModal({
  isOpen,
  onClose,
  mode,
  step,
  onSubmit,
  isSubmitting,
}: ManufacturingFormModalProps) {
  const [formData, setFormData] = useState<ManufacturingFormData>({
    order_id: 0,
    step_type: '',
  })
  const [transferData, setTransferData] = useState<TransferFormData>({
    quantity: 0,
    weight: 0,
    next_step_type: '',
    received_by: '',
    department: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [remaining, setRemaining] = useState<{
    quantity: number
    weight: number
  } | null>(null)

  // Fetch step type options from lookup values API
  const { options: stepTypeOptions, isLoading: stepTypeLoading, isError: stepTypeError, refetch: refetchStepTypes } = useLookupValues('step_type')

  // Fetch orders for the dropdown
  const { data: orders = [] } = useQuery<Order[]>({ 
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/')
      return data
    },
    enabled: isOpen,
  })

  // Fetch departments for the dropdown
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get('/departments')
      return data
    },
    enabled: isOpen,
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && step) {
        setFormData({
          order_id: step.order_id,
          step_type: step.step_type || '',
          description: step.description,
          status: step.status,
          department: step.department,
          worker_name: step.worker_name,
          quantity_received: step.quantity_received,
          quantity_returned: step.quantity_returned,
          weight_received: step.weight_received,
          weight_returned: step.weight_returned,
          transferred_by: step.transferred_by,
          received_by: step.received_by,
          notes: step.notes,
        })
      } else if (mode === 'transfer' && step) {
        // Fetch remaining quantities for transfer mode
        api.get(`/manufacturing/steps/${step.id}/remaining`)
          .then(({ data }) => {
            setRemaining({
              quantity: data.remaining_quantity,
              weight: data.remaining_weight
            })
            setTransferData({
              quantity: 0,
              weight: 0,
              next_step_type: '',
              received_by: '',
              department: '',
            })
          })
          .catch((error) => {
            console.error('Failed to fetch remaining quantities:', error)
          })
      } else {
        // Reset form for create mode
        setFormData({
          order_id: 0,
          step_type: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, step])

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

    if (mode === 'transfer') {
      // Transfer mode validation
      if (!transferData.quantity || transferData.quantity <= 0) {
        newErrors.quantity = 'Transfer quantity must be greater than 0'
      }
      if (remaining && transferData.quantity > remaining.quantity) {
        newErrors.quantity = `Cannot transfer more than ${remaining.quantity} pieces`
      }

      if (!transferData.weight || transferData.weight <= 0) {
        newErrors.weight = 'Transfer weight must be greater than 0'
      }
      if (remaining && transferData.weight > remaining.weight) {
        newErrors.weight = `Cannot transfer more than ${remaining.weight}g`
      }

      if (!transferData.next_step_type) {
        newErrors.next_step_type = 'Next step type is required'
      }

      if (!transferData.next_step_type.trim()) {
        newErrors.next_step_type = 'Next step type is required'
      }

      if (!transferData.received_by.trim()) {
        newErrors.received_by = 'Recipient worker is required'
      }

      if (!transferData.department || !transferData.department.trim()) {
        newErrors.department = 'Receiving department is required'
      }
    } else {
      // Create/Edit mode validation
      if (!formData.order_id || formData.order_id === 0) {
        newErrors.order_id = 'Please select an order'
      }

      if (!formData.step_type) {
        newErrors.step_type = 'Step type is required'
      }

      // Quantity tracking validation
      if (formData.quantity_received !== undefined && formData.quantity_received < 0) {
        newErrors.quantity_received = 'Quantity received cannot be negative'
      }
      if (formData.quantity_returned !== undefined && formData.quantity_returned < 0) {
        newErrors.quantity_returned = 'Quantity returned cannot be negative'
      }

      // Enhanced weight tracking validation
      if (formData.weight_received !== undefined && formData.weight_received < 0) {
        newErrors.weight_received = 'Weight received cannot be negative'
      }
      if (formData.weight_returned !== undefined && formData.weight_returned < 0) {
        newErrors.weight_returned = 'Weight returned cannot be negative'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted, mode:', mode)
    console.log('Validation result:', validate())
    if (validate()) {
      if (mode === 'transfer') {
        console.log('Submitting transfer data:', transferData)
        onSubmit(transferData)
      } else {
        console.log('Submitting form data:', formData)
        onSubmit(formData)
      }
    } else {
      console.log('Validation failed, errors:', errors)
    }
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
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Modal Header with Border */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {mode === 'create' ? 'Create Manufacturing Step' : mode === 'transfer' ? 'Transfer Items' : 'Edit Manufacturing Step'}
            </h3>
            {mode === 'transfer' && step && (
              <p className="mt-1 text-sm text-gray-600">
                Transfer items from: <span className="font-medium">{step.step_type}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <div className="space-y-4">
              {/* Transfer Mode Form */}
              {mode === 'transfer' && (
                <>
                  {/* Remaining Quantities Summary Card */}
                  {remaining && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Available to Transfer</h4>
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Quantity</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">{remaining.quantity} <span className="text-sm font-normal text-gray-600">pieces</span></dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Weight</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">{remaining.weight}<span className="text-sm font-normal text-gray-600">g</span></dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {/* Transfer Amounts Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Transfer Amounts</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="transfer_quantity" className="block text-sm font-medium text-gray-700">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          id="transfer_quantity"
                          value={transferData.quantity || ''}
                          onChange={(e) => setTransferData({ ...transferData, quantity: parseFloat(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.quantity ? 'border-red-500' : ''
                          }`}
                          placeholder="e.g., 5"
                        />
                        <p className="mt-1 text-xs text-gray-500">Number of pieces to transfer</p>
                        {errors.quantity && (
                          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="transfer_weight" className="block text-sm font-medium text-gray-700">
                          Weight (g) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          id="transfer_weight"
                          value={transferData.weight || ''}
                          onChange={(e) => setTransferData({ ...transferData, weight: parseFloat(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.weight ? 'border-red-500' : ''
                          }`}
                          placeholder="e.g., 50.0"
                        />
                        <p className="mt-1 text-xs text-gray-500">Total weight in grams</p>
                        {errors.weight && (
                          <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destination Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Destination</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="next_step_type" className="block text-sm font-medium text-gray-700">
                          Next Step Type <span className="text-red-500">*</span>
                        </label>
                        {stepTypeError ? (
                          <div className="mt-1 flex items-center space-x-2">
                            <p className="text-sm text-red-600">Failed to load step types.</p>
                            <button
                              type="button"
                              onClick={() => refetchStepTypes()}
                              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                              Retry
                            </button>
                          </div>
                        ) : (
                          <select
                            id="next_step_type"
                            value={transferData.next_step_type}
                            onChange={(e) => setTransferData({ ...transferData, next_step_type: e.target.value })}
                            disabled={stepTypeLoading}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 ${
                              errors.next_step_type ? 'border-red-500' : ''
                            }`}
                          >
                            <option value="">
                              {stepTypeLoading ? 'Loading...' : 'Select next step type'}
                            </option>
                            {stepTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Manufacturing step to transfer to</p>
                        {errors.next_step_type && (
                          <p className="mt-1 text-sm text-red-600">{errors.next_step_type}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="transfer_department" className="block text-sm font-medium text-gray-700">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="transfer_department"
                            value={transferData.department || ''}
                            onChange={(e) => setTransferData({ ...transferData, department: e.target.value })}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                              errors.department ? 'border-red-500' : ''
                            }`}
                          >
                            <option value="">Select department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">Receiving department</p>
                          {errors.department && (
                            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="received_by" className="block text-sm font-medium text-gray-700">
                            Received By <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="received_by"
                            value={transferData.received_by}
                            onChange={(e) => setTransferData({ ...transferData, received_by: e.target.value })}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                              errors.received_by ? 'border-red-500' : ''
                            }`}
                            placeholder="Worker name"
                          />
                          <p className="mt-1 text-xs text-gray-500">Worker receiving items</p>
                          {errors.received_by && (
                            <p className="mt-1 text-sm text-red-600">{errors.received_by}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Create/Edit Mode Form */}
              {mode !== 'transfer' && (
                <>
              {/* Basic Information Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="order_id" className="block text-sm font-medium text-gray-700">
                      Order <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="order_id"
                      value={formData.order_id}
                      onChange={(e) => setFormData({ ...formData, order_id: parseInt(e.target.value) })}
                      disabled={mode === 'edit'}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.order_id ? 'border-red-500' : ''
                      } ${mode === 'edit' ? 'bg-gray-100' : ''}`}
                    >
                      <option value={0}>Select an order</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.order_number} - {order.contact_name || "Unknown"}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Order this step belongs to</p>
                    {errors.order_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.order_id}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="step_type" className="block text-sm font-medium text-gray-700">
                        Step Type <span className="text-red-500">*</span>
                      </label>
                      {stepTypeError ? (
                        <div className="mt-1 flex items-center space-x-2">
                          <p className="text-sm text-red-600">Failed to load step types.</p>
                          <button
                            type="button"
                            onClick={() => refetchStepTypes()}
                            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <select
                          id="step_type"
                          value={formData.step_type}
                          onChange={(e) => setFormData({ ...formData, step_type: e.target.value })}
                          disabled={stepTypeLoading}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 ${
                            errors.step_type ? 'border-red-500' : ''
                          }`}
                        >
                          <option value="">
                            {stepTypeLoading ? 'Loading...' : 'Select step type'}
                          </option>
                          {stepTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Type of manufacturing step</p>
                      {errors.step_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.step_type}</p>
                      )}
                    </div>

                    {mode === 'edit' && (
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          value={formData.status || 'IN_PROGRESS'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {STEP_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Current step status</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Additional details about this step..."
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional details or specifications</p>
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Assignment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Department handling this step</p>
                  </div>

                  <div>
                    <label htmlFor="worker_name" className="block text-sm font-medium text-gray-700">
                      Worker Name
                    </label>
                    <input
                      type="text"
                      id="worker_name"
                      value={formData.worker_name || ''}
                      onChange={(e) => setFormData({ ...formData, worker_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Worker name"
                    />
                    <p className="mt-1 text-xs text-gray-500">Assigned worker</p>
                  </div>
                </div>
              </div>

              {/* Quantity Tracking Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Quantity Tracking</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity_received" className="block text-sm font-medium text-gray-700">
                      Quantity Received
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="quantity_received"
                      value={formData.quantity_received || ''}
                      onChange={(e) => setFormData({ ...formData, quantity_received: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 10"
                    />
                    <p className="mt-1 text-xs text-gray-500">Pieces received at this step</p>
                  </div>
                  {mode === 'edit' && (
                    <div>
                      <label htmlFor="quantity_returned" className="block text-sm font-medium text-gray-700">
                        Quantity Returned
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="quantity_returned"
                        value={formData.quantity_returned || ''}
                        onChange={(e) => setFormData({ ...formData, quantity_returned: e.target.value ? parseFloat(e.target.value) : undefined })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 9"
                      />
                      <p className="mt-1 text-xs text-gray-500">Pieces completed/returned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight Tracking Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Weight Tracking</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight_received" className="block text-sm font-medium text-gray-700">
                      Weight Received (g)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="weight_received"
                      value={formData.weight_received || ''}
                      onChange={(e) => setFormData({ ...formData, weight_received: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 90.0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Initial weight in grams</p>
                  </div>
                  {mode === 'edit' && (
                    <div>
                      <label htmlFor="weight_returned" className="block text-sm font-medium text-gray-700">
                        Weight Returned (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="weight_returned"
                        value={formData.weight_returned || ''}
                        onChange={(e) => setFormData({ ...formData, weight_returned: e.target.value ? parseFloat(e.target.value) : undefined })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 88.2"
                      />
                      <p className="mt-1 text-xs text-gray-500">Final weight after processing</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transfer Tracking Section (edit mode) */}
              {mode === 'edit' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Transfer Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="transferred_by" className="block text-sm font-medium text-gray-700">
                        Transferred By
                      </label>
                      <input
                        type="text"
                        id="transferred_by"
                        value={formData.transferred_by || ''}
                        onChange={(e) => setFormData({ ...formData, transferred_by: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Worker who sent"
                      />
                      <p className="mt-1 text-xs text-gray-500">Worker who sent items</p>
                    </div>
                    <div>
                      <label htmlFor="received_by" className="block text-sm font-medium text-gray-700">
                        Received By
                      </label>
                      <input
                        type="text"
                        id="received_by"
                        value={formData.received_by || ''}
                        onChange={(e) => setFormData({ ...formData, received_by: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Worker who received"
                      />
                      <p className="mt-1 text-xs text-gray-500">Worker who received items</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section (edit mode only) */}
              {mode === 'edit' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Additional Notes</h4>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Additional notes or observations..."
                    />
                    <p className="mt-1 text-xs text-gray-500">Any observations or special notes</p>
                  </div>
                </div>
              )}
                </>
              )}
            </div>
        </div>

          {/* Modal Footer with Border */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : mode === 'create' ? 'Create Step' : mode === 'transfer' ? 'Transfer Items' : 'Save Changes'}
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}
