import React, { useState } from 'react';
import type { ColorInfo } from '../../types';

interface DownloadsContentProps {
  colors: ColorInfo[];
  creatureName: string;
}

export const DownloadsContent: React.FC<DownloadsContentProps> = ({ colors, creatureName }) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  const generateJson = () => {
    return JSON.stringify({
        paletteName: creatureName.replace(/\s+/g, '-').toLowerCase(),
        colors: colors
    }, null, 2);
  };

  const generateCss = () => {
    const safeCreatureName = creatureName.replace(/\s+/g, '-').toLowerCase();
    return colors.map((color, i) => `--${safeCreatureName}-color-${i + 1}: ${color.hex};`).join('\n');
  };
  
  if (colors.length === 0) {
      return (
          <div className="text-center text-gray-500 p-8">
              <p>Please analyze an image first to generate a palette.</p>
              <p className="text-xs mt-2">The export options will appear here once a palette is created.</p>
          </div>
      )
  }

  const jsonContent = generateJson();
  const cssContent = generateCss();

  return (
    <div className="space-y-6 text-sm">
      <p>Export the current color palette for use in your projects. Click a button to copy the code to your clipboard.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-base text-gray-800">CSS</h3>
          <p className="text-xs text-gray-500 mb-2">Copy as CSS Custom Properties.</p>
          <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-auto max-h-48">
            <code>
              {cssContent}
            </code>
          </pre>
          <button 
            onClick={() => handleCopy(cssContent, 'css')}
            className="mt-2 w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            {copied === 'css' ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>

        <div>
          <h3 className="font-bold text-base text-gray-800">JSON</h3>
          <p className="text-xs text-gray-500 mb-2">Copy as a JSON object.</p>
          <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-auto max-h-48">
            <code>
              {jsonContent}
            </code>
          </pre>
           <button 
            onClick={() => handleCopy(jsonContent, 'json')}
            className="mt-2 w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            {copied === 'json' ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};