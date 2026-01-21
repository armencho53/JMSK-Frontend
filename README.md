# Jewelry Manufacturing System - Frontend

React + TypeScript frontend for the Jewelry Manufacturing Tracking System.

## Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI configured (for AWS deployment)
- AWS SAM CLI (for AWS deployment)
- Backend API deployed and running

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

3. Start development server:
```bash
npm run dev
```

Application will be available at http://localhost:5173

**Note**: If port 5173 is already in use, Vite will automatically try port 5174, 5175, etc. The backend CORS is configured to accept requests from both 5173 and 5174.

## Testing

Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suites
npm test -- --testNamePattern="Property"  # Run property-based tests
npm test -- --testPathPatterns="form-structure"  # Run form validation tests
```

The test suite includes:
- **Unit tests** for individual components and utilities
- **Component tests** for React components with proper mocking
- **API client tests** for HTTP client configuration and interceptors
- **Integration tests** for component interactions
- **Property-based tests** using Fast-check for design system validation
- **Accessibility tests** ensuring WCAG 2.1 AA compliance
- **Cross-browser compatibility tests** for Chrome, Firefox, Safari, and Edge
- **Form validation tests** for proper structure and error handling

### Property-Based Testing

The design system includes comprehensive property-based tests that validate:

#### Form Structure and Validation (Property 6)
- **Form Field Grouping**: Validates proper semantic markup and field organization
- **Validation CSS Classes**: Ensures error states display correct styling and ARIA attributes
- **Modal Form Structure**: Tests form behavior within modal contexts
- **Accessibility Attributes**: Validates proper label association, ARIA attributes, and keyboard navigation
- **Validation State Changes**: Tests dynamic error state transitions and user feedback

#### Dashboard Card Organization (Property 7)
- **Card Component Structure**: Validates proper card components and section markup with distinct styling classes
- **Stats Dashboard Layout**: Tests consistent card styling and layout for dashboard statistics
- **Semantic Markup**: Ensures proper HTML structure and heading hierarchy
- **Visual Styling Separation**: Validates distinct styling classes for visual separation between sections
- **Grid Configuration Adaptation**: Tests responsive grid behavior with different card counts and configurations

#### Navigation State Indicators (Property 4)
- **Desktop Navigation**: Validates proper active state indicators with CSS classes and ARIA attributes
- **Mobile Navigation**: Tests active state indicators for mobile navigation components
- **Theme Consistency**: Ensures navigation state changes are visually consistent across all themes
- **Accessibility Compliance**: Validates that accessibility attributes match visual state indicators

#### Data Table Visual Structure (Property 3)
- **CSS Spacing Classes**: Validates proper spacing classes for table readability across different sizes
- **Visual Separation Elements**: Tests theme-consistent visual separation across all design themes
- **Responsive Structure**: Ensures table structure maintains consistency across breakpoints and mobile views
- **Empty and Loading States**: Validates proper visual structure for empty tables and loading states
- **Sorting Indicators**: Tests visual consistency of sortable column indicators and accessibility attributes

#### Status Information Consistency (Property 5)
- **Status Badge Color Coding**: Validates consistent color patterns for different status categories (order, manufacturing, general, priority)
- **Cross-Theme Consistency**: Tests that status color categories remain consistent across all three design themes
- **Sizing and Spacing Patterns**: Ensures status badges maintain proper sizing and spacing across different size variants
- **Unknown Status Handling**: Validates graceful fallback to default gray styling for unknown status values
- **Variant Iconography**: Tests consistent iconography patterns across default, dot, and outline variants

#### Touch-Friendly Mobile Interface (Property 8)
- **Minimum Touch Target Size**: Validates that all interactive elements meet WCAG 2.1 AA minimum 44px touch target requirements
- **Mobile Navigation Touch Spacing**: Tests appropriate touch spacing for mobile navigation elements with minimum padding and margins
- **Responsive Container Adaptation**: Ensures responsive containers adapt properly for mobile viewports with appropriate padding and spacing
- **Cross-Theme Touch Consistency**: Validates that touch target sizes remain consistent across all three design themes
- **Touch Target Spacing**: Tests minimum 8px spacing between adjacent touch targets to prevent accidental activation

#### CSS Custom Properties Usage (Property 12)
- **Theme Consistency**: Validates CSS custom properties are used consistently across components
- **Theme Switching**: Tests dynamic theme changes and property updates
- **Naming Conventions**: Ensures consistent CSS custom property naming patterns

#### Login Page Theme and Visual Consistency (Property 2)
- **CSS Custom Properties**: Validates that login page uses theme tokens instead of hardcoded colors
- **Visual Consistency**: Tests consistent component structure across all theme variants
- **Design System Spacing**: Ensures proper spacing and layout patterns from design system
- **Interactive States**: Validates theme consistency in focus, hover, and loading states
- **Typography Integration**: Tests proper font family usage across all three themes

### Test Configuration

Tests are configured with:
- **Jest** as the test runner with TypeScript support and ES modules
- **@testing-library/react** for component testing utilities
- **@testing-library/jest-dom** for enhanced DOM assertions
- **jsdom** environment for browser-like testing
- **Fast-check** for property-based testing of design system consistency
- **Axe-core** integration for automated accessibility testing
- **Coverage reporting** with HTML, LCOV, and JSON formats
- **JUnit XML** output for CI/CD integration

### Current Test Files

The project includes the following test files:
- `src/App.test.tsx` - Basic App component tests with authentication mocking
- `src/lib/__tests__/api.test.ts` - API client configuration and interceptor tests
- `src/components/__tests__/Layout.test.tsx` - Layout component structure tests
- `src/setupTests.ts` - Global test configuration and mocks

### Running Property Tests

Property-based tests use Fast-check to generate hundreds of test cases automatically:

```bash
# Run all property tests
npm test -- --testNamePattern="Property"

