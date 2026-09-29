import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantClasses = {
    // General
    default: 'bg-dark-100 text-dark-700 border-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:border-dark-700',
    primary: 'bg-brand-500/10 text-brand-700 border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300 dark:border-brand-500/40',
    success: 'bg-brand-500/10 text-brand-700 border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300 dark:border-brand-500/40',
    warning: 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    danger: 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40',
    purple: 'bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/40',
    teal: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    dark: 'bg-dark-900 text-dark-100 border-dark-700 dark:bg-dark-950 dark:text-dark-50 dark:border-dark-800',

    // Conditions
    Excellent: 'bg-brand-500/15 text-brand-700 border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/50',
    Good: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    Fair: 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    'Needs Attention': 'bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/40',
    Damaged: 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40',

    // Attention Levels
    'No Significant Change': 'bg-brand-500/10 text-brand-700 border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300 dark:border-brand-500/40',
    'Possible Change': 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    'Needs Review': 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40',

    // Maintenance / Statuses
    Reported: 'bg-dark-100 text-dark-700 border-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:border-dark-700',
    Reviewed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    Assigned: 'bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/40',
    'In Progress': 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    Completed: 'bg-brand-500/15 text-brand-700 border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/50',
    Cancelled: 'bg-dark-100 text-dark-500 border-dark-300 dark:bg-dark-800 dark:text-dark-400 dark:border-dark-700',

    // Tenancy
    Active: 'bg-brand-500/15 text-brand-700 border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/50',
    Upcoming: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    'Ending Soon': 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    Terminated: 'bg-dark-100 text-dark-600 border-dark-300 dark:bg-dark-800 dark:text-dark-400 dark:border-dark-700',

    // Payment
    Paid: 'bg-brand-500/15 text-brand-700 border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/50',
    Pending: 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    Late: 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40',
    'Partially Paid': 'bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/40',

    // Priorities
    Low: 'bg-dark-100 text-dark-700 border-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:border-dark-700',
    Medium: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    High: 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    Urgent: 'bg-rose-500/15 text-rose-700 border-rose-500/40 dark:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/50 animate-pulse',

    // Roles
    landlord: 'bg-brand-500/15 text-brand-700 border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/50',
    tenant: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    inspector: 'bg-accent-500/10 text-accent-700 border-accent-500/30 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40',
    admin: 'bg-purple-500/15 text-purple-700 border-purple-500/40 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/50',
  };

  const dotColor = {
    Excellent: 'bg-brand-500',
    Good: 'bg-emerald-500',
    Fair: 'bg-accent-500',
    'Needs Attention': 'bg-orange-500',
    Damaged: 'bg-rose-500',
    Active: 'bg-brand-500',
    Upcoming: 'bg-emerald-500',
    'Ending Soon': 'bg-accent-500',
    Paid: 'bg-brand-500',
    Pending: 'bg-accent-500',
    Late: 'bg-rose-500',
    primary: 'bg-brand-500',
    success: 'bg-brand-500',
    warning: 'bg-accent-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    default: 'bg-dark-400',
  };

  const selectedClass = variantClasses[variant] || variantClasses.default;
  const selectedDot = dotColor[variant] || dotColor.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-colors duration-200 ${sizeClasses[size]} ${selectedClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-sm ${selectedDot}`} />}
      {children || variant}
    </span>
  );
};

export default Badge;
