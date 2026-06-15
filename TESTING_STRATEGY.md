# Testing Strategy — EcoLens

## Overview

| Layer | Framework | Tests | Coverage |
|-------|-----------|-------|----------|
| Unit (services) | vitest | 41 | ~95% |
| Unit (utilities) | vitest | 21 | 100% |
| Component | vitest + Testing Library | 3 | key flows |
| Structural (security) | vitest + fs | 11 | all modules |
| Structural (accessibility) | vitest + fs | 12 | all components |
| Structural (code quality) | vitest + fs | 9 | project config |
| Integration (location) | vitest | 13 | graceful degradation |
| Integration (errors) | vitest | 16 | error hierarchy |

**Total: 115 tests across 12 files, all passing.**

## Test Philosophy

- **No external API calls**: Gemini tests use mocks; Location tests verify Result pattern without Maps SDK
- **Fast execution**: Full suite runs in <4 seconds
- **Deterministic**: Pure function tests use exact arithmetic; no timing dependencies
- **Structural verification**: Tests scan actual source files to verify security and accessibility patterns

## Test Files

| File | Purpose | Tests |
|------|---------|-------|
| `emissionFactors.test.ts` | IPCC factor accuracy and calculation precision | 6 |
| `validators.test.ts` | XSS sanitisation, type guards, category validation | 10 |
| `useEmissions.test.ts` | Hook aggregation logic for 7-day emissions | 6 |
| `ActivityLogger.test.tsx` | Component rendering, form validation, keyboard access | 3 |
| `gemini.test.ts` | Retry logic, transient error detection, clean messages | 14 |
| `security.test.ts` | XSS prevention, API key protection, no hardcoded secrets | 11 |
| `accessibility.test.ts` | ARIA roles, semantic HTML, landmarks, focus management | 12 |
| `codeQuality.test.ts` | Strict mode, no dangerouslySetInnerHTML, versioning | 9 |
| `formatters.test.ts` | Date/time/CO2 formatting utilities | 11 |
| `constants.test.ts` | All app constants within valid bounds | 10 |
| `location.test.ts` | Location services Result pattern, region factors | 13 |
| `errors.test.ts` | Error class hierarchy, type guards, message extraction | 16 |

## Running Tests

```bash
npm run test        # Run all tests once
npm run test:watch  # Watch mode
```
