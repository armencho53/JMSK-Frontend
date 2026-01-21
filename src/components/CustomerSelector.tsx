import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Customer } from '../types/customer'

interface CustomerSelectorProps {
  value?: number
  onChange: (customerId: number | undefined, customer?: Customer) => void
  error?: string
}

export default function CustomerSelector({ value, onChange, error }: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { data: customers } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
      const response = await api.get(`/customers/${params}`)
      return response.data as Customer[]
    }
  })

  const selectedCustomer = customers?.find(c => c.id === value)

  const handleSelect = (customer: Customer) => {
    onChange(customer.id, customer)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    onChange(undefined)
    setSearchQuery('')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Customer
      </label>
      
      {selectedCustomer ? (
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
            <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search customers by name or email..."
            className={`w-full border ${
              error ? 'border-red-300' : 'border-gray-300'
            } rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          
          {isOpen && customers && customers.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto border border-gray-200">
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => handleSelect(customer)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
