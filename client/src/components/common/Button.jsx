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
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-sm hover:shadow-emerald-glow active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-emerald-100 border border-emerald-500/20',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-slate-100 border border-slate-800',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-slate-100',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-rose-100',
    ghost:
      'hover:bg-slate-100 text-slate-700 hover:text-emerald-800 active:scale-[0.98] transition-all duration-200',
    accent:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-sm hover:shadow-amber-glow active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-amber-100 border border-amber-400/20',
    glow:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-glow hover:shadow-lg active:scale-[0.98] transition-all duration-200 focus:ring-4 focus:ring-emerald-200 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </button>
  );
};

export default Button;
