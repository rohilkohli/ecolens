/**
 * Hook for computing emission aggregations from activity data.
 * Provides today's total, 7-day trend, category breakdown, and weekly summary.
 * @module hooks/useEmissions
 */

import type { Activity, EmissionSummary, Category } from '../types';

/** Returns an ISO date string (YYYY-MM-DD) offset by the given number of days from today. */
function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
}

/**
 * Computes emission metrics from a list of activities.
 *
 * @param activities - Array of Activity records to aggregate
 * @returns Object with methods: getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary
 *
 * @example
 * ```typescript
 * const { getTodayTotal, getWeeklySummary } = useEmissions(activities);
 * const today = getTodayTotal(); // kg CO₂e today
 * ```
 */
export function useEmissions(activities: Activity[]) {
  function getTodayTotal(): number {
    const today = getDateString();
    return activities
      .filter(a => a.timestamp.startsWith(today))
      .reduce((sum, a) => sum + a.co2e_kg, 0);
  }

  function getWeeklyTotals(): { date: string; total: number }[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = getDateString(6 - i);
      const total = activities
        .filter(a => a.timestamp.startsWith(date))
        .reduce((sum, a) => sum + a.co2e_kg, 0);
      return { date, total: Math.round(total * 100) / 100 };
    });
  }

  function getCategoryBreakdown(days = 7): Record<Category, number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const recent = activities.filter(a => new Date(a.timestamp) >= cutoff);
    const categories: Category[] = ['transport', 'food', 'energy', 'shopping'];
    return Object.fromEntries(
      categories.map(cat => [
        cat,
        Math.round(recent.filter(a => a.category === cat).reduce((s, a) => s + a.co2e_kg, 0) * 100) / 100,
      ]),
    ) as Record<Category, number>;
  }

  function getWeeklySummary(): EmissionSummary {
    const breakdown = getCategoryBreakdown(7);
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = activities.filter(a => new Date(a.timestamp) >= cutoff);
    const top = [...recent].sort((a, b) => b.co2e_kg - a.co2e_kg)[0];
    return {
      total_kg: Math.round(total * 100) / 100,
      transport_kg: breakdown.transport,
      food_kg: breakdown.food,
      energy_kg: breakdown.energy,
      shopping_kg: breakdown.shopping,
      top_activity: top ? `${top.subType} (${top.co2e_kg} kg CO₂e)` : 'None logged yet',
    };
  }

  return { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary };
}
