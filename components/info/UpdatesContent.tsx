import React from 'react';

const UpdateItem: React.FC<{ version: string; date: string; children: React.ReactNode }> = ({ version, date, children }) => (
    <div className="border-l-2 border-orange-500 pl-4 mb-6">
        <div className="flex items-baseline gap-3">
            <span className="font-bold text-lg text-gray-800">{version}</span>
            <span className="text-xs text-gray-500">{date}</span>
        </div>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-600">
            {children}
        </ul>
    </div>
);

export const UpdatesContent: React.FC = () => {
  return (
    <div>
        <UpdateItem version="v2.2" date="Nov 2025">
            <li>Major Theme Update: Broadened scope from "Creature Palette" to "Creature Palette".</li>
            <li>The AI can now identify any creature, not just birds.</li>
            <li>Updated all UI text and branding to reflect the new theme.</li>
        </UpdateItem>
        <UpdateItem version="v2.1" date="July 2024">
            <li>Added informational modals for "How to Use", "Updates", "Downloads", and "Credits".</li>
            <li>Fixed a bug where the results panel would not scroll on smaller screens.</li>
            <li>Improved UI feedback for the "Number of data classes" selector.</li>
        </UpdateItem>
        <UpdateItem version="v2.0" date="July 2024">
            <li>Complete UI overhaul inspired by ColorBrewer 2.0 for a more professional, tool-oriented feel.</li>
            <li>Integrated Google's Gemini 2.5 Flash model for faster, more accurate creature identification and color extraction.</li>
            <li>Implemented client-side color filtering for instant palette size adjustments without re-analyzing.</li>
            <li>Added AI-powered web summary for identified species.</li>
        </UpdateItem>
        <UpdateItem version="v1.0" date="June 2024">
            <li>Initial release of Creature Palette (formerly Avian Palette).</li>
            <li>Core functionality: image upload and basic color palette generation.</li>
        </UpdateItem>
    </div>
  );
};