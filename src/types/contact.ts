/**
 * Contact type definitions for hierarchical contact system
 * 
 * Contacts are individuals who work for companies and can place orders.
 * Every contact must belong to exactly one company.
 * 
 * Requirements: 1.1, 6.2
 */

export interface CompanySummary {
  id: number
  name: string
  email?: string
  phone?: string
}

export interface Contact {
  id: number
  tenant_id: number
  company_id: number
  name: string
  email?: string
  phone?: string
  company?: CompanySummary
  created_at: string
  updated_at: string
}

export interface ContactCreate {
  company_id: number
  name: string
  email?: string
  phone?: string
}

export interface ContactUpdate {
  company_id?: number
  name?: string
  email?: string
  phone?: string
}

export interface ContactSummary {
  id: number
  name: string
  email?: string
  phone?: string
}

export interface ContactWithOrders extends Contact {
  orders: OrderSummary[]
  order_count?: number
}

// Order summary for contact detail views
export interface OrderSummary {
  id: number
  order_number: string
  product_description?: string
  quantity: number
  price?: number
  status: string
  due_date?: string
  created_at: string
}
