import { useState } from 'react'

interface Permission {
  id: number
  name: string
  description: string
  resource: string
  action: string
}

interface PermissionSelectorProps {
  permissions: Permission[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export default function PermissionSelector({
  permissions,
  selectedIds,
  onChange,
}: PermissionSelectorProps) {
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  )

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = []
    }
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const toggleResource = (resource: string) => {
    const newExpanded = new Set(expandedResources)
    if (newExpanded.has(resource)) {
      newExpanded.delete(resource)
    } else {
      newExpanded.add(resource)
    }
    setExpandedResources(newExpanded)
  }

  const handlePermissionToggle = (permissionId: number) => {
    if (selectedIds.includes(permissionId)) {
      onChange(selectedIds.filter((id) => id !== permissionId))
    } else {
      onChange([...selectedIds, permissionId])
    }
  }

  const handleSelectAllResource = (resourcePerms: Permission[]) => {
    const resourcePermIds = resourcePerms.map((p) => p.id)
    const allSelected = resourcePermIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      // Deselect all from this resource
      onChange(selectedIds.filter((id) => !resourcePermIds.includes(id)))
    } else {
      // Select all from this resource
      const newSelected = new Set([...selectedIds, ...resourcePermIds])
      onChange(Array.from(newSelected))
    }
  }

  const isResourceFullySelected = (resourcePerms: Permission[]) => {
    return resourcePerms.every((p) => selectedIds.includes(p.id))
  }

  const isResourcePartiallySelected = (resourcePerms: Permission[]) => {
    const selectedCount = resourcePerms.filter((p) =>
      selectedIds.includes(p.id)
    ).length
    return selectedCount > 0 && selectedCount < resourcePerms.length
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Permissions
        </label>
        <span className="text-xs text-gray-500">
          {selectedIds.length} selected
        </span>
      </div>

      <div className="border border-gray-300 rounded-md max-h-96 overflow-y-auto">
        {Object.entries(groupedPermissions).map(([resource, perms]) => {
          const isExpanded = expandedResources.has(resource)
          const isFullySelected = isResourceFullySelected(perms)
          const isPartiallySelected = isResourcePartiallySelected(perms)

          return (
            <div key={resource} className="border-b border-gray-200 last:border-b-0">
              <div className="bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isFullySelected}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = isPartiallySelected
                        }
                      }}
                      onChange={() => handleSelectAllResource(perms)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => toggleResource(resource)}
                      className="flex items-center space-x-2 text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-indigo-600"
                    >
                      <span>{resource}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {perms.filter((p) => selectedIds.includes(p.id)).length} /{' '}
                    {perms.length}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 py-2 space-y-2">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-start space-x-3 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {perm.action}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({perm.name})
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {perm.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
