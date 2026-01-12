
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <button
        onClick={() => onChange('fa')}
        className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
          current === 'fa' 
            ? 'bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 shadow-md ring-1 ring-black/5' 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        FA
      </button>
      <button
        onClick={() => onChange('en')}
        className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
          current === 'en' 
            ? 'bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 shadow-md ring-1 ring-black/5' 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};
