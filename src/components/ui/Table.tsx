import React, { useState, useMemo } from 'react';

// Table Types
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  responsive?: 'always' | 'desktop' | 'tablet';
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  };
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  responsive?: boolean;
  emptyText?: string;
  rowKey?: string | ((record: T) => string | number);
}

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

// Sort utilities
type SortOrder = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  order: SortOrder;
}

// Table Component
export function Table<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  pagination,
  rowSelection,
  onRow,
  className = '',
  size = 'md',
  bordered = false,
  hoverable = true,
  striped = false,
  responsive = true,
  emptyText = 'No data available',
  rowKey = 'id'
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ key: null, order: null });

  // Get row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as Record<string, unknown>)[rowKey] as string | number || index;
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortState(prev => {
      if (prev.key === columnKey) {
        // Cycle through: asc -> desc -> null
        const nextOrder = prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc';
        return { key: nextOrder ? columnKey : null, order: nextOrder };
      } else {
        return { key: columnKey, order: 'asc' };
      }
    });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.order) return data;

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = column.dataIndex ? (a as Record<string, unknown>)[column.dataIndex] : a;
      const bValue = column.dataIndex ? (b as Record<string, unknown>)[column.dataIndex] : b;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortState.order === 'desc' ? -comparison : comparison;
    });
  }, [data, sortState, columns]);

  // Professional theme classes
  const themeClasses = {
    table: 'bg-white border-slate-200',
    header: 'bg-slate-50 text-slate-900',
    headerCell: 'border-slate-200 text-slate-900',
    row: 'border-slate-200 text-slate-900',
    rowHover: 'hover:bg-slate-50',
    rowSelected: 'bg-slate-100',
    rowStriped: 'odd:bg-white even:bg-slate-50'
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const cellPaddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4'
  };

  // Responsive column filtering
  const getVisibleColumns = () => {
    if (!responsive) return columns;
    
    // For mobile, show only 'always' responsive columns
    // This is a simplified approach - in a real app you'd use media queries
    return columns.filter(col => 
      !col.responsive || 
      col.responsive === 'always' || 
      (typeof window !== 'undefined' && window.innerWidth >= 768)
    );
  };

  const visibleColumns = getVisibleColumns();

  // Render sort icon
  const renderSortIcon = (columnKey: string) => {
    if (sortState.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortState.order === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    if (sortState.order === 'desc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }

    return null;
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(
        column.dataIndex ? (record as Record<string, unknown>)[column.dataIndex] : record,
        record,
        index
      );
    }

    if (column.dataIndex) {
      return (record as Record<string, unknown>)[column.dataIndex];
    }

    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`${themeClasses.table} rounded-lg overflow-hidden shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className={`${themeClasses.header} ${cellPaddingClasses[size]}`}>
            <div className="flex space-x-4">
              {visibleColumns.map((_, index) => (
                <div key={index} className="h-4 bg-slate-300 rounded flex-1"></div>
              ))}
            </div>
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={`${themeClasses.row} border-t ${cellPaddingClasses[size]}`}>
              <div className="flex space-x-4">
                {visibleColumns.map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-slate-200 rounded flex-1"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`${themeClasses.table} rounded-lg overflow-hidden shadow-sm ${className}`} role="region" aria-label="Data table">
        <table className="min-w-full" role="table" aria-label="Empty data table">
          <thead className={themeClasses.header}>
            <tr role="row">
              {rowSelection && (
                <th 
                  className={`${cellPaddingClasses[size]} ${themeClasses.headerCell} ${bordered ? 'border' : ''}`}
                  role="columnheader"
                  aria-label="Select all rows"
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    disabled
                    aria-label="Select all (disabled - no data)"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`${cellPaddingClasses[size]} ${themeClasses.headerCell} ${bordered ? 'border' : ''} text-${column.align || 'left'} font-medium ${sizeClasses[size]}`}
                  style={{ width: column.width }}
                  role="columnheader"
                  scope="col"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr role="row">
              <td
                colSpan={visibleColumns.length + (rowSelection ? 1 : 0)}
                className={`${cellPaddingClasses[size]} text-center ${themeClasses.row} ${sizeClasses[size]}`}
                role="cell"
              >
                {emptyText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const tableId = `table-${Math.random().toString(36).substr(2, 9)}`;
  const captionId = `${tableId}-caption`;

  return (
    <div className={className}>
      <div className={`${themeClasses.table} rounded-lg overflow-hidden shadow-sm ${bordered ? 'border' : ''}`} role="region" aria-labelledby={captionId}>
        <table className="min-w-full" role="table" aria-labelledby={captionId}>
          <caption id={captionId} className="sr-only">
            Data table with {data.length} rows and {visibleColumns.length} columns
            {sortState.key && `, sorted by ${visibleColumns.find(col => col.key === sortState.key)?.title} ${sortState.order === 'asc' ? 'ascending' : 'descending'}`}
          </caption>
          <thead className={themeClasses.header}>
            <tr role="row">
              {rowSelection && (
                <th 
                  className={`${cellPaddingClasses[size]} ${themeClasses.headerCell} ${bordered ? 'border' : ''}`}
                  role="columnheader"
                  scope="col"
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={rowSelection.selectedRowKeys.length === data.length && data.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allKeys = data.map((record, index) => getRowKey(record, index));
                        rowSelection.onChange(allKeys, data);
                      } else {
                        rowSelection.onChange([], []);
                      }
                    }}
                    aria-label={`Select all ${data.length} rows`}
                    aria-describedby={`${tableId}-select-all-description`}
                  />
                  <div id={`${tableId}-select-all-description`} className="sr-only">
                    {rowSelection.selectedRowKeys.length === data.length && data.length > 0 
                      ? 'All rows selected' 
                      : `${rowSelection.selectedRowKeys.length} of ${data.length} rows selected`}
                  </div>
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`${cellPaddingClasses[size]} ${themeClasses.headerCell} ${bordered ? 'border' : ''} text-${column.align || 'left'} font-medium ${sizeClasses[size]} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  role="columnheader"
                  scope="col"
                  aria-sort={
                    sortState.key === column.key 
                      ? sortState.order === 'asc' ? 'ascending' : 'descending'
                      : column.sortable ? 'none' : undefined
                  }
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span aria-hidden="true">
                        {renderSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                  {column.sortable && (
                    <span className="sr-only">
                      {sortState.key === column.key 
                        ? `Sorted ${sortState.order === 'asc' ? 'ascending' : 'descending'}. Click to sort ${sortState.order === 'asc' ? 'descending' : 'ascending'}.`
                        : 'Click to sort this column'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = rowSelection?.selectedRowKeys.includes(key);
              const rowProps = onRow?.(record, index) || {};
              
              return (
                <tr
                  key={key}
                  className={`
                    ${themeClasses.row} 
                    ${bordered ? 'border-t' : 'border-t'} 
                    ${hoverable ? themeClasses.rowHover : ''} 
                    ${isSelected ? themeClasses.rowSelected : ''} 
                    ${striped ? themeClasses.rowStriped : ''} 
                    ${rowProps.className || ''} 
                    ${rowProps.onClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={rowProps.onClick}
                  onDoubleClick={rowProps.onDoubleClick}
                  role="row"
                  aria-selected={isSelected}
                  tabIndex={rowProps.onClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (rowProps.onClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      rowProps.onClick();
                    }
                  }}
                >
                  {rowSelection && (
                    <td className={`${cellPaddingClasses[size]} ${bordered ? 'border' : ''}`} role="cell">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={isSelected}
                        onChange={(e) => {
                          const newSelectedKeys = e.target.checked
                            ? [...rowSelection.selectedRowKeys, key]
                            : rowSelection.selectedRowKeys.filter(k => k !== key);
                          const newSelectedRows = data.filter((_, i) => 
                            newSelectedKeys.includes(getRowKey(data[i], i))
                          );
                          rowSelection.onChange(newSelectedKeys, newSelectedRows);
                        }}
                        aria-label={`Select row ${index + 1}`}
                        {...(rowSelection.getCheckboxProps?.(record) || {})}
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`${cellPaddingClasses[size]} ${bordered ? 'border' : ''} text-${column.align || 'left'} ${sizeClasses[size]}`}
                      style={{ width: column.width }}
                      role="cell"
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger={pagination.showSizeChanger}
          pageSizeOptions={pagination.pageSizeOptions}
          className="mt-4"
        />
      )}
    </div>
  );
}

// Pagination Component
export function Pagination({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  className = ''
}: PaginationProps) {

  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  // Professional theme classes
  const themeClasses = {
    container: 'text-slate-900',
    button: 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50',
    buttonActive: 'bg-slate-900 border-slate-900 text-white',
    buttonDisabled: 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed',
    select: 'bg-white border-slate-300 text-slate-900'
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newPage = Math.ceil(startItem / newPageSize);
    onChange(newPage, newPageSize);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm border rounded-md ${
            i === current ? themeClasses.buttonActive : themeClasses.button
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={i === current ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const paginationId = `pagination-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <nav 
      className={`flex items-center justify-between ${themeClasses.container} ${className}`}
      role="navigation"
      aria-label="Table pagination"
    >
      <div className="flex items-center space-x-2 text-sm">
        <span aria-live="polite" aria-atomic="true">
          Showing {startItem} to {endItem} of {total} entries
        </span>
        {showSizeChanger && (
          <>
            <span aria-hidden="true">•</span>
            <label htmlFor={`${paginationId}-pagesize`} className="sr-only">
              Items per page
            </label>
            <select
              id={`${paginationId}-pagesize`}
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className={`px-2 py-1 text-sm border rounded-md ${themeClasses.select}`}
              aria-label="Items per page"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="flex items-center space-x-1" role="group" aria-label="Pagination controls">
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className={`px-3 py-2 text-sm border rounded-md ${
            current === 1 ? themeClasses.buttonDisabled : themeClasses.button
          }`}
          aria-label="Go to previous page"
          aria-disabled={current === 1}
        >
          Previous
        </button>
        
        {renderPageNumbers()}
        
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className={`px-3 py-2 text-sm border rounded-md ${
            current === totalPages ? themeClasses.buttonDisabled : themeClasses.button
          }`}
          aria-label="Go to next page"
          aria-disabled={current === totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
}