/**
 * Constants specific to the location service module.
 * @module location/constants
 */

/** Default search radius for nearby green alternatives (metres). */
export const DEFAULT_SEARCH_RADIUS_M = 2000;

/** Maximum results returned per place type query. */
export const MAX_PLACES_PER_TYPE = 5;

/** Timeout for Google Maps script load (milliseconds). */
export const SCRIPT_LOAD_TIMEOUT_MS = 10_000;

/** Session storage key for cached geocode result. */
export const GEOCODE_CACHE_KEY = 'ecolens_geocode_cache';

/** Google Maps libraries required by EcoLens. */
export const REQUIRED_LIBRARIES: readonly string[] = ['places', 'geometry'];

/** Place types searched when finding green alternatives. */
export const GREEN_PLACE_TYPES = [
  'transit_station',
  'subway_station',
  'bus_station',
  'train_station',
] as const;

/** Place types for EV charging stations. */
export const EV_PLACE_TYPES = ['electric_vehicle_charging_station'] as const;

/**
 * India state-level grid emission factors (kg CO₂e per kWh).
 * Source: Central Electricity Authority (CEA) CO₂ Baseline Database 2023.
 */
export const INDIA_STATE_GRID_FACTORS: Readonly<Record<string, number>> = {
  'Delhi': 0.72,
  'Maharashtra': 0.79,
  'Karnataka': 0.58,
  'Tamil Nadu': 0.62,
  'Kerala': 0.42,
  'Gujarat': 0.82,
  'Rajasthan': 0.85,
  'Uttar Pradesh': 0.88,
  'West Bengal': 0.91,
  'Andhra Pradesh': 0.67,
  'Telangana': 0.72,
  'Punjab': 0.78,
  'Haryana': 0.83,
  'Madhya Pradesh': 0.86,
  'Bihar': 0.89,
  'Odisha': 0.92,
  'Jharkhand': 0.93,
  'Chhattisgarh': 0.94,
  'Goa': 0.55,
  'Himachal Pradesh': 0.35,
} as const;

/** National average grid emission factor used as fallback. */
export const INDIA_NATIONAL_AVERAGE_FACTOR = 0.71;
