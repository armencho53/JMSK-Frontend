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

/**
 * Metal price response from price lookup API
 * Requirements: 8.1, 8.2, 8.8
 */
export interface MetalPriceResponse {
  metal_code: string
  price_per_gram: number
  currency: string
  fetched_at: string
  cached: boolean
}
