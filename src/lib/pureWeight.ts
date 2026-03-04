/**
 * Pure weight calculation utilities for the department ledger.
 * Pure weight represents the pure metal content based on purity factor.
 */

/**
 * Compute pure weight from gross weight and purity factor.
 * Returns positive for IN direction, negative for OUT direction.
 *
 * @param weight - Gross weight in grams
 * @param purePercentage - Purity factor (e.g., 0.916 for Gold 22K)
 * @param direction - "IN" or "OUT"
 * @returns Pure weight (positive for IN, negative for OUT)
 */
export function computePureWeight(
  weight: number,
  purePercentage: number,
  direction: 'IN' | 'OUT'
): number {
  const pureWeight = weight * purePercentage;
  return direction === 'OUT' ? -pureWeight : pureWeight;
}

/**
 * Format a purity label string for display.
 *
 * @param metalName - Metal name with karat (e.g., "Gold 22K")
 * @param purePercentage - Purity factor (e.g., 0.916)
 * @returns Formatted label (e.g., "91.6% (Gold 22K purity)")
 */
export function getPurityLabel(
  metalName: string,
  purePercentage: number
): string {
  const percentage = (purePercentage * 100).toFixed(1).replace(/\.0$/, '');
  return `${percentage}% (${metalName} purity)`;
}
