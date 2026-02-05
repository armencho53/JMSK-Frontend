import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Address } from '../types/address'
import { updateAddress, deleteAddress } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import AddressFormModal from './AddressFormModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'

/**
 * AddressList Component
 * 
 * Displays a list of company addresses with edit/delete actions.
 * Indicates which address is the default address for the company.
 * 
 * Requirements: 5.1, 5.4
 */

interface AddressListProps {
  addresses: Address[]
  companyId: number
}

export default function AddressList({ addresses, companyId }: AddressListProps) {
  const queryClient = useQueryClient()
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-addresses', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      showSuccessToast('Address updated successfully')
      setIsEditModalOpen(false)
      setEditingAddress(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update address'
      showErrorToast(message)
    }
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-addresses', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      showSuccessToast('Address deleted successfully')
      setIsDeleteModalOpen(false)
      setDeletingAddress(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete address'
      showErrorToast(message)
    }
  })

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsEditModalOpen(true)
  }

  const handleDelete = (address: Address) => {
    setDeletingAddress(address)
    setIsDeleteModalOpen(true)
  }

  const handleEditSubmit = (data: any) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data })
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingAddress) {
      deleteAddressMutation.mutate(deletingAddress.id)
    }
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Card variant="outlined" className="border-slate-200">
        <CardContent>
          <p className="text-slate-600 text-center py-4">
            No addresses found for this company.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {addresses.map((address) => (
          <Card 
            key={address.id} 
            variant={address.is_default ? 'elevated' : 'outlined'}
            className={address.is_default ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200'}
          >
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-slate-900">
                      {address.street_address}
                    </h4>
                    {/* Requirement 5.1: Indicate which address is default */}
                    {address.is_default && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                  <p className="text-sm text-slate-600">{address.country}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Added {new Date(address.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Requirement 5.4: Include edit/delete actions */}
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Address Modal */}
      <AddressFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingAddress(null)
        }}
        mode="edit"
        address={editingAddress}
        companyId={companyId}
        onSubmit={handleEditSubmit}
        isSubmitting={updateAddressMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingAddress(null)
        }}
        itemName={deletingAddress?.street_address || ''}
        itemType="Address"
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteAddressMutation.isPending}
      />
    </>
  )
}
