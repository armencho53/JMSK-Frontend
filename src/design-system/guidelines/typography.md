# Typography Guidelines

Typography in the Modern Jewelry UI design system reflects the precision, elegance, and professionalism of the jewelry industry while maintaining excellent readability across all devices.

## Font Families

Each design theme uses carefully selected font combinations that reflect its aesthetic philosophy.

### Elegant Minimalism

#### Primary Fonts
- **Headings**: Inter - Clean, modern sans-serif with excellent readability
- **Body Text**: Inter - Consistent with headings for visual harmony
- **Accent**: Playfair Display - Elegant serif for special elements and emphasis

```css
/* Font family declarations */
.font-elegant-heading { font-family: 'Inter', system-ui, sans-serif; }
.font-elegant-body { font-family: 'Inter', system-ui, sans-serif; }
.font-elegant-accent { font-family: 'Playfair Display', serif; }
```

### Luxury Dark Mode

#### Primary Fonts
- **Headings**: Montserrat - Strong, geometric sans-serif with luxury appeal
- **Body Text**: Source Sans Pro - Highly readable with professional character
- **Accent**: Cormorant Garamond - Elegant serif for luxury feel

```css
/* Font family declarations */
.font-luxury-heading { font-family: 'Montserrat', system-ui, sans-serif; }
.font-luxury-body { font-family: 'Source Sans Pro', system-ui, sans-serif; }
.font-luxury-accent { font-family: 'Cormorant Garamond', serif; }
```

### Modern Professional

#### Primary Fonts
- **Headings**: Poppins - Modern, friendly sans-serif with geometric structure
- **Body Text**: Open Sans - Highly legible with neutral character
- **Accent**: Lora - Readable serif for emphasis and quotes

```css
/* Font family declarations */
.font-professional-heading { font-family: 'Poppins', system-ui, sans-serif; }
.font-professional-body { font-family: 'Open Sans', system-ui, sans-serif; }
.font-professional-accent { font-family: 'Lora', serif; }
```

## Type Scale

### Responsive Typography Scale

The design system uses a responsive type scale that adapts to different screen sizes:

```css
/* Base font sizes (mobile-first) */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */
.text-5xl { font-size: 3rem; line-height: 1; }           /* 48px */
.text-6xl { font-size: 3.75rem; line-height: 1; }        /* 60px */

/* Responsive scaling */
@media (min-width: 640px) {
  .text-lg { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
  .text-xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
  .text-2xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
  .text-3xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */
  .text-4xl { font-size: 3rem; line-height: 1; }           /* 48px */
  .text-5xl { font-size: 4rem; line-height: 1; }           /* 64px */
}

@media (min-width: 1024px) {
  .text-2xl { font-size: 2rem; line-height: 2.25rem; }     /* 32px */
  .text-3xl { font-size: 2.5rem; line-height: 2.75rem; }   /* 40px */
  .text-4xl { font-size: 3.5rem; line-height: 1; }         /* 56px */
  .text-5xl { font-size: 4.5rem; line-height: 1; }         /* 72px */
}
```

## Typography Hierarchy

### Heading Levels

```tsx
// H1 - Page titles, main headings
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-elegant-heading">
  Order Management
</h1>

// H2 - Section headings
<h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-elegant-heading">
  Recent Orders
</h2>

// H3 - Subsection headings
<h3 className="text-xl sm:text-2xl font-semibold font-elegant-heading">
  Order Details
</h3>

// H4 - Component headings
<h4 className="text-lg sm:text-xl font-medium font-elegant-heading">
  Customer Information
</h4>

// H5 - Small headings
<h5 className="text-base sm:text-lg font-medium font-elegant-heading">
  Shipping Address
</h5>

// H6 - Micro headings
<h6 className="text-sm sm:text-base font-medium font-elegant-heading">
  Additional Notes
</h6>
```

### Body Text Styles

```tsx
// Large body text - introductions, important content
<p className="text-lg font-elegant-body text-gray-700 leading-relaxed">
  Welcome to the jewelry manufacturing management system.
</p>

// Regular body text - standard content
<p className="text-base font-elegant-body text-gray-600 leading-normal">
  This order contains 3 items with a total weight of 45.2 grams.
</p>

// Small body text - secondary information
<p className="text-sm font-elegant-body text-gray-500 leading-normal">
  Last updated 2 hours ago by John Doe
</p>

// Caption text - labels, metadata
<span className="text-xs font-elegant-body text-gray-400 uppercase tracking-wide">
  Order Status
</span>
```

### Accent and Display Text

```tsx
// Display text - hero sections, marketing content
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-elegant-accent font-light">
  Crafting Excellence
</h1>

// Quote text - testimonials, featured content
<blockquote className="text-xl font-elegant-accent italic text-gray-600">
  "The finest jewelry deserves the finest management system."
</blockquote>

// Emphasis text - important callouts
<span className="font-elegant-accent font-medium text-lg text-blue-600">
  Premium Quality Guaranteed
</span>
```

## Font Weights

### Weight Scale

```css
.font-thin { font-weight: 100; }
.font-extralight { font-weight: 200; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }
```

### Usage Guidelines

- **Light (300)**: Large display text, elegant headings
- **Normal (400)**: Body text, standard content
- **Medium (500)**: Subheadings, emphasized text
- **Semibold (600)**: Section headings, important labels
- **Bold (700)**: Main headings, strong emphasis

## Line Height and Spacing

### Line Height Scale

```css
.leading-none { line-height: 1; }
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
```

