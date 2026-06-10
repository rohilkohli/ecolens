import Card from '../ui/Card';

interface FootprintScoreProps {
  dailyAverage: number;
}

const GLOBAL_AVERAGE_KG_DAY = 11;

function getScoreConfig(avg: number) {
  if (avg <= 8) {
    return {
      label: 'Below average',
      icon: '🌿',
      gradient: 'from-leaf to-leaf-light',
      textColor: 'text-leaf',
      bgColor: 'bg-leaf/5',
      borderColor: 'border-leaf/20',
      percentage: (avg / GLOBAL_AVERAGE_KG_DAY) * 100,
    };
  } else if (avg <= 14) {
    return {
      label: 'Near average',
      icon: '⚡',
      gradient: 'from-amber to-amber/80',
      textColor: 'text-amber',
      bgColor: 'bg-amber/5',
      borderColor: 'border-amber/20',
      percentage: (avg / GLOBAL_AVERAGE_KG_DAY) * 100,
    };
  } else {
    return {
      label: 'Above average',
      icon: '🔥',
      gradient: 'from-danger to-danger/80',
      textColor: 'text-danger',
      bgColor: 'bg-danger/5',
      borderColor: 'border-danger/20',
      percentage: Math.min((avg / GLOBAL_AVERAGE_KG_DAY) * 100, 150),
    };
  }
}

export default function FootprintScore({ dailyAverage }: FootprintScoreProps) {
  const score = getScoreConfig(dailyAverage);
  const clampedPct = Math.min(score.percentage, 100);

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Your Footprint Score</h3>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-card-hover)] px-2.5 py-1 rounded-full">vs global avg</span>
      </div>

      <div className={`rounded-2xl p-5 border ${score.bgColor} ${score.borderColor} mb-5 transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${score.gradient} flex items-center justify-center shadow-sm`}>
            <span className="text-2xl" aria-hidden="true">{score.icon}</span>
          </div>
          <div>
            <p className={`text-xl font-bold ${score.textColor}`}>
              {score.label}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Daily average: <strong className="tabular-nums">{dailyAverage.toFixed(2)} kg CO₂e</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Visual gauge */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>0 kg/day</span>
          <span className="font-medium text-leaf">Global avg: {GLOBAL_AVERAGE_KG_DAY} kg/day</span>
          <span>22+ kg/day</span>
        </div>
        <div
          className="relative h-3 rounded-full overflow-hidden"
          style={{ background: 'linear-gradient(to right, var(--color-leaf-light), var(--color-amber), var(--color-danger))' }}
          role="meter"
          aria-valuenow={dailyAverage}
          aria-valuemin={0}
          aria-valuemax={22}
          aria-label={`Daily average ${dailyAverage.toFixed(2)} kg CO₂e — ${score.label}`}
        >
          {/* User indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--bg-card)] border-2 border-[var(--text-primary)] rounded-full shadow-md transition-all duration-700"
            style={{ left: `calc(${Math.min(clampedPct * 0.91, 91)}% - 8px)` }}
            aria-hidden="true"
          />
          {/* Global average marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[var(--bg-card)]"
            style={{ left: `${(GLOBAL_AVERAGE_KG_DAY / 22) * 100}%` }}
            aria-hidden="true"
          />
        </div>

        <p className="text-xs text-[var(--text-muted)] text-center">
          {dailyAverage < GLOBAL_AVERAGE_KG_DAY
            ? `You emit ${(GLOBAL_AVERAGE_KG_DAY - dailyAverage).toFixed(2)} kg less than the global average per day 🎉`
            : `You emit ${(dailyAverage - GLOBAL_AVERAGE_KG_DAY).toFixed(2)} kg more than the global average per day`
          }
        </p>
      </div>
    </Card>
  );
}
