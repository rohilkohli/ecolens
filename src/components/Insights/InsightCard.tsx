import type { Insight } from '../../types';
import Badge from '../ui/Badge';
import type { Category } from '../../types';

interface InsightCardProps {
  insight: Insight;
}

const CATEGORY_VARIANT: Record<Category, 'leaf' | 'amber' | 'danger' | 'sky'> = {
  transport: 'sky',
  food:      'amber',
  energy:    'danger',
  shopping:  'leaf',
};

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <article
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 animate-fade-in hover-lift hover-glow transition-all duration-300"
      style={{ boxShadow: 'var(--shadow-card)' }}
      aria-label={`Insight: ${insight.title}`}
    >
      <div className="flex items-start gap-4 mb-3">
        <div
          className="w-12 h-12 gradient-leaf rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          aria-hidden="true"
        >
          <span className="text-2xl">{insight.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">{insight.title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={CATEGORY_VARIANT[insight.category]} size="sm">
              {insight.category}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{insight.description}</p>

      <div className="flex items-center gap-2.5 bg-leaf/5 border border-leaf/10 rounded-xl px-4 py-2.5">
        <div className="w-6 h-6 rounded-full gradient-leaf flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-white" aria-hidden="true">💰</span>
        </div>
        <p className="text-sm font-semibold text-leaf tabular-nums">
          Save ~{insight.saving_kg.toFixed(1)} kg CO₂e/month
        </p>
      </div>
    </article>
  );
}
