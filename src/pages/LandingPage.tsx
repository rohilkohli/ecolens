import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { calculateEmission, EMISSION_FACTORS, type EmissionCategory } from '../services/emissionFactors';

const EcoGlobe = lazy(() => import('../components/Globe/EcoGlobe'));

/** "Try Free" inline demo — 3 entries, AI-style summary, then prompt to register */
function TryFreeDemo({ onDone }: { onDone: () => void }) {
  const [entries, setEntries] = useState<{ category: EmissionCategory; subType: string; qty: number; co2: number }[]>([]);
  const [category, setCategory] = useState<EmissionCategory>('transport');
  const [subType, setSubType] = useState('car_petrol');
  const [qty, setQty] = useState('');

  const subTypes = Object.entries(EMISSION_FACTORS[category]);

  function addEntry() {
    const q = parseFloat(qty);
    if (!q || q <= 0) return;
    const co2 = calculateEmission(category, subType, q);
    setEntries(prev => [...prev, { category, subType, qty: q, co2 }]);
    setQty('');
  }

  const totalCo2 = entries.reduce((s, e) => s + e.co2, 0);
  const showResults = entries.length >= 3;

  if (showResults) {
    return (
      <div className="liquid-glass p-6 animate-scale-in text-center">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🌍</div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">Your Quick Footprint</h3>
        <p className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{totalCo2.toFixed(2)} kg CO₂e</p>
        <p className="text-sm text-[var(--text-muted)] mb-4">from {entries.length} activities</p>
        <div className="space-y-2 mb-6 text-left">
          {entries.map((e, i) => (
            <div key={i} className="flex justify-between text-sm p-2 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
              <span className="text-[var(--text-secondary)]">{EMISSION_FACTORS[e.category][e.subType]?.label}</span>
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>{e.co2.toFixed(3)} kg</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Want personalised AI tips to reduce your footprint?<br />Sign up for the full experience!
        </p>
        <button onClick={onDone} className="btn-primary w-full !py-3.5">
          Create Free Account
        </button>
        <p className="text-[10px] text-[var(--text-muted)] mt-3">Get AI insights, track trends, take challenges</p>
      </div>
    );
  }

  return (
    <div className="liquid-glass p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[var(--text)]">Quick Try — Log {3 - entries.length} more</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          {entries.length}/3
        </span>
      </div>

      {/* Entries so far */}
      {entries.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {entries.map((e, i) => (
            <div key={i} className="flex justify-between text-xs p-2 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
              <span className="text-[var(--text-secondary)]">{EMISSION_FACTORS[e.category][e.subType]?.label} ({e.qty})</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{e.co2.toFixed(3)} kg</span>
            </div>
          ))}
        </div>
      )}

      {/* Category selector */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {(['transport', 'food', 'energy', 'shopping'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSubType(Object.keys(EMISSION_FACTORS[cat])[0]); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              category === cat ? 'btn-primary !py-1.5 !px-3' : 'btn-glass !py-1.5 !px-3 !text-xs'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity + quantity */}
      <div className="flex gap-2 mb-3">
        <select
          value={subType}
          onChange={e => setSubType(e.target.value)}
          className="input-glass flex-1 !py-2 !text-xs"
        >
          {subTypes.map(([key, f]) => <option key={key} value={key}>{f.label}</option>)}
        </select>
        <input
          type="number" min="0.1" step="0.1" value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="Qty"
          className="input-glass w-20 !py-2 !text-xs text-center"
        />
      </div>

      <button onClick={addEntry} disabled={!qty || parseFloat(qty) <= 0} className="btn-primary w-full !py-2.5 !text-sm disabled:opacity-40">
        Add Entry ({entries.length + 1}/3)
      </button>
    </div>
  );
}

const FEATURES = [
  { icon: '📊', title: 'Smart Tracking', desc: 'Log activities across 4 categories with IPCC AR6 emission factors for precise CO₂e calculations.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Gemini 2.5 Flash analyses your patterns and delivers 3 personalised reduction strategies.' },
  { icon: '🏆', title: 'Eco Challenges', desc: 'Gamified weekly challenges with estimated CO₂e savings to build green habits.' },
  { icon: '📍', title: 'Location Aware', desc: 'Region-specific grid emission factors and route-based distance calculation.' },
  { icon: '📈', title: 'Beautiful Dashboard', desc: '7-day trend charts, category breakdowns, footprint scoring vs global average.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your data lives in your Firebase account. Never sold. Never shared.' },
] as const;

const STATS = [
  { value: '19', label: 'Activity Types' },
  { value: '4', label: 'Categories' },
  { value: 'AR6', label: 'IPCC Data' },
  { value: '24/7', label: 'AI Available' },
] as const;

function InteractiveDemo() {
  const [qty, setQty] = useState('15');
  const [cat] = useState<'transport'>('transport');
  const subType = 'car_petrol';
  const emission = calculateEmission(cat, subType, parseFloat(qty) || 0);
  const factor = EMISSION_FACTORS.transport[subType];

  return (
    <div className="liquid-glass p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30" style={{ background: 'var(--accent)', filter: 'blur(50px)' }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Live Demo</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Interactive</span>
        </div>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
          <span className="text-3xl">🚗</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{factor.label}</p>
            <p className="text-xs text-[var(--text-muted)]">{factor.co2e_per_unit} kg CO₂e per km</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="range"
            min="1" max="100"
            value={qty}
            onChange={e => setQty(e.target.value)}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, var(--accent) ${parseFloat(qty)}%, var(--border) ${parseFloat(qty)}%)` }}
            aria-label="Distance in km"
          />
          <span className="text-sm font-bold tabular-nums text-[var(--text)] min-w-[3rem] text-right">{qty} km</span>
        </div>
        <div className="text-center p-4 rounded-xl" style={{ background: 'var(--accent-soft)' }}>
          <p className="text-3xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{emission.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">kg CO₂e emitted</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showTryFree, setShowTryFree] = useState(false);

  async function handleTryFree() {
    setShowTryFree(true);
  }

  // Used by CTA in bottom section
  async function handleFullAccess() {
    try {
      await signInAsGuest();
      navigate('/app');
    } catch {
      navigate('/auth');
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">

      {/* ═══ Navbar ═══ */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white text-sm">🌿</span>
            </div>
            <span className="font-bold text-lg text-[var(--text)]">EcoLens</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-all"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => navigate('/auth')} className="btn-secondary !py-2 !px-3 !text-xs">
              Sign In
            </button>
            <button onClick={handleTryFree} className="btn-primary !py-2 !px-3 !text-xs">
              Try Free
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb orb-green w-96 h-96 -top-20 -right-20" aria-hidden="true" />
        <div className="orb orb-blue w-72 h-72 top-40 -left-20" aria-hidden="true" />
        <div className="orb orb-purple w-64 h-64 bottom-0 right-1/3" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Powered by Google Gemini AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Know your<br />
                <span className="gradient-text">carbon impact.</span><br />
                <span className="text-[var(--text-secondary)]">Change it.</span>
              </h1>

              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg leading-relaxed">
                The intelligent carbon footprint platform. Track daily activities, get AI-powered reduction insights, and complete eco challenges.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <button onClick={handleTryFree} className="btn-primary !py-3.5 !px-7 !text-base">
                  Start Free — No Signup
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <button onClick={() => navigate('/auth')} className="btn-secondary !py-3.5 !px-7 !text-base">
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Free forever</span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> IPCC AR6 data</span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> AI insights</span>
              </div>
            </div>

            <div className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '0.2s' }}>
              {showTryFree ? <TryFreeDemo onDone={() => navigate('/auth')} /> : <InteractiveDemo />}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Interactive Globe ═══ */}
      <section className="py-20 relative overflow-hidden">
        <div className="orb orb-green w-80 h-80 top-10 left-10" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Global Carbon Overview</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Hover over data points to explore emission profiles across different regions.
            </p>
          </div>
          <Suspense fallback={
            <div className="w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <EcoGlobe />
          </Suspense>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <section className="border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">Three simple steps to understanding and reducing your carbon footprint.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 stagger">
            {[
              { step: '01', icon: '✏️', title: 'Log Activities', desc: 'Record transport, food, energy, and shopping activities in seconds.' },
              { step: '02', icon: '🤖', title: 'AI Analysis', desc: 'Gemini AI processes your data and identifies reduction opportunities.' },
              { step: '03', icon: '🌱', title: 'Take Action', desc: 'Follow personalised tips and complete eco challenges to reduce impact.' },
            ].map(item => (
              <div key={item.step} className="card p-6 text-center group">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl transition-transform group-hover:scale-110" style={{ background: 'var(--accent-soft)' }}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{item.step}</div>
                <h3 className="font-bold text-lg mb-2 text-[var(--text)]">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features Grid ═══ */}
      <section className="py-20" style={{ background: 'var(--bg-muted)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything You Need</h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">From daily tracking to AI-powered insights — the complete carbon reduction toolkit.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-5 group">
                <span className="text-2xl block mb-3 transition-transform group-hover:scale-110">{f.icon}</span>
                <h3 className="font-semibold text-[var(--text)] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Mobile Demo ═══ */}
      <section className="py-16 lg:hidden px-4">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">{showTryFree ? 'Quick Carbon Check' : 'Try It Now'}</h2>
          {showTryFree ? <TryFreeDemo onDone={() => navigate('/auth')} /> : <InteractiveDemo />}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-3xl gradient-bg mx-auto mb-6 flex items-center justify-center shadow-lg animate-float" style={{ boxShadow: '0 8px 30px rgba(16,185,129,0.3)' }}>
            <span className="text-3xl">🌍</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            Start tracking your carbon footprint today. No signup required. Takes 30 seconds.
          </p>
          <button onClick={handleFullAccess} className="btn-primary !py-4 !px-8 !text-base">
            Start Tracking for Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t py-12" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }} role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center"><span className="text-white text-xs">🌿</span></div>
                <span className="font-bold text-[var(--text)]">EcoLens</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                AI-powered carbon footprint tracking platform. Built with React 19, Firebase, and Gemini AI.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a href="/app" className="hover:text-[var(--accent)] transition-colors">Dashboard</a></li>
                <li><a href="/app/log" className="hover:text-[var(--accent)] transition-colors">Activity Logger</a></li>
                <li><a href="/app/insights" className="hover:text-[var(--accent)] transition-colors">AI Insights</a></li>
                <li><a href="/app/challenges" className="hover:text-[var(--accent)] transition-colors">Challenges</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a href="https://www.ipcc.ch/assessment-report/ar6/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">IPCC AR6</a></li>
                <li><a href="https://cea.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">CEA India</a></li>
                <li><a href="https://ourworldindata.org/co2-emissions" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Our World in Data</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Technology</h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>React 19 + TypeScript 5</li>
                <li>Firebase Auth + Firestore</li>
                <li>Gemini 2.5 Flash AI</li>
                <li>Google Maps Platform</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]" style={{ borderColor: 'var(--border)' }}>
            <p>&copy; 2026 EcoLens · PromptWars Virtual · Hack2Skill × Google for Developers</p>
            <p>Privacy-first · MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
