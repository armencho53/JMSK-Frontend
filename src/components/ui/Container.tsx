import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  padding = 'md',
  center = true,
  className = '',
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  };

  const containerClasses = [
    'w-full',
    sizeClasses[size],
    paddingClasses[padding],
    center ? 'mx-auto' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

// Section Container for page sections
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'muted' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({
  children,
  className = '',
  background = 'default',
  padding = 'lg'
}: SectionProps) {
  const backgroundClasses = {
    default: '',
    muted: 'theme-bg-neutral',
    accent: 'theme-bg-primary'
  };

  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16'
  };

  const sectionClasses = [
    'w-full',
    backgroundClasses[background],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      {children}
    </section>
  );
}