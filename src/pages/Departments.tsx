import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

interface DepartmentBalance {
  id: number
  metal_type: string
  balance_grams: number
}

interface Department {
  id: number
  tenant_id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  balances: DepartmentBalance[]
}

export default function Departments() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  const queryClient = useQueryClient()

  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/departments/')
      return response.data as Department[]
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post('/departments/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      setIsCreateModalOpen(false)
      setFormData({ name: '' })
      alert('Department created successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to create department')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: { name: string } }) => {
      const response = await api.put(`/departments/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      setIsEditModalOpen(false)
      setDepartmentToEdit(null)
      setFormData({ name: '' })
      alert('Department updated successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to update department')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/departments/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      setIsDeleteModalOpen(false)
      setDepartmentToDelete(null)
      alert('Department deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to delete department')
    }
  })

  const formatMetalType = (metalType: string) => {
    return metalType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Departments</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading departments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Departments</h1>
        <div className="border rounded-md p-4 bg-red-50 border-red-200">
          <p className="text-red-800">Error loading departments. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
    <div className="px-4 py-6 sm:px-0 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Departments</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        > 
          Create Department
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metal Balances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments?.map((dept) => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs rounded-full ${dept.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dept.balances && dept.balances.length > 0 ? (
                    <div className="space-y-1">
                      {dept.balances.map((balance) => (
                        <div key={balance.id}>
                          {formatMetalType(balance.metal_type)}: {balance.balance_grams.toFixed(2)}g
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No balances</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setDepartmentToEdit(dept)
                      setFormData({ name: dept.name })
                      setIsEditModalOpen(true)
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDepartmentToDelete(dept)
                      setIsDeleteModalOpen(true)
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Department</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate(formData)
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setFormData({ name: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && departmentToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Department</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              updateMutation.mutate({ id: departmentToEdit.id, data: formData })
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setDepartmentToEdit(null)
                    setFormData({ name: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && departmentToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Department</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{departmentToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setDepartmentToDelete(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(departmentToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Container>
  )
}
