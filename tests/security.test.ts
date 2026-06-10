import { describe, it, expect } from 'vitest';
import { sanitizeText } from '../src/utils/validators';

describe('Security — Input Sanitisation', () => {
  it('strips XSS script tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('<');
    expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('>');
  });

  it('strips event handler injection attempts', () => {
    expect(sanitizeText('onload="alert(1)"')).not.toContain('"');
  });

  it('strips template literal injection', () => {
    expect(sanitizeText('${document.cookie}')).not.toContain('`');
  });

  it('strips SQL injection characters', () => {
    const result = sanitizeText("'; DROP TABLE users; --");
    expect(result).not.toContain("'");
  });

  it('truncates excessively long input to 500 chars', () => {
    const longInput = 'a'.repeat(1000);
    expect(sanitizeText(longInput).length).toBeLessThanOrEqual(500);
  });

  it('preserves safe unicode characters', () => {
    expect(sanitizeText('Drove 10km in München')).toBe('Drove 10km in München');
  });

  it('preserves numbers and common punctuation', () => {
    expect(sanitizeText('Used 5.2 kWh, saved money!')).toBe('Used 5.2 kWh, saved money!');
  });

  it('handles empty string gracefully', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles whitespace-only input', () => {
    expect(sanitizeText('   ')).toBe('');
  });
});

describe('Security — API Key Protection', () => {
  it('VITE_GEMINI_API_KEY is not hardcoded in source', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const geminiService = fs.readFileSync(
      path.resolve(__dirname, '../src/services/gemini.ts'),
      'utf-8'
    );
    // Should reference env variable, not contain a raw key
    expect(geminiService).toContain('import.meta.env.VITE_GEMINI_API_KEY');
    expect(geminiService).not.toMatch(/AIza[A-Za-z0-9_-]{35}/);
  });

  it('Firebase config uses environment variables', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const firebaseLib = fs.readFileSync(
      path.resolve(__dirname, '../src/lib/firebase.ts'),
      'utf-8'
    );
    expect(firebaseLib).toContain('import.meta.env.VITE_FIREBASE_API_KEY');
    expect(firebaseLib).not.toMatch(/AIza[A-Za-z0-9_-]{35,45}/);
  });
});
