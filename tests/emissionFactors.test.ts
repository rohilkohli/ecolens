import { describe, it, expect } from 'vitest';
import { EMISSION_FACTORS, calculateEmission } from '../src/services/emissionFactors';

describe('EMISSION_FACTORS', () => {
  it('all factors are positive finite numbers', () => {
    for (const category of Object.values(EMISSION_FACTORS)) {
      for (const factor of Object.values(category)) {
        expect(factor.co2e_per_unit).toBeGreaterThan(0);
        expect(isFinite(factor.co2e_per_unit)).toBe(true);
      }
    }
  });
  it('calculates car petrol correctly', () => {
    expect(calculateEmission('transport', 'car_petrol', 10)).toBeCloseTo(1.92, 2);
  });
  it('calculates beef meal correctly', () => {
    expect(calculateEmission('food', 'beef_meal', 1)).toBeCloseTo(6.61, 2);
  });
  it('calculates electricity correctly', () => {
    expect(calculateEmission('energy', 'electricity', 5)).toBeCloseTo(3.55, 2);
  });
  it('returns 0 for unknown subType', () => {
    expect(calculateEmission('transport', 'hovercraft', 100)).toBe(0);
  });
  it('returns 0 for zero quantity', () => {
    expect(calculateEmission('transport', 'car_petrol', 0)).toBe(0);
  });
});
