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
  { key: 'energy'   as const, emoji: '⚡',  label: 'Energy'    },
  { key: 'shopping' as const, emoji: '🛍️', label: 'Shopping'  },
];

function getFootprintClass(kg: number): { cls: string; label: string } {
  if (kg <= 8)  return { cls: 'text-[#2DC878] bg-[#2DC878]/10 border-[#2DC878]/20', label: 'Below average' };
  if (kg <= 14) return { cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Near average' };
  return { cls: 'text-red-400 bg-red-400/10 border-red-400/20', label: 'Above average' };
}

export default function DashboardPage() {
  const { activities, loading } = useActivities();
  const { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary } = useEmissions(activities);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
      <DemoBanner />

      {/* ── Score Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.07]">
        <p className="text-white/40 text-xs mb-1">{formattedDate}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold text-[#2DC878]">{todayTotal.toFixed(1)}</span>
            <span className="text-white/40 text-sm ml-1.5">kg CO₂e today</span>
          </div>
          <div className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${footprintCls}`}>
            {footprintLabel}
          </div>
        </div>
      </div>

      {/* ── 4 Category Stat Cards ── */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {CATEGORY_CONFIG.map(cat => (
          <div
            key={cat.key}
            className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 hover:bg-white/[0.06] transition-colors"
          >
            <div className="text-xl mb-1.5">{cat.emoji}</div>
            <p className="text-xl font-bold text-white tabular-nums">{breakdown[cat.key].toFixed(1)}</p>
            <p className="text-[9px] text-white/35 mt-0.5 uppercase tracking-wide">{cat.label} kg CO₂e</p>
          </div>
        ))}
      </div>

      {/* ── 7-Day Chart ── */}
      <div className="mx-4 mb-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
        <p className="text-white/40 text-[10px] mb-3 uppercase tracking-wider">7-day trend</p>
        <EmissionsChart weeklyData={weeklyTotals} categoryBreakdown={breakdown} />
      </div>

      {/* ── Quick Insight Preview ── */}
      <div className="mx-4 mb-4">
        <div
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-white/[0.05] transition-colors"
          onClick={() => navigate('/app/insights')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/app/insights')}
          aria-label="View AI insights"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2DC878]/15 border border-[#2DC878]/20 flex items-center justify-center text-xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1">Gemini AI</p>
            {currentUser?.isAnonymous ? (
              <p className="text-white/60 text-xs leading-relaxed">
                Sign up to get personalised AI tips based on your footprint data.
              </p>
            ) : (
              <p className="text-white/60 text-xs leading-relaxed">
                {weeklySummary.total_kg > 0
                  ? `You emitted ${weeklySummary.total_kg.toFixed(1)} kg this week. Tap for AI reduction tips.`
                  : 'Log some activities to get AI-powered insights.'}
              </p>
            )}
          </div>
          <span className="text-white/25 text-sm ml-1">→</span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {activities.length === 0 && (
        <div className="mx-4 mb-4 bg-[#2DC878]/8 border border-[#2DC878]/15 rounded-xl p-6 text-center animate-fade-in-up">
          <span className="text-4xl mb-3 block animate-float">🌍</span>
          <h2 className="text-white font-semibold mb-1">Start your eco journey</h2>
          <p className="text-white/40 text-xs mb-4 leading-relaxed">
            Log your first activity to see your carbon footprint and get AI insights.
          </p>
          <button
            onClick={() => navigate('/app/log')}
            className="bg-[#2DC878] text-[#0B1A12] font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-[#25B066] transition-colors"
          >
            Log first activity
          </button>
        </div>
      )}
    </div>
  );
}
