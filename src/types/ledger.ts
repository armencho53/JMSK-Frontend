/**
 * Ledger type definitions for the Department Ledger system.
 *
 * Ledger entries track metal moving IN to or OUT of a department,
 * linked to an order. Pure weight is computed server-side using
 * the purity factor from the tenant's metals table.
 *
 * Requirements: 1.1, 1.2, 6.1, 10.1
 */

export interface LedgerEntry {
  id: number
  tenant_id: number
  date: string
  department_id: number
  order_id: number
  order_number: string
  metal_id: number
  metal_code: string
  metal_name: string
  direction: 'IN' | 'OUT'
  qty_in: number | null
  qty_out: number | null
  weight_in: number | null
  weight_out: number | null
  fine_weight: number
  notes: string | null
  is_archived: boolean
  created_by: number
  created_at: string
  updated_at: string
}

export interface LedgerEntryCreate {
  date: string
  department_id: number
  order_id: number
  metal_id: number
  direction: 'IN' | 'OUT'
  quantity: number
  weight: number
  notes?: string
}

export interface LedgerEntryUpdate {
  date?: string
  department_id?: number
  order_id?: number
  metal_id?: number
  direction?: 'IN' | 'OUT'
  quantity?: number
  weight?: number
  notes?: string
}

export interface LedgerSummary {
  total_qty_held: number
  total_qty_out: number
  balances: MetalBalanceItem[]
}

export interface MetalBalanceItem {
  metal_id: number
  metal_name: string
  fine_weight_balance: number
}

export interface ArchiveRequest {
  date_from: string
  date_to: string
}
