import React, { forwardRef, useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'floating' | 'standard';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helperText,
    variant = 'floating',
    leftIcon,
    rightIcon,
    className = '',
    placeholder,
    value,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';

    // Professional input styling - clean modern design
    const getInputClasses = () => {
      return {
        container: 'relative',
        input: [
          'w-full px-3 py-2 bg-white text-slate-900',
          'border border-slate-300 rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600',
          'transition-all duration-200',
          'placeholder:text-slate-400',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        ].filter(Boolean).join(' '),
        label: [
          'absolute left-3 transition-all duration-200 pointer-events-none',
          'text-slate-600',
          (isFocused || hasValue) ? 'text-xs -top-2 bg-white px-1' : 'text-base top-2'
        ].join(' '),
        error: 'text-red-600 text-sm mt-1',
        helper: 'text-slate-500 text-sm mt-1'
      };
    };

    const inputClasses = getInputClasses();

    if (variant === 'standard') {
      const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
      const errorId = error ? `${inputId}-error` : undefined;
      const helperId = helperText && !error ? `${inputId}-helper` : undefined;
      
      return (
        <div className={`${inputClasses.container} ${className}`}>
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-2">
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                {leftIcon}
              </div>
            )}
            <input
              {...props}
              ref={ref}
              id={inputId}
              className={`${inputClasses.input} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
              placeholder={placeholder}
              value={value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
            />
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" aria-hidden="true">
                {rightIcon}
              </div>
            )}
          </div>
          {error && <p id={errorId} className={inputClasses.error} role="alert">{error}</p>}
          {helperText && !error && <p id={helperId} className={inputClasses.helper}>{helperText}</p>}
        </div>
      );
    }

    // Floating label variant
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;
    
    return (
      <div className={`${inputClasses.container} ${className}`}>
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            {...props}
            ref={ref}
            id={inputId}
            className={`${inputClasses.input} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            placeholder={isFocused ? placeholder : ''}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          />
          {label && (
            <label htmlFor={inputId} className={inputClasses.label}>
              {label}
            </label>
          )}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p id={errorId} className={inputClasses.error} role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} className={inputClasses.helper}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };