/**
 * Tests for the AddressFormModal component.
 * 
 * Requirements: 5.1, 5.3, 5.5
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddressFormModal from '../AddressFormModal';
import { Address } from '../../types/address';

describe('AddressFormModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockAddress: Address = {
    id: 1,
    tenant_id: 1,
    company_id: 1,
    street_address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'USA',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    test('renders create form with empty fields', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.getByRole('heading', { name: 'Add Address' })).toBeInTheDocument();
      expect(screen.getByLabelText(/Street Address/)).toHaveValue('');
      expect(screen.getByLabelText(/City/)).toHaveValue('');
      expect(screen.getByLabelText(/State/)).toHaveValue('');
      expect(screen.getByLabelText(/ZIP Code/)).toHaveValue('');
      expect(screen.getByLabelText(/Country/)).toHaveValue('USA');
      expect(screen.getByLabelText(/Set as default address/)).not.toBeChecked();
    });

    test('validates required fields on submit', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Add Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Street address is required')).toBeInTheDocument();
        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.getByText('State is required')).toBeInTheDocument();
        expect(screen.getByText('ZIP code is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('validates ZIP code length', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const zipInput = screen.getByLabelText(/ZIP Code/);
      fireEvent.change(zipInput, { target: { value: '123' } });

      const submitButton = screen.getByRole('button', { name: /Add Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('ZIP code must be at least 5 characters')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('submits valid form data with company_id', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/Street Address/), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByLabelText(/City/), {
        target: { value: 'New York' },
      });
      fireEvent.change(screen.getByLabelText(/State/), {
        target: { value: 'NY' },
      });
      fireEvent.change(screen.getByLabelText(/ZIP Code/), {
        target: { value: '10001' },
      });
      fireEvent.click(screen.getByLabelText(/Set as default address/));

      const submitButton = screen.getByRole('button', { name: /Add Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          is_default: true,
          company_id: 1,
        });
      });
    });
  });

  describe('Edit Mode', () => {
    test('renders edit form with existing address data', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="edit"
          address={mockAddress}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.getByText('Edit Address')).toBeInTheDocument();
      expect(screen.getByLabelText(/Street Address/)).toHaveValue('123 Main St');
      expect(screen.getByLabelText(/City/)).toHaveValue('New York');
      expect(screen.getByLabelText(/State/)).toHaveValue('NY');
      expect(screen.getByLabelText(/ZIP Code/)).toHaveValue('10001');
      expect(screen.getByLabelText(/Country/)).toHaveValue('USA');
      expect(screen.getByLabelText(/Set as default address/)).toBeChecked();
    });

    test('submits updated form data without company_id', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="edit"
          address={mockAddress}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/Street Address/), {
        target: { value: '456 Oak Ave' },
      });
      fireEvent.change(screen.getByLabelText(/City/), {
        target: { value: 'Boston' },
      });

      const submitButton = screen.getByRole('button', { name: /Update Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          street_address: '456 Oak Ave',
          city: 'Boston',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          is_default: true,
        });
      });

      // Should not include company_id in edit mode
      expect(mockOnSubmit.mock.calls[0][0]).not.toHaveProperty('company_id');
    });
  });

  describe('User Interactions', () => {
    test('closes modal when close button is clicked', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const closeButton = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('closes modal when cancel button is clicked', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('closes modal when backdrop is clicked', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const backdrop = document.querySelector('.bg-gray-500');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('disables buttons when submitting', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Adding.../i });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    test('toggles default address checkbox', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const checkbox = screen.getByLabelText(/Set as default address/);
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Modal Visibility', () => {
    test('does not render when isOpen is false', () => {
      render(
        <AddressFormModal
          isOpen={false}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.queryByText('Add Address')).not.toBeInTheDocument();
    });

    test('renders when isOpen is true', () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.getByRole('heading', { name: 'Add Address' })).toBeInTheDocument();
    });
  });

  describe('Field Validation', () => {
    test('trims whitespace from input fields', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/Street Address/), {
        target: { value: '  123 Main St  ' },
      });
      fireEvent.change(screen.getByLabelText(/City/), {
        target: { value: '  New York  ' },
      });
      fireEvent.change(screen.getByLabelText(/State/), {
        target: { value: '  NY  ' },
      });
      fireEvent.change(screen.getByLabelText(/ZIP Code/), {
        target: { value: '  10001  ' },
      });

      const submitButton = screen.getByRole('button', { name: /Add Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          is_default: false,
          company_id: 1,
        });
      });
    });

    test('validates country field is required', async () => {
      render(
        <AddressFormModal
          isOpen={true}
          onClose={mockOnClose}
          mode="create"
          companyId={1}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      // Clear the default country value
      fireEvent.change(screen.getByLabelText(/Country/), {
        target: { value: '' },
      });

      const submitButton = screen.getByRole('button', { name: /Add Address/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Country is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
