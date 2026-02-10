# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript frontend for a Jewelry Manufacturing Tracking System. Built with Vite, TailwindCSS, React Router, TanStack Query, and Zustand for state management.

## Development Commands

### Setup
```bash
npm install
cp .env.example .env  # Configure VITE_API_URL
npm run dev           # Start dev server (http://localhost:5173)
```

### Testing
```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm test -- --testNamePattern="Property"  # Run property-based tests only
npm test -- --testPathPattern="api"       # Run specific test file
```

### Build
```bash
npm run build               # Build for staging/dev
npm run build:prod          # Build for production
npm run lint                # Run ESLint
```

### Deployment
GitHub Actions handles automated deployment:
- `develop` branch → development environment
- `staging` branch → staging environment
- `main` branch → production environment

## Architecture

### State Management
- **Authentication**: Zustand store (`src/store/authStore.ts`) with localStorage persistence
  - JWT access tokens with refresh token flow
  - Auto-refresh on 401 via axios interceptor
  - User session persists across page reloads
- **Server State**: TanStack Query for API data caching and synchronization
- **Client State**: React hooks and context for component-local state

### Routing Structure
Protected route system using React Router with automatic login redirect:
- `/login` - Public authentication page
- `/` - Protected routes under `<Layout>` wrapper:
  - `/` - Dashboard (default)
  - `/orders` - Orders management
  - `/supplies` - Inventory tracking
  - `/customers` - Customer management
  - `/customers/:customerId` - Customer detail view
  - `/companies` - Company management
  - `/manufacturing` - Production tracking
  - `/shipments` - Shipping management
  - `/departments` - Department administration
  - `/roles` - Role-based access control

### API Client (`src/lib/api.ts`)
- Centralized axios instance with 30s timeout (for Lambda cold starts)
- Request interceptor: Automatically adds JWT Bearer token
- Response interceptor: Handles 401 errors with automatic token refresh
  - Queues failed requests during refresh to avoid race conditions
  - Logs out and redirects to `/login` if refresh fails
- Base URL: `${VITE_API_URL}/api/v1`

### Component Architecture
- **Layout Component** (`src/components/Layout.tsx`):
  - Fixed sidebar navigation with active state indicators
  - Top header with page title and system status
  - User profile section with logout
- **Pages** (`src/pages/`): Full-page route components
- **UI Components** (`src/components/ui/`): Reusable design system components
  - Button, Input, Select, Card, Table, Modal, StatusBadge, etc.
  - Fully typed with TypeScript
  - Accessibility-first (WCAG 2.1 AA compliant)
  - Touch-friendly mobile interface (44px minimum touch targets)

## Design System

### Professional Theme
Single-theme implementation focused on clean modern business aesthetic:
- **Primary**: Midnight Blue (#0f172a) - Professional, trustworthy
- **Secondary**: Copper Orange (#ea580c) - Energetic accent
- **Background**: Pure White (#fefefe) - Clean, minimal
- **Typography**: Inter font family - Modern, highly readable

### TailwindCSS Configuration
Custom utilities defined in `tailwind.config.js`:
- Touch-friendly spacing (`touch-sm`, `touch-md`, `touch-lg` for 44px+ targets)
- Desktop-optimized spacing (`desktop-sm` through `desktop-2xl`)
- Responsive breakpoints including touch/no-touch media queries
- Professional color palette with semantic naming
- Safelist for dynamically generated classes

### Key Design Patterns
- **Mobile-first responsive design** with progressive enhancement
- **Touch target minimum 44px** for WCAG 2.1 AA compliance
- **Status badges** with consistent color coding across themes
- **Card-based layouts** with proper visual hierarchy
- **Loading and empty states** for all data displays

## Testing Strategy

### Test Types
1. **Unit Tests**: Individual functions and utilities
2. **Component Tests**: React components with @testing-library/react
3. **API Tests**: HTTP client configuration and interceptors
4. **Property-Based Tests**: Design system consistency with Fast-check
   - Form structure and validation (Property 6)
   - Dashboard card organization (Property 7)
   - Navigation state indicators (Property 4)
   - Data table visual structure (Property 3)
   - Status information consistency (Property 5)
   - Touch-friendly mobile interface (Property 8)
   - CSS custom properties usage (Property 12)

### Test Configuration
- **Jest** with jsdom for browser-like testing
- **@testing-library/react** for component testing
- **Fast-check** for property-based testing
- Coverage reports: HTML, LCOV, JSON, JUnit XML

### Running Specific Tests
```bash
npm test -- --testNamePattern="Property 3"  # Data table tests
npm test -- --testNamePattern="Property 6"  # Form validation tests
npm test -- --testPathPattern="api"         # API client tests
```

## Important Patterns

### Authentication Flow
1. User logs in → receives access_token and refresh_token
2. Access token stored in Zustand (persisted to localStorage)
3. All API requests include `Authorization: Bearer {token}` header
4. On 401 response: axios interceptor attempts refresh
5. On successful refresh: updates token and retries original request
6. On refresh failure: clears auth state and redirects to `/login`

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx` under `<PrivateRoute>` wrapper
3. Add navigation item in `src/components/Layout.tsx`
4. Use TanStack Query hooks for server data fetching

### Using API Client
```typescript
import api from '@/lib/api'

// GET request
const { data } = await api.get('/endpoint')

// POST request with JSON body
const { data } = await api.post('/endpoint', { key: 'value' })

// Note: Authorization header added automatically
```

### State Management Guidelines
- **Use Zustand** for global client state (auth, UI preferences)
- **Use TanStack Query** for server state (API data, caching)
- **Use React hooks** for component-local state (form inputs, modals)

## Environment Variables
- `VITE_API_URL`: Backend API base URL (required)
  - Development: `http://localhost:8000`
  - Staging/Production: Configured via GitHub Actions

## Code Style
- TypeScript strict mode enabled
- ESLint configured with React hooks rules
- Prefer functional components with hooks
- Use explicit return types for complex functions
- Avoid `any` types - use proper TypeScript types from `src/types/`

## Deployment Pipeline
GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. **Build**: Lint, test, and build with environment-specific backend URL
2. **Integration Test**: Verify backend connectivity
3. **Deploy**: Upload to S3 and invalidate CloudFront cache
4. **Smoke Test**: Post-deployment health checks

Required GitHub secrets/variables documented in `docs/github-secrets-setup.md`.
