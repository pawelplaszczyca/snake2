import { useState, useEffect } from 'react';

interface Score {
  name: string;
  score: number;
}

export const useLeaderboard = () => {
  const [scores, setScores] = useState<Score[]>(() => {
    const saved = localStorage.getItem('snakeGameScores');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('snakeGameScores', JSON.stringify(scores));
  }, [scores]);

  const addScore = (newScore: Score) => {
    setScores(prevScores => {
      const newScores = [...prevScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      return newScores;
    });
  };

  return { scores, addScore };
};