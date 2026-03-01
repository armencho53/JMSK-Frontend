/**
 * Fine weight calculation utilities for the department ledger.
 * Fine weight represents the pure metal content based on purity factor.
 */

/**
 * Compute fine weight from gross weight and purity factor.
 * Returns positive for IN direction, negative for OUT direction.
 *
 * @param weight - Gross weight in grams
 * @param finePercentage - Purity factor (e.g., 0.916 for Gold 22K)
 * @param direction - "IN" or "OUT"
 * @returns Fine weight (positive for IN, negative for OUT)
 */
export function computeFineWeight(
  weight: number,
  finePercentage: number,
  direction: 'IN' | 'OUT'
): number {
  const fineWeight = weight * finePercentage;
  return direction === 'OUT' ? -fineWeight : fineWeight;
}

/**
 * Format a purity label string for display.
 *
 * @param metalName - Metal name with karat (e.g., "Gold 22K")
 * @param finePercentage - Purity factor (e.g., 0.916)
 * @returns Formatted label (e.g., "91.6% (Gold 22K purity)")
 */
export function getPurityLabel(
  metalName: string,
  finePercentage: number
): string {
  const percentage = (finePercentage * 100).toFixed(1).replace(/\.0$/, '');
  return `${percentage}% (${metalName} purity)`;
}
