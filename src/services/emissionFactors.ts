export type EmissionCategory = 'transport' | 'food' | 'energy' | 'shopping';

export interface EmissionFactor {
  label: string;
  unit: string;
  co2e_per_unit: number;
  description: string;
}

export const EMISSION_FACTORS: Record<EmissionCategory, Record<string, EmissionFactor>> = {
  transport: {
    car_petrol:   { label: 'Car (petrol)',        unit: 'km', co2e_per_unit: 0.192, description: 'Average petrol passenger car' },
    car_diesel:   { label: 'Car (diesel)',         unit: 'km', co2e_per_unit: 0.171, description: 'Average diesel passenger car' },
    car_electric: { label: 'Car (electric)',       unit: 'km', co2e_per_unit: 0.053, description: 'EV on India grid' },
    bus:          { label: 'Bus',                  unit: 'km', co2e_per_unit: 0.089, description: 'Average city bus' },
    train:        { label: 'Train',                unit: 'km', co2e_per_unit: 0.041, description: 'Passenger rail' },
    flight_short: { label: 'Flight (short-haul)',  unit: 'km', co2e_per_unit: 0.255, description: 'Under 3 hours' },
    flight_long:  { label: 'Flight (long-haul)',   unit: 'km', co2e_per_unit: 0.195, description: 'Over 3 hours' },
    motorbike:    { label: 'Motorbike',            unit: 'km', co2e_per_unit: 0.114, description: 'Average 2-wheeler' },
  },
  food: {
    beef_meal:       { label: 'Beef meal',       unit: 'serving', co2e_per_unit: 6.61, description: 'Beef-based main meal' },
    pork_meal:       { label: 'Pork meal',       unit: 'serving', co2e_per_unit: 1.22, description: 'Pork-based main meal' },
    chicken_meal:    { label: 'Chicken meal',    unit: 'serving', co2e_per_unit: 0.69, description: 'Chicken-based main meal' },
    fish_meal:       { label: 'Fish meal',       unit: 'serving', co2e_per_unit: 1.96, description: 'Fish-based main meal' },
    vegetarian_meal: { label: 'Vegetarian meal', unit: 'serving', co2e_per_unit: 0.50, description: 'Dairy-inclusive veggie meal' },
    vegan_meal:      { label: 'Vegan meal',      unit: 'serving', co2e_per_unit: 0.30, description: 'Plant-only meal' },
  },
  energy: {
    electricity: { label: 'Electricity (India grid)', unit: 'kWh',         co2e_per_unit: 0.71, description: 'CEA 2023 grid emission factor' },
    natural_gas:  { label: 'Natural gas',             unit: 'cubic_metre', co2e_per_unit: 2.04, description: 'Residential gas combustion' },
  },
  shopping: {
    clothing:    { label: 'Clothing',       unit: '₹1000', co2e_per_unit: 0.50, description: 'Fast fashion average' },
    electronics: { label: 'Electronics',   unit: '₹1000', co2e_per_unit: 0.80, description: 'Consumer electronics average' },
    general:     { label: 'General retail', unit: '₹1000', co2e_per_unit: 0.30, description: 'Miscellaneous retail' },
  },
} as const;

/** Calculates CO₂e emission in kg for a given activity using IPCC AR6 factors. */
export function calculateEmission(
  category: EmissionCategory,
  subType: string,
  quantity: number,
): number {
  const factor = EMISSION_FACTORS[category]?.[subType];
  if (!factor || quantity <= 0) return 0;
  return Math.round(factor.co2e_per_unit * quantity * 1000) / 1000;
}