# Run specific property test
npm test -- --testNamePattern="Property 3"  # Data table visual structure tests
npm test -- --testNamePattern="Property 4"  # Navigation state indicators tests
npm test -- --testNamePattern="Property 5"  # Status information consistency tests
npm test -- --testNamePattern="Property 6"  # Form structure tests
npm test -- --testNamePattern="Property 7"  # Dashboard card organization tests
npm test -- --testNamePattern="Property 8"  # Touch-friendly mobile interface tests
npm test -- --testNamePattern="Property 12" # CSS custom properties tests

# Run login page specific tests
npm test -- --testPathPattern="login-page" # All login page tests
npm test -- --testNamePattern="Theme and Visual Consistency" # Login page theme tests
```

These tests validate that components maintain consistent behavior across:
- Professional theme styling consistency
- Various input combinations and edge cases
- Multiple screen sizes and responsive breakpoints
- Different accessibility requirements and user interactions
- Status information consistency across all status categories and variants
- Touch-friendly mobile interface compliance with WCAG 2.1 AA standards
- Minimum touch target sizes and appropriate spacing for mobile devices

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## AWS Deployment

### Recommended: GitHub Actions (Automated)

The preferred deployment method is GitHub Actions workflows:

**Automatic Deployment:**
- Push to `main` branch → Deploys after backend completion
- Create pull request → Runs tests only

**Manual Deployment:**
```bash
# Deploy to specific environment (requires backend to be deployed first)
gh workflow run deploy-frontend.yml -f environment=prod
gh workflow run deploy-frontend.yml -f environment=staging
gh workflow run deploy-frontend.yml -f environment=dev
```

**Setup Requirements:**
- AWS OIDC identity provider configured
- GitHub repository secrets configured
- Backend must be deployed first (provides API URL)
- See [docs/deployment/deployment-guide.md](../docs/deployment/deployment-guide.md) for complete setup

### Legacy: Manual Deployment (Deprecated)

⚠️ **Deprecated**: Manual deployment script is maintained for backup only.

1. Ensure AWS credentials are configured:
```bash
aws configure
```

2. Deploy (with deprecation warnings):
```bash
./deploy.sh
```

The script will:
- Create S3 bucket and CloudFront distribution
- Build the frontend with your API URL
- Upload files to S3
- Invalidate CloudFront cache

**Migration Guide**: See [MIGRATION-GUIDE.md](../MIGRATION-GUIDE.md) for migrating to GitHub Actions.

## Environment Variables

- `VITE_API_URL`: Backend API URL (e.g., https://api.example.com)

## Features

- **Complete Application Routing**: Full React Router implementation with protected routes
- **Authentication System**: JWT-based authentication with automatic token validation
- **Multi-page Application**: Dashboard, Orders, Supplies, Customers, Companies, Manufacturing, Shipments, Departments, and Roles
- **Protected Route System**: Automatic redirect to login for unauthenticated users
- **Professional Navigation System**: Modern sidebar layout with active state indicators, user profile section, and responsive design
  - **Fixed Sidebar Navigation**: Professional dark theme sidebar with company branding and navigation icons
  - **Active State Indicators**: Visual indicators for current page with orange accent color and subtle animations
  - **User Profile Section**: Bottom-positioned user info with email, tenant name, and logout functionality
  - **Responsive Header**: Dynamic page titles with system status indicators and current date display
- **Modern Dashboard Interface**: Professional data visualization and monitoring
  - **Key Metrics Display**: Four primary statistics cards with real-time data
  - **Order Status Tracking**: Recent orders with color-coded status indicators
  - **Inventory Overview**: Supply tracking with metal types and quantities
  - **System Health Monitoring**: Connection status and authentication verification
  - **Responsive Grid Layout**: Adaptive card layouts for all screen sizes
  - **Professional Loading States**: Enhanced UX with descriptive loading messages
  - **Error Handling**: Comprehensive error states with actionable feedback
- Order management with detailed customer views
- Supply/inventory tracking and management
- User authentication & role-based access control
- Real-time updates and notifications
- Responsive design with mobile-first approach
- **Modern Professional Dashboard** with comprehensive data visualization:
  - **Statistics Overview**: Key metrics cards with hover effects and professional styling
  - **Recent Orders Section**: Status-coded order display with customer information
  - **Supply Inventory Display**: Material tracking with metal types and quantities
  - **System Status Panel**: Real-time connection and authentication monitoring
- **Clean Modern Professional Design System** with streamlined interface:
  - **Professional Theme**: Contemporary business interface with clean lines, modern typography, and professional color palette
  - **Optimized Performance**: Single-theme implementation for reduced bundle size and faster loading
  - **Responsive Design**: Mobile-first approach with touch-friendly interactions

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS (with custom jewelry-inspired design system)
- React Router
- TanStack React Query 5.12.2 (server state management)
- Zustand (client state management)
- Axios (HTTP client)
- Jest + Testing Library (testing framework)
- Fast-check (property-based testing)

## Design System

The application features a clean modern professional design system with a complete component library:

### UI Components

#### Navigation Components

- **Layout**: Main application layout with professional sidebar navigation and header
  ```typescript
  import Layout from './components/Layout';
  
  // Used as route wrapper in App.tsx
  <Route path="/" element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="supplies" element={<Supplies />} />
    // ... other routes
  </Route>
  ```
  
  **Features:**
  - **Fixed Sidebar**: 256px wide professional dark sidebar with company branding
  - **Navigation Menu**: Icon-based navigation with active state indicators and hover effects
  - **User Profile**: Bottom-positioned user section with avatar, email, tenant info, and logout
  - **Dynamic Header**: Page-specific titles with system status and date display
  - **Professional Styling**: Slate color palette with orange accent for active states

- **MobileNavigation**: Enhanced mobile navigation with theme support and touch-friendly interactions
  ```typescript
  import { MobileNavigation } from './components/ui';
  
  <MobileNavigation 
    isOpen={isOpen}
    onClose={handleClose}
  />
  ```

- **BottomNavigation**: Mobile bottom navigation bar for primary actions
  ```typescript
  import { BottomNavigation } from './components/ui';
  
  <BottomNavigation className="custom-styles" />
  ```

#### Data Display Components

- **Table**: Enhanced data table with sorting, pagination, row selection, and responsive design
  ```typescript
  import { Table } from './components/ui';
  
  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'status', title: 'Status', render: (status) => <StatusBadge status={status} /> }
  ];
  
  <Table 
    columns={columns} 
    data={orders}
    pagination={{ current: 1, pageSize: 10, total: 100, onChange: handlePageChange }}
    rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }}
    responsive
    hoverable
  />
  ```

- **Dashboard Statistics Cards**: Professional metrics display with hover effects
  ```typescript
  // Modern statistics card with icon and hover effects
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center">
      <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 bg-white rounded-sm"></div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-slate-600">Total Supplies</p>
        <p className="text-2xl font-semibold text-slate-900">{count}</p>
      </div>
    </div>
  </div>
  ```

- **StatusBadge**: Color-coded status indicators with multiple variants
  ```typescript
  // Status badge with professional styling
  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
    status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : status === 'in_progress'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-slate-100 text-slate-800'
  }`}>
    {status?.replace('_', ' ') || 'pending'}
  </span>
  ```

