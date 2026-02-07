/**
 * Company type definitions for hierarchical contact system
 * 
 * Companies are parent entities that have multiple contacts.
 * Company balance is aggregated from all orders across all contacts.
 * 
 * Requirements: 2.1, 6.2
 */

import { ContactSummary } from './contact'
import { OrderSummary } from './contact'

export interface Company {
  id: number
  tenant_id: number
  name: string
  email?: string
  phone?: string
  address?: string
  total_balance?: number
  created_at: string
  updated_at: string
}

export interface CompanyCreate {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface CompanyUpdate {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface CompanyWithContacts extends Company {
  contacts?: ContactSummary[]
  contact_count?: number
}

export interface CompanyDetail extends Company {
  contacts: ContactSummary[]
  orders: OrderSummary[]
  statistics?: CompanyStatistics
}

export interface CompanyStatistics {
  company_id: number
  total_balance: number
  contact_count: number
  order_count: number
  average_order_value: number
}

export interface BalanceBreakdown {
  total: number
  pending: number
  completed: number
}
