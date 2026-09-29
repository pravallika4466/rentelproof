import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-light-50 dark:bg-dark-900/60 rounded-2xl border border-dashed border-light-400 dark:border-dark-700/80">
      {Icon && (
        <div className="p-4 bg-brand-500/10 text-brand-500 dark:text-brand-400 rounded-2xl mb-4 border border-brand-500/20 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-semibold text-dark-900 dark:text-dark-100">{title}</h3>
      <p className="text-sm text-dark-500 dark:text-dark-400 mt-1 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
