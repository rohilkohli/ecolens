import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:   'bg-gradient-to-r from-leaf to-leaf-light text-white hover:shadow-lg hover:shadow-leaf/20 active:scale-[0.98]',
  secondary: 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-leaf/30 hover:bg-leaf/5 active:scale-[0.98]',
  outline:   'border-2 border-leaf text-leaf hover:bg-leaf/5 active:scale-[0.98]',
  danger:    'bg-danger text-white hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/20 active:scale-[0.98]',
  ghost:     'text-leaf hover:bg-leaf/5 active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-2 text-sm min-h-9 min-w-9',
  md: 'px-5 py-2.5 text-sm min-h-11 min-w-11',
  lg: 'px-6 py-3.5 text-base min-h-12 min-w-12',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 cursor-pointer
        focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
    >
      {loading && (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
