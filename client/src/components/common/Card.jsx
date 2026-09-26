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
        rounded-2xl border border-slate-200/80 bg-white
        ${glass ? 'glass-panel' : 'shadow-sm'}
        ${hover ? 'hover:shadow-card-hover hover:border-slate-300 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? 'hover:border-emerald-500/30 hover:shadow-emerald-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
    <div>
      {title && <h3 className="font-semibold text-slate-900 text-base sm:text-lg">{title}</h3>}
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      {children}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

export default Card;
