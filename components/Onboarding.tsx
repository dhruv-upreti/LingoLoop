import React, { useState } from 'react';
import { UserProfile, LanguageOption } from '../types';
import { POPULAR_LANGUAGES } from '../constants';
import { ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1 && name) setStep(2);
    else if (step === 2 && age) setStep(3);
    else if (step === 3 && selectedLangs.length > 0) {
      const profile: UserProfile = {
        name,
        age: Number(age),
        languages: selectedLangs,
        joinedDate: new Date().toISOString()
      };
      onComplete(profile);
    }
  };

  const toggleLang = (id: string) => {
    setSelectedLangs(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">What's your name?</h1>
            <p className="text-slate-500 mb-6">We'll use this to personalize your lessons.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full text-2xl p-4 border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent placeholder-slate-300 font-medium"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">How old are you?</h1>
            <p className="text-slate-500 mb-6">This helps us pick the right vocabulary vibe.</p>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="15"
              className="w-full text-2xl p-4 border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent placeholder-slate-300 font-medium"
              autoFocus
            />
          </div>
        )}

        {/* Step 3: Languages */}
        {step === 3 && (
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">What do you want to learn?</h1>
            <p className="text-slate-500 mb-6">Pick as many as you want.</p>
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
              {POPULAR_LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => toggleLang(lang.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedLangs.includes(lang.id)
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-semibold">{lang.name}</span>
                  {selectedLangs.includes(lang.id) && <Check size={16} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={(step === 1 && !name) || (step === 2 && !age) || (step === 3 && selectedLangs.length === 0)}
          className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          {step === 3 ? "Let's Go!" : "Next"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};