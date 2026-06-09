import { describe, it, expect } from 'vitest';
import { sanitizeText, isPositiveNumber } from '../src/utils/validators';

describe('sanitizeText', () => {
  it('strips script injection', () => {
    expect(sanitizeText('<script>alert(1)</script>')).not.toContain('<');
  });
  it('strips SQL-injection characters', () => {
    const result = sanitizeText("' OR 1=1 --");
    expect(result).not.toContain("'");
  });
  it('strips double quotes', () => {
    expect(sanitizeText('"hello"')).not.toContain('"');
  });
  it('preserves normal text unchanged', () => {
    expect(sanitizeText('Drove to work today')).toBe('Drove to work today');
  });
  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });
});

describe('isPositiveNumber', () => {
  it('returns true for positive numbers', () => expect(isPositiveNumber(5)).toBe(true));
  it('returns false for zero', () => expect(isPositiveNumber(0)).toBe(false));
  it('returns false for negative', () => expect(isPositiveNumber(-1)).toBe(false));
  it('returns false for NaN', () => expect(isPositiveNumber(NaN)).toBe(false));
  it('returns false for strings', () => expect(isPositiveNumber('5')).toBe(false));
});
