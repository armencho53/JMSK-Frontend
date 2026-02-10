# Implementation Plan: Hierarchical Contact System

## Overview

This implementation plan restructures JMSK's client-company system into a unified hierarchical contact system. The approach follows a phased migration strategy: database schema changes, backend API updates, frontend component updates, and data migration.

## Tasks

- [x] 1. Database schema restructuring
  - [x] 1.1 Create Alembic migration for new schema
    - Created migration 003_hierarchical_contact_system.py
    - Implemented Contact, Company, Address tables with proper relationships
    - Added database constraints and indexes
    - _Requirements: 1.1, 1.3, 1.4, 1.6_
  
  - [x] 1.2 Implement database constraints and triggers
    - Added foreign key constraints for referential integrity
    - Implemented unique constraints for email within company
    - Added check constraints for data validation
    - _Requirements: 1.6, 8.4_

- [x] 2. Backend data models and repositories
  - [x] 2.1 Create Contact model and repository
    - Implemented Contact SQLAlchemy model with company relationship
    - Created ContactRepository with CRUD operations
    - Added search and filtering capabilities
    - _Requirements: 1.1, 1.3, 1.4_
  
  - [x] 2.2 Update Company model and repository
    - Updated Company model with contacts relationship
    - Created CompanyRepository with aggregation methods
    - _Requirements: 1.3, 2.1_
  
  - [x] 2.3 Create Address model and repository
    - Implemented Address model with company relationship
    - Created AddressRepository with default address logic
    - _Requirements: 5.1, 5.2_
  
  - [x] 2.4 Update Order model
    - Updated Order model to reference contact_id and company_id
    - Maintained backward compatibility with customer fields
    - _Requirements: 1.5, 3.1_

- [x] 3. Backend Pydantic schemas
  - [x] 3.1 Create Contact schemas
    - ContactCreate, ContactUpdate, ContactResponse schemas
    - CompanySummary schema for nested company data
    - _Requirements: 1.1, 6.1_
  
  - [x] 3.2 Update Company schemas
    - Updated CompanyResponse with contacts list
    - Added balance aggregation fields
    - _Requirements: 2.1, 6.1_
  
  - [x] 3.3 Create Address schemas
    - AddressCreate, AddressUpdate, AddressResponse schemas
    - Default address handling
    - _Requirements: 5.1, 6.1_

- [x] 4. Backend service layer
  - [x] 4.1 Implement ContactService
    - Completed business logic for contact CRUD operations
    - Added validation for company-contact relationships
    - Implemented contact order history retrieval
    - Added duplicate email detection within companies
    - _Requirements: 1.4, 3.2, 6.4_

  - [x] 4.2 Create CompanyService
    - Implement company balance aggregation logic
    - Add methods for retrieving all company contacts
    - Implement company order aggregation across contacts
    - Add company-wide statistics and metrics
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

  - [x] 4.3 Create AddressService
    - Implement default address management
    - Add address validation logic
    - Handle address population for shipments
    - Implement address CRUD with company validation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Backend API controllers - Contact management
  - [x] 5.1 Create ContactController in clean architecture
    - Create app/presentation/api/v1/controllers/contact_controller.py
    - Implement GET /api/v1/contacts - List all contacts with company info
    - Implement GET /api/v1/contacts/{id} - Get specific contact details
    - Implement POST /api/v1/contacts - Create new contact (requires company_id)
    - Implement PUT /api/v1/contacts/{id} - Update contact information
    - Implement DELETE /api/v1/contacts/{id} - Delete contact
    - Use ContactService for business logic
    - Handle domain exceptions and convert to HTTP responses
    - _Requirements: 1.1, 1.4, 6.1, 6.4_

  - [x] 5.2 Implement contact order history endpoint
    - Add GET /api/v1/contacts/{id}/orders to ContactController
    - Use ContactService.get_contact_order_history()
    - Add pagination support (skip, limit parameters)
    - _Requirements: 3.2, 3.3_

  - [x] 5.3 Register contact routes in main router
    - Update app/presentation/api/v1/router.py to include contact routes
    - Ensure proper authentication and authorization
    - _Requirements: 6.1_

- [x] 6. Backend API controllers - Company management
  - [x] 6.1 Create CompanyController in clean architecture
    - Create app/presentation/api/v1/controllers/company_controller.py
    - Implement GET /api/v1/companies - List all companies with aggregated data
    - Implement GET /api/v1/companies/{id} - Get specific company details
    - Implement POST /api/v1/companies - Create new company
    - Implement PUT /api/v1/companies/{id} - Update company information
    - Use CompanyService for business logic
    - _Requirements: 6.1, 6.4_

  - [x] 6.2 Implement company relationship endpoints
    - Add GET /api/v1/companies/{id}/contacts to CompanyController
    - Add GET /api/v1/companies/{id}/orders to CompanyController
    - Add GET /api/v1/companies/{id}/balance to CompanyController
    - Use CompanyService for aggregation logic
    - _Requirements: 2.1, 4.1, 4.2, 4.3_

  - [x] 6.3 Register company routes in main router
    - Update app/presentation/api/v1/router.py to include company routes
    - Deprecate legacy company endpoints in app/api/v1/endpoints/companies.py
    - _Requirements: 6.1_

