import React, { ReactNode } from 'react'
import Modal from './Modal'
import { LoadingSpinner } from './LoadingOverlay'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  submitText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  submitVariant?: 'primary' | 'danger' | 'success'
  showFooter?: boolean
  className?: string
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  size = 'md',
  submitVariant = 'primary',
  showFooter = true,
  className = '',
}: FormModalProps) {
  const getSubmitButtonClasses = () => {
    const baseClasses = `
      w-full inline-flex justify-center rounded-md border border-transparent 
      shadow-sm px-4 py-2 text-base font-medium text-white 
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed
    `
    
    switch (submitVariant) {
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 focus:ring-red-500`
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 focus:ring-green-500`
      case 'primary':
      default:
        return `${baseClasses} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      className={className}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        
        {showFooter && (
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSubmitting}
              className={getSubmitButtonClasses()}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 text-white" />
                  Loading...
                </>
              ) : (
                submitText
              )}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          </div>
        )}
      </form>
    </Modal>
  )
}