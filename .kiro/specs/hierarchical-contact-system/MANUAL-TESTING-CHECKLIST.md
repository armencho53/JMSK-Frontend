# Manual Testing Checklist - Hierarchical Contact System

## Overview
This checklist provides comprehensive manual testing procedures for the hierarchical contact system implementation. Test all scenarios in both development and staging environments before production deployment.

**Test Environment Requirements:**
- Backend server running (port 8000)
- Frontend server running (port 5173)
- Database with test data
- Valid authentication credentials
- Multiple tenant accounts for multi-tenant testing

---

## 1. Contact Creation Flow

### 1.1 Create New Contact - Happy Path
**Requirements: 1.1, 1.4, 6.2, 6.5**

- [ ] Navigate to Contacts page
- [ ] Click "Add Contact" or "Create Contact" button
- [ ] Verify ContactFormModal opens
- [ ] Fill in required fields:
  - [ ] Name: "John Smith"
  - [ ] Email: "john.smith@example.com"
  - [ ] Phone: "555-0123"
  - [ ] Company: Select from dropdown (required)
- [ ] Click "Save" or "Create"
- [ ] Verify success notification appears
- [ ] Verify new contact appears in contacts list
- [ ] Verify contact shows associated company name

### 1.2 Create Contact - Validation Testing
**Requirements: 1.4, 6.5**

- [ ] Open ContactFormModal
- [ ] Try to submit with empty name field
  - [ ] Verify validation error appears
- [ ] Try to submit without selecting a company
  - [ ] Verify validation error appears
- [ ] Enter invalid email format (e.g., "notanemail")
  - [ ] Verify email validation error
- [ ] Enter valid data and submit
  - [ ] Verify contact is created successfully

### 1.3 Create Duplicate Contact
**Requirements: 1.4**

- [ ] Create a contact with email "test@example.com" for Company A
- [ ] Try to create another contact with same email for Company A
  - [ ] Verify error message about duplicate email within company
- [ ] Create contact with same email for Company B
  - [ ] Verify this is allowed (different company)

### 1.4 Edit Existing Contact
**Requirements: 6.2, 6.4**

- [ ] Navigate to Contacts page
- [ ] Click edit icon/button on a contact
- [ ] Verify ContactFormModal opens with pre-filled data
- [ ] Modify name to "Jane Doe Updated"
- [ ] Change phone number
- [ ] Click "Save"
- [ ] Verify success notification
- [ ] Verify updated information displays in list

### 1.5 Delete Contact
**Requirements: 6.2**

- [ ] Navigate to Contacts page
- [ ] Click delete icon/button on a contact
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" - verify contact remains
- [ ] Click delete again and confirm
- [ ] Verify success notification
- [ ] Verify contact removed from list

---

## 2. Company-Contact Hierarchy Navigation

### 2.1 View Company Details
**Requirements: 4.1, 4.2, 4.3, 7.3**

- [ ] Navigate to Companies page
- [ ] Click on a company name
- [ ] Verify navigation to CompanyDetail page
- [ ] Verify page displays:
  - [ ] Company name and information
  - [ ] List of all contacts for this company
  - [ ] Company addresses section
  - [ ] Total company balance
  - [ ] Aggregated orders from all contacts

### 2.2 Navigate from Company to Contact
**Requirements: 3.4, 7.3**

- [ ] On CompanyDetail page
- [ ] Click on a contact name in the contacts list
- [ ] Verify navigation to ContactDetail page
- [ ] Verify breadcrumb shows: Companies → [Company Name] → [Contact Name]
- [ ] Click company name in breadcrumb
  - [ ] Verify navigation back to CompanyDetail

### 2.3 Navigate from Order to Contact
**Requirements: 3.1, 3.4, 7.3**

- [ ] Navigate to Orders page (or Dashboard with orders)
- [ ] Locate an order with contact information
- [ ] Verify contact name is displayed and clickable
- [ ] Click on contact name
- [ ] Verify navigation to ContactDetail page
- [ ] Verify contact's order history is displayed

### 2.4 Breadcrumb Navigation
**Requirements: 3.4, 7.3**

