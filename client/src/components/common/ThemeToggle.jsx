import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 interactive focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        isDark
          ? 'bg-dark-800/80 text-dark-200 hover:text-brand-400 hover:bg-dark-700/80 border border-dark-700/60 shadow-inner-dark'
          : 'bg-light-200 text-light-800 hover:text-brand-600 hover:bg-light-300 border border-light-400/80'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-dark-700 transition-transform duration-300" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
