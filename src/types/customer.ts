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

export interface CustomerDetail extends Customer {
  orders: OrderSummary[]
  shipments: ShipmentSummary[]
  balance_breakdown?: BalanceBreakdown
}

export interface CustomerSummary {
  id: number
  name: string
  email: string
  phone?: string
}

export interface CompanyDetail extends Company {
  customers: CustomerSummary[]
}
