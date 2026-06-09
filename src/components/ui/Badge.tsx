import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'leaf' | 'amber' | 'danger' | 'sky' | 'earth' | 'neutral';
  size?: 'sm' | 'md';
  icon?: string;
}

const variantStyles: Record<string, string> = {
  leaf:    'bg-leaf/8 text-leaf border border-leaf/15',
  amber:   'bg-amber/8 text-amber border border-amber/15',
  danger:  'bg-danger/8 text-danger border border-danger/15',
  sky:     'bg-sky/8 text-sky border border-sky/15',
  earth:   'bg-earth-light/8 text-earth border border-earth/15',
  neutral: 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  children,
  variant = 'leaf',
  size = 'md',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `.trim()}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
