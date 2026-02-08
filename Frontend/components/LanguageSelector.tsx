import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg items-center">
      {Object.values(Language).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all min-w-[36px] flex items-center justify-center ${
            current === lang 
              ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
          aria-label={`Change language to ${lang.toUpperCase()}`}
          type="button"
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};