# Data Display Components

Components for displaying and organizing data in tables, cards, and other structured formats.

## Table

An enhanced table component with sorting, pagination, and responsive behavior.

### Usage

```tsx
import { Table } from '@/components/ui';

<Table
  columns={columns}
  data={orders}
  sortable
  pagination
  onRowClick={handleRowClick}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | `[]` | Table column definitions |
| `data` | `any[]` | `[]` | Table data |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `pagination` | `boolean \| PaginationConfig` | `false` | Enable pagination |
| `selectable` | `boolean` | `false` | Enable row selection |
| `loading` | `boolean` | `false` | Show loading state |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `onRowClick` | `(row: any) => void` | - | Row click handler |
| `onSelectionChange` | `(selected: any[]) => void` | - | Selection change handler |
| `className` | `string` | - | Additional CSS classes |

### Column Definition

```tsx
interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}
```

### Examples

```tsx
// Basic table
const columns = [
  { key: 'id', title: 'Order ID', sortable: true },
  { key: 'customer', title: 'Customer', sortable: true },
  { key: 'status', title: 'Status', render: (status) => <StatusBadge status={status} /> },
  { key: 'total', title: 'Total', render: (total) => `$${total.toFixed(2)}` }
];

<Table
  columns={columns}
  data={orders}
  sortable
  pagination={{ pageSize: 10 }}
  onRowClick={handleOrderClick}
/>

// Selectable table
<Table
  columns={columns}
  data={supplies}
  selectable
  onSelectionChange={setSelectedSupplies}
  loading={isLoading}
/>

// Custom empty state
<Table
  columns={columns}
  data={[]}
  emptyMessage="No orders found. Create your first order to get started."
/>
```

## Card

A flexible card component for displaying grouped information with multiple variants and subcomponents.

### Usage

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle as="h3">Order #12345</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Order details...</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'glass'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `hoverable` | `boolean` | `false` | Add hover effects |
| `onClick` | `() => void` | - | Click handler (makes card interactive) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Card content |

### Subcomponents

#### CardHeader
Card header section with bottom border styling.

```tsx
<CardHeader className="custom-header">
  <CardTitle>Header Content</CardTitle>
</CardHeader>
```

#### CardTitle
Semantic heading component for card titles.

```tsx
<CardTitle as="h2" className="custom-title">
  Card Title
</CardTitle>
```

**Props:**
- `as`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` (default: `'h3'`)
- `className`: Additional CSS classes
- `children`: Title content

#### CardContent
Main card content area with configurable padding.

```tsx
<CardContent padding="lg">
  <p>Main card content</p>
</CardContent>
```

**Props:**
- `padding`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `className`: Additional CSS classes
- `children`: Content

#### CardFooter
Card footer section with top border styling.

```tsx
<CardFooter className="custom-footer">
  <Button>Action</Button>
</CardFooter>
```

### Examples

```tsx
// Order card with all subcomponents
<Card variant="elevated" hoverable>
  <CardHeader>
    <Flex justify="between" align="center">
      <CardTitle as="h3">Order #12345</CardTitle>
      <StatusBadge status="in-progress" />
    </Flex>
  </CardHeader>
  <CardContent>
    <Stack spacing="sm">
      <p><strong>Customer:</strong> John Doe</p>
      <p><strong>Metal:</strong> 18K Gold</p>
      <p><strong>Weight:</strong> 15.5g</p>
      <p><strong>Due:</strong> March 15, 2024</p>
    </Stack>
  </CardContent>
  <CardFooter>
    <Flex gap="sm">
      <Button variant="secondary" size="sm">Edit</Button>
      <Button variant="primary" size="sm">View Details</Button>
    </Flex>
  </CardFooter>
</Card>

// Interactive clickable card
<Card onClick={() => navigate(`/orders/${order.id}`)} hoverable>
  <CardContent>
    <CardTitle as="h4">{order.customerName}</CardTitle>
    <p>{order.description}</p>
  </CardContent>
</Card>

// Metric card with glass variant
<Card variant="glass" padding="lg">
  <CardContent padding="none">
    <Stack spacing="xs" align="center">
      <h2 className="text-3xl font-bold">$12,450</h2>
      <p className="text-gray-600">Total Revenue</p>
      <span className="text-green-600 text-sm">+12% from last month</span>
    </Stack>
  </CardContent>
</Card>

// Outlined card with custom padding
<Card variant="outlined">
  <CardHeader>
    <CardTitle>Revenue Summary</CardTitle>
  </CardHeader>
  <CardContent padding="xl">
    <Stack spacing="md">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600">$12,450</h2>
        <p className="text-gray-600 mt-2">Total Revenue This Month</p>
      </div>
      <div className="flex justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          +12% from last month
        </span>
      </div>
    </Stack>
  </CardContent>
</Card>
```

## Status

A status badge component for displaying states and conditions.

### Usage

```tsx
import { Status } from '@/components/ui';

<Status status="completed" />
<Status status="pending" size="lg" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `StatusType` | - | Status value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `variant` | `'badge' \| 'dot' \| 'pill'` | `'badge'` | Display variant |
| `className` | `string` | - | Additional CSS classes |

### Status Types

```tsx
type StatusType = 
  | 'pending' | 'in-progress' | 'completed' | 'cancelled'
  | 'draft' | 'active' | 'inactive' | 'archived'
  | 'success' | 'warning' | 'error' | 'info';
