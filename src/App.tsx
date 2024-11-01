import React from 'react';
import { Game } from './components/Game';
import { Leaderboard } from './components/Leaderboard';
import { Gamepad2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Snake Game</h1>
          </div>
          <p className="text-gray-600">Use arrow keys to control the snake. Collect food to grow and score points!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <Game />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default App;