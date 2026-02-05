import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { fetchCompanies, createCompany, updateCompany, deleteCompany } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import CompanyFormModal from '../components/CompanyFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { CompanyCreate, CompanyUpdate, CompanyWithContacts } from '../types/company'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

// Define table columns for companies
const getCompanyColumns = (
  onEdit: (company: CompanyWithContacts) => void,
  onDelete: (company: CompanyWithContacts) => void
): TableColumn<CompanyWithContacts>[] => [
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
      <span className="text-slate-600">{value || '-'}</span>
    ),
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
    key: 'contact_count',
    title: 'Contacts',
    align: 'center' as const,
    render: (_, record: CompanyWithContacts) => (
      <span className="text-slate-900">{record.contacts?.length || 0}</span>
    )
  },
  {
    key: 'total_balance',
    title: 'Balance',
    dataIndex: 'total_balance',
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
    render: (_, record: CompanyWithContacts) => (
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
  const [companyToEdit, setCompanyToEdit] = useState<CompanyWithContacts | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<CompanyWithContacts | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Set document title (Requirement 7.1)
  useEffect(() => {
    document.title = 'Companies - JMSK'
  }, [])

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies', searchQuery],
    queryFn: () => fetchCompanies() as Promise<CompanyWithContacts[]>
  })

  const createCompanyMutation = useMutation({
    mutationFn: (data: CompanyCreate) => createCompany(data),
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
    mutationFn: ({ id, data }: { id: number; data: CompanyUpdate }) => 
      updateCompany(id, data),
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
    mutationFn: (id: number) => deleteCompany(id),
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

  const handleCreateCompany = (data: CompanyCreate) => {
    createCompanyMutation.mutate(data)
  }

  const handleEditClick = (company: CompanyWithContacts) => {
    setCompanyToEdit(company)
    setIsEditModalOpen(true)
  }

  const handleUpdateCompany = (data: CompanyUpdate) => {
    if (companyToEdit) {
      updateCompanyMutation.mutate({
        id: companyToEdit.id,
        data
      })
    }
  }

  const handleDeleteClick = (company: CompanyWithContacts) => {
    setCompanyToDelete(company)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete.id)
    }
  }

  const handleRowClick = (companyId: number) => {
    navigate(`/companies/${companyId}`)
  }

  // Filter companies by search query
  const filteredCompanies = companies?.filter(company => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      company.name.toLowerCase().includes(query) ||
      company.email?.toLowerCase().includes(query)
    )
  })

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

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={filteredCompanies || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No companies found. Create your first company to get started."
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            className: 'cursor-pointer'
          })}
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
