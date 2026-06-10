const STRIP_PATTERN = /[<>"'`]/g;

/** Strips dangerous characters (<>"'`) from user input to prevent XSS and injection. */
export function sanitizeText(input: string): string {
  return input.replace(STRIP_PATTERN, '').trim().slice(0, 500);
}

/** Type guard that validates a value is a finite number greater than zero. */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

/** Validates that a value is one of the four supported emission categories. */
export function isValidCategory(value: unknown): boolean {
  return ['transport', 'food', 'energy', 'shopping'].includes(value as string);
}
