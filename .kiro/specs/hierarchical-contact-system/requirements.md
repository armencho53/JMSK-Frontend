# Requirements Document

## Introduction

This specification defines the restructuring of JMSK's current client-company system into a unified hierarchical contact system. The system will establish a clear parent-child relationship between companies and their associated contacts (formerly clients), while maintaining data integrity and preserving existing order relationships.

## Glossary

- **Contact**: An individual person (formerly called "Client") who works for a company and can place orders
- **Company**: An organization that employs one or more contacts and serves as the parent entity in the hierarchy
- **Order**: A business transaction placed by a contact on behalf of their company
- **Balance**: Financial summary representing accumulated value from orders
- **JMSK_Frontend**: The React-based frontend application
- **JMSK_Backend**: The Python-based backend API application
- **Order_Value**: The monetary amount associated with a specific order
- **Address**: A location associated with a company for shipping purposes
- **Contact_Order_History**: A record of all orders placed by a specific contact
- **Company_Order_History**: A record of all orders placed by all contacts associated with a specific company
- **Data_Model**: The structure defining how information is stored and related within the system

## Requirements

### Requirement 1: Entity Restructuring

**User Story:** As a system administrator, I want to restructure the client-company entities into a hierarchical contact system, so that the data model accurately reflects business relationships.

#### Acceptance Criteria

1. THE JMSK_Backend SHALL rename all "Client" entities to "Contact" entities in the database schema and API
2. THE JMSK_Frontend SHALL update all UI references from "Client" to "Contact"
3. THE JMSK_Backend SHALL establish a one-to-many relationship where one Company can have multiple Contacts
4. WHEN a Contact is created, THE JMSK_Backend SHALL require association with exactly one Company
5. THE JMSK_Backend SHALL preserve all existing order relationships during the restructuring
6. THE JMSK_Backend SHALL maintain referential integrity between Companies, Contacts, and Orders

### Requirement 2: Balance Calculation and Aggregation

**User Story:** As a business manager, I want company balances to reflect the accumulated value from all associated contacts, so that I can see the total business value per company.

#### Acceptance Criteria

1. WHEN calculating company balance, THE JMSK_Backend SHALL sum all order values from all contacts associated with that company
2. WHEN order value changes, THE JMSK_Backend SHALL update the parent company's balance accordingly
3. THE JMSK_Frontend SHALL display aggregated company balance only
4. WHEN a contact is moved to a different company, the balance does not change.
5. THE JMSK_Backend SHALL ensure balance calculations are atomic and consistent across concurrent operations

### Requirement 3: Contact Order History Navigation

**User Story:** As a user, I want to click on a contact name in orders and see all other orders they have placed, so that I can track individual contact activity.

#### Acceptance Criteria

1. WHEN a user clicks on a contact name in any order display, THE JMSK_Frontend SHALL navigate to a contact detail view
2. THE JMSK_Frontend Contact_Detail_View SHALL display all orders placed by that specific contact (fetched from JMSK_Backend)
3. THE JMSK_Frontend Contact_Detail_View SHALL show order history in chronological order with relevant details
4. THE JMSK_Frontend Contact_Detail_View SHALL provide navigation back to the original context

### Requirement 4: Company Order Aggregation

**User Story:** As a business manager, I want to view a company page that shows all orders from all contacts working for that company, so that I can see complete company activity.

#### Acceptance Criteria

1. THE JMSK_Frontend Company_Page SHALL display all orders placed by any contact associated with that company (fetched from JMSK_Backend)
2. THE JMSK_Frontend Company_Page SHALL group orders by contact while maintaining chronological ordering
3. THE JMSK_Frontend Company_Page SHALL show both individual contact contributions and total company metrics
4. THE JMSK_Frontend Company_Page SHALL provide filtering and sorting capabilities for the aggregated order data

### Requirement 5: Company Address Management

**User Story:** As a user, I want companies to have addresses that automatically populate during shipment but can be modified when needed, so that shipping is efficient but flexible.

#### Acceptance Criteria

1. THE JMSK_Backend SHALL store a default address for each company
2. WHEN creating a shipment for any contact's order, THE JMSK_Frontend SHALL automatically populate the company's default address (fetched from JMSK_Backend)
3. THE JMSK_Frontend SHALL allow users to modify the address for individual shipments without changing the company's default
4. WHEN a user updates a company's default address, THE JMSK_Backend SHALL apply it to future shipments but not modify existing ones
5. THE JMSK_Frontend Address_Form SHALL validate address completeness before allowing shipment creation


### Requirement 6: API and Frontend Updates

**User Story:** As a developer, I want all API endpoints and UI components updated to reflect the new contact system, so that the application functions correctly with the new data model.

#### Acceptance Criteria

1. THE JMSK_Backend SHALL update all API endpoints to use "contact" terminology instead of "client"
2. THE JMSK_Frontend SHALL update all UI components to display "Contact" instead of "Client"
3. THE JMSK_Backend SHALL maintain backward compatibility during the transition period
4. THE JMSK_Backend SHALL update all database queries to work with the new hierarchical structure
5. THE JMSK_Frontend SHALL update all form validations to enforce the company-contact relationship

### Requirement 7: User Interface Consistency

**User Story:** As a user, I want the interface to consistently reflect the new contact terminology and hierarchical relationships, so that the system is intuitive to use.

#### Acceptance Criteria

1. THE JMSK_Frontend SHALL display "Contact" terminology throughout all user interfaces
2. THE JMSK_Frontend SHALL show company-contact relationships clearly in all relevant views
3. THE JMSK_Frontend SHALL provide intuitive navigation between company and contact views
4. THE JMSK_Frontend SHALL maintain consistent styling and layout patterns across updated components
5. THE JMSK_Frontend SHALL provide clear visual indicators of the hierarchical relationship structure

### Requirement 8: Databse creation and table seeding to reflect new structure

**User Story:** As a system administrator, I want to ensure the database is properly structured and seeded with initial data reflecting the new contact-company hierarchy, so that the system can function with the updated data model.

#### Acceptance Criteria

1. THE JMSK_Backend database SHALL be restructured to support the new contact-company hierarchy
2. THE JMSK_Backend database SHALL include tables for Companies, Contacts, Orders, and their relationships
3. THE JMSK_Backend database SHALL seed initial data including sample companies, contacts, and orders
4. THE JMSK_Backend database SHALL ensure data integrity through appropriate constraints and indexes
5. THE JMSK_Backend database SHALL provide efficient querying capabilities for the new hierarchical relationships
