import { useState, useEffect, useCallback } from "react";

// List of common words for the game
const baseWords = [
  "time", "person", "year", "way", "day", "thing", "man", "world", 
  "life", "hand", "part", "child", "eye", "woman", "place", "work", 
  "week", "case", "point", "government", "company", "number", "group", 
  "problem", "fact", "money", "water", "month", "lot", "right", "study", 
  "book", "eye", "job", "word", "business", "issue", "side", "kind", 
  "head", "house", "service", "friend", "father", "power", "hour", 
  "game", "line", "end", "member", "law", "car", "city", "community",
  "name", "president", "team", "minute", "idea", "kid", "body", "information",
  "back", "parent", "face", "others", "level", "office", "door", "health",
  "person", "art", "war", "history", "party", "result", "change", "morning",
  "reason", "research", "girl", "guy", "moment", "air", "teacher", "force",
  "education", "entice", "rhythm", "future", "mountain", "journey", "galaxy"
];

interface VerbalMemoryProps {
  onGameOver: (score: number) => void;
}

export default function VerbalMemory({ onGameOver }: VerbalMemoryProps) {
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [seenWords, setSeenWords] = useState<string[]>([]);
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  
  // Modifiers to apply to words to make them tricky
  const modifiers = [
    // Add 's'
    (word: string) => word + "s",
    // Add 'ed'
    (word: string) => word + "ed",
    // Add 'ing'
    (word: string) => word + "ing",
    // Add 'd'
    (word: string) => word + "d",
    // Swap letters
    (word: string) => {
      if (word.length < 3) return word;
      const arr = word.split('');
      const idx = Math.floor(Math.random() * (word.length - 2)) + 1;
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.join('');
    },
    // Duplicate a letter
    (word: string) => {
      if (word.length < 2) return word;
      const idx = Math.floor(Math.random() * word.length);
      return word.slice(0, idx) + word[idx] + word.slice(idx);
    }
  ];

  // Function to generate a modified version of a word
  const modifyWord = (word: string): string => {
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return modifier(word);
  };

  // Initialize or get a new word
  const getNewWord = useCallback(() => {
    // 50% chance to show a modified seen word
    if (originalWords.length > 0 && Math.random() < 0.5) {
      const originalWord = originalWords[Math.floor(Math.random() * originalWords.length)];
      const modifiedWord = modifyWord(originalWord);
      setCurrentWord(modifiedWord);
    } else {
      // Get a word from the base list that hasn't been seen yet
      const availableWords = baseWords.filter(word => !originalWords.includes(word));
      if (availableWords.length === 0) {
        // If we've used all words, game is essentially over
        onGameOver(score);
        return;
      }
      
      const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(newWord);
      setOriginalWords(prev => [...prev, newWord]);
      setSeenWords(prev => [...prev, newWord]);
    }
  }, [originalWords, score, onGameOver]);

  // Initialize the game
  useEffect(() => {
    if (!currentWord) {
      getNewWord();
    }
  }, [currentWord, getNewWord]);

  // Handle player selecting "Seen"
  const handleSeen = () => {
    const isActuallySeen = seenWords.includes(currentWord);
    
    if (isActuallySeen) {
      // Correct - they've seen this exact word
      setScore(score + 1);
    } else {
      // Incorrect - this is a modified word they haven't seen
      setLives(lives - 1);
      
      if (lives <= 1) {
        onGameOver(score);
        return;
      }
    }
    
    getNewWord();
  };

  // Handle player selecting "New"
  const handleNew = () => {
    const isActuallyNew = !seenWords.includes(currentWord);
    
    if (isActuallyNew) {
      // Correct - they haven't seen this word
      setScore(score + 1);
      setSeenWords(prev => [...prev, currentWord]);
    } else {
      // Incorrect - they've seen this word before
      setLives(lives - 1);
      
      if (lives <= 1) {
        onGameOver(score);
        return;
      }
    }
    
    getNewWord();
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="text-5xl font-bold mb-8">{currentWord}</div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSeen}
            className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700 transition-colors"
          >
            SEEN
          </button>
          <button
            onClick={handleNew}
            className="bg-green-600 text-white py-3 px-8 rounded hover:bg-green-700 transition-colors"
          >
            NEW
          </button>
        </div>
      </div>
      
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-gray-600">Score</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{lives}</div>
          <div className="text-gray-600">Lives</div>
        </div>
      </div>
    </div>
  );
}