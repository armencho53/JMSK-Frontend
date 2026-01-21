# Component Gallery

A visual showcase of all components in the Modern Jewelry UI design system with live examples and code snippets.

## Layout Components

### Container

Responsive containers for organizing page content.

```tsx
import { Container } from '@/components/ui';

// Different container sizes
<Container size="mobile">Mobile content</Container>
<Container size="tablet">Tablet content</Container>
<Container size="desktop">Desktop content</Container>
<Container size="wide">Wide content</Container>
<Container size="full">Full width content</Container>
```

### Grid

Flexible grid system for responsive layouts.

```tsx
import { Grid } from '@/components/ui';

// Responsive grid
<Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### Stack

Vertical layout with consistent spacing.

```tsx
import { Stack } from '@/components/ui';

<Stack spacing="lg">
  <h1>Title</h1>
  <p>Description</p>
  <Button>Action</Button>
</Stack>
```

### Flex

Horizontal layout with flexible alignment.

```tsx
import { Flex } from '@/components/ui';

<Flex justify="between" align="center">
  <h1>Page Title</h1>
  <Button>Action</Button>
</Flex>
```

## Form Components

### Button

Versatile button component with multiple variants.

```tsx
import { Button } from '@/components/ui';

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="danger">Delete</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Button states
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

### Input

Form input with floating labels and validation.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Customer Name"
  placeholder="Enter customer name"
  value={name}
  onChange={setName}
  error={nameError}
  required
/>
```

### Select

Custom select dropdown with search functionality.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Metal Type"
  options={[
    { value: 'gold-24k', label: '24K Gold' },
    { value: 'gold-18k', label: '18K Gold' },
    { value: 'silver-925', label: '925 Silver' }
  ]}
  value={metalType}
  onChange={setMetalType}
  searchable
/>
```

### DatePicker

Calendar-based date selection.

```tsx
import { DatePicker } from '@/components/ui';

<DatePicker
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
  minDate={new Date()}
/>
```

### FileUpload

Drag-and-drop file upload area.

```tsx
import { FileUpload } from '@/components/ui';

<FileUpload
  label="Product Images"
  accept="image/*"
  multiple
  onFilesChange={setFiles}
/>
```

## Data Display Components

### Table

Enhanced table with sorting and pagination.

```tsx
import { Table } from '@/components/ui';

const columns = [
  { key: 'id', title: 'Order ID', sortable: true },
  { key: 'customer', title: 'Customer', sortable: true },
  { key: 'status', title: 'Status', render: (status) => <Status status={status} /> },
  { key: 'total', title: 'Total', render: (total) => `$${total.toFixed(2)}` }
];

<Table
  columns={columns}
  data={orders}
  sortable
  pagination={{ pageSize: 10 }}
  onRowClick={handleRowClick}
/>
```

### Card

Flexible card component for content organization with multiple variants and subcomponents.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

// Basic card with all subcomponents
<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle as="h3">Order #12345</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Order details and information</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">View Details</Button>
  </CardFooter>
</Card>

// Interactive clickable card
<Card onClick={() => navigate('/order/12345')} hoverable>
  <CardContent>
    <CardTitle>Quick Order Card</CardTitle>
    <p>Click anywhere to view details</p>
  </CardContent>
</Card>

// Glass variant card
<Card variant="glass" padding="lg">
  <CardContent padding="none">
    <h3>Glass Effect Card</h3>
    <p>Translucent background with blur effect</p>
  </CardContent>
</Card>
```

### Status

Status badges for displaying states.

```tsx
import { Status } from '@/components/ui';

<Status status="completed" />
<Status status="pending" />
<Status status="in-progress" />
<Status status="cancelled" />
```

### Image

Responsive image component with loading states.

```tsx
import { Image } from '@/components/ui';

<Image
  src="/jewelry/ring-001.jpg"
  alt="Gold Ring"
  aspectRatio="square"
  priority
  className="w-full rounded-lg"
/>
```

## Navigation Components

### Navigation

Main sidebar navigation with collapsible behavior.

```tsx
import { Navigation } from '@/components';

<Navigation
  isCollapsed={isCollapsed}
  onToggle={setIsCollapsed}
  currentPath="/orders"
