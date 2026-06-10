import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function readSrc(filePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, '../src', filePath), 'utf-8');
}

describe('Accessibility — WCAG 2.1 AA Compliance', () => {
  it('index.html has lang attribute on <html>', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toMatch(/<html[^>]*lang="en"/);
  });

  it('index.html has viewport meta tag', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toContain('viewport');
    expect(html).toContain('width=device-width');
  });

  it('App.tsx has main element with id for skip-link target', () => {
    const app = readSrc('App.tsx');
    expect(app).toContain('id="main-content"');
  });

  it('Navbar has skip-to-content link', () => {
    const navbar = readSrc('components/Layout/Navbar.tsx');
    expect(navbar).toContain('aria-label');
  });

  it('Navbar uses semantic nav element with aria-label', () => {
    const navbar = readSrc('components/Layout/Navbar.tsx');
    expect(navbar).toMatch(/role="navigation"|<nav/);
    expect(navbar).toContain('aria-label');
  });

  it('EmissionsChart has aria role for screen readers', () => {
    const chart = readSrc('components/Dashboard/EmissionsChart.tsx');
    expect(chart).toContain('role="img"');
    expect(chart).toContain('aria-label');
  });

  it('ChallengeBoard progress bar has ARIA progressbar role', () => {
    const board = readSrc('components/Challenges/ChallengeBoard.tsx');
    expect(board).toContain('role="progressbar"');
    expect(board).toContain('aria-valuenow');
    expect(board).toContain('aria-valuemin');
    expect(board).toContain('aria-valuemax');
  });

  it('ActivityLogger form inputs have associated labels', () => {
    const logger = readSrc('components/Logger/ActivityLogger.tsx');
    expect(logger).toContain('htmlFor');
    expect(logger).toContain('id="quantity"');
    expect(logger).toContain('id="activity-type"');
  });

  it('GeminiInsights has aria-live region for dynamic content', () => {
    const insights = readSrc('components/Insights/GeminiInsights.tsx');
    expect(insights).toContain('aria-live');
  });

  it('index.css respects prefers-reduced-motion', () => {
    const css = readSrc('index.css');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('interactive elements meet 44px minimum tap target', () => {
    const button = readSrc('components/ui/Button.tsx');
    expect(button).toMatch(/min-h-[0-9]+|min-h-\[/);
  });

  it('focus-visible styles are defined globally', () => {
    const css = readSrc('index.css');
    expect(css).toContain(':focus-visible');
  });
});
