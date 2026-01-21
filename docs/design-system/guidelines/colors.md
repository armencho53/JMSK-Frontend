# Color Guidelines

The Modern Jewelry UI design system features three distinct color palettes, each inspired by the luxury and precision of the jewelry industry.

## Design Themes

### Elegant Minimalism (Default)
Clean, sophisticated interface inspired by high-end jewelry boutiques with subtle luxury touches.

### Luxury Dark Mode
Sophisticated dark interface reminiscent of premium jewelry display cases with dramatic contrast.

### Modern Professional
Contemporary business interface with jewelry industry color inspiration and clean functionality.

## Color Palettes

### Elegant Minimalism

#### Primary Colors
- **Deep Sapphire** (`#1e3a8a`) - Primary brand color, trustworthy and professional
- **Rose Gold** (`#e11d48`) - Elegant accent color for highlights and CTAs
- **Warm Grays** (`#f8fafc` to `#0f172a`) - Neutral palette for backgrounds and text

#### Semantic Colors
- **Success - Emerald** (`#059669`) - Positive actions, success states
- **Warning - Amber** (`#d97706`) - Caution, pending states
- **Error - Ruby** (`#dc2626`) - Errors, destructive actions

```css
/* CSS Custom Properties */
:root {
  --color-primary: #1e3a8a;
  --color-secondary: #e11d48;
  --color-neutral-50: #f8fafc;
  --color-neutral-900: #0f172a;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
}
```

### Luxury Dark Mode

#### Primary Colors
- **Platinum** (`#e5e7eb`) - Light text on dark backgrounds
- **Gold** (`#fbbf24`) - Luxury accent color
- **Charcoal** (`#111827`) - Primary background
- **Slate** (`#1e293b`) - Surface backgrounds

#### Semantic Colors
- **Success - Jade** (`#10b981`) - Positive actions
- **Warning - Topaz** (`#f59e0b`) - Caution states
- **Error - Garnet** (`#ef4444`) - Error states

```css
/* CSS Custom Properties for Luxury Theme */
[data-theme="luxury"] {
  --color-primary: #e5e7eb;
  --color-secondary: #fbbf24;
  --color-background: #111827;
  --color-surface: #1e293b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Modern Professional

#### Primary Colors
- **Midnight Blue** (`#0f172a`) - Professional primary color
- **Copper** (`#ea580c`) - Warm accent color
- **Silver** (`#6b7280`) - Tertiary color for subtle elements
- **Pearl** (`#fefefe`) - Clean background

#### Semantic Colors
- **Success - Malachite** (`#16a34a`) - Success states
- **Warning - Citrine** (`#ca8a04`) - Warning states
- **Error - Carnelian** (`#dc2626`) - Error states

```css
/* CSS Custom Properties for Professional Theme */
[data-theme="professional"] {
  --color-primary: #0f172a;
  --color-secondary: #ea580c;
  --color-tertiary: #6b7280;
  --color-background: #fefefe;
  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-error: #dc2626;
}
```

## Usage Guidelines

### Color Hierarchy

1. **Primary Colors** - Brand identity, main CTAs, navigation
2. **Secondary Colors** - Accents, highlights, secondary actions
3. **Neutral Colors** - Text, backgrounds, borders
4. **Semantic Colors** - Status indicators, feedback

### Accessibility Standards

All color combinations meet WCAG 2.1 AA contrast requirements:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus indicators

#### Contrast Examples

```css
/* Good contrast examples */
.text-primary-on-light {
  color: #1e3a8a; /* Deep Sapphire */
  background: #f8fafc; /* Light Gray */
  /* Contrast ratio: 8.2:1 ✓ */
}

.text-light-on-primary {
  color: #ffffff;
  background: #1e3a8a; /* Deep Sapphire */
  /* Contrast ratio: 8.2:1 ✓ */
}
```

### Color Application

#### Buttons

```tsx
// Primary button - uses primary color
<Button variant="primary">Create Order</Button>

// Secondary button - uses secondary color
<Button variant="secondary">Edit</Button>

// Danger button - uses error color
<Button variant="danger">Delete</Button>
```

#### Status Indicators

```tsx
// Success status
<Status status="completed" /> // Uses success color

// Warning status
<Status status="pending" /> // Uses warning color

// Error status
<Status status="failed" /> // Uses error color
```

#### Backgrounds and Surfaces

