# EcoLens — Carbon Footprint Awareness Platform

> PromptWars Virtual | Challenge 3 | Hack2Skill × Google for Developers

## Chosen Vertical
Carbon Footprint Tracking & Reduction (Challenge 3 — PromptWars Virtual)

## Tech Stack
React 19 · Vite 8 · TypeScript 5 · Tailwind CSS v4 · Firebase Auth & Firestore · @google/genai · Recharts · React Router v7

## Approach & Logic
EcoLens is a cloud-synced, multi-user React application with Firebase authentication and Firestore persistence. Users log daily activities across four categories (Transport, Food, Energy, Shopping). An emission calculation engine translates activities into kg CO₂e using IPCC AR6-aligned coefficients. The Dashboard visualises a 7-day trend and benchmarks the user against the global average. Gemini 2.5 Flash analyses the user's actual data and returns 3 context-specific, actionable tips — streamed progressively using the @google/genai SDK's generateContentStream method. Eco Challenges nudge behaviour change with Firestore-persisted completion tracking.

## How the Solution Works
1. User authenticates via Email/Password, Google, Apple, Facebook, or Phone OTP
2. User logs an activity → emission engine calculates kg CO₂e → saved to Firestore
3. Dashboard charts 7-day trend, scores user vs global average (4 t/year ≈ 11 kg/day)
4. Insights page sends a 7-day summary to Gemini 2.5 Flash → receives 3 JSON tips
5. Tips are cached for 24 hours — Gemini only called when data changes or cache expires
6. Challenges page tracks user progress with completion state in Firestore

## AI Integration
- SDK: `@google/genai` 2.8.0 (official GA SDK — replaces deprecated `@google/generative-ai`)
- Model: `gemini-2.5-flash` via Google AI Studio API key
- Usage pattern: streaming JSON generation (`generateContentStream`)
- Security: API key via env only · input sanitisation · prompt injection guard in system prompt
- Caching: 24-hour localStorage cache keyed on summary hash — avoids unnecessary API calls
- Error handling: graceful fallback for missing API key, rate limiting, and parse failures

## Security Measures
- API key: `import.meta.env.VITE_GEMINI_API_KEY` only — never committed
- Firebase config via environment variables — mock fallbacks for development
- Input sanitisation: strips `<>"'\`` from all user text before storage and Gemini injection
- Prompt injection guard: system prompt instructs model to ignore embedded commands
- No `dangerouslySetInnerHTML` used anywhere
- Firestore security rules: users can only read/write their own data
- Production headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- Error boundary catches runtime crashes and shows recovery UI

## Accessibility
- WCAG 2.1 AA compliant
- Semantic HTML throughout (`<main>`, `<nav>`, `<section>`, `<article>`)
- All form fields labelled · 44px minimum tap targets · focus-visible rings
- Colour never sole state indicator · `prefers-reduced-motion` respected
- `aria-live` on dynamic content · skip navigation link
- Mobile bottom navigation for thumb-friendly access

## Assumptions
- Emission factors: IPCC AR6 / Our World in Data / CEA 2023 (India grid)
- India grid electricity factor: 0.71 kg CO₂e/kWh
- Global average: ~4 tonnes CO₂e/year (≈ 11 kg/day)

## Setup
```bash
git clone <repo-url>
cd ecolens
npm install
cp .env.example .env
# Add your keys:
#   VITE_GEMINI_API_KEY from https://aistudio.google.com/app/apikey
#   VITE_FIREBASE_* from Firebase Console > Project Settings > Web App
npm run dev
```

## Testing
```bash
npm run test
```

## Build & Deploy
```bash
npm run build
npx firebase-tools deploy
```

## Live Preview
[Add your deployed URL here]

## License
MIT
