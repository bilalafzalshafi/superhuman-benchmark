import { useState, useEffect, useCallback } from "react";

interface SquareProps {
  id: number;
  active: boolean;
  highlighted: boolean;
  onClick: () => void;
  position: { x: number; y: number };
  visible: boolean;
}

// Individual square component
const Square: React.FC<SquareProps> = ({ 
  active, highlighted, onClick, position, visible 
}) => {
  return (
    <div 
      className={`absolute w-16 h-16 rounded transition-all duration-300 ${
        !visible ? 'opacity-0' : 
        active ? 'cursor-pointer opacity-100' : 
        'cursor-pointer opacity-100'
      } ${
        highlighted ? 'bg-blue-500' : 'bg-blue-200'
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: visible ? 'scale(1)' : 'scale(0.5)' 
      }}
      onClick={active && visible ? onClick : undefined}
    />
  );
};

interface SequenceMemoryProps {
  onGameOver: (level: number) => void;
}

export default function SequenceMemory({ onGameOver }: SequenceMemoryProps) {
  const gridSize = 3; // 3x3 grid
  const totalSquares = gridSize * gridSize;
  
  // Generate initial positions
  const generateInitialPositions = () => {
    return Array.from({ length: totalSquares }, (_, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Base positions with some spacing
      return {
        x: col * 100 + 20,
        y: row * 100 + 20
      };
    });
  };
  
  // Game state
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [highlightedSquare, setHighlightedSquare] = useState<number | null>(null);
  const [positions, setPositions] = useState(generateInitialPositions());
  const [visibleSquares, setVisibleSquares] = useState<boolean[]>(Array(totalSquares).fill(true));
  
  // Generate a random sequence based on current level
  const generateSequence = useCallback(() => {
    const newSequence = [...sequence];
    // Add a new random square to the sequence
    newSequence.push(Math.floor(Math.random() * totalSquares));
    return newSequence;
  }, [sequence, totalSquares]);
  
  // Start a new level
  const startLevel = useCallback(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowingSequence(true);
    
    // Reset all squares to visible
    setVisibleSquares(Array(totalSquares).fill(true));
    
    // Show the sequence
    let step = 0;
    const showSequence = setInterval(() => {
      if (step < newSequence.length) {
        setHighlightedSquare(newSequence[step]);
        
        setTimeout(() => {
          setHighlightedSquare(null);
        }, 500);
        
        step++;
      } else {
        clearInterval(showSequence);
        setIsShowingSequence(false);
        
        // Start moving squares at higher levels
        if (level >= 3) {
          moveSquares();
        }
        
        // Start making squares disappear at higher levels
        if (level >= 5) {
          makeSquaresDisappear();
        }
      }
    }, 800);
    
  }, [generateSequence, level]);
  
  // Move squares randomly (for higher difficulty levels)
  const moveSquares = useCallback(() => {
    const moveInterval = setInterval(() => {
      setPositions(prev => {
        return prev.map(pos => {
          // 30% chance to move each square
          if (Math.random() > 0.7) {
            // Random movement within a small range
            const xOffset = (Math.random() - 0.5) * 40;
            const yOffset = (Math.random() - 0.5) * 40;
            
            return {
              x: Math.max(0, Math.min(280, pos.x + xOffset)),
              y: Math.max(0, Math.min(280, pos.y + yOffset))
            };
          }
          return pos;
        });
      });
    }, 1000);
    
    // Stop moving after the user has completed the sequence
    return () => clearInterval(moveInterval);
  }, []);
  
  // Make squares temporarily disappear (for higher difficulty levels)
  const makeSquaresDisappear = useCallback(() => {
    if (level < 5) return;
    
    const disappearInterval = setInterval(() => {
      // Make 1-3 random squares disappear
      const numToHide = Math.floor(Math.random() * 3) + 1;
      const squaresToHide: number[] = [];
      
      while (squaresToHide.length < numToHide) {
        const square = Math.floor(Math.random() * totalSquares);
        if (!squaresToHide.includes(square)) {
          squaresToHide.push(square);
        }
      }
      
      setVisibleSquares(prev => {
        const newVisibility = [...prev];
        squaresToHide.forEach(index => {
          newVisibility[index] = false;
        });
        return newVisibility;
      });
      
      // Make them reappear after a short delay
      setTimeout(() => {
        setVisibleSquares(Array(totalSquares).fill(true));
      }, 800);
      
    }, 2000);
    
    return () => clearInterval(disappearInterval);
  }, [level, totalSquares]);
  
  // Start the game
  useEffect(() => {
    if (sequence.length === 0) {
      startLevel();
    }
  }, [startLevel]);
  
  // Handle square click during user input
  const handleSquareClick = (index: number) => {
    if (isShowingSequence) return;
    
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);
    
    // Highlight the clicked square briefly
    setHighlightedSquare(index);
    setTimeout(() => setHighlightedSquare(null), 300);
    
    // Check if the user's sequence matches so far
    const isCorrect = newUserSequence.every(
      (sq, i) => sq === sequence[i]
    );
    
    if (!isCorrect) {
      // Game over
      onGameOver(level);
      return;
    }
    
    // Check if the user has completed the entire sequence
    if (newUserSequence.length === sequence.length) {
      // Move to the next level
      setLevel(level + 1);
      
      // Short delay before starting next level
      setTimeout(() => {
        startLevel();
      }, 1000);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <div className="text-3xl font-bold mb-4">Level: {level}</div>
        
        {isShowingSequence ? (
          <p>Watch the sequence...</p>
        ) : (
          <p>Your turn - repeat the sequence</p>
        )}
      </div>
      
      <div className="relative h-80 w-full bg-gray-100 rounded">
        {Array.from({ length: totalSquares }).map((_, index) => (
          <Square
            key={index}
            id={index}
            active={!isShowingSequence}
            highlighted={highlightedSquare === index}
            onClick={() => handleSquareClick(index)}
            position={positions[index]}
            visible={visibleSquares[index]}
          />
        ))}
      </div>
    </div>
  );
}