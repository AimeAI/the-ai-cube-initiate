import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Crystal Tunes</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Listen to the crystals sing a tune, then play it back! It's a fun memory game with sounds and colors.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Test your memory by repeating the sequence of sounds and colors. This is how computers learn to recognize patterns!
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Playing!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

interface Crystal {
  id: number;
  color: string;
  note: string;
}

interface GameState {
  level: number;
  score: number;
  sequence: number[];
  playerSequence: number[];
  isPlaying: boolean;
  isPlayerTurn: boolean;
  result: string | null;
  age: number;
}

const CRYSTALS: Crystal[] = [
  { id: 0, color: 'red', note: 'C4' },
  { id: 1, color: 'blue', note: 'D4' },
  { id: 2, color: 'green', note: 'E4' },
  { id: 3, color: 'yellow', note: 'F4' },
];

const EnhancedCrystalResonance: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    isPlayerTurn: false,
    result: null,
    age: 8, // Default age
  });

  const synth = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();
  }, []);

  const playSequence = async (sequence: number[]) => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPlayerTurn: false }));
    for (const id of sequence) {
      await new Promise(resolve => setTimeout(resolve, 500));
      synth.current?.triggerAttackRelease(CRYSTALS[id].note, '8n');
    }
    setGameState(prev => ({ ...prev, isPlaying: false, isPlayerTurn: true }));
  };

  const startNewRound = useCallback(() => {
    const newSequence = [...Array(gameState.level + 2)].map(() => Math.floor(Math.random() * 4));
    setGameState(prev => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      result: null,
    }));
    playSequence(newSequence);
  }, [gameState.level]);

  const handlePlayerInput = (id: number) => {
    if (!gameState.isPlayerTurn) return;

    const newPlayerSequence = [...gameState.playerSequence, id];
    setGameState(prev => ({ ...prev, playerSequence: newPlayerSequence }));

    if (newPlayerSequence[newPlayerSequence.length - 1] !== gameState.sequence[newPlayerSequence.length - 1]) {
      setGameState(prev => ({ ...prev, result: 'Oops! Try again.', isPlayerTurn: false }));
      setTimeout(startNewRound, 2000);
      return;
    }

    if (newPlayerSequence.length === gameState.sequence.length) {
      setGameState(prev => ({
        ...prev,
        result: 'Great job!',
        score: prev.score + 100,
        level: prev.level + 1,
        isPlayerTurn: false,
      }));
      setTimeout(startNewRound, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Crystal Tunes</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Crystals */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {CRYSTALS.map(crystal => (
            <div
              key={crystal.id}
              onClick={() => handlePlayerInput(crystal.id)}
              className={`h-48 rounded-lg flex items-center justify-center text-4xl font-bold cursor-pointer transition-transform duration-200 ${gameState.isPlayerTurn ? 'hover:scale-105' : ''}`}
              style={{ backgroundColor: crystal.color }}
            >
              {crystal.note}
            </div>
          ))}
        </div>

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">{gameState.result}</h2>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isPlaying && !gameState.result && (
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

export default EnhancedCrystalResonance;