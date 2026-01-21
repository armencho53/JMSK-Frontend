import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import OrderFormModal from '../components/OrderFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import OrderTimeline from '../components/OrderTimeline'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import Modal from '../components/ui/Modal'

interface Order {
  id: number
  order_number: string
  customer_id?: number
  customer_name: string
  customer_email?: string
  customer_phone?: string
  product_description: string
  specifications?: string
  quantity: number
  price?: number
  status: string
  due_date?: string
  created_at: string
  updated_at: string
}

// Define table columns for orders
const getOrderColumns = (
  onViewDetails: (order: Order) => void,
  onEdit: (order: Order) => void,
  onDelete: (order: Order) => void
): TableColumn<Order>[] => [
  {
    key: 'order_number',
    title: 'Order #',
    dataIndex: 'order_number',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-indigo-600">{value}</span>
    )
  },
  {
    key: 'customer_name',
    title: 'Customer',
    dataIndex: 'customer_name',
    sortable: true
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
    sortable: true,
    align: 'center' as const,
    width: 80
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    sortable: true,
    align: 'right' as const,
    render: (value: number) => `$${value?.toFixed(2) || '0.00'}`,
    responsive: 'desktop'
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (value: string) => <StatusBadge status={value} size="sm" />
  },
  {
    key: 'due_date',
    title: 'Due Date',
    dataIndex: 'due_date',
    sortable: true,
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
    responsive: 'desktop'
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    width: 120,
    render: (_, record: Order) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(record);
          }}
          className="text-slate-600 hover:text-slate-900"
          title="View details"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="text-indigo-600 hover:text-slate-900"
          title="Edit order"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          className="text-red-600 hover:text-red-900"
          title="Delete order"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    )
  }
]

export default function Orders() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const queryClient = useQueryClient()

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data as Order[]
    }
  })

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post('/orders/', orderData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      showSuccessToast('Order created successfully')
      setIsFormModalOpen(false)
      setIsSubmitting(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to create order'
      showErrorToast(message)
      setIsSubmitting(false)
    }
  })

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/orders/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      showSuccessToast('Order updated successfully')
      setIsFormModalOpen(false)
      setIsSubmitting(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to update order'
      showErrorToast(message)
      setIsSubmitting(false)
    }
  })

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await api.delete(`/orders/${orderId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      showSuccessToast('Order deleted successfully')
      setIsDeleteModalOpen(false)
      setIsDeleting(false)
      setSelectedOrder(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to delete order'
      showErrorToast(message)
      setIsDeleting(false)
    }
  })

  const handleCreateOrder = (data: any) => {
    setIsSubmitting(true)
    createOrderMutation.mutate(data)
  }

  const handleOpenCreateModal = () => {
    setFormMode('create')
    setSelectedOrder(null)
    setIsFormModalOpen(true)
  }

  const handleEditClick = (order: Order) => {
    setFormMode('edit')
    setSelectedOrder(order)
    setIsFormModalOpen(true)
  }

  const handleUpdateOrder = (data: any) => {
    if (selectedOrder) {
      setIsSubmitting(true)
      updateOrderMutation.mutate({ id: selectedOrder.id, data })
    }
  }

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedOrder) {
      setIsDeleting(true)
      deleteOrderMutation.mutate(selectedOrder.id)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  // Define table columns
  const columns = getOrderColumns(handleViewDetails, handleEditClick, handleDeleteClick);

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading orders...</p>
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
            <p className="text-red-800">Error loading orders. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <Button 
          onClick={handleOpenCreateModal}
          variant="primary"
        >
          Create Order
        </Button>
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={orders || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No orders yet. Create your first order to get started."
          onRow={(record) => ({
            onClick: () => handleViewDetails(record),
            className: 'cursor-pointer'
          })}
        />
      </Card>

      <OrderFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        order={selectedOrder}
        onSubmit={formMode === 'create' ? handleCreateOrder : handleUpdateOrder}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={selectedOrder?.order_number || ''}
        itemType="order"
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <>
            {/* Order Info */}
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-600">Order Number</p>
                    <p className="text-sm text-slate-900 mt-1">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedOrder.status} size="sm" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Customer</p>
                    <p className="text-sm text-slate-900 mt-1">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Product</p>
                    <p className="text-sm text-slate-900 mt-1">{selectedOrder.product_description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Quantity</p>
                    <p className="text-sm text-slate-900 mt-1">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Price</p>
                    <p className="text-sm text-slate-900 mt-1">${selectedOrder.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  {selectedOrder.due_date && (
                    <div>
                      <p className="text-xs font-medium text-slate-600">Due Date</p>
                      <p className="text-sm text-slate-900 mt-1">{new Date(selectedOrder.due_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedOrder.specifications && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-slate-600">Specifications</p>
                      <p className="text-sm text-slate-900 mt-1">{selectedOrder.specifications}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Manufacturing Timeline */}
            <Card variant="default">
              <CardHeader>
                <CardTitle as="h4">Manufacturing Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline orderId={selectedOrder.id} />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  handleEditClick(selectedOrder)
                }}
              >
                Edit Order
              </Button>
            </div>
          </>
        )}
      </Modal>
    </Container>
  )
}
