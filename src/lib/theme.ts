/**
 * Professional theme utilities for the jewelry manufacturing application
 * Clean, modern professional design system
 */

// Legacy compatibility types for tests
export type ThemeOption = 'professional';

// Legacy compatibility - only professional theme available
export const THEME_OPTIONS = [{ key: 'professional' as const, name: 'Professional' }];

/**
 * Legacy compatibility function - no-op since we only have professional theme
 */
export function applyTheme(_theme: any): void {
  // No-op - professional theme is always applied
}

/**
 * Legacy compatibility function - always returns professional
 */
export function getCurrentTheme(): ThemeOption {
  return 'professional';
}

/**
 * Legacy compatibility function - no-op since we only have professional theme
 */
export function initializeTheme(): void {
  // No-op - professional theme is always initialized
}

/**
 * Get professional theme CSS classes for components
 */
export function getThemeClasses() {
  return {
    card: 'jewelry-card',
    buttonPrimary: 'jewelry-button-primary',
    buttonSecondary: 'jewelry-button-secondary',
    input: 'jewelry-input',
    background: 'bg-professional-background-primary',
    text: 'text-professional-primary-900',
    accent: 'text-professional-secondary-500',
  };
}

/**
 * Get professional theme color values for dynamic styling
 */
export function getThemeColors() {
  return {
    primary: '#0f172a',
    secondary: '#ea580c',
    tertiary: '#6b7280',
    background: '#fefefe',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',
  };
}