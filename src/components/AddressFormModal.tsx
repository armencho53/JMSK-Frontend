import { useEffect, useState } from 'react'
import { Address } from '../types/address'

/**
 * AddressFormModal Component
 * 
 * Modal form for creating and editing company addresses.
 * Supports setting an address as the default for the company.
 * 
 * Requirements: 5.1, 5.3, 5.5
 */

interface AddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  address?: Address | null
  companyId?: number
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function AddressFormModal({
  isOpen,
  onClose,
  mode,
  address,
  companyId,
  onSubmit,
  isSubmitting,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    is_default: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && address) {
        setFormData({
          street_address: address.street_address,
          city: address.city,
          state: address.state,
          zip_code: address.zip_code,
          country: address.country,
          is_default: address.is_default,
        })
      } else {
        setFormData({
          street_address: '',
          city: '',
          state: '',
          zip_code: '',
          country: 'USA',
          is_default: false,
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, address])

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

    // Requirement 5.5: Validate address completeness
    if (!formData.street_address.trim()) {
      newErrors.street_address = 'Street address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.zip_code.trim()) {
      newErrors.zip_code = 'ZIP code is required'
    } else if (formData.zip_code.trim().length < 5) {
      newErrors.zip_code = 'ZIP code must be at least 5 characters'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const submitData: any = {
      street_address: formData.street_address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zip_code: formData.zip_code.trim(),
      country: formData.country.trim(),
      is_default: formData.is_default,
    }

    // Include company_id for create mode
    if (mode === 'create' && companyId) {
      submitData.company_id = companyId
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
                {mode === 'create' ? 'Add Address' : 'Edit Address'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Street Address */}
                <div>
                  <label
                    htmlFor="address-street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address-street"
                    value={formData.street_address}
                    onChange={(e) =>
                      setFormData({ ...formData, street_address: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.street_address ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="123 Main Street"
                  />
                  {errors.street_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.street_address}</p>
                  )}
                </div>

                {/* City and State Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="address-city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address-city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address-state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address-state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* ZIP Code and Country Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="address-zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address-zip"
                      value={formData.zip_code}
                      onChange={(e) =>
                        setFormData({ ...formData, zip_code: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.zip_code ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="10001"
                    />
                    {errors.zip_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address-country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address-country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        errors.country ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="USA"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>
                </div>

                {/* Default Address Checkbox - Requirement 5.1, 5.3 */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="address-default"
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) =>
                        setFormData({ ...formData, is_default: e.target.checked })
                      }
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="address-default" className="font-medium text-gray-700">
                      Set as default address
                    </label>
                    <p className="text-gray-500">
                      This address will be automatically used for shipments
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
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
                        {mode === 'create' ? 'Adding...' : 'Updating...'}
                      </>
                    ) : mode === 'create' ? (
                      'Add Address'
                    ) : (
                      'Update Address'
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
