export interface RoleCreate {
  name: string
  description?: string
  permission_ids: number[]
}

export interface RoleUpdate {
  name?: string
  description?: string
  permission_ids?: number[]
}
