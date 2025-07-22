
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- NEW: Child-Friendly Components & Icons ---

const SunnyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-1-17h2v4h-2v-4zm6.364 2.636l1.414 1.414-2.828 2.828-1.414-1.414 2.828-2.828zm-10.728 0l2.828 2.828-1.414 1.414-2.828-2.828 1.414-1.414zm10.728 10.728l-2.828-2.828 1.414-1.414 2.828 2.828-1.414 1.414zm-10.728 0l-1.414-1.414 2.828-2.828 1.414 1.414-2.828 2.828zm-1.636-5.364h-4v-2h4v2zm12 0h4v-2h-4v2zm-7 5h2v4h-2v-4z"/>
  </svg>
);

const RainyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.542 16.247l-1.084-1.084c.144-.42.242-.862.242-1.329 0-2.206-1.794-4-4-4s-4 1.794-4 4c0 .467.098.909.242 1.329l-1.084 1.084c-1.054-.6-1.8-1.657-1.98-2.852h1.282v-2h-1.488c.12-1.212.789-2.29 1.732-3h1.512v-2h-1.282c1.054-.6 2.322-1 3.718-1s2.664.4 3.718 1h-1.282v2h1.512c.943.71 1.612 1.788 1.732 3h-1.488v2h1.282c-.18 1.195-.926 2.252-1.98 2.852zm-7.542-1.247c0 1.104.896 2 2 2s2-.896 2-2-.896-2-2-2-2 .896-2 2z"/>
  </svg>
);

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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Weather Predictor</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Can you guess if it will be sunny or rainy? Look at the pattern of the past few days and make your prediction!
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about predictive models by forecasting the weather. Analyze the sequence of weather patterns and predict the next day.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Predicting!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

type Weather = 'sunny' | 'rainy';

interface GameState {
  level: number;
  score: number;
  weatherSequence: Weather[];
  isPredicting: boolean;
  result: { correct: boolean; actual: Weather } | null;
  age: number;
}

// Generates a simple weather pattern
const generateWeatherSequence = (level: number): Weather[] => {
  const length = 3 + Math.min(level, 5);
  const sequence: Weather[] = [];
  for (let i = 0; i < length; i++) {
    // Simple alternating pattern for kids
    sequence.push(i % 2 === 0 ? 'sunny' : 'rainy');
  }
  // Shuffle for older kids
  if (level > 2) {
      for (let i = sequence.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
      }
  }
  return sequence;
};

const PredictorEngineGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    weatherSequence: [],
    isPredicting: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      weatherSequence: generateWeatherSequence(prev.level),
      isPredicting: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handlePrediction = (prediction: Weather) => {
    if (!gameState.isPredicting) return;

    const actualWeather = generateWeatherSequence(gameState.level + 1).pop()!;
    const isCorrect = prediction === actualWeather;

    setGameState(prev => ({
      ...prev,
      isPredicting: false,
      result: { correct: isCorrect, actual: actualWeather },
      score: isCorrect ? prev.score + 100 : prev.score,
      level: isCorrect ? prev.level + 1 : Math.max(1, prev.level -1),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Weather Predictor</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Weather Sequence */}
        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-gray-700 rounded-lg">
          {gameState.weatherSequence.map((weather, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-sm mb-2">Day {index + 1}</span>
              {weather === 'sunny' ? <SunnyIcon /> : <RainyIcon />}
            </div>
          ))}
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Day {gameState.weatherSequence.length + 1}</span>
            <div className="h-12 w-12 text-gray-400 flex items-center justify-center text-3xl font-bold">?</div>
          </div>
        </div>

        {/* Prediction Controls */}
        {gameState.isPredicting && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">What will the weather be tomorrow?</h2>
            <div className="flex justify-center space-x-4">
              <GameButton onClick={() => handlePrediction('sunny')} className="bg-yellow-500 hover:bg-yellow-600">
                <SunnyIcon />
                <span className="ml-2">Sunny</span>
              </GameButton>
              <GameButton onClick={() => handlePrediction('rainy')} className="bg-blue-500 hover:bg-blue-600">
                <RainyIcon />
                <span className="ml-2">Rainy</span>
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
            <p className="mb-4">The actual weather was: {gameState.result.actual}</p>
            <GameButton onClick={startNewRound} className="bg-purple-500 hover:bg-purple-600">
              Next Round
            </GameButton>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isPredicting && !gameState.result && (
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

export default PredictorEngineGame;
