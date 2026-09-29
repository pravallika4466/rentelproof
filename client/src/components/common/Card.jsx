import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border transition-all duration-300
        ${
          glass
            ? 'glass-card'
            : 'bg-light-50 dark:bg-dark-850 border-light-400 dark:border-dark-700/80 shadow-sm'
        }
        ${
          hover
            ? 'hover:shadow-card-hover hover:border-brand-500/40 hover:-translate-y-0.5 cursor-pointer'
            : ''
        }
        ${
          glow
            ? 'hover:border-brand-500/50 hover:shadow-emerald-glow'
            : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => (
  <div className={`p-5 sm:p-6 border-b border-light-300 dark:border-dark-700/70 flex items-center justify-between gap-4 ${className}`}>
    <div>
      {title && <h3 className="font-semibold text-dark-900 dark:text-dark-50 text-base sm:text-lg">{title}</h3>}
      {subtitle && <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">{subtitle}</p>}
      {children}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 text-dark-800 dark:text-dark-100 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 border-t border-light-300 dark:border-dark-700/70 bg-light-100/50 dark:bg-dark-900/40 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

export default Card;
