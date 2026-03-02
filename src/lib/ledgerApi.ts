/**
 * Department Ledger API functions.
 *
 * All functions use the shared Axios instance from lib/api.ts which
 * handles auth tokens, base URL, and error interceptors.
 *
 * Requirements: 1.1, 4.1, 6.1, 10.1
 */

import { api } from './api'
import type {
  LedgerEntry,
  LedgerEntryCreate,
  LedgerEntryUpdate,
  LedgerSummary,
  ArchiveRequest,
} from '../types/ledger'

const BASE = '/department-ledger'

export interface LedgerFilterParams {
  department_id?: number
  order_id?: number
  date_from?: string
  date_to?: string
  include_archived?: boolean
}

export const fetchLedgerEntries = async (
  filters?: LedgerFilterParams
): Promise<LedgerEntry[]> => {
  const response = await api.get(BASE + '/', { params: filters })
  return response.data
}

export const createLedgerEntry = async (
  data: LedgerEntryCreate
): Promise<LedgerEntry> => {
  const response = await api.post(BASE + '/', data)
  return response.data
}

export const updateLedgerEntry = async (
  entryId: number,
  data: LedgerEntryUpdate
): Promise<LedgerEntry> => {
  const response = await api.put(`${BASE}/${entryId}`, data)
  return response.data
}

export const deleteLedgerEntry = async (entryId: number): Promise<void> => {
  await api.delete(`${BASE}/${entryId}`)
}

export const fetchLedgerSummary = async (
  departmentId?: number
): Promise<LedgerSummary> => {
  const params = departmentId != null ? { department_id: departmentId } : undefined
  const response = await api.get(BASE + '/summary', { params })
  return response.data
}

export const archiveEntries = async (
  data: ArchiveRequest
): Promise<{ message: string; count: number }> => {
  const response = await api.post(BASE + '/archive', data)
  return response.data
}

export const unarchiveEntry = async (
  entryId: number
): Promise<LedgerEntry> => {
  const response = await api.post(`${BASE}/${entryId}/unarchive`)
  return response.data
}