/>
```

### Header

Application header with search and user profile.

```tsx
import { Header } from '@/components';

<Header
  user={currentUser}
  onMenuToggle={toggleSidebar}
  onSearch={handleSearch}
/>
```

### MobileNavigation

Mobile-optimized navigation drawer.

```tsx
import { MobileNavigation } from '@/components/ui';

<MobileNavigation
  isOpen={isMobileMenuOpen}
  onClose={closeMobileMenu}
  currentPath="/orders"
/>
```

### Breadcrumbs

Breadcrumb navigation for page hierarchy.

```tsx
import { Breadcrumbs } from '@/components';

<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders', href: '/orders' },
    { label: 'Order #12345' }
  ]}
/>
```

## Feedback Components

### Modal

Flexible modal with focus management.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="Edit Order"
  size="lg"
>
  <OrderForm onSubmit={handleSubmit} />
</Modal>
```

### ConfirmationDialog

Specialized confirmation modal.

```tsx
import { ConfirmationDialog } from '@/components/ui';

<ConfirmationDialog
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Order"
  message="Are you sure you want to delete this order?"
  variant="danger"
/>
```

### LoadingOverlay

Loading state overlay.

```tsx
import { LoadingOverlay } from '@/components/ui';

<LoadingOverlay
  isVisible={isLoading}
  message="Processing order..."
/>
```

## Media Components

### PhotoGallery

Responsive photo gallery with lightbox.

```tsx
import { PhotoGallery } from '@/components/ui';

<PhotoGallery
  images={productImages}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  aspectRatio="square"
  showLightbox={true}
/>
```

### MediaGallery

Mixed media gallery for images, videos, and documents.

```tsx
import { MediaGallery } from '@/components/ui';

<MediaGallery
  items={mediaItems}
  layout="grid"
  allowUpload={true}
  onItemClick={openMediaViewer}
/>
```

### FilePreview

File preview component with download functionality.

```tsx
import { FilePreview } from '@/components/ui';

<FilePreview
  file={selectedFile}
  showDownload={true}
  onClose={closePreview}
/>
```

## Responsive Components

### ResponsiveContainer

Enhanced container with responsive behavior.

```tsx
import { ResponsiveContainer } from '@/components/ui';

<ResponsiveContainer size="desktop" responsive>
  <Grid cols={{ xs: 1, md: 2, lg: 3 }}>
    <Card>Responsive Item 1</Card>
    <Card>Responsive Item 2</Card>
    <Card>Responsive Item 3</Card>
  </Grid>
</ResponsiveContainer>
```

### ResponsiveTable

Table that adapts to different screen sizes.

```tsx
import { ResponsiveTable } from '@/components/ui';

<ResponsiveTable
  columns={columns}
  data={orders}
  mobileColumns={['customer', 'status', 'total']}
  breakpoint="md"
  stackOnMobile={true}
/>
```

### TouchTarget

Touch-friendly interaction wrapper.

```tsx
import { TouchTarget } from '@/components/ui';

<TouchTarget size="default" as="button" onClick={handleClick}>
  <MenuIcon className="w-6 h-6" />
</TouchTarget>
```

## Theme Examples

### Elegant Minimalism Theme

```tsx
// Apply elegant theme
import { applyTheme } from '@/lib/theme';
applyTheme('elegant');

// Theme-aware components
<div className="bg-elegant-neutral-50 text-elegant-neutral-900">
  <Button variant="primary" className="bg-elegant-primary-600">
    Elegant Button
  </Button>
  <Card className="bg-white border-elegant-neutral-200">
    <Card.Body>
      <h3 className="text-elegant-primary-600">Elegant Card</h3>
      <p className="text-elegant-neutral-700">Clean and sophisticated design</p>
    </Card.Body>
  </Card>
</div>
```

### Luxury Dark Mode Theme

```tsx
// Apply luxury theme
applyTheme('luxury');

// Dark theme components
<div className="bg-luxury-background-primary text-luxury-primary-200">
  <Button variant="primary" className="bg-luxury-secondary-400">
    Luxury Button
  </Button>
  <Card className="bg-luxury-surface-primary border-luxury-primary-700">
    <Card.Body>
      <h3 className="text-luxury-secondary-400">Luxury Card</h3>
      <p className="text-luxury-primary-300">Dramatic and premium feel</p>
    </Card.Body>
  </Card>
</div>
```

