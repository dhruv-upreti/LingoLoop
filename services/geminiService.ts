import { GoogleGenAI, Chat, GenerateContentResponse, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { UserProfile, Flashcard } from '../types';

let chatInstance: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key missing");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

// --- Chat Logic ---

export const initializeChat = (profile: UserProfile, languageName: string): void => {
  const ai = getGenAI();
  
  const personalizedInstruction = `
    ${SYSTEM_INSTRUCTION}
    
    USER CONTEXT:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Learning: ${languageName}
    
    MULTIMODAL INSTRUCTIONS (IMAGE ANALYSIS):
    When the user sends an image, analyze it closely.
    
    1. **Text Extraction**: If there is visible text, extract it first.
       Format it clearly like this:
       > **Extracted Text:**
       > "..."
    
    2. **Translation & Explanation**: Translate the extracted text to English (and ${languageName} if different).
       Break down difficult vocabulary.
    
    3. **Scene Description**: If it's a photo of an object/scene, describe it in ${languageName}.
       Teach 3-5 relevant words from the image.
    
    4. **Tone**: Keep it helpful and beginner-friendly.
  `;

  chatInstance = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: personalizedInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (text: string, imageBase64?: string): Promise<string> => {
  if (!chatInstance) throw new Error("Chat not initialized");
  try {
    let messagePayload: any = text;

    if (imageBase64) {
      // Clean base64 string (remove data URL prefix if present for API)
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
      
      messagePayload = [
        { text: text || "Analyze this image and extract any text." },
        { 
          inlineData: { 
            mimeType: mimeType, 
            data: base64Data 
          } 
        }
      ];
    }

    const response: GenerateContentResponse = await chatInstance.sendMessage({ message: messagePayload });
    return response.text || "Sorry, I missed that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain froze. 🧊 Try again?";
  }
};

export const resetChat = () => {
  chatInstance = null;
};

// --- Flashcard Generator Logic ---

const chunkText = (text: string, maxLength: number = 4000): string[] => {
  const chunks: string[] = [];
  let currentChunk = '';
  const lines = text.split('\n');
  
  for (const line of lines) {
    // If a single line is massive (unlikely but possible), split it? 
    // For now assume lines are reasonable.
    if (currentChunk.length + line.length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
    }
    currentChunk += line + '\n';
  }
  if (currentChunk.trim().length > 0) chunks.push(currentChunk);
  return chunks;
};

export const generateFlashcardsFromText = async (text: string, language: string, onProgress?: (status: string) => void): Promise<Flashcard[]> => {
  const ai = getGenAI();
  const chunks = chunkText(text);
  const accumulatedCards: any[] = [];
  
  const flashcardSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING, description: "The word in the target language" },
        meaning: { type: Type.STRING, description: "English translation" },
        example: { type: Type.STRING, description: "A simple example sentence in the target language" },
        pronunciation: { type: Type.STRING, description: "Simple phonetic pronunciation guide" }
      },
      required: ["word", "meaning", "example"]
    }
  };

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (onProgress) {
        onProgress(`Processing part ${i + 1} of ${chunks.length}...`);
    }

    const prompt = `
      You are a rigorous Flashcard Generator for students learning ${language}.
      
      INPUT TEXT CHUNK:
      """
      ${chunk}
      """
      
      TASK:
      Convert the input text into flashcards.
      
      CRITICAL RULES:
      1. LIST MODE: If the input looks like a list of words (e.g. "Word - Meaning" or just a column of words):
         - You MUST create a flashcard for EVERY SINGLE LINE/ITEM in this chunk.
         - Do not skip any entries.
         - Do not summarize or group them.
         - If a line is just a word, generate the meaning and example yourself.
      2. TEXT MODE: If the input is a paragraph/story:
         - Extract at least 15 distinct vocabulary words from this text chunk.
         - Choose words that are useful for learners (nouns, verbs, adjectives).
      
      Output JSON only.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: flashcardSchema,
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed)) {
            accumulatedCards.push(...parsed);
        }
      }
    } catch (e) {
      console.error(`Error processing chunk ${i}:`, e);
      // Continue to next chunk even if one fails
    }
  }

  // Transform to match our Flashcard interface
  return accumulatedCards.map((item: any, index: number) => ({
    id: `gen-${Date.now()}-${index}`,
    word: item.word,
    meaning: item.meaning,
    example: item.example,
    pronunciation: item.pronunciation,
    language: language.toLowerCase(), // Normalize ID
    source: 'pdf'
  }));
};

// --- Dashboard Motivation Logic ---

export const getDashboardMotivation = async (profile: UserProfile, streak: number): Promise<string> => {
  const ai = getGenAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very short, punchy, 1-sentence motivation for ${profile.name} (Age: ${profile.age}) who is learning ${profile.languages.join(', ')}. Current streak: ${streak} days. Mention one of the languages.`,
      config: {
        maxOutputTokens: 50,
        temperature: 0.8
      }
    });
    return response.text || "Keep up the great work! 🔥";
  } catch (e) {
    return "Time to learn something new today! 🚀";
  }
};