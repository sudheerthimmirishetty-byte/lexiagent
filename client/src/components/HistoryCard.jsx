import React from 'react';
import { History, FileText, ArrowRight } from 'lucide-react';

export const HistoryCard = ({ item, type, onClick }) => {
  if (!item) return null;

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm hover:shadow-lg hover:border-brand-500/50 cursor-pointer transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="truncate">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
            {item.title || item.documentName || 'History Record'}
          </h4>
          <p className="text-[10px] text-gray-400">
            {type || item.documentType || 'Legal Entry'} • {new Date(item.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-brand-500 shrink-0 group-hover:translate-x-1 transition-transform" />
    </div>
  );
};
