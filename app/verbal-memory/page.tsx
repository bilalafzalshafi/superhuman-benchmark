"use client";

import { useState } from "react";
import GameContainer from "@/components/GameContainer";
import VerbalMemory from "@/components/games/VerbalMemory";

export default function VerbalMemoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setIsPlaying(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setFinalScore(null);
  };

  return (
    <GameContainer
      title="Verbal Memory"
      description="Keep as many words in memory as possible."
      instructions="You'll be shown words one at a time. Press SEEN if you've seen the word during this game, otherwise press NEW. But watch out for tricky variations of words you've seen!"
      backgroundColor="bg-purple-500"
      textColor="text-white"
    >
      {!isPlaying ? (
        <div className="text-center">
          {finalScore !== null ? (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Game Over</h2>
              <p className="text-6xl font-bold mb-4">{finalScore}</p>
              <p className="text-gray-600 mb-8">words remembered</p>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How it works</h2>
              <p className="max-w-md mx-auto mb-6">
                You'll be shown words one at a time. For each word, you need to 
                decide if you've seen it before in this game. Be careful - you'll 
                see tricky variations of words you've seen before!
              </p>
              <p className="text-gray-600 mb-8">
                You start with 3 lives. Each mistake reduces your lives by 1.
              </p>
            </div>
          )}

          <button
            onClick={startGame}
            className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700 transition-colors"
          >
            {finalScore !== null ? "Play Again" : "Start"}
          </button>
        </div>
      ) : (
        <VerbalMemory onGameOver={handleGameOver} />
      )}
    </GameContainer>
  );
}