# Form Components

Form components provide consistent input handling and validation across the application.

## Button

A versatile button component with multiple variants and states.

### Usage

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable button |
| `fullWidth` | `boolean` | `false` | Full width button |
| `icon` | `ReactNode` | - | Icon element |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Button content |

### Examples

```tsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icons
<Button icon={<PlusIcon />}>Add Item</Button>
<Button icon={<ArrowIcon />} iconPosition="right">Next</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

## Input

A flexible input component with validation and floating labels.

### Usage

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `type` | `string` | `'text'` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable input |
| `required` | `boolean` | `false` | Required field |
| `icon` | `ReactNode` | - | Input icon |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic input
<Input
  label="Full Name"
  value={name}
  onChange={setName}
  placeholder="Enter your name"
/>

// Email input with validation
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>

// Password input
<Input
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  icon={<LockIcon />}
/>

// Disabled input
<Input
  label="Read Only"
  value="Cannot edit"
  disabled
/>
```

## Select

A custom select dropdown with search functionality.

### Usage

```tsx
import { Select } from '@/components/ui';

<Select
  label="Category"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `options` | `Array<{value: string, label: string}>` | `[]` | Select options |
| `value` | `string` | - | Selected value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `searchable` | `boolean` | `false` | Enable search |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable select |
| `required` | `boolean` | `false` | Required field |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic select
<Select
  label="Metal Type"
  options={[
    { value: 'gold-24k', label: '24K Gold' },
    { value: 'gold-18k', label: '18K Gold' },
    { value: 'silver-925', label: '925 Silver' },
    { value: 'platinum', label: 'Platinum' }
  ]}
  value={metalType}
  onChange={setMetalType}
/>

// Searchable select
<Select
  label="Customer"
  options={customers}
  value={selectedCustomer}
  onChange={setSelectedCustomer}
  searchable
  placeholder="Search customers..."
/>

// With error
<Select
  label="Department"
  options={departments}
  value={department}
  onChange={setDepartment}
  error="Please select a department"
  required
/>
```

## DatePicker

A date picker component with calendar interface.

### Usage

```tsx
import { DatePicker } from '@/components/ui';

<DatePicker
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Date picker label |
| `value` | `Date \| null` | `null` | Selected date |
| `onChange` | `(date: Date \| null) => void` | - | Change handler |
| `placeholder` | `string` | `'Select date'` | Placeholder text |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable picker |
| `required` | `boolean` | `false` | Required field |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic date picker
<DatePicker
  label="Order Date"
  value={orderDate}
  onChange={setOrderDate}
/>

// With date constraints
<DatePicker
  label="Delivery Date"
  value={deliveryDate}
  onChange={setDeliveryDate}
  minDate={new Date()}
  placeholder="Select delivery date"
/>

// Required with error
<DatePicker
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
  error="Due date is required"
  required
/>
```

## FileUpload

A drag-and-drop file upload component.

### Usage

```tsx
import { FileUpload } from '@/components/ui';

<FileUpload
  label="Product Images"
  accept="image/*"
  multiple
  onFilesChange={setFiles}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Upload area label |
| `accept` | `string` | - | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | - | Max file size in bytes |
| `onFilesChange` | `(files: File[]) => void` | - | Files change handler |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable upload |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Image upload
<FileUpload
  label="Product Photos"
  accept="image/jpeg,image/png,image/webp"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  onFilesChange={setImages}
/>

// Document upload
<FileUpload
  label="Specifications"
  accept=".pdf,.doc,.docx"
  onFilesChange={setDocuments}
/>

// With error
<FileUpload
  label="Certificate"
  accept=".pdf"
  onFilesChange={setCertificate}
  error="Please upload a valid certificate"
/>
```

## Form Patterns

### Form Layout

```tsx
import { Stack, Grid, Button } from '@/components/ui';

function OrderForm() {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="lg">
        <Grid cols={{ xs: 1, md: 2 }} gap="md">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={setCustomerName}
            required
          />
          <Select
            label="Metal Type"
            options={metalTypes}
            value={metalType}
            onChange={setMetalType}
            required
          />
        </Grid>
        
        <Input
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Order description..."
        />
        
        <Grid cols={{ xs: 1, md: 2 }} gap="md">
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            minDate={new Date()}
            required
          />
          <Input
            label="Weight (grams)"
            type="number"
            value={weight}
            onChange={setWeight}
            required
          />
        </Grid>
        
        <FileUpload
          label="Reference Images"
          accept="image/*"
          multiple
          onFilesChange={setImages}
        />
        
        <Flex justify="end" gap="sm">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Create Order
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
```

### Validation Patterns

```tsx
// Form validation with error handling
function useFormValidation() {
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'weight':
        if (!value) {
          newErrors.weight = 'Weight is required';
        } else if (parseFloat(value) <= 0) {
          newErrors.weight = 'Weight must be greater than 0';
        } else {
          delete newErrors.weight;
        }
        break;
    }
    
    setErrors(newErrors);
  };
  
  return { errors, validateField };
}
```

## Best Practices

### Accessibility

- Always provide labels for form inputs
- Use proper input types (`email`, `tel`, `number`, etc.)
- Include error messages with clear descriptions
- Ensure keyboard navigation works properly

### User Experience

- Use floating labels for clean design
- Provide immediate validation feedback
- Show loading states during form submission
- Group related fields logically

### Responsive Design

- Stack form fields vertically on mobile
- Use appropriate touch targets (minimum 44px)
- Consider thumb-friendly button placement
- Test on various screen sizes