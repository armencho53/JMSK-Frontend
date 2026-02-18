export interface Metal {
  id: number
  tenant_id: number
  code: string
  name: string
  fine_percentage: number
  average_cost_per_gram: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MetalCreate {
  code: string
  name: string
  fine_percentage: number
  average_cost_per_gram?: number | null
}

export interface MetalUpdate {
  name?: string
  fine_percentage?: number
  average_cost_per_gram?: number | null
  is_active?: boolean
}
