import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { fetchContactById, fetchContactOrders, updateContact, deleteContact } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import ContactFormModal from '../components/ContactFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { ContactUpdate } from '../types/contact'
import { Order } from '../types/order'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

// Define table columns for orders
const getOrderColumns = (): TableColumn<Order>[] => [
  {
    key: 'order_number',
    title: 'Order #',
    dataIndex: 'order_number',
    render: (value: string) => (
      <span className="font-medium text-indigo-600">{value || '-'}</span>
    )
  },
  {
    key: 'order_date',
    title: 'Order Date',
    dataIndex: 'order_date',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
    responsive: 'tablet'
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
    key: 'due_date',
    title: 'Due Date',
    dataIndex: 'due_date',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
    responsive: 'desktop'
  }
]

export default function ContactDetail() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const { data: contact, isLoading: contactLoading } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => fetchContactById(Number(contactId)),
    enabled: !!contactId
  })

  const { data: orders } = useQuery({
    queryKey: ['contact-orders', contactId],
    queryFn: () => fetchContactOrders(Number(contactId)),
    enabled: !!contactId
  })

  // Set document title (Requirement 7.1)
  useEffect(() => {
    if (contact) {
      document.title = `${contact.name} - Contact Details - JMSK`
    }
  }, [contact])

  const updateContactMutation = useMutation({
    mutationFn: (data: ContactUpdate) => updateContact(Number(contactId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] })
      showSuccessToast('Contact updated successfully')
      setIsEditModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update contact'
      showErrorToast(message)
    }
  })

  const deleteContactMutation = useMutation({
    mutationFn: () => deleteContact(Number(contactId)),
    onSuccess: () => {
      showSuccessToast('Contact deleted successfully')
      navigate('/contacts')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete contact'
      showErrorToast(message)
      setIsDeleteModalOpen(false)
    }
  })

  // Filter orders by status
  const filteredOrders = orders?.filter(order => {
    if (!statusFilter) return true
    return order.status === statusFilter
  })

  // Define table columns
  const orderColumns = getOrderColumns();

  if (contactLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading contact...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!contact) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Contact not found.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="mb-6">
        <nav className="flex mb-4 text-sm text-slate-600">
          <button
            onClick={() => navigate('/companies')}
            className="hover:text-slate-900"
          >
            Companies
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={() => contact.company_id && navigate(`/companies/${contact.company_id}`)}
            className="hover:text-slate-900"
          >
            {contact.company?.name || 'Company'}
          </button>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{contact.name}</span>
        </nav>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{contact.name}</h1>
            {contact.email && <p className="text-slate-600">{contact.email}</p>}
            {contact.phone && <p className="text-slate-600">{contact.phone}</p>}
            {contact.company && (
              <p className="text-slate-600 mt-2">
                Company: <span className="font-medium">{contact.company.name}</span>
              </p>
            )}
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

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Order History</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Card variant="elevated">
          <Table
            columns={orderColumns}
            data={filteredOrders || []}
            hoverable
            responsive
            emptyText="No orders found for this contact."
            onRow={(record) => ({
              onClick: () => navigate(`/orders/${record.id}`),
              className: 'cursor-pointer'
            })}
          />
        </Card>
      </div>

      <ContactFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        contact={contact}
        onSubmit={(data) => updateContactMutation.mutate(data)}
        isSubmitting={updateContactMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={contact.name}
        itemType="Contact"
        onConfirm={() => deleteContactMutation.mutate()}
        isDeleting={deleteContactMutation.isPending}
      />
    </Container>
  )
}
