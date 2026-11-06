import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-full';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-charm-brand text-white shadow-cta hover:bg-charm-brand-hover active:scale-[0.98]',
    secondary:
      'bg-charm-accent text-charm-heading hover:bg-[#E5E6DC] active:scale-[0.98]',
    outline:
      'border border-charm-border bg-charm-panel text-charm-heading hover:bg-[#F2F1ED] active:scale-[0.98]',
    ghost:
      'text-charm-body hover:text-charm-heading hover:bg-black/5 active:scale-[0.98]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

