import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchContacts } from '../lib/api'
import type { Contact } from '../types/contact'

interface ContactSelectorProps {
  value?: number
  onChange: (contactId: number | undefined, contact: Contact | undefined) => void
  error?: string
}

export default function ContactSelector({ value, onChange, error }: ContactSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts', searchTerm],
    queryFn: () => fetchContacts({ search: searchTerm, limit: 50 }),
  })

  const selectedContact = contacts.find(c => c.id === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.contact-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="contact-selector relative">
      <label htmlFor="contact-selector" className="block text-sm font-medium text-gray-700">
        Contact <span className="text-red-500">*</span>
      </label>
      
      <div className="mt-1 relative">
        <button
          type="button"
          id="contact-selector"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          {selectedContact ? (
            <span className="block truncate">
              {selectedContact.name}
              {selectedContact.company && (
                <span className="text-gray-500 text-xs ml-2">
                  ({selectedContact.company.name})
                </span>
              )}
            </span>
          ) : (
            <span className="block truncate text-gray-400">Select a contact...</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No contacts found</div>
            ) : (
              <ul className="py-1">
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 ${
                      contact.id === value ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => {
                      onChange(contact.id, contact)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span className={`block truncate ${contact.id === value ? 'font-semibold' : 'font-normal'}`}>
                        {contact.name}
                      </span>
                      {contact.company && (
                        <span className="text-xs text-gray-500 truncate">
                          {contact.company.name}
                        </span>
                      )}
                      {contact.email && (
                        <span className="text-xs text-gray-400 truncate">
                          {contact.email}
                        </span>
                      )}
                    </div>
                    {contact.id === value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
