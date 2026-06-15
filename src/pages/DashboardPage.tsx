import { useNavigate } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import { useAuth } from '../context/AuthContext';
import EmissionsChart from '../components/Dashboard/EmissionsChart';
import DemoBanner from '../components/auth/DemoBanner';
import Spinner from '../components/ui/Spinner';

const CATEGORY_CONFIG = [
  { key: 'transport' as const, emoji: '🚗', label: 'Transport' },
  { key: 'food'      as const, emoji: '🍽️', label: 'Food'      },
  { key: 'energy'    as const, emoji: '⚡',  label: 'Energy'    },
  { key: 'shopping'  as const, emoji: '🛍️', label: 'Shopping'  },
];

function getFootprintClass(kg: number): { cls: string; label: string } {
  if (kg <= 8)  return { cls: 'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20', label: 'Below average 🌿' };
  if (kg <= 14) return { cls: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'Near average ⚡' };
  return { cls: 'text-red-500 bg-red-500/10 border-red-500/20', label: 'Above average 🔥' };
}

export default function DashboardPage() {
  const { activities, loading } = useActivities();
  const { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary } = useEmissions(activities);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Spinner label="Loading your data..." />
      </div>
    );
  }

  const todayTotal     = getTodayTotal();
  const weeklyTotals   = getWeeklyTotals();
  const breakdown      = getCategoryBreakdown(7);
  const weeklySummary  = getWeeklySummary();
  const { cls: footprintCls, label: footprintLabel } = getFootprintClass(todayTotal);

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pb-24 md:pb-8">
      <DemoBanner />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Score Header ── */}
        <div className="pt-6 pb-4 border-b border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{formattedDate}</p>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>{todayTotal.toFixed(1)}</span>
              <span className="text-[var(--text-muted)] text-sm ml-2">kg CO₂e today</span>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${footprintCls}`}>
              {footprintLabel}
            </div>
          </div>
        </div>

        {/* ── 4 Category Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-5">
          {CATEGORY_CONFIG.map(cat => (
            <div key={cat.key} className="stat-glass">
              <span className="text-xl block mb-2">{cat.emoji}</span>
              <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{breakdown[cat.key].toFixed(1)}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wide">{cat.label} kg</p>
            </div>
          ))}
        </div>

        {/* ── 7-Day Chart ── */}
        <div className="mb-5 liquid-glass p-5">
          <p className="text-[var(--text-muted)] text-xs mb-4 uppercase tracking-wider font-medium">7-day trend</p>
          <EmissionsChart weeklyData={weeklyTotals} categoryBreakdown={breakdown} />
        </div>

        {/* ── Quick Insight Preview ── */}
        <div className="mb-5">
          <div
            className="card p-4 flex items-start gap-3 cursor-pointer"
            onClick={() => navigate('/app/insights')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/app/insights')}
            aria-label="View AI insights"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--accent)', color: 'var(--accent-text)', opacity: 0.9 }}>
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1 font-medium">Gemini AI Insights</p>
              {currentUser?.isAnonymous ? (
                <p className="text-[var(--text-secondary)] text-sm">
                  Sign up to get personalised AI tips based on your footprint data.
                </p>
              ) : (
                <p className="text-[var(--text-secondary)] text-sm">
                  {weeklySummary.total_kg > 0
                    ? `You emitted ${weeklySummary.total_kg.toFixed(1)} kg this week. Tap for AI reduction tips →`
                    : 'Log some activities to get AI-powered insights.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {activities.length === 0 && (
          <div className="mb-5 border border-[var(--accent)]/20 bg-[var(--accent)]/5 rounded-xl p-6 text-center animate-fade-in-up">
            <span className="text-4xl mb-3 block animate-float">🌍</span>
            <h2 className="font-semibold text-lg mb-1 text-[var(--text-primary)]">Start your eco journey</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Log your first activity to see your carbon footprint and get AI insights.
            </p>
            <button
              onClick={() => navigate('/app/log')}
              className="font-semibold text-sm rounded-xl px-5 py-2.5 transition-colors"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              Log First Activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
