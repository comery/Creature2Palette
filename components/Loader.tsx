import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-2">
      <p className="text-xs text-gray-500 text-center">Identifying creature...</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div className="bg-orange-500 h-1.5 rounded-full animate-progress-indeterminate"></div>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
            animation: progress-indeterminate 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};