import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = 'No items found', description = 'There are no records to display right now.', icon: Icon = FileQuestion, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-darkCard/40">
      <div className="p-4 bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 rounded-2xl mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">{description}</p>
      {actionButton}
    </div>
  );
};
