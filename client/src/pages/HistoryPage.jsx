import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { draftService } from '../services/draftService';
import { chatService } from '../services/chatService';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileText, FileSpreadsheet, MessageSquare, History, ArrowRight, Trash2 } from 'lucide-react';

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([documentService.getDocuments(), draftService.getDrafts(), chatService.getConversations()])
      .then(([docRes, draftRes, chatRes]) => {
        setDocuments(docRes.documents || []);
        setDrafts(draftRes.drafts || []);
        setConversations(chatRes.conversations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="large" text="Loading complete case history..." />;

  const filteredDocs = documents.filter((d) => d.documentName.toLowerCase().includes(search.toLowerCase()));
  const filteredDrafts = drafts.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
  const filteredChats = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-7 h-7 text-brand-500" /> Case & Document History
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Review past document analyses, generated legal drafts, and AI legal chat sessions.
          </p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search history..." />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'documents' ? 'gradient-bg text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Document History ({filteredDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'drafts' ? 'gradient-bg text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Draft History ({filteredDrafts.length})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'chats' ? 'gradient-bg text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Chat Consultations ({filteredChats.length})
        </button>
      </div>

      {/* Document History */}
      {activeTab === 'documents' && (
        filteredDocs.length === 0 ? (
          <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Document Analyses Found</h4>
            <p className="text-xs text-gray-400">Upload a legal document to inspect clauses and risk auditing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc._id}
                onClick={() => navigate(`/document/${doc._id}`)}
                className="p-5 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm hover:shadow-lg hover:border-brand-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{doc.documentName}</h4>
                    <p className="text-[10px] text-gray-400">
                      {doc.documentType} • Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-500 shrink-0" />
              </div>
            ))}
          </div>
        )
      )}

      {/* Draft History */}
      {activeTab === 'drafts' && (
        filteredDrafts.length === 0 ? (
          <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-12 text-center space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Legal Drafts Generated Yet</h4>
            <p className="text-xs text-gray-400">Use the Draft Generator to create NDAs, Rental Agreements, or Contracts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrafts.map((draft) => (
              <div
                key={draft._id}
                className="p-5 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{draft.title}</h4>
                    <p className="text-[10px] text-gray-400">
                      {draft.draftType} • {new Date(draft.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Chat History */}
      {activeTab === 'chats' && (
        filteredChats.length === 0 ? (
          <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Chat Consultations Found</h4>
            <p className="text-xs text-gray-400">Start a consultation session with the LexiAgent AI assistant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => navigate('/chat')}
                className="p-5 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm hover:shadow-lg hover:border-brand-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{chat.title}</h4>
                    <p className="text-[10px] text-gray-400">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-500 shrink-0" />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