### Modern Professional Theme

```tsx
// Apply professional theme
applyTheme('professional');

// Professional theme components
<div className="bg-professional-background-primary text-professional-primary-900">
  <Button variant="primary" className="bg-professional-primary-900">
    Professional Button
  </Button>
  <Card className="bg-white border-professional-tertiary-300">
    <Card.Body>
      <h3 className="text-professional-primary-900">Professional Card</h3>
      <p className="text-professional-tertiary-600">Clean business interface</p>
    </Card.Body>
  </Card>
</div>
```

## Real-World Examples

### Dashboard Layout

```tsx
function DashboardExample() {
  return (
    <ResponsiveContainer size="wide">
      <Stack spacing="xl">
        {/* Metrics Grid */}
        <Grid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          <Card variant="elevated">
            <CardContent>
              <Stack spacing="xs" align="center">
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-gray-600">Total Orders</p>
                <Status status="success">+12%</Status>
              </Stack>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent>
              <Stack spacing="xs" align="center">
                <h3 className="text-2xl font-bold">$24,580</h3>
                <p className="text-gray-600">Revenue</p>
                <Status status="success">+8%</Status>
              </Stack>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent>
              <Stack spacing="xs" align="center">
                <h3 className="text-2xl font-bold">23</h3>
                <p className="text-gray-600">Pending</p>
                <Status status="warning">-5%</Status>
              </Stack>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent>
              <Stack spacing="xs" align="center">
                <h3 className="text-2xl font-bold">133</h3>
                <p className="text-gray-600">Completed</p>
                <Status status="success">+15%</Status>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle as="h2">Recent Orders</CardTitle>
              <Button variant="primary">New Order</Button>
            </Flex>
          </CardHeader>
          <CardContent padding="none">
            <Table
              columns={orderColumns}
              data={recentOrders}
              pagination={{ pageSize: 5 }}
            />
          </CardContent>
        </Card>
      </Stack>
    </ResponsiveContainer>
  );
}
```

### Order Form Modal

```tsx
function OrderFormExample() {
  return (
    <Modal isOpen={showOrderForm} onClose={closeOrderForm} title="Create Order" size="lg">
      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <Grid cols={{ xs: 1, md: 2 }} gap="md">
            <Select
              label="Customer"
              options={customers}
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              searchable
              required
            />
            <Select
              label="Metal Type"
              options={metalTypes}
              value={metalType}
              onChange={setMetalType}
              required
            />
          </Grid>
          
          <Input
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Order description..."
            required
          />
          
          <Grid cols={{ xs: 1, md: 2 }} gap="md">
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
              required
            />
            <Input
              label="Weight (grams)"
              type="number"
              value={weight}
              onChange={setWeight}
              required
            />
          </Grid>
          
          <FileUpload
            label="Reference Images"
            accept="image/*"
            multiple
            onFilesChange={setImages}
          />
          
          <Flex justify="end" gap="sm">
            <Button variant="secondary" type="button" onClick={closeOrderForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Create Order
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
```

### Product Gallery

```tsx
function ProductGalleryExample() {
  return (
    <Grid cols={{ xs: 1, lg: 2 }} gap="xl">
      {/* Image Gallery */}
      <Stack spacing="md">
        <Image
          src={product.mainImage}
          alt={product.name}
          aspectRatio="square"
          priority
          className="w-full rounded-lg"
        />
        
        <PhotoGallery
          images={product.images}
          columns={{ xs: 4 }}
          gap="sm"
          aspectRatio="square"
          showLightbox={false}
        />
      </Stack>
      
      {/* Product Details */}
      <Stack spacing="lg">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">${product.price}</p>
        </div>
        
        <Card>
          <CardContent>
            <Stack spacing="md">
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <Grid cols={2} gap="sm">
                  <div>
                    <span className="text-sm text-gray-600">Metal:</span>
                    <p className="font-medium">{product.metal}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Weight:</span>
                    <p className="font-medium">{product.weight}g</p>
                  </div>
                </Grid>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Status status={product.status} className="mt-1" />
              </div>
            </Stack>
          </CardContent>
        </Card>
        
        <Flex gap="sm">
          <Button variant="secondary" fullWidth>
            Add to Quote
          </Button>
          <Button variant="primary" fullWidth>
            Order Now
          </Button>
        </Flex>
      </Stack>
    </Grid>
  );
}
```

