
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- NEW: Child-Friendly Components & Icons ---

const StoryIcon = ({ type, className = '' }) => {
  const icons = {
    character: 'fas fa-user',
    setting: 'fas fa-tree',
    plot: 'fas fa-bolt',
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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Story Maker</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Let's create a story! Choose a character, a setting, and a plot to make your own adventure.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about generative AI by building a story. Select different elements and see how they combine to create a unique narrative.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Creating!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

type StoryElement = 'character' | 'setting' | 'plot';

interface StoryChoice {
  type: StoryElement;
  name: string;
}

interface GameState {
  level: number;
  score: number;
  story: StoryChoice[];
  isCreating: boolean;
  result: string | null;
  age: number;
}

const STORY_ELEMENTS: { [key in StoryElement]: string[] } = {
  character: ['a brave knight', 'a curious wizard', 'a friendly dragon'],
  setting: ['in a dark forest', 'in a tall castle', 'on a floating island'],
  plot: ['who finds a hidden treasure', 'who solves a tricky riddle', 'who saves the kingdom'],
};

const GenerativeCore: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    story: [],
    isCreating: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      story: [],
      isCreating: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleChoice = (type: StoryElement, name: string) => {
    if (!gameState.isCreating) return;

    const newStory = [...gameState.story, { type, name }];
    setGameState(prev => ({ ...prev, story: newStory }));

    if (newStory.length === 3) {
      const finalStory = newStory.map(c => c.name).join(' ');
      setGameState(prev => ({
        ...prev,
        isCreating: false,
        result: `Your story: ${finalStory}.`,
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
          <h1 className="text-4xl font-bold text-yellow-300">Story Maker</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* Story So Far */}
        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-gray-700 rounded-lg">
          {gameState.story.map((choice, index) => (
            <div key={index} className="flex flex-col items-center">
              <StoryIcon type={choice.type} className="text-4xl" />
              <span className="mt-2 text-center">{choice.name}</span>
            </div>
          ))}
        </div>

        {/* Choices */}
        {gameState.isCreating && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Choose the next part of your story!</h2>
            <div className="flex justify-center space-x-4">
              {Object.keys(STORY_ELEMENTS).map((type: StoryElement) => (
                <div key={type}>
                  <h3 className="text-xl font-bold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                  {STORY_ELEMENTS[type].map((name) => (
                    <GameButton
                      key={name}
                      onClick={() => handleChoice(type, name)}
                      className="bg-blue-500 hover:bg-blue-600 mb-2"
                      disabled={gameState.story.some(c => c.type === type)}
                    >
                      {name}
                    </GameButton>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">Story Complete!</h2>
            <p className="mb-4">{gameState.result}</p>
            <GameButton onClick={startNewRound} className="bg-purple-500 hover:bg-purple-600">
              Create Another Story
            </GameButton>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isCreating && !gameState.result && (
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

export default GenerativeCore;
