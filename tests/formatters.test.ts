import { describe, it, expect } from 'vitest';
import { formatCO2, formatQuantity, capitalizeFirst, getDayLabel } from '../src/utils/formatters';

describe('formatCO2', () => {
  it('formats with default 2 decimals', () => {
    expect(formatCO2(3.456)).toBe('3.46 kg CO₂e');
  });

  it('formats with custom decimals', () => {
    expect(formatCO2(1.5, 1)).toBe('1.5 kg CO₂e');
  });

  it('handles zero', () => {
    expect(formatCO2(0)).toBe('0.00 kg CO₂e');
  });
});

describe('formatQuantity', () => {
  it('combines quantity and unit', () => {
    expect(formatQuantity(15, 'km')).toBe('15 km');
  });

  it('handles decimal quantities', () => {
    expect(formatQuantity(2.5, 'kWh')).toBe('2.5 kWh');
  });
});

describe('capitalizeFirst', () => {
  it('capitalises lowercase string', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('preserves already capitalised string', () => {
    expect(capitalizeFirst('Already')).toBe('Already');
  });
});

describe('getDayLabel', () => {
  it('returns "Today" for current date', () => {
    expect(getDayLabel(new Date().toISOString())).toBe('Today');
  });

  it('returns "Yesterday" for previous day', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getDayLabel(yesterday.toISOString())).toBe('Yesterday');
  });

  it('returns formatted date for older dates', () => {
    const old = new Date('2024-01-15T12:00:00Z');
    const label = getDayLabel(old.toISOString());
    expect(label).toContain('Jan');
  });
});
