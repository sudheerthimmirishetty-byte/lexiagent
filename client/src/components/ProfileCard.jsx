import React from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

export const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-black shadow-lg">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{user.name || 'User Name'}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> {user.role || 'Verified Account'}
          </span>
        </div>
      </div>

      {user.bio && (
        <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
          {user.bio}
        </p>
      )}

      {user.phone && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Phone className="w-4 h-4 text-brand-500" />
          <span>{user.phone}</span>
        </div>
      )}
    </div>
  );
};
