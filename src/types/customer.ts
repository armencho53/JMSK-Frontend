/**
 * DEPRECATED: Legacy customer types.
 * 
 * These types are being replaced by Contact types as part of the
 * hierarchical contact system migration. Use src/types/contact.ts for all new code.
 * 
 * Migration path: Customer -> Contact
 * See: src/types/contact.ts
 * 
 * @deprecated Use Contact types from src/types/contact.ts instead
 */

/**
 * @deprecated Use Contact from src/types/contact.ts instead
 */
export interface Customer {
  id: number
  tenant_id: number
  name: string
  email: string
  phone?: string
  company_id?: number
  created_at: string
  updated_at: string
  balance?: number
}

/**
 * @deprecated Use Company from src/types/company.ts instead
 */
export interface Company {
  id: number
  tenant_id: number
  name: string
  address?: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface OrderSummary {
  id: number
  order_number: string
  product_description: string
  quantity: number
  price?: number
  status: string
  due_date?: string
  created_at: string
}

export interface ShipmentSummary {
  id: number
  order_id: number
  tracking_number?: string
  carrier?: string
  shipping_address?: string
  status: string
  shipped_at?: string
  delivered_at?: string
}

export interface BalanceBreakdown {
  total: number
  pending: number
  completed: number
}

/**
 * @deprecated Use ContactResponse with order history instead
 */
export interface CustomerDetail extends Customer {
  orders: OrderSummary[]
  shipments: ShipmentSummary[]
  balance_breakdown?: BalanceBreakdown
}

/**
 * @deprecated Use ContactSummary from src/types/contact.ts instead
 */
export interface CustomerSummary {
  id: number
  name: string
  email: string
  phone?: string
}

/**
 * @deprecated Use CompanyWithContacts from src/types/company.ts instead
 */
export interface CompanyDetail extends Company {
  customers: CustomerSummary[]
}
