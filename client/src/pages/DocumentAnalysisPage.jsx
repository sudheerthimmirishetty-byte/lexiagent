import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AnalysisCard } from '../components/AnalysisCard';
import { RiskCard } from '../components/RiskCard';
import { RecommendationCard } from '../components/RecommendationCard';
import {
  FileText,
  ShieldAlert,
  Sparkles,
  Award,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const DocumentAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [document, setDocument] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('clauses');

  useEffect(() => {
    loadDocAndAnalysis();
  }, [id]);

  const loadDocAndAnalysis = async () => {
    try {
      const res = await documentService.getDocumentById(id);
      setDocument(res.document);
      setAnalysis(res.analysis);

      if (!res.analysis) {
        triggerAnalysis();
      } else {
        setLoading(false);
      }
    } catch (err) {
      error('Failed to load document analysis.');
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await documentService.analyzeDocument(id);
      setAnalysis(res.analysis);
      success('AI Agent completed legal analysis!');
    } catch (err) {
      error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analysis) return;
    const reportText = `LEXIAGENT AI - DOCUMENT ANALYSIS REPORT
Document Name: ${document?.documentName}
Category: ${analysis.documentCategory}
Confidence Score: ${(analysis.confidenceScore * 100).toFixed(0)}%
Summary: ${analysis.summary}

IMPORTANT CLAUSES:
${analysis.importantClauses?.map((c) => `- ${c.title}: ${c.simpleExplanation}`).join('\n')}

RISKY CLAUSES:
${analysis.riskyClauses?.map((r) => `- [${r.severity}] ${r.riskType}: ${r.description}`).join('\n')}

RECOMMENDED ACTIONS:
${analysis.recommendedActions?.map((a) => `- ${a.action} (${a.priority} Priority): ${a.reason}`).join('\n')}
`;
    const element = window.document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${document?.documentName}_Analysis_Report.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
    success('Exported analysis report.');
  };

  if (loading || analyzing) {
    return <LoadingSpinner size="large" text="Autonomous AI Agent is analyzing clauses & auditing legal risks..." />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl gradient-bg text-white shadow-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider">
                {analysis?.documentCategory || document?.documentType}
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{document?.documentName}</h1>
              <p className="text-xs text-gray-400">Original File: {document?.originalFileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/generate', { state: { documentText: document?.extractedText, title: document?.documentName } })}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl gradient-bg font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 hover:opacity-95"
            >
              <FileSpreadsheet className="w-4 h-4" /> Generate Legal Draft
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" /> Executive AI Summary
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            {analysis?.summary}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <p className="text-brand-500 font-semibold mb-1">AI Confidence</p>
            <p className="text-xl font-black text-brand-600 dark:text-brand-400">
              {((analysis?.confidenceScore || 0.95) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-purple-500 font-semibold mb-1">Important Clauses</p>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">
              {analysis?.importantClauses?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-500 font-semibold mb-1">Risks Detected</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {analysis?.riskyClauses?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-500 font-semibold mb-1">Actions Advised</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {analysis?.recommendedActions?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('clauses')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'clauses'
              ? 'gradient-bg text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Important Clauses ({analysis?.importantClauses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'risks'
              ? 'gradient-bg text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Risk Auditor ({analysis?.riskyClauses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'actions'
              ? 'gradient-bg text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Recommended Actions ({analysis?.recommendedActions?.length || 0})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'clauses' && (
        <div className="space-y-4">
          {analysis?.importantClauses?.map((c, i) => (
            <AnalysisCard key={i} clause={c} />
          ))}
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-4">
          {analysis?.riskyClauses?.map((r, i) => (
            <RiskCard key={i} risk={r} />
          ))}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          {analysis?.recommendedActions?.map((a, i) => (
            <RecommendationCard key={i} recommendation={a} />
          ))}
        </div>
      )}
    </div>
  );
};
