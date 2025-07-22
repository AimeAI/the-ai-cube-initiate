
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- NEW: Child-Friendly Components & Icons ---

const ToyIcon = ({ type, className = '' }) => {
  const icons = {
    animal: 'fas fa-cat',
    vehicle: 'fas fa-car',
    food: 'fas fa-apple-alt',
  };
  return <i className={`${icons[type]} ${className}`}></i>;
};

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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Toy Sorter</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Let's clean up! Drag the toys into the correct boxes. Can you tell which ones are animals, vehicles, or food?
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about classification! Sort the items into their proper categories to teach our AI how to group similar objects.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Sorting!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

type ToyCategory = 'animal' | 'vehicle' | 'food';

interface Toy {
  id: number;
  type: ToyCategory;
  name: string; // e.g., 'cat', 'car', 'apple'
}

interface GameState {
  level: number;
  score: number;
  toys: Toy[];
  isSorting: boolean;
  result: { correct: boolean; toy: Toy, category: ToyCategory } | null;
  age: number;
}

const TOY_SETS: { [key: string]: Toy[] } = {
    1: [
        { id: 1, type: 'animal', name: 'cat' },
        { id: 2, type: 'vehicle', name: 'car' },
        { id: 3, type: 'food', name: 'apple' },
    ],
    2: [
        { id: 4, type: 'animal', name: 'dog' },
        { id: 5, type: 'vehicle', name: 'bus' },
        { id: 6, type: 'food', name: 'banana' },
    ],
    3: [
        { id: 7, type: 'animal', name: 'bird' },
        { id: 8, type: 'vehicle', name: 'truck' },
        { id: 9, type: 'food', name: 'pizza' },
    ],
};

const ClassifierConstruct: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    toys: [],
    isSorting: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      toys: TOY_SETS[prev.level] || TOY_SETS[1],
      isSorting: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleSort = (toy: Toy, category: ToyCategory) => {
    if (!gameState.isSorting) return;

    const isCorrect = toy.type === category;

    setGameState(prev => ({
      ...prev,
      isSorting: false,
      result: { correct: isCorrect, toy, category },
      score: isCorrect ? prev.score + 100 : prev.score,
      level: isCorrect ? prev.level + 1 : Math.max(1, prev.level - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Toy Sorter</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Toys to Sort */}
        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-gray-700 rounded-lg">
          {gameState.toys.map((toy) => (
            <div key={toy.id} className="flex flex-col items-center">
              <ToyIcon type={toy.type} className="text-4xl" />
              <span className="mt-2">{toy.name}</span>
            </div>
          ))}
        </div>

        {/* Sorting Bins */}
        {gameState.isSorting && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Which box does the first toy go in?</h2>
            <div className="flex justify-center space-x-4">
              <GameButton onClick={() => handleSort(gameState.toys[0], 'animal')} className="bg-red-500 hover:bg-red-600">
                <ToyIcon type="animal" />
                <span className="ml-2">Animals</span>
              </GameButton>
              <GameButton onClick={() => handleSort(gameState.toys[0], 'vehicle')} className="bg-blue-500 hover:bg-blue-600">
                <ToyIcon type="vehicle" />
                <span className="ml-2">Vehicles</span>
              </GameButton>
              <GameButton onClick={() => handleSort(gameState.toys[0], 'food')} className="bg-green-500 hover:bg-green-600">
                <ToyIcon type="food" />
                <span className="ml-2">Foods</span>
              </GameButton>
            </div>
          </div>
        )}

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className={`text-3xl font-bold mb-2 ${gameState.result.correct ? 'text-green-400' : 'text-red-400'}`}>
              {gameState.result.correct ? 'Correct!' : 'Not Quite!'}
            </h2>
            <p className="mb-4">The {gameState.result.toy.name} is an {gameState.result.toy.type}.</p>
            <GameButton onClick={startNewRound} className="bg-purple-500 hover:bg-purple-600">
              Next Round
            </GameButton>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isSorting && !gameState.result && (
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

export default ClassifierConstruct;
