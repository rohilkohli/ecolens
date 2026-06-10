/**
 * Application-wide constants for EcoLens.
 * Centralises all magic values to improve maintainability and readability.
 * @module constants
 */

// ─── Emission Thresholds ───────────────────────────────────────────────────────

/** Daily emission threshold (kg CO₂e) below which a user is "below average". */
export const THRESHOLD_BELOW_AVERAGE_KG = 8;

/** Daily emission threshold (kg CO₂e) above which a user is "above average". */
export const THRESHOLD_ABOVE_AVERAGE_KG = 14;

/** Global average daily CO₂e emission per capita (kg). Source: ~4 tonnes/year ÷ 365. */
export const GLOBAL_AVERAGE_DAILY_KG = 11;

/** India national grid emission factor (kg CO₂e per kWh). Source: CEA 2023. */
export const INDIA_GRID_EMISSION_FACTOR = 0.71;

// ─── Rate Limiting & Caching ───────────────────────────────────────────────────

/** Minimum interval between Gemini API calls (milliseconds). */
export const GEMINI_RATE_LIMIT_MS = 10_000;

/** Duration for which AI insights are cached (milliseconds). 24 hours. */
export const INSIGHTS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Maximum retry attempts for transient Gemini API failures. */
export const GEMINI_MAX_RETRIES = 3;

/** Initial retry delay for exponential backoff (milliseconds). */
export const GEMINI_INITIAL_RETRY_DELAY_MS = 1_000;

/** Backoff multiplier applied after each retry attempt. */
export const GEMINI_BACKOFF_FACTOR = 2;

// ─── Storage Keys ──────────────────────────────────────────────────────────────

/** localStorage key for cached AI insights. */
export const STORAGE_KEY_INSIGHTS_CACHE = 'ecolens_insights_cache';

/** localStorage key for demo user activities. */
export const STORAGE_KEY_DEMO_ACTIVITIES = 'ecolens_demo_activities';

/** localStorage key for demo user challenge progress. */
export const STORAGE_KEY_DEMO_CHALLENGES = 'ecolens_demo_challenges';

/** localStorage key for user theme preference. */
export const STORAGE_KEY_THEME = 'ecolens_theme';

// ─── Firestore Paths ───────────────────────────────────────────────────────────

/** Firestore subcollection path template for user activities. */
export const FIRESTORE_ACTIVITIES_PATH = 'users/{uid}/activities';

/** Firestore document path template for challenge progress. */
export const FIRESTORE_CHALLENGES_PATH = 'users/{uid}/data';

// ─── UI Constraints ────────────────────────────────────────────────────────────

/** Maximum characters allowed in an activity note. */
export const MAX_NOTE_LENGTH = 200;

/** Maximum activities returned from a Firestore query. */
export const MAX_ACTIVITIES_QUERY = 500;

/** Number of days shown in the emissions trend chart. */
export const TREND_DAYS = 7;

// ─── Google Maps ───────────────────────────────────────────────────────────────

/** Default search radius for nearby green alternatives (metres). */
export const MAPS_SEARCH_RADIUS_M = 2000;

/** Maximum results per place type query. */
export const MAPS_MAX_PLACES_PER_TYPE = 5;

/** Timeout for Google Maps script loading (milliseconds). */
export const MAPS_LOAD_TIMEOUT_MS = 10_000;

/** Google Maps libraries required by the application. */
export const MAPS_REQUIRED_LIBRARIES = ['places', 'geometry'] as const;
