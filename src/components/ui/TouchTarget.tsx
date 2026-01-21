import React from 'react';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  'data-testid'?: string;
  'aria-label'?: string;
  as?: 'div' | 'button';
}

/**
 * TouchTarget component for touch-friendly interactions
 * Ensures minimum touch target size for accessibility
 */
export const TouchTarget: React.FC<TouchTargetProps> = ({ 
  children, 
  className = '', 
  onClick,
  'data-testid': testId,
  'aria-label': ariaLabel,
  as: Component = 'div'
}) => {
  return (
    <Component
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
};