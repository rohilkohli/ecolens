/**
 * Structured error hierarchy for EcoLens.
 * Provides typed, categorised errors with operational/programmer distinction.
 * @module errors
 */

/** Error severity used for logging and monitoring. */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Enumerated error codes for programmatic error identification. */
export enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_PERMISSION_DENIED = 'AUTH_PERMISSION_DENIED',
  API_RATE_LIMITED = 'API_RATE_LIMITED',
  API_SERVICE_UNAVAILABLE = 'API_SERVICE_UNAVAILABLE',
  API_INVALID_RESPONSE = 'API_INVALID_RESPONSE',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Base application error with structured metadata.
 * All application-specific errors extend this class.
 *
 * @example
 * ```typescript
 * throw new AppError('Failed to save', ErrorCode.NETWORK_UNAVAILABLE, 503);
 * ```
 */
export class AppError extends Error {
  /** Programmatic error code for conditional handling. */
  public readonly code: ErrorCode;
  /** HTTP-equivalent status code. */
  public readonly statusCode: number;
  /** Whether this error is expected (operational) vs a programmer bug. */
  public readonly isOperational: boolean;
  /** Error severity for logging prioritisation. */
  public readonly severity: ErrorSeverity;
  /** ISO timestamp of when the error occurred. */
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    severity: ErrorSeverity = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.severity = severity;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when user input fails validation rules.
 *
 * @example
 * ```typescript
 * throw new ValidationError('Quantity must be greater than zero', 'quantity');
 * ```
 */
export class ValidationError extends AppError {
  /** The field that failed validation. */
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, ErrorCode.VALIDATION_FAILED, 400, true, 'low');
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Thrown when a network request fails due to connectivity issues.
 *
 * @example
 * ```typescript
 * throw new NetworkError('Unable to reach server');
 * ```
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed. Please check your connection.') {
    super(message, ErrorCode.NETWORK_UNAVAILABLE, 0, true, 'medium');
    this.name = 'NetworkError';
  }
}

/**
 * Thrown when authentication or authorisation fails.
 *
 * @example
 * ```typescript
 * throw new AuthError('Session expired', ErrorCode.AUTH_SESSION_EXPIRED);
 * ```
 */
export class AuthError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.AUTH_INVALID_CREDENTIALS) {
    super(message, code, 401, true, 'medium');
    this.name = 'AuthError';
  }
}

/**
 * Thrown when an external API (Gemini, Maps) returns an error.
 *
 * @example
 * ```typescript
 * throw new ApiError('Gemini service unavailable', ErrorCode.API_SERVICE_UNAVAILABLE, 503);
 * ```
 */
export class ApiError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.API_INVALID_RESPONSE, statusCode: number = 500) {
    super(message, code, statusCode, true, 'high');
    this.name = 'ApiError';
  }
}

/**
 * Type guard to check if an unknown value is an AppError instance.
 *
 * @param error - The value to check
 * @returns True if the value is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extracts a user-friendly message from any error type.
 * Falls back to a generic message for non-Error values.
 *
 * @param error - Any thrown value
 * @returns A safe, user-displayable error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
