
import { createPortal } from 'react-dom'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  backdrop?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  backdrop = true,
  size = 'md',
}: LoadingOverlayProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8'
      case 'md':
        return 'h-12 w-12'
      case 'lg':
        return 'h-16 w-16'
      default:
        return 'h-12 w-12'
    }
  }

  if (!isVisible) return null

  const overlayContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {backdrop && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75" aria-hidden="true" />
      )}
      
      <div className="relative bg-white rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className={`animate-spin ${getSizeClasses()} text-indigo-600`}
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
          
          {message && (
            <p className="text-sm font-medium text-gray-900">{message}</p>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(overlayContent, document.body)
}

// Inline loading spinner component for use within other components
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-6 w-6'
      case 'lg':
        return 'h-8 w-8'
      default:
        return 'h-6 w-6'
    }
  }

  return (
    <svg
      className={`animate-spin ${getSizeClasses()} ${className}`}
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
  )
}