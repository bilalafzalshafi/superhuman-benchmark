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
  // Store all exact words we've shown to the user
  const [seenWords, setSeenWords] = useState<string[]>([]);
  // Store original base words
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  // For debugging
  const [lastAction, setLastAction] = useState<string>("");
  
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
    // For debugging - log current state
    console.log(`Current state - Score: ${score}, Lives: ${lives}`);
    console.log(`Original words: ${originalWords.length}, Seen words: ${seenWords.length}`);
    
    // 50% chance to show a modified seen word - but only if we have original words
    if (originalWords.length > 0 && Math.random() < 0.5) {
      try {
        const originalWord = originalWords[Math.floor(Math.random() * originalWords.length)];
        const modifiedWord = modifyWord(originalWord);
        
        console.log(`Generated modified word: ${modifiedWord} (from ${originalWord})`);
        
        // Set the current word - we don't need to check if we've seen this exact modification
        // Since modified words are not added to seenWords until user clicks NEW or SEEN
        setCurrentWord(modifiedWord);
        setLastAction(`Showing modified: ${modifiedWord} (from ${originalWord})`);
      } catch (error) {
        console.error("Error generating modified word:", error);
        // Fallback to a new word if something goes wrong
        showNewBaseWord();
      }
    } else {
      showNewBaseWord();
    }
  }, [originalWords, score, lives, onGameOver, seenWords]);
  
  // Helper function to show a completely new base word
  const showNewBaseWord = useCallback(() => {
    // Get a completely new word from the base list
    const availableWords = baseWords.filter(word => !originalWords.includes(word));
    if (availableWords.length === 0) {
      // If we've used all words, game is essentially over
      console.log("No more available words, game over");
      onGameOver(score);
      return;
    }
    
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    
    // For a new base word, we add it to both original and seen words lists
    setOriginalWords(prev => [...prev, newWord]);
    setSeenWords(prev => [...prev, newWord]);
    
    console.log(`Showing brand new word: ${newWord}`);
    setLastAction(`Showing new base word: ${newWord}`);
  }, [originalWords, score, onGameOver]);

  // Initialize the game
  useEffect(() => {
    if (!currentWord) {
      getNewWord();
    }
  }, [currentWord, getNewWord]);

  // Handle player selecting "Seen"
  const handleSeen = () => {
    console.log(`Player clicked SEEN for word: "${currentWord}"`);
    console.log(`Current seen words: ${seenWords.join(', ')}`);
    
    const isActuallySeen = seenWords.includes(currentWord);
    
    if (isActuallySeen) {
      // Correct - they've seen this exact word
      setScore(score + 1);
      console.log(`✓ Correct: "${currentWord}" has been seen before`);
      setLastAction(`✓ Correct: "${currentWord}" has been seen before`);
    } else {
      // Incorrect - this is a word they haven't seen
      setLives(lives - 1);
      console.log(`✗ Incorrect: "${currentWord}" is a new word, not seen before`);
      setLastAction(`✗ Incorrect: "${currentWord}" is a new word`);
      
      // Add to seen words since they've now seen it
      setSeenWords(prev => {
        const updated = [...prev, currentWord];
        console.log(`Updated seen words: ${updated.join(', ')}`);
        return updated;
      });
      
      if (lives <= 1) {
        console.log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Get next word after a short delay to give visual feedback
    setTimeout(() => {
      getNewWord();
    }, 300);
  };

  // Handle player selecting "New"
  const handleNew = () => {
    console.log(`Player clicked NEW for word: "${currentWord}"`);
    console.log(`Current seen words: ${seenWords.join(', ')}`);
    
    const isActuallyNew = !seenWords.includes(currentWord);
    
    if (isActuallyNew) {
      // Correct - they haven't seen this word
      setScore(score + 1);
      console.log(`✓ Correct: "${currentWord}" is a new word, not seen before`);
      setLastAction(`✓ Correct: "${currentWord}" is a new word`);
      
      // Add to seen words now that they've seen it
      setSeenWords(prev => {
        const updated = [...prev, currentWord];
        console.log(`Updated seen words: ${updated.join(', ')}`);
        return updated;
      });
    } else {
      // Incorrect - they've seen this word before
      setLives(lives - 1);
      console.log(`✗ Incorrect: "${currentWord}" has been seen before`);
      setLastAction(`✗ Incorrect: "${currentWord}" has been seen before`);
      
      if (lives <= 1) {
        console.log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Get next word after a short delay to give visual feedback
    setTimeout(() => {
      getNewWord();
    }, 300);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 flex flex-col items-center">
      <div className="mb-12 text-center w-full">
        <div className="text-5xl font-bold mb-10">{currentWord}</div>
        
        <div className="flex gap-6 justify-center">
          <button
            onClick={handleSeen}
            className="bg-blue-600 text-white py-3 px-10 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            SEEN
          </button>
          <button
            onClick={handleNew}
            className="bg-green-600 text-white py-3 px-10 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            NEW
          </button>
        </div>
      </div>
      
      <div className="flex gap-16 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">{score}</div>
          <div className="text-gray-600">Score</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">{lives}</div>
          <div className="text-gray-600">Lives</div>
        </div>
      </div>
      
      {/* Debug info - this helps during development */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>Last action: {lastAction}</p>
        <p>Total unique words seen: {seenWords.length}</p>
        <p>Is current word in seen list: {seenWords.includes(currentWord) ? "YES" : "NO"}</p>
        <details className="mt-2">
          <summary>Debug info</summary>
          <div className="mt-2 text-left bg-gray-100 p-2 rounded text-gray-600 max-h-32 overflow-auto">
            <p>Current word: {currentWord}</p>
            <p>Original words: {originalWords.length}</p>
            <p>Recent seen words: {seenWords.slice(-5).join(', ')}</p>
          </div>
        </details>
      </div>
    </div>
  );
}