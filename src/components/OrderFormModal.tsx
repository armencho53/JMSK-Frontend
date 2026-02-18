import { useEffect, useState } from 'react'
import ContactSelector from './ContactSelector'
import type { Order } from '../types/order'
import type { Contact } from '../types/contact'
import { useLookupValues } from '../lib/useLookupValues'
import { ORDER_STATUS_OPTIONS } from '../lib/constants'

interface OrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  order?: Order | null
  onSubmit: (data: OrderFormData) => void
  isSubmitting: boolean
}

interface OrderFormData {
  contact_id?: number
  product_description: string
  specifications?: string
  quantity: number
  price?: number
  status?: string
  due_date?: string
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
  labor_cost?: number
}

export default function OrderFormModal({
  isOpen,
  onClose,
  mode,
  order,
  onSubmit,
  isSubmitting,
}: OrderFormModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    product_description: '',
    quantity: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()
  const { options: metalTypeOptions, isLoading: metalTypeLoading, isError: metalTypeError, refetch: refetchMetalTypes } = useLookupValues('metal_type')

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && order) {
        setFormData({
          contact_id: order.contact_id,
          product_description: order.product_description || '',
          specifications: order.specifications,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          due_date: order.due_date ? order.due_date.slice(0, 16) : '',
          metal_type: order.metal_type,
          target_weight_per_piece: order.target_weight_per_piece,
          initial_total_weight: order.initial_total_weight,
          labor_cost: order.labor_cost,
        })
        if (order.contact) {
          setSelectedContact(order.contact as Contact)
        }
      } else {
        setFormData({
          product_description: '',
          quantity: 1,
        })
        setSelectedContact(undefined)
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

    if (!formData.contact_id) {
      newErrors.contact_id = 'Contact is required'
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Modal Header with Border */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {mode === 'create' ? 'Create Order' : 'Edit Order'}
            </h3>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <form id="order-form" onSubmit={(e) => {
              e.preventDefault()
              if (!validate()) {
                return
              }
              onSubmit(formData)
            }} className="space-y-6">
                {/* Contact Selector */}
                <ContactSelector
                  value={formData.contact_id}
                  onChange={(contactId, contact: Contact | undefined) => {
                    setFormData({
                      ...formData,
                      contact_id: contactId,
                    })
                    setSelectedContact(contact)
                  }}
                  error={errors.contact_id}
                />

                {/* Selected Contact Display */}
                {selectedContact && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Selected Contact</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs text-gray-500 uppercase tracking-wide">Name</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gray-900">{selectedContact.name}</dd>
                      </div>
                      {selectedContact.email && (
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Email</dt>
                          <dd className="mt-0.5 text-sm text-gray-900">{selectedContact.email}</dd>
                        </div>
                      )}
                      {selectedContact.phone && (
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Phone</dt>
                          <dd className="mt-0.5 text-sm text-gray-900">{selectedContact.phone}</dd>
                        </div>
                      )}
                      {selectedContact.company && (
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Company</dt>
                          <dd className="mt-0.5 text-sm text-gray-900">{selectedContact.company.name}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Product Details Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Product Details</h4>
                  <div className="space-y-4">
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
                      <p className="mt-1 text-xs text-gray-500">Main product description</p>
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
                      <p className="mt-1 text-xs text-gray-500">Technical specifications or requirements</p>
                    </div>
                  </div>
                </div>

                {/* Order Details Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Order Details</h4>
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
                    <p className="mt-1 text-xs text-gray-500">Number of items to produce</p>
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
                    <p className="mt-1 text-xs text-gray-500">Total order price</p>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                </div>

                  {/* Status and Due Date */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
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
                          value={formData.status || 'PENDING'}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {ORDER_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Current order status</p>
                      </div>
                    )}

                    {/* Due Date */}
                    <div className={mode === 'edit' ? '' : 'col-span-2'}>
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
                      <p className="mt-1 text-xs text-gray-500">Expected completion date</p>
                    </div>
                  </div>
                </div>

                {/* Metal & Weight Tracking Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Metal & Weight Tracking</h4>

                  {/* Metal Type */}
                  <div className="mb-4">
                    <label htmlFor="metal-type" className="block text-sm font-medium text-gray-700">
                      Metal Type
                    </label>
                    {metalTypeError ? (
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-sm text-red-600">Failed to load metal types.</p>
                        <button
                          type="button"
                          onClick={() => refetchMetalTypes()}
                          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <select
                        id="metal-type"
                        value={formData.metal_type || ''}
                        onChange={(e) => setFormData({ ...formData, metal_type: e.target.value || undefined })}
                        disabled={metalTypeLoading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                      >
                        <option value="">
                          {metalTypeLoading ? 'Loading...' : 'Select metal type'}
                        </option>
                        {metalTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Type of metal used</p>
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
                      <p className="mt-1 text-xs text-gray-500">Expected final weight per piece</p>
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
                      <p className="mt-1 text-xs text-gray-500">Total raw material weight</p>
                    </div>
                  </div>

                  {/* Labor Cost */}
                  <div className="mt-4">
                    <label htmlFor="labor-cost" className="block text-sm font-medium text-gray-700">
                      Labor Cost
                    </label>
                    <input
                      type="number"
                      id="labor-cost"
                      min="0"
                      step="0.01"
                      value={formData.labor_cost ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, labor_cost: e.target.value ? parseFloat(e.target.value) : undefined })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Manufacturing labor cost for this order</p>
                  </div>
                </div>
              </form>
            </div>

          {/* Modal Footer with Border */}
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
                form="order-form"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
