import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
  ...props
}: CardProps) {

  // Professional card styling with clean modern design
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return [
          'bg-white border border-slate-200 shadow-md',
          hoverable ? 'hover:shadow-lg' : ''
        ].filter(Boolean).join(' ');
      case 'outlined':
        return 'bg-transparent border-2 border-slate-300';
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border border-slate-200/50';
      case 'default':
      default:
        return 'bg-white border border-slate-200';
    }
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const variantClasses = getVariantClasses();
  const cardClasses = [
    'rounded-lg transition-all duration-200', // Clean modern border radius
    paddingClasses[padding],
    onClick ? 'cursor-pointer' : '',
    hoverable ? 'hover:shadow-lg' : '',
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div 
      className={`pb-4 mb-4 border-b border-slate-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className = '', as: Component = 'h3', ...props }: CardTitleProps) {
  return (
    <Component 
      className={`font-semibold text-lg text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function CardContent({ children, className = '', padding = 'md', ...props }: CardContentProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Card Footer Component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div 
      className={`pt-4 mt-4 border-t border-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}