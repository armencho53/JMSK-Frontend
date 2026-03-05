import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import OrderFormModal from '../components/OrderFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import OrderTimeline from '../components/OrderTimeline'
import { Order, OrderUpdate } from '../types/order'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Button } from '../components/ui/Button'

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    },
    enabled: !!orderId
  })

  useEffect(() => {
    if (order) {
      document.title = `${order.order_number} - Order Details - JMSK`
    }
  }, [order])

  const updateOrderMutation = useMutation({
    mutationFn: (data: OrderUpdate) => api.put(`/orders/${orderId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      showSuccessToast('Order updated successfully')
      setIsEditModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update order'
      showErrorToast(message)
    }
  })

  const deleteOrderMutation = useMutation({
    mutationFn: () => api.delete(`/orders/${orderId}`),
    onSuccess: () => {
      showSuccessToast('Order deleted successfully')
      navigate('/orders')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete order'
      showErrorToast(message)
      setIsDeleteModalOpen(false)
    }
  })

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading order...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Order not found.</p>
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
          onClick={() => navigate('/orders')}
          className="mb-4"
        >
          ← Back to Orders
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{order.order_number}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={order.status} />
              {order.contact?.name && (
                <span className="text-slate-600">Contact: {order.contact.name}</span>
              )}
            </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <dt className="text-sm font-medium text-slate-600">Due Date</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {order.due_date ? new Date(order.due_date).toLocaleDateString() : '-'}
                  </dd>
                </div>
              </dl>

              {order.line_items && order.line_items.length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Line Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Product Description</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Specifications</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Metal Type</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Qty</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Target Wt/Pc (g)</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Initial Total Wt (g)</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Price</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Labor Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.line_items.map((item, index) => (
                          <tr key={item.id ?? index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.product_description || '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.specifications || '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.metal_name || '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.quantity ?? '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.target_weight_per_piece != null ? item.target_weight_per_piece : '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.initial_total_weight != null ? item.initial_total_weight : '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.price != null ? `$${item.price.toFixed(2)}` : '-'}</td>
                            <td className="px-3 py-2 text-sm text-slate-900">{item.labor_cost != null ? `$${item.labor_cost.toFixed(2)}` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (order.product_description || order.specifications || order.quantity || order.price) ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Product Description</dt>
                    <dd className="mt-1 text-sm text-slate-900">{order.product_description || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Quantity</dt>
                    <dd className="mt-1 text-sm text-slate-900">{order.quantity || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-600">Price</dt>
                    <dd className="mt-1 text-sm text-slate-900">${order.price?.toFixed(2) || '0.00'}</dd>
                  </div>
                  {order.metal_name && (
                    <div>
                      <dt className="text-sm font-medium text-slate-600">Metal Type</dt>
                      <dd className="mt-1 text-sm text-slate-900">{order.metal_name}</dd>
                    </div>
                  )}
                  {order.target_weight_per_piece && (
                    <div>
                      <dt className="text-sm font-medium text-slate-600">Target Weight/Piece</dt>
                      <dd className="mt-1 text-sm text-slate-900">{order.target_weight_per_piece}g</dd>
                    </div>
                  )}
                  {order.initial_total_weight && (
                    <div>
                      <dt className="text-sm font-medium text-slate-600">Initial Total Weight</dt>
                      <dd className="mt-1 text-sm text-slate-900">{order.initial_total_weight}g</dd>
                    </div>
                  )}
                  {order.specifications && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-slate-600">Specifications</dt>
                      <dd className="mt-1 text-sm text-slate-900">{order.specifications}</dd>
                    </div>
                  )}
                </dl>
              ) : null}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Manufacturing Timeline</h2>
              <OrderTimeline orderId={Number(orderId)} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Contact</p>
                  <p className="text-sm text-slate-900">{order.contact?.name || '-'}</p>
                </div>
                {order.company && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">Company</p>
                    <button
                      onClick={() => navigate(`/companies/${order.company_id}`)}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      {order.company.name}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Timestamps</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Created</p>
                  <p className="text-sm text-slate-900">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Last Updated</p>
                  <p className="text-sm text-slate-900">
                    {order.updated_at ? new Date(order.updated_at).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        order={order}
        onSubmit={(data) => updateOrderMutation.mutate(data)}
        isSubmitting={updateOrderMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={order.order_number}
        itemType="Order"
        onConfirm={() => deleteOrderMutation.mutate()}
        isDeleting={deleteOrderMutation.isPending}
      />
    </Container>
  )
}
