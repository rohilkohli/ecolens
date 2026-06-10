/**
 * Location services module — barrel export.
 * Provides geocoding, route calculation, and nearby places search
 * using Google Maps Platform APIs with graceful degradation.
 * @module location
 */

export { reverseGeocode, geocodingService } from './geocoding';
export { calculateRoute, metresToKm, directionsService } from './directions';
export { findNearbyGreenAlternatives, placesService } from './places';
export { INDIA_STATE_GRID_FACTORS, INDIA_NATIONAL_AVERAGE_FACTOR } from './constants';
export type {
  LatLng,
  GeocodedLocation,
  RouteInfo,
  GreenAlternative,
  GreenPlaceType,
  TravelMode,
  Result,
  LocationStatus,
  RegionProfile,
  IGeocodingService,
  IDirectionsService,
  IPlacesService,
} from './types';
