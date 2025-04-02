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
    if (gameState === "ready") {
      // While in ready state, we might show a bait color
      if (colorState === "bait") {
        // Randomly choose between two bait colors
        const baitColor = Math.random() > 0.5 ? colors.bait : colors.lightBait;
        console.log(`Showing bait color: ${baitColor}`);
        return baitColor;
      }
      return colors.ready;
    }
    if (gameState === "started") {
      // In started state, we show the actual green
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
    setColorState("normal");
    
    // Random delay between 1-6 seconds
    const delay = Math.floor(Math.random() * 5000) + 1000;
    
    // Clear any existing timers to prevent issues
    const timers: NodeJS.Timeout[] = [];
    
    // Force at least 1 bait for testing and better experience
    const numberOfBaits = 1 + Math.floor(Math.random() * 2); // 1-2 baits
    console.log(`Setting up ${numberOfBaits} bait colors before actual signal`);
    
    // Schedule each bait
    Array.from({ length: numberOfBaits }).forEach((_, index) => {
      // Make sure baits are spread throughout the waiting period
      const baitDelayPercent = (index + 1) / (numberOfBaits + 1);
      const baitDelay = Math.max(500, delay * baitDelayPercent * 0.8);
      
      const baitTimer = setTimeout(() => {
        // Only show bait if we're still in the ready state
        console.log(`Showing bait color at ${baitDelay}ms`);
        setColorState("bait");
        
        // Reset back to normal state after a brief period
        const resetTimer = setTimeout(() => {
          console.log("Resetting from bait color to red");
          setColorState("normal");
        }, 400);
        
        timers.push(resetTimer);
      }, baitDelay);
      
      timers.push(baitTimer);
    });

    // Schedule the actual signal
    const goTimer = setTimeout(() => {
      console.log("Showing actual green signal");
      setGameState("started");
      setColorState("go");
      setStartTime(performance.now());
    }, delay);
    
    timers.push(goTimer);
    
    // Cleanup function to clear all timers if component unmounts
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

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
      className={`w-full h-80 flex items-center justify-center cursor-pointer transition-colors duration-150 ${getBackgroundColor()} rounded-lg shadow-md`}
      onClick={handleClick}
    >
      <div className="text-white text-2xl font-bold">{getText()}</div>
    </div>
  );
}