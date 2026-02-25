import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useMetals } from '../hooks/useMetals'
import { useAuthStore } from '../store/authStore'
import { Container } from '../components/ui/Container'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import MetalFormModal from '../components/MetalFormModal'
import type { Metal } from '../types/metal'

const MANAGER_ROLES = new Set(['manager', 'admin'])

interface FormState {
  isOpen: boolean
  mode: 'create' | 'edit'
  metal: Metal | null
}

export default function Metals() {
  const [showInactive, setShowInactive] = useState(false)
  const [formState, setFormState] = useState<FormState>({ isOpen: false, mode: 'create', metal: null })
  const [formError, setFormError] = useState('')

  const { metals, isLoading, isError, createMetal, updateMetal, deactivateMetal, reactivateMetal } = useMetals(showInactive)
  const user = useAuthStore((s) => s.user)
  const isManager = user ? MANAGER_ROLES.has(user.role.toLowerCase()) : false

  const openCreate = () => {
    setFormState({ isOpen: true, mode: 'create', metal: null })
    setFormError('')
  }
  const openEdit = (metal: Metal) => {
    setFormState({ isOpen: true, mode: 'edit', metal })
    setFormError('')
  }
  const closeForm = () => {
    setFormState({ isOpen: false, mode: 'create', metal: null })
    setFormError('')
  }

  const handleSubmit = (data: { code: string; name: string; fine_percentage: number; average_cost_per_gram?: number | null }) => {
    setFormError('')
    if (formState.mode === 'create') {
      createMetal.mutate(data, {
        onSuccess: () => closeForm(),
        onError: (err: any) => setFormError(err.response?.data?.detail || 'Failed to create metal'),
      })
    } else if (formState.metal) {
      const { code: _, ...updateData } = data
      updateMetal.mutate({ id: formState.metal.id, data: updateData }, {
        onSuccess: () => closeForm(),
        onError: (err: any) => setFormError(err.response?.data?.detail || 'Failed to update metal'),
      })
    }
  }

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            <p className="mt-2 text-slate-600">Loading metals...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Error loading metals. Please try again.</p>
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
          <h1 className="text-2xl font-semibold text-slate-900">Metals</h1>
          <p className="mt-1 text-sm text-slate-600">Manage metal types and their fine percentages</p>
        </div>
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
            <Button variant="primary" onClick={openCreate}>
              Add Metal
            </Button>
          )}
        </div>
      </div>

      <Card variant="elevated" padding="none">
        {metals.length === 0 ? (
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
                {metals.map((metal) => (
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
                        <button onClick={() => openEdit(metal)} className="text-indigo-600 hover:text-indigo-900">
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

      <MetalFormModal
        isOpen={formState.isOpen}
        onClose={closeForm}
        mode={formState.mode}
        metal={formState.metal}
        onSubmit={handleSubmit}
        isSubmitting={createMetal.isPending || updateMetal.isPending}
        apiError={formError}
      />
    </Container>
  )
}
