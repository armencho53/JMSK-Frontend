import { useEffect, useState } from 'react'
import CustomerSelector from './CustomerSelector'

interface Order {
  id: number
  order_number: string
  customer_id?: number
  customer_name: string
  customer_email?: string
  customer_phone?: string
  product_description: string
  specifications?: string
  quantity: number
  price?: number
  status: string
  due_date?: string
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
  created_at: string
  updated_at: string
}

interface OrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  order?: Order | null
  onSubmit: (data: OrderFormData) => void
  isSubmitting: boolean
}

interface OrderFormData {
  customer_id?: number
  customer_name: string
  customer_email?: string
  customer_phone?: string
  product_description: string
  specifications?: string
  quantity: number
  price?: number
  status?: string
  due_date?: string
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'cancelled', label: 'Cancelled' },
]

const metalTypeOptions = [
  { value: '', label: 'Select metal type' },
  { value: 'gold_24k', label: 'Gold 24K' },
  { value: 'gold_22k', label: 'Gold 22K' },
  { value: 'gold_18k', label: 'Gold 18K' },
  { value: 'gold_14k', label: 'Gold 14K' },
  { value: 'silver_925', label: 'Silver 925' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'other', label: 'Other' },
]

export default function OrderFormModal({
  isOpen,
  onClose,
  mode,
  order,
  onSubmit,
  isSubmitting,
}: OrderFormModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    product_description: '',
    quantity: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && order) {
        setFormData({
          customer_id: order.customer_id,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          product_description: order.product_description,
          specifications: order.specifications,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          due_date: order.due_date ? order.due_date.slice(0, 16) : '',
          metal_type: order.metal_type,
          target_weight_per_piece: order.target_weight_per_piece,
          initial_total_weight: order.initial_total_weight,
        })
      } else {
        setFormData({
          customer_name: '',
          product_description: '',
          quantity: 1,
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, order])

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

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required'
    }

    if (!formData.product_description.trim()) {
      newErrors.product_description = 'Product description is required'
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900 mb-4"
                id="modal-title"
              >
                {mode === 'create' ? 'Create Order' : 'Edit Order'}
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault()
                if (!validate()) {
                  return
                }
                onSubmit(formData)
              }} className="space-y-4">
                {/* Customer Selector */}
                <CustomerSelector
                  value={formData.customer_id}
                  onChange={(customerId, customer) => {
                    if (customer) {
                      setFormData({
                        ...formData,
                        customer_id: customerId,
                        customer_name: customer.name,
                        customer_email: customer.email,
                        customer_phone: customer.phone || '',
                      })
                    } else {
                      setFormData({
                        ...formData,
                        customer_id: undefined,
                        customer_name: '',
                        customer_email: '',
                        customer_phone: '',
                      })
                    }
                  }}
                  error={errors.customer_name}
                />

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="customer-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer-name"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.customer_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="John Doe"
                  />
                  {errors.customer_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                  )}
                </div>

                {/* Customer Email */}
                <div>
                  <label
                    htmlFor="customer-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Customer Email
                  </label>
                  <input
                    type="email"
                    id="customer-email"
                    value={formData.customer_email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_email: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label
                    htmlFor="customer-phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    id="customer-phone"
                    value={formData.customer_phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label
                    htmlFor="product-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="product-description"
                    rows={3}
                    value={formData.product_description}
                    onChange={(e) =>
                      setFormData({ ...formData, product_description: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.product_description ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Describe the product..."
                  />
                  {errors.product_description && (
                    <p className="mt-1 text-sm text-red-600">{errors.product_description}</p>
                  )}
                </div>

                {/* Specifications */}
                <div>
                  <label
                    htmlFor="specifications"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specifications
                  </label>
                  <textarea
                    id="specifications"
                    rows={3}
                    value={formData.specifications || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, specifications: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Additional specifications..."
                  />
                </div>

                {/* Quantity and Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                      }
                      className={`mt-1 block w-full border ${
                        errors.quantity ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })
                      }
                      className={`mt-1 block w-full border ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                </div>

                {/* Metal Type and Weight Tracking Section */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Metal & Weight Tracking</h4>

                  {/* Metal Type */}
                  <div className="mb-4">
                    <label htmlFor="metal-type" className="block text-sm font-medium text-gray-700">
                      Metal Type
                    </label>
                    <select
                      id="metal-type"
                      value={formData.metal_type || ''}
                      onChange={(e) => setFormData({ ...formData, metal_type: e.target.value || undefined })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {metalTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight Fields Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Target Weight per Piece */}
                    <div>
                      <label htmlFor="target-weight" className="block text-sm font-medium text-gray-700">
                        Target Weight per Piece (g)
                      </label>
                      <input
                        type="number"
                        id="target-weight"
                        min="0"
                        step="0.01"
                        value={formData.target_weight_per_piece || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, target_weight_per_piece: e.target.value ? parseFloat(e.target.value) : undefined })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 8.0"
                      />
                      <p className="mt-1 text-xs text-gray-500">Expected final weight</p>
                    </div>

                    {/* Initial Total Weight */}
                    <div>
                      <label htmlFor="initial-weight" className="block text-sm font-medium text-gray-700">
                        Initial Total Weight (g)
                      </label>
                      <input
                        type="number"
                        id="initial-weight"
                        min="0"
                        step="0.01"
                        value={formData.initial_total_weight || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, initial_total_weight: e.target.value ? parseFloat(e.target.value) : undefined })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 90.0"
                      />
                      <p className="mt-1 text-xs text-gray-500">Raw material weight</p>
                    </div>
                  </div>
                </div>

                {/* Status (only in edit mode) */}
                {mode === 'edit' && (
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status || 'pending'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Due Date */}
                <div>
                  <label
                    htmlFor="due-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    id="due-date"
                    value={formData.due_date || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Form Actions */}
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                      'Create Order'
                    ) : (
                      'Update Order'
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
