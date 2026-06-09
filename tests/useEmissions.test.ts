import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmissions } from '../src/hooks/useEmissions';
import type { Activity } from '../src/types';

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: '1',
    category: 'transport',
    subType: 'car_petrol',
    quantity: 10,
    unit: 'km',
    co2e_kg: 1.92,
    timestamp: new Date().toISOString(),
    note: '',
    ...overrides,
  };
}

describe('useEmissions', () => {
  it('getTodayTotal returns sum of today\'s activities', () => {
    const activities: Activity[] = [
      makeActivity({ co2e_kg: 1.5 }),
      makeActivity({ co2e_kg: 2.0 }),
    ];
    const { result } = renderHook(() => useEmissions(activities));
    expect(result.current.getTodayTotal()).toBeCloseTo(3.5, 2);
  });

  it('getTodayTotal excludes yesterday activities', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activities: Activity[] = [
      makeActivity({ co2e_kg: 5.0, timestamp: yesterday.toISOString() }),
    ];
    const { result } = renderHook(() => useEmissions(activities));
    expect(result.current.getTodayTotal()).toBe(0);
  });

  it('getWeeklyTotals returns array of 7 entries', () => {
    const { result } = renderHook(() => useEmissions([]));
    expect(result.current.getWeeklyTotals()).toHaveLength(7);
  });

  it('getCategoryBreakdown sums by category', () => {
    const activities: Activity[] = [
      makeActivity({ category: 'food', co2e_kg: 3.0 }),
      makeActivity({ category: 'food', co2e_kg: 2.0 }),
      makeActivity({ category: 'transport', co2e_kg: 1.5 }),
    ];
    const { result } = renderHook(() => useEmissions(activities));
    const breakdown = result.current.getCategoryBreakdown();
    expect(breakdown.food).toBeCloseTo(5.0, 2);
    expect(breakdown.transport).toBeCloseTo(1.5, 2);
    expect(breakdown.energy).toBe(0);
    expect(breakdown.shopping).toBe(0);
  });

  it('getWeeklySummary returns correct total', () => {
    const activities: Activity[] = [
      makeActivity({ co2e_kg: 2.5 }),
      makeActivity({ co2e_kg: 3.0 }),
    ];
    const { result } = renderHook(() => useEmissions(activities));
    const summary = result.current.getWeeklySummary();
    expect(summary.total_kg).toBeCloseTo(5.5, 2);
  });

  it('getWeeklySummary top_activity is "None logged yet" when empty', () => {
    const { result } = renderHook(() => useEmissions([]));
    expect(result.current.getWeeklySummary().top_activity).toBe('None logged yet');
  });
});
