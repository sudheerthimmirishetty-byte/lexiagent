import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="p-6 rounded-3xl bg-brand-500/10 text-brand-500">
        <FileQuestion className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404 - Page Not Found</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
        The legal page or document endpoint you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl gradient-bg font-extrabold text-xs text-white shadow-lg flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home Page
      </Link>
    </div>
  );
};
