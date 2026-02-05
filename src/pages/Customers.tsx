import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import CustomerFormModal from '../components/CustomerFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Customer } from '../types/customer'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

// Define table columns for contacts
const getContactColumns = (
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void
): TableColumn<Customer>[] => [
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
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
    render: (value: string) => (
      <span className="text-slate-600">{value}</span>
    )
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    render: (value: string) => value || '-',
    responsive: 'tablet'
  },
  {
    key: 'balance',
    title: 'Balance',
    dataIndex: 'balance',
    sortable: true,
    align: 'right' as const,
    render: (value: number) => (
      <span className={`font-medium ${value && value < 0 ? 'text-red-600' : 'text-slate-900'}`}>
        ${value?.toFixed(2) || '0.00'}
      </span>
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    width: 100,
    render: (_, record: Customer) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="text-indigo-600 hover:text-slate-900"
          title="Edit contact"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          className="text-red-600 hover:text-red-900"
          title="Delete contact"
        >
          Delete
        </button>
      </div>
    )
  }
]

export default function Customers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
      const response = await api.get(`/customers/${params}`)
      return response.data as Customer[]
    }
  })

  const createCustomerMutation = useMutation({
    mutationFn: async (data: {
      name: string
      email: string
      phone?: string
      company_id?: number
    }) => {
      const response = await api.post('/customers/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      showSuccessToast('Contact created successfully')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create contact'
      showErrorToast(message)
    }
  })

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, data }: { 
      id: number
      data: {
        name?: string
        email?: string
        phone?: string
        company_id?: number
      }
    }) => {
      const response = await api.put(`/customers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      showSuccessToast('Contact updated successfully')
      setIsEditModalOpen(false)
      setCustomerToEdit(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update contact'
      showErrorToast(message)
    }
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/customers/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      showSuccessToast('Contact deleted successfully')
      setIsDeleteModalOpen(false)
      setCustomerToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete contact'
      showErrorToast(message)
    }
  })

  const handleCreateCustomer = (data: {
    name: string
    email: string
    phone?: string
    company_id?: number
  }) => {
    createCustomerMutation.mutate(data)
  }

  const handleEditClick = (customer: Customer) => {
    setCustomerToEdit(customer)
    setIsEditModalOpen(true)
  }

  const handleUpdateCustomer = (data: {
    name?: string
    email?: string
    phone?: string
    company_id?: number
  }) => {
    if (customerToEdit) {
      updateCustomerMutation.mutate({
        id: customerToEdit.id,
        data
      })
    }
  }

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id)
    }
  }

  const handleRowClick = (customerId: number) => {
    navigate(`/customers/${customerId}`)
  }

  // Define table columns
  const columns = getContactColumns(handleEditClick, handleDeleteClick);

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading contacts...</p>
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
            <p className="text-red-800">Error loading contacts. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        > 
          Create Contact
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={customers || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No contacts found. Create your first contact to get started."
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            className: 'cursor-pointer'
          })}
        />
      </Card>

      <CustomerFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreateCustomer}
        isSubmitting={createCustomerMutation.isPending}
      />

      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setCustomerToEdit(null)
        }}
        mode="edit"
        customer={customerToEdit}
        onSubmit={handleUpdateCustomer}
        isSubmitting={updateCustomerMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setCustomerToDelete(null)
        }}
        itemName={customerToDelete?.name || ''}
        itemType="Contact"
        onConfirm={handleConfirmDelete}
        isDeleting={deleteCustomerMutation.isPending}
      />
    </Container>
  )
}