- [ ] Navigate to ContactDetail page via any route
- [ ] Verify breadcrumb displays full hierarchy
- [ ] Click each breadcrumb level:
  - [ ] Companies link → navigates to Companies list
  - [ ] Company name → navigates to CompanyDetail
  - [ ] Contact name → stays on ContactDetail (current page)

---

## 3. Order History Views

### 3.1 Contact Order History
**Requirements: 3.1, 3.2, 3.3**

- [ ] Navigate to ContactDetail page
- [ ] Verify "Order History" section is visible
- [ ] Verify all orders for this contact are displayed
- [ ] Verify orders show:
  - [ ] Order number
  - [ ] Order date
  - [ ] Due date
  - [ ] Price/value
  - [ ] Status
- [ ] Verify orders are in chronological order (newest first or oldest first)
- [ ] If contact has no orders:
  - [ ] Verify appropriate empty state message

### 3.2 Company Order Aggregation
**Requirements: 4.1, 4.2, 4.3, 4.4**

- [ ] Navigate to CompanyDetail page
- [ ] Verify "Orders" section displays all orders from all contacts
- [ ] Verify orders can be grouped by contact (if implemented)
- [ ] Verify total company balance is calculated correctly
- [ ] Verify balance equals sum of all order prices
- [ ] Test with company having multiple contacts:
  - [ ] Verify orders from all contacts appear
  - [ ] Verify each order shows which contact placed it

### 3.3 Order Filtering and Sorting
**Requirements: 4.4**

- [ ] On CompanyDetail orders section
- [ ] Test filtering by:
  - [ ] Contact (if filter exists)
  - [ ] Date range (if filter exists)
  - [ ] Status (if filter exists)
- [ ] Test sorting by:
  - [ ] Date (ascending/descending)
  - [ ] Price (ascending/descending)
  - [ ] Status

---

## 4. Address Management and Shipment Population

### 4.1 Create Company Address
**Requirements: 5.1, 5.5**

- [ ] Navigate to CompanyDetail page
- [ ] Locate "Addresses" section
- [ ] Click "Add Address" button
- [ ] Verify AddressFormModal opens
- [ ] Fill in address fields:
  - [ ] Street Address: "123 Main St"
  - [ ] City: "New York"
  - [ ] State: "NY"
  - [ ] Zip Code: "10001"
  - [ ] Country: "USA" (default)
  - [ ] Check "Set as default" checkbox
- [ ] Click "Save"
- [ ] Verify success notification
- [ ] Verify address appears in company's address list
- [ ] Verify default indicator is shown

### 4.2 Multiple Addresses for Company
**Requirements: 5.1**

