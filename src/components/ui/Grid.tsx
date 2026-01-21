import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
}

export function Grid({
  children,
  cols = 1,
  gap = 'md',
  responsive,
  className = '',
  ...props
}: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const responsiveClasses = responsive ? [
    responsive.sm ? `sm:grid-cols-${responsive.sm}` : '',
    responsive.md ? `md:grid-cols-${responsive.md}` : '',
    responsive.lg ? `lg:grid-cols-${responsive.lg}` : '',
    responsive.xl ? `xl:grid-cols-${responsive.xl}` : ''
  ].filter(Boolean).join(' ') : '';

  const gridClasses = [
    'grid',
    colsClasses[cols],
    gapClasses[gap],
    responsiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}

// Grid Item Component
export interface GridItemProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  responsive?: {
    sm?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    md?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    lg?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    xl?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
  };
  className?: string;
}

export function GridItem({
  children,
  colSpan,
  rowSpan,
  responsive,
  className = ''
}: GridItemProps) {
  const colSpanClasses = colSpan ? {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    12: 'col-span-12'
  }[colSpan] : '';

  const rowSpanClasses = rowSpan ? {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6'
  }[rowSpan] : '';

  const responsiveClasses = responsive ? [
    responsive.sm?.colSpan ? `sm:col-span-${responsive.sm.colSpan}` : '',
    responsive.sm?.rowSpan ? `sm:row-span-${responsive.sm.rowSpan}` : '',
    responsive.md?.colSpan ? `md:col-span-${responsive.md.colSpan}` : '',
    responsive.md?.rowSpan ? `md:row-span-${responsive.md.rowSpan}` : '',
    responsive.lg?.colSpan ? `lg:col-span-${responsive.lg.colSpan}` : '',
    responsive.lg?.rowSpan ? `lg:row-span-${responsive.lg.rowSpan}` : '',
    responsive.xl?.colSpan ? `xl:col-span-${responsive.xl.colSpan}` : '',
    responsive.xl?.rowSpan ? `xl:row-span-${responsive.xl.rowSpan}` : ''
  ].filter(Boolean).join(' ') : '';

  const itemClasses = [
    colSpanClasses,
    rowSpanClasses,
    responsiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses}>
      {children}
    </div>
  );
}

// ResponsiveGrid alias for backward compatibility
export interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: number;
  className?: string;
}

export function ResponsiveGrid({ children, columns, className = '' }: ResponsiveGridProps) {
  return (
    <Grid 
      cols={columns as 1 | 2 | 3 | 4 | 5 | 6 | 12} 
      className={className}
      responsive={{
        sm: 1,
        md: Math.min(columns, 2) as 1 | 2,
        lg: Math.min(columns, 4) as 1 | 2 | 3 | 4
      }}
    >
      {children}
    </Grid>
  );
}