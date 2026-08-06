import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator = ({ agentName = 'LexiAgent AI Orchestrator' }) => {
  return (
    <div className="flex items-start gap-3 my-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white shrink-0 shadow-md">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-2xl rounded-tl-none p-4 shadow-sm max-w-sm">
        <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mb-1.5 flex items-center gap-1.5">
          {agentName}
        </p>
        <div className="flex items-center gap-1.5 py-1">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};
