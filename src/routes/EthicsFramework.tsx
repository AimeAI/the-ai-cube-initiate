
import React, { useState, useCallback } from 'react';
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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Digital Guardian</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Help the robot make good choices! Read the story and pick the best action to help everyone.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about AI ethics by making decisions in different scenarios. Your choices will shape the outcome of the story.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start the Story!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

interface Choice {
  text: string;
  ethics: 'fairness' | 'privacy' | 'transparency';
}

interface Scenario {
  story: string;
  choices: Choice[];
}

interface GameState {
  level: number;
  score: number;
  scenario: Scenario;
  result: string | null;
  age: number;
}

const SCENARIOS: Scenario[] = [
  {
    story: 'A robot is helping kids with homework. It helps some kids more than others. What should you do?',
    choices: [
      { text: 'Tell the robot to be fair to everyone.', ethics: 'fairness' },
      { text: 'Ask the robot why it helps some kids more.', ethics: 'transparency' },
    ],
  },
  {
    story: 'A robot is using kids' private information to help them. What should you do?',
    choices: [
      { text: 'Tell the robot to stop using private information.', ethics: 'privacy' },
      { text: 'Ask the kids if it's okay for the robot to use their information.', ethics: 'transparency' },
    ],
  },
];

const EthicsFramework: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    scenario: SCENARIOS[0],
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      scenario: SCENARIOS[(prev.level - 1) % SCENARIOS.length],
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleChoice = (choice: Choice) => {
    setGameState(prev => ({
      ...prev,
      result: `You chose to focus on ${choice.ethics}. That's a great choice!`,
      score: prev.score + 100,
      level: prev.level + 1,
    }));

    setTimeout(startNewRound, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Digital Guardian</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Scenario */}
        <div className="p-8 bg-gray-700 rounded-lg mb-8">
          <p className="text-2xl">{gameState.scenario.story}</p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameState.scenario.choices.map((choice, index) => (
            <GameButton
              key={index}
              onClick={() => handleChoice(choice)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {choice.text}
            </GameButton>
          ))}
        </div>

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">{gameState.result}</h2>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.result && (
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

export default EthicsFramework;
