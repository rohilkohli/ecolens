import { useActivities } from '../hooks/useActivities';
import ActivityLogger from '../components/Logger/ActivityLogger';
import ActivityList from '../components/Logger/ActivityList';
import DemoBanner from '../components/auth/DemoBanner';
import Spinner from '../components/ui/Spinner';

export default function LogPage() {
  const { activities, loading, error, addActivity, deleteActivity, reload } = useActivities();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <Spinner label="Loading activities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-400/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-sm text-white font-medium mb-2">Failed to load activities</p>
          <p className="text-xs text-white/40 mb-4">{error}</p>
          <button
            onClick={reload}
            className="bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-[#25B066] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
      <DemoBanner />

      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/[0.07]">
        <h1 className="text-xl font-semibold text-white">Log Activity</h1>
        <p className="text-white/40 text-xs mt-1">
          Record your daily activities to calculate their carbon impact.
        </p>
      </div>

      <div className="px-4 pt-4">
        {/* Logger form */}
        <div className="mb-6 animate-fade-in-up">
          <ActivityLogger onAdd={addActivity} />
        </div>

        {/* Activity history */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ActivityList activities={activities} onDelete={deleteActivity} />
        </div>
      </div>
    </div>
  );
}
