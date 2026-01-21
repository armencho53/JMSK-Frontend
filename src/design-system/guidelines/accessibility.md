# Accessibility Guidelines

The Modern Jewelry UI design system is built with accessibility as a core principle, ensuring that all users can effectively interact with jewelry manufacturing applications regardless of their abilities or assistive technologies.

## WCAG 2.1 AA Compliance

Our design system meets or exceeds WCAG 2.1 AA standards across all components and interactions.

### Color Contrast Requirements

#### Text Contrast Ratios

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **Interactive elements**: Clear visual distinction and focus indicators

#### Verified Contrast Combinations

```css
/* Excellent contrast (AAA level) */
.high-contrast {
  color: #0f172a;           /* Dark text */
  background: #ffffff;      /* White background */
  /* Contrast ratio: 19.1:1 ✓ AAA */
}

/* Good contrast (AA level) */
.good-contrast {
  color: #1e3a8a;           /* Deep sapphire */
  background: #f8fafc;      /* Light gray */
  /* Contrast ratio: 8.2:1 ✓ AA */
}

/* Minimum acceptable contrast */
.minimum-contrast {
  color: #64748b;           /* Medium gray */
  background: #ffffff;      /* White */
  /* Contrast ratio: 4.6:1 ✓ AA */
}
```

#### Color Contrast Testing

```tsx
// Component with verified contrast
function AccessibleButton({ variant, children, ...props }) {
  const getContrastClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white'; // 4.5:1 contrast ✓
      case 'secondary':
        return 'bg-gray-100 text-gray-900'; // 16.7:1 contrast ✓
      case 'danger':
        return 'bg-red-600 text-white'; // 5.4:1 contrast ✓
      default:
        return 'bg-white text-gray-900 border border-gray-300'; // 16.7:1 contrast ✓
    }
  };

  return (
    <button className={`${getContrastClasses()} px-4 py-2 rounded`} {...props}>
      {children}
    </button>
  );
}
```

## Keyboard Navigation

### Focus Management

All interactive elements support keyboard navigation with visible focus indicators:

```css
/* Focus styles for all interactive elements */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Custom focus styles for specific components */
.jewelry-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.jewelry-input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Tab Order and Navigation

```tsx
// Proper tab order in forms
function AccessibleForm() {
  return (
    <form>
      <Input 
        label="Customer Name" 
        tabIndex={1}
        required
        aria-describedby="name-help"
      />
      <div id="name-help" className="text-sm text-gray-600">
        Enter the customer's full name
      </div>
      
      <Select 
        label="Metal Type" 
        tabIndex={2}
        required
        aria-describedby="metal-help"
      />
      <div id="metal-help" className="text-sm text-gray-600">
        Select the primary metal for this order
      </div>
      
      <div className="flex gap-3">
        <Button type="button" tabIndex={4}>Cancel</Button>
        <Button type="submit" tabIndex={3}>Save Order</Button>
      </div>
    </form>
  );
}
```

### Keyboard Shortcuts

```tsx
// Global keyboard shortcuts
function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Skip if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case '/':
          event.preventDefault();
          focusSearchInput();
          break;
        case 'n':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            createNewOrder();
          }
          break;
        case 'Escape':
          closeModals();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

## Screen Reader Support

### Semantic HTML Structure

```tsx
// Proper semantic structure
function AccessibleLayout() {
  return (
    <div className="min-h-screen">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/customers">Customers</a></li>
          </ul>
        </nav>
      </header>
      
      <main role="main" id="main-content">
        <h1>Page Title</h1>
        <section aria-labelledby="recent-orders">
          <h2 id="recent-orders">Recent Orders</h2>
          <OrdersTable />
        </section>
      </main>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Jewelry Manufacturing System</p>
      </footer>
    </div>
  );
}
```

### ARIA Labels and Descriptions

