import React, { useState, useEffect } from 'react';
import { Copy, Download, Edit3, Check, FileCheck, Sparkles, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const DraftEditor = ({ initialDraft = '', title = 'Legal Draft', onSave }) => {
  const [content, setContent] = useState(initialDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success } = useNotification();

  useEffect(() => {
    setContent(initialDraft);
  }, [initialDraft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    success('Legal draft copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    success('Draft downloaded as text document');
  };

  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl shadow-xl overflow-hidden">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-500" />
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Autonomous AI Legal Draft Output</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-brand-500" />
            {isEditing ? 'Preview Mode' : 'Edit Content'}
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-brand-500" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl gradient-bg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="w-full font-mono text-xs leading-relaxed p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        ) : (
          <div className="p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 max-h-[600px] overflow-y-auto">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
