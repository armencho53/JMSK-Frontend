import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import RoleFormModal from '../components/RoleFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import type { RoleCreate, RoleUpdate } from '../types/role'

interface Permission {
  id: number
  name: string
  description: string
  resource: string
  action: string
}

interface Role {
  id: number
  name: string
  description: string
  is_system_role: boolean
  permissions: Permission[]
  created_at: string
}

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  
  // Debug: Log user and admin status
  console.log('Current user:', user)
  console.log('Is admin:', isAdmin)

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get('/roles/')
      return response.data as Role[]
    }
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await api.get('/roles/permissions')
      return response.data as Permission[]
    }
  })

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (data: RoleCreate) => {
      const response = await api.post('/roles/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      showSuccessToast('Role created successfully')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create role'
      showErrorToast(message)
    }
  })

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RoleUpdate }) => {
      const response = await api.put(`/roles/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      showSuccessToast('Role updated successfully')
      setIsEditModalOpen(false)
      setRoleToEdit(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update role'
      showErrorToast(message)
    }
  })

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/roles/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setSelectedRole(null)
      showSuccessToast('Role deleted successfully')
      setIsDeleteModalOpen(false)
      setRoleToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete role'
      showErrorToast(message)
    }
  })

  // Handler functions
  const handleCreateRole = (data: RoleCreate) => {
    createRoleMutation.mutate(data)
  }

  const handleEditClick = (role: Role) => {
    setRoleToEdit(role)
    setIsEditModalOpen(true)
  }

  const handleUpdateRole = (data: RoleCreate) => {
    if (roleToEdit) {
      updateRoleMutation.mutate({
        id: roleToEdit.id,
        data: {
          name: data.name,
          description: data.description,
          permission_ids: data.permission_ids
        }
      })
    }
  }

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete.id)
    }
  }

  if (rolesLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 bg-slate-50">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading roles...</p>
        </div>
      </div>
    )
  }

  const groupedPermissions = permissions?.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = []
    }
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <Container size="full" padding="md">
          <Toaster />
    <div className="px-4 py-6 sm:px-0 bg-slate-50">
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Role Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage roles and permissions for your organization
          </p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
          > 
            Create Role
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Roles List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Roles ({roles?.length || 0})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {roles?.map((role) => (
              <li
                key={role.id}
                className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                  selectedRole?.id === role.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {role.name}
                      </p>
                      {role.is_system_role && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          System
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {role.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {role.permissions.length} permissions
                    </p>
                  </div>
                  <div className="ml-4">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Role Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {selectedRole ? (
            <>
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedRole.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedRole.description}
                    </p>
                  </div>
                  {isAdmin && !selectedRole.is_system_role && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(selectedRole)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(selectedRole)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Permissions ({selectedRole.permissions.length})
                </h4>
                
                {Object.entries(
                  selectedRole.permissions.reduce((acc, perm) => {
                    if (!acc[perm.resource]) {
                      acc[perm.resource] = []
                    }
                    acc[perm.resource].push(perm)
                    return acc
                  }, {} as Record<string, Permission[]>)
                ).map(([resource, perms]) => (
                  <div key={resource} className="mb-4">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      {resource}
                    </h5>
                    <div className="space-y-1">
                      {perms.map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <svg
                            className="h-4 w-4 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="capitalize">{perm.action}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            ({perm.description})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No role selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a role from the list to view its permissions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All Permissions Reference */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Available Permissions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All permissions that can be assigned to roles
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groupedPermissions &&
              Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    {resource}
                  </h4>
                  <div className="space-y-2">
                    {perms.map((perm) => (
                      <div key={perm.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {perm.action}
                          </span>
                        </div>
                        <p className="ml-2 text-xs text-gray-500">
                          {perm.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RoleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        permissions={permissions || []}
        onSubmit={handleCreateRole}
        isSubmitting={createRoleMutation.isPending}
      />

      <RoleFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setRoleToEdit(null)
        }}
        mode="edit"
        role={roleToEdit}
        permissions={permissions || []}
        onSubmit={handleUpdateRole}
        isSubmitting={updateRoleMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setRoleToDelete(null)
        }}
        itemName={roleToDelete?.name || ''}
        itemType="Role"
        onConfirm={handleConfirmDelete}
        isDeleting={deleteRoleMutation.isPending}
      />
    </div>
    </Container>
  )
}
