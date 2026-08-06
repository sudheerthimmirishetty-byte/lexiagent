import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const NotificationCard = ({ notification, onMarkRead }) => {
  if (!notification) return null;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
        notification.isRead
          ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-75'
          : 'bg-white dark:bg-darkCard border-brand-500/30 shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 shrink-0 mt-0.5">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{notification.title}</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{notification.message}</p>
          <span className="text-[10px] text-gray-400 mt-2 block">
            {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Just now'}
          </span>
        </div>
      </div>

      {!notification.isRead && onMarkRead && (
        <button
          onClick={() => onMarkRead(notification._id)}
          className="p-1 rounded-lg text-brand-500 hover:bg-brand-500/10 text-xs font-bold shrink-0"
          title="Mark as read"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
