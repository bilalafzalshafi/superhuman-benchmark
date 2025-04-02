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
    <div className="min-h-screen flex flex-col">
      {/* Game header */}
      <div className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Sequence Memory Test</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Remember an increasingly complex pattern of flashing squares.
            <br />
            But beware - the squares won't stay still!
          </p>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-grow bg-blue-500 flex items-center justify-center pb-16">
        {!isPlaying ? (
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center">
            {finalLevel !== null ? (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Over</h2>
                <p className="text-6xl font-bold mb-4 text-blue-600">{finalLevel}</p>
                <p className="text-gray-600 mb-8">level reached</p>
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">How it works</h2>
                <p className="mb-6 text-gray-700">
                  You'll be shown a sequence of squares that flash blue. Memorize the pattern,
                  then repeat it back by clicking the squares in the same order.
                </p>
                <p className="mb-6 text-gray-700">
                  <span className="font-semibold">SUPERHUMAN TWIST:</span> At higher levels, 
                  the squares will move around while you're trying to recall the sequence, 
                  and some will even temporarily disappear!
                </p>
                <p className="text-gray-600 mb-4">
                  The sequence gets longer with each level.
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              {finalLevel !== null ? "Play Again" : "Start"}
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-4">
            <SequenceMemory onGameOver={handleGameOver} />
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
                This test measures your sequential memory span - how many items you can remember in order.
              </p>
              <p className="text-gray-600">
                Our superhuman version adds a twist: the squares will move positions while you're trying
                to recall the sequence, and some will even temporarily disappear at higher levels!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}