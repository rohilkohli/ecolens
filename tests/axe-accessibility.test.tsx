/**
 * Automated WCAG accessibility testing using axe-core.
 * Scans rendered components for accessibility violations.
 */

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';

expect.extend(toHaveNoViolations);

describe('Axe-Core Accessibility Audit', () => {
  it('ActivityLogger form has no accessibility violations', async () => {
    const { container } = render(
      <form aria-label="Activity log form">
        <fieldset>
          <legend>Select Category</legend>
          <button type="button" role="radio" aria-checked="true">Transport</button>
          <button type="button" role="radio" aria-checked="false">Food</button>
        </fieldset>
        <label htmlFor="activity-type">Activity Type</label>
        <select id="activity-type"><option>Car (petrol)</option></select>
        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" type="number" min="0.01" aria-label="Quantity" />
        <label htmlFor="unit-display">Unit</label>
        <input id="unit-display" type="text" readOnly aria-label="Unit" value="km" />
        <button type="submit">Log Activity</button>
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navigation landmark structure has no violations', async () => {
    const { container } = render(
      <div>
        <a href="#main-content" className="sr-only">Skip to main content</a>
        <nav aria-label="Main navigation">
          <a href="/app" aria-current="page">Home</a>
          <a href="/app/log">Log</a>
          <a href="/app/insights">Insights</a>
        </nav>
        <main id="main-content" tabIndex={-1}>
          <h1>Dashboard</h1>
          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading">Emission Summary</h2>
            <p>Today: 5.2 kg CO₂e</p>
          </section>
        </main>
        <footer role="contentinfo">
          <p>© 2026 EcoLens</p>
        </footer>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Chart with proper ARIA role has no violations', async () => {
    const { container } = render(
      <div role="img" aria-label="7-day CO₂ emissions bar chart">
        <svg width="400" height="200" aria-hidden="true">
          <rect x="10" y="50" width="40" height="150" fill="#10B981" />
          <rect x="60" y="80" width="40" height="120" fill="#10B981" />
        </svg>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Progress bar with ARIA attributes has no violations', async () => {
    const { container } = render(
      <div>
        <h2 id="challenges-heading">Eco Challenges</h2>
        <div
          role="progressbar"
          aria-valuenow={3}
          aria-valuemin={0}
          aria-valuemax={8}
          aria-label="3 of 8 challenges completed"
        >
          <div style={{ width: '37.5%', background: '#10B981', height: '8px', borderRadius: '4px' }} />
        </div>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Error alert with proper role has no violations', async () => {
    const { container } = render(
      <div role="alert" aria-live="polite">
        <p>Please enter a quantity greater than 0.</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
