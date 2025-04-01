"use client";

import { useState } from "react";
import GameContainer from "@/components/GameContainer";
import TypingSpeed from "@/components/games/TypingSpeed";

export default function TypingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<{ wpm: number; accuracy: number } | null>(null);

  const handleGameComplete = (wpm: number, accuracy: number) => {
    setResults({ wpm, accuracy });
    setIsPlaying(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setResults(null);
  };

  return (
    <GameContainer
      title="Typing Speed"
      description="How fast can you type when everything is changing?"
      instructions="Type the text as quickly and accurately as possible. Careful! The text will change while you're typing, and you might need to go back and fix what you've already typed."
      backgroundColor="bg-orange-500"
      textColor="text-white"
    >
      {!isPlaying && !results ? (
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How it works</h2>
            <p className="max-w-md mx-auto mb-6">
              Type the text displayed as quickly and accurately as possible.
              The text ahead of you will change as you type, and sometimes
              the text you've already typed will also change, forcing you
              to delete and retype it!
            </p>
            <p className="text-gray-600 mb-8">
              Your score will be based on words per minute (WPM) and accuracy.
            </p>
          </div>

          <button
            onClick={startGame}
            className="bg-orange-600 text-white py-3 px-8 rounded hover:bg-orange-700 transition-colors"
          >
            Start
          </button>
        </div>
      ) : results ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Your Results</h2>
          
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
            <div className="bg-gray-100 p-6 rounded">
              <p className="text-4xl font-bold">{results.wpm}</p>
              <p className="text-gray-600">Words Per Minute</p>
            </div>
            <div className="bg-gray-100 p-6 rounded">
              <p className="text-4xl font-bold">{results.accuracy}%</p>
              <p className="text-gray-600">Accuracy</p>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="bg-orange-600 text-white py-3 px-8 rounded hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <TypingSpeed onComplete={handleGameComplete} />
      )}
    </GameContainer>
  );
}