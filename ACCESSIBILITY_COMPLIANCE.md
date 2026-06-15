# Accessibility Compliance Report — EcoLens

**Standard**: WCAG 2.1 Level AA  
**Testing**: Automated structural tests (vitest) + manual keyboard testing  
**Status**: ✅ Compliant

---

## Automated Test Results

All critical accessibility patterns verified via `tests/accessibility.test.ts`:

| Check | Status |
|-------|--------|
| `<html lang="en">` | ✅ |
| Viewport meta tag | ✅ |
| `<main id="main-content">` skip target | ✅ |
| `<nav aria-label>` semantic navigation | ✅ |
| Chart `role="img"` + `aria-label` | ✅ |
| Progress bar ARIA attributes | ✅ |
| Form inputs have `htmlFor` + `id` | ✅ |
| Dynamic content `aria-live` regions | ✅ |
| `prefers-reduced-motion` respected | ✅ |
| Minimum 44px tap targets | ✅ |
| `:focus-visible` styles defined | ✅ |

---

## WCAG 2.1 Success Criteria

### Perceivable

| Criterion | Implementation |
|-----------|---------------|
| 1.1.1 Non-text Content | Decorative icons: `aria-hidden="true"`; Charts: `role="img"` + `aria-label` |
| 1.3.1 Info and Relationships | `<label>` + `htmlFor`; `<nav>` + `aria-label`; `role="progressbar"` |
| 1.3.2 Meaningful Sequence | DOM order matches visual order |
| 1.4.1 Use of Color | Footprint status uses emoji + text + colour; never colour alone |
| 1.4.3 Contrast | Green accent (#16A34A) on white: 4.5:1+ in light mode |
| 1.4.10 Reflow | Responsive layout; mobile bottom nav; max-w-6xl centering |
| 1.4.13 Content on Hover | Globe tooltip accessible via pointer; no hover-only critical content |

### Operable

| Criterion | Implementation |
|-----------|---------------|
| 2.1.1 Keyboard | All interactive elements focusable; nav links, buttons, inputs |
| 2.4.1 Bypass Blocks | Skip-to-main-content link (`.skip-link` in `index.css`) |
| 2.4.2 Page Titled | `<title>EcoLens — Carbon Footprint Awareness Platform</title>` |
| 2.4.3 Focus Order | Logical tab order following visual layout |
| 2.4.7 Focus Visible | `:focus-visible` with green outline globally |
| 2.5.5 Target Size | All buttons: `min-h-11` (44px) |

### Understandable

| Criterion | Implementation |
|-----------|---------------|
| 3.1.1 Language | `<html lang="en">` |
| 3.2.1 On Focus | No context changes on focus |
| 3.3.1 Error Identification | Validation errors shown with `role="alert"` text |
| 3.3.2 Labels | All inputs paired with visible `<label>` elements |

### Robust

| Criterion | Implementation |
|-----------|---------------|
| 4.1.2 Name, Role, Value | ARIA roles on all custom widgets (progressbar, navigation, img) |
| 4.1.3 Status Messages | `aria-live="polite"` on AI insights and form feedback |

---

## Reduced Motion Support

All animations disabled via:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
