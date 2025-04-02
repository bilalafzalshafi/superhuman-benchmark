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
    <div className="min-h-screen flex flex-col">
      {/* Game header */}
      <div className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Typing Speed Test</h1>
          <p className="text-xl max-w-2xl mx-auto">
            How fast can you type when everything keeps changing?
            <br />
            Only the most adaptable typists will excel!
          </p>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-grow bg-orange-500 flex items-center justify-center pb-16">
        {!isPlaying && !results ? (
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How it works</h2>
              <p className="mb-6 text-gray-700">
                Type the text displayed as quickly and accurately as possible.
              </p>
              <p className="mb-6 text-gray-700">
                <span className="font-semibold">SUPERHUMAN TWIST:</span> The text ahead 
                of you will change as you type, and sometimes the text you've already 
                typed will also change, forcing you to delete and retype it!
              </p>
              <p className="text-gray-600 mb-4">
                Your score will be based on words per minute (WPM) and accuracy.
              </p>
            </div>

            <button
              onClick={startGame}
              className="bg-orange-600 text-white py-3 px-8 rounded-md hover:bg-orange-700 transition-colors font-semibold"
            >
              Start
            </button>
          </div>
        ) : results ? (
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Your Results</h2>
            
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-4xl font-bold text-orange-600">{results.wpm}</p>
                <p className="text-gray-600">Words Per Minute</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-4xl font-bold text-orange-600">{results.accuracy}%</p>
                <p className="text-gray-600">Accuracy</p>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="bg-orange-600 text-white py-3 px-8 rounded-md hover:bg-orange-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-4">
            <TypingSpeed onComplete={handleGameComplete} />
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
                This test measures your typing speed and accuracy under pressure.
              </p>
              <p className="text-gray-600">
                Our superhuman version adds a twist: the text will dynamically change as you type,
                forcing you to adapt on the fly. Can you keep your cool when the words keep shifting?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}