"use client";

import { useState } from "react";
import GameContainer from "@/components/GameContainer";
import SequenceMemory from "@/components/games/SequenceMemory";

export default function SequenceMemoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalLevel, setFinalLevel] = useState<number | null>(null);

  const handleGameOver = (level: number) => {
    setFinalLevel(level);
    setIsPlaying(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setFinalLevel(null);
  };

  return (
    <GameContainer
      title="Sequence Memory"
      description="Remember an increasingly complex pattern of squares."
      instructions="Memorize the sequence of blue squares and then repeat it back. Watch out - the squares will move and sometimes disappear in later levels!"
      backgroundColor="bg-blue-500"
      textColor="text-white"
    >
      {!isPlaying ? (
        <div className="text-center">
          {finalLevel !== null ? (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Game Over</h2>
              <p className="text-6xl font-bold mb-4">{finalLevel}</p>
              <p className="text-gray-600 mb-8">level reached</p>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How it works</h2>
              <p className="max-w-md mx-auto mb-6">
                You'll be shown a sequence of squares that light up. Memorize the pattern,
                then repeat it back by clicking the squares in the same order.
              </p>
              <p className="text-gray-600 mb-8">
                The sequence gets longer with each level. At higher levels, squares will
                move around and even temporarily disappear to make it more challenging!
              </p>
            </div>
          )}

          <button
            onClick={startGame}
            className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700 transition-colors"
          >
            {finalLevel !== null ? "Play Again" : "Start"}
          </button>
        </div>
      ) : (
        <SequenceMemory onGameOver={handleGameOver} />
      )}
    </GameContainer>
  );
}