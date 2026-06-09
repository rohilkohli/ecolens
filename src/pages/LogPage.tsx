import { useActivities } from '../hooks/useActivities';
import ActivityLogger from '../components/Logger/ActivityLogger';
import ActivityList from '../components/Logger/ActivityList';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function LogPage() {
  const { activities, loading, error, addActivity, deleteActivity, reload } = useActivities();

  if (loading) {
    return (
      <div className="min-h-screen gradient-leaf-radial flex items-center justify-center">
        <Spinner label="Loading activities..." />
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
          <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Failed to load activities</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">{error}</p>
          <Button variant="primary" onClick={reload}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-leaf-radial">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Log an Activity
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Record your daily activities to calculate their carbon impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logger form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ActivityLogger onAdd={addActivity} />
          </div>

          {/* Activity history */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ActivityList activities={activities} onDelete={deleteActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
