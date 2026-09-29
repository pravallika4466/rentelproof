import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700/60 shadow-lg animate-pulse space-y-4">
    <div className="h-4 bg-slate-200/80 dark:bg-dark-800 rounded-lg w-1/3"></div>
    <div className="h-8 bg-slate-200/80 dark:bg-dark-800 rounded-xl w-1/2"></div>
    <div className="h-3 bg-slate-100 dark:bg-dark-800/60 rounded-md w-full"></div>
    <div className="h-3 bg-slate-100 dark:bg-dark-800/60 rounded-md w-4/5"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-dark-700/60 overflow-hidden shadow-lg animate-pulse">
    <div className="h-12 bg-slate-100/80 dark:bg-dark-800/80 border-b border-slate-200/80 dark:border-dark-700/60"></div>
    <div className="p-5 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-4 bg-slate-200/80 dark:bg-dark-800 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-100 dark:bg-dark-800/60 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-100 dark:bg-dark-800/60 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-200/80 dark:bg-dark-800 rounded-md w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export default { CardSkeleton, TableSkeleton };