- **ProgressBar**: Manufacturing progress visualization with animations
- **Timeline**: Step-by-step process visualization

#### Form Components

- **Button**: Primary, secondary, and tertiary variants with loading states
- **Input**: Floating label and standard variants with validation
- **Select**: Searchable dropdown with custom options
- **DatePicker**: Calendar interface with theme integration
- **FileUpload**: Drag-and-drop file upload with preview

#### Layout Components

- **Card**: Flexible card component with multiple variants and subcomponents
  ```typescript
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui';
  
  <Card variant="elevated" hoverable onClick={handleClick}>
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
  ```
  - **Variants**: `default`, `elevated`, `outlined`, `glass`
  - **Subcomponents**: `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
  - **Interactive**: Supports `onClick` for clickable cards with proper accessibility
  - **Theming**: Full CSS custom properties integration for all themes

- **Grid**: Responsive grid system with flexible columns
- **Container**: Responsive container with size variants
- **Stack**: Vertical and horizontal layout utilities

#### Responsive Layout Components

- **ResponsiveContainer**: Flexible container with size variants and responsive padding
  ```typescript
  import { ResponsiveContainer } from './components/ui';
  
  <ResponsiveContainer size="desktop" padding="responsive">
    <h1>Page Content</h1>
  </ResponsiveContainer>
  ```

- **ResponsiveGrid**: Mobile-first grid system with automatic column adaptation
  ```typescript
  import { ResponsiveGrid } from './components/ui';
  
  <ResponsiveGrid type="cards" gap="md">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </ResponsiveGrid>
  ```

- **ResponsiveStack**: Vertical layout component with responsive spacing
  ```typescript
  import { ResponsiveStack } from './components/ui';
  
  <ResponsiveStack spacing="lg" align="center">
    <h2>Title</h2>
    <p>Content</p>
    <button>Action</button>
  </ResponsiveStack>
  ```

- **TouchTarget**: Touch-friendly wrapper ensuring minimum 44px touch targets
  ```typescript
  import { TouchTarget } from './components/ui';
  
  <TouchTarget size="lg" as="button" onClick={handleClick}>
    Touch-friendly Button
  </TouchTarget>
  ```

#### Media Components

- **Image**: Advanced responsive image component with srcSet support
  ```typescript
  import { Image } from './components/ui';
  
  // Simple usage
  <Image src="/product.jpg" alt="Product photo" aspectRatio="square" />
  
  // Responsive images with multiple sources
  <Image 
    src={[
      { src: '/product-400.jpg', width: 400 },
      { src: '/product-800.jpg', width: 800 },
      { src: '/product-1200.jpg', width: 1200 }
    ]}
    alt="Product photo"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    aspectRatio="4:3"
    priority={true} // For above-the-fold images
    fallbackSrc="/placeholder.jpg"
  />
  ```

- **PhotoGallery**: Grid-based photo gallery with lightbox functionality
  ```typescript
  import { PhotoGallery } from './components/ui';
  
  <PhotoGallery 
    photos={photos}
    columns={3}
    aspectRatio="square"
    enableLightbox={true}
    showCaptions={true}
    responsive={true}
  />
  ```

- **FilePreview**: Document and file preview with type-specific icons
- **MediaGallery**: Mixed media content display for images, videos, and documents

### Component Features

- **Professional Styling**: All components use consistent professional design with Tailwind CSS classes
- **Responsive Design**: Mobile-first approach with touch-friendly interactions and adaptive layouts
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, and minimum touch targets
- **TypeScript**: Full TypeScript support with comprehensive type definitions and polymorphic component support
- **Loading States**: Built-in loading and empty state handling
- **Touch-Friendly**: Minimum 44px touch targets for mobile accessibility
- **Optimized Performance**: Single-theme implementation reduces bundle size and improves loading performance

## Design System

### Professional Theme

The application uses a clean modern professional design system:

**Colors:**
- Primary: Midnight Blue (`#0f172a`) - Professional, trustworthy
- Secondary: Copper Orange (`#ea580c`) - Energetic accent
- Background: Pure White (`#fefefe`) - Clean, minimal
- Text: Slate color palette for hierarchy and readability

**Typography:**
- Font Family: Inter - Clean, modern, highly readable
- Scale: Consistent typography scale from 12px to 40px
- Weight: Regular (400) and Medium (500) for hierarchy

**Design Principles:**
- Clean lines and minimal visual clutter
- Generous whitespace for improved readability
- Professional color palette suitable for business applications
- Consistent spacing and layout patterns

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities and API client
│   │   ├── api.ts    # Axios HTTP client
│   │   └── theme.ts  # Theme management utilities
│   ├── store/        # State management
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── tailwind.config.js # TailwindCSS configuration with jewelry themes
└── deploy.sh         # Deployment script
```
