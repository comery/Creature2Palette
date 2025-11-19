
import React from 'react';
import type { ColorInfo } from '../types';
import { ColorPalette } from './ColorPalette';

interface ExtractedPaletteDisplayProps {
  colors: ColorInfo[];
}

export const ExtractedPaletteDisplay: React.FC<ExtractedPaletteDisplayProps> = ({ colors }) => {
  return (
    <div className="bg-white shadow-xl border border-gray-300 rounded-sm p-3">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 border-b pb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Extracted Palette ({colors.length} classes)
        </h3>
        <div className="pt-2">
            <ColorPalette colors={colors} />
        </div>
    </div>
  );
};
