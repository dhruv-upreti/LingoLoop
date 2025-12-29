import React, { useState, useEffect, useRef } from 'react';
import { Flashcard, LanguageOption } from '../types';
import { getDeck, addCardsToDeck } from '../services/localStorage';
import { extractTextFromPdf } from '../services/pdfService';
import { generateFlashcardsFromText } from '../services/geminiService';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, FileUp, Loader2, Layers } from 'lucide-react';

interface FlashcardModeProps {
  language: LanguageOption;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ language }) => {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Processing PDF...");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadedDeck = getDeck(language.id);
    setDeck(loadedDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
  }, [language]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const handleMarkKnown = () => {
    setKnownCount(prev => prev + 1);
    handleNext();
  };

  const handleMarkUnknown = () => {
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setKnownCount(0);
    setIsFlipped(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    setLoadingStatus("Reading PDF...");
    try {
      // 1. Extract text
      const text = await extractTextFromPdf(file);
      
      // 2. Generate Flashcards (with chunking)
      const newCards = await generateFlashcardsFromText(
        text, 
        language.name, 
        (status) => setLoadingStatus(status)
      );
      
      if (newCards.length > 0) {
          // 3. Save
          addCardsToDeck(newCards);
          
          // 4. Update local state to show new cards immediately
          const updatedDeck = getDeck(language.id);
          setDeck(updatedDeck);
          alert(`Success! Added ${newCards.length} cards from your PDF.`);
      } else {
          alert("Could not find suitable vocabulary in that document.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing PDF. Please try a simpler file.");
    } finally {
      setIsGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Loading / Empty State
  if (deck.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Layers size={32} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Cards Yet</h3>
        <p className="text-slate-500 mb-8 max-w-xs">Start by uploading a PDF document (like a homework sheet) to generate cards!</p>
        
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95"
        >
            <FileUp size={20} />
            Upload PDF
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf"
            className="hidden" 
        />
      </div>
    );
  }

  if (isGenerating) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-800 font-bold text-lg mb-2">{loadingStatus}</p>
              <p className="text-slate-500 text-sm max-w-xs">We are analyzing your document to ensure we capture every word. This might take a moment!</p>
          </div>
      )
  }

  const currentCard = deck[currentIndex];

  return (
    <div className="flex flex-col items-center justify-start h-full p-4 w-full max-w-lg mx-auto animate-fade-in">
      {/* Header Actions */}
      <div className="w-full flex justify-between items-center mb-4">
          <div className="text-slate-500 text-sm font-medium">
             Card {currentIndex + 1} / {deck.length}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded"
          >
              <FileUp size={14} />
              + PDF
          </button>
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf"
            className="hidden" 
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* Card Container with Perspective */}
      <div 
        className="relative w-full aspect-[4/5] md:aspect-[4/3] cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 backface-hidden">
            <span className="text-sm text-slate-400 font-semibold tracking-wider uppercase mb-2">Word</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 text-center mb-4 break-words w-full px-4">{currentCard.word}</h2>
            {currentCard.pronunciation && (
              <p className="text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full text-sm">
                /{currentCard.pronunciation}/
              </p>
            )}
             {currentCard.source === 'pdf' && (
                <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full">PDF</span>
            )}
            <p className="absolute bottom-8 text-slate-300 text-xs">Tap to flip</p>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 text-white">
            <span className="text-sm text-indigo-200 font-semibold tracking-wider uppercase mb-2">Meaning</span>
            <h3 className="text-3xl font-bold text-center mb-6 break-words w-full px-4">{currentCard.meaning}</h3>
            
            <div className="w-full bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-xs text-indigo-200 font-bold uppercase block mb-1">Example</span>
              <p className="text-lg italic text-center font-medium opacity-90">"{currentCard.example}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8 w-full justify-center">
        {currentIndex === deck.length - 1 && isFlipped ? (
           <button 
             onClick={handleReset}
             className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-slate-900 transition-colors"
           >
             <RotateCcw size={20} />
             Start Over
           </button>
        ) : (
          <>
             <button
              onClick={(e) => { e.stopPropagation(); handleMarkUnknown(); }}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:scale-105 transition-all"
              title="Study Again"
            >
              <X size={24} />
              <span className="text-[10px] font-bold mt-1">Again</span>
            </button>

            <div className="flex gap-4 mx-4">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={currentIndex === 0}
                className="p-3 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={currentIndex === deck.length - 1}
                className="p-3 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleMarkKnown(); }}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 border border-green-100 hover:bg-green-100 hover:scale-105 transition-all"
              title="I know this"
            >
              <Check size={24} />
              <span className="text-[10px] font-bold mt-1">Easy</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};