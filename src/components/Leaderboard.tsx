import React from 'react';
import { Trophy } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export const Leaderboard = () => {
  const { scores } = useLeaderboard();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-gray-500">#{index + 1}</span>
              <span className="font-semibold">{score.name}</span>
            </div>
            <span className="font-bold text-indigo-600">{score.score}</span>
          </div>
        ))}
        
        {scores.length === 0 && (
          <p className="text-gray-500 text-center py-4">No scores yet!</p>
        )}
      </div>
    </div>
  );
};