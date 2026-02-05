/**
 * Address type definitions for hierarchical contact system
 * 
 * Addresses are associated with companies and can be marked as default.
 * Default addresses are automatically populated during shipment creation.
 * 
 * Requirements: 5.1, 6.2
 */

export interface Address {
  id: number
  tenant_id: number
  company_id: number
  street_address: string
  city: string
  state: string
  zip_code: string
  country: string
  is_default: boolean
  created_at: string
}

export interface AddressCreate {
  street_address: string
  city: string
  state: string
  zip_code: string
  country?: string
}

export interface AddressUpdate {
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  is_default?: boolean
}

export interface ShipmentAddress {
  street_address: string
  city: string
  state: string
  zip_code: string
  country: string
}
