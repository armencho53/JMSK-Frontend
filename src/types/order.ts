/**
 * Order type definitions for hierarchical contact system
 * 
 * Orders are placed by contacts on behalf of their companies.
 * Each order references both a contact and a company.
 * 
 * Requirements: 3.1, 6.2
 */

import { ContactSummary } from './contact'
import { CompanySummary } from './contact'

export interface Order {
  id: number
  tenant_id: number
  order_number: string
  
  // New hierarchical fields
  contact_id: number
  company_id: number
  contact?: ContactSummary  // Nested contact data (Requirement 3.1, 7.3)
  company?: CompanySummary  // Nested company data (Requirement 3.1, 7.3)
  
  // Legacy customer fields (for backward compatibility)
  customer_id: number  // Maps to contact_id
  customer_name: string
  customer_email?: string
  customer_phone?: string
  
  // Order details
  order_date?: string
  product_description?: string
  specifications?: string
  quantity: number
  price?: number
  status: string
  due_date?: string
  
  // Metal and weight tracking
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
  
  created_at: string
  updated_at: string
}

export interface OrderCreate {
  contact_id: number  // Required for new orders
  customer_name: string
  customer_email?: string
  customer_phone?: string
  product_description?: string
  specifications?: string
  quantity: number
  price?: number
  status?: string
  due_date?: string
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
}

export interface OrderUpdate {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  product_description?: string
  specifications?: string
  quantity?: number
  price?: number
  status?: string
  due_date?: string
  metal_type?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
}
