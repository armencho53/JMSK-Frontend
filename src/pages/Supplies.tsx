import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import api, { fetchMetals } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import { useMetals } from '../hooks/useMetals'
import { useAuthStore } from '../store/authStore'
import SupplyFormModal from '../components/SupplyFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import MetalFormModal from '../components/MetalFormModal'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StatusBadge } from '../components/ui/Status'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import type { Metal } from '../types/metal'

const MANAGER_ROLES = new Set(['manager', 'admin'])

interface UnifiedSupplyRow {
  id: number
  name: string
  type: string
  quantity: number
  unit: string
  cost_per_unit: number
  supplier: string
  source: 'supply' | 'metal'
}

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

// Read-only columns for the All tab (no Actions column)
const allTabColumns: TableColumn<UnifiedSupplyRow>[] = [
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
    render: (_, record: UnifiedSupplyRow) => (
      <span className="text-slate-900">
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
    render: (value: number) => `${value?.toFixed(2) || '0.00'}`,
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
]

function mergeSuppliesAndMetals(supplies: Supply[], metals: Metal[]): UnifiedSupplyRow[] {
  const supplyRows: UnifiedSupplyRow[] = supplies.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    quantity: s.quantity,
    unit: s.unit,
    cost_per_unit: s.cost_per_unit,
    supplier: s.supplier,
    source: 'supply' as const,
  }))

  const metalRows: UnifiedSupplyRow[] = metals.map((m) => ({
    id: m.id,
    name: m.name,
    type: m.code,
    quantity: 0,
    unit: 'grams',
    cost_per_unit: m.average_cost_per_gram || 0,
    supplier: '-',
    source: 'metal' as const,
  }))

  return [...supplyRows, ...metalRows]
}

interface MetalFormState {
  isOpen: boolean
  mode: 'create' | 'edit'
  metal: Metal | null
}

type SupplyTab = 'all' | 'supplies' | 'metals'

const SUPPLY_TABS: { key: SupplyTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'supplies', label: 'Supplies' },
  { key: 'metals', label: 'Metals' },
]

