import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Sparkles, Image as ImageIcon, X, Camera } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, image?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || selectedImage) && !isLoading && !disabled) {
      onSend(input, selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-4 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
      
      {/* Image Preview Container */}
      {selectedImage && (
        <div className="max-w-4xl mx-auto mb-3 animate-slide-up">
           <div className="relative inline-block group">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-24 w-auto rounded-xl border-2 border-indigo-100 shadow-md object-cover"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1.5 shadow-lg hover:bg-red-500 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                Ready to scan
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex items-end gap-3">
        {/* Action Button: Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || disabled}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50 border border-slate-200"
          title="Upload Image or Take Photo"
        >
          <Camera size={22} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {/* Text Input */}
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder={disabled ? "Select a language..." : "Type or upload a photo..."}
            className="w-full pl-4 pr-10 py-3 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-2xl resize-none focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-800 placeholder-slate-400 disabled:opacity-50 max-h-[120px]"
            rows={1}
            style={{ minHeight: '46px' }}
          />
          {!isLoading && (
              <div className="absolute right-3 top-3 text-slate-300 pointer-events-none">
                 <Sparkles size={18} className={input.length > 0 ? "text-indigo-400 animate-pulse" : ""} />
              </div>
          )}
        </div>
        
        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!input.trim() && !selectedImage) || isLoading || disabled}
          className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full shadow-md transition-all duration-200 active:scale-95
            ${(!input.trim() && !selectedImage) || isLoading || disabled 
               ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
               : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
            }`}
        >
           <Send size={20} className={(!input.trim() && !selectedImage) ? "" : "ml-0.5"} />
        </button>
      </div>
    </div>
  );
};