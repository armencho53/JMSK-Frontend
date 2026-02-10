# Technology Stack

## Frontend

**Framework**: React 18 with TypeScript
**Build Tool**: Vite 5
**Styling**: TailwindCSS 3 with custom design system
**State Management**: 
- Zustand (client state)
- TanStack React Query (server state)
**Routing**: React Router v6
**HTTP Client**: Axios with interceptors
**Testing**: Jest + Testing Library + Fast-check (property-based testing)

### Key Libraries
- `@heroicons/react` - Icon system
- `react-hot-toast` - Notifications
- `fast-check` - Property-based testing for design system validation

### Design System
- Professional theme with Midnight Blue (#0f172a) and Copper Orange (#ea580c)
- Inter font family for clean, modern typography
- CSS custom properties for theming
- WCAG 2.1 AA accessibility compliance

## Backend

**Framework**: FastAPI (Python 3.11+)
**Database**: PostgreSQL (production), SQLite (testing)
**ORM**: SQLAlchemy 2.0
**Authentication**: JWT with python-jose
**Password Hashing**: Passlib with bcrypt
**Migrations**: Alembic
**Deployment**: AWS Lambda with Mangum adapter

### Architecture Pattern
Clean Architecture with layered design:
- **Presentation Layer**: FastAPI controllers and routes
- **Domain Layer**: Business logic services
- **Data Layer**: Repositories and ORM models
- **Infrastructure Layer**: Config, security, database

## Common Commands

### Frontend
```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm test -- --testNamePattern="Property"  # Run property tests

# Code Quality
npm run lint             # ESLint check
```

### Backend
```bash
# Development
source venv/bin/activate  # Activate virtual environment
uvicorn app.main:app --reload --port 8000  # Start dev server

# Database
alembic upgrade head     # Run migrations
alembic revision --autogenerate -m "message"  # Create migration

# Testing
pytest                   # Run all tests
pytest --cov=app         # With coverage
pytest -v                # Verbose output

# Dependencies
pip install -r requirements.txt       # Install dependencies
pip install -r requirements-test.txt  # Install test dependencies
```

## Deployment

### GitHub Actions (Recommended)
- Automatic deployment on push to main/develop/staging branches
- Manual deployment via workflow dispatch
- Environment-specific configurations
- OIDC authentication with AWS

### Environment Variables

**Frontend**:
- `VITE_API_URL` - Backend API URL

**Backend**:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (generate with `openssl rand -hex 32`)
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (default: 30)

## Development Notes

- Frontend dev server runs on port 5173 (or 5174 if occupied)
- Backend CORS configured for localhost:5173 and 5174
- Tests use in-memory SQLite for fast execution
- Property-based tests validate design system consistency
- Minimum 80% code coverage enforced on backend
