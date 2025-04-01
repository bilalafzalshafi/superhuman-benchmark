"use client";

import { useState } from "react";
import GameContainer from "@/components/GameContainer";
import ReactionTime from "@/components/games/ReactionTime";
import { saveScore } from "@/utils/scoreService";

export default function ReactionTimePage() {
  const [scores, setScores] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [gameCount, setGameCount] = useState(0);

  const handleGameComplete = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);
    setGameCount(gameCount + 1);
    
    // Update best score
    if (bestScore === null || score < bestScore) {
      setBestScore(score);
    }
    
    // If this is the 5th attempt, save the average score
    if (gameCount === 4) {
      const sum = newScores.reduce((a, b) => a + b, 0);
      const avgScore = Math.round(sum / newScores.length);
      // Save to score service
      saveScore("Reaction Time", avgScore, "ms");
    }
  };

  const getAverageScore = () => {
    if (scores.length === 0) return null;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  };

  return (
    <GameContainer
      title="Reaction Time"
      description="Test your reactions. Don't get baited by fake signals!"
      instructions="When the red box turns green, click as quickly as you can. Be careful - it might turn a similar color to trick you!"
      backgroundColor="bg-green-500"
      textColor="text-white"
    >
      {gameCount < 5 ? (
        <div className="w-full">
          <div className="mb-4 text-center">
            <p className="text-lg">
              Try {5 - gameCount} more times to get your average
            </p>
            {scores.length > 0 && (
              <p className="text-gray-600">Last: {scores[scores.length - 1]}ms</p>
            )}
          </div>
          <ReactionTime onComplete={handleGameComplete} />
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Your Results</h2>
          <div className="text-6xl font-bold mb-4">
            {getAverageScore()}
            <span className="text-xl ml-1">ms</span>
          </div>
          <p className="mb-6">Average reaction time</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-3xl font-bold">{bestScore}ms</p>
              <p className="text-gray-600">Best time</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-3xl font-bold">{scores.length}</p>
              <p className="text-gray-600">Attempts</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setScores([]);
              setBestScore(null);
              setGameCount(0);
            }}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </GameContainer>
  );
}