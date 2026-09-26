import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantClasses = {
    // General
    default: 'bg-slate-100 text-slate-700 border-slate-200/80',
    primary: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-800 border-purple-200/80',
    teal: 'bg-teal-50 text-teal-800 border-teal-200/80',
    dark: 'bg-slate-900 text-slate-100 border-slate-800',

    // Conditions
    Excellent: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Good: 'bg-teal-50 text-teal-800 border-teal-300',
    Fair: 'bg-amber-50 text-amber-800 border-amber-300',
    'Needs Attention': 'bg-orange-50 text-orange-800 border-orange-300',
    Damaged: 'bg-rose-50 text-rose-800 border-rose-300',

    // Attention Levels
    'No Significant Change': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Possible Change': 'bg-amber-50 text-amber-700 border-amber-200',
    'Needs Review': 'bg-rose-50 text-rose-700 border-rose-200',

    // Maintenance / Statuses
    Reported: 'bg-slate-100 text-slate-700 border-slate-200',
    Reviewed: 'bg-teal-50 text-teal-700 border-teal-200',
    Assigned: 'bg-purple-50 text-purple-700 border-purple-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-slate-100 text-slate-600 border-slate-200',

    // Tenancy
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Upcoming: 'bg-teal-50 text-teal-700 border-teal-200',
    'Ending Soon': 'bg-amber-50 text-amber-700 border-amber-200',
    Terminated: 'bg-slate-100 text-slate-700 border-slate-200',

    // Payment
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Late: 'bg-rose-50 text-rose-700 border-rose-200',
    'Partially Paid': 'bg-purple-50 text-purple-700 border-purple-200',

    // Priorities
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-teal-50 text-teal-700 border-teal-200',
    High: 'bg-amber-50 text-amber-700 border-amber-200',
    Urgent: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',

    // Roles
    landlord: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tenant: 'bg-teal-50 text-teal-800 border-teal-200',
    inspector: 'bg-amber-50 text-amber-800 border-amber-200',
    admin: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const dotColor = {
    Excellent: 'bg-emerald-500',
    Good: 'bg-teal-500',
    Fair: 'bg-amber-500',
    'Needs Attention': 'bg-orange-500',
    Damaged: 'bg-rose-500',
    Active: 'bg-emerald-500',
    Upcoming: 'bg-teal-500',
    'Ending Soon': 'bg-amber-500',
    Paid: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Late: 'bg-rose-500',
    primary: 'bg-emerald-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    default: 'bg-slate-400',
  };

  const selectedClass = variantClasses[variant] || variantClasses.default;
  const selectedDot = dotColor[variant] || dotColor.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses[size]} ${selectedClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedDot}`} />}
      {children || variant}
    </span>
  );
};

export default Badge;
