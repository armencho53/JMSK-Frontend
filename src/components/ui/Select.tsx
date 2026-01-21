import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  helperText,
  searchable = false,
  disabled = false,
  className = ''
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search term
  useEffect(() => {
    if (searchable && searchTerm) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Professional theme classes
  const themeClasses = {
    container: 'relative',
    trigger: [
      'w-full px-3 py-2 bg-white text-slate-900',
      'border border-slate-300 rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500',
      'transition-all duration-200 cursor-pointer',
      'flex items-center justify-between',
      error ? 'border-red-500 focus:ring-red-500' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ].filter(Boolean).join(' '),
    dropdown: [
      'absolute z-50 w-full mt-1 bg-white',
      'border border-slate-300 rounded-lg shadow-lg',
      'max-h-60 overflow-auto'
    ].join(' '),
    option: [
      'px-3 py-2 cursor-pointer transition-colors duration-150',
      'text-slate-900 hover:bg-slate-50 hover:text-orange-600'
    ].join(' '),
    selectedOption: 'bg-slate-900 text-white',
    searchInput: [
      'w-full px-3 py-2 bg-slate-50 text-slate-900',
      'border-b border-slate-300 focus:outline-none',
      'placeholder-slate-500'
    ].join(' ')
  };

  const handleOptionSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      // TODO: Add arrow key navigation through options
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      // TODO: Add arrow key navigation through options
    }
  };

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText && !error ? `${selectId}-helper` : undefined;

  return (
    <div className={`${themeClasses.container} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      
      <div ref={selectRef}>
        <div
          id={selectId}
          className={themeClasses.trigger}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-label={label || placeholder}
        >
          <span className={selectedOption ? '' : 'opacity-60'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className={themeClasses.dropdown}>
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                className={themeClasses.searchInput}
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search options"
              />
            )}
            
            <ul id={listboxId} role="listbox" aria-label={label || 'Options'}>
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm opacity-60" role="option" aria-disabled="true">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`${themeClasses.option} ${
                      option.value === value ? themeClasses.selectedOption : ''
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <p id={errorId} className="text-sm mt-1 text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p id={helperId} className="text-sm mt-1 opacity-60">{helperText}</p>}
    </div>
  );
}