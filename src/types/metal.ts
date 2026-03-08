export type MetalType = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM' | 'OTHER'

export const METAL_TYPES: MetalType[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'OTHER']

export interface Metal {
  id: number
  tenant_id: number
  code: string
  name: string
  metal_type: MetalType
  fine_percentage: number
  average_cost_per_gram: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MetalCreate {
  code: string
  name: string
  metal_type: MetalType
  fine_percentage: number
  average_cost_per_gram?: number | null
}

export interface MetalUpdate {
  name?: string
  metal_type?: MetalType
  fine_percentage?: number
  average_cost_per_gram?: number | null
  is_active?: boolean
}

/**
 * Metal price response from price lookup API
 */
export interface MetalPriceResponse {
  metal_code: string
  price_per_gram: number
  currency: string
  fetched_at: string
  cached: boolean
}
