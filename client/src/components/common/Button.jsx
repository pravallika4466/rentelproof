import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-500 hover:to-brand-400 text-white shadow-emerald-glow hover:shadow-emerald-glow-lg active:scale-[0.98] transition-all duration-300 focus:ring-4 focus:ring-brand-500/20 border border-brand-400/30 btn-emerald-glow',
    secondary:
      'bg-dark-800 hover:bg-dark-700 text-dark-100 hover:text-white dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-dark-100 shadow-sm active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-dark-500/20 border border-dark-700 dark:border-dark-600',
    outline:
      'bg-transparent hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-300 dark:border-dark-700 hover:border-brand-500/50 shadow-sm active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-dark-500/20',
    glass:
      'glass-panel hover:border-brand-500/50 text-dark-900 dark:text-dark-50 shadow-sm active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-brand-500/20',
    danger:
      'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-rose-500/20 border border-rose-500/30',
    ghost:
      'hover:bg-dark-100 dark:hover:bg-dark-800/80 text-dark-600 dark:text-dark-300 hover:text-brand-500 dark:hover:text-brand-400 active:scale-[0.98] transition-all duration-200',
    accent:
      'bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white shadow-amber-glow active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-accent-500/20 border border-accent-400/30',
    glow:
      'bg-brand-600 hover:bg-brand-500 text-white shadow-emerald-glow hover:shadow-emerald-glow-lg active:scale-[0.98] transition-all duration-300 focus:ring-4 focus:ring-brand-500/30 font-semibold border border-brand-400/40',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer interactive relative overflow-hidden ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
