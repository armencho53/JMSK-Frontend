# Layout Components

Layout components provide the foundation for organizing content and creating responsive designs.

## Container

A responsive container component that provides consistent padding and max-width constraints.

### Usage

```tsx
import { Container } from '@/components/ui';

<Container size="desktop">
  <h1>Page Content</h1>
</Container>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'mobile' \| 'tablet' \| 'desktop' \| 'wide' \| 'full'` | `'desktop'` | Container size variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Container content |

### Examples

```tsx
// Different sizes
<Container size="mobile">Mobile content</Container>
<Container size="tablet">Tablet content</Container>
<Container size="desktop">Desktop content</Container>
<Container size="wide">Wide content</Container>
<Container size="full">Full width content</Container>

// Different padding
<Container padding="none">No padding</Container>
<Container padding="sm">Small padding</Container>
<Container padding="lg">Large padding</Container>
```

## Grid

A flexible grid system for creating responsive layouts.

### Usage

```tsx
import { Grid } from '@/components/ui';

<Grid cols={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `number \| { xs?: number, sm?: number, md?: number, lg?: number, xl?: number }` | `1` | Number of columns |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between items |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Grid items |

### Examples

```tsx
// Simple grid
<Grid cols={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Responsive grid
<Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
  <Card>Responsive Item 1</Card>
  <Card>Responsive Item 2</Card>
  <Card>Responsive Item 3</Card>
</Grid>
```

## Stack

A vertical layout component for stacking elements with consistent spacing.

### Usage

```tsx
import { Stack } from '@/components/ui';

<Stack spacing="md">
  <h1>Title</h1>
  <p>Description</p>
  <Button>Action</Button>
</Stack>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spacing between items |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | Horizontal alignment |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Stack items |

### Examples

```tsx
// Different spacing
<Stack spacing="xs">Tight spacing</Stack>
<Stack spacing="xl">Loose spacing</Stack>

// Different alignment
<Stack align="center">Centered items</Stack>
<Stack align="start">Left-aligned items</Stack>
```

## Flex

A flexible layout component for horizontal arrangements.

### Usage

```tsx
import { Flex } from '@/components/ui';

<Flex justify="between" align="center">
  <h1>Title</h1>
  <Button>Action</Button>
</Flex>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'column'` | `'row'` | Flex direction |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | `'start'` | Justify content |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | Align items |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between items |
| `wrap` | `boolean` | `false` | Allow wrapping |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Flex items |

### Examples

```tsx
// Header layout
<Flex justify="between" align="center">
  <h1>Page Title</h1>
  <Button>Action</Button>
</Flex>

// Button group
<Flex gap="sm">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</Flex>

// Vertical layout
<Flex direction="column" gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Flex>
```

## ResponsiveContainer

An enhanced container with responsive behavior and theme integration.

### Usage

```tsx
import { ResponsiveContainer } from '@/components/ui';

<ResponsiveContainer size="desktop" responsive>
  <h1>Responsive Content</h1>
</ResponsiveContainer>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'mobile' \| 'tablet' \| 'desktop' \| 'wide' \| 'full'` | `'desktop'` | Container size |
| `responsive` | `boolean` | `true` | Enable responsive behavior |
| `padding` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Container content |

### Examples

```tsx
// Responsive container that adapts to screen size
<ResponsiveContainer size="desktop" responsive>
  <Grid cols={{ xs: 1, md: 2, lg: 3 }}>
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
  </Grid>
</ResponsiveContainer>

// Fixed container
<ResponsiveContainer size="tablet" responsive={false}>
  <p>Fixed width content</p>
</ResponsiveContainer>
```

## Best Practices

### Layout Hierarchy

1. **Page Level**: Use `Container` or `ResponsiveContainer`
2. **Section Level**: Use `Grid` or `Stack` for content organization
3. **Component Level**: Use `Flex` for internal component layouts

### Responsive Design

```tsx
// Good: Mobile-first responsive grid
<Grid cols={{ xs: 1, sm: 2, lg: 3, xl: 4 }} gap="md">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</Grid>

// Good: Responsive container with appropriate sizing
<ResponsiveContainer size="desktop">
  <Stack spacing="lg">
    <h1>Page Title</h1>
    <Grid cols={{ xs: 1, md: 2 }} gap="md">
      <Card>Content 1</Card>
      <Card>Content 2</Card>
    </Grid>
  </Stack>
</ResponsiveContainer>
```

### Spacing Consistency

```tsx
// Good: Consistent spacing scale
<Stack spacing="md">
  <h1>Title</h1>
  <Grid cols={2} gap="md">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
  </Grid>
</Stack>

// Avoid: Mixed spacing units
<div className="mb-4">
  <h1 className="mb-2">Title</h1>
  <div className="grid grid-cols-2 gap-6">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
  </div>
</div>
```