- [x] 7. Backend API controllers - Address management
  - [x] 7.1 Create AddressController in clean architecture
    - Create app/presentation/api/v1/controllers/address_controller.py
    - Implement GET /api/v1/companies/{id}/addresses - Get all addresses for company
    - Implement POST /api/v1/companies/{id}/addresses - Add new address to company
    - Implement PUT /api/v1/addresses/{id} - Update specific address
    - Implement DELETE /api/v1/addresses/{id} - Delete address
    - Use AddressService for business logic
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 7.2 Register address routes in main router
    - Update app/presentation/api/v1/router.py to include address routes
    - _Requirements: 6.1_

- [x] 8. Update legacy Order endpoints
  - [x] 8.1 Update order creation to use contact_id
    - Modify app/api/v1/endpoints/orders.py to accept contact_id
    - Maintain backward compatibility with customer_id
    - Auto-populate company_id from contact's company
    - _Requirements: 1.5, 3.1_

  - [x] 8.2 Update order responses to include contact and company info
    - Add contact and company details to order responses
    - Update order list to show contact names (clickable)
    - _Requirements: 3.1, 7.3_

- [x] 9. Frontend TypeScript types
  - [x] 9.1 Create Contact type definitions
    - Create src/types/contact.ts
    - Define Contact, ContactCreate, ContactUpdate interfaces
    - Include company relationship types
    - _Requirements: 1.1, 6.2_

  - [x] 9.2 Update Company type definitions
    - Update src/types/company.ts (if exists, or create)
    - Add contacts array and balance fields
    - Define CompanyWithContacts interface
    - _Requirements: 2.1, 6.2_

  - [x] 9.3 Create Address type definitions
    - Create src/types/address.ts
    - Define Address, AddressCreate, AddressUpdate interfaces
    - Include default address flag
    - _Requirements: 5.1, 6.2_

  - [x] 9.4 Update Order type definitions
    - Update src/types/order.ts to include contactId and companyId
    - Add contact and company nested objects
    - Maintain backward compatibility with customer fields
    - _Requirements: 3.1, 6.2_

- [x] 10. Frontend API client functions
  - [x] 10.1 Create contact API client functions
    - Add to src/lib/api.ts or create src/lib/contactApi.ts
    - Implement getContacts(), getContact(), createContact(), updateContact(), deleteContact()
    - Implement getContactOrders() for order history
    - _Requirements: 1.1, 3.2, 6.2_

  - [x] 10.2 Update company API client functions
    - Add getCompanies(), getCompany(), createCompany(), updateCompany()
    - Add getCompanyContacts(), getCompanyOrders(), getCompanyBalance()
    - _Requirements: 2.1, 4.1, 6.2_

  - [x] 10.3 Create address API client functions
    - Implement getCompanyAddresses(), createAddress(), updateAddress(), deleteAddress()
    - _Requirements: 5.1, 6.2_

- [x] 11. Frontend pages - Contact management
  - [x] 11.1 Create Contacts list page
    - Create src/pages/Contacts.tsx
    - Display all contacts with company information
    - Add search and filter by company
    - Include create/edit/delete actions
    - _Requirements: 1.1, 6.2, 7.1, 7.2_

  - [x] 11.2 Create ContactDetail page
    - Create src/pages/ContactDetail.tsx
    - Display contact information and parent company
    - Show complete order history for the contact
    - Add breadcrumb navigation (Company → Contact)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.3_

  - [x] 11.3 Create ContactFormModal component
    - Create src/components/ContactFormModal.tsx
    - Form for creating/editing contacts
    - Company selection dropdown (required)
    - Validation for required fields
    - _Requirements: 1.4, 6.5, 7.2_

- [x] 12. Frontend pages - Company management
  - [x] 12.1 Create Companies list page
    - Create src/pages/Companies.tsx (or update if exists)
    - Display all companies with aggregated balance
    - Show contact count per company
    - Include create/edit actions
    - _Requirements: 2.1, 6.2, 7.1, 7.2_

  - [x] 12.2 Create CompanyDetail page
    - Create src/pages/CompanyDetail.tsx
    - Display company information and addresses
    - List all contacts for the company
    - Show aggregated orders from all contacts
    - Display total company balance
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.3_

  - [x] 12.3 Create CompanyFormModal component
    - Create src/components/CompanyFormModal.tsx
    - Form for creating/editing companies
    - Include basic company information fields
    - _Requirements: 6.2, 7.2_

