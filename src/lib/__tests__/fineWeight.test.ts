import { computeFineWeight, getPurityLabel } from '../fineWeight';

describe('computeFineWeight', () => {
  test('returns positive value for IN direction', () => {
    expect(computeFineWeight(28.9, 0.916, 'IN')).toBeCloseTo(26.4724);
  });

  test('returns negative value for OUT direction', () => {
    expect(computeFineWeight(28.9, 0.916, 'OUT')).toBeCloseTo(-26.4724);
  });

  test('handles zero weight', () => {
    expect(computeFineWeight(0, 0.916, 'IN')).toBe(0);
    expect(computeFineWeight(0, 0.916, 'OUT')).toBe(-0);
  });

  test('handles 100% purity', () => {
    expect(computeFineWeight(10, 1.0, 'IN')).toBeCloseTo(10);
    expect(computeFineWeight(10, 1.0, 'OUT')).toBeCloseTo(-10);
  });

  test('handles Gold 24K purity (0.999)', () => {
    expect(computeFineWeight(50, 0.999, 'IN')).toBeCloseTo(49.95);
  });

  test('handles Silver 925 purity (0.925)', () => {
    expect(computeFineWeight(100, 0.925, 'OUT')).toBeCloseTo(-92.5);
  });
});

describe('getPurityLabel', () => {
  test('formats Gold 22K label correctly', () => {
    expect(getPurityLabel('Gold 22K', 0.916)).toBe('91.6% (Gold 22K purity)');
  });

  test('formats Gold 24K label correctly', () => {
    expect(getPurityLabel('Gold 24K', 0.999)).toBe('99.9% (Gold 24K purity)');
  });

  test('formats Silver 925 label correctly', () => {
    expect(getPurityLabel('Silver 925', 0.925)).toBe('92.5% (Silver 925 purity)');
  });

  test('formats Gold 14K label correctly', () => {
    expect(getPurityLabel('Gold 14K', 0.585)).toBe('58.5% (Gold 14K purity)');
  });

  test('handles 100% purity without trailing zero', () => {
    expect(getPurityLabel('Pure Gold', 1.0)).toBe('100% (Pure Gold purity)');
  });

  test('formats Platinum label correctly', () => {
    expect(getPurityLabel('Platinum', 0.950)).toBe('95% (Platinum purity)');
  });
});
