/**
 * Professional SaaS-style footer component.
 * Adapts to light/dark theme via CSS variables.
 */

const PRODUCT_LINKS = [
  { label: 'Dashboard', href: '/app' },
  { label: 'Activity Logger', href: '/app/log' },
  { label: 'AI Insights', href: '/app/insights' },
  { label: 'Eco Challenges', href: '/app/challenges' },
] as const;

const RESOURCE_LINKS = [
  { label: 'IPCC AR6 Report', href: 'https://www.ipcc.ch/assessment-report/ar6/' },
  { label: 'CEA CO₂ Database', href: 'https://cea.nic.in/' },
  { label: 'Our World in Data', href: 'https://ourworldindata.org/co2-emissions' },
  { label: 'Google AI Studio', href: 'https://aistudio.google.com/' },
] as const;

export default function ProfessionalFooter() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌿</span>
              <span className="font-bold gradient-text">EcoLens</span>
            </div>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              Track, understand, and reduce your personal carbon footprint with AI-powered insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-3">Product</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-3">Resources</h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h3 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-3">Built With</h3>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm">
              <li>React 19 + TypeScript 5</li>
              <li>Firebase Auth & Firestore</li>
              <li>Gemini 2.5 Flash AI</li>
              <li>Google Maps Platform</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[var(--text-muted)] text-xs">
            &copy; {new Date().getFullYear()} EcoLens · PromptWars Virtual · Hack2Skill × Google for Developers
          </p>
          <p className="text-[var(--text-muted)] text-xs">
            Privacy-first · MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
