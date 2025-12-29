import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface FullScreenPreviewProps {
  image: string;
  onClose: () => void;
}

export const FullScreenPreview: React.FC<FullScreenPreviewProps> = ({ image, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" 
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
        aria-label="Close preview"
      >
        <X size={32} />
      </button>
      <img 
        src={image} 
        alt="Full screen preview" 
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};