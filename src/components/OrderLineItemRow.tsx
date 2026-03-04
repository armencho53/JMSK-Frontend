import type { OrderLineItem } from '../types/order'
import type { Metal } from '../types/metal'

interface OrderLineItemRowProps {
  lineItem: OrderLineItem
  index: number
  metals: Metal[]
  onChange: (index: number, field: keyof OrderLineItem, value: any) => void
  onRemove: (index: number) => void
  canRemove: boolean
  errors?: Record<string, string>
}

export default function OrderLineItemRow({
  lineItem,
  index,
  metals,
  onChange,
  onRemove,
  canRemove,
  errors = {},
}: OrderLineItemRowProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-sm font-medium text-gray-900">Line Item {index + 1}</h5>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Remove
        </button>
      </div>

      <div className="space-y-4">
        {/* Product Description */}
        <div>
          <label
            htmlFor={`line-item-${index}-description`}
            className="block text-sm font-medium text-gray-700"
          >
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`line-item-${index}-description`}
            rows={2}
            value={lineItem.product_description}
            onChange={(e) => onChange(index, 'product_description', e.target.value)}
            className={`mt-1 block w-full border ${
              errors[`line_items.${index}.product_description`]
                ? 'border-red-300'
                : 'border-gray-300'
            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Describe the product..."
          />
          {errors[`line_items.${index}.product_description`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`line_items.${index}.product_description`]}
            </p>
          )}
        </div>

        {/* Specifications */}
        <div>
          <label
            htmlFor={`line-item-${index}-specifications`}
            className="block text-sm font-medium text-gray-700"
          >
            Specifications
          </label>
          <textarea
            id={`line-item-${index}-specifications`}
            rows={2}
            value={lineItem.specifications || ''}
            onChange={(e) => onChange(index, 'specifications', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Additional specifications..."
          />
        </div>

        {/* Metal Type and Quantity Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Metal Type */}
          <div>
            <label
              htmlFor={`line-item-${index}-metal`}
              className="block text-sm font-medium text-gray-700"
            >
              Metal Type
            </label>
            <select
              id={`line-item-${index}-metal`}
              value={lineItem.metal_id ?? ''}
              onChange={(e) =>
                onChange(index, 'metal_id', e.target.value ? Number(e.target.value) : undefined)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select metal type</option>
              {metals.map((metal) => (
                <option key={metal.id} value={metal.id}>
                  {metal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor={`line-item-${index}-quantity`}
              className="block text-sm font-medium text-gray-700"
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id={`line-item-${index}-quantity`}
              min="1"
              value={lineItem.quantity}
              onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value) || 1)}
              className={`mt-1 block w-full border ${
                errors[`line_items.${index}.quantity`] ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors[`line_items.${index}.quantity`] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[`line_items.${index}.quantity`]}
              </p>
            )}
          </div>
        </div>

        {/* Weight Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Target Weight per Piece */}
          <div>
            <label
              htmlFor={`line-item-${index}-target-weight`}
              className="block text-sm font-medium text-gray-700"
            >
              Target Weight per Piece (g)
            </label>
            <input
              type="number"
              id={`line-item-${index}-target-weight`}
              min="0"
              step="0.01"
              value={lineItem.target_weight_per_piece || ''}
              onChange={(e) =>
                onChange(
                  index,
                  'target_weight_per_piece',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 8.0"
            />
          </div>

          {/* Initial Total Weight */}
          <div>
            <label
              htmlFor={`line-item-${index}-initial-weight`}
              className="block text-sm font-medium text-gray-700"
            >
              Initial Total Weight (g)
            </label>
            <input
              type="number"
              id={`line-item-${index}-initial-weight`}
              min="0"
              step="0.01"
              value={lineItem.initial_total_weight || ''}
              onChange={(e) =>
                onChange(
                  index,
                  'initial_total_weight',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 90.0"
            />
          </div>
        </div>

        {/* Price and Labor Cost Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label
              htmlFor={`line-item-${index}-price`}
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id={`line-item-${index}-price`}
              min="0"
              step="0.01"
              value={lineItem.price || ''}
              onChange={(e) =>
                onChange(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>

          {/* Labor Cost */}
          <div>
            <label
              htmlFor={`line-item-${index}-labor-cost`}
              className="block text-sm font-medium text-gray-700"
            >
              Labor Cost
            </label>
            <input
              type="number"
              id={`line-item-${index}-labor-cost`}
              min="0"
              step="0.01"
              value={lineItem.labor_cost || ''}
              onChange={(e) =>
                onChange(
                  index,
                  'labor_cost',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
