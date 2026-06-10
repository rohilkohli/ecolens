import type { EmissionSummary, Insight } from '../../types';
import { useGemini } from '../../hooks/useGemini';

interface GeminiInsightsProps {
  weeklySummary: EmissionSummary;
}

function SkeletonCard() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 animate-pulse" aria-hidden="true">
      <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
      <div className="h-2 bg-white/7 rounded w-full mb-1" />
      <div className="h-2 bg-white/7 rounded w-3/4 mb-3" />
      <div className="h-5 bg-white/5 rounded-lg w-1/3" />
    </div>
  );
}

function InsightCardDark({ insight }: { insight: Insight }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 flex gap-3 hover:bg-white/[0.06] transition-colors">
      <div className="w-10 h-10 rounded-xl bg-[#2DC878]/15 border border-[#2DC878]/15 flex items-center justify-center flex-shrink-0 text-xl">
        {insight.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white mb-1">{insight.title}</p>
        <p className="text-xs text-white/50 leading-relaxed mb-2">{insight.description}</p>
        <span className="text-[10px] text-[#2DC878] bg-[#2DC878]/10 border border-[#2DC878]/20 rounded-lg px-2 py-0.5 inline-block">
          Save ~{insight.saving_kg} kg/month
        </span>
      </div>
    </div>
  );
}

export default function GeminiInsights({ weeklySummary }: GeminiInsightsProps) {
  const { insights, status, errorMessage, loadInsights } = useGemini();

  const hasNoData = weeklySummary.total_kg === 0;

  return (
    <section aria-labelledby="insights-heading">

      {/* No data */}
      {hasNoData && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl" aria-hidden="true">📊</span>
          </div>
          <p className="text-sm font-medium text-white">Log some activities first</p>
          <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
            Insights are generated based on your actual emission data.
          </p>
        </div>
      )}

      {/* CTA */}
      {!hasNoData && status === 'idle' && (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-2xl bg-[#2DC878]/15 border border-[#2DC878]/20 flex items-center justify-center mx-auto mb-4 animate-float">
            <span className="text-3xl" aria-hidden="true">✨</span>
          </div>
          <p className="text-white/50 text-sm mb-1">
            {weeklySummary.total_kg.toFixed(1)} kg CO₂e logged this week
          </p>
          <p className="text-white/30 text-xs mb-5">Gemini will analyse this and suggest 3 personalised tips</p>
          <button
            onClick={() => loadInsights(weeklySummary)}
            className="bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl px-6 py-3 text-sm hover:bg-[#25B066] transition-colors active:scale-[0.98]"
          >
            ✨ Get personalised tips
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {status === 'loading' && (
        <div className="space-y-3" aria-label="Loading insights" aria-busy="true">
          <div className="flex items-center gap-2 mb-4 p-3 bg-[#2DC878]/8 border border-[#2DC878]/15 rounded-xl">
            <span className="inline-block w-4 h-4 border-2 border-[#2DC878] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-xs text-[#2DC878]">Analysing your emissions with Gemini 2.5 Flash...</p>
          </div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Success */}
      {status === 'success' && insights.length > 0 && (
        <div aria-live="polite">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/25 text-[9px] uppercase tracking-widest">Your personalised tips</p>
            <span className="text-[9px] text-[#2DC878] bg-[#2DC878]/10 border border-[#2DC878]/20 rounded-full px-2 py-0.5">
              Cached 24h
            </span>
          </div>
          <div className="space-y-3 mb-5 stagger-children">
            {insights.map((insight, i) => (
              <InsightCardDark key={i} insight={insight} />
            ))}
          </div>
          <button
            onClick={() => loadInsights(weeklySummary)}
            className="w-full bg-white/[0.04] border border-white/[0.07] text-white/50 rounded-xl py-2.5 text-sm hover:bg-white/[0.07] hover:text-white/70 transition-colors"
          >
            ↻ Refresh insights
          </button>
        </div>
      )}

      {/* Error */}
      {(status === 'error' || status === 'rate_limited') && (
        <div aria-live="polite" className="text-center py-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${status === 'rate_limited' ? 'bg-amber-400/10' : 'bg-red-400/10'}`}>
            <span className="text-2xl" aria-hidden="true">
              {status === 'rate_limited' ? '⏱️' : '⚠️'}
            </span>
          </div>
          <p className="text-sm font-medium text-white mb-1">
            {status === 'rate_limited' ? 'Slow down a little!' : 'Could not load insights'}
          </p>
          <p className="text-xs text-white/40 mb-5 max-w-xs mx-auto">{errorMessage}</p>
          <button
            onClick={() => loadInsights(weeklySummary)}
            className="bg-white/[0.07] border border-white/[0.12] text-white/70 rounded-xl px-5 py-2.5 text-sm hover:bg-white/[0.10] transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
