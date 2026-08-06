import React from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const RiskCard = ({ risk }) => {
  const { riskType, severity = 'Medium', description, recommendation } = risk;

  const severityStyles = {
    Low: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-500 text-white',
      icon: CheckCircle,
    },
    Medium: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      badge: 'bg-amber-500 text-white',
      icon: Info,
    },
    High: {
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
      badge: 'bg-orange-500 text-white',
      icon: ShieldAlert,
    },
    Critical: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      badge: 'bg-rose-600 text-white',
      icon: AlertOctagon,
    },
  };

  const style = severityStyles[severity] || severityStyles.Medium;
  const Icon = style.icon;

  return (
    <div className={`p-5 rounded-2xl border ${style.bg} transition-all duration-200`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 shrink-0" />
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{riskType}</h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${style.badge}`}>
          {severity} Risk
        </span>
      </div>

      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{description}</p>

      {recommendation && (
        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-800/50 text-xs">
          <span className="font-semibold text-gray-900 dark:text-white">Recommendation: </span>
          <span className="text-gray-600 dark:text-gray-400">{recommendation}</span>
        </div>
      )}
    </div>
  );
};
