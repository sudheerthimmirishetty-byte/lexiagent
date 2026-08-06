import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Zap,
  FileText,
  MessageSquare,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const features = [
    {
      icon: Cpu,
      title: 'Multi-Agent Orchestrator',
      desc: 'Orchestrator Agent evaluates your legal intent and delegates tasks to specialized sub-agents for analysis, risk detection, and drafting.',
    },
    {
      icon: FileText,
      title: 'Document Intelligence',
      desc: 'Upload PDF, DOCX, or TXT agreements up to 20MB. Automatically extracts text, classifies document type, and parses obligations.',
    },
    {
      icon: ShieldCheck,
      title: 'Legal Risk Detection',
      desc: 'Identifies financial liability, non-competes, scam indicators, and missing protective clauses with clear risk levels.',
    },
    {
      icon: Sparkles,
      title: 'Clause Simplification',
      desc: 'Converts complex legal jargon into simple, beginner-friendly English under 120 words per clause.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Legal Draft Generator',
      desc: 'Instantly generates formal Legal Notices, Complaints, NDAs, Rental Agreements, Employment Agreements, Affidavits & Contracts.',
    },
    {
      icon: Brain,
      title: 'Contextual Memory',
      desc: 'Remembers uploaded documents and previous conversation history across sessions for continuous legal consultation.',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload or Ask', desc: 'Drag & drop any legal contract or type your legal question in plain text.' },
    { num: '02', title: 'Agent Reasoning', desc: 'LexiAgent Orchestrator assigns tasks to risk auditors & document analysis agents.' },
    { num: '03', title: 'Instant Action', desc: 'Review clear clause breakdowns, risk meters, and edit/download formal legal drafts.' },
  ];

  const faqs = [
    {
      q: 'How does LexiAgent AI differ from generic chatbots?',
      a: 'LexiAgent AI is built on a multi-agent system (Orchestrator, Risk Auditor, Analysis Agent, Draft Author). It performs full legal workflows, parses contracts, detects hidden liabilities, and generates complete editable legal drafts.',
    },
    {
      q: 'Are my uploaded legal documents safe?',
      a: 'Yes. All uploads are processed securely server-side with strict encryption. Your documents are never shared or stored publicly.',
    },
    {
      q: 'What document formats are supported?',
      a: 'LexiAgent AI supports PDF, Microsoft Word (.docx), and plain text (.txt) files up to 20MB in size.',
    },
    {
      q: 'Does LexiAgent replace a licensed lawyer?',
      a: 'LexiAgent AI is an educational legal intelligence assistant. It simplifies contracts and generates initial drafts, but does not provide licensed legal representation.',
    },
  ];

  return (
    <div className="min-h-screen space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(9,126,255,0.25),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(9,126,255,0.18),rgba(11,15,25,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Hackathon Theme: Agentic AI & Intelligent Systems
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight"
          >
            Autonomous AI Legal Assistant for <span className="gradient-text">Clarity & Confidence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Understand complex contracts, detect hidden legal risks, simplify dense legal jargon, and generate formal agreements powered by Google Gemini API.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-bg font-extrabold text-base text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Launch Autonomous Agent
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-darkCard/80 backdrop-blur-md font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Sign In to Account
            </Link>
          </motion.div>

          {/* Feature Badge Grid */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-semibold text-gray-600 dark:text-gray-400">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkCard/50 border border-gray-200/50 dark:border-darkBorder/50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF, DOCX, TXT Support
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkCard/50 border border-gray-200/50 dark:border-darkBorder/50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Risk Meter & Alerts
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkCard/50 border border-gray-200/50 dark:border-darkBorder/50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Legal Draft Generator
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkCard/50 border border-gray-200/50 dark:border-darkBorder/50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Server JWT Security
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Multi-Agent AI Capabilities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            LexiAgent AI coordinates specialized sub-agents to deliver comprehensive legal workflow execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-3.5 rounded-2xl bg-brand-500/10 text-brand-500 w-fit mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-brand-950 via-darkBg to-purple-950 rounded-3xl p-8 sm:p-14 text-white border border-brand-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-12">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
              Autonomous Agent Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">How LexiAgent Executes Legal Tasks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <span className="text-4xl font-black text-brand-400 opacity-60 block mb-3">{s.num}</span>
                <h4 className="text-lg font-bold mb-2">{s.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Everything you need to know about LexiAgent AI platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-500" />
                {faq.q}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-12 rounded-3xl gradient-bg text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Transform Your Legal Workflow Today</h2>
          <p className="text-sm text-brand-100 max-w-xl mx-auto">
            Experience autonomous legal document analysis, risk detection, and draft generation in minutes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-600 font-extrabold text-sm shadow-xl hover:bg-brand-50 transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
