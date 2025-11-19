
import React, { useState } from 'react';
import type { ColorInfo } from '../types';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorRow: React.FC<{ color: ColorInfo; format: ColorFormat; isCopied: boolean; onCopy: () => void; }> = ({ color, format, isCopied, onCopy }) => {

  const getValue = () => {
      switch(format) {
          case 'rgb': return color.rgb;
          case 'hsl': return color.hsl;
          default: return color.hex;
      }
  };

  const value = getValue();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    onCopy();
  };

  return (
    <div className="flex items-center justify-between p-1 hover:bg-slate-200 rounded-sm transition-colors text-sm">
        <div className="flex items-center gap-3">
            <div 
                className="w-5 h-5 rounded-sm border border-gray-400 flex-shrink-0"
                style={{ backgroundColor: color.hex }}
            ></div>
            <span className="font-mono text-xs text-gray-700">{value}</span>
        </div>
        <button 
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-800 transition-colors"
            aria-label={`Copy ${value}`}
        >
            {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
            
        </button>
    </div>
  );
};

export const ColorPalette: React.FC<{ colors: ColorInfo[] }> = ({ colors }) => {
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number) => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div>
      <div className="mb-2 flex justify-end">
          <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded text-xs">
            <span className="text-gray-500 pl-2">Format:</span>
            <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value as ColorFormat)}
                className="bg-white border border-gray-200 rounded py-0.5 px-2 text-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
                <option value="hex">HEX</option>
                <option value="rgb">RGB</option>
                <option value="hsl">HSL</option>
            </select>
          </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {colors.map((color, index) => (
          <ColorRow 
            key={index} 
            color={color} 
            format={format}
            isCopied={copiedIndex === index}
            onCopy={() => handleCopy(index)}
          />
        ))}
      </div>
    </div>
  );
};
