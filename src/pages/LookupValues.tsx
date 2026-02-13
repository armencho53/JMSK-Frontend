import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import {
  fetchLookupValues,
  createLookupValue,
  updateLookupValue,
  deleteLookupValue,
  seedLookupDefaults,
} from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import { Container } from '../components/ui/Container'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import LookupValueFormModal from '../components/LookupValueFormModal'
import type { LookupValue, LookupValueCreate, LookupValueUpdate } from '../types/lookupValue'

const CATEGORY_LABELS: Record<string, string> = {
  metal_type: 'Metal Types',
  step_type: 'Step Types',
  supply_type: 'Supply Types',
}

const CATEGORY_ORDER = ['metal_type', 'step_type', 'supply_type']

interface FormState {
  isOpen: boolean
  mode: 'create' | 'edit'
  category: string
  value: LookupValue | null
}

const initialFormState: FormState = {
  isOpen: false,
  mode: 'create',
  category: '',
  value: null,
}

export default function LookupValues() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [formError, setFormError] = useState('')

  const queryClient = useQueryClient()

  const { data: lookupValues, isLoading, error } = useQuery({
    queryKey: ['lookup-values', 'all', true],
    queryFn: () => fetchLookupValues(undefined, true),
  })

  // Group values by category
  const grouped = (lookupValues || []).reduce<Record<string, LookupValue[]>>((acc, val) => {
    if (!acc[val.category]) acc[val.category] = []
    acc[val.category].push(val)
    return acc
  }, {})

  // Sort each category's values by sort_order
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => a.sort_order - b.sort_order)
  }

  // Ensure all known categories appear even if empty
  const categories = [
    ...CATEGORY_ORDER.filter((c) => c in grouped || CATEGORY_LABELS[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ]
  // Deduplicate
  const uniqueCategories = [...new Set(categories)]

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: LookupValueCreate) => createLookupValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookup-values'] })
      showSuccessToast('Lookup value created successfully')
      closeForm()
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to create lookup value'
      setFormError(message)
      showErrorToast(message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LookupValueUpdate }) =>
      updateLookupValue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookup-values'] })
      showSuccessToast('Lookup value updated successfully')
      closeForm()
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to update lookup value'
      setFormError(message)
      showErrorToast(message)
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deleteLookupValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookup-values'] })
      showSuccessToast('Lookup value deactivated')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to deactivate lookup value'
      showErrorToast(message)
    },
  })

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => updateLookupValue(id, { is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookup-values'] })
      showSuccessToast('Lookup value reactivated')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to reactivate lookup value'
      showErrorToast(message)
    },
  })

  const seedMutation = useMutation({
    mutationFn: () => seedLookupDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookup-values'] })
      showSuccessToast('Default values seeded successfully')
    },
    onError: (err: any) => {
      const message = err.response?.data?.detail || 'Failed to seed defaults'
      showErrorToast(message)
    },
  })

  // Form handlers
  const openCreateForm = (category: string) => {
    setFormState({ isOpen: true, mode: 'create', category, value: null })
    setFormError('')
  }

  const openEditForm = (value: LookupValue) => {
    setFormState({ isOpen: true, mode: 'edit', category: value.category, value })
    setFormError('')
  }

  const closeForm = () => {
    setFormState(initialFormState)
    setFormError('')
  }

  const handleModalSubmit = (data: { code: string; display_label: string; sort_order: number }) => {
    setFormError('')

    if (formState.mode === 'create') {
      createMutation.mutate({
        category: formState.category,
        code: data.code,
        display_label: data.display_label,
        sort_order: data.sort_order,
      })
    } else if (formState.value) {
      updateMutation.mutate({
        id: formState.value.id,
        data: {
          display_label: data.display_label,
          sort_order: data.sort_order,
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Loading state
  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading lookup values...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Error loading lookup values. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Lookup Values</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage configurable categories for your organization
          </p>
        </div>
        <Button
          onClick={() => seedMutation.mutate()}
          variant="tertiary"
          size="sm"
          loading={seedMutation.isPending}
        >
          Seed Defaults
        </Button>
      </div>

      <div className="space-y-6">
        {uniqueCategories.map((category) => {
          const values = grouped[category] || []
          const label = CATEGORY_LABELS[category] || category

          return (
            <Card key={category} variant="elevated" padding="none">
              <div className="px-4 py-4 sm:px-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">{label}</h2>
                  <p className="text-sm text-slate-500">{values.length} value{values.length !== 1 ? 's' : ''}</p>
                </div>
                <Button
                  onClick={() => openCreateForm(category)}
                  variant="primary"
                  size="sm"
                >
                  Add Value
                </Button>
              </div>

              {values.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No values yet. Click "Add Value" or "Seed Defaults" to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Display Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sort Order</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {values.map((val) => (
                        <tr
                          key={val.id}
                          className={val.is_active ? '' : 'bg-slate-50 opacity-60'}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`font-mono font-medium ${val.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                              {val.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={val.is_active ? 'text-slate-700' : 'text-slate-400 line-through'}>
                              {val.display_label}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                            {val.sort_order}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {val.is_active ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right space-x-3">
                            <button
                              onClick={() => openEditForm(val)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            {val.is_active ? (
                              <button
                                onClick={() => deactivateMutation.mutate(val.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={deactivateMutation.isPending}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => reactivateMutation.mutate(val.id)}
                                className="text-green-600 hover:text-green-900"
                                disabled={reactivateMutation.isPending}
                              >
                                Reactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <LookupValueFormModal
        isOpen={formState.isOpen}
        onClose={closeForm}
        mode={formState.mode}
        category={formState.category}
        value={formState.value}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        apiError={formError}
      />
    </Container>
  )
}
