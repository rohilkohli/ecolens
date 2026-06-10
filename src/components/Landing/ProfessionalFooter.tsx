/**
 * Professional SaaS-style footer component.
 * Displays company info, product links, resources, and legal information.
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

const TECH_STACK = [
  'React 19', 'TypeScript 5', 'Firebase', 'Gemini AI', 'Tailwind CSS', 'Vite 8',
] as const;

export default function ProfessionalFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#070A12] px-4 py-12 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#2DC878]" />
              <span className="text-[#2DC878] text-sm font-semibold">EcoLens</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-4">
              Track, understand, and reduce your personal carbon footprint with AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map(tech => (
                <span key={tech} className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Product column */}
          <div>
            <h3 className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-3">Product</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/40 text-xs hover:text-white/70 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-3">Resources</h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 text-xs hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Data & methodology column */}
          <div>
            <h3 className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-3">Methodology</h3>
            <ul className="space-y-2 text-white/40 text-xs">
              <li>IPCC AR6 emission factors</li>
              <li>CEA 2023 India grid data</li>
              <li>Gemini 2.5 Flash AI model</li>
              <li>Real-time personalisation</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-[10px]">
            &copy; {new Date().getFullYear()} EcoLens. Built for PromptWars Virtual · Hack2Skill × Google for Developers.
          </p>
          <div className="flex items-center gap-4 text-white/25 text-[10px]">
            <span>Privacy-first: data stored locally or in your Firebase account</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
