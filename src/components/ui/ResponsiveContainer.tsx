import React from 'react';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'responsive';
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  size = 'desktop',
  padding = 'responsive'
}: ResponsiveContainerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'mobile':
        return 'max-w-mobile';
      case 'tablet':
        return 'max-w-tablet';
      case 'desktop':
        return 'max-w-desktop';
      case 'wide':
        return 'max-w-wide';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-desktop';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-4';
      case 'md':
        return 'px-6';
      case 'lg':
        return 'px-8';
      case 'responsive':
        return 'padding-mobile';
      default:
        return 'padding-mobile';
    }
  };

  return (
    <div className={`
      w-full mx-auto
      ${getSizeClasses()}
      ${getPaddingClasses()}
      ${className}
    `}>
      {children}
    </div>
  );
}

export interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  type?: 'default' | 'cards';
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  className = '', 
  type = 'default',
  gap = 'md'
}: ResponsiveGridProps) {
  const getGridClasses = () => {
    const baseClass = type === 'cards' ? 'grid-mobile-cards' : 'grid-mobile';
    
    const gapClasses = {
      sm: 'gap-2 sm:gap-3 lg:gap-4',
      md: 'gap-4 sm:gap-6 lg:gap-8',
      lg: 'gap-6 sm:gap-8 lg:gap-12'
    };
    
    return `${baseClass} ${gapClasses[gap]}`;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}

export interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function ResponsiveStack({ 
  children, 
  className = '', 
  spacing = 'md',
  align = 'stretch'
}: ResponsiveStackProps) {
  const getSpacingClass = () => {
    switch (spacing) {
      case 'xs':
        return 'space-mobile-xs';
      case 'sm':
        return 'space-mobile-sm';
      case 'md':
        return 'space-mobile-md';
      case 'lg':
        return 'space-mobile-lg';
      case 'xl':
        return 'space-mobile-xl';
      default:
        return 'space-mobile-md';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'start':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'end':
        return 'items-end';
      case 'stretch':
        return 'items-stretch';
      default:
        return 'items-stretch';
    }
  };

  return (
    <div className={`
      flex flex-col
      ${getSpacingClass()}
      ${getAlignClass()}
      ${className}
    `}>
      {children}
    </div>
  );
}

export interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'lg';
  as?: 'button' | 'div' | 'a';
  onClick?: () => void;
  href?: string;
}

export function TouchTarget({ 
  children, 
  className = '', 
  size = 'default',
  as = 'button',
  onClick,
  href
}: TouchTargetProps) {
  const touchClass = size === 'lg' ? 'touch-target-lg' : 'touch-target';
  
  const Component = as;
  
  const props: any = {
    className: `${touchClass} ${className}`,
    onClick
  };
  
  if (as === 'a' && href) {
    props.href = href;
  }

  return (
    <Component {...props}>
      {children}
    </Component>
  );
}