- [x] 13. Frontend navigation and routing
  - [x] 13.1 Update routing configuration
    - Update src/App.tsx to add /contacts and /companies routes
    - Add /contacts/:id route for ContactDetail page
    - Add /companies/:id route for CompanyDetail page
    - _Requirements: 3.4, 7.3_

  - [x] 13.2 Update Navigation component
    - Update src/components/Navigation.tsx
    - Change "Customers" to "Contacts" in navigation menu
    - Add "Companies" menu item if not present
    - Update icons and ordering
    - _Requirements: 6.2, 7.1, 7.2_

  - [x] 13.3 Implement contact navigation from orders
    - Update order display components to make contact names clickable
    - Link to /contacts/{id} when contact name is clicked
    - Show company name as secondary information
    - _Requirements: 3.1, 3.4, 7.3_

  - [x] 13.4 Create HierarchyBreadcrumb component
    - Create src/components/HierarchyBreadcrumb.tsx
    - Display Company → Contact → Order hierarchy
    - Make breadcrumb items clickable for navigation
    - _Requirements: 3.4, 7.3_

- [x] 14. Frontend address management
  - [x] 14.1 Create AddressFormModal component
    - Create src/components/AddressFormModal.tsx
    - Form for creating/editing company addresses
    - Include all address fields with validation
    - Checkbox for setting as default address
    - _Requirements: 5.1, 5.3, 5.5_

  - [x] 14.2 Update shipment creation flow
    - Update shipment creation to auto-populate company's default address
    - Allow users to modify address for individual shipment
    - Fetch address from contact's company when creating shipment
    - _Requirements: 5.2, 5.3_

  - [x] 14.3 Create AddressList component
    - Create component to display company addresses
    - Show in CompanyDetail page
    - Indicate which address is default
    - Include edit/delete actions
    - _Requirements: 5.1, 5.4_

- [x] 15. Frontend terminology updates
  - [x] 15.1 Update all UI text and labels
    - Search and replace "Customer" with "Contact" in all components
    - Update form labels, placeholders, and help text
    - Update table headers and column names
    - _Requirements: 1.2, 6.2, 7.1, 7.2_

  - [x] 15.2 Update error messages and notifications
    - Update toast notifications to use "Contact" terminology
    - Update validation error messages
    - Update success messages
    - _Requirements: 6.2, 7.1_

  - [x] 15.3 Update page titles and headers
    - Update document titles and page headers
    - Update breadcrumb text
    - Update empty state messages
    - _Requirements: 7.1, 7.2, 7.4_

- [x] 16. Testing and validation
  - [ ]* 16.1 Write unit tests for services
    - Test ContactService business logic
    - Test CompanyService aggregation logic
    - Test AddressService default address handling
    - _Requirements: All_

  - [ ]* 16.2 Write integration tests for API endpoints
    - Test contact CRUD endpoints
    - Test company endpoints with aggregation
    - Test address management endpoints
    - Test order updates with contact/company references
    - _Requirements: All_

  - [ ]* 16.3 Write frontend component tests
    - Test Contact and Company pages
    - Test form modals and validation
    - Test navigation and routing
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 16.4 Manual testing checklist
    - Test complete contact creation flow
    - Test company-contact hierarchy navigation
    - Test order history views (contact and company level)
    - Test address management and shipment population
    - Verify all terminology updates
    - Test multi-tenant isolation
    - _Requirements: All_

- [x] 17. Data migration and cleanup
  - [x] 17.1 Create data migration script (if needed)
    - Script to migrate existing customer data to contacts
    - Ensure all orders are properly linked to contacts and companies
    - Verify data integrity after migration
    - _Requirements: 1.5, 8.1, 8.2, 8.3_

  - [x] 17.2 Update seed data
    - Update database seed scripts to use new schema
    - Create sample companies with multiple contacts
    - Create sample orders linked to contacts
    - _Requirements: 8.2, 8.3_

  - [x] 17.3 Remove deprecated code
    - Remove old customer-related code after migration
    - Clean up unused imports and types
    - Update documentation
    - _Requirements: 6.3_

- [x] 18. Deployment and verification
  - [x] 18.1 Deploy database migration
    - Run alembic upgrade head on staging/production
    - Verify migration completed successfully
    - Check database constraints and indexes
    - _Requirements: 8.1, 8.4_

  - [x] 18.2 Deploy backend changes
    - Deploy updated backend with new endpoints
    - Verify all endpoints are accessible
    - Check logs for errors
    - _Requirements: 6.1, 6.4_

  - [x] 18.3 Deploy frontend changes
    - Build and deploy frontend with updated components
    - Verify all pages load correctly
    - Test navigation flows
    - _Requirements: 6.2, 7.1, 7.2_

  - [x] 18.4 Production verification
    - Test complete user workflows in production
    - Verify multi-tenant isolation
    - Monitor for errors and performance issues
    - Gather user feedback
    - _Requirements: All_

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP
- Database migration, models, repositories, and schemas are complete
- ContactService is fully implemented and ready for use
- Focus on creating controllers (clean architecture) before frontend work
- Maintain backward compatibility during transition period
- Use existing authentication and multi-tenant isolation patterns
- Follow clean architecture pattern: Controller → Service → Repository
- All new endpoints should use the clean architecture structure in app/presentation/
- Legacy endpoints in app/api/v1/endpoints/ can be deprecated gradually
