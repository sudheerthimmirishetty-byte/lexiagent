import React from 'react';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export const AnalysisCard = ({ clause }) => {
  const { title, originalClause, simpleExplanation, importance = 'Medium', riskLevel = 'Low' } = clause;

  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-500" />
          {title || 'Key Clause'}
        </h4>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20">
            {importance} Importance
          </span>
          {riskLevel && riskLevel !== 'Low' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {riskLevel} Risk
            </span>
          )}
        </div>
      </div>

      {originalClause && (
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 font-mono text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
          <p className="font-sans text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Original Text</p>
          "{originalClause}"
        </div>
      )}

      <div className="p-3 rounded-xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 text-xs text-gray-800 dark:text-gray-200">
        <p className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Simple Explanation
        </p>
        <p className="leading-relaxed">{simpleExplanation}</p>
      </div>
    </div>
  );
};
