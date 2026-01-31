import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import ManufacturingFormModal from '../components/ManufacturingFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'


interface ManufacturingStep {
  id: number
  order_id: number
  parent_step_id?: number
  step_type?: string
  step_name?: string
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

interface TransferFormData {
  quantity: number
  weight: number
  next_step_type: string
  next_step_name: string
  received_by: string
  department?: string
}

interface ManufacturingFormData {
  order_id: number
  step_type: string
  step_name?: string  // Now optional - type should be sufficient
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

const statusColors: Record<string, string> = {
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
}

export default function Manufacturing() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState<ManufacturingStep | null>(null)
  const [transferStep, setTransferStep] = useState<ManufacturingStep | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [stepToDelete, setStepToDelete] = useState<ManufacturingStep | null>(null)
  const [detailStep, setDetailStep] = useState<ManufacturingStep | null>(null)

  const queryClient = useQueryClient()

  const { data: steps, isLoading, error } = useQuery({
    queryKey: ['manufacturing-steps'],
    queryFn: async () => {
      const response = await api.get('/manufacturing/steps')
      return response.data as ManufacturingStep[]
    }
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ManufacturingFormData) => {
      const response = await api.post('/manufacturing/steps', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturing-steps'] })
      setIsCreateModalOpen(false)
      toast.success('Manufacturing step created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create manufacturing step')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ManufacturingFormData }) => {
      const response = await api.put(`/manufacturing/steps/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturing-steps'] })
      setIsEditModalOpen(false)
      setSelectedStep(null)
      toast.success('Manufacturing step updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update manufacturing step')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/manufacturing/steps/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturing-steps'] })
      setIsDeleteModalOpen(false)
      setStepToDelete(null)
      toast.success('Manufacturing step deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete manufacturing step')
    },
  })

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TransferFormData }) => {
      const response = await api.post(`/manufacturing/steps/${id}/transfer`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturing-steps'] })
      setIsTransferModalOpen(false)
      setTransferStep(null)
      toast.success('Items transferred successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to transfer items')
    },
  })

  const handleCreate = (data: ManufacturingFormData | TransferFormData) => {
    createMutation.mutate(data as ManufacturingFormData)
  }

  const handleEdit = (step: ManufacturingStep) => {
    setSelectedStep(step)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: ManufacturingFormData | TransferFormData) => {
    if (selectedStep) {
      updateMutation.mutate({ id: selectedStep.id, data: data as ManufacturingFormData })
    }
  }

  const handleTransferClick = (step: ManufacturingStep) => {
    setTransferStep(step)
    setIsTransferModalOpen(true)
  }

  const handleTransfer = (data: ManufacturingFormData | TransferFormData) => {
    if (transferStep) {
      transferMutation.mutate({ id: transferStep.id, data: data as TransferFormData })
    }
  }

  const handleDeleteClick = (step: ManufacturingStep) => {
    setStepToDelete(step)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (stepToDelete) {
      deleteMutation.mutate(stepToDelete.id)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading manufacturing steps...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-red-800">Error loading manufacturing steps. Please try again.</p>
        </div>
      </div>
    )
  }

  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString()
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Manufacturing Steps</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        > 
          Create Step
        </Button>
      </div>

      {!steps || steps.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500">No manufacturing steps yet. Create one to get started.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {steps.map((step) => (
                  <tr key={step.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Order #{step.order_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{step.step_name || '-'}</div>
                      {step.step_type && (
                        <div className="text-xs text-gray-500">{step.step_type.replace(/_/g, ' ')}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${statusColors[step.status] || 'bg-gray-100 text-gray-800'}`}>
                        {step.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {step.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {step.worker_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {step.created_at ? new Date(step.created_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button
                        onClick={() => setDetailStep(step)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {step.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleTransferClick(step)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Transfer Items"
                        >
                          <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(step)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(step)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Modal */}
          {detailStep && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {detailStep.step_name} - Order #{detailStep.order_id}
                  </h3>
                  <button
                    onClick={() => setDetailStep(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[detailStep.status]}`}>
                      {detailStep.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <p className="mt-1 text-sm text-gray-900">{detailStep.department || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Worker Name</label>
                      <p className="mt-1 text-sm text-gray-900">{detailStep.worker_name || '-'}</p>
                    </div>
                  </div>

                  {detailStep.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{detailStep.description}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Started:</span>
                        <span className="text-gray-900">{formatDateTime(detailStep.started_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Received:</span>
                        <span className="text-gray-900">{formatDateTime(detailStep.received_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Completed:</span>
                        <span className="text-gray-900">{formatDateTime(detailStep.completed_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Tracking */}
                  {(detailStep.quantity_received || detailStep.quantity_returned) && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quantity Received:</span>
                          <span className="text-gray-900">{detailStep.quantity_received || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quantity Returned:</span>
                          <span className="text-gray-900">{detailStep.quantity_returned || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Weight Tracking */}
                  {(detailStep.weight_received || detailStep.weight_returned) && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Weight Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Weight Received:</span>
                          <span className="text-gray-900">{detailStep.weight_received ? `${detailStep.weight_received}g` : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Weight Returned:</span>
                          <span className="text-gray-900">{detailStep.weight_returned ? `${detailStep.weight_returned}g` : '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transfer Tracking */}
                  {(detailStep.transferred_by || detailStep.received_by) && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Transfer Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Transferred By:</span>
                          <span className="text-gray-900">{detailStep.transferred_by || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Received By:</span>
                          <span className="text-gray-900">{detailStep.received_by || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailStep.notes && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="mt-1 text-sm text-gray-900">{detailStep.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setDetailStep(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <ManufacturingFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Modal */}
      <ManufacturingFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStep(null)
        }}
        mode="edit"
        step={selectedStep}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />

      {/* Transfer Modal */}
      <ManufacturingFormModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false)
          setTransferStep(null)
        }}
        mode="transfer"
        step={transferStep}
        onSubmit={handleTransfer}
        isSubmitting={transferMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setStepToDelete(null)
        }}
        itemName={stepToDelete?.step_name || ''}
        itemType="Manufacturing Step"
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
      </div>
    </Container>
  )
}
