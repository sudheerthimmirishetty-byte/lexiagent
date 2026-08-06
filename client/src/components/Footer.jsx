import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, Cpu, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkBg border-t border-gray-200/80 dark:border-darkBorder/80 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl gradient-bg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">LexiAgent AI</span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Autonomous legal assistant powered by Google Gemini API & multi-agent architecture. Simplifying complex contracts for everyone.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs flex items-center gap-1 font-semibold text-brand-500">
                <Cpu className="w-3.5 h-3.5" /> Agentic AI 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/chat" className="hover:text-brand-500 transition-colors">AI Legal Chat</Link></li>
              <li><Link to="/upload" className="hover:text-brand-500 transition-colors">Document Analysis</Link></li>
              <li><Link to="/generate" className="hover:text-brand-500 transition-colors">Draft Generator</Link></li>
              <li><Link to="/history" className="hover:text-brand-500 transition-colors">Case History</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-brand-500 transition-colors">About System</Link></li>
              <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact & Support</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">User Dashboard</Link></li>
              <li><Link to="/settings" className="hover:text-brand-500 transition-colors">Preferences</Link></li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Safety & Disclaimer
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-darkCard p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              LexiAgent AI provides AI-assisted legal document synthesis and risk detection for educational purposes. It does not replace licensed legal representation.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} LexiAgent AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Terms of Service</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Gemini 2.5 Flash Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
