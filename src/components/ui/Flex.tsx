import React from 'react';

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: {
      direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
      align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
      justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    };
    md?: {
      direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
      align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
      justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    };
    lg?: {
      direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
      align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
      justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    };
  };
  className?: string;
}

export function Flex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'none',
  responsive,
  className = ''
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
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

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const responsiveClasses = responsive ? [
    responsive.sm?.direction ? `sm:${directionClasses[responsive.sm.direction]}` : '',
    responsive.sm?.align ? `sm:${alignClasses[responsive.sm.align]}` : '',
    responsive.sm?.justify ? `sm:${justifyClasses[responsive.sm.justify]}` : '',
    responsive.md?.direction ? `md:${directionClasses[responsive.md.direction]}` : '',
    responsive.md?.align ? `md:${alignClasses[responsive.md.align]}` : '',
    responsive.md?.justify ? `md:${justifyClasses[responsive.md.justify]}` : '',
    responsive.lg?.direction ? `lg:${directionClasses[responsive.lg.direction]}` : '',
    responsive.lg?.align ? `lg:${alignClasses[responsive.lg.align]}` : '',
    responsive.lg?.justify ? `lg:${justifyClasses[responsive.lg.justify]}` : ''
  ].filter(Boolean).join(' ') : '';

  const flexClasses = [
    'flex',
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    wrapClasses[wrap],
    gapClasses[gap],
    responsiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
}