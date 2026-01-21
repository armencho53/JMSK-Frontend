# Responsive Components

Components specifically designed for responsive behavior and cross-device compatibility.

## ResponsiveContainer

An enhanced container component with responsive sizing and theme integration.

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
| `size` | `'mobile' \| 'tablet' \| 'desktop' \| 'wide' \| 'full'` | `'desktop'` | Container size variant |
| `responsive` | `boolean` | `true` | Enable responsive behavior |
| `padding` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `as` | `ElementType` | `'div'` | HTML element type |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Container content |

### Size Variants

- **mobile**: Max-width 100%, optimized for mobile devices
- **tablet**: Max-width 48rem (768px), optimized for tablets
- **desktop**: Max-width 64rem (1024px), optimized for desktop
- **wide**: Max-width 80rem (1280px), for wide layouts
- **full**: Full width, no max-width constraint

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

// Fixed container for specific content
<ResponsiveContainer size="tablet" responsive={false}>
  <p>This content stays at tablet width</p>
</ResponsiveContainer>

// Full-width container with custom padding
<ResponsiveContainer size="full" padding="xl">
  <h1>Full Width Hero Section</h1>
</ResponsiveContainer>

// Semantic container as main element
<ResponsiveContainer as="main" size="desktop">
  <PageContent />
</ResponsiveContainer>
```

## ResponsiveTable

A table component that adapts to different screen sizes with column filtering and mobile-friendly layouts.

### Usage

```tsx
import { ResponsiveTable } from '@/components/ui';

<ResponsiveTable
  columns={columns}
  data={orders}
  mobileColumns={['customer', 'status', 'total']}
  breakpoint="md"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | `[]` | Table column definitions |
| `data` | `any[]` | `[]` | Table data |
| `mobileColumns` | `string[]` | - | Columns to show on mobile |
| `tabletColumns` | `string[]` | - | Columns to show on tablet |
| `breakpoint` | `'sm' \| 'md' \| 'lg'` | `'md'` | Responsive breakpoint |
| `stackOnMobile` | `boolean` | `false` | Stack rows vertically on mobile |
| `showExpandButton` | `boolean` | `true` | Show expand button for hidden columns |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `pagination` | `boolean \| PaginationConfig` | `false` | Enable pagination |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Orders table with mobile optimization
const orderColumns = [
  { key: 'id', title: 'Order ID', sortable: true },
  { key: 'customer', title: 'Customer', sortable: true },
  { key: 'status', title: 'Status', render: (status) => <Status status={status} /> },
  { key: 'total', title: 'Total', render: (total) => `$${total.toFixed(2)}` },
  { key: 'dueDate', title: 'Due Date', sortable: true },
  { key: 'actions', title: 'Actions', render: (_, row) => <OrderActions order={row} /> }
];

<ResponsiveTable
  columns={orderColumns}
  data={orders}
  mobileColumns={['customer', 'status', 'total']}
  tabletColumns={['customer', 'status', 'total', 'dueDate']}
  breakpoint="md"
  sortable
  pagination={{ pageSize: 10 }}
/>

// Stacked mobile layout
<ResponsiveTable
  columns={customerColumns}
  data={customers}
  stackOnMobile={true}
  mobileColumns={['name', 'email', 'status']}
  showExpandButton={false}
/>
```

## TouchTarget

A component that ensures touch-friendly interaction areas with proper sizing.

### Usage

```tsx
import { TouchTarget } from '@/components/ui';

<TouchTarget size="default" as="button" onClick={handleClick}>
  <Icon />
</TouchTarget>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'default' \| 'lg'` | `'default'` | Touch target size |
| `as` | `ElementType` | `'div'` | HTML element type |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Target content |

### Size Variants

- **default**: 44px minimum (WCAG AA compliant)
- **lg**: 56px minimum (enhanced accessibility)

### Examples

```tsx
// Icon button with proper touch target
<TouchTarget as="button" onClick={toggleMenu}>
  <MenuIcon className="w-6 h-6" />
</TouchTarget>

// Large touch target for primary actions
<TouchTarget size="lg" as="button" onClick={createOrder}>
  <PlusIcon className="w-8 h-8" />
  <span className="ml-2">New Order</span>
</TouchTarget>

// Link with touch-friendly area
<TouchTarget as="a" href="/orders/123">
  <OrderCard order={order} />
</TouchTarget>
```

## DesktopLayout

A layout component optimized for desktop screens with advanced features.

### Usage

```tsx
import { DesktopLayout } from '@/components/ui';

<DesktopLayout
  sidebar={<Navigation />}
  header={<Header />}
  footer={<Footer />}
>
  <PageContent />
</DesktopLayout>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebar` | `ReactNode` | - | Sidebar content |
| `header` | `ReactNode` | - | Header content |
| `footer` | `ReactNode` | - | Footer content |
| `sidebarWidth` | `string` | `'16rem'` | Sidebar width |
| `sidebarCollapsed` | `boolean` | `false` | Collapsed sidebar state |
| `headerHeight` | `string` | `'4rem'` | Header height |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Main content |

### Examples

```tsx
// Full desktop layout
<DesktopLayout
  sidebar={
    <Navigation
      isCollapsed={sidebarCollapsed}
      onToggle={setSidebarCollapsed}
    />
  }
  header={
    <Header
      user={currentUser}
      onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
    />
  }
  sidebarCollapsed={sidebarCollapsed}
>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/orders" element={<Orders />} />
  </Routes>
