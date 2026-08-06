import React from 'react';
import { Settings, Sliders } from 'lucide-react';

export const SettingsCard = ({ title, description, icon: Icon = Settings, children }) => {
  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-[11px] text-gray-400">{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
