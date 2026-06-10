interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showLabel?: boolean;
  showValue?: boolean;
  color?: 'leaf' | 'amber' | 'danger' | 'sky';
  size?: 'sm' | 'md' | 'lg';
}

const colorStyles: Record<string, string> = {
  leaf:   'bg-gradient-to-r from-leaf to-leaf-light',
  amber:  'bg-gradient-to-r from-amber to-amber/70',
  danger: 'bg-gradient-to-r from-danger to-danger/70',
  sky:    'bg-gradient-to-r from-sky to-sky-light',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  showValue = false,
  color = 'leaf',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {(showLabel || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {showLabel && (
            <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-[var(--text-muted)] tabular-nums">{value.toFixed(2)} kg</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