## Component Playground

To see these components in action, you can create a playground page:

```tsx
// src/pages/ComponentPlayground.tsx
import { useState } from 'react';
import { applyTheme, getCurrentTheme } from '@/lib/theme';
import * as UI from '@/components/ui';

function ComponentPlayground() {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  
  const handleThemeChange = (theme) => {
    applyTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <UI.ResponsiveContainer size="wide">
      <UI.Stack spacing="xl">
        {/* Theme Selector */}
        <UI.Card>
          <UI.Card.Header>
            <h2>Theme Selector</h2>
          </UI.Card.Header>
          <UI.Card.Body>
            <UI.Select
              label="Choose Theme"
              value={currentTheme}
              onChange={handleThemeChange}
              options={[
                { value: 'elegant', label: 'Elegant Minimalism' },
                { value: 'luxury', label: 'Luxury Dark Mode' },
                { value: 'professional', label: 'Modern Professional' }
              ]}
            />
          </UI.Card.Body>
        </UI.Card>
        
        {/* Component Examples */}
        <UI.Grid cols={{ xs: 1, lg: 2 }} gap="lg">
          {/* Buttons */}
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle as="h3">Buttons</UI.CardTitle>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Stack spacing="md">
                <UI.Flex gap="sm" wrap>
                  <UI.Button variant="primary">Primary</UI.Button>
                  <UI.Button variant="secondary">Secondary</UI.Button>
                  <UI.Button variant="tertiary">Tertiary</UI.Button>
                  <UI.Button variant="danger">Danger</UI.Button>
                </UI.Flex>
                
                <UI.Flex gap="sm" wrap>
                  <UI.Button size="sm">Small</UI.Button>
                  <UI.Button size="md">Medium</UI.Button>
                  <UI.Button size="lg">Large</UI.Button>
                </UI.Flex>
              </UI.Stack>
            </UI.CardContent>
          </UI.Card>
          
          {/* Status Badges */}
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle as="h3">Status Badges</UI.CardTitle>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Flex gap="sm" wrap>
                <UI.Status status="completed" />
                <UI.Status status="pending" />
                <UI.Status status="in-progress" />
                <UI.Status status="cancelled" />
              </UI.Flex>
            </UI.CardContent>
          </UI.Card>
        </UI.Grid>
      </UI.Stack>
    </UI.ResponsiveContainer>
  );
}

export default ComponentPlayground;
```

This component gallery provides a comprehensive overview of all available components with practical examples and usage patterns.

## Testing and Validation

All components in this gallery are validated through comprehensive property-based testing:

### Dashboard Components Testing

Dashboard components undergo rigorous validation to ensure:
- **Proper card organization** with consistent structure and semantic markup
- **Stats layout consistency** maintaining uniform styling across different data sets
- **Visual styling separation** with distinct classes for section organization
- **Grid configuration adaptation** responding correctly to different card counts and screen sizes
- **Semantic markup validation** ensuring proper heading hierarchy and accessibility

### Form Components Testing

Form components undergo rigorous validation to ensure:
- **Proper field grouping markup** with semantic HTML structure
- **Validation CSS classes** and error message display
- **Modal form structure** maintaining consistency across contexts
- **Accessibility attributes** including ARIA labels and keyboard navigation
- **Validation state changes** with proper user feedback

### Design System Consistency

The design system maintains consistency through automated testing of:
- **CSS custom properties usage** across all themes
- **Theme switching behavior** and property updates
- **Naming convention compliance** for CSS variables
- **Component API consistency** across similar components

### Running Component Tests

```bash
# Test dashboard components
npm test -- --testNamePattern="Dashboard Card Organization"

# Test all form components
npm test -- --testNamePattern="Form Structure"

# Test theme consistency
npm test -- --testNamePattern="CSS Custom Properties"

# Test specific components
npm test -- --testPathPatterns="Button|Input|Select"
```

This component gallery provides a comprehensive overview of all available components with practical examples and usage patterns.