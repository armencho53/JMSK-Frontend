import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import CustomerFormModal from '../components/CustomerFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import BalanceCard from '../components/BalanceCard'
import { Customer, OrderSummary, ShipmentSummary, BalanceBreakdown } from '../types/customer'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

// Define table columns for orders
const getOrderColumns = (): TableColumn<OrderSummary>[] => [
  {
    key: 'order_number',
    title: 'Order #',
    dataIndex: 'order_number',
    render: (value: string) => (
      <span className="font-medium text-indigo-600">{value}</span>
    )
  },
  {
    key: 'product_description',
    title: 'Product',
    dataIndex: 'product_description',
    responsive: 'tablet'
  },
  {
    key: 'quantity',
    title: 'Qty',
    dataIndex: 'quantity',
    align: 'center' as const,
    width: 80
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    align: 'right' as const,
    render: (value: number) => `$${value?.toFixed(2) || '0.00'}`,
    responsive: 'desktop'
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

// Define table columns for shipments
const getShipmentColumns = (): TableColumn<ShipmentSummary>[] => [
  {
    key: 'tracking_number',
    title: 'Tracking #',
    dataIndex: 'tracking_number',
    render: (value: string) => (
      <span className="font-medium text-slate-900">{value || '-'}</span>
    )
  },
  {
    key: 'carrier',
    title: 'Carrier',
    dataIndex: 'carrier',
    render: (value: string) => value || '-',
    responsive: 'tablet'
  },
  {
    key: 'shipping_address',
    title: 'Address',
    dataIndex: 'shipping_address',
    render: (value: string) => value || '-',
    responsive: 'desktop'
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (value: string) => <StatusBadge status={value} size="sm" />
  },
  {
    key: 'shipped_at',
    title: 'Shipped',
    dataIndex: 'shipped_at',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
    responsive: 'tablet'
  },
  {
    key: 'delivered_at',
    title: 'Delivered',
    dataIndex: 'delivered_at',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
    responsive: 'desktop'
  }
]

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'shipments'>('orders')
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState('')

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const response = await api.get(`/customers/${customerId}`)
      return response.data as Customer
    },
    enabled: !!customerId
  })

  const { data: balance } = useQuery({
    queryKey: ['customer-balance', customerId],
    queryFn: async () => {
      const response = await api.get(`/customers/${customerId}/balance`)
      return response.data as BalanceBreakdown
    },
    enabled: !!customerId
  })

  const { data: orders } = useQuery({
    queryKey: ['customer-orders', customerId, orderStatusFilter],
    queryFn: async () => {
      const params = orderStatusFilter ? `?status=${orderStatusFilter}` : ''
      const response = await api.get(`/customers/${customerId}/orders${params}`)
      return response.data as OrderSummary[]
    },
    enabled: !!customerId && activeTab === 'orders'
  })

  const { data: shipments } = useQuery({
    queryKey: ['customer-shipments', customerId, shipmentStatusFilter],
    queryFn: async () => {
      const params = shipmentStatusFilter ? `?status=${shipmentStatusFilter}` : ''
      const response = await api.get(`/customers/${customerId}/shipments${params}`)
      return response.data as ShipmentSummary[]
    },
    enabled: !!customerId && activeTab === 'shipments'
  })

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/customers/${customerId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      showSuccessToast('Contact updated successfully')
      setIsEditModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update contact'
      showErrorToast(message)
    }
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/customers/${customerId}`)
      return response.data
    },
    onSuccess: () => {
      showSuccessToast('Contact deleted successfully')
      navigate('/customers')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete contact'
      showErrorToast(message)
      setIsDeleteModalOpen(false)
    }
  })

  // Define table columns
  const orderColumns = getOrderColumns();
  const shipmentColumns = getShipmentColumns();

  if (customerLoading) {
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

  if (!customer) {
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
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          className="mb-4"
        >
          ← Back to Contacts
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{customer.name}</h1>
            <p className="text-slate-600">{customer.email}</p>
            {customer.phone && <p className="text-slate-600">{customer.phone}</p>}
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

      {balance && <BalanceCard balance={balance} />}

      <div className="mt-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
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
              onClick={() => setActiveTab('shipments')}
              className={`${
                activeTab === 'shipments'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Shipments
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'orders' && (
            <div>
              <div className="mb-4">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
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
                  data={orders || []}
                  hoverable
                  responsive
                  emptyText="No orders found."
                  onRow={(record) => ({
                    onClick: () => navigate(`/orders/${record.id}`),
                    className: 'cursor-pointer'
                  })}
                />
              </Card>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div>
              <div className="mb-4">
                <select
                  value={shipmentStatusFilter}
                  onChange={(e) => setShipmentStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                >
                  <option value="">All Statuses</option>
                  <option value="preparing">Preparing</option>
                  <option value="shipped">Shipped</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <Card variant="elevated">
                <Table
                  columns={shipmentColumns}
                  data={shipments || []}
                  hoverable
                  responsive
                  emptyText="No shipments found."
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        customer={customer}
        onSubmit={(data) => updateCustomerMutation.mutate(data)}
        isSubmitting={updateCustomerMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={customer.name}
        itemType="Contact"
        onConfirm={() => deleteCustomerMutation.mutate()}
        isDeleting={deleteCustomerMutation.isPending}
      />
    </Container>
  )
}
