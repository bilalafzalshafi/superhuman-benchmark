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
    <div className="min-h-screen flex flex-col">
      {/* Game header */}
      <div className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Reaction Time Test</h1>
          <p className="text-xl max-w-2xl mx-auto">
            When the red box turns green, click as quickly as you can.
            <br />
          </p>
          {gameCount < 5 && scores.length > 0 && (
            <div className="mt-4 text-white text-opacity-90">
              <p>Try {5 - gameCount} more times | Last: {scores[scores.length - 1]}ms</p>
            </div>
          )}
        </div>
      </div>

      {/* Game content */}
      <div className="flex-grow bg-blue-500 flex items-center justify-center pb-16">
        {gameCount < 5 ? (
          <div className="w-full max-w-lg px-4">
            <ReactionTime onComplete={handleGameComplete} />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Results</h2>
            <div className="text-6xl font-bold mb-6 text-blue-600">
              {getAverageScore()}
              <span className="text-2xl ml-1 text-gray-500">ms</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-3xl font-bold text-gray-800">{bestScore}ms</p>
                <p className="text-gray-600">Best time</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-3xl font-bold text-gray-800">{scores.length}</p>
                <p className="text-gray-600">Attempts</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setScores([]);
                setBestScore(null);
                setGameCount(0);
              }}
              className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* About section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-800">About the test</h3>
              <p className="text-gray-600 mb-4">
                This is a hardcore version of the standard reaction time test. 
                It's designed to measure how quickly you can respond to a visual stimulus.
              </p>
              <p className="text-gray-600">
                Unlike normal tests, this one will occasionally show "bait" colors to trick you
                into clicking early.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}