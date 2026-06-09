interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md', label = 'Loading...', fullScreen = false }: SpinnerProps) {
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3"
    >
      <div
        className={`
          ${sizeStyles[size]} rounded-full
          border-leaf/20 border-t-leaf
          animate-spin
        `}
        aria-hidden="true"
      />
      <span className="text-sm text-[var(--text-muted)] font-medium">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
}