### Usage Guidelines

- **Tight (1.25)**: Large headings, display text
- **Normal (1.5)**: Body text, standard content
- **Relaxed (1.625)**: Long-form content, articles
- **Loose (2)**: Captions, small text for better readability

### Letter Spacing

```css
.tracking-tighter { letter-spacing: -0.05em; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
```

## Responsive Typography

### Mobile-First Approach

```tsx
// Responsive heading
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

// Responsive body text
<p className="text-sm sm:text-base lg:text-lg leading-normal sm:leading-relaxed">
  This text scales appropriately across devices.
</p>

// Responsive spacing
<div className="space-y-4 sm:space-y-6 lg:space-y-8">
  <h2>Section Title</h2>
  <p>Section content with responsive spacing.</p>
</div>
```

### Breakpoint-Specific Typography

```css
/* Mobile (default) */
.hero-title {
  font-size: 2rem;
  line-height: 2.25rem;
  font-weight: 700;
}

/* Tablet */
@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
    line-height: 1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem;
    line-height: 1;
  }
}
```

## Theme-Specific Typography

### Elegant Minimalism

```tsx
function ElegantTypography() {
  return (
    <div className="font-elegant-body">
      <h1 className="font-elegant-heading text-4xl font-light text-elegant-primary-600">
        Elegant Design
      </h1>
      <p className="text-lg text-elegant-neutral-700 leading-relaxed">
        Clean and sophisticated typography for luxury jewelry applications.
      </p>
      <blockquote className="font-elegant-accent text-xl italic text-elegant-secondary-500">
        "Simplicity is the ultimate sophistication."
      </blockquote>
    </div>
  );
}
```

### Luxury Dark Mode

```tsx
function LuxuryTypography() {
  return (
    <div className="font-luxury-body bg-luxury-background-primary text-luxury-primary-200">
      <h1 className="font-luxury-heading text-4xl font-bold text-luxury-secondary-400">
        Luxury Experience
      </h1>
      <p className="text-lg text-luxury-primary-300 leading-relaxed">
        Dramatic typography that commands attention in premium environments.
      </p>
      <blockquote className="font-luxury-accent text-xl italic text-luxury-secondary-300">
        "Excellence is never an accident."
      </blockquote>
    </div>
  );
}
```

### Modern Professional

```tsx
function ProfessionalTypography() {
  return (
    <div className="font-professional-body">
      <h1 className="font-professional-heading text-4xl font-semibold text-professional-primary-900">
        Professional Standards
      </h1>
      <p className="text-lg text-professional-primary-700 leading-relaxed">
        Clear, readable typography for business-focused applications.
      </p>
      <blockquote className="font-professional-accent text-xl italic text-professional-secondary-600">
        "Quality is not an act, it is a habit."
      </blockquote>
    </div>
  );
}
```

## Accessibility Guidelines

### Contrast Requirements

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **Interactive text**: Clear focus indicators and hover states

### Font Size Guidelines

- **Minimum body text**: 16px (1rem) for optimal readability
- **Minimum interactive text**: 16px to prevent zoom on mobile
- **Maximum line length**: 45-75 characters for optimal reading

### Screen Reader Considerations

```tsx
// Proper heading hierarchy
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

// Descriptive text for screen readers
<span className="sr-only">Order status:</span>
<span className="text-green-600">Completed</span>

// Proper labeling
<label htmlFor="customer-name" className="text-sm font-medium">
  Customer Name
</label>
<input id="customer-name" type="text" />
```

## Best Practices

### Do's

- **Use consistent font families** within each theme
- **Maintain proper heading hierarchy** (h1 → h2 → h3)
- **Choose appropriate line heights** for readability
- **Test typography on various devices** and screen sizes
- **Ensure sufficient contrast** for all text elements

### Don'ts

- **Don't mix font families** from different themes
- **Don't skip heading levels** (h1 → h3 without h2)
- **Don't use too many font weights** in a single design
- **Don't make text too small** on mobile devices
- **Don't rely solely on color** to convey meaning

### Performance Optimization

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/playfair-display-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display optimization -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var.woff2') format('woff2-variations');
    font-display: swap;
    font-weight: 100 900;
  }
</style>
```

## Implementation Examples

### Typography Component

```tsx
interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  theme?: 'elegant' | 'luxury' | 'professional';
  children: ReactNode;
  className?: string;
}

function Typography({ variant, theme = 'elegant', children, className = '' }: TypographyProps) {
  const getClasses = () => {
    const themeClasses = {
      elegant: 'font-elegant-heading',
      luxury: 'font-luxury-heading',
      professional: 'font-professional-heading'
    };

    const variantClasses = {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
      h2: 'text-2xl sm:text-3xl lg:text-4xl font-semibold',
      h3: 'text-xl sm:text-2xl font-semibold',
      h4: 'text-lg sm:text-xl font-medium',
      h5: 'text-base sm:text-lg font-medium',
      h6: 'text-sm sm:text-base font-medium',
      body: 'text-base leading-normal',
      caption: 'text-xs uppercase tracking-wide'
    };

    return `${themeClasses[theme]} ${variantClasses[variant]} ${className}`;
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return (
    <Component className={getClasses()}>
      {children}
    </Component>
  );
}
```

### Responsive Text Hook

```tsx
function useResponsiveText() {
  const [fontSize, setFontSize] = useState('base');

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setFontSize('sm');
      } else if (width < 1024) {
        setFontSize('base');
      } else {
        setFontSize('lg');
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return fontSize;
}
```