/**
 * Tests for ShipmentFormModal component
 * 
 * Validates shipment creation flow with auto-populated company addresses
 * Requirements: 5.2, 5.3
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ShipmentFormModal from '../ShipmentFormModal'

// Mock the api module
jest.mock('../../lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

// Import after mocking
import api from '../../lib/api'
const mockedApi = api as jest.Mocked<typeof api>

describe('ShipmentFormModal', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    jest.clearAllMocks()
  })

  const mockOrders = [
    {
      id: 1,
      order_number: 'ORD-001',
      customer_name: 'John Doe',
      company_id: 10,
      contact_id: 5,
      tenant_id: 1,
      quantity: 1,
      status: 'pending',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 2,
      order_number: 'ORD-002',
      customer_name: 'Jane Smith',
      company_id: 20,
      contact_id: 6,
      tenant_id: 1,
      quantity: 2,
      status: 'pending',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ]

  const mockDefaultAddress = {
    street_address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'USA',
  }

  const renderModal = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      mode: 'create' as const,
      onSubmit: jest.fn(),
      isSubmitting: false,
    }

    return render(
      <QueryClientProvider client={queryClient}>
        <ShipmentFormModal {...defaultProps} {...props} />
      </QueryClientProvider>
    )
  }

  it('renders the modal when open', () => {
    mockedApi.get.mockResolvedValue({ data: mockOrders })

    renderModal()

    expect(screen.getByRole('heading', { name: 'Create Shipment' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Order/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Shipping Address/)).toBeInTheDocument()
  })

  it('fetches and displays orders in dropdown', async () => {
    mockedApi.get.mockResolvedValue({ data: mockOrders })

    renderModal()

    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
      expect(screen.getByText('ORD-002 - Jane Smith')).toBeInTheDocument()
    })
  })

  it('auto-populates company default address when order is selected', async () => {
    // Mock orders fetch
    mockedApi.get.mockImplementation((url) => {
      if (url === '/orders/') {
        return Promise.resolve({ data: mockOrders })
      }
      if (url === '/companies/10/addresses/shipment-default') {
        return Promise.resolve({ data: mockDefaultAddress })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    renderModal()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
    })

    // Select an order
    const orderSelect = screen.getByLabelText(/Order/)
    fireEvent.change(orderSelect, { target: { value: '1' } })

    // Wait for address to be populated
    await waitFor(() => {
      const addressField = screen.getByLabelText(/Shipping Address/) as HTMLTextAreaElement
      expect(addressField.value).toContain('123 Main St')
      expect(addressField.value).toContain('New York, NY 10001')
      expect(addressField.value).toContain('USA')
    })

    // Verify the API was called with correct company_id
    expect(mockedApi.get).toHaveBeenCalledWith('/companies/10/addresses/shipment-default')
  })

  it('shows loading indicator while fetching address', async () => {
    // Mock orders fetch
    mockedApi.get.mockImplementation((url) => {
      if (url === '/orders/') {
        return Promise.resolve({ data: mockOrders })
      }
      if (url === '/companies/10/addresses/shipment-default') {
        // Delay the response to test loading state
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: mockDefaultAddress })
          }, 100)
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    renderModal()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
    })

    // Select an order
    const orderSelect = screen.getByLabelText(/Order/)
    fireEvent.change(orderSelect, { target: { value: '1' } })

    // Check for loading indicator
    expect(screen.getByText('Loading company address...')).toBeInTheDocument()

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading company address...')).not.toBeInTheDocument()
    })
  })

  it('allows user to modify auto-populated address', async () => {
    mockedApi.get.mockImplementation((url) => {
      if (url === '/orders/') {
        return Promise.resolve({ data: mockOrders })
      }
      if (url === '/companies/10/addresses/shipment-default') {
        return Promise.resolve({ data: mockDefaultAddress })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    renderModal()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
    })

    // Select an order
    const orderSelect = screen.getByLabelText(/Order/)
    fireEvent.change(orderSelect, { target: { value: '1' } })

    // Wait for address to be populated
    await waitFor(() => {
      const addressField = screen.getByLabelText(/Shipping Address/) as HTMLTextAreaElement
      expect(addressField.value).toContain('123 Main St')
    })

    // Modify the address
    const addressField = screen.getByLabelText(/Shipping Address/) as HTMLTextAreaElement
    fireEvent.change(addressField, { target: { value: '456 Different St\nBoston, MA 02101\nUSA' } })

    // Verify the address was updated
    expect(addressField.value).toBe('456 Different St\nBoston, MA 02101\nUSA')
  })

  it('shows helpful message about auto-populated address', async () => {
    mockedApi.get.mockImplementation((url) => {
      if (url === '/orders/') {
        return Promise.resolve({ data: mockOrders })
      }
      if (url === '/companies/10/addresses/shipment-default') {
        return Promise.resolve({ data: mockDefaultAddress })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    renderModal()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
    })

    // Select an order
    const orderSelect = screen.getByLabelText(/Order/)
    fireEvent.change(orderSelect, { target: { value: '1' } })

    // Wait for address to be populated and check for helper text
    await waitFor(() => {
      expect(
        screen.getByText(/Auto-populated from company default. You can modify this address for this shipment./)
      ).toBeInTheDocument()
    })
  })

  it('handles missing default address gracefully', async () => {
    mockedApi.get.mockImplementation((url) => {
      if (url === '/orders/') {
        return Promise.resolve({ data: mockOrders })
      }
      if (url === '/companies/10/addresses/shipment-default') {
        return Promise.resolve({ data: null })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    renderModal()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('ORD-001 - John Doe')).toBeInTheDocument()
    })

    // Select an order
    const orderSelect = screen.getByLabelText(/Order/)
    fireEvent.change(orderSelect, { target: { value: '1' } })

    // Wait a bit to ensure no address is populated
    await waitFor(() => {
      const addressField = screen.getByLabelText(/Shipping Address/) as HTMLTextAreaElement
      expect(addressField.value).toBe('')
    })
  })

  it('does not fetch address in edit mode', async () => {
    const mockShipment = {
      id: 1,
      order_id: 1,
      tracking_number: 'TRACK123',
      carrier: 'UPS',
      shipping_address: '789 Existing St\nChicago, IL 60601\nUSA',
      status: 'SHIPPED',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    mockedApi.get.mockResolvedValue({ data: mockOrders })

    renderModal({ mode: 'edit', shipment: mockShipment })

    await waitFor(() => {
      expect(screen.getByText('Edit Shipment')).toBeInTheDocument()
    })

    // Verify address is from shipment, not fetched
    const addressField = screen.getByLabelText(/Shipping Address/) as HTMLTextAreaElement
    expect(addressField.value).toBe('789 Existing St\nChicago, IL 60601\nUSA')

    // Verify no address fetch was attempted
    expect(mockedApi.get).not.toHaveBeenCalledWith(expect.stringContaining('/addresses/shipment-default'))
  })
})
