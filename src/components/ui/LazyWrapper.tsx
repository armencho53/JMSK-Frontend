/**
 * Lazy Loading Wrapper Component
 * 
 * Provides a reusable wrapper for lazy-loaded components with loading states,
 * error boundaries, and performance optimizations.
 */

import React, { Suspense, ComponentType, ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class LazyErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ComponentType<{ error: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ComponentType<{ error: Error; retry: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load component
          </h3>
          <p className="text-gray-600 mb-4">
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.retry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingOverlay isVisible={true} message="Loading component..." />
  </div>
);

/**
 * Lazy wrapper component with error boundary and loading states
 */
export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback,
  className = '',
}) => {
  return (
    <div className={`lazy-wrapper ${className}`}>
      <LazyErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </LazyErrorBoundary>
    </div>
  );
};

/**
 * Higher-order component for creating lazy-loaded components
 */
export function withLazyWrapper<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode;
    errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
    className?: string;
  } = {}
): ComponentType<P> {
  const WrappedComponent: ComponentType<P> = (props) => (
    <LazyWrapper {...options}>
      <Component {...props} />
    </LazyWrapper>
  );

  WrappedComponent.displayName = `withLazyWrapper(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for preloading components
 */
export function usePreloadComponent(
  importFn: () => Promise<any>,
  condition: boolean = true
) {
  React.useEffect(() => {
    if (condition) {
      // Preload on next idle callback or after a short delay
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          importFn().catch(() => {
            // Silently fail preloading
          });
        });
      } else {
        const timer = setTimeout(() => {
          importFn().catch(() => {
            // Silently fail preloading
          });
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [importFn, condition]);
}

export default LazyWrapper;