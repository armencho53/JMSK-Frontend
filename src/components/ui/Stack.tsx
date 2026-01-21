import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export function Stack({
  children,
  spacing = 'md',
  align = 'stretch',
  className = ''
}: StackProps) {
  const spacingClasses = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const stackClasses = [
    'flex flex-col',
    spacingClasses[spacing],
    alignClasses[align],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
}

// Horizontal Stack (HStack)
export interface HStackProps {
  children: React.ReactNode;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
}

export function HStack({
  children,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  className = ''
}: HStackProps) {
  const spacingClasses = {
    none: 'space-x-0',
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const stackClasses = [
    'flex',
    wrap ? 'flex-wrap' : 'flex-nowrap',
    spacingClasses[spacing],
    alignClasses[align],
    justifyClasses[justify],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
}