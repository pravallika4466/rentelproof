import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CinematicLoader = ({ message = 'Securing Evidence Platform...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Cinematic Geometric Shield Mark */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        {/* Outer Orbiting Aura */}
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/30 animate-spin-slow" />
        <div className="absolute inset-1 rounded-2xl border border-brand-400/20 animate-pulse" />
        
        {/* Glow backdrop */}
        <div className="absolute w-12 h-12 bg-brand-500/20 rounded-full blur-xl animate-glow" />

        {/* Center Shield Core */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-dark-900 border border-brand-500/50 flex items-center justify-center shadow-emerald-glow">
          <ShieldCheck className="w-6 h-6 text-brand-400 animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold tracking-wider uppercase text-brand-400 mb-1">
        RentalProof
      </h3>

      {/* Dynamic Status / Message */}
      <p className="text-xs text-dark-300 dark:text-dark-400 font-mono tracking-tight animate-pulse">
        {message}
      </p>

      {/* Progress Bar Line */}
      <div className="w-36 h-1 mt-4 bg-dark-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-brand-600 via-brand-400 to-accent-500 animate-shimmer bg-[length:200%_100%]" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-[220px]">
      {content}
    </div>
  );
};

export const SkeletonCard = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-6 glass-card relative overflow-hidden space-y-4"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-brand-500/5 to-transparent" />
          
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-dark-200 dark:bg-dark-800 rounded-md animate-pulse" />
            <div className="h-6 w-16 bg-brand-500/10 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-40 bg-dark-300 dark:bg-dark-700 rounded-lg animate-pulse" />
          <div className="h-20 w-full bg-dark-100 dark:bg-dark-800/60 rounded-xl animate-pulse" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-20 bg-dark-200 dark:bg-dark-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-dark-200 dark:bg-dark-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CinematicLoader;
