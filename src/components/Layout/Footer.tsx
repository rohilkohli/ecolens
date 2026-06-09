export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] mt-16 bg-[var(--bg-card)]" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">🌿</span>
            <div>
              <p className="font-bold text-lg gradient-text">EcoLens</p>
              <p className="text-xs text-[var(--text-muted)]">Carbon Footprint Awareness Platform</p>
            </div>
          </div>

          {/* Challenge info */}
          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              PromptWars Virtual · Challenge 3
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Hack2Skill × Google for Developers
            </p>
          </div>

          {/* Rights */}
          <div className="text-center md:text-right">
            <p className="text-xs text-[var(--text-muted)]">&copy; {year} EcoLens. MIT License.</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Emission factors: IPCC AR6 · CEA 2023
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            All data is stored locally in your browser. No personal data is sent to any server except when using AI insights.{' '}
            <span className="text-leaf font-medium">Your privacy matters.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
