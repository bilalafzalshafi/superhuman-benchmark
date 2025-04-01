import { useState, useEffect, useRef, useCallback } from "react";

// Sample texts for typing
const texts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
  "Artificial intelligence is transforming how we interact with technology. Machine learning algorithms are becoming increasingly sophisticated.",
  "Video games have evolved from simple pixelated graphics to immersive virtual realities. Game designers create innovative experiences for players.",
  "The internet has revolutionized communication and access to information. Social media platforms connect people across vast distances.",
  "Climate change poses significant challenges to global ecosystems. Scientists study the impact of rising temperatures on weather patterns.",
  "Space exploration continues to push the boundaries of human knowledge. Astronauts conduct experiments in the unique environment of orbit.",
];

// Function to calculate words per minute
const calculateWPM = (characterCount: number, timeInSeconds: number): number => {
  // Average word length is considered to be 5 characters
  const wordsTyped = characterCount / 5;
  const minutesElapsed = timeInSeconds / 60;
  return Math.round(wordsTyped / minutesElapsed);
};

interface TypingSpeedProps {
  onComplete: (wpm: number, accuracy: number) => void;
}

export default function TypingSpeed({ onComplete }: TypingSpeedProps) {
  // Select a random text
  const getRandomText = () => texts[Math.floor(Math.random() * texts.length)];
  
  // State
  const [originalText, setOriginalText] = useState(getRandomText());
  const [displayText, setDisplayText] = useState(originalText);
  const [inputText, setInputText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textChangeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Start timer on first keypress
  const startTimer = useCallback(() => {
    if (startTime === null) {
      setStartTime(Date.now());
      
      // Setup intervals to change text
      setupTextChanges();
    }
  }, [startTime]);
  
  // Setup changing text intervals
  const setupTextChanges = useCallback(() => {
    // Clear any existing interval
    if (textChangeIntervalRef.current) {
      clearInterval(textChangeIntervalRef.current);
    }
    
    // Set interval to change upcoming text
    textChangeIntervalRef.current = setInterval(() => {
      setDisplayText(prevText => {
        const typedLength = inputText.length;
        
        // Don't modify already typed text
        const typedPortion = prevText.substring(0, typedLength);
        let remainingPortion = prevText.substring(typedLength);
        
        // 50% chance to modify the text
        if (Math.random() < 0.5 && remainingPortion.length > 10) {
          // Select a random word to change
          const words = remainingPortion.split(' ');
          if (words.length > 1) {
            const randomIndex = Math.floor(Math.random() * (words.length - 1)) + 1;
            
            // Replace the word with a similar length random string
            const originalWord = words[randomIndex];
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            let newWord = '';
            
            for (let i = 0; i < originalWord.length; i++) {
              newWord += letters[Math.floor(Math.random() * letters.length)];
            }
            
            words[randomIndex] = newWord;
            remainingPortion = words.join(' ');
          }
        }
        
        // 20% chance to also modify already typed text (evil mode)
        if (Math.random() < 0.2 && typedPortion.length > 10) {
          const typedWords = typedPortion.split(' ');
          if (typedWords.length > 2) {
            const randomIndex = Math.floor(Math.random() * (typedWords.length - 1)) + 1;
            
            // Add or remove a character
            let modifiedWord = typedWords[randomIndex];
            const modType = Math.floor(Math.random() * 3);
            
            if (modType === 0 && modifiedWord.length > 3) {
              // Remove a character
              const posToRemove = Math.floor(Math.random() * modifiedWord.length);
              modifiedWord = modifiedWord.substring(0, posToRemove) + modifiedWord.substring(posToRemove + 1);
            } else if (modType === 1) {
              // Add a character
              const posToAdd = Math.floor(Math.random() * modifiedWord.length);
              const letters = 'abcdefghijklmnopqrstuvwxyz';
              const charToAdd = letters[Math.floor(Math.random() * letters.length)];
              modifiedWord = modifiedWord.substring(0, posToAdd) + charToAdd + modifiedWord.substring(posToAdd);
            } else {
              // Swap two characters
              if (modifiedWord.length > 1) {
                const posToSwap = Math.floor(Math.random() * (modifiedWord.length - 1));
                modifiedWord = modifiedWord.substring(0, posToSwap) + 
                               modifiedWord[posToSwap + 1] + 
                               modifiedWord[posToSwap] + 
                               modifiedWord.substring(posToSwap + 2);
              }
            }
            
            typedWords[randomIndex] = modifiedWord;
            return typedWords.join(' ') + remainingPortion;
          }
        }
        
        return typedPortion + remainingPortion;
      });
    }, 2000);
    
    return () => {
      if (textChangeIntervalRef.current) {
        clearInterval(textChangeIntervalRef.current);
      }
    };
  }, [inputText]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTimer();
    
    const newValue = e.target.value;
    setInputText(newValue);
    
    // Check for errors
    let errorCount = 0;
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] !== displayText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    // Check if completed
    if (newValue.length >= displayText.length) {
      setEndTime(Date.now());
      setIsCompleted(true);
      
      if (textChangeIntervalRef.current) {
        clearInterval(textChangeIntervalRef.current);
      }
      
      // Calculate WPM and accuracy
      const totalChars = displayText.length;
      const timeSeconds = ((Date.now() - (startTime || Date.now())) / 1000);
      const calculatedWPM = calculateWPM(totalChars, timeSeconds);
      const calculatedAccuracy = Math.max(0, Math.round(100 * (1 - errorCount / totalChars)));
      
      setWpm(calculatedWPM);
      setAccuracy(calculatedAccuracy);
      onComplete(calculatedWPM, calculatedAccuracy);
    }
  };
  
  // Render typed text with error highlighting
  const renderText = () => {
    const typedLength = inputText.length;
    
    return (
      <div className="mb-6 text-lg leading-relaxed">
        <span className="bg-green-100">
          {displayText.substring(0, typedLength).split('').map((char, index) => (
            <span 
              key={index} 
              className={char === inputText[index] ? "text-black" : "text-red-500 bg-red-100"}
            >
              {char}
            </span>
          ))}
        </span>
        <span className="text-gray-800">{displayText.substring(typedLength)}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-2xl">
      {!isCompleted ? (
        <>
          {renderText()}
          
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Start typing..."
            disabled={isCompleted}
          />
          
          <div className="flex justify-between mt-4 text-gray-600">
            <div>Characters: {inputText.length} / {displayText.length}</div>
            <div>Errors: {errors}</div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Completed!</h2>
          
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-6">
            <div>
              <p className="text-4xl font-bold">{wpm}</p>
              <p className="text-gray-600">WPM</p>
            </div>
            <div>
              <p className="text-4xl font-bold">{accuracy}%</p>
              <p className="text-gray-600">Accuracy</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}