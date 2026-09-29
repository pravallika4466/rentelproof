import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div className="p-3 bg-accent-500/10 text-accent-500 rounded-xl shrink-0 border border-accent-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-light-300 dark:border-dark-700/70">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
