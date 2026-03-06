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
  const getErrorKey = (field: string) => `line_items.${index}.${field}`
  const hasError = (field: string) => !!errors[getErrorKey(field)]
  const getErrorMessage = (field: string) => errors[getErrorKey(field)] || ''

  const inputClass = (field: string) =>
    `block w-full border ${
      hasError(field) ? 'border-red-300' : 'border-gray-300'
    } rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`

  return (
    <tr>
      {/* Product Description */}
      <td className="min-w-[180px] px-2 py-2">
        <input
          type="text"
          id={`line-item-${index}-description`}
          value={lineItem.product_description}
          onChange={(e) => onChange(index, 'product_description', e.target.value)}
          className={inputClass('product_description')}
          placeholder="Describe the product..."
          title={hasError('product_description') ? getErrorMessage('product_description') : undefined}
        />
      </td>

      {/* Specifications */}
      <td className="min-w-[140px] px-2 py-2">
        <input
          type="text"
          id={`line-item-${index}-specifications`}
          value={lineItem.specifications || ''}
          onChange={(e) => onChange(index, 'specifications', e.target.value)}
          className={inputClass('specifications')}
          placeholder="Specs..."
          title={hasError('specifications') ? getErrorMessage('specifications') : undefined}
        />
      </td>

      {/* Metal Type */}
      <td className="min-w-[130px] px-2 py-2">
        <select
          id={`line-item-${index}-metal`}
          value={lineItem.metal_id ?? ''}
          onChange={(e) =>
            onChange(index, 'metal_id', e.target.value ? Number(e.target.value) : undefined)
          }
          className={inputClass('metal_id')}
          title={hasError('metal_id') ? getErrorMessage('metal_id') : undefined}
        >
          <option value="">Select metal</option>
          {metals.map((metal) => (
            <option key={metal.id} value={metal.id}>
              {metal.name}
            </option>
          ))}
        </select>
      </td>

      {/* Quantity */}
      <td className="min-w-[100px] px-2 py-2">
        <input
          type="number"
          id={`line-item-${index}-quantity`}
          min="1"
          value={lineItem.quantity}
          onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value) || 1)}
          className={inputClass('quantity')}
          title={hasError('quantity') ? getErrorMessage('quantity') : undefined}
        />
      </td>

      {/* Target Weight per Piece */}
      <td className="min-w-[100px] px-2 py-2">
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
          className={inputClass('target_weight_per_piece')}
          placeholder="0.00"
          title={hasError('target_weight_per_piece') ? getErrorMessage('target_weight_per_piece') : undefined}
        />
      </td>

      {/* Initial Total Weight (auto-calculated: quantity × target_weight_per_piece) */}
      <td className="min-w-[100px] px-2 py-2">
        <input
          type="number"
          id={`line-item-${index}-initial-weight`}
          value={
            lineItem.quantity && lineItem.target_weight_per_piece
              ? (lineItem.quantity * lineItem.target_weight_per_piece).toFixed(2)
              : ''
          }
          readOnly
          className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm py-1.5 px-2 text-gray-500 sm:text-sm cursor-not-allowed"
          placeholder="Auto"
          title="Auto-calculated: Qty × Target Wt/Pc"
        />
      </td>

      {/* Price */}
      <td className="min-w-[100px] px-2 py-2">
        <input
          type="number"
          id={`line-item-${index}-price`}
          min="0"
          step="0.01"
          value={lineItem.price || ''}
          onChange={(e) =>
            onChange(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)
          }
          className={inputClass('price')}
          placeholder="0.00"
          title={hasError('price') ? getErrorMessage('price') : undefined}
        />
      </td>

      {/* Labor Cost */}
      <td className="min-w-[100px] px-2 py-2">
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
          className={inputClass('labor_cost')}
          placeholder="0.00"
          title={hasError('labor_cost') ? getErrorMessage('labor_cost') : undefined}
        />
      </td>

      {/* Actions */}
      <td className="min-w-[50px] px-2 py-2 text-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove line item"
        >
          <svg className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  )
}
