import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import GeminiInsights from '../components/Insights/GeminiInsights';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

export default function InsightsPage() {
  const { activities, loading } = useActivities();
  const { getWeeklySummary } = useEmissions(activities);
  const weeklySummary = getWeeklySummary();

  if (loading) {
    return (
      <div className="min-h-screen gradient-leaf-radial flex items-center justify-center">
        <Spinner label="Loading insights..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-leaf-radial">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-2xl">✨</span> AI Insights
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Gemini 2.5 Flash analyses your 7-day data and suggests personalised reductions.
          </p>
        </div>

        {/* Weekly summary context */}
        <Card variant="elevated" className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Data used for analysis (past 7 days)
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total',     value: weeklySummary.total_kg, icon: '📊' },
              { label: 'Transport', value: weeklySummary.transport_kg, icon: '🚗' },
              { label: 'Food',      value: weeklySummary.food_kg, icon: '🍽️' },
              { label: 'Energy',    value: weeklySummary.energy_kg, icon: '⚡' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-[var(--bg-card-hover)]/50 transition-colors hover:bg-[var(--bg-card-hover)]">
                <span className="text-lg block mb-1" aria-hidden="true">{item.icon}</span>
                <dt className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide">{item.label}</dt>
                <dd className="text-lg font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                  {item.value.toFixed(1)}
                  <span className="text-[10px] font-normal text-[var(--text-muted)] ml-0.5">kg</span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* AI Insights */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <GeminiInsights weeklySummary={weeklySummary} />
        </div>
      </div>
    </div>
  );
}
