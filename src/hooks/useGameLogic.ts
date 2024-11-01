import { useCallback, useEffect, useState, useRef } from 'react';
import { useLeaderboard } from './useLeaderboard';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

export const useGameLogic = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoopRef = useRef<number>();
  const shouldGrowRef = useRef(false);
  const { addScore } = useLeaderboard();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Only check for self-collision, not wall collision
    return snakeBody.some((segment, index) => {
      if (index === 0) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  }, []);

  const wrapPosition = (pos: number): number => {
    if (pos < 0) return GRID_SIZE - 1;
    if (pos >= GRID_SIZE) return 0;
    return pos;
  };

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const head = { ...currentSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wrap around logic
      head.x = wrapPosition(head.x);
      head.y = wrapPosition(head.y);

      if (checkCollision(head, currentSnake)) {
        setIsGameOver(true);
        setIsPaused(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        addScore({ name: 'Player', score });
        return currentSnake;
      }

      const newSnake = [head, ...currentSnake];
      
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(s - SPEED_INCREMENT, 50));
        generateFood();
        shouldGrowRef.current = true;
        return newSnake;
      }

      if (shouldGrowRef.current) {
        shouldGrowRef.current = false;
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, score, checkCollision, generateFood, addScore]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const radius = CELL_SIZE / 2;
      const x = segment.x * CELL_SIZE + radius;
      const y = segment.y * CELL_SIZE + radius;

      // Create gradient for snake body
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#6366F1');
      gradient.addColorStop(1, '#4F46E5');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
      ctx.fill();

      // Draw eyes for head
      if (index === 0) {
        ctx.fillStyle = '#FFFFFF';
        const eyeOffset = radius / 2;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, 2, 0, Math.PI * 2);
        ctx.arc(x + eyeOffset, y - eyeOffset, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food with glow effect
    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = '#FCA5A5';
    ctx.shadowBlur = 10;
    const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
    ctx.beginPath();
    ctx.arc(foodX, foodY, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (!isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [isPaused, moveSnake, speed]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(drawGame);
    return () => cancelAnimationFrame(animationFrame);
  }, [drawGame]);

  const startGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(true);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
    shouldGrowRef.current = false;
    generateFood();
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  }, [generateFood]);

  return {
    startGame,
    pauseGame,
    resetGame,
    gameState: snake,
    score,
    isPaused,
    isGameOver,
    direction,
    setDirection,
  };
};