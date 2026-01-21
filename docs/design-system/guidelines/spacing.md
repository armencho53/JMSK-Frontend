# Spacing Guidelines

Consistent spacing creates visual rhythm and hierarchy in the Modern Jewelry UI design system. Our spacing system is based on a 4px base unit with both mobile-first responsive utilities and desktop-optimized spacing.

## Spacing Scale

### Base Spacing Units

The design system uses a consistent spacing scale based on multiples of 4px:

```css
/* Base spacing scale */
.space-0 { margin/padding: 0; }           /* 0px */
.space-1 { margin/padding: 0.25rem; }    /* 4px */
.space-2 { margin/padding: 0.5rem; }     /* 8px */
.space-3 { margin/padding: 0.75rem; }    /* 12px */
.space-4 { margin/padding: 1rem; }       /* 16px */
.space-5 { margin/padding: 1.25rem; }    /* 20px */
.space-6 { margin/padding: 1.5rem; }     /* 24px */
.space-8 { margin/padding: 2rem; }       /* 32px */
.space-10 { margin/padding: 2.5rem; }    /* 40px */
.space-12 { margin/padding: 3rem; }      /* 48px */
.space-16 { margin/padding: 4rem; }      /* 64px */
.space-20 { margin/padding: 5rem; }      /* 80px */
.space-24 { margin/padding: 6rem; }      /* 96px */
```

### Extended Spacing Scale

For larger layouts and special cases:

```css
/* Extended spacing */
.space-32 { margin/padding: 8rem; }      /* 128px */
.space-40 { margin/padding: 10rem; }     /* 160px */
.space-48 { margin/padding: 12rem; }     /* 192px */
.space-56 { margin/padding: 14rem; }     /* 224px */
.space-64 { margin/padding: 16rem; }     /* 256px */
```

## Semantic Spacing

### Component Spacing Names

The design system provides semantic spacing names for consistent usage:

```css
/* Semantic spacing utilities */
.space-xs { margin/padding: 0.5rem; }    /* 8px - Extra small */
.space-sm { margin/padding: 0.75rem; }   /* 12px - Small */
.space-md { margin/padding: 1rem; }      /* 16px - Medium (default) */
.space-lg { margin/padding: 1.5rem; }    /* 24px - Large */
.space-xl { margin/padding: 2rem; }      /* 32px - Extra large */
.space-2xl { margin/padding: 3rem; }     /* 48px - 2X large */
.space-3xl { margin/padding: 4rem; }     /* 64px - 3X large */
```

### Usage in Components

```tsx
// Stack component with semantic spacing
<Stack spacing="md">        {/* 16px spacing */}
  <h1>Title</h1>
  <p>Content</p>
</Stack>

// Grid component with semantic gaps
<Grid cols={3} gap="lg">    {/* 24px gap */}
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

## Touch-Friendly Spacing

### Mobile Touch Targets

Special spacing utilities for touch-friendly interfaces:

```css
/* Touch-friendly spacing */
.space-touch-sm { margin/padding: 2.75rem; }  /* 44px - Minimum touch target */
.space-touch-md { margin/padding: 3rem; }     /* 48px - Comfortable touch target */
.space-touch-lg { margin/padding: 3.5rem; }   /* 56px - Large touch target */
```

### Touch Target Examples

```tsx
// Touch-friendly button spacing
<TouchTarget size="default">  {/* Ensures 44px minimum */}
  <Button>Action</Button>
</TouchTarget>

// Mobile navigation with proper spacing
<nav className="space-y-touch-sm">
  <NavItem>Dashboard</NavItem>
  <NavItem>Orders</NavItem>
  <NavItem>Customers</NavItem>
</nav>
```

## Desktop-Optimized Spacing

### Desktop Spacing Scale

Enhanced spacing for desktop layouts:

```css
/* Desktop-optimized spacing */
.space-desktop-xs { margin/padding: 0.75rem; }  /* 12px */
.space-desktop-sm { margin/padding: 1rem; }     /* 16px */
.space-desktop-md { margin/padding: 1.5rem; }   /* 24px */
.space-desktop-lg { margin/padding: 2rem; }     /* 32px */
.space-desktop-xl { margin/padding: 3rem; }     /* 48px */
.space-desktop-2xl { margin/padding: 4rem; }    /* 64px */
```

### Desktop Layout Examples

```tsx
// Desktop-optimized card layout
<div className="space-y-desktop-lg">
  <Header />
  <MainContent />
  <Footer />
</div>

// Desktop grid with larger gaps
<Grid cols={4} gap="desktop-xl">
  <MetricCard />
  <MetricCard />
  <MetricCard />
  <MetricCard />
</Grid>
```

## Responsive Spacing

### Mobile-First Responsive Spacing

```css
/* Responsive spacing utilities */
.space-y-4 { margin-top: 1rem; margin-bottom: 1rem; }
.sm\:space-y-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
.lg\:space-y-8 { margin-top: 2rem; margin-bottom: 2rem; }

/* Example responsive spacing */
.responsive-spacing {
  @apply space-y-4 sm:space-y-6 lg:space-y-8;
}
```

### Responsive Spacing Examples

```tsx
// Responsive vertical spacing
<div className="space-y-4 sm:space-y-6 lg:space-y-8">
  <Section>Content 1</Section>
  <Section>Content 2</Section>
  <Section>Content 3</Section>
</div>

// Responsive horizontal spacing
<div className="space-x-2 sm:space-x-4 lg:space-x-6">
  <Button>Cancel</Button>
  <Button>Save</Button>
</div>

// Responsive padding
<Container className="p-4 sm:p-6 lg:p-8">
  <Content />
