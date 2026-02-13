import { useEffect, useState } from 'react'
import PermissionSelector from './PermissionSelector'

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

interface RoleFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  role?: Role | null
  permissions: Permission[]
  onSubmit: (data: {
    name: string
    description: string
    permission_ids: number[]
  }) => void
  isSubmitting: boolean
}

export default function RoleFormModal({
  isOpen,
  onClose,
  mode,
  role,
  permissions,
  onSubmit,
  isSubmitting,
}: RoleFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPermissionIds: [] as number[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when modal opens or role changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && role) {
        setFormData({
          name: role.name,
          description: role.description || '',
          selectedPermissionIds: role.permissions.map((p) => p.id),
        })
      } else {
        setFormData({
          name: '',
          description: '',
          selectedPermissionIds: [],
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, role])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      permission_ids: formData.selectedPermissionIds,
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {mode === 'create' ? 'Create New Role' : 'Edit Role'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form id="role-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="role-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`mt-1 block w-full border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., Manager, Viewer"
                  />
                  <p className="mt-1 text-xs text-gray-500">A descriptive name for this role</p>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description Input */}
                <div>
                  <label
                    htmlFor="role-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="role-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Describe the purpose of this role"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional description of what this role is for</p>
                </div>

                {/* Permission Selector */}
                <PermissionSelector
                  permissions={permissions}
                  selectedIds={formData.selectedPermissionIds}
                  onChange={(ids) =>
                    setFormData({ ...formData, selectedPermissionIds: ids })
                  }
                />

                {/* Action Buttons */}
              </form>
            </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="role-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create Role'
              ) : (
                'Update Role'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
