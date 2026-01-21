import React from 'react';

export interface DesktopLayoutProps {
  children: React.ReactNode;
  className?: string;
  type?: 'sidebar' | 'grid' | 'columns' | 'dashboard';
  sidebar?: React.ReactNode;
  maxWidth?: 'desktop' | 'desktop-sm' | 'desktop-lg' | 'desktop-xl' | 'wide';
}

export function DesktopLayout({ 
  children, 
  className = '', 
  type = 'grid',
  sidebar,
  maxWidth = 'desktop-lg'
}: DesktopLayoutProps) {
  // Professional theme only - no need to access currentTheme

  const getLayoutClasses = () => {
    switch (type) {
      case 'sidebar':
        return 'desktop-sidebar-layout';
      case 'grid':
        return 'desktop-grid';
      case 'columns':
        return 'desktop-columns';
      case 'dashboard':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6';
      default:
        return 'desktop-grid';
    }
  };

  const getThemeClasses = () => {
    // Always use professional theme
    return {
      container: 'bg-slate-50',
      sidebar: 'bg-white shadow-sm rounded-lg'
    };
  };

  const themeClasses = getThemeClasses();

  if (type === 'sidebar' && sidebar) {
    return (
      <div className={`w-full mx-auto max-w-${maxWidth} desktop-padding ${className}`}>
        <div className={getLayoutClasses()}>
          <aside className={`${themeClasses.sidebar} p-6`}>
            {sidebar}
          </aside>
          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto max-w-${maxWidth} desktop-padding ${className}`}>
      <div className={getLayoutClasses()}>
        {children}
      </div>
    </div>
  );
}

export interface TabletLayoutProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
  gap?: 'sm' | 'md' | 'lg';
}

export function TabletLayout({ 
  children, 
  className = '', 
  columns = 2,
  gap = 'md'
}: TabletLayoutProps) {
  const getGridClasses = () => {
    const gapClasses = {
      sm: 'gap-3 md:gap-4',
      md: 'gap-4 md:gap-6',
      lg: 'gap-6 md:gap-8'
    };

    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    };

    return `grid ${columnClasses[columns]} ${gapClasses[gap]}`;
  };

  return (
    <div className={`tablet-spacing ${className}`}>
      <div className={getGridClasses()}>
        {children}
      </div>
    </div>
  );
}

export interface DesktopCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function DesktopCard({ 
  children, 
  className = '', 
  hover = true,
  interactive = false,
  padding = 'md'
}: DesktopCardProps) {
  // Professional theme only - no need to access currentTheme

  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-4 lg:p-5';
      case 'md':
        return 'p-6 lg:p-8';
      case 'lg':
        return 'p-8 lg:p-10';
      default:
        return 'p-6 lg:p-8';
    }
  };

  const getThemeClasses = () => {
    // Always use professional theme
    return 'bg-white border border-slate-200 shadow-sm';
  };

  const hoverClass = hover ? 'desktop-hover-lift' : '';
  const interactiveClass = interactive ? 'cursor-pointer desktop-hover-scale' : '';

  return (
    <div className={`
      ${getThemeClasses()}
      ${getPaddingClasses()}
      theme-border-radius
      ${hoverClass}
      ${interactiveClass}
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  );
}

export interface DesktopNavigationProps {
  items: Array<{
    name: string;
    href: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    active?: boolean;
    badge?: number;
  }>;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function DesktopNavigation({ 
  items, 
  className = '', 
  orientation = 'horizontal'
}: DesktopNavigationProps) {
  // Professional theme only - no need to access currentTheme

  const getThemeClasses = () => {
    // Always use professional theme
    return {
      item: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
      itemActive: 'text-slate-900 bg-slate-100',
      badge: 'bg-orange-500 text-white'
    };
  };

  const themeClasses = getThemeClasses();
  const orientationClass = orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-1';

  return (
    <nav className={`flex ${orientationClass} ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        
        return (
          <a
            key={item.name}
            href={item.href}
            className={`
              desktop-nav-item relative
              ${item.active ? themeClasses.itemActive : themeClasses.item}
            `}
          >
            {Icon && (
              <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <span>{item.name}</span>
            {item.badge && (
              <span className={`
                ml-2 px-2 py-1 text-xs rounded-full
                ${themeClasses.badge}
              `}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}

export interface AdvancedInteractionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'lift' | 'scale' | 'glow' | 'tilt';
  disabled?: boolean;
}

export function AdvancedInteraction({ 
  children, 
  className = '', 
  type = 'lift',
  disabled = false
}: AdvancedInteractionProps) {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const getInteractionClass = () => {
    switch (type) {
      case 'lift':
        return 'desktop-hover-lift';
      case 'scale':
        return 'desktop-hover-scale';
      case 'glow':
        return 'hover:shadow-2xl transition-shadow duration-300';
      case 'tilt':
        return 'hover:rotate-1 transition-transform duration-200';
      default:
        return 'desktop-hover-lift';
    }
  };

  return (
    <div className={`${getInteractionClass()} ${className}`}>
      {children}
    </div>
  );
}