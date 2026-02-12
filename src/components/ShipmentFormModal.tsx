import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Order } from '../types/order'

interface Shipment {
  id: number
  order_id: number
  tracking_number: string
  carrier: string
  shipping_address: string
  status: string
  shipping_cost?: number
  notes?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
}

interface ShipmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  shipment?: Shipment | null
  onSubmit: (data: ShipmentFormData) => void
  isSubmitting: boolean
}

interface ShipmentFormData {
  order_id: number
  tracking_number: string
  carrier: string
  shipping_address: string
  status?: string
  shipping_cost?: number
  notes?: string
}

const statusOptions = [
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'RETURNED', label: 'Returned' },
]

export default function ShipmentFormModal({
  isOpen,
  onClose,
  mode,
  shipment,
  onSubmit,
  isSubmitting,
}: ShipmentFormModalProps) {
  const [formData, setFormData] = useState<ShipmentFormData>({
    order_id: 0,
    tracking_number: '',
    carrier: '',
    shipping_address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  // Fetch orders for the dropdown
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/')
      return data
    },
    enabled: isOpen,
  })

  // Function to fetch and populate default address for a company
  const fetchDefaultAddress = async (companyId: number) => {
    setIsLoadingAddress(true)
    try {
      const { data } = await api.get(`/companies/${companyId}/addresses/shipment-default`)
      if (data) {
        // Format the address as a string for the textarea
        const addressString = `${data.street_address}\n${data.city}, ${data.state} ${data.zip_code}\n${data.country}`
        setFormData(prev => ({ ...prev, shipping_address: addressString }))
      }
    } catch (error) {
      console.error('Failed to fetch default address:', error)
      // Don't show error to user - just leave address empty
    } finally {
      setIsLoadingAddress(false)
    }
  }

  // Handle order selection change
  const handleOrderChange = (orderId: number) => {
    setFormData({ ...formData, order_id: orderId })
    
    // Find the selected order and fetch its company's default address
    const selectedOrder = orders.find(order => order.id === orderId)
    if (selectedOrder && selectedOrder.company_id) {
      fetchDefaultAddress(selectedOrder.company_id)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && shipment) {
        setFormData({
          order_id: shipment.order_id,
          tracking_number: shipment.tracking_number,
          carrier: shipment.carrier,
          shipping_address: shipment.shipping_address,
          status: shipment.status,
          shipping_cost: shipment.shipping_cost,
          notes: shipment.notes,
        })
      } else {
        setFormData({
          order_id: 0,
          tracking_number: '',
          carrier: '',
          shipping_address: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, shipment])

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

    if (!formData.order_id || formData.order_id === 0) {
      newErrors.order_id = 'Please select an order'
    }

    if (!formData.tracking_number.trim()) {
      newErrors.tracking_number = 'Tracking number is required'
    }

    if (!formData.carrier.trim()) {
      newErrors.carrier = 'Carrier is required'
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required'
    }

    if (formData.shipping_cost !== undefined && formData.shipping_cost < 0) {
      newErrors.shipping_cost = 'Shipping cost cannot be negative'
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
              {mode === 'create' ? 'Create Shipment' : 'Edit Shipment'}
            </h3>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <form
              id="shipment-form"
              onSubmit={(e) => {
                e.preventDefault()
                if (!validate()) {
                  return
                }
                onSubmit(formData)
              }}
              className="space-y-6"
            >
              {/* Shipment Details Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Shipment Details</h4>
                <div className="space-y-4">
                  {/* Order Selection */}
                  <div>
                    <label
                      htmlFor="order"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Order <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="order"
                      value={formData.order_id}
                      onChange={(e) => handleOrderChange(parseInt(e.target.value))}
                      className={`mt-1 block w-full border ${
                        errors.order_id ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      disabled={mode === 'edit' || isLoadingAddress}
                    >
                      <option value={0}>Select an order...</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.order_number} - {order.contact?.name || order.contact?.name || "Unknown" || 'Unknown Contact'}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Order to ship</p>
                    {errors.order_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.order_id}</p>
                    )}
                  </div>

                  {/* Tracking Number */}
                  <div>
                    <label
                      htmlFor="tracking-number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tracking Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="tracking-number"
                      value={formData.tracking_number}
                      onChange={(e) =>
                        setFormData({ ...formData, tracking_number: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.tracking_number ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="1Z999AA10123456784"
                    />
                    <p className="mt-1 text-xs text-gray-500">Carrier tracking number</p>
                    {errors.tracking_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.tracking_number}</p>
                    )}
                  </div>

                  {/* Carrier */}
                  <div>
                    <label
                      htmlFor="carrier"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Carrier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="carrier"
                      value={formData.carrier}
                      onChange={(e) =>
                        setFormData({ ...formData, carrier: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.carrier ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="UPS, FedEx, DHL, etc."
                    />
                    <p className="mt-1 text-xs text-gray-500">Shipping carrier name</p>
                    {errors.carrier && (
                      <p className="mt-1 text-sm text-red-600">{errors.carrier}</p>
                    )}
                  </div>

                  {/* Shipping Cost */}
                  <div>
                    <label
                      htmlFor="shipping-cost"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Shipping Cost
                    </label>
                    <input
                      type="number"
                      id="shipping-cost"
                      min="0"
                      step="0.01"
                      value={formData.shipping_cost || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_cost: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className={`mt-1 block w-full border ${
                        errors.shipping_cost ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Total shipping cost</p>
                    {errors.shipping_cost && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_cost}</p>
                    )}
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
                        value={formData.status || 'PREPARING'}
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
                      <p className="mt-1 text-xs text-gray-500">Current shipment status</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Shipping Address</h4>
                <div>
                  <label
                    htmlFor="shipping-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  {isLoadingAddress && (
                    <p className="mt-1 text-sm text-blue-600">Loading company address...</p>
                  )}
                  <textarea
                    id="shipping-address"
                    rows={3}
                    value={formData.shipping_address}
                    onChange={(e) =>
                      setFormData({ ...formData, shipping_address: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.shipping_address ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {mode === 'create' ? 'Auto-populated from company default address' : 'Delivery address'}
                  </p>
                  {errors.shipping_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.shipping_address}</p>
                  )}
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Additional Information</h4>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Additional notes..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Special instructions or notes</p>
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
                form="shipment-form"
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
                  'Create Shipment'
                ) : (
                  'Update Shipment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
