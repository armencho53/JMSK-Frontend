import React, { useEffect, useRef } from 'react';

export interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * KeyboardNavigation component provides enhanced keyboard navigation support
 * including focus trapping, arrow key navigation, and keyboard shortcuts
 */
export function KeyboardNavigation({
  children,
  onEscape,
  onEnter,
  trapFocus = false,
  autoFocus = false,
  className = ''
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto focus the container or first focusable element
    if (autoFocus) {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        container.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Enter key
      if (event.key === 'Enter' && onEnter) {
        event.preventDefault();
        onEnter();
        return;
      }

      // Focus trapping
      if (trapFocus && event.key === 'Tab') {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      // Arrow key navigation for lists and grids
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleArrowNavigation(event, container);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, trapFocus, autoFocus]);

  const handleArrowNavigation = (event: KeyboardEvent, container: HTMLElement) => {
    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    // Check if we're in a grid layout (has role="grid" or data-grid attribute)
    const isGrid = container.closest('[role="grid"]') || container.querySelector('[data-grid]');
    
    if (isGrid) {
      // Grid navigation logic
      const gridContainer = container.closest('[role="grid"]') || container.querySelector('[data-grid]');
      const columns = parseInt(gridContainer?.getAttribute('data-columns') || '1');
      
      switch (event.key) {
        case 'ArrowUp':
          nextIndex = Math.max(0, currentIndex - columns);
          break;
        case 'ArrowDown':
          nextIndex = Math.min(focusableElements.length - 1, currentIndex + columns);
          break;
        case 'ArrowLeft':
          nextIndex = Math.max(0, currentIndex - 1);
          break;
        case 'ArrowRight':
          nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
          break;
      }
    } else {
      // List navigation logic
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
      }
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      focusableElements[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      tabIndex={trapFocus ? -1 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement(options: {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
} = {}) {
  const { autoFocus = false, restoreFocus = false, trapFocus = false } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      firstFocusable?.focus();
    }

    return () => {
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (trapFocus && event.key === 'Tab' && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  useEffect(() => {
    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [trapFocus]);

  return containerRef;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = [
        event.ctrlKey && 'ctrl',
        event.altKey && 'alt',
        event.shiftKey && 'shift',
        event.metaKey && 'meta',
        event.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Component for creating accessible keyboard shortcuts help
 */
export interface KeyboardShortcutsHelpProps {
  shortcuts: Array<{
    keys: string;
    description: string;
  }>;
  isVisible: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ shortcuts, isVisible, onClose }: KeyboardShortcutsHelpProps) {
  const dialogRef = useFocusManagement({ 
    autoFocus: isVisible, 
    restoreFocus: true, 
    trapFocus: isVisible 
  });

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-slate-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="shortcuts-title" className="text-lg font-semibold text-slate-900">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 hover:bg-slate-100"
            aria-label="Close shortcuts help"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono rounded border bg-slate-100 border-slate-300">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}