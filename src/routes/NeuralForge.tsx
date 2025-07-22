
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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Shape Sculptor</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Let's make some cool shapes! Use the sliders to change the shape and match it to the target.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about parameters and how they affect a 3D model. Adjust the sliders to match your shape to the target shape.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Sculpting!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

interface ShapeParams {
  size: number;
  color: string;
  shape: 'box' | 'sphere' | 'cone';
}

interface GameState {
  level: number;
  score: number;
  playerShape: ShapeParams;
  targetShape: ShapeParams;
  isSculpting: boolean;
  result: string | null;
  age: number;
}

const generateShape = (level: number): ShapeParams => {
  const shapes: ('box' | 'sphere' | 'cone')[] = ['box', 'sphere', 'cone'];
  return {
    size: Math.random() * 0.5 + 0.5,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  };
};

const NeuralForge: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    playerShape: { size: 1, color: 'blue', shape: 'box' },
    targetShape: { size: 1, color: 'blue', shape: 'box' },
    isSculpting: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      targetShape: generateShape(prev.level),
      isSculpting: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleCheck = () => {
    if (!gameState.isSculpting) return;

    const sizeDiff = Math.abs(gameState.playerShape.size - gameState.targetShape.size);
    const isCorrect = sizeDiff < 0.1 && gameState.playerShape.shape === gameState.targetShape.shape;

    setGameState(prev => ({
      ...prev,
      isSculpting: false,
      result: isCorrect ? 'You matched the shape!' : 'Not quite, try again!',
      score: isCorrect ? prev.score + 100 : prev.score,
      level: isCorrect ? prev.level + 1 : Math.max(1, prev.level - 1),
    }));

    setTimeout(startNewRound, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Shape Sculptor</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Shapes */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your Shape</h2>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              {/* A simple representation of the 3D shape */}
              <div style={{ transform: `scale(${gameState.playerShape.size})`, backgroundColor: gameState.playerShape.color, width: '100px', height: '100px', borderRadius: gameState.playerShape.shape === 'sphere' ? '50%' : 0 }}></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Target Shape</h2>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <div style={{ transform: `scale(${gameState.targetShape.size})`, backgroundColor: gameState.targetShape.color, width: '100px', height: '100px', borderRadius: gameState.targetShape.shape === 'sphere' ? '50%' : 0 }}></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {gameState.isSculpting && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sculpt your shape!</h2>
            <div className="flex justify-center items-center space-x-4">
              <div>
                <label className="block mb-2">Size</label>
                <input type="range" min="0.5" max="1.5" step="0.1" value={gameState.playerShape.size} onChange={(e) => setGameState(prev => ({ ...prev, playerShape: { ...prev.playerShape, size: parseFloat(e.target.value) } }))} />
              </div>
              <div>
                <label className="block mb-2">Shape</label>
                <select value={gameState.playerShape.shape} onChange={(e) => setGameState(prev => ({ ...prev, playerShape: { ...prev.playerShape, shape: e.target.value as any } }))}>
                  <option value="box">Box</option>
                  <option value="sphere">Sphere</option>
                  <option value="cone">Cone</option>
                </select>
              </div>
              <GameButton onClick={handleCheck} className="bg-green-500 hover:bg-green-600">Check</GameButton>
            </div>
          </div>
        )}

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">{gameState.result}</h2>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isSculpting && !gameState.result && (
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

export default NeuralForge;
