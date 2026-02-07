/**
 * Tests for the AddressList component.
 * 
 * Requirements: 5.1, 5.4
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AddressList from '../AddressList'
import { Address } from '../../types/address'

const mockAddresses: Address[] = [
  {
    id: 1,
    tenant_id: 1,
    company_id: 1,
    street_address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'USA',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    tenant_id: 1,
    company_id: 1,
    street_address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90001',
    country: 'USA',
    is_default: false,
    created_at: '2024-01-02T00:00:00Z'
  }
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('AddressList Component', () => {
  describe('Rendering', () => {
    test('renders addresses correctly', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Requirement 5.1: Display company addresses
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument()
      
      // Check city, state, zip
      expect(screen.getByText('New York, NY 10001')).toBeInTheDocument()
      expect(screen.getByText('Los Angeles, CA 90001')).toBeInTheDocument()
    })

    test('indicates default address with badge', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Requirement 5.1: Indicate which address is default
      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    test('displays empty state when no addresses', () => {
      render(
        <AddressList addresses={[]} companyId={1} />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByText('No addresses found for this company.')).toBeInTheDocument()
    })

    test('displays country for each address', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      const usaElements = screen.getAllByText('USA')
      expect(usaElements).toHaveLength(2)
    })

    test('displays creation date for each address', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Check that dates are displayed
      expect(screen.getByText(/Added 1\/1\/2024/)).toBeInTheDocument()
      expect(screen.getByText(/Added 1\/2\/2024/)).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    test('includes edit button for each address', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Requirement 5.4: Include edit actions
      const editButtons = screen.getAllByText('Edit')
      expect(editButtons).toHaveLength(2)
    })

    test('includes delete button for each address', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Requirement 5.4: Include delete actions
      const deleteButtons = screen.getAllByText('Delete')
      expect(deleteButtons).toHaveLength(2)
    })

    test('opens edit modal when edit button is clicked', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      // Check that the modal opens with the address form
      expect(screen.getByText('Edit Address')).toBeInTheDocument()
    })

    test('opens delete confirmation modal when delete button is clicked', () => {
      render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      // Check that the delete confirmation modal opens
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    })
  })

  describe('Visual Styling', () => {
    test('applies special styling to default address', () => {
      const { container } = render(
        <AddressList addresses={mockAddresses} companyId={1} />,
        { wrapper: createWrapper() }
      )

      // Default address should have special styling (indigo colors)
      const cards = container.querySelectorAll('[class*="border-indigo"]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })
})