```css
/* Page background */
.page-background {
  background-color: var(--color-neutral-50);
}

/* Card surfaces */
.card-surface {
  background-color: #ffffff;
  border: 1px solid var(--color-neutral-200);
}

/* Elevated surfaces */
.elevated-surface {
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Color Tokens

### Tailwind CSS Classes

The design system extends Tailwind CSS with custom color classes:

```css
/* Elegant theme colors */
.bg-elegant-primary-600 { background-color: #1e3a8a; }
.text-elegant-secondary-500 { color: #e11d48; }
.border-elegant-neutral-200 { border-color: #e2e8f0; }

/* Luxury theme colors */
.bg-luxury-primary-200 { background-color: #e5e7eb; }
.text-luxury-secondary-400 { color: #fbbf24; }
.bg-luxury-background-primary { background-color: #111827; }

/* Professional theme colors */
.bg-professional-primary-900 { background-color: #0f172a; }
.text-professional-secondary-500 { color: #ea580c; }
.bg-professional-background-primary { background-color: #fefefe; }
```

### CSS Custom Properties

Use CSS custom properties for dynamic theming:

```css
.jewelry-button-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 1px solid var(--color-primary);
}

.jewelry-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
}
```

## Theme Switching

### JavaScript Theme Management

```tsx
import { applyTheme, getCurrentTheme } from '@/lib/theme';

// Apply a theme
applyTheme('luxury'); // 'elegant' | 'luxury' | 'professional'

// Get current theme
const currentTheme = getCurrentTheme();

// Theme-aware component styling
const getThemeClasses = (theme) => {
  switch (theme) {
    case 'luxury':
      return 'bg-luxury-background-primary text-luxury-primary-200';
    case 'professional':
      return 'bg-professional-background-primary text-professional-primary-900';
    default:
      return 'bg-elegant-neutral-50 text-elegant-neutral-900';
  }
};
```

### Theme Selector Component

```tsx
function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  const handleThemeChange = (theme) => {
    applyTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <Select
      value={currentTheme}
      onChange={handleThemeChange}
      options={[
        { value: 'elegant', label: 'Elegant Minimalism' },
        { value: 'luxury', label: 'Luxury Dark Mode' },
        { value: 'professional', label: 'Modern Professional' }
      ]}
    />
  );
}
```

## Best Practices

### Do's

- **Use semantic color names** instead of specific color values
- **Maintain consistent contrast ratios** across all themes
- **Test colors with colorblind users** or simulation tools
- **Use CSS custom properties** for theme-aware components
- **Follow the established color hierarchy** for visual consistency

### Don'ts

- **Don't hardcode color values** in components
- **Don't use colors that fail accessibility standards**
- **Don't mix color palettes** from different themes
- **Don't use color as the only way** to convey information
- **Don't create new colors** without considering the overall palette

### Color Combinations

#### Recommended Combinations

```css
/* High contrast for readability */
.high-contrast {
  color: #0f172a; /* Dark text */
  background: #ffffff; /* Light background */
}

/* Subtle contrast for secondary content */
.subtle-contrast {
  color: #64748b; /* Medium gray text */
  background: #f8fafc; /* Light gray background */
}

/* Brand accent combinations */
.brand-accent {
  color: #ffffff; /* White text */
  background: #1e3a8a; /* Primary blue background */
}
```

#### Avoid These Combinations

```css
/* Poor contrast - avoid */
.poor-contrast {
  color: #94a3b8; /* Light gray text */
  background: #f1f5f9; /* Light background */
  /* Contrast ratio: 2.1:1 ✗ */
}

/* Clashing colors - avoid */
.clashing-colors {
  color: #e11d48; /* Rose gold */
  background: #fbbf24; /* Gold */
  /* Visually jarring combination ✗ */
}
```

## Color Psychology

### Elegant Minimalism
- **Blue (Sapphire)**: Trust, professionalism, stability
- **Pink (Rose Gold)**: Luxury, sophistication, warmth
- **Gray**: Balance, neutrality, timelessness

### Luxury Dark Mode
- **Gold**: Luxury, premium quality, exclusivity
- **Platinum**: Modern, sleek, high-end
- **Dark backgrounds**: Drama, focus, premium feel

### Modern Professional
- **Navy**: Authority, reliability, corporate
- **Copper**: Warmth, craftsmanship, approachability
- **Silver**: Modern, clean, technological

## Implementation Examples

### Component with Theme Support

```tsx
function ThemedCard({ children, variant = 'default' }) {
  const theme = getCurrentTheme();
  
  const getCardClasses = () => {
    const baseClasses = 'jewelry-card rounded-lg p-6';
    
    switch (variant) {
      case 'elevated':
        return `${baseClasses} shadow-card-hover`;
      case 'outlined':
        return `${baseClasses} border-2`;
      default:
        return `${baseClasses} shadow-card`;
    }
  };

  return (
    <div className={getCardClasses()}>
      {children}
    </div>
  );
}
```

### Status Color Mapping

```tsx
const getStatusColor = (status, theme = getCurrentTheme()) => {
  const statusColors = {
    elegant: {
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#1e3a8a'
    },
    luxury: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#fbbf24'
    },
    professional: {
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#0f172a'
    }
  };

  return statusColors[theme][status] || statusColors[theme].info;
};
```