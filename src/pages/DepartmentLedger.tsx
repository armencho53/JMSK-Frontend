import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import {
  fetchLedgerEntries,
  fetchLedgerSummary,
  deleteLedgerEntry,
  archiveEntries,
  unarchiveEntry,
  type LedgerFilterParams,
} from '../lib/ledgerApi'
import type { LedgerEntry } from '../types/ledger'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import LedgerEntryFormModal from '../components/LedgerEntryFormModal'

interface Department {
  id: number
  name: string
  is_active: boolean
}

interface Order {
  id: number
  order_number: string
}

export default function DepartmentLedger() {
  // Filter state
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
  const [orderId, setOrderId] = useState<number | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [includeArchived, setIncludeArchived] = useState(false)

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null)

  // Archive modal state
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [archiveDateFrom, setArchiveDateFrom] = useState('')
  const [archiveDateTo, setArchiveDateTo] = useState('')

  const queryClient = useQueryClient()

  useEffect(() => {
    document.title = 'Department Ledger - JMSK'
  }, [])

  // Fetch departments for filter dropdown
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/departments/')
      return response.data as Department[]
    },
  })

  // Fetch orders for filter dropdown
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data as Order[]
    },
  })

  // Build filter params
  const filterParams: LedgerFilterParams = useMemo(() => {
    const params: LedgerFilterParams = {}
    if (departmentId) params.department_id = departmentId
    if (orderId) params.order_id = orderId
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    if (includeArchived) params.include_archived = true
    return params
  }, [departmentId, orderId, dateFrom, dateTo, includeArchived])

  // Fetch ledger entries
  const {
    data: entries,
    isLoading: entriesLoading,
    error: entriesError,
  } = useQuery({
    queryKey: ['ledger-entries', filterParams],
    queryFn: () => fetchLedgerEntries(filterParams),
  })

  // Fetch summary
  const { data: summary } = useQuery({
    queryKey: ['ledger-summary', departmentId],
    queryFn: () => fetchLedgerSummary(departmentId),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLedgerEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger-entries'] })
      queryClient.invalidateQueries({ queryKey: ['ledger-summary'] })
      showSuccessToast('Entry deleted')
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.detail || 'Failed to delete entry')
    },
  })

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: archiveEntries,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ledger-entries'] })
      showSuccessToast(`${data.count} entries archived`)
      setIsArchiveModalOpen(false)
      setArchiveDateFrom('')
      setArchiveDateTo('')
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.detail || 'Failed to archive entries')
    },
  })

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: unarchiveEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger-entries'] })
      showSuccessToast('Entry unarchived')
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.detail || 'Failed to unarchive entry')
    },
  })

  // Compute totals for the footer row
  const totals = useMemo(() => {
    if (!entries || entries.length === 0) return null
    return entries.reduce(
      (acc, entry) => ({
        qtyIn: acc.qtyIn + (entry.qty_in ?? 0),
        weightIn: acc.weightIn + (entry.weight_in ?? 0),
        qtyOut: acc.qtyOut + (entry.qty_out ?? 0),
        weightOut: acc.weightOut + (entry.weight_out ?? 0),
        fineWeight: acc.fineWeight + entry.fine_weight,
      }),
      { qtyIn: 0, weightIn: 0, qtyOut: 0, weightOut: 0, fineWeight: 0 }
    )
  }, [entries])

  const handleEdit = (entry: LedgerEntry) => {
    setEditingEntry(entry)
    setIsFormModalOpen(true)
  }

  const handleDelete = (entry: LedgerEntry) => {
    if (window.confirm(`Delete this ledger entry?`)) {
      deleteMutation.mutate(entry.id)
    }
  }

  const handleAddEntry = () => {
    setEditingEntry(null)
    setIsFormModalOpen(true)
  }

  const handleModalClose = () => {
    setIsFormModalOpen(false)
    setEditingEntry(null)
  }

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['ledger-entries'] })
    queryClient.invalidateQueries({ queryKey: ['ledger-summary'] })
    setIsFormModalOpen(false)
    setEditingEntry(null)
  }

  const handleArchiveSubmit = () => {
    if (!archiveDateFrom || !archiveDateTo) return
    archiveMutation.mutate({ date_from: archiveDateFrom, date_to: archiveDateTo })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  const formatWeight = (value: number) => `${value.toFixed(3)}g`

  // Loading state
  if (entriesLoading) {
    return (
      <Container size="full" padding="md">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading ledger...</p>
        </div>
      </Container>
    )
  }

  // Error state
  if (entriesError) {
    return (
      <Container size="full" padding="md">
        <div className="border rounded-md p-4 bg-red-50 border-red-200">
          <p className="text-red-800">Error loading ledger entries. Please try again.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      {/* Page Header (Req 7.1) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Department Ledger</h1>
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setIsArchiveModalOpen(true)}
          >
            Archive Entries
          </Button>
          <Button variant="secondary" size="sm" onClick={handleAddEntry}>
            + Add Entry
          </Button>
        </div>
      </div>

      {/* Filter Bar (Req 7.2, 10.2, 10.3) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={departmentId ?? ''}
              onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Order
            </label>
            <select
              value={orderId ?? ''}
              onChange={(e) => setOrderId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Orders</option>
              {orders?.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
            <span className="text-xs text-slate-500">Show Archived</span>
          </div>
        </div>
      </div>

      {/* Balance Summary Cards (Req 7.3, 7.4) */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Qty Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Qty</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{summary.total_qty_held}</div>
            <div className="text-xs text-slate-400 mt-1">pieces held</div>
            <div className="text-xs text-green-600 mt-1">{summary.total_qty_out} pieces completed</div>
          </div>
          {/* Metal balance cards — only non-zero (Req 6.2) */}
          {summary.balances.map((balance) => (
            <div key={balance.metal_id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {balance.metal_name}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  balance.fine_weight_balance < 0 ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                {balance.fine_weight_balance.toFixed(3)}g
              </div>
              <div className="text-xs text-slate-400 mt-1">fine weight</div>
            </div>
          ))}
        </div>
      )}

      {/* Ledger Table (Req 7.5, 7.6, 7.7, 7.8, 7.9, 10.6) */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Metal Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-green-50 border-l border-green-200">Qty In</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-green-50">Weight In</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-red-50 border-l border-red-200">Qty Out</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-red-50">Weight Out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-l border-slate-200">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-amber-50 border-l border-amber-200">Fine Weight</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border-l border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {entries && entries.length > 0 ? (
                entries.map((entry) => {
                  const isArchived = entry.is_archived
                  const textClass = isArchived ? 'text-slate-400' : ''
                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-slate-50 transition-colors ${isArchived ? 'opacity-60' : ''}`}
                    >
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${isArchived ? 'text-slate-400' : 'text-slate-600'}`}>
                        {formatDate(entry.date)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${isArchived ? 'text-slate-400' : 'text-slate-900'}`}>
                        {entry.order_number}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isArchived
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {entry.metal_name || entry.metal_code}
                        </span>
                      </td>
                      {/* IN columns (Req 7.6) */}
                      <td className={`px-4 py-3 text-sm text-right border-l border-green-100 ${
                        entry.direction === 'IN'
                          ? `bg-green-50/50 font-medium ${isArchived ? 'text-slate-400' : 'text-green-700'}`
                          : `bg-green-50/50 ${textClass || 'text-slate-400'}`
                      }`}>
                        {entry.qty_in != null ? entry.qty_in : '—'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        entry.direction === 'IN'
                          ? `bg-green-50/50 font-medium ${isArchived ? 'text-slate-400' : 'text-green-700'}`
                          : `bg-green-50/50 ${textClass || 'text-slate-400'}`
                      }`}>
                        {entry.weight_in != null ? formatWeight(entry.weight_in) : '—'}
                      </td>
                      {/* OUT columns (Req 7.7) */}
                      <td className={`px-4 py-3 text-sm text-right border-l border-red-100 ${
                        entry.direction === 'OUT'
                          ? `bg-red-50/30 font-medium ${isArchived ? 'text-slate-400' : 'text-red-600'}`
                          : `bg-red-50/30 ${textClass || 'text-slate-400'}`
                      }`}>
                        {entry.qty_out != null ? entry.qty_out : '—'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        entry.direction === 'OUT'
                          ? `bg-red-50/30 font-medium ${isArchived ? 'text-slate-400' : 'text-red-600'}`
                          : `bg-red-50/30 ${textClass || 'text-slate-400'}`
                      }`}>
                        {entry.weight_out != null ? formatWeight(entry.weight_out) : '—'}
                      </td>
                      {/* Notes */}
                      <td className={`px-4 py-3 text-sm border-l border-slate-100 max-w-[200px] truncate ${isArchived ? 'text-slate-400' : 'text-slate-600'}`}>
                        {isArchived && (
                          <span className="inline-block w-2 h-2 rounded-full bg-slate-300 mr-1 align-middle"></span>
                        )}
                        {entry.notes || ''}
                      </td>
                      {/* Fine Weight (Req 7.9) */}
                      <td className={`px-4 py-3 text-sm text-right font-medium bg-amber-50/50 border-l border-amber-100 ${
                        isArchived
                          ? 'text-slate-400'
                          : entry.fine_weight >= 0
                            ? 'text-green-700'
                            : 'text-red-600'
                      }`}>
                        {entry.fine_weight >= 0 ? '+' : '−'}
                        {formatWeight(Math.abs(entry.fine_weight))}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 text-center border-l border-slate-100">
                        {isArchived ? (
                          <button
                            onClick={() => unarchiveMutation.mutate(entry.id)}
                            className="text-slate-400 hover:text-orange-600 text-xs"
                          >
                            Unarchive
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(entry)}
                              className="text-slate-400 hover:text-indigo-600 text-xs mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry)}
                              className="text-slate-400 hover:text-red-600 text-xs"
                            >
                              Del
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">
                    No ledger entries found. Add your first entry to get started.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Totals Footer (Req 7.8) */}
            {totals && (
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr className="font-semibold text-sm">
                  <td className="px-4 py-3 text-slate-700" colSpan={3}>
                    Totals
                  </td>
                  <td className="px-4 py-3 text-right text-green-700 bg-green-50/50 border-l border-green-200">
                    {totals.qtyIn}
                  </td>
                  <td className="px-4 py-3 text-right text-green-700 bg-green-50/50">
                    {formatWeight(totals.weightIn)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 bg-red-50/30 border-l border-red-200">
                    {totals.qtyOut}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 bg-red-50/30">
                    {formatWeight(totals.weightOut)}
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200"></td>
                  <td className="px-4 py-3 text-right text-slate-900 bg-amber-50/50 border-l border-amber-200">
                    {totals.fineWeight >= 0 ? '+' : '−'}
                    {formatWeight(Math.abs(totals.fineWeight))}
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add/Edit Entry Modal (created in task 7.2) */}
      <LedgerEntryFormModal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        entry={editingEntry}
        departmentId={departmentId}
        onSuccess={handleModalSuccess}
      />

      {/* Archive Modal (Req 10.1, 10.2) */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Archive Entries</h2>
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setIsArchiveModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-slate-600">
                Archive all ledger entries within the selected date range. Archived entries are hidden
                from the default view but still count toward department balances.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                  <input
                    type="date"
                    value={archiveDateFrom}
                    onChange={(e) => setArchiveDateFrom(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <input
                    type="date"
                    value={archiveDateTo}
                    onChange={(e) => setArchiveDateTo(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setIsArchiveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleArchiveSubmit}
                disabled={!archiveDateFrom || !archiveDateTo}
                loading={archiveMutation.isPending}
              >
                Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
