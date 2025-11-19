import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: number) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center justify-between appearance-none w-20 text-center px-3 py-1 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm font-semibold text-gray-800 cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-300'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute z-20 mt-1 w-24 bg-gray-800 shadow-lg rounded-lg ring-1 ring-black ring-opacity-5"
          style={{
            animation: 'fade-in-fast 0.1s ease-out forwards',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm" role="listbox">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`cursor-pointer select-none relative py-2 px-3 text-white flex items-center justify-center transition-colors text-center font-semibold ${option === value ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                role="option"
                aria-selected={option === value}
              >
                {option === value && (
                    <svg className="h-5 w-5 mr-2 absolute left-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                <span>
                  {option}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
