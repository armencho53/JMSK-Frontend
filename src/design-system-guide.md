# Jewelry Manufacturing Design System Guide

## Overview

This design system provides a clean, modern professional theme for the jewelry manufacturing application. The system has been streamlined to focus on a single, sophisticated professional aesthetic that maintains consistency and performance across the entire application.

## Professional Theme

### Modern Professional (Default)
- **Philosophy**: Contemporary business interface with jewelry industry color inspiration
- **Primary Color**: Midnight Blue (#0f172a)
- **Secondary Color**: Copper (#ea580c)
- **Color Palette**: Professional slate color scheme for consistency
- **Typography**: Inter for headings and body text, JetBrains Mono for code
- **Design Focus**: Clean, structured, business-oriented interface optimized for manufacturing workflows

## Usage

### Theme Switching

```tsx
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { ThemeSelector } from './components/ThemeSelector';

// Wrap your app with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}

// Use theme selector component
function Settings() {
  return <ThemeSelector />;
}

// Access theme programmatically
function MyComponent() {
  const { currentTheme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('luxury')}>
      Switch to Luxury Theme
    </button>
  );
}
```

### CSS Custom Properties

The design system uses CSS custom properties that automatically update when themes change:

```css
/* These variables change based on the active theme */
color: rgb(var(--theme-primary-600));
background-color: rgb(var(--theme-neutral-50));
font-family: var(--theme-font-heading);
box-shadow: var(--theme-shadow);
```

### Utility Classes

#### Theme-Aware Classes
```css
.theme-primary          /* Primary color text */
.theme-bg-primary       /* Primary background */
.theme-secondary        /* Secondary color text */
.theme-bg-secondary     /* Secondary background */
.theme-neutral          /* Neutral text color */
.theme-bg-neutral       /* Neutral background */
.theme-shadow           /* Theme-appropriate shadow */
.theme-shadow-hover     /* Hover shadow effect */
.theme-border-radius    /* Theme border radius */
```

#### Typography Scale
```css
.text-jewelry-xs        /* 0.75rem */
.text-jewelry-sm        /* 0.875rem */
.text-jewelry-base      /* 1rem */
.text-jewelry-lg        /* 1.125rem */
.text-jewelry-xl        /* 1.25rem */
.text-jewelry-2xl       /* 1.5rem */
.text-jewelry-3xl       /* 1.875rem */
.text-jewelry-4xl       /* 2.25rem */
```

#### Spacing Utilities
```css
.space-jewelry-xs       /* 0.25rem spacing */
.space-jewelry-sm       /* 0.5rem spacing */
.space-jewelry-md       /* 1rem spacing */
.space-jewelry-lg       /* 1.5rem spacing */
.space-jewelry-xl       /* 2rem spacing */
```

### Component Classes

#### Pre-built Components
```css
.jewelry-card           /* Card component with theme-aware styling */
.jewelry-button-primary /* Primary button styling */
.jewelry-button-secondary /* Secondary button styling */
.jewelry-input          /* Input field styling */
```

### Tailwind Extensions

The design system extends Tailwind with jewelry-specific colors:

```tsx
// Elegant theme colors
<div className="bg-elegant-primary-600 text-elegant-neutral-50">
  Elegant primary button
</div>

// Luxury theme colors
<div className="bg-luxury-secondary-400 text-luxury-primary-900">
  Luxury accent element
</div>

// Professional theme colors
<div className="bg-professional-primary-900 text-professional-background-primary">
  Professional header
</div>
```

### Font Families

Each theme has its own font stack:

```css
/* Elegant Minimalism */
font-elegant-heading    /* Inter */
font-elegant-body       /* Inter */
font-elegant-accent     /* Playfair Display */

/* Luxury Dark Mode */
font-luxury-heading     /* Montserrat */
font-luxury-body        /* Source Sans Pro */
font-luxury-accent      /* Cormorant Garamond */

/* Modern Professional */
font-professional-heading /* Poppins */
font-professional-body    /* Open Sans */
font-professional-accent  /* Lora */
```

## Best Practices

1. **Use CSS Custom Properties**: Always use the CSS custom properties for theme-aware styling
2. **Consistent Spacing**: Use the jewelry spacing utilities for consistent layouts
3. **Typography Hierarchy**: Follow the established typography scale
4. **Component Classes**: Use pre-built component classes when available
5. **Theme Testing**: Test your components with all three themes
6. **Accessibility**: Ensure sufficient contrast ratios in all themes

## Implementation Notes

- Themes are stored in localStorage and persist across sessions
- The default theme is "elegant" if no preference is stored
- All Google Fonts are loaded asynchronously for performance
- CSS custom properties provide smooth theme transitions
- The system is fully responsive and works across all device sizes

## Responsive Design System

### Mobile-First Approach

The design system follows a mobile-first approach with responsive breakpoints:

- **Mobile**: < 768px (single column, touch-friendly)
- **Tablet**: 768px - 1024px (2-3 columns, hybrid interactions)
- **Desktop**: > 1024px (multi-column, hover effects)

### Responsive Components

#### ResponsiveContainer

Flexible container with size variants and responsive padding:

```tsx
import { ResponsiveContainer } from './components/ui';

<ResponsiveContainer size="desktop" padding="responsive">
  <h1>Page Content</h1>
</ResponsiveContainer>
```

**Props:**
- `size`: `'mobile' | 'tablet' | 'desktop' | 'wide' | 'full'`
- `padding`: `'none' | 'sm' | 'md' | 'lg' | 'responsive'`

#### ResponsiveGrid

Mobile-first grid system with automatic column adaptation:

```tsx
import { ResponsiveGrid } from './components/ui';

<ResponsiveGrid type="cards" gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>
```

**Props:**
- `type`: `'default' | 'cards'` (affects column behavior)
- `gap`: `'sm' | 'md' | 'lg'` (responsive gap sizing)

#### ResponsiveStack

Vertical layout component with responsive spacing:

```tsx
import { ResponsiveStack } from './components/ui';

<ResponsiveStack spacing="lg" align="center">
  <h2>Title</h2>
  <p>Content</p>
  <button>Action</button>
</ResponsiveStack>
```

**Props:**
- `spacing`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (responsive spacing)
- `align`: `'start' | 'center' | 'end' | 'stretch'`

#### TouchTarget

Touch-friendly wrapper ensuring minimum 44px touch targets:

```tsx
import { TouchTarget } from './components/ui';

<TouchTarget size="lg" as="button" onClick={handleClick}>
  Touch-friendly Button
</TouchTarget>
```

**Props:**
- `size`: `'default' | 'lg'` (44px or 56px minimum)
- `as`: `'button' | 'div' | 'a'` (polymorphic component)

### Mobile-First CSS Utilities

#### Responsive Typography
```css
.text-jewelry-responsive-sm    /* Scales from 0.875rem to 1rem */
.text-jewelry-responsive-base  /* Scales from 1rem to 1.125rem */
.text-jewelry-responsive-lg    /* Scales from 1.125rem to 1.5rem */
```

#### Touch-Friendly Utilities
```css
.touch-target      /* Minimum 44px touch target */
.touch-target-lg   /* Minimum 56px touch target */
.btn-mobile        /* Mobile-optimized button */
.btn-mobile-lg     /* Large mobile button */
```

#### Responsive Spacing
```css
.space-mobile-xs   /* Responsive vertical spacing (extra small) */
.space-mobile-sm   /* Responsive vertical spacing (small) */
.space-mobile-md   /* Responsive vertical spacing (medium) */
.space-mobile-lg   /* Responsive vertical spacing (large) */
.space-mobile-xl   /* Responsive vertical spacing (extra large) */
```

#### Layout Utilities
```css
.container-mobile  /* Responsive container with padding */
.grid-mobile       /* 1→2→3 column responsive grid */
.grid-mobile-cards /* 1→2→3 column card grid */
.padding-mobile    /* Responsive padding (1rem→2rem) */
```

#### Responsive Visibility
```css
.mobile-only       /* Visible only on mobile */
.tablet-up         /* Visible on tablet and up */
.desktop-only      /* Visible only on desktop */
```

## Components

### Button Component

The Button component provides consistent styling across all themes with multiple variants and states.

#### Usage

```tsx
import { Button } from './components/ui/Button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="tertiary">Tertiary Action</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Custom styling
<Button className="custom-class">Custom Button</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner and disables button |
| `disabled` | `boolean` | `false` | Disables the button |
| `children` | `React.ReactNode` | - | Button content |
| `className` | `string` | `''` | Additional CSS classes |

#### Theme Variations

**Elegant Theme:**
- Primary: Deep sapphire background with white text
- Secondary: Rose gold background with white text  
- Tertiary: Transparent with sapphire text and border

**Luxury Theme:**
- Primary: Gold background with dark text
- Secondary: Charcoal background with light text
- Tertiary: Transparent with light text and border

**Professional Theme:**
- Primary: Midnight blue background with white text
- Secondary: Copper background with white text
- Tertiary: Transparent with dark text and border

#### Accessibility Features

- Full keyboard navigation support
- Proper focus indicators with ring styling
- ARIA-compliant disabled states
- Screen reader friendly loading states
- Semantic button element with proper roles

## File Structure

```
src/
├── lib/
│   └── theme.ts              # Theme utilities and management
├── components/
│   ├── ThemeProvider.tsx     # React context for theme state
│   ├── ThemeSelector.tsx     # Theme selection component
│   ├── DesignSystemTest.tsx  # Test component for verification
│   └── ui/
│       └── Button.tsx        # Button component with theme support
└── index.css                 # CSS custom properties and utilities
```