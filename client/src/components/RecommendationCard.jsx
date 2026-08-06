import React from 'react';
import { ArrowRightCircle, Check } from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  const { action, reason, priority = 'High' } = recommendation;

  const priorityBadge = {
    High: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm">
      <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 shrink-0 mt-0.5">
        <ArrowRightCircle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h5 className="font-bold text-sm text-gray-900 dark:text-white">{action}</h5>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityBadge[priority] || priorityBadge.High}`}>
            {priority} Priority
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{reason}</p>
      </div>
    </div>
  );
};
