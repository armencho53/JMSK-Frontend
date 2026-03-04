/**
 * Order type definitions for hierarchical contact system
 * 
 * Orders are placed by contacts on behalf of their companies.
 * Each order references both a contact and a company.
 * 
 * Requirements: 3.1, 3.8, 3.9, 3.10, 5.1, 5.2, 6.2
 */

import { ContactSummary } from './contact'
import { CompanySummary } from './contact'

/**
 * Order line item - represents a single product within an order
 * Requirements: 3.8, 4.3, 4.4
 */
export interface OrderLineItem {
  id?: number
  product_description: string
  specifications?: string
  metal_id?: number
  metal_name?: string
  quantity: number
  target_weight_per_piece?: number
  initial_total_weight?: number
  price?: number
  labor_cost?: number
}

/**
 * Order line item for creation (without id)
 */
export interface OrderLineItemCreate {
  product_description: string
  specifications?: string
  metal_id?: number
  quantity: number
  target_weight_per_piece?: number
  initial_total_weight?: number
  price?: number
  labor_cost?: number
}

/**
 * Metal deposit data for order creation
 * Requirements: 5.1, 5.2
 */
export interface MetalDepositCreate {
  metal_id: number
  quantity_grams: number
  notes?: string
}

export interface Order {
  id: number
  tenant_id: number
  order_number: string
  
  // Hierarchical contact system fields
  contact_id: number
  company_id: number
  contact?: ContactSummary  // Nested contact data (Requirement 3.1, 7.3)
  company?: CompanySummary  // Nested company data (Requirement 3.1, 7.3)
  
  // Order details
  order_date?: string
  status: string
  due_date?: string
  
  // New: line items array (Requirement 3.9, 3.10)
  line_items: OrderLineItem[]
  
  // Deprecated: single-line fields (kept for backward compatibility)
  product_description?: string
  specifications?: string
  quantity?: number
  price?: number
  metal_id?: number
  metal_name?: string
  target_weight_per_piece?: number
  initial_total_weight?: number
  labor_cost?: number
  
  created_at: string
  updated_at: string
}

/**
 * Order creation with optional metal deposit
 * Requirements: 3.9, 5.1, 5.2, 5.8
 */
export interface OrderCreateWithDeposit {
  contact_id: number
  due_date?: string
  status?: string
  line_items: OrderLineItemCreate[]
  metal_deposit?: MetalDepositCreate
}

export interface OrderCreate {
  contact_id: number  // Required for new orders
  due_date?: string
  status?: string
  line_items?: OrderLineItemCreate[]
  
  // Deprecated: single-line fields (kept for backward compatibility)
  product_description?: string
  specifications?: string
  quantity?: number
  price?: number
  metal_id?: number
  target_weight_per_piece?: number
  initial_total_weight?: number
  labor_cost?: number
}

export interface OrderUpdate {
  contact_id?: number
  due_date?: string
  status?: string
  line_items?: OrderLineItemCreate[]
  
  // Deprecated: single-line fields (kept for backward compatibility)
  product_description?: string
  specifications?: string
  quantity?: number
  price?: number
  metal_id?: number
  target_weight_per_piece?: number
  initial_total_weight?: number
  labor_cost?: number
}
