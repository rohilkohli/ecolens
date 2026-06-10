import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isTransientError, cleanErrorMessage, retryWithBackoff } from '../src/services/gemini';

describe('Gemini Service Helpers', () => {
  describe('isTransientError', () => {
    it('should identify direct status codes as transient', () => {
      expect(isTransientError({ status: 503 })).toBe(true);
      expect(isTransientError({ code: 503 })).toBe(true);
      expect(isTransientError({ status: 429 })).toBe(true);
      expect(isTransientError({ status: 500 })).toBe(true);
      expect(isTransientError({ status: 400 })).toBe(false);
    });

    it('should identify transient messages in raw error messages', () => {
      expect(isTransientError({ message: 'Model is overloaded' })).toBe(true);
      expect(isTransientError({ message: 'UNAVAILABLE' })).toBe(true);
      expect(isTransientError({ message: 'rate limit exceeded' })).toBe(true);
      expect(isTransientError({ message: 'something else' })).toBe(false);
    });

    it('should identify transient errors from single-level JSON message', () => {
      const err = {
        message: JSON.stringify({
          error: {
            code: 503,
            message: 'Service Unavailable'
          }
        })
      };
      expect(isTransientError(err)).toBe(true);
    });

    it('should identify transient errors from double-level nested JSON message', () => {
      const err = {
        message: JSON.stringify({
          error: {
            message: JSON.stringify({
              error: {
                code: 503,
                message: 'This model is currently experiencing high demand.'
              }
            })
          }
        })
      };
      expect(isTransientError(err)).toBe(true);
    });
  });

  describe('cleanErrorMessage', () => {
    it('should handle undefined / empty messages', () => {
      expect(cleanErrorMessage(null)).toContain('unexpected error');
      expect(cleanErrorMessage({})).toContain('unexpected error');
    });

    it('should pass through normal error messages', () => {
      expect(cleanErrorMessage({ message: 'Database connection failed' })).toBe('Database connection failed');
    });

    it('should map 429 and rate limits to "rate_limited"', () => {
      expect(cleanErrorMessage({ status: 429 })).toBe('rate_limited');
      expect(cleanErrorMessage({ message: 'rate limit exceeded' })).toBe('rate_limited');
    });

    it('should map 503 and high demand to friendly error message', () => {
      const friendly = 'The Gemini AI model is currently experiencing high demand. Please try again in a few moments.';
      expect(cleanErrorMessage({ status: 503 })).toBe(friendly);
      expect(cleanErrorMessage({ message: 'UNAVAILABLE' })).toBe(friendly);
      expect(cleanErrorMessage({ message: 'high demand' })).toBe(friendly);
    });

    it('should extract inner message from double JSON nested error and map appropriately', () => {
      const friendly = 'The Gemini AI model is currently experiencing high demand. Please try again in a few moments.';
      const err = {
        message: JSON.stringify({
          error: {
            message: JSON.stringify({
              error: {
                code: 503,
                message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.',
                status: 'UNAVAILABLE'
              }
            }),
            code: 503,
            status: ''
          }
        })
      };
      expect(cleanErrorMessage(err)).toBe(friendly);
    });

    it('should extract inner message even if not a transient category', () => {
      const err = {
        message: JSON.stringify({
          error: {
            message: JSON.stringify({
              error: {
                code: 400,
                message: 'Some specific bad request description'
              }
            })
          }
        })
      };
      expect(cleanErrorMessage(err)).toBe('Some specific bad request description');
    });
  });

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should succeed immediately if the function succeeds', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const promise = retryWithBackoff(fn, 3, 100);
      
      const res = await promise;
      expect(res).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on transient errors and eventually succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce({ status: 503, message: 'Unavailable' })
        .mockRejectedValueOnce({ status: 503, message: 'Unavailable' })
        .mockResolvedValue('success-after-retries');

      const promise = retryWithBackoff(fn, 3, 100, 2);
      
      // Advance timers to trigger retries
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);

      const res = await promise;
      expect(res).toBe('success-after-retries');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-transient errors', async () => {
      const fn = vi.fn().mockRejectedValue({ status: 400, message: 'Bad request' });
      const promise = retryWithBackoff(fn, 3, 100);

      await expect(promise).rejects.toEqual({ status: 400, message: 'Bad request' });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should fail after maximum retries are exhausted', async () => {
      const fn = vi.fn().mockRejectedValue({ status: 503, message: 'Unavailable' });
      const promise = retryWithBackoff(fn, 2, 100, 2);

      const catchMock = vi.fn();
      promise.catch(catchMock);

      // Advance timers for 2 retries
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);

      expect(catchMock).toHaveBeenCalledTimes(1);
      expect(catchMock).toHaveBeenCalledWith({ status: 503, message: 'Unavailable' });
      expect(fn).toHaveBeenCalledTimes(3); // Initial call + 2 retries
    });
  });
});
