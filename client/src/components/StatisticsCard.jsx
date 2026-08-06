import React from 'react';
import { Activity } from 'lucide-react';

export const StatisticsCard = ({ title, value, icon: Icon = Activity, color = 'text-brand-500 bg-brand-500/10' }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );
};
