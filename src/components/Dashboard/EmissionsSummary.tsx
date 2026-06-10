import Card from '../ui/Card';

interface EmissionsSummaryProps {
  todayTotal: number;
  weeklyTotal: number;
}

export default function EmissionsSummary({ todayTotal, weeklyTotal }: EmissionsSummaryProps) {
  const formattedToday = todayTotal.toFixed(2);
  const formattedWeekly = weeklyTotal.toFixed(2);

  return (
    <section aria-labelledby="emissions-summary-heading">
      <h2 id="emissions-summary-heading" className="sr-only">Emissions Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
        {/* Today card */}
        <Card variant="elevated">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Today's Emissions</p>
              <p className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tabular-nums">
                {formattedToday}
                <span className="text-base font-normal text-[var(--text-muted)] ml-1.5">kg CO₂e</span>
              </p>
            </div>
            <div className="w-12 h-12 gradient-leaf rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" aria-hidden="true">
              <span className="text-xl">📅</span>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[var(--bg-card-hover)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-leaf to-leaf-light transition-all duration-700"
              style={{ width: `${Math.min((todayTotal / 11) * 100, 100)}%` }}
            />
          </div>
        </Card>

        {/* Weekly card */}
        <Card variant="elevated">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">7-Day Total</p>
              <p className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tabular-nums">
                {formattedWeekly}
                <span className="text-base font-normal text-[var(--text-muted)] ml-1.5">kg CO₂e</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-light/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-sky/10" aria-hidden="true">
              <span className="text-xl">📈</span>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[var(--bg-card-hover)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky to-sky-light transition-all duration-700"
              style={{ width: `${Math.min((weeklyTotal / 77) * 100, 100)}%` }}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
