import type { Activity, Category } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void | Promise<void>;
}

const CATEGORY_CONFIG: Record<Category, { icon: string; variant: 'leaf' | 'amber' | 'danger' | 'sky'; gradient: string }> = {
  transport: { icon: '🚗', variant: 'sky',    gradient: 'from-sky to-sky-light' },
  food:      { icon: '🍽️', variant: 'amber',  gradient: 'from-amber to-amber/80' },
  energy:    { icon: '⚡',  variant: 'danger', gradient: 'from-danger to-danger/80' },
  shopping:  { icon: '🛍️', variant: 'leaf',   gradient: 'from-leaf to-leaf-light' },
};

function getSubTypeLabel(subType: string): string {
  return subType
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ActivityList({ activities, onDelete }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card variant="elevated">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-leaf/5 flex items-center justify-center mb-5">
            <span className="text-4xl animate-float" aria-hidden="true">🌱</span>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No activities yet</h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Start logging your daily activities to track your carbon footprint.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <section aria-label="Activity history">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          Recent Activities
        </h3>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-card-hover)] px-2.5 py-1 rounded-full">
          {activities.length} logged
        </span>
      </div>
      <ul className="space-y-3 stagger-children" role="list">
        {activities.map(activity => {
          const config = CATEGORY_CONFIG[activity.category];
          return (
            <li
              key={activity.id}
              className="flex items-start gap-3 p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]
                         hover:border-leaf/20 hover:shadow-sm transition-all duration-200"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {/* Category icon */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}
                aria-hidden="true"
              >
                <span className="text-lg brightness-0 invert">{config.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {getSubTypeLabel(activity.subType)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {activity.quantity} {activity.unit}
                      {activity.note && ` · ${activity.note}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-leaf whitespace-nowrap tabular-nums">
                      {activity.co2e_kg.toFixed(3)} kg
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={config.variant} size="sm">
                      {activity.category}
                    </Badge>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {formatDate(activity.timestamp)} · {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(activity.id)}
                    aria-label={`Delete ${getSubTypeLabel(activity.subType)} activity`}
                    className="!p-1.5 !min-w-0 !min-h-0 text-[var(--text-muted)] hover:text-danger hover:bg-danger/5 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
