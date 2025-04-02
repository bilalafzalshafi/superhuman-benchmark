import { useState, useEffect, useCallback, useRef } from "react";

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
  "education", "book", "rhythm", "future", "mountain", "journey", "galaxy"
];

// Word modification strategies
const modifyWord = (word: string) => {
  const strategies = [
    // Add suffix
    () => word + "s",
    () => word + "ed",
    () => word + "ing",
    () => word + "er",
    
    // Simple misspelling (swap adjacent letters)
    () => {
      if (word.length < 3) return word + "s"; // Fallback for very short words
      const idx = Math.floor(Math.random() * (word.length - 2)) + 1;
      const chars = word.split('');
      [chars[idx], chars[idx+1]] = [chars[idx+1], chars[idx]];
      return chars.join('');
    },
    
    // Double a letter
    () => {
      if (word.length < 2) return word + "s"; // Fallback for very short words
      const idx = Math.floor(Math.random() * word.length);
      return word.slice(0, idx) + word[idx] + word.slice(idx);
    },
    
    // Add a prefix
    () => "re" + word,
    () => "un" + word,
  ];
  
  // Select a random modification strategy
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  return strategy();
};

interface VerbalMemoryProps {
  onGameOver: (score: number) => void;
}

export default function VerbalMemory({ onGameOver }: VerbalMemoryProps) {
  // Core game state
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  
  // Word tracking
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [availableWords, setAvailableWords] = useState<string[]>([...baseWords]);
  const [lastAction, setLastAction] = useState("");
  
  // For logging/debugging
  const [gameLog, setGameLog] = useState<string[]>([]);
  
  // Initialize the game
  useEffect(() => {
    if (!currentWord) {
      selectNewWord();
    }
  }, []);
  
  // Add to game log
  const log = useCallback((message: string) => {
    console.log(message);
    setGameLog(prev => [message, ...prev.slice(0, 19)]);
  }, []);
  
  // Select a completely new word from the available words pool
  const selectNewWord = useCallback(() => {
    if (availableWords.length === 0) {
      log("No more available words, game over");
      onGameOver(score);
      return;
    }
    
    // Get a random index and select that word
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWord = availableWords[randomIndex];
    
    // Remove from available words to avoid repetition
    setAvailableWords(prev => prev.filter((_, idx) => idx !== randomIndex));
    
    setCurrentWord(newWord);
    log(`Selected new word: ${newWord}`);
    setLastAction(`New word: ${newWord}`);
    
    // Note: we don't add to seenWords yet - only after player sees it
  }, [availableWords, score, onGameOver, log]);
  
  // Select a word the player has already seen
  const selectSeenWord = useCallback(() => {
    if (seenWords.size === 0) {
      log("No seen words available, selecting a new word");
      selectNewWord();
      return;
    }
    
    // Convert set to array for random selection
    const seenWordsArray = Array.from(seenWords);
    
    // Choose between showing an exact word or a variation
    const useExactWord = Math.random() < 0.3; // 30% chance to show exact word

    if (useExactWord) {
      // Select a random word the player has already seen
      const randomWord = seenWordsArray[Math.floor(Math.random() * seenWordsArray.length)];
      setCurrentWord(randomWord);
      log(`Showing exact seen word: ${randomWord}`);
      setLastAction(`Showing exact seen word: ${randomWord}`);
    } else {
      // Select a random word to modify
      const baseWord = seenWordsArray[Math.floor(Math.random() * seenWordsArray.length)];
      const modifiedWord = modifyWord(baseWord);
      
      // If by chance the modification is exactly the same as another seen word, try again
      if (seenWords.has(modifiedWord)) {
        log(`Modified word (${modifiedWord}) already seen, trying again`);
        selectSeenWord();
        return;
      }
      
      setCurrentWord(modifiedWord);
      log(`Showing modified word: ${modifiedWord} (from ${baseWord})`);
      setLastAction(`Modified from: ${baseWord}`);
    }
  }, [seenWords, selectNewWord, log]);
  
  // Choose the next word to show
  const getNextWord = useCallback(() => {
    // If no words seen yet, always show a new word
    if (seenWords.size === 0) {
      selectNewWord();
      return;
    }
    
    // After player has seen at least one word, show new vs. seen based on probability
    // The more words they've seen, the more likely to show a seen/modified word
    const percentSeen = Math.min(80, 30 + seenWords.size * 5); // 30% base + 5% per seen word, max 80%
    const showSeen = Math.random() * 100 < percentSeen;
    
    log(`Deciding next word (${percentSeen}% chance of seen word): ${showSeen ? 'SEEN' : 'NEW'}`);
    
    if (showSeen) {
      selectSeenWord();
    } else {
      selectNewWord();
    }
  }, [seenWords, selectNewWord, selectSeenWord, log]);

  // Handle player selecting "Seen"
  const handleSeen = () => {
    log(`Player clicked SEEN for: "${currentWord}"`);
    
    const hasSeen = seenWords.has(currentWord);
    
    if (hasSeen) {
      // Correct - they've seen this exact word
      const newScore = score + 1;
      setScore(newScore);
      log(`✓ Correct! Score now: ${newScore}`);
      setLastAction(`✓ Correct: "${currentWord}" has been seen before`);
    } else {
      // Incorrect - they haven't seen this word before
      const newLives = lives - 1;
      setLives(newLives);
      log(`✗ Incorrect! Lives now: ${newLives}`);
      setLastAction(`✗ Incorrect: "${currentWord}" is a new word`);
      
      // Add to seen words since player has now seen it
      setSeenWords(prev => new Set(prev).add(currentWord));
      
      if (newLives <= 0) {
        log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Wait a moment for feedback, then show next word
    setTimeout(() => getNextWord(), 400);
  };

  // Handle player selecting "New"
  const handleNew = () => {
    log(`Player clicked NEW for: "${currentWord}"`);
    
    const hasSeen = seenWords.has(currentWord);
    
    if (!hasSeen) {
      // Correct - this is a new word
      const newScore = score + 1;
      setScore(newScore);
      log(`✓ Correct! Score now: ${newScore}`);
      setLastAction(`✓ Correct: "${currentWord}" is a new word`);
    } else {
      // Incorrect - they have seen this word before
      const newLives = lives - 1;
      setLives(newLives);
      log(`✗ Incorrect! Lives now: ${newLives}`);
      setLastAction(`✗ Incorrect: "${currentWord}" has been seen before`);
      
      if (newLives <= 0) {
        log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Always add current word to seen words after player responds
    setSeenWords(prev => new Set(prev).add(currentWord));
    
    // Wait a moment for feedback, then show next word
    setTimeout(() => getNextWord(), 400);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 flex flex-col items-center">
      <div className="mb-10 text-center w-full">
        <div className="text-5xl font-bold mb-10 text-gray-800">{currentWord}</div>
        
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
      
      {/* Debug info - remove in production */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>Last action: {lastAction}</p>
        <p>Unique words seen: {seenWords.size}</p>
        <p>Current word status: {seenWords.has(currentWord) ? "SEEN" : "NEW"}</p>
        
        {/* Detailed log - typically hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-2">
            <summary>Game Log</summary>
            <div className="mt-2 text-left bg-gray-100 p-2 rounded text-gray-500 max-h-32 overflow-auto text-xs">
              {gameLog.map((entry, i) => <div key={i}>{entry}</div>)}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}