</Container>
```

## Layout Principles

### Vertical Rhythm

Consistent vertical spacing creates visual rhythm:

```tsx
// Good: Consistent vertical rhythm
<article className="space-y-6">
  <h1 className="text-3xl font-bold">Article Title</h1>
  <p className="text-lg text-gray-600">Article subtitle</p>
  <div className="space-y-4">
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
    <p>Paragraph 3</p>
  </div>
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">Section Title</h3>
    <p>Section content</p>
  </div>
</article>
```

### Horizontal Rhythm

Consistent horizontal spacing for inline elements:

```tsx
// Button groups with consistent spacing
<div className="flex space-x-3">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
  <Button variant="tertiary">Save & Continue</Button>
</div>

// Navigation items with proper spacing
<nav className="flex space-x-6">
  <NavLink>Dashboard</NavLink>
  <NavLink>Orders</NavLink>
  <NavLink>Customers</NavLink>
</nav>
```

### Container Spacing

Consistent internal spacing for containers:

```tsx
// Card with consistent internal spacing
<Card>
  <CardHeader className="p-6 pb-0">
    <CardTitle as="h3">Card Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    <p>Card content with consistent padding</p>
  </CardContent>
  <CardFooter className="p-6 pt-0">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Component-Specific Spacing

### Form Spacing

```tsx
// Form with proper field spacing
<form className="space-y-6">
  <div className="space-y-4">
    <Input label="Customer Name" />
    <Input label="Email Address" />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input label="Phone" />
    <Select label="Category" />
  </div>
  
  <div className="flex justify-end space-x-3 pt-4">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </div>
</form>
```

### Table Spacing

```tsx
// Table with proper cell spacing
<Table className="[&_td]:p-4 [&_th]:p-4">
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Customer</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody className="space-y-2">
    <tr>
      <td>12345</td>
      <td>John Doe</td>
      <td><Status status="completed" /></td>
    </tr>
  </tbody>
</Table>
```

### Navigation Spacing

```tsx
// Sidebar navigation with proper spacing
<nav className="space-y-1 p-4">
  <NavItem className="px-3 py-2">Dashboard</NavItem>
  <NavItem className="px-3 py-2">Orders</NavItem>
  <div className="pt-4 border-t border-gray-200">
    <NavItem className="px-3 py-2">Settings</NavItem>
  </div>
</nav>
```

## Spacing Utilities

### Margin Utilities

```css
/* Margin utilities */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }

/* Directional margins */
.mt-4 { margin-top: 1rem; }
.mr-4 { margin-right: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.ml-4 { margin-left: 1rem; }

/* Axis margins */
.mx-4 { margin-left: 1rem; margin-right: 1rem; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
```

### Padding Utilities

```css
/* Padding utilities */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }

/* Directional padding */
.pt-4 { padding-top: 1rem; }
.pr-4 { padding-right: 1rem; }
.pb-4 { padding-bottom: 1rem; }
.pl-4 { padding-left: 1rem; }

/* Axis padding */
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
```

### Space Between Utilities

```css
/* Space between child elements */
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
```

## Best Practices

### Do's

- **Use consistent spacing** from the established scale
- **Follow mobile-first** responsive spacing patterns
- **Maintain vertical rhythm** with consistent spacing
- **Use semantic spacing names** (xs, sm, md, lg, xl) in components
- **Test spacing on different screen sizes** and devices

### Don'ts

- **Don't use arbitrary spacing values** outside the scale
- **Don't mix different spacing systems** within the same component
- **Don't forget touch targets** on mobile interfaces
- **Don't create cramped layouts** with insufficient spacing
- **Don't use excessive spacing** that breaks visual relationships

### Spacing Hierarchy

```tsx
// Good: Clear spacing hierarchy
<Container className="p-8">           {/* Container padding */}
  <Stack spacing="xl">                {/* Major section spacing */}
    <h1>Page Title</h1>
    <Stack spacing="lg">              {/* Section spacing */}
      <h2>Section Title</h2>
      <Stack spacing="md">            {/* Content spacing */}
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </Stack>
    </Stack>
  </Stack>
</Container>
```

### Responsive Spacing Patterns

```tsx
// Mobile-first responsive spacing
<div className="
  p-4 sm:p-6 lg:p-8           // Responsive padding
  space-y-4 sm:space-y-6 lg:space-y-8  // Responsive vertical spacing
  max-w-sm sm:max-w-md lg:max-w-lg      // Responsive width
">
  <ResponsiveContent />
</div>
```

## Implementation Examples

### Spacing Hook

```tsx
function useSpacing() {
  const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') => {
    const spacingMap = {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
      '3xl': '4rem'    // 64px
    };
    
    return spacingMap[size];
  };

  const getResponsiveSpacing = (mobile: string, tablet?: string, desktop?: string) => {
    let classes = `space-y-${mobile}`;
    if (tablet) classes += ` sm:space-y-${tablet}`;
    if (desktop) classes += ` lg:space-y-${desktop}`;
    return classes;
  };

  return { getSpacing, getResponsiveSpacing };
}
```

### Spacing Component

```tsx
interface SpacerProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  direction?: 'horizontal' | 'vertical';
  responsive?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
}

function Spacer({ size, direction = 'vertical', responsive }: SpacerProps) {
  const getClasses = () => {
    const baseClass = direction === 'vertical' ? 'h-' : 'w-';
    let classes = `${baseClass}${size}`;
    
    if (responsive) {
      Object.entries(responsive).forEach(([breakpoint, value]) => {
        classes += ` ${breakpoint}:${baseClass}${value}`;
      });
    }
    
    return classes;
  };

  return <div className={getClasses()} />;
}

// Usage
<div>
  <Content1 />
  <Spacer size="lg" responsive={{ md: 'xl', lg: '2xl' }} />
  <Content2 />
</div>
```