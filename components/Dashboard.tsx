import React, { useEffect, useState } from 'react';
import { UserProfile, UserProgress } from '../types';
import { POPULAR_LANGUAGES } from '../constants';
import { getDashboardMotivation } from '../services/geminiService';
import { MessageCircle, Layers, Zap, Sparkles } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  progress: UserProgress;
  onNavigate: (mode: 'chat' | 'flashcards', languageId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, progress, onNavigate }) => {
  const [motivation, setMotivation] = useState<string>('');

  useEffect(() => {
    // Get AI Motivation on mount
    getDashboardMotivation(profile, progress.streak).then(setMotivation);
  }, [profile, progress]);

  // Filter valid languages from constants based on user profile
  const userLanguages = POPULAR_LANGUAGES.filter(l => profile.languages.includes(l.id));

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col animate-fade-in pb-24">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hi, {profile.name} 👋</h1>
          <p className="text-slate-500 font-medium">Ready to learn?</p>
        </div>
        <div className="flex flex-col items-center bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
           <Zap className="text-orange-500 fill-orange-500 mb-1" size={20} />
           <span className="text-xs font-bold text-orange-600">{progress.streak} Day Streak</span>
        </div>
      </div>

      {/* AI Motivation Card */}
      {motivation && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 opacity-20" size={48} />
          <p className="font-medium text-lg leading-relaxed relative z-10">"{motivation}"</p>
          <div className="mt-4 flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            AI Coach
          </div>
        </div>
      )}

      {/* Language Cards */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Your Languages</h2>
      <div className="grid gap-4">
        {userLanguages.map(lang => (
          <div key={lang.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{lang.name}</h3>
                <p className="text-xs text-slate-400 font-medium">Beginner</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('chat', lang.id)}
                className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-100 transition-colors"
              >
                <MessageCircle size={18} />
                Chat
              </button>
              <button 
                onClick={() => onNavigate('flashcards', lang.id)}
                className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
              >
                <Layers size={18} />
                Cards
              </button>
            </div>
          </div>
        ))}
        
        {/* Add more button (mock) */}
        <button className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-slate-400 font-semibold hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
            + Add Language
        </button>
      </div>
    </div>
  );
};