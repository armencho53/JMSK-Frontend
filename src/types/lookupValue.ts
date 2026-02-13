/**
 * Lookup value type definitions for tenant-scoped configurable enums
 *
 * Lookup values replace hardcoded enums (MetalType, StepType, SupplyType)
 * with tenant-specific, database-driven values managed via the admin UI.
 *
 * Requirements: 7.1
 */

export interface LookupValue {
  id: number
  tenant_id: number
  category: string
  code: string
  display_label: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LookupValueCreate {
  category: string
  code: string
  display_label: string
  sort_order?: number
}

export interface LookupValueUpdate {
  display_label?: string
  sort_order?: number
  is_active?: boolean
}
