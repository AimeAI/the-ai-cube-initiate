
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- NEW: Child-Friendly Components & Icons ---

const GameButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-bold text-white rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg ${className}`}
  >
    {children}
  </button>
);

const Tutorial = ({ onStart, age }) => (
  <div className="text-center max-w-md p-4">
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Connect the Dots</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Let's draw a picture by connecting the dots! Click on the dots in the right order to see what you've made.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about graph traversal by connecting the nodes in the correct sequence. This is how AI can find the best path between points.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Connecting!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

interface Dot {
  id: number;
  x: number;
  y: number;
}

interface GameState {
  level: number;
  score: number;
  dots: Dot[];
  connections: [number, number][];
  isConnecting: boolean;
  result: string | null;
  age: number;
}

const getDots = (level: number): Dot[] => {
  const dots: Dot[] = [];
  const numDots = level + 3;
  for (let i = 0; i < numDots; i++) {
    dots.push({ id: i, x: Math.random() * 400, y: Math.random() * 400 });
  }
  return dots;
};

const NeuralPathways: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    dots: [],
    connections: [],
    isConnecting: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      dots: getDots(prev.level),
      connections: [],
      isConnecting: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleConnect = (from: number, to: number) => {
    if (!gameState.isConnecting) return;

    const newConnection: [number, number] = [from, to];
    const newConnections = [...gameState.connections, newConnection];
    setGameState(prev => ({ ...prev, connections: newConnections }));

    if (newConnections.length === gameState.dots.length - 1) {
      setGameState(prev => ({
        ...prev,
        isConnecting: false,
        result: 'You made a picture!',
        score: prev.score + 100,
        level: prev.level + 1,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Connect the Dots</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Canvas */}
        <div className="relative w-full h-96 bg-gray-700 rounded-lg mb-8">
          <svg className="w-full h-full">
            {gameState.connections.map(([from, to], i) => {
              const fromDot = gameState.dots.find(d => d.id === from);
              const toDot = gameState.dots.find(d => d.id === to);
              if (!fromDot || !toDot) return null;
              return <line key={i} x1={fromDot.x} y1={fromDot.y} x2={toDot.x} y2={toDot.y} stroke="white" strokeWidth="2" />;
            })}
            {gameState.dots.map(dot => (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r="10"
                fill="blue"
                onClick={() => {
                  if (gameState.connections.length > 0) {
                    const lastDot = gameState.connections[gameState.connections.length - 1][1];
                    handleConnect(lastDot, dot.id);
                  } else {
                    handleConnect(0, dot.id);
                  }
                }}
              />
            ))}
          </svg>
        </div>

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">{gameState.result}</h2>
            <GameButton onClick={startNewRound} className="bg-purple-500 hover:bg-purple-600">
              Play Again
            </GameButton>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isConnecting && !gameState.result && (
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                <Tutorial onStart={startNewRound} age={gameState.age} />
             </div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
            <GameButton onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-700">
                Back to Home
            </GameButton>
        </div>
      </div>
    </div>
  );
};

export default NeuralPathways;
