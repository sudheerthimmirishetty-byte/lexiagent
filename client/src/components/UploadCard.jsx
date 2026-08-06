import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';

export const UploadCard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useNotification();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected) => {
    if (!selected) return;

    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = '.' + selected.name.split('.').pop().toLowerCase();

    if (!allowed.includes(ext)) {
      error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      error('File size exceeds maximum limit of 20MB.');
      return;
    }

    setFile(selected);
    if (!documentName) {
      setDocumentName(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      const res = await documentService.uploadDocument(file, documentName, 'Legal Document', (pct) => {
        setProgress(pct);
      });

      success('Document uploaded and parsed successfully!');
      setFile(null);
      setDocumentName('');
      setProgress(0);
      if (onUploadSuccess) onUploadSuccess(res.document);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Upload Legal Document</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        Supports PDF, DOCX, and TXT files up to 20MB. AI will automatically extract clauses and risks.
      </p>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 scale-[0.99]'
              : 'border-gray-300 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-500 mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
            Click to upload or drag & drop file
          </p>
          <p className="text-xs text-gray-400">PDF, DOCX, TXT (MAX 20MB)</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={() => setFile(null)}
                className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Document Display Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Commercial Lease Agreement 2026"
            />
          </div>

          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Uploading & Parsing Text...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-3 rounded-xl gradient-bg font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing Upload...
              </>
            ) : (
              'Start AI Document Pipeline'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
