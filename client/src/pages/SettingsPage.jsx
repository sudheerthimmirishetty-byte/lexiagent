import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Settings, Moon, Sun, Bell, Globe, Trash2, LogOut, ShieldCheck } from 'lucide-react';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { success } = useNotification();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-8 shadow-xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-500" /> Platform Preferences & Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">Customize display mode, notification alerts, and account security.</p>
        </div>

        {/* Theme Setting */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Color Theme</h4>
              <p className="text-[10px] text-gray-400">Current mode: {isDark ? 'Dark Mode (SaaS Glassmorphism)' : 'Light Mode'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl gradient-bg text-xs font-bold text-white shadow-md"
          >
            Toggle {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Language Setting */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Legal Translation Language</h4>
              <p className="text-[10px] text-gray-400">Simplifies clauses in plain English</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200">
            English (US)
          </span>
        </div>

        {/* Notification Settings */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">In-App AI Notifications</h4>
              <p className="text-[10px] text-gray-400">Receive alerts on document processing and risk detection</p>
            </div>
          </div>
          <input
            type="checkbox"
            defaultChecked
            onChange={() => success('Notification preferences updated.')}
            className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
          />
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Account Actions</h4>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out of All Devices
          </button>
        </div>
      </div>
    </div>
  );
};