</DesktopLayout>

// Layout without footer
<DesktopLayout
  sidebar={<SimpleSidebar />}
  header={<SimpleHeader />}
  sidebarWidth="12rem"
>
  <MainContent />
</DesktopLayout>
```

## Responsive Patterns

### Adaptive Grid Layout

```tsx
function ResponsiveGrid({ items }) {
  return (
    <ResponsiveContainer size="desktop">
      <Grid 
        cols={{ 
          xs: 1,      // 1 column on mobile
          sm: 2,      // 2 columns on small tablets
          md: 3,      // 3 columns on tablets
          lg: 4,      // 4 columns on desktop
          xl: 5       // 5 columns on large screens
        }} 
        gap="md"
      >
        {items.map(item => (
          <Card key={item.id} hoverable>
            <Card.Body>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card.Body>
          </Card>
        ))}
      </Grid>
    </ResponsiveContainer>
  );
}
```

### Mobile-First Form Layout

```tsx
function ResponsiveForm() {
  return (
    <ResponsiveContainer size="tablet">
      <form>
        <Stack spacing="lg">
          {/* Single column on mobile, two columns on tablet+ */}
          <Grid cols={{ xs: 1, md: 2 }} gap="md">
            <Input label="First Name" required />
            <Input label="Last Name" required />
          </Grid>
          
          <Input label="Email" type="email" required />
          
          {/* Address fields - stack on mobile */}
          <Grid cols={{ xs: 1, sm: 2 }} gap="md">
            <Input label="City" />
            <Input label="Postal Code" />
          </Grid>
          
          {/* Action buttons - stack on mobile, inline on desktop */}
          <Flex 
            direction={{ xs: 'column', sm: 'row' }} 
            justify="end" 
            gap="sm"
          >
            <Button variant="secondary" fullWidth={{ xs: true, sm: false }}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth={{ xs: true, sm: false }}>
              Save
            </Button>
          </Flex>
        </Stack>
      </form>
    </ResponsiveContainer>
  );
}
```

### Responsive Dashboard

```tsx
function ResponsiveDashboard() {
  return (
    <ResponsiveContainer size="wide">
      <Stack spacing="xl">
        {/* Metrics - 1 column mobile, 2 tablet, 4 desktop */}
        <Grid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          <MetricCard title="Total Orders" value="156" />
          <MetricCard title="Revenue" value="$24,580" />
          <MetricCard title="Pending" value="23" />
          <MetricCard title="Completed" value="133" />
        </Grid>
        
        {/* Charts - stack on mobile, side-by-side on desktop */}
        <Grid cols={{ xs: 1, lg: 2 }} gap="lg">
          <Card>
            <Card.Header>
              <h3>Orders Over Time</h3>
            </Card.Header>
            <Card.Body>
              <OrdersChart />
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h3>Revenue Breakdown</h3>
            </Card.Header>
            <Card.Body>
              <RevenueChart />
            </Card.Body>
          </Card>
        </Grid>
        
        {/* Recent orders table */}
        <Card>
          <Card.Header>
            <h3>Recent Orders</h3>
          </Card.Header>
          <Card.Body padding="none">
            <ResponsiveTable
              columns={orderColumns}
              data={recentOrders}
              mobileColumns={['customer', 'status', 'total']}
              pagination={{ pageSize: 5 }}
            />
          </Card.Body>
        </Card>
      </Stack>
    </ResponsiveContainer>
  );
}
```

### Responsive Navigation Hook

```tsx
function useResponsiveLayout() {
  const [screenSize, setScreenSize] = useState('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleNavigation: () => {
      if (isMobile) {
        setMobileMenuOpen(!mobileMenuOpen);
      } else {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    }
  };
}
```

### Responsive Image Gallery

```tsx
function ResponsiveImageGallery({ images }) {
  const { isMobile, isTablet } = useResponsiveLayout();
  
  const getColumns = () => {
    if (isMobile) return { xs: 1, sm: 2 };
    if (isTablet) return { xs: 2, md: 3 };
    return { xs: 2, sm: 3, lg: 4, xl: 5 };
  };

  return (
    <ResponsiveContainer size="wide">
      <PhotoGallery
        images={images}
        columns={getColumns()}
        gap={isMobile ? 'sm' : 'md'}
        aspectRatio="square"
        showLightbox={true}
      />
    </ResponsiveContainer>
  );
}
```

## Best Practices

### Mobile-First Design

```tsx
// Good: Mobile-first responsive design
<Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</Grid>

// Avoid: Desktop-first approach
<div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
  {/* This breaks the mobile-first principle */}
</div>
```

### Touch Targets

```tsx
// Good: Proper touch targets
<TouchTarget as="button" onClick={handleAction}>
  <Icon className="w-6 h-6" />
</TouchTarget>

// Avoid: Small touch targets
<button className="p-1" onClick={handleAction}>
  <Icon className="w-4 h-4" />
</button>
```

### Responsive Typography

```tsx
// Good: Responsive text sizing
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Good: Using responsive utilities
<ResponsiveContainer size="desktop">
  <Stack spacing={{ xs: 'sm', md: 'lg' }}>
    <Content />
  </Stack>
</ResponsiveContainer>
```

### Performance Considerations

- Use CSS transforms for smooth animations
- Implement proper lazy loading for off-screen content
- Optimize images with responsive sizes
- Test on various devices and connection speeds
- Use proper caching strategies for responsive assets