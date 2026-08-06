import React from 'react';
import { Scale, Cpu, ShieldCheck, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      <div className="text-center space-y-4">
        <div className="p-3.5 rounded-2xl gradient-bg w-fit mx-auto shadow-lg">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">About LexiAgent AI</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          LexiAgent AI is an enterprise-grade autonomous legal assistant built for citizens, students, startups, and small businesses under the Hackathon theme: <span className="text-brand-500 font-bold">Agentic AI & Intelligent Systems</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-8 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" /> Multi-Agent AI System
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            LexiAgent AI avoids monolithic prompts. Instead, it utilizes an Orchestrator Agent that analyzes user intent and delegates tasks to specialized sub-agents: Document Analysis Agent, Risk Auditor Agent, Draft Generator Agent, Legal Chat Agent, and Context Memory Agent.
          </p>
        </div>

        <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-8 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Google Gemini API Integration
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Built using the official <code className="text-brand-500">@google/genai</code> SDK on Node.js backend. All Gemini API keys, JWT secrets, and database credentials remain 100% server-side with strict Zod JSON schema validation.
          </p>
        </div>
      </div>
    </div>
  );
};
