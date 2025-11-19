import React from 'react';

const CreditSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="font-bold text-base text-gray-800 border-b pb-1 mb-2">{title}</h3>
        <div className="text-sm space-y-1">{children}</div>
    </div>
);

const CreditLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
        {children} &raquo;
    </a>
);


export const CreditsContent: React.FC = () => {
  return (
    <div className="space-y-6 text-sm">
      <p>This application was made possible by a number of powerful technologies and the inspiration of a fantastic open-source project.</p>

      <CreditSection title="Core Technology">
        <p><strong>AI Model:</strong> Identification, summary, and color extraction powered by <CreditLink href="https://deepmind.google/technologies/gemini/">Google's Gemini API</CreditLink>.</p>
        <p><strong>Framework:</strong> Built with <CreditLink href="https://react.dev/">React</CreditLink> and <CreditLink href="https://www.typescriptlang.org/">TypeScript</CreditLink>.</p>
        <p><strong>Styling:</strong> User interface styled with <CreditLink href="https://tailwindcss.com/">Tailwind CSS</CreditLink>.</p>
      </CreditSection>

       <CreditSection title="Design Inspiration">
        <p>The UI and workflow for this application are heavily inspired by the excellent <CreditLink href="https://colorbrewer2.org/">ColorBrewer 2.0</CreditLink>, a tool for color advice in cartography by Cynthia Brewer, Mark Harrower, and The Pennsylvania State University.</p>
      </CreditSection>
      
       <CreditSection title="Developer">
        <p>Developed by an AI assistant.</p>
      </CreditSection>

    </div>
  );
};
