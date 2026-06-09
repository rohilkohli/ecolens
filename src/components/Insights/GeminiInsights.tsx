import type { EmissionSummary } from '../../types';
import { useGemini } from '../../hooks/useGemini';
import InsightCard from './InsightCard';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface GeminiInsightsProps {
  weeklySummary: EmissionSummary;
}

function SkeletonCard() {
  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5"
      aria-hidden="true"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 bg-[var(--bg-card-hover)] rounded-xl flex-shrink-0 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--bg-card-hover)] rounded-lg w-3/4 animate-pulse" />
          <div className="h-3 bg-[var(--bg-card-hover)] rounded-lg w-1/3 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-[var(--bg-card-hover)] rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-3 bg-[var(--bg-card-hover)] rounded-lg w-5/6 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="h-3 bg-[var(--bg-card-hover)] rounded-lg w-4/6 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <div className="h-10 bg-[var(--bg-card-hover)] rounded-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}

export default function GeminiInsights({ weeklySummary }: GeminiInsightsProps) {
  const { insights, status, errorMessage, loadInsights } = useGemini();

  const hasNoData = weeklySummary.total_kg === 0;

  return (
    <section aria-labelledby="insights-heading">
      <Card variant="elevated">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 id="insights-heading" className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">✨</span>
              AI-Powered Insights
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Personalised tips from Gemini 2.5 Flash based on your 7-day data
            </p>
          </div>
          {status === 'success' && (
            <span className="text-[10px] font-semibold text-leaf uppercase tracking-wide bg-leaf/5 border border-leaf/15 px-2.5 py-1 rounded-full">
              Cached 24h
            </span>
          )}
        </div>

        {/* No data state */}
        {hasNoData && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-hover)] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl" aria-hidden="true">📊</span>
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Log some activities first</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
              Insights are generated based on your actual emission data.
            </p>
          </div>
        )}

        {/* CTA */}
        {!hasNoData && status === 'idle' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl gradient-leaf flex items-center justify-center mx-auto mb-5 shadow-lg shadow-leaf/20 animate-float">
              <span className="text-3xl" aria-hidden="true">✨</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-sm mx-auto">
              Get personalised reduction tips based on your{' '}
              <strong className="text-[var(--text-primary)]">{weeklySummary.total_kg.toFixed(2)} kg CO₂e</strong> this week.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => loadInsights(weeklySummary)}
            >
              <span aria-hidden="true">✨</span>
              Get Personalised Tips
            </Button>
          </div>
        )}

        {/* Loading skeletons */}
        {status === 'loading' && (
          <div
            className="space-y-4"
            aria-label="Loading insights"
            aria-busy="true"
          >
            <div className="flex items-center gap-3 mb-5 p-3 bg-leaf/5 rounded-xl border border-leaf/10">
              <span className="inline-block w-5 h-5 border-2 border-leaf border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <p className="text-sm text-leaf font-medium">Analysing your emissions with Gemini...</p>
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Success: insights */}
        {status === 'success' && insights.length > 0 && (
          <div aria-live="polite" aria-atomic="false">
            <div className="space-y-4 mb-6 stagger-children">
              {insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => loadInsights(weeklySummary)}
              className="w-full"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh Insights
            </Button>
          </div>
        )}

        {/* Error state */}
        {(status === 'error' || status === 'rate_limited') && (
          <div aria-live="polite" className="text-center py-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${status === 'rate_limited' ? 'bg-amber/10' : 'bg-danger/10'}`}>
              <span className="text-2xl" aria-hidden="true">
                {status === 'rate_limited' ? '⏱️' : '⚠️'}
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              {status === 'rate_limited' ? 'Slow down a little!' : 'Could not load insights'}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-5 max-w-sm mx-auto">{errorMessage}</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => loadInsights(weeklySummary)}
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
