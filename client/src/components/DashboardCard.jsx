import React from 'react';
import { Layout } from 'lucide-react';

export const DashboardCard = ({ title, subtitle, icon: Icon = Layout, action, children }) => {
  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-brand-500" />}
          {title}
        </h3>
        {action}
      </div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
};
