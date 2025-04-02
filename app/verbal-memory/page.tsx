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
    <div className="min-h-screen flex flex-col">
      {/* Game header */}
      <div className="bg-purple-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Verbal Memory Test</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Keep as many words in memory as possible.
            <br />
            Watch out for tricky variations of words you've seen before!
          </p>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-grow bg-purple-500 flex items-center justify-center pb-16">
        {!isPlaying ? (
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center">
            {finalScore !== null ? (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Game Over</h2>
                <p className="text-6xl font-bold mb-4 text-purple-600">{finalScore}</p>
                <p className="text-gray-600 mb-8">words remembered</p>
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">How it works</h2>
                <p className="mb-6 text-gray-700">
                  You'll be shown words one at a time. For each word, you need to 
                  decide if you've seen it before in this game.
                </p>
                <p className="mb-6 text-gray-700">
                  <span className="font-semibold">SUPERHUMAN TWIST:</span> You'll 
                  see tricky variations of words you've seen before, with added letters,
                  or subtle misspellings designed to confuse you!
                </p>
                <p className="text-gray-600 mb-4">
                  You start with 3 lives. Each mistake reduces your lives by 1.
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="bg-purple-600 text-white py-3 px-8 rounded-md hover:bg-purple-700 transition-colors font-semibold"
            >
              {finalScore !== null ? "Play Again" : "Start"}
            </button>
          </div>
        ) : (
          <VerbalMemory onGameOver={handleGameOver} />
        )}
      </div>

      {/* About section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-800">About the test</h3>
              <p className="text-gray-600 mb-4">
                This test measures how many words you can keep in short-term memory at once.
              </p>
              <p className="text-gray-600">
                Our superhuman version adds a twist: words will be modified with added letters or
                subtle misspellings to confuse you. Can you still recognize which words you've seen?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}