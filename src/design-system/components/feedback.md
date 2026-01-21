# Feedback Components

Components for providing user feedback through modals, dialogs, loading states, and notifications.

## Modal

A flexible modal component with focus management and accessibility features.

### Usage

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="Edit Order"
  size="lg"
>
  <OrderForm onSubmit={handleSubmit} />
</Modal>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Modal open state |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closeOnOverlay` | `boolean` | `true` | Close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Modal content |

### Subcomponents

- `Modal.Header` - Modal header with title and close button
- `Modal.Body` - Main modal content area
- `Modal.Footer` - Modal footer with actions

### Examples

```tsx
// Basic modal
<Modal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  title="Edit Customer"
>
  <CustomerForm
    customer={selectedCustomer}
    onSubmit={handleUpdateCustomer}
    onCancel={() => setShowEditModal(false)}
  />
</Modal>

// Large modal with custom layout
<Modal
  isOpen={showOrderDetails}
  onClose={closeOrderDetails}
  title="Order Details"
  size="xl"
>
  <Modal.Body>
    <Grid cols={{ xs: 1, lg: 2 }} gap="lg">
      <OrderInfo order={order} />
      <OrderTimeline steps={order.manufacturingSteps} />
    </Grid>
  </Modal.Body>
  <Modal.Footer>
    <Flex justify="end" gap="sm">
      <Button variant="secondary" onClick={closeOrderDetails}>
        Close
      </Button>
      <Button variant="primary" onClick={editOrder}>
        Edit Order
      </Button>
    </Flex>
  </Modal.Footer>
</Modal>

// Full-screen modal
<Modal
  isOpen={showImageGallery}
  onClose={closeGallery}
  size="full"
  showCloseButton={false}
>
  <PhotoGallery
    images={productImages}
    onClose={closeGallery}
  />
</Modal>
```

## ConfirmationDialog

A specialized modal for confirmation actions with clear primary/secondary actions.

### Usage

```tsx
import { ConfirmationDialog } from '@/components/ui';

<ConfirmationDialog
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Order"
  message="Are you sure you want to delete this order? This action cannot be undone."
  variant="danger"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Dialog open state |
| `onClose` | `() => void` | - | Close/cancel handler |
| `onConfirm` | `() => void` | - | Confirm action handler |
| `title` | `string` | - | Dialog title |
| `message` | `string \| ReactNode` | - | Confirmation message |
| `variant` | `'default' \| 'danger' \| 'warning'` | `'default'` | Dialog variant |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Delete confirmation
<ConfirmationDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleDeleteOrder}
  title="Delete Order"
  message="Are you sure you want to delete this order? This action cannot be undone."
  variant="danger"
  confirmText="Delete"
  loading={isDeleting}
/>

// Warning confirmation
<ConfirmationDialog
  isOpen={showCancelDialog}
  onClose={() => setShowCancelDialog(false)}
  onConfirm={handleCancelOrder}
  title="Cancel Order"
  message="Canceling this order will stop all manufacturing processes. Are you sure?"
  variant="warning"
  confirmText="Yes, Cancel Order"
/>

// Custom message with components
<ConfirmationDialog
  isOpen={showArchiveDialog}
  onClose={() => setShowArchiveDialog(false)}
  onConfirm={handleArchiveOrders}
  title="Archive Orders"
  message={
    <Stack spacing="sm">
      <p>You are about to archive {selectedOrders.length} orders:</p>
      <ul className="list-disc list-inside text-sm text-gray-600">
        {selectedOrders.map(order => (
          <li key={order.id}>Order #{order.id} - {order.customerName}</li>
        ))}
      </ul>
      <p>Archived orders can be restored later.</p>
    </Stack>
  }
  confirmText="Archive Orders"
/>
```

## LoadingOverlay

A loading overlay component for indicating processing states.

### Usage

```tsx
import { LoadingOverlay } from '@/components/ui';