```tsx
// Comprehensive ARIA support
function AccessibleTable({ data, columns }) {
  return (
    <table 
      role="table" 
      aria-label="Orders table"
      aria-describedby="table-description"
    >
      <caption id="table-description" className="sr-only">
        A table showing recent orders with customer names, status, and actions. 
        Use arrow keys to navigate and Enter to select.
      </caption>
      
      <thead>
        <tr role="row">
          {columns.map((column) => (
            <th 
              key={column.key}
              role="columnheader"
              aria-sort={getSortDirection(column.key)}
              tabIndex={0}
              onClick={() => handleSort(column.key)}
              onKeyDown={(e) => e.key === 'Enter' && handleSort(column.key)}
            >
              {column.title}
              {column.sortable && (
                <span aria-hidden="true" className="ml-1">
                  {getSortIcon(column.key)}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, index) => (
          <tr 
            key={row.id}
            role="row"
            aria-rowindex={index + 1}
            tabIndex={0}
            onClick={() => selectRow(row)}
            onKeyDown={(e) => e.key === 'Enter' && selectRow(row)}
          >
            {columns.map((column) => (
              <td 
                key={column.key}
                role="gridcell"
                aria-describedby={`${column.key}-${row.id}-desc`}
              >
                {renderCell(row, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Screen Reader Only Content

```tsx
// Screen reader only utilities
function ScreenReaderOnly({ children }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Usage examples
<button>
  <TrashIcon aria-hidden="true" />
  <ScreenReaderOnly>Delete order</ScreenReaderOnly>
</button>

<Status status="completed">
  <ScreenReaderOnly>Order status: </ScreenReaderOnly>
  Completed
</Status>
```

## Form Accessibility

### Label Association

```tsx
// Proper label association
function AccessibleInput({ label, error, help, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {props.required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        id={id}
        aria-describedby={`${help ? helpId : ''} ${error ? errorId : ''}`.trim()}
        aria-invalid={error ? 'true' : 'false'}
        className={`
          block w-full px-3 py-2 border rounded-md
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
        {...props}
      />
      
      {help && (
        <p id={helpId} className="text-sm text-gray-600">
          {help}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Form Validation

```tsx
// Accessible form validation
function AccessibleForm() {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  return (
    <form 
      noValidate
      aria-label="Create new order"
      onSubmit={handleSubmit}
    >
      <fieldset>
        <legend className="text-lg font-semibold mb-4">
          Customer Information
        </legend>
        
        <AccessibleInput
          label="Email Address"
          type="email"
          required
          error={touched.email ? errors.email : ''}
          help="We'll use this to send order updates"
          onBlur={(e) => {
            setTouched({ ...touched, email: true });
            validateField('email', e.target.value);
          }}
        />
      </fieldset>
      
      {Object.keys(errors).length > 0 && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded p-4 mt-4">
          <h3 className="text-red-800 font-medium">Please correct the following errors:</h3>
          <ul className="mt-2 text-red-700">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={Object.keys(errors).length > 0}
        >
          Create Order
        </Button>
      </div>
    </form>
  );
}
```

## Modal and Dialog Accessibility

### Focus Trapping

```tsx
// Accessible modal with focus trapping
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Trap focus within modal
      const trapFocus = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', trapFocus);
      return () => document.removeEventListener('keydown', trapFocus);
    } else {
      // Restore focus to previously focused element
      previousFocusRef.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Touch and Mobile Accessibility

### Touch Target Sizes

```tsx
// Touch-friendly components
function TouchFriendlyButton({ children, size = 'default', ...props }) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-h-[44px] min-w-[44px] px-3 py-2'; // WCAG minimum
      case 'lg':
        return 'min-h-[56px] min-w-[56px] px-6 py-3'; // Enhanced accessibility
      default:
        return 'min-h-[44px] min-w-[44px] px-4 py-2';
    }
  };

  return (
    <button 
      className={`
        ${getSizeClasses()}
        rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-blue-500
        active:scale-95 transition-transform
      `}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Gesture Support

```tsx
// Swipe gesture support for mobile
function SwipeableCard({ onSwipeLeft, onSwipeRight, children }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="touch-pan-x"
      role="button"
      tabIndex={0}
      aria-label="Swipe left or right for actions"
    >
      {children}
    </div>
  );
}
```

## Testing and Validation

### Automated Accessibility Testing

```tsx
// Component testing with accessibility checks
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button Component Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <Button variant="primary">Click me</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper focus management', () => {
    render(<Button>Focusable Button</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('tabindex', '0');
  });

  test('should support keyboard interaction', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard Button</Button>);
    
    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible and clear
- [ ] Tab order is logical and intuitive
- [ ] Escape key closes modals and dropdowns
- [ ] Enter/Space activates buttons and links

#### Screen Reader Testing
- [ ] All content is announced correctly
- [ ] Headings create proper document outline
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Status changes are communicated

#### Color and Contrast
- [ ] All text meets contrast requirements
- [ ] Color is not the only way to convey information
- [ ] Focus indicators are visible in high contrast mode
- [ ] Components work with Windows High Contrast mode

#### Mobile and Touch
- [ ] Touch targets are at least 44px
- [ ] Gestures have keyboard alternatives
- [ ] Content is readable at 200% zoom
- [ ] Orientation changes are handled gracefully

## Best Practices

### Do's

- **Use semantic HTML** elements whenever possible
- **Provide alternative text** for all images and icons
- **Ensure keyboard navigation** works for all interactions
- **Test with actual assistive technologies** regularly
- **Include accessibility** in your design process from the start

### Don'ts

- **Don't rely solely on color** to convey information
- **Don't create keyboard traps** without escape mechanisms
- **Don't use placeholder text** as the only label
- **Don't ignore focus management** in dynamic content
- **Don't assume** all users interact the same way

### Implementation Guidelines

```tsx
// Good: Comprehensive accessibility
function AccessibleComponent() {
  return (
    <section aria-labelledby="section-title">
      <h2 id="section-title">Order Summary</h2>
      
      <button
        aria-describedby="button-help"
        onClick={handleAction}
        className="min-h-[44px] focus:ring-2 focus:ring-blue-500"
      >
        Process Order
      </button>
      
      <div id="button-help" className="sr-only">
        This will process the order and send confirmation emails
      </div>
    </section>
  );
}

// Avoid: Poor accessibility
function InaccessibleComponent() {
  return (
    <div>
      <div className="text-lg font-bold">Order Summary</div>
      <div 
        onClick={handleAction}
        className="cursor-pointer text-blue-500"
      >
        Process Order
      </div>
    </div>
  );
}
```