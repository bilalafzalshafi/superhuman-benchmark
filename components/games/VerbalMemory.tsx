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
  const [seenWords, setSeenWords] = useState<string[]>([]); // Words the user has seen
  const [lastAction, setLastAction] = useState<string>("");
  const [usedBaseWords, setUsedBaseWords] = useState<string[]>([]); // Base words we've used

  // Initialize with the first word
  useEffect(() => {
    if (!currentWord) {
      showNewBaseWord();
    }
  }, []);

  // Modifiers to apply to words to make them tricky
  const applyModifier = (word: string): string => {
    // Common modifiers for words
    const modifiers = [
      (w: string) => w + "s",    // Add 's'
      (w: string) => w + "ed",   // Add 'ed'
      (w: string) => w + "ing",  // Add 'ing'
      (w: string) => w + "d",    // Add 'd'
      (w: string) => {           // Swap letters
        if (w.length < 3) return w;
        const arr = w.split('');
        const idx = Math.floor(Math.random() * (w.length - 2)) + 1;
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
        return arr.join('');
      },
      (w: string) => {          // Duplicate a letter
        if (w.length < 2) return w;
        const idx = Math.floor(Math.random() * w.length);
        return w.slice(0, idx) + w[idx] + w.slice(idx);
      }
    ];
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return modifier(word);
  };

  // Show a completely new base word (one we've never used before)
  const showNewBaseWord = useCallback(() => {
    console.log("Getting a new base word");
    // Get a completely new word from the base list
    const availableWords = baseWords.filter(word => !usedBaseWords.includes(word));
    
    if (availableWords.length === 0) {
      console.log("No more available words, game over");
      onGameOver(score);
      return;
    }
    
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    console.log(`Selected new base word: ${newWord}`);
    
    // Set the current word
    setCurrentWord(newWord);
    
    // Mark this base word as used
    setUsedBaseWords(prev => [...prev, newWord]);
    
    // DO NOT add to seen words yet - wait for user response
    setLastAction(`New base word: ${newWord}`);
  }, [usedBaseWords, score, onGameOver]);

  // Show a modified version of a word the user has already seen
  const showModifiedWord = useCallback(() => {
    if (seenWords.length === 0) {
      console.log("No seen words to modify, showing new base word instead");
      showNewBaseWord();
      return;
    }
    
    // Select a random word the user has already seen
    const baseWord = seenWords[Math.floor(Math.random() * seenWords.length)];
    console.log(`Selected word to modify: ${baseWord}`);
    
    // Apply a modifier
    const modifiedWord = applyModifier(baseWord);
    console.log(`Modified to: ${modifiedWord}`);
    
    // Set as current word
    setCurrentWord(modifiedWord);
    setLastAction(`Modified from: ${baseWord}`);
  }, [seenWords, showNewBaseWord]);

  // Get next word - either new or modified
  const getNextWord = useCallback(() => {
    console.log("Getting next word");
    console.log(`Current stats - Score: ${score}, Lives: ${lives}`);
    console.log(`Seen words count: ${seenWords.length}`);
    
    // For very first word or if we have no seen words yet, always show a new base word
    if (seenWords.length === 0) {
      showNewBaseWord();
      return;
    }
    
    // Otherwise 50/50 chance of new vs modified
    const showNew = Math.random() < 0.5;
    
    if (showNew) {
      showNewBaseWord();
    } else {
      showModifiedWord();
    }
  }, [score, lives, seenWords.length, showNewBaseWord, showModifiedWord]);

  // Handle player selecting "Seen"
  const handleSeen = () => {
    console.log(`Player clicked SEEN for word: "${currentWord}"`);
    console.log(`Current seen words: ${seenWords.join(', ')}`);
    
    const hasSeen = seenWords.includes(currentWord);
    console.log(`Has seen this word before: ${hasSeen}`);
    
    if (hasSeen) {
      // Correct - they've seen this exact word
      setScore(score + 1);
      console.log(`✓ Correct! Score: ${score + 1}`);
      setLastAction(`✓ Correct: "${currentWord}" has been seen before`);
    } else {
      // Incorrect - this is a word they haven't seen
      setLives(lives - 1);
      console.log(`✗ Incorrect! Lives: ${lives - 1}`);
      setLastAction(`✗ Incorrect: "${currentWord}" is a new word`);
      
      // Add to seen words regardless
      setSeenWords(prev => [...prev, currentWord]);
      
      if (lives <= 1) {
        console.log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Get next word after a short delay
    setTimeout(() => getNextWord(), 300);
  };

  // Handle player selecting "New"
  const handleNew = () => {
    console.log(`Player clicked NEW for word: "${currentWord}"`);
    console.log(`Current seen words: ${seenWords.join(', ')}`);
    
    const hasSeen = seenWords.includes(currentWord);
    console.log(`Has seen this word before: ${hasSeen}`);
    
    if (!hasSeen) {
      // Correct - they haven't seen this word
      setScore(score + 1);
      console.log(`✓ Correct! Score: ${score + 1}`);
      setLastAction(`✓ Correct: "${currentWord}" is a new word`);
    } else {
      // Incorrect - they've seen this word before
      setLives(lives - 1);
      console.log(`✗ Incorrect! Lives: ${lives - 1}`);
      setLastAction(`✗ Incorrect: "${currentWord}" has been seen before`);
      
      if (lives <= 1) {
        console.log(`Game over with score: ${score}`);
        onGameOver(score);
        return;
      }
    }
    
    // Always add the current word to the seen list
    setSeenWords(prev => [...prev, currentWord]);
    
    // Get next word after a short delay
    setTimeout(() => getNextWord(), 300);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 flex flex-col items-center">
      <div className="mb-12 text-center w-full">
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
      
      {/* Debug info - this helps during development */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>Last action: {lastAction}</p>
        <p>Total unique words seen: {seenWords.length}</p>
        <p>Current word status: {seenWords.includes(currentWord) ? "SEEN" : "NEW"}</p>
      </div>
    </div>
  );
}