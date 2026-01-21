# Navigation Components

Components for application navigation, including sidebars, headers, and mobile navigation.

## Navigation

The main sidebar navigation component with collapsible behavior and theme support.

### Usage

```tsx
import { Navigation } from '@/components';

<Navigation
  isCollapsed={isCollapsed}
  onToggle={setIsCollapsed}
  currentPath="/orders"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isCollapsed` | `boolean` | `false` | Collapsed state |
| `onToggle` | `(collapsed: boolean) => void` | - | Toggle handler |
| `currentPath` | `string` | - | Current active path |
| `className` | `string` | - | Additional CSS classes |

### Navigation Items

The navigation automatically includes these sections:
- **Dashboard** - Overview and metrics
- **Orders** - Order management
- **Customers** - Customer database
- **Supplies** - Inventory management
- **Manufacturing** - Production workflow
- **Shipments** - Delivery tracking
- **Settings** - System configuration

### Examples

```tsx
// Basic navigation
<Navigation
  isCollapsed={false}
  onToggle={setIsCollapsed}
  currentPath={location.pathname}
/>

// Collapsed navigation
<Navigation
  isCollapsed={true}
  onToggle={setIsCollapsed}
  currentPath="/dashboard"
/>
```

## Header

The application header with user profile, search, and notifications.

### Usage

```tsx
import { Header } from '@/components';

<Header
  user={currentUser}
  onMenuToggle={toggleSidebar}
  onSearch={handleSearch}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `User` | - | Current user object |
| `onMenuToggle` | `() => void` | - | Menu toggle handler |
| `onSearch` | `(query: string) => void` | - | Search handler |
| `showSearch` | `boolean` | `true` | Show search functionality |
| `className` | `string` | - | Additional CSS classes |

### Features

- **Global Search** - Search across orders, customers, and supplies
- **User Profile Dropdown** - Profile settings and logout
- **Notifications** - System notifications and alerts
- **Theme Selector** - Switch between design themes
- **Mobile Menu Toggle** - Hamburger menu for mobile

### Examples

```tsx
// Full header
<Header
  user={currentUser}
  onMenuToggle={toggleSidebar}
  onSearch={handleGlobalSearch}
  showSearch={true}
/>

// Minimal header (no search)
<Header
  user={currentUser}
  onMenuToggle={toggleSidebar}
  showSearch={false}
/>
```

## MobileNavigation

Mobile-optimized navigation with slide-out drawer and bottom navigation.

### Usage

```tsx
import { MobileNavigation } from '@/components/ui';

<MobileNavigation
  isOpen={isMobileMenuOpen}
  onClose={closeMobileMenu}
  currentPath="/orders"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Drawer open state |
| `onClose` | `() => void` | - | Close handler |
| `currentPath` | `string` | - | Current active path |
| `showBottomNav` | `boolean` | `true` | Show bottom navigation |
| `className` | `string` | - | Additional CSS classes |

### Features

- **Slide-out Drawer** - Full navigation menu
- **Bottom Navigation** - Quick access to primary actions
- **Touch-friendly Targets** - Minimum 44px touch targets
- **Overlay** - Background overlay when open
- **Swipe Gestures** - Swipe to close (when supported)

### Examples

```tsx
// Mobile drawer navigation
<MobileNavigation
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
  currentPath={location.pathname}
/>

// With bottom navigation
<MobileNavigation
  isOpen={false}
  onClose={() => {}}
  currentPath="/dashboard"
  showBottomNav={true}
/>
```

## Breadcrumbs

Breadcrumb navigation for showing current page hierarchy.

### Usage

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

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | Breadcrumb items |
| `separator` | `ReactNode` | `'/'` | Item separator |
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbItem

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}
```

### Examples

```tsx
// Basic breadcrumbs
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders', href: '/orders' },
    { label: 'Order Details' }
  ]}
/>

// With icons
<Breadcrumbs
  items={[
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Customers', href: '/customers', icon: <UsersIcon /> },
    { label: 'John Doe', icon: <UserIcon /> }
  ]}
/>

// Custom separator
<Breadcrumbs
  items={breadcrumbItems}
  separator={<ChevronRightIcon className="w-4 h-4" />}
/>
```

## Navigation Patterns

### Layout with Navigation

```tsx
import { Navigation, Header, MobileNavigation } from '@/components';

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Navigation
          isCollapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          currentPath={location.pathname}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          user={currentUser}
          onMenuToggle={() => {
            if (isMobile) {
              setMobileMenuOpen(true);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          onSearch={handleGlobalSearch}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentPath={location.pathname}
        />
      )}
    </div>
  );
}
```

### Page with Breadcrumbs

```tsx
function OrderDetailPage({ orderId }) {
  const order = useOrder(orderId);
  
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders', href: '/orders' },
    { label: `Order #${orderId}` }
  ];

  return (
    <Container size="desktop">
      <Stack spacing="lg">
        <Breadcrumbs items={breadcrumbs} />
        
        <Flex justify="between" align="center">
          <h1>Order #{orderId}</h1>
          <Button variant="primary">Edit Order</Button>
        </Flex>
        
        <Card>
          <Card.Body>
            {/* Order details */}
          </Card.Body>
        </Card>
      </Stack>
    </Container>
  );
}
```

### Responsive Navigation Hook

```tsx
function useResponsiveNavigation() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleNavigation = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return {
    isMobile,
    sidebarCollapsed,
    mobileMenuOpen,
    toggleNavigation,
    closeMobileMenu: () => setMobileMenuOpen(false)
  };
}
```

## Best Practices

### Accessibility

- Use semantic navigation elements (`<nav>`, `<ul>`, `<li>`)
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works correctly
- Include skip links for screen readers

### Mobile Experience

- Use touch-friendly target sizes (minimum 44px)
- Provide swipe gestures where appropriate
- Consider thumb-friendly placement for bottom navigation
- Test on various device sizes

### Performance

- Lazy load navigation icons when possible
- Use CSS transforms for smooth animations
- Avoid layout shifts during navigation state changes
- Optimize for fast navigation transitions

### User Experience

- Show clear active states for current page
- Provide visual feedback for interactive elements
- Use consistent navigation patterns across the app
- Consider user's mental model and expectations