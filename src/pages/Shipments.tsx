import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import ShipmentFormModal from '../components/ShipmentFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

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

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  returned: 'bg-red-100 text-red-800',
}

export default function Shipments() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const queryClient = useQueryClient()

  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await api.get('/shipments/')
      return response.data as Shipment[]
    }
  })

  const createShipmentMutation = useMutation({
    mutationFn: async (shipmentData: any) => {
      const response = await api.post('/shipments/', shipmentData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      showSuccessToast('Shipment created successfully')
      setIsFormModalOpen(false)
      setIsSubmitting(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to create shipment'
      showErrorToast(message)
      setIsSubmitting(false)
    }
  })

  const updateShipmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/shipments/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      showSuccessToast('Shipment updated successfully')
      setIsFormModalOpen(false)
      setIsSubmitting(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to update shipment'
      showErrorToast(message)
      setIsSubmitting(false)
    }
  })

  const deleteShipmentMutation = useMutation({
    mutationFn: async (shipmentId: number) => {
      await api.delete(`/shipments/${shipmentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      showSuccessToast('Shipment deleted successfully')
      setIsDeleteModalOpen(false)
      setIsDeleting(false)
      setSelectedShipment(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to delete shipment'
      showErrorToast(message)
      setIsDeleting(false)
    }
  })

  const handleCreateShipment = (data: any) => {
    setIsSubmitting(true)
    createShipmentMutation.mutate(data)
  }



  const handleEditClick = (shipment: Shipment) => {
    setFormMode('edit')
    setSelectedShipment(shipment)
    setIsFormModalOpen(true)
  }

  const handleUpdateShipment = (data: any) => {
    if (selectedShipment) {
      setIsSubmitting(true)
      updateShipmentMutation.mutate({ id: selectedShipment.id, data })
    }
  }

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedShipment) {
      setIsDeleting(true)
      deleteShipmentMutation.mutate(selectedShipment.id)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading shipments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-red-800">Error loading shipments. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Shipments</h1>
        <Button 
          onClick={() => {
            setFormMode('create')
            setSelectedShipment(null)
            setIsFormModalOpen(true)
          }}
          variant="primary"
        > 
          Create Shipment
        </Button>
      </div>

      {!shipments || shipments.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500">No shipments yet. Create your first shipment to get started.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <li key={shipment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {shipment.tracking_number || 'No tracking number'}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[shipment.status] || 'bg-gray-100 text-gray-800'}`}>
                          {shipment.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">{shipment.carrier || 'No carrier'}</span>
                          <span className="mx-2">•</span>
                          Order #{shipment.order_id}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          ${shipment.shipping_cost?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    {shipment.shipping_address && (
                      <p className="mt-1 text-sm text-gray-500">
                        {shipment.shipping_address}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(shipment)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit shipment"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(shipment)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete shipment"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ShipmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        shipment={selectedShipment}
        onSubmit={formMode === 'create' ? handleCreateShipment : handleUpdateShipment}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedShipment?.tracking_number || ''}
        itemType="shipment"
        title="Delete Shipment"
        message={`Are you sure you want to delete shipment ${selectedShipment?.tracking_number}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
      </div>
    </Container>
  )
}
