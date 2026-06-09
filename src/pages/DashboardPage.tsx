import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import EmissionsSummary from '../components/Dashboard/EmissionsSummary';
import EmissionsChart from '../components/Dashboard/EmissionsChart';
import FootprintScore from '../components/Dashboard/FootprintScore';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { activities, loading, error, reload } = useActivities();
  const { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary } = useEmissions(activities);

  if (loading) {
    return (
      <div className="min-h-screen gradient-leaf-radial flex items-center justify-center">
        <Spinner label="Loading your data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-leaf-radial flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Failed to load data</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">{error}</p>
          <Button variant="primary" onClick={reload}>Retry</Button>
        </div>
      </div>
    );
  }

  const todayTotal = getTodayTotal();
  const weeklyTotals = getWeeklyTotals();
  const categoryBreakdown = getCategoryBreakdown(7);
  const weeklySummary = getWeeklySummary();
  const dailyAverage = weeklySummary.total_kg / 7;

  return (
    <div className="min-h-screen gradient-leaf-radial">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Your Carbon Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Track your personal footprint and work towards a greener lifestyle.
          </p>
        </div>

        {/* Emissions Summary */}
        <div className="mb-6">
          <EmissionsSummary
            todayTotal={todayTotal}
            weeklyTotal={weeklySummary.total_kg}
          />
        </div>

        {/* Footprint Score */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <FootprintScore dailyAverage={dailyAverage} />
        </div>

        {/* Emissions Chart */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <EmissionsChart
            weeklyData={weeklyTotals}
            categoryBreakdown={categoryBreakdown}
          />
        </div>

        {/* Quick actions — empty state */}
        {activities.length === 0 && (
          <div className="gradient-leaf rounded-2xl p-8 text-white text-center animate-fade-in-up shadow-lg shadow-leaf/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
            <div className="relative">
              <span className="text-5xl mb-4 block animate-float" aria-hidden="true">🌍</span>
              <h2 className="text-2xl font-bold mb-2">Start your eco journey today!</h2>
              <p className="text-white/80 text-sm mb-6 max-w-sm mx-auto">
                Log your first activity to see your carbon footprint visualised and get personalised insights.
              </p>
              <Link to="/log">
                <Button variant="secondary" size="lg" className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30">
                  Log Your First Activity
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Top activity */}
        {activities.length > 0 && (
          <div className="mt-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 animate-fade-in hover-lift" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg" aria-hidden="true">🔝</span>
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  Highest Single Activity (7 days)
                </h2>
                <p className="text-base font-bold text-[var(--text-primary)] mt-0.5">{weeklySummary.top_activity}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
