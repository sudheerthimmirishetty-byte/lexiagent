import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  FileText,
  MessageSquare,
  FileSpreadsheet,
  UploadCloud,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="large" text="Loading AI Legal Dashboard..." />;

  const stats = data?.stats || {
    documentsUploaded: 0,
    documentsAnalyzed: 0,
    draftsGenerated: 0,
    chatSessions: 0,
    totalMessages: 0,
  };

  const statCards = [
    { title: 'Docs Uploaded', value: stats.documentsUploaded, icon: FileText, color: 'text-brand-500 bg-brand-500/10' },
    { title: 'Docs Analyzed', value: stats.documentsAnalyzed, icon: ShieldAlert, color: 'text-purple-500 bg-purple-500/10' },
    { title: 'Drafts Generated', value: stats.draftsGenerated, icon: FileSpreadsheet, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Chat Sessions', value: stats.chatSessions || stats.totalMessages, icon: MessageSquare, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl gradient-bg text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Legal Platform
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-sm text-brand-100 max-w-xl">
            LexiAgent AI is ready to analyze documents, detect hidden legal risks, and generate enforceable drafts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto">
          <Link
            to="/upload"
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-white text-brand-600 font-extrabold text-xs shadow-lg hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Upload Document
          </Link>
          <Link
            to="/chat"
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-brand-800/80 border border-white/20 text-white font-extrabold text-xs shadow-lg hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <MessageSquare className="w-4 h-4" /> AI Assistant
          </Link>
          <Link
            to="/generate"
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-purple-700/80 border border-white/20 text-white font-extrabold text-xs shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Legal Draft
          </Link>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm flex items-center gap-4"
            >
              <div className={`p-4 rounded-2xl ${sc.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{sc.title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{sc.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Uploads & Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" /> Recent Uploaded Documents
            </h3>
            <Link to="/history" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.recentDocuments || data.recentDocuments.length === 0) ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-xs text-gray-400">
                No documents uploaded yet. Click "Upload Document" to begin analysis.
              </div>
            ) : (
              data.recentDocuments.map((doc) => (
                <Link
                  key={doc._id}
                  to={`/document/${doc._id}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-brand-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                        {doc.documentName}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {doc.documentType} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      doc.status === 'analyzed'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {doc.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Legal Drafts */}
        <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-500" /> Recent Legal Drafts
            </h3>
            <Link to="/generate" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
              Generate New <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.recentDrafts || data.recentDrafts.length === 0) ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-xs text-gray-400">
                No legal drafts generated yet. Use the Draft Generator to create contracts.
              </div>
            ) : (
              data.recentDrafts.map((draft) => (
                <div
                  key={draft._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{draft.title}</h4>
                      <p className="text-[10px] text-gray-400">
                        {draft.draftType} • {new Date(draft.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500">
                    Ready
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> System Activity Log
        </h3>

        <div className="space-y-3">
          {(!data?.recentActivities || data.recentActivities.length === 0) ? (
            <p className="text-xs text-gray-400">No activity recorded yet.</p>
          ) : (
            data.recentActivities.map((act) => (
              <div key={act._id} className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-900 dark:text-white">{act.activity}</span>
                <span className="text-[10px] text-gray-400 ml-auto">{new Date(act.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
