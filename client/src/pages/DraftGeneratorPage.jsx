import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { draftService } from '../services/draftService';
import { useNotification } from '../context/NotificationContext';
import { DraftEditor } from '../components/DraftEditor';
import { FileSpreadsheet, Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';

export const DraftGeneratorPage = () => {
  const location = useLocation();
  const initialText = location.state?.documentText || '';
  const initialTitle = location.state?.title ? `Draft for ${location.state.title}` : '';

  const [draftType, setDraftType] = useState('Rental Agreement');
  const [title, setTitle] = useState(initialTitle || 'Rental Agreement Draft');
  const [prompt, setPrompt] = useState(
    initialText
      ? `Generate a formal legal draft based on this document context:\n${initialText.substring(0, 1000)}`
      : ''
  );
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);

  const { success, error } = useNotification();

  const draftTypes = [
    'Legal Notice',
    'Complaint',
    'Rental Agreement',
    'Employment Agreement',
    'NDA',
    'Affidavit',
    'Contract',
    'Power of Attorney',
    'Service Agreement',
    'Freelancer Agreement',
    'Privacy Policy',
    'Terms & Conditions',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      error('Please enter prompt instructions for the legal draft.');
      return;
    }

    setLoading(true);
    try {
      const res = await draftService.generateDraft({
        draftType,
        title: title || `${draftType} Draft`,
        prompt,
      });

      setGeneratedDraft(res.draft);
      success('AI Legal Draft generated successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to generate legal draft.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (type) => {
    setDraftType(type);
    setTitle(`${type} Document`);

    const templates = {
      'Rental Agreement': 'Draft a standard residential rental agreement for a 2-bedroom apartment between Landlord John Doe and Tenant Alex Smith for 12 months with a monthly rent of $1,500 and a 1-month security deposit.',
      'Employment Agreement': 'Generate an employment agreement for a Senior Full Stack Engineer role at TechCorp Inc. Includes a 90-day probation period, annual salary of $120,000, 15 days paid leave, and non-disclosure obligations.',
      'NDA': 'Create a mutual Non-Disclosure Agreement (NDA) between Alpha Ventures and Beta Systems to protect proprietary software source code and customer data for 2 years.',
      'Legal Notice': 'Draft a formal legal notice demanding unpaid invoice payment of $4,500 from Client Acme Corp within 15 days before initiating civil litigation.',
    };

    setPrompt(templates[type] || `Generate a comprehensive ${type} document with formal terms and signature blocks.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">AI Legal Draft Generator</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Generate enforceable legal notices, contracts, NDAs, rental agreements, complaints, and affidavits using Google Gemini API.
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-8 shadow-xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Legal Document Type
              </label>
              <select
                value={draftType}
                onChange={(e) => {
                  setDraftType(e.target.value);
                  if (!title) setTitle(`${e.target.value} Draft`);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {draftTypes.map((t) => (
                  <option key={t} value={t}>
                    📄 {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Draft Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Residential Lease Agreement 2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Template Chips */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Quick Sample Templates
            </span>
            <div className="flex flex-wrap gap-2">
              {['Rental Agreement', 'Employment Agreement', 'NDA', 'Legal Notice'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleApplyTemplate(t)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs hover:bg-brand-500 hover:text-white transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Instructions & Contract Details
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="Describe the parties, payment terms, duration, special clauses, or penalties to include..."
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl gradient-bg font-extrabold text-sm text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Drafting Legal Document via AI Agent...' : 'Generate Legal Draft'}
          </button>
        </form>
      </div>

      {/* Editor Output */}
      {generatedDraft && (
        <DraftEditor
          initialDraft={generatedDraft.generatedDraft}
          title={generatedDraft.title || draftType}
        />
      )}
    </div>
  );
};
