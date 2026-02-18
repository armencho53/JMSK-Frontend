import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { 
  fetchCompanyById, 
  fetchCompanyContacts, 
  fetchCompanyOrders, 
  fetchCompanyBalance,
  fetchCompanyAddresses,
  createAddress,
  updateCompany, 
  deleteCompany 
} from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import CompanyFormModal from '../components/CompanyFormModal'
import AddressFormModal from '../components/AddressFormModal'
import AddressList from '../components/AddressList'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import CompanyMetalBalances from '../components/CompanyMetalBalances'
import { CompanyUpdate } from '../types/company'
import { Contact } from '../types/contact'
import { Order } from '../types/order'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

// Define table columns for contacts
const getContactColumns = (): TableColumn<Contact>[] => [
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
    render: (value: string) => value || '-',
    responsive: 'tablet'
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    render: (value: string) => value || '-',
    responsive: 'desktop'
  }
]

// Define table columns for orders with drill-down
const getOrderColumns = (navigate: (path: string) => void): TableColumn<Order>[] => [
  {
    key: 'order_number',
    title: 'Order #',
    dataIndex: 'order_number',
    render: (value: string) => (
      <span className="font-medium text-indigo-600">{value || '-'}</span>
    )
  },
  {
    key: 'contact',
    title: 'Contact',
    dataIndex: 'contact',
    render: (value: any) => (
      <span className="text-slate-900">{value?.name || '-'}</span>
    ),
    responsive: 'tablet'
  },
  {
    key: 'product_description',
    title: 'Product',
    dataIndex: 'product_description',
    render: (value: string) => (
      <span className="text-slate-600">{value || '-'}</span>
    ),
    responsive: 'desktop'
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    align: 'right' as const,
    render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (value: string) => <StatusBadge status={value} size="sm" />
  },
  {
    key: 'actions',
    title: '',
    align: 'right' as const,
    width: 80,
    render: (_, record: Order) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/orders/${record.id}`);
        }}
        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
      >
        View →
      </button>
    )
  }
]

export default function CompanyDetail() {
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'orders' | 'addresses' | 'metal-balances'>('contacts')

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => fetchCompanyById(Number(companyId)),
    enabled: !!companyId
  })

  const { data: contacts } = useQuery({
    queryKey: ['company-contacts', companyId],
    queryFn: () => fetchCompanyContacts(Number(companyId)),
    enabled: !!companyId && activeTab === 'contacts'
  })

  const { data: orders } = useQuery({
    queryKey: ['company-orders', companyId],
    queryFn: () => fetchCompanyOrders(Number(companyId)),
    enabled: !!companyId && activeTab === 'orders'
  })

  const { data: addresses } = useQuery({
    queryKey: ['company-addresses', companyId],
    queryFn: () => fetchCompanyAddresses(Number(companyId)),
    enabled: !!companyId && activeTab === 'addresses'
  })

  const { data: balance } = useQuery({
    queryKey: ['company-balance', companyId],
    queryFn: () => fetchCompanyBalance(Number(companyId)),
    enabled: !!companyId
  })

  useEffect(() => {
    if (company) {
      document.title = `${company.name} - Company Details - JMSK`
    }
  }, [company])

  const updateCompanyMutation = useMutation({
    mutationFn: (data: CompanyUpdate) => updateCompany(Number(companyId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      showSuccessToast('Company updated successfully')
      setIsEditModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update company'
      showErrorToast(message)
    }
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: () => deleteCompany(Number(companyId)),
    onSuccess: () => {
      showSuccessToast('Company deleted successfully')
      navigate('/companies')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete company'
      showErrorToast(message)
      setIsDeleteModalOpen(false)
    }
  })

  const createAddressMutation = useMutation({
    mutationFn: (data: any) => createAddress(Number(companyId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-addresses', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      showSuccessToast('Address added successfully')
      setIsAddAddressModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to add address'
      showErrorToast(message)
    }
  })

  const contactColumns = getContactColumns();
  const orderColumns = getOrderColumns(navigate);

  if (companyLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading company...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!company) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Company not found.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/companies')}
          className="mb-4"
        >
          ← Back to Companies
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{company.name}</h1>
            {company.email && <p className="text-slate-600">{company.email}</p>}
            {company.phone && <p className="text-slate-600">{company.phone}</p>}
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {balance !== undefined && (
        <Card variant="elevated" className="mb-6">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Total Balance</p>
                <p className={`text-2xl font-semibold ${balance.total_balance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  ${balance.total_balance.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Contacts</p>
                <p className="text-2xl font-semibold text-slate-900">{contacts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${
                activeTab === 'contacts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`${
                activeTab === 'addresses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('metal-balances')}
              className={`${
                activeTab === 'metal-balances'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Metal Balances
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'contacts' && (
            <Card variant="elevated">
              <Table
                columns={contactColumns}
                data={contacts || []}
                hoverable
                responsive
                emptyText="No contacts found for this company."
              />
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card variant="elevated">
              <Table
                columns={orderColumns}
                data={orders || []}
                hoverable
                responsive
                emptyText="No orders found for this company."
                onRow={(record) => ({
                  onClick: () => navigate(`/orders/${record.id}`),
                  className: 'cursor-pointer'
                })}
              />
            </Card>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div className="mb-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setIsAddAddressModalOpen(true)}
                >
                  Add Address
                </Button>
              </div>
              <AddressList 
                addresses={addresses || []} 
                companyId={Number(companyId)} 
              />
            </div>
          )}

          {activeTab === 'metal-balances' && (
            <CompanyMetalBalances companyId={Number(companyId)} />
          )}
        </div>
      </div>

      <CompanyFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        company={company}
        onSubmit={(data) => updateCompanyMutation.mutate(data)}
        isSubmitting={updateCompanyMutation.isPending}
      />

      <AddressFormModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        mode="create"
        companyId={Number(companyId)}
        onSubmit={(data) => createAddressMutation.mutate(data)}
        isSubmitting={createAddressMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={company.name}
        itemType="Company"
        onConfirm={() => deleteCompanyMutation.mutate()}
        isDeleting={deleteCompanyMutation.isPending}
      />
    </Container>
  )
}
