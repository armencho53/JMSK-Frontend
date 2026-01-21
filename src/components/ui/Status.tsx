import React from 'react';

// Status Badge Component
export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  customColors?: {
    bg: string;
    text: string;
    border?: string;
  };
}

export function StatusBadge({
  status,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  customColors
}: StatusBadgeProps) {

  // Default status color mappings
  const getStatusColors = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');
    
    const statusMap: Record<string, { bg: string; text: string; border?: string }> = {
      // Order statuses
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      inprogress: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      delivered: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      
      // Manufacturing statuses
      casting: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      polishing: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
      stonesetting: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
      finishing: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
      qualitycheck: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      
      // General statuses
      active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      published: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
      
      // Priority levels
      low: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
      urgent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
      critical: { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-300' },
    };

    return statusMap[normalizedStatus] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  };

  // Use consistent colors across all themes
  const getThemeAdjustedColors = (colors: { bg: string; text: string; border?: string }) => {
    // Return the standard colors - the CSS custom properties will handle theming
    return colors;
  };

  const baseColors = customColors || getStatusColors(status);
  const colors = customColors ? baseColors : getThemeAdjustedColors(baseColors);

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'dot':
        return `${colors.bg} ${colors.text} border ${colors.border || ''} relative pl-6`;
      case 'outline':
        return `bg-transparent ${colors.text} border-2 ${colors.border || ''}`;
      case 'default':
      default:
        return `${colors.bg} ${colors.text}`;
    }
  };

  const badgeClasses = [
    'inline-flex items-center font-medium rounded-full',
    sizeClasses[size],
    getVariantClasses(),
    className
  ].join(' ');

  const displayText = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={badgeClasses}>
      {variant === 'dot' && (
        <span className={`absolute left-2 w-2 h-2 rounded-full ${colors.bg.replace('100', '500').replace('800', '400')}`} />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {displayText}
    </span>
  );
}

// Progress Bar Component
export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'animated';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color = 'primary',
  showLabel = false,
  label,
  className = ''
}: ProgressBarProps) {

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Professional theme color styles
  const getColorClasses = () => {
    return {
      primary: 'bg-slate-600',
      secondary: 'bg-orange-500',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
      error: 'bg-red-600',
      info: 'bg-slate-500'
    };
  };

  const colorClasses = getColorClasses();

  // Size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const progressClasses = [
    'transition-all duration-300 ease-out rounded-full',
    colorClasses[color],
    variant === 'striped' ? 'bg-stripes' : '',
    variant === 'animated' ? 'bg-stripes animate-pulse' : ''
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'w-full bg-slate-200 rounded-full overflow-hidden',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{label || 'Progress'}</span>
          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={containerClasses}>
        <div
          className={progressClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// Timeline Component
export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string | Date;
  status: 'completed' | 'current' | 'pending' | 'error';
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact';
  className?: string;
}

export function Timeline({ items, variant = 'default', className = '' }: TimelineProps) {

  // Professional theme classes
  const themeClasses = {
    line: 'border-slate-300',
    completedDot: 'bg-green-600 border-green-600',
    currentDot: 'bg-slate-600 border-slate-600',
    pendingDot: 'bg-slate-200 border-slate-300',
    errorDot: 'bg-red-600 border-red-600',
    text: 'text-slate-900',
    subtext: 'text-slate-600'
  };

  const getDotClasses = (status: TimelineItem['status']) => {
    const baseClasses = 'w-3 h-3 rounded-full border-2 flex items-center justify-center';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} ${themeClasses.completedDot}`;
      case 'current':
        return `${baseClasses} ${themeClasses.currentDot} ring-4 ring-slate-200`;
      case 'error':
        return `${baseClasses} ${themeClasses.errorDot}`;
      case 'pending':
      default:
        return `${baseClasses} ${themeClasses.pendingDot}`;
    }
  };

  const getDefaultIcon = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return <div className="w-1.5 h-1.5 bg-white rounded-full" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-start">
          {/* Timeline line */}
          {index < items.length - 1 && (
            <div 
              className={`absolute left-1.5 top-6 w-0.5 h-full border-l-2 ${themeClasses.line}`}
            />
          )}
          
          {/* Timeline dot */}
          <div 
            className={`relative z-10 ${getDotClasses(item.status)} flex-shrink-0`}
          >
            {item.icon || getDefaultIcon(item.status)}
          </div>
          
          {/* Content */}
          <div className={`ml-4 ${variant === 'compact' ? 'pb-4' : 'pb-8'} flex-1 min-w-0`}>
            <div className="flex items-center justify-between">
              <h4 
                className={`font-medium ${variant === 'compact' ? 'text-sm' : 'text-base'} ${themeClasses.text}`}
              >
                {item.title}
              </h4>
              <time 
                className={`text-xs flex-shrink-0 ml-2 ${themeClasses.subtext}`}
              >
                {formatTimestamp(item.timestamp)}
              </time>
            </div>
            
            {item.description && (
              <p 
                className={`mt-1 ${variant === 'compact' ? 'text-xs' : 'text-sm'} ${themeClasses.subtext}`}
              >
                {item.description}
              </p>
            )}
            
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div 
                className={`mt-2 ${variant === 'compact' ? 'text-xs' : 'text-sm'} ${themeClasses.subtext}`}
              >
                {Object.entries(item.metadata).map(([key, value]) => (
                  <span key={key} className="mr-4">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}