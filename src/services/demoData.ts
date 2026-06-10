import type { Activity } from '../types';
import { calculateEmission } from './emissionFactors';

export function generateDemoActivities(): Activity[] {
  const now = new Date();
  const activities: Activity[] = [];

  const seed: Array<{
    daysAgo: number;
    category: Activity['category'];
    subType: string;
    quantity: number;
    unit: string;
    note: string;
  }> = [
    { daysAgo: 0, category: 'transport', subType: 'car_petrol',      quantity: 12, unit: 'km',      note: 'Morning commute' },
    { daysAgo: 0, category: 'food',      subType: 'beef_meal',       quantity: 1,  unit: 'serving', note: 'Lunch' },
    { daysAgo: 1, category: 'transport', subType: 'car_petrol',      quantity: 20, unit: 'km',      note: 'Weekend drive' },
    { daysAgo: 1, category: 'food',      subType: 'vegetarian_meal', quantity: 2,  unit: 'serving', note: 'Lunch + dinner' },
    { daysAgo: 2, category: 'energy',    subType: 'electricity',     quantity: 8,  unit: 'kWh',     note: 'Home energy' },
    { daysAgo: 2, category: 'food',      subType: 'chicken_meal',    quantity: 1,  unit: 'serving', note: 'Dinner' },
    { daysAgo: 3, category: 'transport', subType: 'bus',             quantity: 5,  unit: 'km',      note: 'Bus to market' },
    { daysAgo: 3, category: 'shopping',  subType: 'clothing',        quantity: 2,  unit: '₹1000',   note: 'New shirt' },
    { daysAgo: 4, category: 'food',      subType: 'vegan_meal',      quantity: 3,  unit: 'serving', note: 'All meals' },
    { daysAgo: 4, category: 'energy',    subType: 'electricity',     quantity: 6,  unit: 'kWh',     note: 'Home energy' },
    { daysAgo: 5, category: 'transport', subType: 'train',           quantity: 30, unit: 'km',      note: 'City trip' },
    { daysAgo: 5, category: 'food',      subType: 'fish_meal',       quantity: 1,  unit: 'serving', note: 'Dinner' },
    { daysAgo: 6, category: 'transport', subType: 'car_petrol',      quantity: 15, unit: 'km',      note: '' },
    { daysAgo: 6, category: 'energy',    subType: 'electricity',     quantity: 10, unit: 'kWh',     note: 'Heavy use day' },
  ];

  seed.forEach(s => {
    const d = new Date(now);
    d.setDate(d.getDate() - s.daysAgo);
    d.setHours(9 + Math.floor(Math.random() * 10));
    activities.push({
      id: `demo-${s.daysAgo}-${s.subType}-${Math.random().toString(36).slice(2, 6)}`,
      category: s.category,
      subType: s.subType,
      quantity: s.quantity,
      unit: s.unit,
      co2e_kg: calculateEmission(s.category, s.subType, s.quantity),
      timestamp: d.toISOString(),
      note: s.note,
    });
  });

  return activities;
}

const DEMO_KEY = 'ecolens_demo_activities';

export function loadDemoActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Activity[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupt storage — regenerate
  }
  const fresh = generateDemoActivities();
  saveDemoActivities(fresh);
  return fresh;
}

export function saveDemoActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(activities));
  } catch {
    // storage full — ignore
  }
}

export function clearDemoActivities(): void {
  localStorage.removeItem(DEMO_KEY);
}
