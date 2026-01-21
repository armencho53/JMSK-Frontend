import { useState, useRef, useEffect } from 'react';

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Select a date...',
  disabled = false,
  className = '',
  min: _min,
  max: _max
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    calendar: [
      'absolute z-50 mt-1 bg-white',
      'border border-slate-300 rounded-lg shadow-lg',
      'p-4 w-80'
    ].join(' '),
    header: 'flex items-center justify-between mb-4',
    headerButton: 'p-1 hover:bg-slate-50 rounded-lg text-slate-900',
    monthYear: 'text-slate-900 font-medium',
    weekdays: 'grid grid-cols-7 gap-1 mb-2',
    weekday: 'text-center text-xs font-medium text-slate-500 p-2',
    days: 'grid grid-cols-7 gap-1',
    day: [
      'text-center p-2 text-sm cursor-pointer rounded-lg',
      'text-slate-900 hover:bg-slate-50'
    ].join(' '),
    selectedDay: 'bg-slate-900 text-white hover:bg-slate-800',
    todayDay: 'bg-slate-50 text-orange-600',
    otherMonth: 'text-slate-400 opacity-50'
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date.toISOString().split('T')[0]);
    }
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();

  return (
    <div className={`${themeClasses.container} ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      
      <div ref={datePickerRef}>
        <div
          className={themeClasses.trigger}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={selectedDate ? '' : 'opacity-60'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {isOpen && (
          <div className={themeClasses.calendar}>
            <div className={themeClasses.header}>
              <button
                type="button"
                className={themeClasses.headerButton}
                onClick={() => navigateMonth('prev')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className={themeClasses.monthYear}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              
              <button
                type="button"
                className={themeClasses.headerButton}
                onClick={() => navigateMonth('next')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className={themeClasses.weekdays}>
              {weekdays.map(day => (
                <div key={day} className={themeClasses.weekday}>
                  {day}
                </div>
              ))}
            </div>

            <div className={themeClasses.days}>
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${themeClasses.day} ${
                    isSelected(day) ? themeClasses.selectedDay : ''
                  } ${
                    isToday(day) && !isSelected(day) ? themeClasses.todayDay : ''
                  } ${
                    !isSameMonth(day) ? themeClasses.otherMonth : ''
                  }`}
                  onClick={() => handleDateSelect(day)}
                >
                  {day.getDate()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm mt-1 opacity-60">{helperText}</p>}
    </div>
  );
}