import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NetworkError,
  AuthError,
  ApiError,
  ErrorCode,
  isAppError,
  getUserFriendlyMessage,
} from '../src/lib/errors';

describe('Error Architecture', () => {
  describe('AppError', () => {
    it('creates error with all metadata fields', () => {
      const err = new AppError('test', ErrorCode.UNKNOWN, 500, true, 'high');
      expect(err.message).toBe('test');
      expect(err.code).toBe(ErrorCode.UNKNOWN);
      expect(err.statusCode).toBe(500);
      expect(err.isOperational).toBe(true);
      expect(err.severity).toBe('high');
      expect(err.timestamp).toBeTruthy();
      expect(err.name).toBe('AppError');
    });

    it('extends Error properly', () => {
      const err = new AppError('test');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(AppError);
    });
  });

  describe('ValidationError', () => {
    it('sets correct defaults', () => {
      const err = new ValidationError('Bad input', 'email');
      expect(err.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(err.statusCode).toBe(400);
      expect(err.severity).toBe('low');
      expect(err.field).toBe('email');
      expect(err.name).toBe('ValidationError');
    });
  });

  describe('NetworkError', () => {
    it('uses default message when none provided', () => {
      const err = new NetworkError();
      expect(err.message).toContain('Network');
      expect(err.statusCode).toBe(0);
    });
  });

  describe('AuthError', () => {
    it('sets auth-specific defaults', () => {
      const err = new AuthError('Session expired', ErrorCode.AUTH_SESSION_EXPIRED);
      expect(err.code).toBe(ErrorCode.AUTH_SESSION_EXPIRED);
      expect(err.statusCode).toBe(401);
    });
  });

  describe('ApiError', () => {
    it('accepts custom status code', () => {
      const err = new ApiError('Rate limited', ErrorCode.API_RATE_LIMITED, 429);
      expect(err.statusCode).toBe(429);
      expect(err.severity).toBe('high');
    });
  });

  describe('isAppError type guard', () => {
    it('returns true for AppError instances', () => {
      expect(isAppError(new AppError('test'))).toBe(true);
      expect(isAppError(new ValidationError('test'))).toBe(true);
      expect(isAppError(new ApiError('test'))).toBe(true);
    });

    it('returns false for non-AppError values', () => {
      expect(isAppError(new Error('test'))).toBe(false);
      expect(isAppError('string')).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('extracts message from AppError', () => {
      expect(getUserFriendlyMessage(new ValidationError('Bad email'))).toBe('Bad email');
    });

    it('extracts message from regular Error', () => {
      expect(getUserFriendlyMessage(new Error('oops'))).toBe('oops');
    });

    it('returns fallback for non-Error values', () => {
      expect(getUserFriendlyMessage(null)).toContain('unexpected');
      expect(getUserFriendlyMessage(42)).toContain('unexpected');
    });
  });
});