```

### Examples

```tsx
// Order statuses
<Status status="pending" />
<Status status="in-progress" />
<Status status="completed" />
<Status status="cancelled" />

// Different variants
<Status status="active" variant="dot" />
<Status status="warning" variant="pill" />
<Status status="error" variant="badge" size="lg" />

// Custom status with icon
<Status status="completed" size="lg">
  <CheckIcon className="w-4 h-4 mr-1" />
  Completed
</Status>
```

## Image

A responsive image component with loading states and error handling.

### Usage

```tsx
import { Image } from '@/components/ui';

<Image
  src="/jewelry/ring-001.jpg"
  alt="Gold Ring"
  aspectRatio="square"
  priority
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'landscape'` | - | Aspect ratio |
| `objectFit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | Object fit behavior |
| `priority` | `boolean` | `false` | Priority loading |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading behavior |
| `placeholder` | `string` | - | Placeholder image |
| `onLoad` | `() => void` | - | Load handler |
| `onError` | `() => void` | - | Error handler |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Product image
<Image
  src={product.imageUrl}
  alt={product.name}
  aspectRatio="square"
  objectFit="cover"
  placeholder="/placeholder-jewelry.jpg"
/>

// Hero image with priority loading
<Image
  src="/hero-jewelry.jpg"
  alt="Luxury Jewelry Collection"
  aspectRatio="landscape"
  priority
  className="w-full h-64"
/>

// Gallery thumbnail
<Image
  src={image.thumbnail}
  alt={image.description}
  aspectRatio="square"
  className="w-20 h-20 rounded-lg cursor-pointer"
  onClick={() => openLightbox(image)}
/>
```

## Data Patterns

### Dashboard Cards

```tsx
function DashboardMetrics() {
  const metrics = [
    { title: 'Total Orders', value: 156, change: '+12%', trend: 'up' },
    { title: 'Revenue', value: '$24,580', change: '+8%', trend: 'up' },
    { title: 'Pending Orders', value: 23, change: '-5%', trend: 'down' },
    { title: 'Completed', value: 133, change: '+15%', trend: 'up' }
  ];

  return (
    <Grid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md">
      {metrics.map((metric) => (
        <Card key={metric.title} variant="elevated">
          <Card.Body>
            <Stack spacing="xs">
              <p className="text-sm text-gray-600">{metric.title}</p>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <Flex align="center" gap="xs">
                <Status 
                  status={metric.trend === 'up' ? 'success' : 'warning'} 
                  variant="dot" 
                />
                <span className="text-sm">{metric.change}</span>
              </Flex>
            </Stack>
          </Card.Body>
        </Card>
      ))}
    </Grid>
  );
}
```

### Data Table with Actions

```tsx
function OrdersTable() {
  const columns = [
    { key: 'id', title: 'Order ID', sortable: true },
    { key: 'customer', title: 'Customer', sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      render: (status) => <Status status={status} />
    },
    { 
      key: 'total', 
      title: 'Total', 
      render: (total) => `$${total.toFixed(2)}`,
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, order) => (
        <Flex gap="xs">
          <Button variant="tertiary" size="sm" onClick={() => editOrder(order)}>
            Edit
          </Button>
          <Button variant="tertiary" size="sm" onClick={() => viewOrder(order)}>
            View
          </Button>
        </Flex>
      )
    }
  ];

  return (
    <Card>
      <Card.Header>
        <Flex justify="between" align="center">
          <h2>Recent Orders</h2>
          <Button variant="primary">New Order</Button>
        </Flex>
      </Card.Header>
      <Card.Body padding="none">
        <Table
          columns={columns}
          data={orders}
          sortable
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          emptyMessage="No orders found. Create your first order to get started."
        />
      </Card.Body>
    </Card>
  );
}
```

### Product Gallery

```tsx
function ProductGallery({ product }) {
  return (
    <Card>
      <Card.Body>
        <Stack spacing="md">
          <Image
            src={product.mainImage}
            alt={product.name}
            aspectRatio="square"
            priority
            className="w-full rounded-lg"
          />
          
          <Grid cols={4} gap="sm">
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image.thumbnail}
                alt={`${product.name} view ${index + 1}`}
                aspectRatio="square"
                className="cursor-pointer rounded border-2 border-transparent hover:border-blue-500"
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </Grid>
          
          <Stack spacing="sm">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <Flex align="center" gap="md">
              <Status status={product.status} />
              <span className="text-lg font-bold">${product.price}</span>
            </Flex>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
}
```

## Best Practices

### Performance

- Use `priority` loading for above-the-fold images
- Implement proper lazy loading for large datasets
- Use pagination for tables with many rows
- Optimize image sizes and formats

### Accessibility

- Provide meaningful alt text for images
- Use proper heading hierarchy in cards
- Ensure table headers are properly associated
- Include loading and error states

### User Experience

- Show loading states during data fetching
- Provide clear empty states with actionable messages
- Use consistent status colors and meanings
- Make interactive elements clearly clickable