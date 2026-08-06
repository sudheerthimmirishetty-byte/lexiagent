import React from 'react';
import { Cpu } from 'lucide-react';

export const FeatureCard = ({ title, description, icon: Icon = Cpu }) => {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-3.5 rounded-2xl bg-brand-500/10 text-brand-500 w-fit mb-5 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};
