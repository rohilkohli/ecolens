/**
 * Reverse geocoding service using Google Geocoding API.
 * Converts geographic coordinates into human-readable location information.
 * @module location/geocoding
 */

import type { LatLng, GeocodedLocation, Result, IGeocodingService } from './types';
import { GEOCODE_CACHE_KEY } from './constants';

/**
 * Attempts to retrieve a cached geocode result from sessionStorage.
 *
 * @param coords - Coordinates to look up in cache
 * @returns Cached location or null if not found/expired
 */
function getCachedResult(coords: LatLng): GeocodedLocation | null {
  try {
    const raw = sessionStorage.getItem(GEOCODE_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as GeocodedLocation;
    if (cached.coordinates.lat === coords.lat && cached.coordinates.lng === coords.lng) {
      return cached;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists a geocode result to sessionStorage for the current session.
 *
 * @param location - The geocoded location to cache
 */
function setCachedResult(location: GeocodedLocation): void {
  try {
    sessionStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(location));
  } catch {
    // Storage full — silently ignore
  }
}

/**
 * Extracts a specific address component from Google's geocode response.
 *
 * @param components - Array of address components from the API
 * @param type - The component type to extract (e.g. 'locality', 'administrative_area_level_1')
 * @returns The long name of the component, or empty string if not found
 */
function extractComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
): string {
  const match = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes(type));
  return match?.long_name ?? '';
}

/**
 * Reverse geocodes coordinates into a structured location object.
 * Returns a Result type for explicit error handling without throwing.
 *
 * @param coords - WGS84 latitude/longitude to geocode
 * @returns Result containing GeocodedLocation on success, or Error on failure
 *
 * @example
 * ```typescript
 * const result = await reverseGeocode({ lat: 28.6139, lng: 77.2090 });
 * if (result.ok) {
 *   console.log(result.value.city); // "New Delhi"
 * }
 * ```
 */
export async function reverseGeocode(coords: LatLng): Promise<Result<GeocodedLocation>> {
  const cached = getCachedResult(coords);
  if (cached) return { ok: true, value: cached };

  if (typeof google === 'undefined' || !google.maps?.Geocoder) {
    return { ok: false, error: new Error('Google Maps Geocoder is not available') };
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: coords });

    if (!response.results.length) {
      return { ok: false, error: new Error('No geocoding results found for these coordinates') };
    }

    const primary = response.results[0];
    const components = primary.address_components;

    const location: GeocodedLocation = {
      city: extractComponent(components, 'locality') || extractComponent(components, 'sublocality'),
      state: extractComponent(components, 'administrative_area_level_1'),
      country: extractComponent(components, 'country'),
      countryCode: components.find(c => c.types.includes('country'))?.short_name ?? '',
      formattedAddress: primary.formatted_address,
      coordinates: coords,
    };

    setCachedResult(location);
    return { ok: true, value: location };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Geocoding request failed';
    return { ok: false, error: new Error(message) };
  }
}

/**
 * Default implementation of the geocoding service interface.
 * Can be swapped for testing via dependency injection.
 */
export const geocodingService: IGeocodingService = {
  reverseGeocode,
};
