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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {games.map((game) => {
          const bestScore = getBestScore(game.name);
          return (
            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${game.color} text-white p-4 flex justify-between items-center`}>
                <h2 className="text-xl font-bold">{game.name}</h2>
                <span className="text-2xl">{game.icon}</span>
              </div>
              <div className="p-4">
                {bestScore ? (
                  <div>
                    <p className="text-3xl font-bold">{bestScore.score}{bestScore.metric}</p>
                    <p className="text-gray-600 text-sm">
                      Best Score • {new Date(bestScore.date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No scores yet</p>
                )}
                <Link
                  href={`/${game.id}`}
                  className="mt-4 block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
                >
                  Play Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="p-4">
          {scores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500">Game</th>
                    <th className="px-4 py-2 text-left text-gray-500">Score</th>
                    <th className="px-4 py-2 text-left text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scores
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((score, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{score.game}</td>
                        <td className="px-4 py-3">
                          {score.score}
                          {score.metric}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(score.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-6">
              No activity yet. Start playing some games!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}