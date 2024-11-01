import React, { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    startGame,
    pauseGame,
    resetGame,
    gameState,
    score,
    isPaused,
    isGameOver,
    direction,
    setDirection
  } = useGameLogic(canvasRef);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Handle direction keys
      switch(e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
        case ' ': // Space bar
          if (!isGameOver) {
            isPaused ? startGame() : pauseGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setDirection, isPaused, startGame, pauseGame, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-white rounded-lg"
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-[400px] bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="font-bold text-xl">{score}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetGame}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isPaused ? startGame : pauseGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
            title={isPaused ? "Start Game (Space)" : "Pause Game (Space)"}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="text-gray-600 mb-4">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};