import type { Challenge } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Category } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onToggle: (id: string) => void;
}

const CATEGORY_CONFIG: Record<Category, { icon: string; variant: 'leaf' | 'amber' | 'danger' | 'sky'; gradient: string }> = {
  transport: { icon: '🚗', variant: 'sky',    gradient: 'from-sky to-sky-light' },
  food:      { icon: '🍽️', variant: 'amber',  gradient: 'from-amber to-amber/80' },
  energy:    { icon: '⚡',  variant: 'danger', gradient: 'from-danger to-danger/80' },
  shopping:  { icon: '🛍️', variant: 'leaf',   gradient: 'from-leaf to-leaf-light' },
};

export default function ChallengeCard({ challenge, onToggle }: ChallengeCardProps) {
  const config = CATEGORY_CONFIG[challenge.category];

  return (
    <article
      className={`
        rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden
        ${challenge.completed
          ? 'bg-leaf/5 border-leaf/20'
          : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-leaf/20 hover-lift hover-glow'
        }
      `}
      style={{ boxShadow: challenge.completed ? 'none' : 'var(--shadow-card)' }}
      aria-label={`Challenge: ${challenge.title}${challenge.completed ? ' (completed)' : ''}`}
    >
      {/* Completed overlay pattern */}
      {challenge.completed && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full gradient-leaf flex items-center justify-center shadow-sm animate-bounce-in" aria-hidden="true">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            challenge.completed
              ? 'bg-leaf/10'
              : `bg-gradient-to-br ${config.gradient} shadow-sm`
          }`}
          aria-hidden="true"
        >
          <span className={`text-lg ${challenge.completed ? '' : 'brightness-0 invert'}`}>{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3
            className={`text-sm font-semibold leading-snug ${
              challenge.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
            }`}
          >
            {challenge.title}
            {challenge.completed && <span className="sr-only"> (completed)</span>}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={config.variant} size="sm">{challenge.category}</Badge>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">{challenge.duration_days}d</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">{challenge.description}</p>

      {/* Saving + CTA */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-leaf/5 px-3 py-1.5 rounded-lg">
          <span className="text-xs" aria-hidden="true">💚</span>
          <span className="text-xs font-semibold text-leaf tabular-nums">
            ~{challenge.estimated_saving_kg} kg CO₂e
          </span>
        </div>

        <Button
          variant={challenge.completed ? 'ghost' : 'primary'}
          size="sm"
          onClick={() => onToggle(challenge.id)}
          disabled={challenge.completed}
          aria-label={
            challenge.completed
              ? `${challenge.title} — already completed`
              : `Mark ${challenge.title} as complete`
          }
          className={challenge.completed ? 'cursor-default opacity-60' : ''}
        >
          {challenge.completed ? (
            <span className="text-xs">Completed</span>
          ) : (
            <>
              <span className="text-xs" aria-hidden="true">🎯</span>
              <span className="text-xs">Take Challenge</span>
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
