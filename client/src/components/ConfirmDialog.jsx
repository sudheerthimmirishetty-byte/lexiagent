import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Delete', isDanger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-2xl ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-500/10 text-brand-500'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-5 py-2.5 rounded-xl font-medium text-white transition-all shadow-md ${
            isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
