import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import SupplyFormModal from '../components/SupplyFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

interface Supply {
  id: number
  name: string
  type: string
  quantity: number
  unit: string
  cost_per_unit: number
  supplier: string
  notes: string
}

// Define table columns for supplies
const getSupplyColumns = (
  onEdit: (supply: Supply) => void,
  onDelete: (supply: Supply) => void
): TableColumn<Supply>[] => [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-slate-900">{value}</span>
    )
  },
  {
    key: 'type',
    title: 'Type',
    dataIndex: 'type',
    sortable: true,
    render: (value: string) => <StatusBadge status={value} size="sm" variant="outline" />
  },
  {
    key: 'quantity',
    title: 'Quantity',
    sortable: true,
    render: (_, record: Supply) => (
      <span className={`${record.quantity < 10 ? 'text-red-600 font-medium' : 'text-slate-900'}`}>
        {record.quantity} {record.unit}
      </span>
    )
  },
  {
    key: 'cost_per_unit',
    title: 'Cost/Unit',
    dataIndex: 'cost_per_unit',
    sortable: true,
    align: 'right' as const,
    render: (value: number) => `$${value?.toFixed(2) || '0.00'}`,
    responsive: 'tablet'
  },
  {
    key: 'supplier',
    title: 'Supplier',
    dataIndex: 'supplier',
    sortable: true,
    render: (value: string) => value || '-',
    responsive: 'desktop'
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    width: 100,
    render: (_, record: Supply) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="text-indigo-600 hover:text-slate-900"
          title="Edit supply"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          className="text-red-600 hover:text-red-900"
          title="Delete supply"
        >
          Delete
        </button>
      </div>
    )
  }
]

export default function Supplies() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [supplyToEdit, setSupplyToEdit] = useState<Supply | null>(null)
  const [supplyToDelete, setSupplyToDelete] = useState<Supply | null>(null)

  const queryClient = useQueryClient()

  const { data: supplies, isLoading, error } = useQuery({
    queryKey: ['supplies'],
    queryFn: async () => {
      const response = await api.get('/supplies/')
      return response.data as Supply[]
    }
  })

  // Create supply mutation
  const createSupplyMutation = useMutation({
    mutationFn: async (data: {
      name: string
      type: string
      quantity: number
      unit: string
      cost_per_unit: number
      supplier: string
      notes: string
    }) => {
      const response = await api.post('/supplies/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] })
      showSuccessToast('Supply created successfully')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create supply'
      showErrorToast(message)
    }
  })

  const handleCreateSupply = (data: {
    name: string
    type: string
    quantity: number
    unit: string
    cost_per_unit: number
    supplier: string
    notes: string
  }) => {
    createSupplyMutation.mutate(data)
  }

  // Update supply mutation
  const updateSupplyMutation = useMutation({
    mutationFn: async ({ id, data }: { 
      id: number
      data: {
        name: string
        type: string
        quantity: number
        unit: string
        cost_per_unit: number
        supplier: string
        notes: string
      }
    }) => {
      const response = await api.put(`/supplies/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] })
      showSuccessToast('Supply updated successfully')
      setIsEditModalOpen(false)
      setSupplyToEdit(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update supply'
      showErrorToast(message)
    }
  })

  const handleEditClick = (supply: Supply) => {
    setSupplyToEdit(supply)
    setIsEditModalOpen(true)
  }

  const handleUpdateSupply = (data: {
    name: string
    type: string
    quantity: number
    unit: string
    cost_per_unit: number
    supplier: string
    notes: string
  }) => {
    if (supplyToEdit) {
      updateSupplyMutation.mutate({
        id: supplyToEdit.id,
        data
      })
    }
  }

  // Delete supply mutation
  const deleteSupplyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/supplies/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] })
      showSuccessToast('Supply deleted successfully')
      setIsDeleteModalOpen(false)
      setSupplyToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete supply'
      showErrorToast(message)
    }
  })

  const handleDeleteClick = (supply: Supply) => {
    setSupplyToDelete(supply)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (supplyToDelete) {
      deleteSupplyMutation.mutate(supplyToDelete.id)
    }
  }

  // Define table columns
  const columns = getSupplyColumns(handleEditClick, handleDeleteClick);

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading supplies...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Error loading supplies. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Supplies</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        >
          Add Supply
        </Button>
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={supplies || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No supplies yet. Add your first supply to get started."
        />
      </Card>

      {/* Modals */}
      <SupplyFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreateSupply}
        isSubmitting={createSupplyMutation.isPending}
      />

      <SupplyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSupplyToEdit(null)
        }}
        mode="edit"
        supply={supplyToEdit}
        onSubmit={handleUpdateSupply}
        isSubmitting={updateSupplyMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSupplyToDelete(null)
        }}
        itemName={supplyToDelete?.name || ''}
        itemType="Supply"
        onConfirm={handleConfirmDelete}
        isDeleting={deleteSupplyMutation.isPending}
      />
    </Container>
  )
}
