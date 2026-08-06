import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, RefreshCw } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const MessageBubble = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const { success } = useNotification();
  const isUser = message.sender === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    success('Copied message to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${
          isUser ? 'bg-gray-700 dark:bg-gray-600' : 'gradient-bg'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`group relative max-w-2xl rounded-2xl p-4 shadow-sm border text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600 text-white border-brand-500 rounded-tr-none'
            : 'bg-white dark:bg-darkCard text-gray-800 dark:text-gray-200 border-gray-200 dark:border-darkBorder rounded-tl-none'
        }`}
      >
        {!isUser && (
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2 mb-2">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
              LexiAgent AI
              {message.aiResponse?.intent && (
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-[10px] uppercase tracking-wider text-brand-500">
                  {message.aiResponse.intent}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={copyToClipboard}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Copy Response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Regenerate Response"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="whitespace-pre-wrap font-sans">{message.message}</div>

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-2 text-right ${
            isUser ? 'text-brand-100' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
