import React from 'react';

interface HeaderProps {
  onMenuClick: (menu: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-[#333333] text-white shrink-0 shadow-md z-20 relative">
      <div className="h-8 bg-[#444] flex items-center justify-start px-4 text-xs text-gray-300 gap-4 border-b border-gray-600">
        <button onClick={() => onMenuClick('howto')} className="hover:text-white cursor-pointer">how to use</button>
        <span className="border-l border-gray-500 h-3"></span>
        <button onClick={() => onMenuClick('updates')} className="hover:text-white cursor-pointer">updates</button>
        <span className="border-l border-gray-500 h-3"></span>
        <button onClick={() => onMenuClick('downloads')} className="hover:text-white cursor-pointer">downloads</button>
        <span className="border-l border-gray-500 h-3"></span>
        <button onClick={() => onMenuClick('credits')} className="hover:text-white cursor-pointer">credits</button>
      </div>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-baseline select-none">
          <h1 className="text-3xl font-bold tracking-wide">
            CREATURE<span className="text-orange-500">PALETTE</span> <span className="text-gray-400 text-xl">1.0</span>
          </h1>
        </div>
        <div className="text-gray-400 italic text-sm hidden sm:block">
          color advice for nature lovers
        </div>
      </div>
    </header>
  );
};