/**
 * Nearby places search service for finding green transport alternatives.
 * Uses Google Places API to locate transit, EV charging, and bike stations.
 * @module location/places
 */

import type { LatLng, GreenAlternative, GreenPlaceType, Result, IPlacesService } from './types';
import { DEFAULT_SEARCH_RADIUS_M, MAX_PLACES_PER_TYPE, GREEN_PLACE_TYPES, EV_PLACE_TYPES } from './constants';

/**
 * Calculates straight-line distance between two coordinates using Haversine formula.
 *
 * @param a - First coordinate
 * @param b - Second coordinate
 * @returns Distance in metres
 */
function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6_371_000;
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);
  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);
  const h = sinHalfLat * sinHalfLat +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinHalfLng * sinHalfLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Maps a Google Place type string to our application's GreenPlaceType.
 *
 * @param types - Array of place type strings from Google API
 * @returns Mapped GreenPlaceType
 */
function classifyPlaceType(types: string[]): GreenPlaceType {
  if (types.some(t => EV_PLACE_TYPES.includes(t as typeof EV_PLACE_TYPES[number]))) {
    return 'ev_charging';
  }
  if (types.some(t => t.includes('bicycle') || t.includes('bike'))) {
    return 'bike_station';
  }
  return 'transit_station';
}

/**
 * Searches for nearby green transport alternatives around a given location.
 * Queries multiple place types and deduplicates results by place ID.
 *
 * @param center - The centre point to search around
 * @param radiusMeters - Search radius in metres (defaults to 2000m)
 * @returns Result containing sorted array of GreenAlternative on success
 *
 * @example
 * ```typescript
 * const result = await findNearbyGreenAlternatives({ lat: 19.076, lng: 72.877 });
 * if (result.ok) {
 *   result.value.forEach(alt => console.log(alt.name, alt.distanceMeters));
 * }
 * ```
 */
export async function findNearbyGreenAlternatives(
  center: LatLng,
  radiusMeters: number = DEFAULT_SEARCH_RADIUS_M
): Promise<Result<GreenAlternative[]>> {
  if (typeof google === 'undefined' || !google.maps?.places) {
    return { ok: false, error: new Error('Google Maps Places service is not available') };
  }

  try {
    const allTypes = [...GREEN_PLACE_TYPES, ...EV_PLACE_TYPES];
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const searchPromises = allTypes.map(type =>
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        service.nearbySearch(
          {
            location: center,
            radius: radiusMeters,
            type,
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results.slice(0, MAX_PLACES_PER_TYPE));
            } else {
              resolve([]);
            }
          }
        );
      })
    );

    const allResults = (await Promise.all(searchPromises)).flat();

    const seen = new Set<string>();
    const alternatives: GreenAlternative[] = [];

    for (const place of allResults) {
      const placeId = place.place_id;
      if (!placeId || seen.has(placeId)) continue;
      seen.add(placeId);

      const placeLat = place.geometry?.location?.lat();
      const placeLng = place.geometry?.location?.lng();
      if (placeLat === undefined || placeLng === undefined) continue;

      const placeLocation: LatLng = { lat: placeLat, lng: placeLng };

      alternatives.push({
        placeId,
        name: place.name ?? 'Unknown',
        type: classifyPlaceType(place.types ?? []),
        location: placeLocation,
        distanceMeters: Math.round(haversineDistance(center, placeLocation)),
        rating: place.rating ?? null,
        address: place.vicinity ?? '',
      });
    }

    alternatives.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return { ok: true, value: alternatives };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Places search failed';
    return { ok: false, error: new Error(message) };
  }
}

/**
 * Default implementation of the places service interface.
 * Can be swapped for testing via dependency injection.
 */
export const placesService: IPlacesService = {
  findNearby: findNearbyGreenAlternatives,
};
