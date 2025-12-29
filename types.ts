export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
  image?: string; // Base64 string of the uploaded image
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  language: string | null;
}

export type LanguageOption = {
  id: string;
  name: string;
  flag: string;
  greeting: string;
};

export interface Flashcard {
  id: string;
  word: string;
  pronunciation?: string;
  meaning: string;
  example: string;
  language: string; 
  source?: 'preset' | 'pdf' | 'chat';
  isKnown?: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  languages: string[]; // IDs of languages
  joinedDate: string;
}

export interface UserProgress {
  streak: number;
  cardsKnown: number;
  lastStudyDate: string;
}