export default function Supplies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SupplyTab = tabParam === 'supplies' || tabParam === 'metals' ? tabParam : 'all'

  const setActiveTab = (tab: SupplyTab) => {
    setSearchParams(tab === 'all' ? {} : { tab })
  }

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [supplyToEdit, setSupplyToEdit] = useState<Supply | null>(null)
  const [supplyToDelete, setSupplyToDelete] = useState<Supply | null>(null)

  // Metals tab state
  const [showInactive, setShowInactive] = useState(false)
  const [metalFormState, setMetalFormState] = useState<MetalFormState>({ isOpen: false, mode: 'create', metal: null })
  const [metalFormError, setMetalFormError] = useState('')

  const user = useAuthStore((s) => s.user)
  const isManager = user ? MANAGER_ROLES.has(user.role.toLowerCase()) : false

  const { metals: metalsTabData, isLoading: isMetalsTabLoading, isError: isMetalsTabError, createMetal, updateMetal, deactivateMetal, reactivateMetal } = useMetals(showInactive)

  const openMetalCreate = () => {
    setMetalFormState({ isOpen: true, mode: 'create', metal: null })
    setMetalFormError('')
  }
  const openMetalEdit = (metal: Metal) => {
    setMetalFormState({ isOpen: true, mode: 'edit', metal })
    setMetalFormError('')
  }
  const closeMetalForm = () => {
    setMetalFormState({ isOpen: false, mode: 'create', metal: null })
    setMetalFormError('')
  }

  const handleMetalSubmit = (data: { code: string; name: string; fine_percentage: number; average_cost_per_gram?: number | null }) => {
    setMetalFormError('')
    if (metalFormState.mode === 'create') {
      createMetal.mutate(data, {
        onSuccess: () => closeMetalForm(),
        onError: (err: any) => setMetalFormError(err.response?.data?.detail || 'Failed to create metal'),
      })
    } else if (metalFormState.metal) {
      const { code: _, ...updateData } = data
      updateMetal.mutate({ id: metalFormState.metal.id, data: updateData }, {
        onSuccess: () => closeMetalForm(),
        onError: (err: any) => setMetalFormError(err.response?.data?.detail || 'Failed to update metal'),
      })
    }
  }

  const queryClient = useQueryClient()

  const { data: supplies, isLoading, error } = useQuery({
    queryKey: ['supplies'],
    queryFn: async () => {
      const response = await api.get('/supplies/')
      return response.data as Supply[]
    }
  })

  const { data: metals, isLoading: isMetalsLoading, error: metalsError } = useQuery({
    queryKey: ['metals'],
    queryFn: () => fetchMetals(false),
    enabled: activeTab === 'all',
  })

  const unifiedRows = useMemo(
    () => mergeSuppliesAndMetals(supplies || [], metals || []),
    [supplies, metals]
  )

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

  if (isLoading || (activeTab === 'all' && isMetalsLoading)) {
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

  if (error || (activeTab === 'all' && metalsError)) {
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
        {activeTab === 'supplies' && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
          >
            Add Supply
          </Button>
        )}
        {activeTab === 'metals' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show inactive
            </label>
            {isManager && (
              <Button variant="primary" onClick={openMetalCreate}>
                Add Metal
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {SUPPLY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'all' && (
        <Card variant="elevated">
          <Table
            columns={allTabColumns}
            data={unifiedRows}
            loading={isLoading || isMetalsLoading}
            hoverable
            responsive
            emptyText="No supplies or metals found."
          />
        </Card>
      )}

      {activeTab === 'supplies' && (
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
      )}

      {activeTab === 'metals' && (
        <>
          {isMetalsTabLoading ? (
            <Card variant="default">
              <CardContent className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                <p className="mt-2 text-slate-600">Loading metals...</p>
              </CardContent>
            </Card>
          ) : isMetalsTabError ? (
            <Card variant="outlined" className="border-red-200 bg-red-50">
              <CardContent>
                <p className="text-red-800">Error loading metals. Please try again.</p>
              </CardContent>
            </Card>
          ) : (
            <Card variant="elevated" padding="none">
              {metalsTabData.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No metals found. {isManager ? 'Click "Add Metal" to get started.' : ''}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Fine %</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Cost/g</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        {isManager && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {metalsTabData.map((metal) => (
                        <tr key={metal.id} className={metal.is_active ? '' : 'bg-slate-50 opacity-60'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`font-mono font-medium ${metal.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                              {metal.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={metal.is_active ? 'text-slate-700' : 'text-slate-400 line-through'}>
                              {metal.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-700">
                            {(metal.fine_percentage * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-700">
                            {metal.average_cost_per_gram != null ? metal.average_cost_per_gram.toFixed(2) : '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {metal.is_active ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Inactive</span>
                            )}
                          </td>
                          {isManager && (
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right space-x-3">
                              <button onClick={() => openMetalEdit(metal)} className="text-indigo-600 hover:text-indigo-900">
                                Edit
                              </button>
                              {metal.is_active ? (
                                <button
                                  onClick={() => deactivateMetal.mutate(metal.id)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={deactivateMetal.isPending}
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => reactivateMetal.mutate(metal.id)}
                                  className="text-green-600 hover:text-green-900"
                                  disabled={reactivateMetal.isPending}
                                >
                                  Reactivate
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </>
      )}

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

      <MetalFormModal
        isOpen={metalFormState.isOpen}
        onClose={closeMetalForm}
        mode={metalFormState.mode}
        metal={metalFormState.metal}
        onSubmit={handleMetalSubmit}
        isSubmitting={createMetal.isPending || updateMetal.isPending}
        apiError={metalFormError}
      />
    </Container>
  )
}
