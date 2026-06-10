import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '📊',
    title: 'Track everything',
    desc: 'Transport, food, energy, shopping — all in one place with smart emission calculations',
  },
  {
    icon: '🤖',
    title: 'AI-powered tips',
    desc: 'Gemini 2.5 Flash analyses your actual data and gives 3 personalised reduction strategies',
  },
  {
    icon: '🏆',
    title: 'Eco challenges',
    desc: 'Take on weekly green habits and track your estimated CO₂ savings in real time',
  },
];

const BAR_HEIGHTS = [55, 80, 70, 90, 60, 75, 45];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInAsGuest } = useAuth();

  async function handleTryFree() {
    try {
      await signInAsGuest();
      navigate('/app');
    } catch (err) {
      console.error('Guest sign-in failed:', err);
      // Still let them navigate — they'll be redirected by AuthGuard
      navigate('/auth');
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-sm border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#2DC878]/15 border border-[#2DC878]/30 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-[#2DC878]" />
          <span className="text-[#2DC878] text-xs font-semibold tracking-wide">EcoLens</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-white/50 text-xs hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Sign in
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative px-4 pt-10 pb-6 text-center overflow-hidden">
        {/* Ambient glow orbs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(45,200,120,0.10)', filter: 'blur(60px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.08)', filter: 'blur(48px)' }}
          aria-hidden="true"
        />

        {/* Gemini badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#2DC878]/10 border border-[#2DC878]/20 rounded-xl px-3 py-1 mb-5">
          <span className="text-[10px]">✨</span>
          <span className="text-[#2DC878] text-[10px] font-medium tracking-wide">Powered by Gemini AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-[30px] font-semibold text-white leading-tight mb-3 tracking-tight">
          Know your<br />
          <span className="text-[#2DC878]">carbon footprint.</span><br />
          Change it.
        </h1>

        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
          Log daily habits across transport, food, energy & shopping.
          Get AI-powered tips. Take eco challenges.
        </p>

        {/* Live preview widget */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/40 text-[10px]">Sample footprint this week</span>
            <span className="text-[#2DC878] font-semibold text-sm">6.2 kg CO₂e today</span>
          </div>
          {/* Mini bar chart */}
          <div className="flex gap-1 items-end h-10" role="img" aria-label="Sample weekly emissions bar chart">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background: i === 6 ? '#2DC878' : 'rgba(45,200,120,0.25)',
                }}
              />
            ))}
          </div>
          <div className="flex gap-1 mt-1.5">
            {DAY_LABELS.map((d, i) => (
              <span
                key={i}
                className="flex-1 text-center text-[8px]"
                style={{ color: i === 6 ? '#2DC878' : 'rgba(255,255,255,0.2)' }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex gap-2 mb-4">
          <button
            id="try-free-btn"
            onClick={handleTryFree}
            className="flex-1 bg-[#2DC878] text-[#0B1A12] font-semibold text-sm rounded-xl py-3.5 hover:bg-[#25B066] transition-colors active:scale-[0.98]"
          >
            Try free — no signup
          </button>
          <button
            id="sign-in-btn"
            onClick={() => navigate('/auth')}
            className="flex-1 bg-white/[0.07] text-white/70 text-sm border border-white/[0.12] rounded-xl py-3.5 hover:bg-white/10 transition-colors active:scale-[0.98]"
          >
            Sign in
          </button>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 text-white/25 text-[10px]">
          <span>Free to use</span>
          <span>·</span>
          <span>No credit card</span>
          <span>·</span>
          <span>Save data by signing up</span>
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="px-4 pt-4 pb-28 space-y-3">
        <p className="text-white/25 text-[10px] uppercase tracking-widest font-medium text-center mb-4">
          Everything you need
        </p>
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex gap-3 hover:bg-white/[0.05] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2DC878]/10 border border-[#2DC878]/15 flex items-center justify-center text-xl flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-white font-medium text-sm mb-1">{f.title}</p>
              <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}

        {/* Bottom CTA repeat */}
        <div className="pt-4">
          <button
            onClick={handleTryFree}
            className="w-full bg-[#2DC878] text-[#0B1A12] font-semibold text-sm rounded-xl py-3.5 hover:bg-[#25B066] transition-colors active:scale-[0.98]"
          >
            Start tracking for free
          </button>
          <p className="text-white/20 text-[10px] text-center mt-3">
            No account needed · 30 seconds to your first reading
          </p>
        </div>
      </section>
    </div>
  );
}
