import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import CompanyFormModal from '../components/CompanyFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Company } from '../types/customer'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

// Define table columns for companies
const getCompanyColumns = (
  onEdit: (company: Company) => void,
  onDelete: (company: Company) => void
): TableColumn<Company>[] => [
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
    key: 'address',
    title: 'Address',
    dataIndex: 'address',
    render: (value: string) => value || '-',
    responsive: 'tablet'
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    render: (value: string) => value || '-',
    responsive: 'desktop'
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    render: (value: string) => value || '-',
    responsive: 'desktop'
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    width: 100,
    render: (_, record: Company) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="text-indigo-600 hover:text-slate-900"
          title="Edit company"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          className="text-red-600 hover:text-red-900"
          title="Delete company"
        >
          Delete
        </button>
      </div>
    )
  }
]

export default function Companies() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)

  const queryClient = useQueryClient()

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get('/companies/')
      return response.data as Company[]
    }
  })

  const createCompanyMutation = useMutation({
    mutationFn: async (data: {
      name: string
      address?: string
      phone?: string
      email?: string
    }) => {
      const response = await api.post('/companies/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      showSuccessToast('Company created successfully')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create company'
      showErrorToast(message)
    }
  })

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { 
      id: number
      data: {
        name?: string
        address?: string
        phone?: string
        email?: string
      }
    }) => {
      const response = await api.put(`/companies/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      showSuccessToast('Company updated successfully')
      setIsEditModalOpen(false)
      setCompanyToEdit(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update company'
      showErrorToast(message)
    }
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/companies/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      showSuccessToast('Company deleted successfully')
      setIsDeleteModalOpen(false)
      setCompanyToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete company'
      showErrorToast(message)
    }
  })

  const handleCreateCompany = (data: {
    name: string
    address?: string
    phone?: string
    email?: string
  }) => {
    createCompanyMutation.mutate(data)
  }

  const handleEditClick = (company: Company) => {
    setCompanyToEdit(company)
    setIsEditModalOpen(true)
  }

  const handleUpdateCompany = (data: {
    name?: string
    address?: string
    phone?: string
    email?: string
  }) => {
    if (companyToEdit) {
      updateCompanyMutation.mutate({
        id: companyToEdit.id,
        data
      })
    }
  }

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete.id)
    }
  }

  // Define table columns
  const columns = getCompanyColumns(handleEditClick, handleDeleteClick);

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading companies...</p>
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
            <p className="text-red-800">Error loading companies. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        >
          Create Company
        </Button>
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={companies || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No companies yet. Create your first company to get started."
        />
      </Card>

      <CompanyFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreateCompany}
        isSubmitting={createCompanyMutation.isPending}
      />

      <CompanyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setCompanyToEdit(null)
        }}
        mode="edit"
        company={companyToEdit}
        onSubmit={handleUpdateCompany}
        isSubmitting={updateCompanyMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setCompanyToDelete(null)
        }}
        itemName={companyToDelete?.name || ''}
        itemType="Company"
        onConfirm={handleConfirmDelete}
        isDeleting={deleteCompanyMutation.isPending}
      />
    </Container>
  )
}
