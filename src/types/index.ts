export type Category = 'transport' | 'food' | 'energy' | 'shopping';

export interface Activity {
  id: string;
  userId?: string;
  category: Category;
  subType: string;
  quantity: number;
  unit: string;
  co2e_kg: number;
  timestamp: string; // ISO 8601
  note: string;
}

export interface Insight {
  title: string;
  description: string;
  saving_kg: number;
  category: Category;
  icon: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  estimated_saving_kg: number;
  duration_days: number;
  category: Category;
  completed: boolean;
}

export interface EmissionSummary {
  total_kg: number;
  transport_kg: number;
  food_kg: number;
  energy_kg: number;
  shopping_kg: number;
  top_activity: string;
}
