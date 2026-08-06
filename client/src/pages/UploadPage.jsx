import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCard } from '../components/UploadCard';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import { FileText, ArrowRight, Trash2, Sparkles, ShieldCheck } from 'lucide-react';

export const UploadPage = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      setDocuments(res.documents || []);
    } catch (err) {}
  };

  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    navigate(`/document/${newDoc._id}`);
  };

  const handleDeleteDoc = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      success('Document removed.');
    } catch (err) {
      error('Failed to delete document.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Legal Document Pipeline</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Upload PDF, DOCX, or TXT agreements. LexiAgent AI extracts clauses, identifies financial & liability risks, and provides actionable recommendations.
        </p>
      </div>

      {/* Upload Component */}
      <UploadCard onUploadSuccess={handleUploadSuccess} />

      {/* Uploaded Documents List */}
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" /> Uploaded Legal Library ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No documents uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 hover:border-brand-500/50 transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{doc.documentName}</h4>
                    <p className="text-[10px] text-gray-400">
                      {doc.documentType} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/document/${doc._id}`)}
                    className="px-3.5 py-2 rounded-xl gradient-bg text-xs font-bold text-white flex items-center gap-1 shadow-md hover:opacity-95"
                  >
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(doc._id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
