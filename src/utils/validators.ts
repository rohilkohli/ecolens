const STRIP_PATTERN = /[<>"'`]/g;

export function sanitizeText(input: string): string {
  return input.replace(STRIP_PATTERN, '').trim().slice(0, 500);
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

export function isValidCategory(value: unknown): boolean {
  return ['transport', 'food', 'energy', 'shopping'].includes(value as string);
}
