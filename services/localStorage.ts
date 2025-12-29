import { UserProfile, UserProgress, Flashcard } from '../types';
import { SAMPLE_FLASHCARDS } from '../constants';

const KEYS = {
  PROFILE: 'lingoloop_profile',
  PROGRESS: 'lingoloop_progress',
  CUSTOM_DECK: 'lingoloop_custom_deck',
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};

export const getProgress = (): UserProgress => {
  const data = localStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : { streak: 0, cardsKnown: 0, lastStudyDate: new Date().toISOString() };
};

export const saveCustomDeck = (cards: Flashcard[]) => {
  localStorage.setItem(KEYS.CUSTOM_DECK, JSON.stringify(cards));
};

export const getDeck = (languageId: string): Flashcard[] => {
  // combine sample cards + custom cards
  const samples = SAMPLE_FLASHCARDS[languageId] || [];
  
  const customData = localStorage.getItem(KEYS.CUSTOM_DECK);
  const customCards = customData ? JSON.parse(customData) as Flashcard[] : [];
  
  // Filter custom cards for this language
  const relevantCustom = customCards.filter(c => c.language.toLowerCase() === languageId.toLowerCase() || languageId === 'other');

  // We map samples to ensure they have the language property if missing in constants
  const mappedSamples = samples.map(s => ({...s, language: languageId}));

  return [...mappedSamples, ...relevantCustom];
};

export const addCardsToDeck = (newCards: Flashcard[]) => {
  const customData = localStorage.getItem(KEYS.CUSTOM_DECK);
  const currentCustom = customData ? JSON.parse(customData) as Flashcard[] : [];
  const updated = [...currentCustom, ...newCards];
  localStorage.setItem(KEYS.CUSTOM_DECK, JSON.stringify(updated));
};