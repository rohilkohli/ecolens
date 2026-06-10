import { describe, it, expect } from 'vitest';
import * as constants from '../src/constants';

describe('Application Constants', () => {
  it('emission thresholds are positive numbers in ascending order', () => {
    expect(constants.THRESHOLD_BELOW_AVERAGE_KG).toBeGreaterThan(0);
    expect(constants.THRESHOLD_ABOVE_AVERAGE_KG).toBeGreaterThan(constants.THRESHOLD_BELOW_AVERAGE_KG);
    expect(constants.GLOBAL_AVERAGE_DAILY_KG).toBeGreaterThan(0);
  });

  it('India grid emission factor matches CEA 2023 published value', () => {
    expect(constants.INDIA_GRID_EMISSION_FACTOR).toBe(0.71);
  });

  it('rate limit is at least 5 seconds', () => {
    expect(constants.GEMINI_RATE_LIMIT_MS).toBeGreaterThanOrEqual(5000);
  });

  it('cache TTL is exactly 24 hours', () => {
    expect(constants.INSIGHTS_CACHE_TTL_MS).toBe(86_400_000);
  });

  it('retry config has sensible defaults', () => {
    expect(constants.GEMINI_MAX_RETRIES).toBeGreaterThanOrEqual(1);
    expect(constants.GEMINI_MAX_RETRIES).toBeLessThanOrEqual(5);
    expect(constants.GEMINI_BACKOFF_FACTOR).toBeGreaterThan(1);
  });

  it('storage keys are non-empty strings with ecolens prefix', () => {
    const keys = [
      constants.STORAGE_KEY_INSIGHTS_CACHE,
      constants.STORAGE_KEY_DEMO_ACTIVITIES,
      constants.STORAGE_KEY_DEMO_CHALLENGES,
      constants.STORAGE_KEY_THEME,
    ];
    keys.forEach(key => {
      expect(key).toBeTruthy();
      expect(key.startsWith('ecolens_')).toBe(true);
    });
  });

  it('Maps config values are reasonable', () => {
    expect(constants.MAPS_SEARCH_RADIUS_M).toBeGreaterThanOrEqual(500);
    expect(constants.MAPS_SEARCH_RADIUS_M).toBeLessThanOrEqual(10_000);
    expect(constants.MAPS_LOAD_TIMEOUT_MS).toBeGreaterThanOrEqual(5_000);
  });

  it('trend days is 7 (weekly view)', () => {
    expect(constants.TREND_DAYS).toBe(7);
  });

  it('max note length is reasonable for UX', () => {
    expect(constants.MAX_NOTE_LENGTH).toBeGreaterThanOrEqual(100);
    expect(constants.MAX_NOTE_LENGTH).toBeLessThanOrEqual(500);
  });
});