- [ ] On CompanyDetail page
- [ ] Add a second address (don't set as default)
- [ ] Verify both addresses are displayed
- [ ] Verify only one address shows as default
- [ ] Edit the non-default address
- [ ] Check "Set as default"
- [ ] Save
- [ ] Verify default indicator moved to new address
- [ ] Verify only one address is marked as default

### 4.3 Address Validation
**Requirements: 5.5**

- [ ] Open AddressFormModal
- [ ] Try to submit with missing required fields:
  - [ ] Empty street address → verify error
  - [ ] Empty city → verify error
  - [ ] Empty state → verify error
  - [ ] Empty zip code → verify error
- [ ] Fill all required fields
- [ ] Verify form submits successfully

### 4.4 Shipment Address Auto-Population
**Requirements: 5.2, 5.3**

- [ ] Navigate to Orders page
- [ ] Select an order to create shipment for
- [ ] Click "Create Shipment" or similar button
- [ ] Verify shipment form opens
- [ ] Verify address fields are auto-populated with:
  - [ ] Contact's company default address
  - [ ] All address fields filled (street, city, state, zip, country)
- [ ] Verify address fields are editable

### 4.5 Modify Shipment Address
**Requirements: 5.3, 5.4**

- [ ] In shipment creation form with auto-populated address
- [ ] Modify the street address to "456 Different St"
- [ ] Modify the city to "Boston"
- [ ] Save shipment
- [ ] Verify shipment is created with modified address
- [ ] Navigate back to CompanyDetail
- [ ] Verify company's default address is unchanged
- [ ] Verify modification only affected this shipment

### 4.6 Update Company Default Address
**Requirements: 5.4**

- [ ] Navigate to CompanyDetail page
- [ ] Edit the default address
- [ ] Change street address to "789 New Default St"
- [ ] Save changes
- [ ] Create a new shipment for this company's contact
- [ ] Verify new shipment uses updated default address
- [ ] Check existing shipments
  - [ ] Verify they retain their original addresses

### 4.7 Delete Address
**Requirements: 5.1**

- [ ] On CompanyDetail page with multiple addresses
- [ ] Try to delete the default address
  - [ ] Verify warning or prevention (if implemented)
  - [ ] Or verify another address becomes default
- [ ] Delete a non-default address
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify address is removed from list

---

## 5. Terminology Updates Verification

### 5.1 Navigation Menu
**Requirements: 1.2, 6.2, 7.1**

- [ ] Check sidebar navigation
- [ ] Verify "Contacts" menu item exists (not "Customers" or "Clients")
- [ ] Verify "Companies" menu item exists
- [ ] Verify menu icons are appropriate
- [ ] Click each menu item to verify navigation works

### 5.2 Page Titles and Headers
**Requirements: 7.1, 7.2, 7.4**

- [ ] Contacts page:
  - [ ] Page title: "Contacts" (check browser tab)
  - [ ] Page header: "Contacts" or similar
- [ ] ContactDetail page:
  - [ ] Page title includes contact name
  - [ ] Header shows "Contact Details" or similar
- [ ] Companies page:
  - [ ] Page title: "Companies"
  - [ ] Page header: "Companies"
- [ ] CompanyDetail page:
  - [ ] Page title includes company name
  - [ ] Header shows "Company Details" or similar

### 5.3 Form Labels and Placeholders
**Requirements: 6.2, 7.1, 7.2**

- [ ] ContactFormModal:
  - [ ] Labels use "Contact" terminology
  - [ ] Placeholders are appropriate
  - [ ] Help text uses "Contact" not "Customer" or "Client"
- [ ] CompanyFormModal:
  - [ ] All labels are clear and consistent
- [ ] AddressFormModal:
  - [ ] Labels reference "Company Address"

### 5.4 Table Headers and Columns
**Requirements: 7.1, 7.2**

- [ ] Contacts list page:
  - [ ] Column headers use "Contact" terminology
  - [ ] "Company" column shows company names
- [ ] Orders page:
  - [ ] Column shows "Contact" not "Customer"
  - [ ] Company information is visible
- [ ] CompanyDetail page:
  - [ ] Contacts section header uses "Contacts"

### 5.5 Notifications and Messages
**Requirements: 6.2, 7.1, 7.2**

- [ ] Create contact → success message uses "Contact"
- [ ] Update contact → success message uses "Contact"
- [ ] Delete contact → confirmation uses "Contact"
- [ ] Error messages use "Contact" terminology
- [ ] Empty states use appropriate terminology:
  - [ ] "No contacts found"
  - [ ] "No orders for this contact"
  - [ ] "No addresses for this company"

### 5.6 Search and Filter Labels
**Requirements: 7.1**

- [ ] Search placeholder: "Search contacts..." (not customers)
- [ ] Filter labels use "Contact" and "Company"
- [ ] Dropdown options are clear

---

## 6. Multi-Tenant Isolation Testing

### 6.1 Setup Multi-Tenant Test
**Requirements: 1.6, 2.5**

**Prerequisites:**
- [ ] Create two tenant accounts (Tenant A and Tenant B)
- [ ] Create test data for each tenant:
  - Tenant A: Company A1 with Contact A1
  - Tenant B: Company B1 with Contact B1

### 6.2 Contact Isolation
**Requirements: 1.6**

- [ ] Login as Tenant A
- [ ] Navigate to Contacts page
- [ ] Verify only Tenant A's contacts are visible
- [ ] Verify Contact A1 is visible
- [ ] Verify Contact B1 is NOT visible
- [ ] Logout and login as Tenant B
- [ ] Navigate to Contacts page
- [ ] Verify only Tenant B's contacts are visible
- [ ] Verify Contact B1 is visible
- [ ] Verify Contact A1 is NOT visible

### 6.3 Company Isolation
**Requirements: 1.6**

- [ ] Login as Tenant A
- [ ] Navigate to Companies page
- [ ] Verify only Tenant A's companies are visible
- [ ] Verify Company A1 is visible
- [ ] Verify Company B1 is NOT visible
- [ ] Logout and login as Tenant B
- [ ] Navigate to Companies page
- [ ] Verify only Tenant B's companies are visible
- [ ] Verify Company B1 is visible
- [ ] Verify Company A1 is NOT visible

### 6.4 Order Isolation
**Requirements: 1.6, 3.2**

- [ ] Create orders for both tenants
- [ ] Login as Tenant A
- [ ] Navigate to ContactDetail for Contact A1
- [ ] Verify only orders from Tenant A are visible
- [ ] Navigate to CompanyDetail for Company A1
- [ ] Verify only orders from Tenant A are visible
- [ ] Logout and login as Tenant B
- [ ] Repeat verification for Tenant B's data

### 6.5 Address Isolation
**Requirements: 1.6, 5.1**

- [ ] Login as Tenant A
- [ ] Navigate to CompanyDetail for Company A1
- [ ] Verify only Tenant A's addresses are visible
- [ ] Try to access Tenant B's company via URL manipulation
  - [ ] Verify access is denied or returns 404
- [ ] Logout and login as Tenant B
- [ ] Verify only Tenant B's addresses are visible

### 6.6 Cross-Tenant API Protection
**Requirements: 1.6**

- [ ] Login as Tenant A
- [ ] Open browser developer tools
- [ ] Note the ID of a Tenant B contact (from database or previous test)
- [ ] Try to access Tenant B's contact via API:
  - [ ] GET /api/v1/contacts/{tenant_b_contact_id}
  - [ ] Verify 404 or 403 response
- [ ] Try to update Tenant B's contact:
  - [ ] PUT /api/v1/contacts/{tenant_b_contact_id}
  - [ ] Verify 404 or 403 response
- [ ] Try to delete Tenant B's contact:
  - [ ] DELETE /api/v1/contacts/{tenant_b_contact_id}
  - [ ] Verify 404 or 403 response

---

## 7. Balance Calculation Testing

### 7.1 Single Contact Balance
**Requirements: 2.1, 2.2**

- [ ] Create a new company "Test Company"
- [ ] Create a contact "Test Contact" for this company
- [ ] Note the initial company balance (should be 0)
- [ ] Create an order for this contact with price $100
- [ ] Navigate to CompanyDetail
- [ ] Verify company balance shows $100
- [ ] Create another order for same contact with price $50
- [ ] Refresh CompanyDetail
- [ ] Verify company balance shows $150

### 7.2 Multiple Contacts Balance Aggregation
**Requirements: 2.1, 2.2**

- [ ] Create company "Multi-Contact Company"
- [ ] Create Contact 1 for this company
- [ ] Create Contact 2 for this company
- [ ] Create order for Contact 1: $200
- [ ] Create order for Contact 2: $300
- [ ] Navigate to CompanyDetail
- [ ] Verify company balance shows $500 (sum of both contacts)
- [ ] Create another order for Contact 1: $100
- [ ] Refresh CompanyDetail
- [ ] Verify company balance shows $600

### 7.3 Balance After Order Update
**Requirements: 2.2**

- [ ] Navigate to an existing order
- [ ] Note the current company balance
- [ ] Update the order price from $100 to $150
- [ ] Navigate to CompanyDetail
- [ ] Verify company balance increased by $50

### 7.4 Balance After Order Deletion
**Requirements: 2.2**

- [ ] Note current company balance
- [ ] Delete an order worth $100
- [ ] Navigate to CompanyDetail
- [ ] Verify company balance decreased by $100

### 7.5 Balance Consistency
**Requirements: 2.5**

- [ ] Navigate to CompanyDetail
- [ ] Note the displayed balance
- [ ] Manually calculate sum of all order prices for this company
- [ ] Verify displayed balance matches manual calculation
- [ ] Refresh the page
- [ ] Verify balance remains consistent

---

## 8. Edge Cases and Error Handling

### 8.1 Empty States
**Requirements: 7.1, 7.4**

- [ ] Create a new company with no contacts
  - [ ] Verify appropriate empty state message
- [ ] Create a contact with no orders
  - [ ] Verify ContactDetail shows "No orders" message
- [ ] Create a company with no addresses
  - [ ] Verify appropriate empty state message

### 8.2 Network Error Handling

- [ ] Stop the backend server
- [ ] Try to load Contacts page
  - [ ] Verify error message is displayed
  - [ ] Verify UI doesn't crash
- [ ] Try to create a contact
  - [ ] Verify error notification appears
- [ ] Restart backend server
- [ ] Verify application recovers

### 8.3 Invalid Data Handling

- [ ] Try to access non-existent contact: /contacts/99999
  - [ ] Verify 404 page or error message
- [ ] Try to access non-existent company: /companies/99999
  - [ ] Verify 404 page or error message

### 8.4 Long Data Handling

- [ ] Create contact with very long name (100+ characters)
  - [ ] Verify UI handles it gracefully (truncation or wrapping)
- [ ] Create company with very long address
  - [ ] Verify display is readable

### 8.5 Special Characters

- [ ] Create contact with name containing special characters: "O'Brien"
  - [ ] Verify saves and displays correctly
- [ ] Create address with special characters in street name
  - [ ] Verify saves and displays correctly

---

## 9. Performance and Usability

### 9.1 Page Load Times

- [ ] Navigate to Contacts page with 50+ contacts
  - [ ] Verify page loads in reasonable time (< 3 seconds)
- [ ] Navigate to CompanyDetail with 20+ contacts and 100+ orders
  - [ ] Verify page loads in reasonable time
  - [ ] Verify pagination or lazy loading if implemented

### 9.2 Form Responsiveness

- [ ] Open ContactFormModal
- [ ] Type in fields
  - [ ] Verify no lag or delay
- [ ] Open company dropdown with 50+ companies
  - [ ] Verify dropdown loads quickly
  - [ ] Verify search/filter works (if implemented)

### 9.3 Mobile Responsiveness (if applicable)

- [ ] Resize browser to mobile width (375px)
- [ ] Test all pages:
  - [ ] Contacts list
  - [ ] ContactDetail
  - [ ] Companies list
  - [ ] CompanyDetail
- [ ] Verify layouts are readable and functional
- [ ] Verify forms are usable on mobile

---

## 10. Integration Testing

### 10.1 Complete User Workflow

**Scenario: New company with contact places order and receives shipment**

- [ ] Step 1: Create new company "ABC Jewelry"
  - [ ] Add default address
- [ ] Step 2: Create contact "Sarah Johnson" for ABC Jewelry
  - [ ] Add email and phone
- [ ] Step 3: Create order for Sarah Johnson
  - [ ] Verify order shows Sarah as contact
  - [ ] Verify order shows ABC Jewelry as company
- [ ] Step 4: Navigate to ABC Jewelry company page
  - [ ] Verify Sarah appears in contacts list
  - [ ] Verify order appears in company orders
  - [ ] Verify balance reflects order price
- [ ] Step 5: Create shipment for the order
  - [ ] Verify ABC Jewelry's address auto-populates
  - [ ] Complete shipment
- [ ] Step 6: Navigate to Sarah's contact page
  - [ ] Verify order appears in her order history
  - [ ] Verify company information is displayed

### 10.2 Multi-Contact Company Workflow

**Scenario: Company with multiple contacts placing orders**

- [ ] Create company "XYZ Corp"
- [ ] Create Contact 1: "John Doe"
- [ ] Create Contact 2: "Jane Smith"
- [ ] Create order for John: $500
- [ ] Create order for Jane: $750
- [ ] Navigate to XYZ Corp company page
  - [ ] Verify both contacts listed
  - [ ] Verify both orders appear
  - [ ] Verify balance shows $1,250
- [ ] Click on John's name
  - [ ] Verify navigation to John's contact page
  - [ ] Verify only John's order appears
- [ ] Navigate back to XYZ Corp
- [ ] Click on Jane's name
  - [ ] Verify navigation to Jane's contact page
  - [ ] Verify only Jane's order appears

---

## 11. Regression Testing

### 11.1 Existing Features Still Work

- [ ] Authentication/Login still works
- [ ] Dashboard displays correctly
- [ ] Orders page functions correctly
- [ ] Manufacturing page functions correctly
- [ ] Shipments page functions correctly
- [ ] User profile/settings work
- [ ] Logout works correctly

### 11.2 Backward Compatibility

- [ ] Existing orders still display correctly
- [ ] Old API endpoints still work (if maintained)
- [ ] Existing data is accessible

---

## 12. Documentation and Help

### 12.1 User Guidance

- [ ] Check if tooltips are present where needed
- [ ] Verify help text is clear and accurate
- [ ] Verify error messages are helpful

### 12.2 Developer Documentation

- [ ] API documentation is updated
- [ ] README files are current
- [ ] Code comments are accurate

---

## Test Summary

### Test Results Template

```
Test Date: _______________
Tester: _______________
Environment: [ ] Development [ ] Staging [ ] Production

Total Tests: _____
Passed: _____
Failed: _____
Blocked: _____

Critical Issues Found:
1. 
2. 
3. 

Minor Issues Found:
1. 
2. 
3. 

Notes:


Sign-off: _______________
```

---

## Appendix: Test Data Setup

### Sample Companies
```
1. Acme Jewelry Co.
   - Email: contact@acmejewelry.com
   - Phone: 555-0100
   - Address: 123 Main St, New York, NY 10001

2. Brilliant Gems Inc.
   - Email: info@brilliantgems.com
   - Phone: 555-0200
   - Address: 456 Oak Ave, Los Angeles, CA 90001
```

### Sample Contacts
```
1. John Smith (Acme Jewelry Co.)
   - Email: john.smith@acmejewelry.com
   - Phone: 555-0101

2. Jane Doe (Acme Jewelry Co.)
   - Email: jane.doe@acmejewelry.com
   - Phone: 555-0102

3. Bob Wilson (Brilliant Gems Inc.)
   - Email: bob.wilson@brilliantgems.com
   - Phone: 555-0201
```

### Sample Orders
```
1. Order #1001 - John Smith - $500 - Pending
2. Order #1002 - Jane Doe - $750 - In Progress
3. Order #1003 - Bob Wilson - $1200 - Completed
4. Order #1004 - John Smith - $300 - Pending
```

---

## Quick Reference: Requirements Coverage

| Requirement | Test Sections |
|-------------|---------------|
| 1.1 - Rename Client to Contact | 5.1, 5.2, 5.3, 5.4, 5.5 |
| 1.2 - Update UI references | 5.1, 5.2, 5.3, 5.4, 5.5 |
| 1.3 - One-to-many relationship | 1.1, 2.1, 2.2 |
| 1.4 - Contact requires company | 1.1, 1.2, 1.3 |
| 1.5 - Preserve order relationships | 3.1, 3.2, 11.2 |
| 1.6 - Referential integrity | 6.1-6.6 |
| 2.1 - Company balance aggregation | 7.1, 7.2, 7.3, 7.4, 7.5 |
| 2.2 - Balance updates | 7.3, 7.4 |
| 2.5 - Balance consistency | 7.5 |
| 3.1 - Contact name clickable | 2.3 |
| 3.2 - Contact order history | 3.1 |
| 3.3 - Chronological order | 3.1 |
| 3.4 - Navigation back | 2.2, 2.4 |
| 4.1 - Company order aggregation | 3.2 |
| 4.2 - Group by contact | 3.2 |
| 4.3 - Company metrics | 3.2 |
| 4.4 - Filtering and sorting | 3.3 |
| 5.1 - Company addresses | 4.1, 4.2, 4.7 |
| 5.2 - Auto-populate address | 4.4 |
| 5.3 - Modify shipment address | 4.5 |
| 5.4 - Update default address | 4.6 |
| 5.5 - Address validation | 4.3 |
| 6.1 - API terminology | Throughout |
| 6.2 - UI terminology | Section 5 |
| 7.1 - Consistent terminology | Section 5 |
| 7.2 - Show relationships | 2.1, 2.2 |
| 7.3 - Intuitive navigation | 2.2, 2.3, 2.4 |
| 7.4 - Consistent styling | 5.2, 8.1 |

