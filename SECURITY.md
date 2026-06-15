# Security Policy — EcoLens

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x   | ✅        |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by emailing the maintainer directly.
Expected response time: within 72 hours.

## Security Architecture

### Threat Model & Mitigations

| Threat | Mitigation | File |
|--------|-----------|------|
| XSS via user input | `sanitizeText()` strips `<>"'\`` | `src/utils/validators.ts` |
| Prompt injection | System prompt instructs model to ignore embedded commands | `src/services/gemini.ts` |
| API key exposure | Env vars only, `.env` in `.gitignore` | `.gitignore`, `src/lib/firebase.ts` |
| Unauthorised data access | Firestore rules: users read/write own data only | `firestore.rules` |
| CSRF | Firebase Auth handles token management | `src/context/AuthContext.tsx` |
| Clickjacking | `X-Frame-Options: DENY` header | `firebase.json` |
| MIME sniffing | `X-Content-Type-Options: nosniff` | `firebase.json` |

### Input Validation

- **Client-side**: `sanitizeText()` applied to all user text before storage and AI prompts
- **Length limits**: 200-character note maximum, 500-character sanitisation ceiling
- **Type safety**: TypeScript strict mode prevents type confusion at compile time

### Credential Management

- Firebase config: environment variables (`VITE_FIREBASE_*`)
- Gemini API key: environment variable (`VITE_GEMINI_API_KEY`)
- Google Maps API key: environment variable (`VITE_GOOGLE_MAPS_API_KEY`)
- No secrets in code, no hardcoded credentials
- Verified via automated test (`tests/security.test.ts`)

### Privacy by Design

- Registered users: data stored in Firebase Firestore under user's UID
- Anonymous guests: data stored in localStorage only (never reaches server)
- No analytics, no tracking pixels, no third-party data sharing
- AI prompts contain only aggregated emission numbers, never personal data