<LoadingOverlay
  isVisible={isLoading}
  message="Processing order..."
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | `false` | Overlay visibility |
| `message` | `string` | `'Loading...'` | Loading message |
| `spinner` | `ReactNode` | - | Custom spinner component |
| `backdrop` | `boolean` | `true` | Show backdrop |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic loading overlay
<LoadingOverlay
  isVisible={isSubmitting}
  message="Saving changes..."
/>

// Custom spinner
<LoadingOverlay
  isVisible={isProcessing}
  message="Processing payment..."
  spinner={<CustomSpinner />}
/>

// No backdrop (inline loading)
<LoadingOverlay
  isVisible={isLoading}
  message="Loading data..."
  backdrop={false}
/>
```

## Toast Notifications

Toast notifications are handled through the existing toast system. Here's how to use them effectively:

### Usage

```tsx
import { toast } from '@/lib/toast';

// Success notification
toast.success('Order created successfully!');

// Error notification
toast.error('Failed to save changes. Please try again.');

// Warning notification
toast.warning('This action will affect multiple orders.');

// Info notification
toast.info('New features are now available.');
```

### Toast Patterns

```tsx
// Form submission success
const handleSubmit = async (data) => {
  try {
    await createOrder(data);
    toast.success('Order created successfully!');
    navigate('/orders');
  } catch (error) {
    toast.error('Failed to create order. Please try again.');
  }
};

// Bulk actions
const handleBulkDelete = async (selectedIds) => {
  try {
    await deleteOrders(selectedIds);
    toast.success(`${selectedIds.length} orders deleted successfully.`);
    refreshOrders();
  } catch (error) {
    toast.error('Some orders could not be deleted. Please try again.');
  }
};

// Auto-save feedback
const handleAutoSave = async (data) => {
  try {
    await saveOrder(data);
    toast.info('Changes saved automatically.');
  } catch (error) {
    toast.warning('Auto-save failed. Please save manually.');
  }
};
```

## Feedback Patterns

### Form Submission Flow

```tsx
function OrderForm({ order, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success('Order saved successfully!');
    } catch (error) {
      toast.error('Failed to save order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        
        <Flex justify="end" gap="sm">
          <Button 
            variant="secondary" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            loading={isSubmitting}
          >
            Save Order
          </Button>
        </Flex>
      </form>

      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={onCancel}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        variant="warning"
        confirmText="Discard"
      />

      <LoadingOverlay
        isVisible={isSubmitting}
        message="Saving order..."
      />
    </>
  );
}
```

### Delete Action Flow

```tsx
function OrderActions({ order, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(order.id);
      toast.success('Order deleted successfully.');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete order. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setShowDeleteConfirm(true)}
      >
        Delete
      </Button>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={
          <Stack spacing="sm">
            <p>Are you sure you want to delete this order?</p>
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>Order:</strong> #{order.id}</p>
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            <p className="text-red-600 text-sm">This action cannot be undone.</p>
          </Stack>
        }
        variant="danger"
        confirmText="Delete Order"
        loading={isDeleting}
      />
    </>
  );
}
```

### Loading States

```tsx
function DataTable({ data, loading, error }) {
  if (loading) {
    return (
      <Card>
        <Card.Body>
          <LoadingOverlay
            isVisible={true}
            message="Loading orders..."
            backdrop={false}
          />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Stack spacing="md" align="center">
            <p className="text-red-600">Failed to load orders.</p>
            <Button variant="secondary" onClick={retry}>
              Try Again
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Table
      data={data}
      columns={columns}
      emptyMessage="No orders found. Create your first order to get started."
    />
  );
}
```

## Best Practices

### Accessibility

- Ensure modals trap focus properly
- Provide clear labels for screen readers
- Use appropriate ARIA roles and properties
- Support keyboard navigation (Tab, Escape, Enter)

### User Experience

- Use appropriate modal sizes for content
- Provide clear confirmation messages
- Show loading states for async operations
- Use consistent button placement and labeling

### Performance

- Lazy load modal content when possible
- Avoid rendering modals when not needed
- Use proper cleanup for event listeners
- Optimize animations for smooth performance