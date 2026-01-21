# Modern Jewelry UI Design System

A comprehensive design system for jewelry manufacturing applications, featuring three distinct themes and a complete component library.

## Quick Start

```tsx
import { Button, Card, Container } from '@/components/ui';

// Use components with professional theme
function App() {
  return (
    <Container size="desktop">
      <Card>
        <Button variant="primary">Get Started</Button>
      </Card>
    </Container>
  );
}
```

## Design Theme

### Professional Theme
Contemporary business interface with jewelry industry color inspiration and clean functionality. This is the single theme used throughout the application for consistency and maintainability.

## Component Categories

- **[Layout Components](./components/layout.md)** - Container, Grid, Stack, Flex
- **[Form Components](./components/forms.md)** - Input, Select, Button, DatePicker, FileUpload
- **[Data Display](./components/data-display.md)** - Table, Card, Status, Image
- **[Navigation](./components/navigation.md)** - Navigation, Header, MobileNavigation
- **[Feedback](./components/feedback.md)** - Modal, ConfirmationDialog, LoadingOverlay
- **[Media](./components/media.md)** - PhotoGallery, MediaGallery, FilePreview
- **[Responsive](./components/responsive.md)** - ResponsiveContainer, ResponsiveTable, TouchTarget

## Design Guidelines

- **[Colors](./guidelines/colors.md)** - Color palettes and usage
- **[Typography](./guidelines/typography.md)** - Font scales and hierarchy
- **[Spacing](./guidelines/spacing.md)** - Layout and spacing principles
- **[Accessibility](./guidelines/accessibility.md)** - WCAG compliance and best practices

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Import Components**
   ```tsx
   import { Button, Card } from '@/components/ui';
   ```

3. **Apply Theme**
   ```tsx
   import { applyTheme } from '@/lib/theme';
   applyTheme('elegant');
   ```

4. **Use Components**
   ```tsx
   <Button variant="primary" size="lg">
     Click me
   </Button>
   ```

## Development

- **Storybook**: `npm run storybook` (when available)
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Test**: `npm run test`

## Contributing

When adding new components:

1. Follow the established patterns in `/components/ui/`
2. Include TypeScript interfaces
3. Support all three themes
4. Add responsive design
5. Include accessibility features
6. Document props and usage examples