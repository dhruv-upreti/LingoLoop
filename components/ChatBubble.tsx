import React, { useState } from 'react';
import { Message } from '../types';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: Message;
  onImageClick?: (img: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onImageClick }) => {
  const isBot = message.sender === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-slide-up group`}>
      {/* Avatar for Bot */}
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3 shadow-sm mt-1">
          <Bot size={18} />
        </div>
      )}

      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%] md:max-w-[70%]`}>
        <div
          className={`relative px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed overflow-hidden transition-all
            ${
              isBot
                ? 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100 hover:shadow-md'
                : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
            }
          `}
        >
          {/* Render Image if Present */}
          {message.image && (
            <div className="mb-3 -mx-2 -mt-2">
              <img 
                src={message.image} 
                alt="Uploaded content" 
                className="rounded-xl w-full h-auto max-h-60 object-cover border border-white/20 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => onImageClick?.(message.image!)}
              />
            </div>
          )}

          {isBot ? (
            <div className="prose prose-sm prose-indigo max-w-none prose-p:my-1 prose-strong:text-indigo-700 prose-headings:text-slate-800">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ) : (
            <span>{message.text}</span>
          )}

          {/* Copy Button for Bot (Visible on Hover or if focused) */}
          {isBot && (
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-indigo-500 rounded-lg hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy text"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* Avatar for User */}
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 ml-3 shadow-sm mt-1">
          <User size={18} />
        </div>
      )}
    </div>
  );
};