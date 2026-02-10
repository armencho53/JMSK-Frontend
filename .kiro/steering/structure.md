# Project Structure

## Repository Organization

This is a multi-workspace repository with separate frontend and backend folders:

```
workspace/
├── JMSK-Frontend/    # React TypeScript frontend
└── JMSK-Backend/     # FastAPI Python backend
```

## Frontend Structure (JMSK-Frontend/)

```
JMSK-Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   │   ├── __tests__/      # Component tests
│   │   ├── Layout.tsx      # Main layout with sidebar navigation
│   │   ├── Navigation.tsx  # Sidebar navigation component
│   │   ├── Header.tsx      # Page header component
│   │   └── *FormModal.tsx  # Feature-specific form modals
│   ├── pages/              # Page components (one per route)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Customers.tsx
│   │   ├── CustomerDetail.tsx
│   │   └── ...
│   ├── lib/                # Utilities and shared logic
│   │   ├── __tests__/      # Utility tests
│   │   ├── api.ts          # Axios HTTP client with interceptors
│   │   ├── theme.ts        # Theme management utilities
│   │   └── toast.ts        # Toast notification helpers
│   ├── store/              # State management
│   │   └── authStore.ts    # Zustand auth store
│   ├── types/              # TypeScript type definitions
│   │   ├── customer.ts
│   │   ├── role.ts
│   │   └── ...
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Application entry point
│   └── setupTests.ts       # Jest test configuration
├── tests/                  # E2E and integration tests
├── .kiro/                  # Kiro configuration
│   ├── specs/              # Feature specifications
│   └── steering/           # Project guidance documents
├── aws-infrastructure/     # AWS CloudFormation templates
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### Frontend Conventions

- **Components**: PascalCase, one component per file
- **Pages**: PascalCase, match route names
- **Utilities**: camelCase in `lib/` folder
- **Tests**: Co-located in `__tests__/` folders or `.test.tsx` suffix
- **Types**: Shared types in `types/`, component-specific types inline
- **Modals**: Feature-specific modals as separate components (*FormModal.tsx)

## Backend Structure (JMSK-Backend/)

```
JMSK-Backend/
├── app/
│   ├── presentation/           # Presentation Layer (HTTP)
│   │   └── api/
│   │       ├── dependencies.py # FastAPI dependencies (auth, DI)
│   │       └── v1/
│   │           ├── router.py   # Main API router
│   │           └── controllers/ # HTTP endpoint handlers
│   ├── domain/                 # Domain Layer (Business Logic)
│   │   ├── services/           # Business logic services
│   │   └── exceptions.py       # Domain exceptions
│   ├── data/                   # Data Layer (Persistence)
│   │   ├── repositories/       # Repository pattern
│   │   │   └── base.py        # Base CRUD repository
│   │   ├── models/            # SQLAlchemy ORM models
│   │   └── database.py        # Database configuration
│   ├── infrastructure/         # Infrastructure Layer
│   │   ├── config.py          # Application settings
│   │   └── security.py        # JWT, password hashing
│   ├── schemas/               # Pydantic schemas (shared)
│   ├── api/                   # LEGACY: Old endpoint structure
│   │   └── v1/endpoints/      # Being migrated to clean architecture
│   └── main.py                # FastAPI application entry point
├── alembic/                   # Database migrations
│   └── versions/              # Migration files
├── tests/                     # Test suite
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── aws-infrastructure/        # AWS SAM templates
├── lambda_handler.py          # AWS Lambda entry point
├── requirements.txt           # Production dependencies
├── requirements-test.txt      # Test dependencies
└── alembic.ini               # Alembic configuration
```

### Backend Conventions

- **Layered Architecture**: Strict separation of concerns (presentation → domain → data)
- **Repository Pattern**: All database access through repositories
- **Service Pattern**: Business logic in service classes
- **Dependency Injection**: FastAPI dependencies for DB sessions and auth
- **Multi-tenant**: All queries filtered by `tenant_id`
- **Naming**: snake_case for Python files and functions
- **Models**: SQLAlchemy ORM models in `data/models/`
- **Schemas**: Pydantic models in `schemas/` for validation
- **Tests**: Organized by layer (unit/services, unit/repositories, integration/api)

## Migration Status

### Frontend
- ✅ Fully implemented with modern React patterns
- ✅ Property-based testing for design system
- ✅ Clean component architecture

### Backend
- ✅ Customer module refactored to clean architecture
- 🔄 Other modules in legacy `app/api/v1/endpoints/` (functional but need refactoring)
- 📋 Planned: Migrate all endpoints to clean architecture pattern

## Key Files

### Frontend
- `src/App.tsx` - Routing and protected routes
- `src/lib/api.ts` - HTTP client with auth interceptors
- `src/store/authStore.ts` - Authentication state
- `src/components/Layout.tsx` - Main layout wrapper
- `vite.config.ts` - Build optimization and code splitting

### Backend
- `app/main.py` - FastAPI app initialization and CORS
- `app/data/database.py` - Database session management
- `app/infrastructure/security.py` - JWT and password utilities
- `lambda_handler.py` - AWS Lambda adapter
- `alembic/env.py` - Migration configuration

## Testing Organization

### Frontend Tests
- Component tests: `src/components/__tests__/`
- Utility tests: `src/lib/__tests__/`
- Property tests: Embedded in component test files
- E2E tests: `tests/` directory

### Backend Tests
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Test configuration: `pytest.ini`, `conftest.py`
