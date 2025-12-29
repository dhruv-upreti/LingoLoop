import React from 'react';
import { POPULAR_LANGUAGES } from '../constants';
import { LanguageOption } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: LanguageOption) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
          <Globe size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to LingoLoop</h1>
        <p className="text-slate-600 max-w-md mx-auto">
          The chill way to pick up new words. Select a language to start your streak! 🔥
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {POPULAR_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelect(lang)}
            className="group relative flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
              {lang.flag}
            </span>
            <span className="font-semibold text-slate-800 group-hover:text-indigo-600">
              {lang.name}
            </span>
            <span className="text-xs text-slate-400 mt-1 font-medium group-hover:text-indigo-400">
              "{lang.greeting}"
            </span>
          </button>
        ))}
        
        {/* 'Other' Option */}
        <button
            onClick={() => onSelect({ id: 'other', name: 'Other', flag: '🌍', greeting: 'Hello!' })}
            className="group flex flex-col items-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200"
          >
            <span className="text-4xl mb-3 text-slate-400 group-hover:text-indigo-500">
              ?
            </span>
            <span className="font-semibold text-slate-500 group-hover:text-indigo-600">
              Surprise Me
            </span>
             <span className="text-xs text-slate-400 mt-1 font-medium opacity-0 group-hover:opacity-100">
              Pick any!
            </span>
          </button>
      </div>
    </div>
  );
};