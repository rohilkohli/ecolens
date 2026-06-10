/**
 * Route distance calculation service using Google Directions API.
 * Calculates travel distance and duration between two locations.
 * @module location/directions
 */

import type { TravelMode, RouteInfo, Result, IDirectionsService } from './types';

/**
 * Maps application travel modes to Google Maps DirectionsTravelMode values.
 *
 * @param mode - Application-level travel mode
 * @returns Google Maps travel mode enum value
 */
function toGoogleTravelMode(mode: TravelMode): google.maps.TravelMode {
  const modeMap: Record<TravelMode, google.maps.TravelMode> = {
    DRIVING: google.maps.TravelMode.DRIVING,
    TRANSIT: google.maps.TravelMode.TRANSIT,
    BICYCLING: google.maps.TravelMode.BICYCLING,
    WALKING: google.maps.TravelMode.WALKING,
  };
  return modeMap[mode];
}

/**
 * Calculates the route distance and duration between an origin and destination.
 * Returns a Result type for explicit error handling.
 *
 * @param origin - Starting point (address string or place name)
 * @param destination - End point (address string or place name)
 * @param mode - Travel mode (DRIVING, TRANSIT, BICYCLING, WALKING)
 * @returns Result containing RouteInfo on success, or Error on failure
 *
 * @example
 * ```typescript
 * const result = await calculateRoute('Mumbai', 'Pune', 'DRIVING');
 * if (result.ok) {
 *   console.log(result.value.distanceText); // "148 km"
 * }
 * ```
 */
export async function calculateRoute(
  origin: string,
  destination: string,
  mode: TravelMode = 'DRIVING'
): Promise<Result<RouteInfo>> {
  if (typeof google === 'undefined' || !google.maps?.DirectionsService) {
    return { ok: false, error: new Error('Google Maps Directions service is not available') };
  }

  if (!origin.trim() || !destination.trim()) {
    return { ok: false, error: new Error('Origin and destination are required') };
  }

  try {
    const service = new google.maps.DirectionsService();
    const response = await service.route({
      origin,
      destination,
      travelMode: toGoogleTravelMode(mode),
    });

    const leg = response.routes[0]?.legs[0];
    if (!leg?.distance || !leg.duration) {
      return { ok: false, error: new Error('No route found between these locations') };
    }

    const routeInfo: RouteInfo = {
      distanceMeters: leg.distance.value,
      distanceText: leg.distance.text,
      durationSeconds: leg.duration.value,
      durationText: leg.duration.text,
    };

    return { ok: true, value: routeInfo };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Route calculation failed';
    return { ok: false, error: new Error(message) };
  }
}

/**
 * Converts metres to kilometres with one decimal place.
 *
 * @param metres - Distance in metres
 * @returns Distance in kilometres (rounded to 1 decimal)
 */
export function metresToKm(metres: number): number {
  return Math.round(metres / 100) / 10;
}

/**
 * Default implementation of the directions service interface.
 * Can be swapped for testing via dependency injection.
 */
export const directionsService: IDirectionsService = {
  calculateRoute,
};
