

import React from 'react';

interface ResultDisplayProps {
  creatureName: string;
  description: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ creatureName, description }) => {
  return (
    <div className="bg-white shadow-xl border border-gray-300 rounded-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 border-b border-slate-900 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-wide text-orange-400">
                    {creatureName}
                </h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Creature Identified</p>
            </div>
            {/* Decorative icon */}
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <div className="p-6 space-y-6">
            {/* AI Summary Section */}
            <div className="bg-gray-50 p-4 border-l-4 border-orange-400 rounded-r-md">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    AI Knowledge Summary
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    </div>
  );
};