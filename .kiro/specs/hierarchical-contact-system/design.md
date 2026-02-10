# Design Document: Hierarchical Contact System

## Overview

This design document outlines the restructuring of JMSK's current client-company system into a unified hierarchical contact system. The system establishes a clear one-to-many relationship between companies and contacts (formerly clients).

The design prioritizes simplicity and maintainability while ensuring data integrity and preserving existing business relationships. Companies serve as the primary entity for business operations, with contacts acting as individual representatives who can place orders on behalf of their companies.

## Architecture

### System Components

1. **Database Layer**: PostgreSQL database with restructured schema supporting company-contact hierarchy
2. **API Layer**: Python backend with updated endpoints reflecting contact terminology
3. **Frontend Layer**: React application with updated components and navigation flows

### Data Flow

Frontend → API Endpoints → Database (Companies, Contacts, Orders, Addresses)

Companies have many Contacts and Addresses. Contacts have many Orders.

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts Table (formerly Clients)
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, company_id, email)
);
```

### Orders Table (Updated)
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL REFERENCES contacts(id),
    company_id INTEGER NOT NULL REFERENCES companies(id),
    order_number VARCHAR(50),
    order_date DATE NOT NULL,
    due_date DATE,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Addresses Table
```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Contact Endpoints
- `GET /api/v1/contacts` - List all contacts with company info
- `GET /api/v1/contacts/{id}` - Get specific contact details
- `POST /api/v1/contacts` - Create new contact (requires company_id)
- `PUT /api/v1/contacts/{id}` - Update contact information
- `DELETE /api/v1/contacts/{id}` - Delete contact
- `GET /api/v1/contacts/{id}/orders` - Get all orders for specific contact

### Company Endpoints
- `GET /api/v1/companies` - List all companies with aggregated data
- `GET /api/v1/companies/{id}` - Get specific company details
- `POST /api/v1/companies` - Create new company
- `PUT /api/v1/companies/{id}` - Update company information
- `GET /api/v1/companies/{id}/contacts` - Get all contacts for company
- `GET /api/v1/companies/{id}/orders` - Get all orders for company
- `GET /api/v1/companies/{id}/balance` - Get aggregated balance

### Address Endpoints
- `GET /api/v1/companies/{id}/addresses` - Get all addresses for company
- `POST /api/v1/companies/{id}/addresses` - Add new address to company
- `PUT /api/v1/addresses/{id}` - Update specific address
- `DELETE /api/v1/addresses/{id}` - Delete address

## Data Models

### Contact Model
```typescript
interface Contact {
  id: number;
  tenantId: number;
  companyId: number;
  name: string;
  email?: string;
  phone?: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}
```

### Company Model
```typescript
interface Company {
  id: number;
  tenantId: number;
  name: string;
  email?: string;
  phone?: string;
  contacts?: Contact[];
  totalBalance?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Order Model
```typescript
interface Order {
  id: number;
  tenantId: number;
  contactId: number;
  companyId: number;
  orderNumber?: string;
  orderDate: string;
  dueDate?: string;
  price: number;
  status: string;
  contact?: Contact;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}
```

### Address Model
```typescript
interface Address {
  id: number;
  tenantId: number;
  companyId: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}
```

## Balance Calculation

Company balance is calculated by summing all order prices from all associated contacts:

```python
def calculate_company_balance(company_id: int, tenant_id: int) -> Decimal:
    """Calculate total balance for a company across all contacts"""
    return db.session.query(func.sum(Order.price))\
        .filter(Order.company_id == company_id)\
        .filter(Order.tenant_id == tenant_id)\
        .scalar() or Decimal('0.00')
```

## Navigation and User Experience

### Contact-to-Order Navigation
- Click on contact name in any order display
- Navigate to `/contacts/{id}` route
- Display contact details with complete order history
- Provide breadcrumb navigation back

### Company-Contact Hierarchy
- Company pages show all associated contacts
- Contact pages show parent company information
- Order pages show both contact and company context
- Breadcrumb navigation maintains user orientation

## Address Management

### Default Address Population
- System automatically populates company's default address for shipments
- User can modify address for individual shipment
- Changes to shipment address don't affect company default
- Company default address updates apply only to future shipments

### Address Validation
Required fields: street address, city, state, zip code
Optional fields: country (defaults to USA)

## Error Handling

### Database Constraints
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate contacts within companies
- Check constraints validate data formats

### API Error Responses
- **400 Bad Request**: Invalid data format or missing required fields
- **404 Not Found**: Requested resource doesn't exist
- **409 Conflict**: Duplicate contact within company
- **500 Internal Server Error**: Database or system errors

### Frontend Error Handling
- Form validation prevents invalid data submission
- Loading states during API calls
- Error messages for failed operations
- Graceful degradation when data is unavailable

## Testing Strategy

### Unit Tests
- Test service layer business logic
- Test repository CRUD operations
- Test schema validation

### Integration Tests
- Test API endpoints with database
- Test frontend components with mock API
- Test complete user workflows

### Manual Testing
- Verify UI displays correctly
- Test navigation flows
- Validate form submissions
- Check error handling

## Implementation Notes

- Database migration already created and tested
- Models, repositories, and schemas complete
- Focus on service layer and API endpoints next
- Frontend components follow existing patterns
- Use existing authentication and multi-tenant isolation
