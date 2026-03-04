import { useEffect, useState } from 'react'
import ContactSelector from './ContactSelector'
import OrderLineItemRow from './OrderLineItemRow'
import type { Order, OrderLineItem, MetalDepositCreate } from '../types/order'
import type { Contact } from '../types/contact'
import { useMetals } from '../hooks/useMetals'
import { ORDER_STATUS_OPTIONS } from '../lib/constants'
import { getMetalPrice } from '../lib/api'
import type { MetalPriceResponse } from '../types/metal'

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
  status?: string
  due_date?: string
  line_items: OrderLineItem[]
  metal_deposit?: MetalDepositCreate
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
    line_items: [
      {
        product_description: '',
        quantity: 1,
      },
    ],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()
  const [enableMetalDeposit, setEnableMetalDeposit] = useState(false)
  const [metalDeposit, setMetalDeposit] = useState<MetalDepositCreate>({
    metal_id: 0,
    quantity_grams: 0,
    notes: '',
  })
  const [metalPrice, setMetalPrice] = useState<MetalPriceResponse | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)
  const { metals, isLoading: metalTypeLoading, isError: metalTypeError, refetch: refetchMetalTypes } = useMetals()

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && order) {
        // Load existing order with line items
        setFormData({
          contact_id: order.contact_id,
          status: order.status,
          due_date: order.due_date ? order.due_date.slice(0, 16) : '',
          line_items: order.line_items && order.line_items.length > 0
            ? order.line_items
            : [
                {
                  product_description: order.product_description || '',
                  specifications: order.specifications,
                  quantity: order.quantity || 1,
                  price: order.price,
                  metal_id: order.metal_id,
                  target_weight_per_piece: order.target_weight_per_piece,
                  initial_total_weight: order.initial_total_weight,
                  labor_cost: order.labor_cost,
                },
              ],
        })
        if (order.contact) {
          setSelectedContact(order.contact as Contact)
        }
      } else {
        // Create mode - start with one empty line item
        setFormData({
          line_items: [
            {
              product_description: '',
              quantity: 1,
            },
          ],
        })
        setSelectedContact(undefined)
      }
      setErrors({})
      setEnableMetalDeposit(false)
      setMetalDeposit({
        metal_id: 0,
        quantity_grams: 0,
        notes: '',
      })
      setMetalPrice(null)
      setPriceError(null)
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

  // Fetch metal price when deposit is enabled and metal is selected
  useEffect(() => {
    if (enableMetalDeposit && metalDeposit.metal_id) {
      const selectedMetal = metals.find((m) => m.id === metalDeposit.metal_id)
      if (selectedMetal) {
        fetchMetalPrice(selectedMetal.code)
      }
    }
  }, [enableMetalDeposit, metalDeposit.metal_id, metals])

  const fetchMetalPrice = async (metalCode: string) => {
    setPriceLoading(true)
    setPriceError(null)
    try {
      const price = await getMetalPrice(metalCode)
      setMetalPrice(price)
    } catch (error) {
      setPriceError('Unable to fetch current metal prices. Please enter cost manually.')
      setMetalPrice(null)
    } finally {
      setPriceLoading(false)
    }
  }

  const addLineItem = () => {
    setFormData({
      ...formData,
      line_items: [
        ...formData.line_items,
        {
          product_description: '',
          quantity: 1,
        },
      ],
    })
  }

  const removeLineItem = (index: number) => {
    if (formData.line_items.length > 1) {
      const newLineItems = formData.line_items.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        line_items: newLineItems,
      })
    }
  }

  const updateLineItem = (index: number, field: keyof OrderLineItem, value: any) => {
    const newLineItems = [...formData.line_items]
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      line_items: newLineItems,
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contact_id) {
      newErrors.contact_id = 'Contact is required'
    }

    // Validate line items
    if (formData.line_items.length === 0) {
      newErrors.line_items = 'At least one line item is required'
    }

    formData.line_items.forEach((item, index) => {
      if (!item.product_description.trim()) {
        newErrors[`line_items.${index}.product_description`] = 'Product description is required'
      }
      if (!item.quantity || item.quantity < 1) {
        newErrors[`line_items.${index}.quantity`] = 'Quantity must be at least 1'
      }
    })

    // Validate metal deposit if enabled
    if (enableMetalDeposit) {
      if (!metalDeposit.metal_id) {
        newErrors.metal_deposit_metal = 'Metal type is required for deposit'
      }
      if (!metalDeposit.quantity_grams || metalDeposit.quantity_grams <= 0) {
        newErrors.metal_deposit_quantity = 'Quantity must be greater than 0'
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

    const submitData: OrderFormData = {
      ...formData,
      metal_deposit: enableMetalDeposit ? metalDeposit : undefined,
    }

    onSubmit(submitData)
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
            <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
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

                {/* Order Details Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200">Order Details</h4>
                  <div className="grid grid-cols-2 gap-4">
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

                {/* Line Items Section */}
                <div>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Line Items</h4>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      + Add Line Item
                    </button>
                  </div>
                  {errors.line_items && (
                    <p className="mb-3 text-sm text-red-600">{errors.line_items}</p>
                  )}
                  <div className="space-y-4">
                    {formData.line_items.map((lineItem, index) => (
                      <OrderLineItemRow
                        key={index}
                        lineItem={lineItem}
                        index={index}
                        metals={metals}
                        onChange={updateLineItem}
                        onRemove={removeLineItem}
                        canRemove={formData.line_items.length > 1}
                        errors={errors}
                      />
                    ))}
                  </div>
                </div>

                {/* Metal Deposit Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Metal Deposit (Optional)</h4>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableMetalDeposit}
                        onChange={(e) => setEnableMetalDeposit(e.target.checked)}
                        disabled={!selectedContact}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable deposit</span>
                    </label>
                  </div>

                  {!selectedContact && (
                    <p className="text-sm text-gray-500 italic">
                      Select a contact first to enable metal deposit
                    </p>
                  )}

                  {enableMetalDeposit && selectedContact && (
                    <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {/* Metal Type */}
                      <div>
                        <label
                          htmlFor="deposit-metal"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Metal Type <span className="text-red-500">*</span>
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
                            id="deposit-metal"
                            value={metalDeposit.metal_id || ''}
                            onChange={(e) =>
                              setMetalDeposit({
                                ...metalDeposit,
                                metal_id: e.target.value ? Number(e.target.value) : 0,
                              })
                            }
                            disabled={metalTypeLoading}
                            className={`mt-1 block w-full border ${
                              errors.metal_deposit_metal ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50`}
                          >
                            <option value="">
                              {metalTypeLoading ? 'Loading...' : 'Select metal type'}
                            </option>
                            {metals.filter((m) => m.is_active).map((metal) => (
                              <option key={metal.id} value={metal.id}>
                                {metal.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.metal_deposit_metal && (
                          <p className="mt-1 text-sm text-red-600">{errors.metal_deposit_metal}</p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div>
                        <label
                          htmlFor="deposit-quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity (grams) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="deposit-quantity"
                          min="0"
                          step="0.01"
                          value={metalDeposit.quantity_grams || ''}
                          onChange={(e) =>
                            setMetalDeposit({
                              ...metalDeposit,
                              quantity_grams: e.target.value ? parseFloat(e.target.value) : 0,
                            })
                          }
                          className={`mt-1 block w-full border ${
                            errors.metal_deposit_quantity ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="0.00"
                        />
                        {errors.metal_deposit_quantity && (
                          <p className="mt-1 text-sm text-red-600">{errors.metal_deposit_quantity}</p>
                        )}
                      </div>

                      {/* Metal Price Suggestion */}
                      {priceLoading && (
                        <div className="text-sm text-gray-600">
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Fetching current metal price...
                        </div>
                      )}
                      {priceError && (
                        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                          ℹ️ {priceError}
                        </div>
                      )}
                      {metalPrice && !priceLoading && (
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                          <div className="font-medium">Current Market Price</div>
                          <div className="mt-1">
                            {metalPrice.price_per_gram.toFixed(2)} {metalPrice.currency}/gram
                            {metalPrice.cached && (
                              <span className="ml-2 text-xs text-gray-600">
                                (cached, updated {new Date(metalPrice.fetched_at).toLocaleString()})
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <label
                          htmlFor="deposit-notes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Notes
                        </label>
                        <textarea
                          id="deposit-notes"
                          rows={2}
                          value={metalDeposit.notes || ''}
                          onChange={(e) =>
                            setMetalDeposit({
                              ...metalDeposit,
                              notes: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Optional notes about this deposit..."
                        />
                      </div>
                    </div>
                  )}
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
