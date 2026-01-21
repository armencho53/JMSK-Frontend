import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  responsive?: boolean;
  fullWidth?: boolean;
  touchFriendly?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    className = '', 
    children,
    responsive = false,
    fullWidth = false,
    touchFriendly = false,
    ...props 
  }, ref) => {

    // Base classes for all buttons - clean professional styling
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rounded-md', // Clean modern border radius
      fullWidth ? 'w-full' : '',
      touchFriendly ? 'min-h-[44px]' : '', // Touch-friendly minimum height
      responsive ? 'btn-mobile' : ''
    ].filter(Boolean);

    // Professional size variants with mobile-first approach
    const getSizeClasses = () => {
      if (responsive) {
        // Use responsive button classes
        return size === 'lg' ? 'btn-mobile-lg' : 'btn-mobile';
      }
      
      if (touchFriendly) {
        // Touch-friendly sizes with professional spacing
        return {
          sm: 'px-4 py-3 text-sm min-h-[44px]',
          md: 'px-6 py-3 text-base min-h-[44px]',
          lg: 'px-8 py-4 text-lg min-h-[48px]'
        }[size];
      }
      
      // Standard professional sizes
      return {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }[size];
    };

    // Professional variant classes - clean modern styling
    const getVariantClasses = () => {
      return {
        primary: [
          'bg-slate-900 text-white',
          'hover:bg-slate-800 hover:shadow-md',
          'focus:ring-slate-700',
          'shadow-sm'
        ],
        secondary: [
          'bg-orange-600 text-white',
          'hover:bg-orange-700 hover:shadow-md',
          'focus:ring-orange-500',
          'shadow-sm'
        ],
        tertiary: [
          'bg-transparent text-slate-900',
          'hover:bg-slate-50 hover:text-orange-600',
          'focus:ring-slate-700',
          'border border-slate-300'
        ],
        ghost: [
          'bg-transparent text-slate-900',
          'hover:bg-slate-50',
          'focus:ring-slate-700'
        ],
        danger: [
          'bg-red-600 text-white',
          'hover:bg-red-700 hover:shadow-md',
          'focus:ring-red-500',
          'shadow-sm'
        ]
      };
    };

    const variantClasses = getVariantClasses()[variant];

    // Combine all classes
    const buttonClasses = [
      ...baseClasses,
      !responsive ? getSizeClasses() : '', // Don't add size classes if using responsive
      ...variantClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? `${props.id || 'button'}-loading` : undefined}
        {...props}
      >
        {loading && (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span id={`${props.id || 'button'}-loading`} className="sr-only">
              Loading, please wait
            </span>
          </>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };