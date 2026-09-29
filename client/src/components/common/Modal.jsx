import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-light-50 dark:bg-dark-900 text-left shadow-card-hover transition-all w-full my-8 ${maxWidth} border border-light-400 dark:border-dark-700/80 animate-fade-in`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-light-300 dark:border-dark-700/70 px-6 py-4 bg-light-100/60 dark:bg-dark-850/60">
            <div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">{title}</h3>
              {subtitle && <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-dark-400 hover:bg-light-200 dark:hover:bg-dark-800 hover:text-dark-600 dark:hover:text-dark-200 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[calc(85vh-120px)] overflow-y-auto text-dark-800 dark:text-dark-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
