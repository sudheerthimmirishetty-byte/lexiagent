import React from 'react';
import { FileText, Download } from 'lucide-react';

export const DocumentViewer = ({ documentName, extractedText, mimeType, fileSize }) => {
  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl gradient-bg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{documentName || 'Document Viewer'}</h3>
            <p className="text-[10px] text-gray-400">
              {mimeType || 'Document'} • {fileSize ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
        {extractedText || 'No text extracted from document.'}
      </div>
    </div>
  );
};
