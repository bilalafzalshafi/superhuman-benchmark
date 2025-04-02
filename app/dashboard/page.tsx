"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Score, getAllScores } from "@/utils/scoreService";

export default function Dashboard() {
  const [scores, setScores] = useState<Score[]>([]);

  // Load scores from the score service
  useEffect(() => {
    const loadedScores = getAllScores();
    setScores(loadedScores);
  }, []);

  // Group scores by game
  const gameScores: Record<string, Score[]> = {};
  scores.forEach((score) => {
    if (!gameScores[score.game]) {
      gameScores[score.game] = [];
    }
    gameScores[score.game].push(score);
  });

  // Get best score for each game
  const getBestScore = (game: string) => {
    if (!gameScores[game] || gameScores[game].length === 0) return null;

    const gameBestMetric = {
      "Reaction Time": (a: Score, b: Score) => a.score - b.score, // Lower is better
      "Verbal Memory": (a: Score, b: Score) => b.score - a.score, // Higher is better
      "Sequence Memory": (a: Score, b: Score) => b.score - a.score, // Higher is better
      "Typing": (a: Score, b: Score) => b.score - a.score, // Higher is better
    };

    return [...gameScores[game]].sort(gameBestMetric[game as keyof typeof gameBestMetric])[0];
  };

  const games = [
    {
      id: "reaction-time",
      name: "Reaction Time",
      color: "bg-green-500",
      icon: "⚡",
    },
    {
      id: "verbal-memory",
      name: "Verbal Memory",
      color: "bg-purple-500",
      icon: "📝",
    },
    {
      id: "sequence-memory",
      name: "Sequence Memory",
      color: "bg-blue-500",
      icon: "🔢",
    },
    {
      id: "typing",
      name: "Typing",
      color: "bg-orange-500",
      icon: "⌨️",
    },
  ];

  return (
    <>
      {/* Dashboard Header */}
      <div className="bg-blue-500 text-white pt-10 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Your Superhuman Dashboard</h1>
        </div>
      </div>
      
      {/* Main Dashboard Content - Raised from header */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        {/* Game cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {games.map((game) => {
            const bestScore = getBestScore(game.name);
            const gameColor = game.id === 'reaction-time' ? 'from-green-400 to-green-600' :
                             game.id === 'verbal-memory' ? 'from-purple-400 to-purple-600' :
                             game.id === 'sequence-memory' ? 'from-blue-400 to-blue-600' :
                             'from-orange-400 to-orange-600';
            
            return (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-102 hover:shadow-lg">
                <div className={`bg-gradient-to-r ${gameColor} text-white p-5 flex justify-between items-center`}>
                  <h2 className="text-xl font-bold">{game.name}</h2>
                  <span className="text-3xl">{game.icon}</span>
                </div>
                <div className="p-5">
                  {bestScore ? (
                    <div>
                      <p className="text-3xl font-bold">{bestScore.score}{bestScore.metric}</p>
                      <p className="text-gray-600 text-sm">
                        Best Score • {new Date(bestScore.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic py-4">No scores yet</p>
                  )}
                  <Link
                    href={`/${game.id}`}
                    className="mt-5 block text-center py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white transition-colors rounded-md font-medium"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="p-6">
            {scores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-gray-500 font-semibold">Game</th>
                      <th className="px-5 py-3 text-left text-gray-500 font-semibold">Score</th>
                      <th className="px-5 py-3 text-left text-gray-500 font-semibold">Date</th>
                      <th className="px-5 py-3 text-left text-gray-500 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scores
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((score, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium">{score.game}</td>
                          <td className="px-5 py-4">
                            {score.score}
                            {score.metric}
                          </td>
                          <td className="px-5 py-4 text-gray-500">
                            {new Date(score.date).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4 text-gray-500">
                            {new Date(score.date).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 italic mb-6">
                  No activity yet. Start playing some games!
                </p>
                <Link 
                  href="/" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Go to Games
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}