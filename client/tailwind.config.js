/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Brand Accent: Emerald / Forest Luxury (ABSOLUTELY ZERO BLUE)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Secondary Warm Metallic Accent: Bronze / Amber (Non-blue)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Obsidian & Graphite Neutral System (Pure charcoal/ash/onyx - ZERO BLUE/SLATE)
        dark: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          850: '#121215',
          900: '#0c0d0f',
          950: '#060708',
        },
        // Warm Ivory / Linen Light Mode System
        light: {
          50: '#ffffff',
          100: '#faf9f5',
          200: '#f4f3ec',
          300: '#ebe9de',
          400: '#dedbcc',
          500: '#c5c1ad',
          600: '#9c9782',
          700: '#736f5c',
          800: '#4e4b3c',
          900: '#2b2921',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.15), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 16px 36px -6px rgba(0, 0, 0, 0.35), 0 6px 14px -2px rgba(0, 0, 0, 0.2)',
        'emerald-glow': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'emerald-glow-lg': '0 0 50px -10px rgba(16, 185, 129, 0.5)',
        'amber-glow': '0 0 30px -5px rgba(245, 158, 11, 0.35)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'inner-dark': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2.8s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.3', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
