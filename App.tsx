import React, { useState, useEffect, useRef } from 'react';
import { Message, LanguageOption, UserProfile, UserProgress } from './types';
import { POPULAR_LANGUAGES } from './constants';
import { initializeChat, sendMessageToGemini, resetChat } from './services/geminiService';
import { getProfile, saveProfile, getProgress } from './services/localStorage';

import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ChatBubble } from './components/ChatBubble';
import { InputArea } from './components/InputArea';
import { FlashcardMode } from './components/FlashcardMode';
import { FullScreenPreview } from './components/FullScreenPreview';
import { RefreshCw, ArrowLeft, MessageCircle, Layers, Home, Loader2 } from 'lucide-react';

type ViewMode = 'onboarding' | 'dashboard' | 'chat' | 'flashcards';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ streak: 0, cardsKnown: 0, lastStudyDate: '' });
  const [view, setView] = useState<ViewMode>('onboarding');
  
  const [activeLanguage, setActiveLanguage] = useState<LanguageOption | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Thinking...");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for existing user
    const savedProfile = getProfile();
    const savedProgress = getProgress();
    
    if (savedProfile) {
      setProfile(savedProfile);
      setProgress(savedProgress);
      setView('dashboard');
    } else {
      setView('onboarding');
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setView('dashboard');
  };

  const handleNavigate = (mode: 'chat' | 'flashcards', languageId: string) => {
    const lang = POPULAR_LANGUAGES.find(l => l.id === languageId);
    if (lang) {
      setActiveLanguage(lang);
      setView(mode);
      
      // If entering chat, init the session
      if (mode === 'chat') {
        startChatSession(lang);
      }
    }
  };

  const startChatSession = async (lang: LanguageOption) => {
    if (!profile) return;
    setMessages([]);
    resetChat();
    setIsLoading(true);
    setLoadingText("Warming up...");
    initializeChat(profile, lang.name);

    try {
      const initialPrompt = `Hello! I'm ${profile.name}. Let's start learning ${lang.name}! Teach me a cool word.`;
      const botResponse = await sendMessageToGemini(initialPrompt);
      
      setMessages([{
        id: Date.now().toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string, image?: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      image,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    
    // Set feedback text based on content
    if (image) {
      setLoadingText("Scanning image...");
    } else {
      setLoadingText("Thinking...");
    }

    try {
      const botResponseText = await sendMessageToGemini(text, image);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
       setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Sorry, connection error. 🌩️",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view, isLoading]);

  const goHome = () => {
    setView('dashboard');
    setActiveLanguage(null);
  };

  // --- RENDER ---

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'dashboard' && profile) {
    return <Dashboard profile={profile} progress={progress} onNavigate={handleNavigate} />;
  }

  // Header Logic for Chat/Cards
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="flex-shrink-0 bg-white border-b border-slate-200 z-10 shadow-sm">
        <div className="h-16 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <button 
                onClick={goHome}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <ArrowLeft size={22} />
            </button>
            
            {activeLanguage && (
               <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                <span className="text-lg">{activeLanguage.flag}</span>
                <span className="font-bold text-indigo-800 text-sm">{activeLanguage.name}</span>
               </div>
            )}
          </div>

          {/* Mode Toggle in Header */}
          <div className="flex bg-slate-100 rounded-lg p-1">
             <button 
                onClick={() => handleNavigate('chat', activeLanguage!.id)}
                className={`p-2 rounded-md transition-all ${view === 'chat' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
             >
                 <MessageCircle size={18} />
             </button>
             <button 
                onClick={() => setView('flashcards')}
                className={`p-2 rounded-md transition-all ${view === 'flashcards' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
             >
                 <Layers size={18} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-hidden relative flex flex-col">
        {view === 'chat' ? (
             <div className="flex-grow overflow-y-auto px-4 py-6 md:px-6 md:py-8 space-y-2 scroll-smooth">
                <div className="max-w-4xl mx-auto w-full pb-4">
                  {messages.map((msg) => (
                    <ChatBubble 
                      key={msg.id} 
                      message={msg} 
                      onImageClick={(img) => setPreviewImage(img)}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-6 animate-pulse">
                         <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                            <span className="text-slate-400 text-sm font-medium">{loadingText}</span>
                         </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
        ) : (
            <div className="flex-grow overflow-hidden bg-slate-50/50">
                <FlashcardMode language={activeLanguage!} />
            </div>
        )}
      </main>

      {view === 'chat' && (
        <InputArea onSend={handleSendMessage} isLoading={isLoading} />
      )}

      {/* Full Screen Image Modal */}
      {previewImage && (
        <FullScreenPreview image={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
};

export default App;