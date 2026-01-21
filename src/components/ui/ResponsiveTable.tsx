import React, { useState, useMemo } from 'react';
import { Table, TableColumn, TableProps } from './Table';

export interface ResponsiveTableProps<T = any> extends Omit<TableProps<T>, 'responsive'> {
  mobileView?: 'stack' | 'scroll' | 'cards';
  tabletColumns?: string[]; // Column keys to show on tablet
  desktopEnhancements?: {
    stickyHeader?: boolean;
    virtualScrolling?: boolean;
    columnResizing?: boolean;
    advancedFiltering?: boolean;
  };
}

export function ResponsiveTable<T = any>({
  columns,
  data,
  mobileView = 'scroll',
  tabletColumns,
  desktopEnhancements = {},
  className = '',
  ...props
}: ResponsiveTableProps<T>) {
  const [columnWidths] = useState<Record<string, number>>({});

  // Filter columns based on screen size
  const getResponsiveColumns = (): TableColumn<T>[] => {
    // For mobile, show only essential columns or use card view
    if (mobileView === 'cards') {
      return columns.filter(col => col.responsive === 'always' || !col.responsive);
    }

    // For tablet, show specified columns or default subset
    if (tabletColumns) {
      return columns.filter(col => 
        tabletColumns.includes(col.key) || 
        col.responsive === 'always'
      );
    }

    return columns;
  };

  const responsiveColumns = getResponsiveColumns();

  // Desktop enhancements
  const enhancedColumns = useMemo(() => {
    if (!desktopEnhancements.columnResizing) {
      return responsiveColumns;
    }

    return responsiveColumns.map(col => ({
      ...col,
      width: columnWidths[col.key] || col.width,
      resizable: true
    }));
  }, [responsiveColumns, columnWidths, desktopEnhancements.columnResizing]);

  // Professional theme classes
  const themeClasses = {
    mobileCard: 'bg-white border border-slate-200 shadow-sm',
    cardHeader: 'text-slate-900 border-slate-200',
    cardContent: 'text-slate-700'
  };

  // Mobile card view renderer
  const renderMobileCards = () => {
    if (mobileView !== 'cards') return null;

    return (
      <div className="block md:hidden space-y-4">
        {data.map((record, index) => {
          const key = typeof props.rowKey === 'function' 
            ? props.rowKey(record) 
            : (record as any)[props.rowKey || 'id'] || index;

          return (
            <div
              key={key}
              className={`${themeClasses.mobileCard} rounded-lg p-4 space-y-3`}
            >
              {columns.map((column) => {
                if (column.responsive === 'desktop') return null;

                const value = column.dataIndex 
                  ? (record as any)[column.dataIndex] 
                  : record;

                const renderedValue = column.render 
                  ? column.render(value, record, index)
                  : value;

                return (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className={`font-medium text-sm ${themeClasses.cardHeader}`}>
                      {column.title}:
                    </span>
                    <span className={`text-sm text-right ${themeClasses.cardContent}`}>
                      {renderedValue}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Desktop table with enhancements
  const renderDesktopTable = () => {
    const tableClassName = [
      mobileView === 'cards' ? 'hidden md:block' : '',
      mobileView === 'scroll' ? 'table-mobile' : '',
      desktopEnhancements.stickyHeader ? 'sticky-header' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <Table
        {...props}
        columns={enhancedColumns}
        data={data}
        className={tableClassName}
        responsive={mobileView === 'scroll'}
      />
    );
  };

  return (
    <div className="w-full">
      {renderMobileCards()}
      {renderDesktopTable()}
    </div>
  );
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  className?: string;
  itemsPerRow?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  renderCard: (item: T, index: number) => React.ReactNode;
}

export function DataGrid<T = any>({
  data,
  loading = false,
  className = '',
  itemsPerRow = { mobile: 1, tablet: 2, desktop: 3 },
  renderCard
}: DataGridProps<T>) {

  const getGridClasses = () => {
    return `
      grid gap-4 md:gap-6
      grid-cols-${itemsPerRow.mobile}
      md:grid-cols-${itemsPerRow.tablet}
      lg:grid-cols-${itemsPerRow.desktop}
    `;
  };

  if (loading) {
    return (
      <div className={`${getGridClasses()} ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-slate-200 rounded-lg h-32"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="desktop-hover-lift">
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
}

// Enhanced table with desktop-specific features
export interface DesktopTableProps<T = any> extends TableProps<T> {
  stickyHeader?: boolean;
  columnResizing?: boolean;
  advancedSorting?: boolean;
  bulkActions?: Array<{
    label: string;
    action: (selectedRows: T[]) => void;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }>;
}

export function DesktopTable<T = any>({
  stickyHeader = false,
  columnResizing = false,
  advancedSorting = false,
  bulkActions = [],
  className = '',
  ...props
}: DesktopTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const enhancedClassName = [
    className,
    stickyHeader ? 'sticky-header-table' : '',
    'hidden md:block' // Only show on desktop
  ].filter(Boolean).join(' ');

  const rowSelection = props.rowSelection || {
    selectedRowKeys: selectedRows.map((_, index) => index),
    onChange: (_keys: (string | number)[], rows: T[]) => {
      setSelectedRows(rows);
    }
  };

  return (
    <div className="desktop-table-container">
      {/* Bulk actions toolbar */}
      {bulkActions.length > 0 && selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 theme-border-radius">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedRows.length} item(s) selected
            </span>
            <div className="flex space-x-2">
              {bulkActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => action.action(selectedRows)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors duration-200"
                  >
                    {Icon && <Icon className="h-4 w-4 mr-1" />}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Table
        {...props}
        className={enhancedClassName}
        rowSelection={rowSelection}
      />
    </div>
  );
}