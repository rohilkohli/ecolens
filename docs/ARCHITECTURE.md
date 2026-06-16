# Architecture — EcoLens

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React 19 SPA)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│  │ Landing  │   │Dashboard │   │   Log    │   │Challenges│           │
│  │  Page    │   │   Page   │   │   Page   │   │   Page   │           │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘           │
│       │               │               │               │                │
│       └───────────────┴───────┬───────┴───────────────┘                │
│                               │                                         │
│                    ┌──────────┴──────────┐                              │
│                    │   Custom Hooks       │                              │
│                    ├─────────────────────┤                              │
│                    │ useActivities()     │ ← Firestore CRUD             │
│                    │ useEmissions()      │ ← Pure aggregation           │
│                    │ useGemini()         │ ← AI insights                │
│                    └──────────┬──────────┘                              │
│                               │                                         │
│              ┌────────────────┼────────────────┐                       │
│              │                │                 │                        │
│   ┌──────────┴───┐  ┌────────┴─────┐  ┌───────┴────────┐             │
│   │  Services     │  │     Lib      │  │   Constants    │             │
│   ├──────────────┤  ├──────────────┤  ├────────────────┤             │
│   │emissionFactors│  │ firebase.ts  │  │ Thresholds    │             │
│   │ gemini.ts    │  │ firestore.ts │  │ Storage keys  │             │
│   │ demoData.ts  │  │ storage.ts   │  │ Rate limits   │             │
│   │ location/    │  │ errors.ts    │  │ UI constraints│             │
│   └──────────────┘  └──────────────┘  └────────────────┘             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                 ▼
┌──────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│  Firebase Auth   │ │ Cloud Firestore │ │  Google Gemini   │
│                  │ │                 │ │   2.5 Flash      │
│ • Email/Password │ │ • Activities    │ │                  │
│ • Google OAuth   │ │ • Challenges    │ │ • 3 personalised │
│ • Apple OAuth    │ │ • User prefs    │ │   reduction tips │
│ • Phone OTP     │ │                 │ │ • Streaming      │
│ • Anonymous     │ │ Security Rules: │ │ • 24hr cache     │
│                  │ │ users/{uid}/**  │ │ • Retry+backoff  │
└──────────────────┘ └─────────────────┘ └──────────────────┘
                                                    │
                                          ┌─────────┴─────────┐
                                          ▼                    ▼
                                 ┌─────────────┐     ┌─────────────┐
                                 │gemini-2.5-  │     │gemini-2.0-  │
                                 │flash        │     │flash        │
                                 │(primary)    │     │(fallback)   │
                                 └─────────────┘     └─────────────┘

              ┌────────────────────────────────────┐
              │       Google Maps Platform         │
              ├────────────────────────────────────┤
              │ • Geocoding API (city detection)   │
              │ • Directions API (route distance)  │
              │ • Places API (green alternatives)  │
              │ • Maps JavaScript API (3D globe)   │
              └────────────────────────────────────┘
```

---

## Data Flow

### Activity Logging
```
User Input → sanitizeText() → calculateEmission() → Optimistic UI Update
                                                          │
                                            ┌─────────────┴──────────────┐
                                            ▼                             ▼
                                    [Anonymous User]              [Registered User]
                                    localStorage save           Firestore write
                                                                      │
                                                               On failure: revert UI
```

### AI Insights Generation
```
User clicks "Get Tips"
      │
      ▼
Check rate limit (10s minimum)
      │
      ▼
Check localStorage cache (24hr TTL, keyed on summary hash)
      │ cache miss
      ▼
retryWithBackoff(gemini-2.5-flash, 3 attempts)
      │ all retries 503?
      ▼
Fallback to gemini-2.0-flash
      │
      ▼
Validate response (JSON array, 3 items, correct schema)
      │
      ▼
Cache result → Update UI
```

### Authentication Flow
```
Landing Page → "Try Free" → signInAnonymously() → /app (demo mode)
            → "Sign In"  → /auth → Email|Google|Apple|Phone → /app (full mode)

Anonymous users: localStorage persistence, AI gated behind upsell
Registered users: Firestore persistence, full AI access
```

---

## Folder Structure Rationale

| Directory | Responsibility | Pattern |
|-----------|---------------|---------|
| `src/pages/` | Route-level components, data fetching orchestration | One file per route |
| `src/components/` | Presentational UI, feature-grouped | Feature folders (Dashboard/, Logger/, etc.) |
| `src/hooks/` | Stateful logic, side effects | Custom hooks consuming services |
| `src/services/` | External API communication, business logic | Pure functions returning Results |
| `src/lib/` | Infrastructure wrappers (Firebase, errors) | Thin typed wrappers |
| `src/constants/` | Magic value extraction | Single source of truth |
| `src/types/` | Domain type definitions | Shared interfaces |
| `src/utils/` | Pure utility functions | No side effects |
| `src/context/` | React context providers | Auth, Theme |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Firebase over custom backend | Serverless, scales to zero, free tier sufficient for hackathon |
| Optimistic UI updates | Instant feedback; reverts on Firestore failure |
| Result<T,E> pattern in services | Explicit error handling, no uncaught throws from services |
| Streaming Gemini (generateContentStream) | Progressive UX during AI generation |
| 24hr insight cache | Reduces API costs; data rarely changes hourly |
| Model fallback (2.5 → 2.0) | Gemini 2.5 Flash has high-demand 503s; 2.0 is more stable |
| Anonymous guest mode | Zero-friction trial; upsell to registered for persistence |
| CSS variables for theming | Light/dark toggle without re-rendering component tree |
| Three.js globe lazy-loaded | Heavy 3D dependency doesn't block initial page load |

---

## Security Boundaries

```
┌─────────────────────────────────────────┐
│            CLIENT BOUNDARY              │
│                                         │
│  sanitizeText() ─── all user input     │
│  env vars only ──── no hardcoded keys  │
│  TypeScript strict ─ compile-time safety│
└─────────────────────────────────────────┘
                    │
                    ▼ HTTPS only
┌─────────────────────────────────────────┐
│           FIREBASE BOUNDARY             │
│                                         │
│  Auth ────── token-based sessions      │
│  Rules ───── users/{uid}/** only       │
│  Hosting ─── security headers (CSP)    │
└─────────────────────────────────────────┘
                    │
                    ▼ Authenticated requests
┌─────────────────────────────────────────┐
│           GOOGLE AI BOUNDARY            │
│                                         │
│  API key ─── restricted to Gemini only │
│  Prompt ──── injection guard in system │
│  Input ───── only aggregated numbers   │
└─────────────────────────────────────────┘
```
