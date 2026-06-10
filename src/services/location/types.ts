/**
 * Type definitions for the location service module.
 * Follows interface-first design with readonly properties for immutability.
 * @module location/types
 */

/** Geographic coordinates in WGS84 format. */
export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

/** Reverse-geocoded location with administrative boundary detail. */
export interface GeocodedLocation {
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly countryCode: string;
  readonly formattedAddress: string;
  readonly coordinates: LatLng;
}

/** Route information returned by the Directions service. */
export interface RouteInfo {
  readonly distanceMeters: number;
  readonly distanceText: string;
  readonly durationSeconds: number;
  readonly durationText: string;
}

/** A nearby place that represents a lower-carbon transport alternative. */
export interface GreenAlternative {
  readonly placeId: string;
  readonly name: string;
  readonly type: GreenPlaceType;
  readonly location: LatLng;
  readonly distanceMeters: number;
  readonly rating: number | null;
  readonly address: string;
}

/** Categories of green alternative places. */
export type GreenPlaceType = 'transit_station' | 'ev_charging' | 'bike_station';

/** Travel mode for route calculations. */
export type TravelMode = 'DRIVING' | 'TRANSIT' | 'BICYCLING' | 'WALKING';

/**
 * Discriminated union representing either a successful result or a failure.
 * Used instead of throwing to enable explicit error handling at call sites.
 *
 * @typeParam T - The success value type
 * @typeParam E - The error type (defaults to Error)
 *
 * @example
 * ```typescript
 * const result = await reverseGeocode(coords);
 * if (result.ok) {
 *   console.log(result.value.city);
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/** Location permission and availability states. */
export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

/** Region-specific emission factors for electricity grid. */
export interface RegionProfile {
  readonly regionId: string;
  readonly gridFactor: number;
  readonly label: string;
}

// ─── Service Interfaces (Dependency Inversion) ─────────────────────────────────

/** Contract for geocoding operations. */
export interface IGeocodingService {
  reverseGeocode(coords: LatLng): Promise<Result<GeocodedLocation>>;
}

/** Contract for route distance calculations. */
export interface IDirectionsService {
  calculateRoute(origin: string, destination: string, mode: TravelMode): Promise<Result<RouteInfo>>;
}

/** Contract for finding nearby green alternatives. */
export interface IPlacesService {
  findNearby(center: LatLng, radiusMeters: number): Promise<Result<GreenAlternative[]>>;
}
