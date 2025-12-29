import { LanguageOption, Flashcard } from './types';

export const POPULAR_LANGUAGES: LanguageOption[] = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸', greeting: 'Hola!' },
  { id: 'french', name: 'French', flag: '🇫🇷', greeting: 'Bonjour!' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵', greeting: 'Konnichiwa!' },
  { id: 'german', name: 'German', flag: '🇩🇪', greeting: 'Hallo!' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹', greeting: 'Ciao!' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷', greeting: 'Annyeong!' },
  { id: 'mandarin', name: 'Mandarin', flag: '🇨🇳', greeting: 'Ni Hao!' },
  { id: 'portuguese', name: 'Portuguese', flag: '🇧🇷', greeting: 'Olá!' },
];

export const SYSTEM_INSTRUCTION = `
You are "LingoLoop", a cool, encouraging, and witty vocabulary tutor for teenagers. 
Your goal is to teach foreign language vocabulary in bite-sized pieces.

BEHAVIOR GUIDELINES:
1. **Tone**: Casual, friendly, using appropriate emojis. Not cringey, but fun.
2. **Structure**:
   - IF the user hasn't selected a language, ask them what they want to learn.
   - ONCE a language is known, follow this "Loop":
     a. **Teach**: Introduce ONE new word. Format clearly:
        - **Word**: [Target Word]
        - **Pronunciation**: [Simple phonetic guide if needed]
        - **Meaning**: Simple definition.
        - **Vibe check**: A relatable example sentence (e.g., about school, friends, gaming, food, music).
     b. **Quiz**: Immediately ask a mini-quiz question about THAT word (e.g., "How would you say...?" or a multiple choice).
     c. **Wait**: Stop generating and wait for the user's answer.
     d. **Feedback**: Verify the answer. If correct, celebrate (🎉). If wrong, gently correct.
     e. **Next**: Ask if they are ready for the next word.

3. **Constraint**: 
   - TEACH ONLY ONE WORD AT A TIME. 
   - Keep responses short (under 150 words). 
   - Do NOT give long lists.

4. **Interaction**:
   - If the user asks a specific question, answer it briefly, then return to the "Loop".
   - If the user wants to change topics, adapt but keep the focus on vocabulary.
`;

export const SAMPLE_FLASHCARDS: Record<string, Flashcard[]> = {
  spanish: [
    { id: '1', word: 'La playa', pronunciation: 'la plah-yah', meaning: 'The beach', example: 'Vamos a la playa este fin de semana. 🏖️', language: 'spanish' },
    { id: '2', word: 'Amigo', pronunciation: 'ah-mee-goh', meaning: 'Friend', example: 'Eres mi mejor amigo. 🤝', language: 'spanish' },
    { id: '3', word: 'Comida', pronunciation: 'koh-mee-dah', meaning: 'Food', example: '¡Esta comida es deliciosa! 🌮', language: 'spanish' },
    { id: '4', word: 'Escuela', pronunciation: 'es-kweh-lah', meaning: 'School', example: 'No quiero ir a la escuela hoy. 📚', language: 'spanish' },
  ],
  french: [
    { id: '1', word: 'Le chat', pronunciation: 'luh shah', meaning: 'The cat', example: 'Le chat dort sur le lit. 🐱', language: 'french' },
    { id: '2', word: 'Merci', pronunciation: 'mehr-see', meaning: 'Thank you', example: 'Merci beaucoup pour le cadeau! 🎁', language: 'french' },
    { id: '3', word: 'Fête', pronunciation: 'fet', meaning: 'Party', example: 'On va à une fête ce soir! 🎉', language: 'french' },
  ],
  german: [
    { id: '1', word: 'Genau', pronunciation: 'geh-now', meaning: 'Exactly / Precisely', example: 'Ja, genau! Du hast recht. 👍', language: 'german' },
    { id: '2', word: 'Freunde', pronunciation: 'froyn-duh', meaning: 'Friends', example: 'Ich treffe meine Freunde im Park. 🌳', language: 'german' },
    { id: '3', word: 'Lecker', pronunciation: 'lek-er', meaning: 'Delicious / Yummy', example: 'Das Eis ist super lecker. 🍦', language: 'german' },
  ],
  japanese: [
    { id: '1', word: 'Oishii', pronunciation: 'oh-ee-shee', meaning: 'Delicious', example: 'Kono sushi wa oishii desu! 🍣', language: 'japanese' },
    { id: '2', word: 'Tomodachi', pronunciation: 'toh-moh-dah-chi', meaning: 'Friend', example: 'Kare wa watashi no tomodachi desu. 👫', language: 'japanese' },
    { id: '3', word: 'Kawaii', pronunciation: 'kah-wah-ee', meaning: 'Cute', example: 'Ano inu wa totemo kawaii! 🐕', language: 'japanese' },
  ],
  italian: [
    { id: '1', word: 'Ciao', pronunciation: 'chow', meaning: 'Hello / Goodbye', example: 'Ciao! Come stai? 👋', language: 'italian' },
    { id: '2', word: 'Pizza', pronunciation: 'peet-zah', meaning: 'Pizza', example: 'Voglio mangiare una pizza. 🍕', language: 'italian' },
  ],
  korean: [
    { id: '1', word: 'Daebak', pronunciation: 'dae-bak', meaning: 'Awesome / Big hit', example: 'Wow, that performance was daebak! 🤩', language: 'korean' },
    { id: '2', word: 'Chingu', pronunciation: 'chin-goo', meaning: 'Friend', example: 'We are best chingus. 👯', language: 'korean' },
  ],
  mandarin: [
    { id: '1', word: 'Péngyǒu', pronunciation: 'pung-yo', meaning: 'Friend', example: 'Tā shì wǒ de péngyǒu. 🧑‍🤝‍🧑', language: 'mandarin' },
    { id: '2', word: 'Hǎochī', pronunciation: 'how-chir', meaning: 'Delicious', example: 'Zhège hěn hǎochī. 🍜', language: 'mandarin' },
  ],
  portuguese: [
    { id: '1', word: 'Saudade', pronunciation: 'saw-dah-jee', meaning: 'Missing someone/something', example: 'Tenho saudade de você. 💔', language: 'portuguese' },
    { id: '2', word: 'Legal', pronunciation: 'lay-gow', meaning: 'Cool / Nice', example: 'Esse jogo é muito legal! 🎮', language: 'portuguese' },
  ],
  other: [
    { id: '1', word: 'Hello', pronunciation: '-', meaning: 'Greeting', example: 'Universal greeting.', language: 'other' },
    { id: '2', word: 'World', pronunciation: '-', meaning: 'Planet Earth', example: 'Hello World!', language: 'other' },
  ]
};