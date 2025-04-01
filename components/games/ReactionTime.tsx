import { useState, useEffect, useCallback } from "react";

type GameState = "waiting" | "ready" | "started" | "finished" | "failed";
type ColorType = "normal" | "bait" | "go";

interface ReactionTimeProps {
  onComplete: (score: number) => void;
}

export default function ReactionTime({ onComplete }: ReactionTimeProps) {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [colorState, setColorState] = useState<ColorType>("normal");

  // Colors for different states
  const colors = {
    normal: "bg-blue-500",
    ready: "bg-red-500",
    bait: "bg-pink-400", // Bait color - similar to green but different
    lightBait: "bg-green-200", // Light green bait
    go: "bg-green-500", // The actual target color
    failed: "bg-gray-500",
  };

  // Get current background color based on state
  const getBackgroundColor = () => {
    if (gameState === "waiting") return colors.normal;
    if (gameState === "ready") return colors.ready;
    if (gameState === "started") {
      if (colorState === "normal") return colors.normal;
      if (colorState === "bait") {
        // Randomly choose between two bait colors
        return Math.random() > 0.5 ? colors.bait : colors.lightBait;
      }
      return colors.go;
    }
    if (gameState === "failed") return colors.failed;
    return colors.normal;
  };

  // Get text based on game state
  const getText = () => {
    if (gameState === "waiting") return "Click to start";
    if (gameState === "ready") return "Wait for green...";
    if (gameState === "started" && colorState === "go") return "Click!";
    if (gameState === "started") return "Wait...";
    if (gameState === "finished") return `${reactionTime}ms`;
    if (gameState === "failed") return "Too early! Click to retry";
    return "";
  };

  // Start the game
  const startGame = useCallback(() => {
    setGameState("ready");
    
    // Random delay between 1-6 seconds
    const delay = Math.floor(Math.random() * 5000) + 1000;
    
    // Set up potential baits
    const numberOfBaits = Math.floor(Math.random() * 3); // 0-2 baits
    
    // Schedule each bait
    Array.from({ length: numberOfBaits }).forEach((_, index) => {
      const baitDelay = Math.random() * delay * 0.8; // Baits happen before the real signal
      
      setTimeout(() => {
        if (gameState !== "finished" && gameState !== "failed") {
          setColorState("bait");
          
          // Reset back to normal state after a brief period
          setTimeout(() => {
            if (gameState !== "finished" && gameState !== "failed") {
              setColorState("normal");
            }
          }, 300);
        }
      }, baitDelay);
    });

    // Schedule the actual signal
    setTimeout(() => {
      if (gameState === "ready") {
        setGameState("started");
        setColorState("go");
        setStartTime(performance.now());
      }
    }, delay);
  }, [gameState]);

  // Handle click based on game state
  const handleClick = () => {
    if (gameState === "waiting" || gameState === "failed") {
      startGame();
    } else if (gameState === "ready") {
      // Clicked too early
      setGameState("failed");
    } else if (gameState === "started") {
      if (colorState === "go") {
        // Correct click on green
        const clickTime = performance.now();
        setEndTime(clickTime);
        const reaction = Math.round(clickTime - (startTime || 0));
        setReactionTime(reaction);
        setGameState("finished");
        onComplete(reaction);
      } else {
        // Clicked on a bait color
        setGameState("failed");
      }
    } else if (gameState === "finished") {
      // Reset the game
      setStartTime(null);
      setEndTime(null);
      setReactionTime(null);
      setGameState("waiting");
    }
  };

  return (
    <div
      className={`w-full max-w-md h-96 flex items-center justify-center cursor-pointer transition-colors duration-150 ${getBackgroundColor()}`}
      onClick={handleClick}
    >
      <div className="text-white text-2xl font-bold">{getText()}</div>
    </div>
  );
}