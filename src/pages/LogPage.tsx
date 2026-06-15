import { useActivities } from '../hooks/useActivities';
import ActivityLogger from '../components/Logger/ActivityLogger';
import ActivityList from '../components/Logger/ActivityList';
import DemoBanner from '../components/auth/DemoBanner';
import Spinner from '../components/ui/Spinner';

export default function LogPage() {
  const { activities, loading, error, addActivity, deleteActivity, reload } = useActivities();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Spinner label="Loading activities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Failed to load activities</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">{error}</p>
          <button
            onClick={reload}
            className="font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pb-24 md:pb-8">
      <DemoBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pt-6 pb-4 border-b border-[var(--border-color)]">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Log Activity</h1>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Record your daily activities to calculate their carbon impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-5">
          {/* Logger form */}
          <div className="animate-fade-in-up">
            <ActivityLogger onAdd={addActivity} />
          </div>

          {/* Activity history */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ActivityList activities={activities} onDelete={deleteActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
