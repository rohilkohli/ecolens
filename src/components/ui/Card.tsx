import type { ReactNode, HTMLAttributes, CSSProperties } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'leaf' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const variantClasses: Record<string, string> = {
  default:  'border transition-all duration-300',
  elevated: 'border transition-all duration-300 hover-lift',
  bordered: 'border-2 transition-all duration-300',
  leaf:     'border transition-all duration-300',
  glass:    'glass transition-all duration-300',
};

const variantInlineStyles: Record<string, CSSProperties> = {
  default:  { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' },
  elevated: { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-elevated)' },
  bordered: { backgroundColor: 'var(--bg-card)', borderColor: 'color-mix(in srgb, var(--color-leaf) 20%, transparent)' },
  leaf:     { backgroundColor: 'var(--color-leaf-pale)', borderColor: 'color-mix(in srgb, var(--color-leaf) 20%, transparent)' },
  glass:    {},
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5 sm:p-6',
  lg:   'p-6 sm:p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  style,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`
        rounded-card
        ${variantClasses[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'hover-lift hover-glow cursor-pointer' : ''}
        ${className}
      `.trim()}
      style={{ ...variantInlineStyles[variant], ...style }}
    >
      {children}
    </div>
  );
}
