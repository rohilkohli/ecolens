import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import { useAuth } from '../context/AuthContext';
import GeminiInsights from '../components/Insights/GeminiInsights';
import DemoBanner from '../components/auth/DemoBanner';
import UpsellModal from '../components/auth/UpsellModal';
import Spinner from '../components/ui/Spinner';

export default function InsightsPage() {
  const { activities, loading } = useActivities();
  const { getWeeklySummary } = useEmissions(activities);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [modalDismissed, setModalDismissed] = useState(false);

  const isAnonymous = currentUser?.isAnonymous ?? false;
  const weeklySummary = getWeeklySummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <Spinner label="Loading insights..." />
      </div>
    );
  }

  // Anonymous: show upsell gate
  if (isAnonymous && !modalDismissed) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
        <DemoBanner />
        {/* Blurred background content */}
        <div className="opacity-20 pointer-events-none px-4 pt-6">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            ✨ AI Insights
          </h1>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 mb-3">
              <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-2 bg-white/7 rounded w-full mb-1" />
              <div className="h-2 bg-white/7 rounded w-3/4" />
            </div>
          ))}
        </div>
        <UpsellModal onDismiss={() => setModalDismissed(true)} />
      </div>
    );
  }

  // Dismissed modal — show soft upsell inline
  if (isAnonymous && modalDismissed) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
        <DemoBanner />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#2DC878]/15 flex items-center justify-center text-3xl mb-4">🤖</div>
          <h1 className="text-lg font-semibold text-white mb-2">AI insights need an account</h1>
          <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-xs">
            Create a free account to get Gemini AI-powered tips personalised to your actual footprint data.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full max-w-xs bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl py-3 mb-3 hover:bg-[#25B066] transition-colors"
          >
            Create free account
          </button>
          <button
            onClick={() => navigate('/app')}
            className="text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/[0.07]">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>✨</span> AI Insights
        </h1>
        <p className="text-white/40 text-xs mt-1">
          Gemini 2.5 Flash analyses your 7-day data and suggests reductions
        </p>
      </div>

      {/* Weekly data summary */}
      <div className="px-4 pt-4 pb-0">
        <p className="text-white/25 text-[9px] uppercase tracking-widest mb-3">Data used for analysis</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total',      value: weeklySummary.total_kg,     icon: '📊' },
            { label: 'Transport',  value: weeklySummary.transport_kg,  icon: '🚗' },
            { label: 'Food',       value: weeklySummary.food_kg,       icon: '🍽️' },
            { label: 'Energy',     value: weeklySummary.energy_kg,     icon: '⚡' },
          ].map(item => (
            <div
              key={item.label}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-2.5 text-center"
            >
              <span className="text-base block mb-1">{item.icon}</span>
              <p className="text-white font-bold text-sm tabular-nums">{item.value.toFixed(1)}</p>
              <p className="text-white/30 text-[8px] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights component */}
      <div className="px-4 pb-4">
        <GeminiInsights weeklySummary={weeklySummary} />
      </div>
    </div>
  );
}
