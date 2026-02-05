import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Dashboard() {
  const { data: supplies, isLoading: suppliesLoading, error: suppliesError } = useQuery({
    queryKey: ['supplies'],
    queryFn: async () => {
      const response = await api.get('/supplies/')
      return response.data
    }
  })

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data
    }
  })

  const { data: shipments, isLoading: shipmentsLoading, error: shipmentsError } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await api.get('/shipments/')
      return response.data
    }
  })

  const isLoading = suppliesLoading || ordersLoading || shipmentsLoading
  const hasError = suppliesError || ordersError || shipmentsError

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-900 mb-8">Dashboard</h1>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-900 mb-8">Dashboard</h1>
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <h2 className="text-lg font-semibold text-red-800">Error Loading Data</h2>
            </div>
            <p className="text-red-700 mb-4">Unable to load dashboard data. Please check your connection and try again.</p>
            {(suppliesError || ordersError || shipmentsError) && (
              <div className="text-sm text-red-600 space-y-1">
                {suppliesError && <p>• Supplies: {(suppliesError as any).message}</p>}
                {ordersError && <p>• Orders: {(ordersError as any).message}</p>}
                {shipmentsError && <p>• Shipments: {(shipmentsError as any).message}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const activeOrders = orders?.filter((o: any) => o.status === 'IN_PROGRESS' || o.status === 'PENDING') || []
  const completedOrders = orders?.filter((o: any) => o.status === 'COMPLETED') || []

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 font-professional-heading">
              Manufacturing Dashboard
            </h1>
            <p className="text-slate-600 mt-1 font-professional-body">
              Monitor your jewelry manufacturing operations
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Key Metrics Cards - Professional Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Supplies */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Supplies
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {supplies?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mr-4">
                <div className="w-6 h-6 border-2 border-white rounded"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Active Orders
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {activeOrders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {completedOrders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Shipments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Shipments
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {shipments?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Professional Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Recent Orders */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e2e8f0',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            <div style={{ 
              padding: '24px', 
              borderBottom: '1px solid #e2e8f0' 
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                Recent Orders
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Latest customer orders and their status
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              {orders && orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '16px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: '#94a3b8', 
                          borderRadius: '50%' 
                        }}></div>
                        <div>
                          <p style={{ fontWeight: '500', color: '#0f172a', margin: '0 0 2px 0' }}>
                            Order #{order.id}
                          </p>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            {order.contact?.name || order.customer_name || 'Customer'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-flex',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '20px',
                          backgroundColor: order.status === 'COMPLETED' 
                            ? '#dcfce7' 
                            : order.status === 'IN_PROGRESS'
                            ? '#fed7aa'
                            : '#f1f5f9',
                          color: order.status === 'COMPLETED' 
                            ? '#166534' 
                            : order.status === 'IN_PROGRESS'
                            ? '#9a3412'
                            : '#475569'
                        }}>
                          {order.status?.replace('_', ' ') || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '12px', 
                    margin: '0 auto 16px auto' 
                  }}></div>
                  <p style={{ color: '#64748b', margin: 0 }}>No orders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Supply Inventory */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e2e8f0',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            <div style={{ 
              padding: '24px', 
              borderBottom: '1px solid #e2e8f0' 
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                Supply Inventory
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Current material stock levels
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              {supplies && supplies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {supplies.slice(0, 5).map((supply: any) => (
                    <div key={supply.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '16px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: '#ea580c', 
                          borderRadius: '50%' 
                        }}></div>
                        <div>
                          <p style={{ fontWeight: '500', color: '#0f172a', margin: '0 0 2px 0' }}>
                            {supply.name}
                          </p>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            {supply.metal_type?.replace('_', ' ') || 'Material'}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '500', color: '#0f172a', margin: '0 0 2px 0' }}>
                          {supply.quantity_grams || 0}g
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                          Available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '12px', 
                    margin: '0 auto 16px auto' 
                  }}></div>
                  <p style={{ color: '#64748b', margin: 0 }}>No supplies found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status - Professional Design */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          border: '1px solid #e2e8f0', 
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#16a34a', 
              borderRadius: '50%' 
            }}></div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
              System Status
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Backend Connection
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                Active
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Data Synchronization
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                Online
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Authentication
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
