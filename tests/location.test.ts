import { describe, it, expect } from 'vitest';
import { metresToKm } from '../src/services/location/directions';
import { INDIA_STATE_GRID_FACTORS, INDIA_NATIONAL_AVERAGE_FACTOR } from '../src/services/location/constants';

describe('Location Service — Utilities', () => {
  describe('metresToKm', () => {
    it('converts 1000 metres to 1.0 km', () => {
      expect(metresToKm(1000)).toBe(1.0);
    });

    it('converts 1500 metres to 1.5 km', () => {
      expect(metresToKm(1500)).toBe(1.5);
    });

    it('converts 500 metres to 0.5 km', () => {
      expect(metresToKm(500)).toBe(0.5);
    });

    it('converts 0 metres to 0 km', () => {
      expect(metresToKm(0)).toBe(0);
    });

    it('rounds to one decimal place', () => {
      expect(metresToKm(1234)).toBe(1.2);
      expect(metresToKm(1789)).toBe(1.8);
    });
  });
});

describe('Location Service — Region Factors', () => {
  it('all state grid factors are positive numbers', () => {
    for (const [state, factor] of Object.entries(INDIA_STATE_GRID_FACTORS)) {
      expect(factor).toBeGreaterThan(0);
      expect(factor).toBeLessThan(2.0);
      expect(state).toBeTruthy();
    }
  });

  it('national average is within expected range', () => {
    expect(INDIA_NATIONAL_AVERAGE_FACTOR).toBeGreaterThan(0.5);
    expect(INDIA_NATIONAL_AVERAGE_FACTOR).toBeLessThan(1.0);
  });

  it('has at least 15 states mapped', () => {
    expect(Object.keys(INDIA_STATE_GRID_FACTORS).length).toBeGreaterThanOrEqual(15);
  });

  it('renewable-heavy states have lower factors than coal-heavy states', () => {
    const himachal = INDIA_STATE_GRID_FACTORS['Himachal Pradesh'];
    const jharkhand = INDIA_STATE_GRID_FACTORS['Jharkhand'];
    expect(himachal).toBeDefined();
    expect(jharkhand).toBeDefined();
    if (himachal !== undefined && jharkhand !== undefined) {
      expect(himachal).toBeLessThan(jharkhand);
    }
  });

  it('Delhi factor is close to national average', () => {
    const delhi = INDIA_STATE_GRID_FACTORS['Delhi'];
    expect(delhi).toBeDefined();
    if (delhi !== undefined) {
      expect(Math.abs(delhi - INDIA_NATIONAL_AVERAGE_FACTOR)).toBeLessThan(0.15);
    }
  });
});

describe('Location Service — Type Safety', () => {
  it('Result type pattern works correctly', async () => {
    const { calculateRoute } = await import('../src/services/location/directions');
    // Without Google Maps loaded, should return error Result (not throw)
    const result = await calculateRoute('Mumbai', 'Pune', 'DRIVING');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('not available');
    }
  });

  it('reverseGeocode returns error Result when Maps unavailable', async () => {
    const { reverseGeocode } = await import('../src/services/location/geocoding');
    const result = await reverseGeocode({ lat: 28.6, lng: 77.2 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it('findNearbyGreenAlternatives returns error Result when Maps unavailable', async () => {
    const { findNearbyGreenAlternatives } = await import('../src/services/location/places');
    const result = await findNearbyGreenAlternatives({ lat: 19.07, lng: 72.87 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });
});
