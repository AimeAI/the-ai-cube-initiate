
import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars, Sphere } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// --- NEW: Child-Friendly Components ---

// A simple, reusable button for our game
const GameButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-bold text-white rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg ${className}`}
  >
    {children}
  </button>
);

// Tutorial component to guide the child
const DetectiveTutorial = ({ onStart, age }) => (
  <div className="text-center max-w-md p-4">
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">AI Eye Detective</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Help the computer learn to see! Find the hidden shapes in the pictures. It's like a treasure hunt for shapes!
      </p>
    )}
    {age > 8 && age <= 12 && (
      <p className="text-gray-200 mb-6">
        Train our AI to recognize patterns. You'll teach it how to identify different objects, just like a real detective.
      </p>
    )}
    {age > 12 && (
      <p className="text-gray-200 mb-6">
        Explore the fundamentals of computer vision. Identify patterns and objects to teach an AI how to interpret visual data.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start the Hunt!
    </GameButton>
  </div>
);

// --- Game Interfaces and Data ---

interface ShapeChallenge {
  id: string;
  type: 'shape' | 'object';
  description: string;
  // NEW: Child-friendly hint
  friendlyHint: string;
  targetShapes: string[];
  difficulty: number;
}

interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  currentChallenge: ShapeChallenge | null;
  isActive: boolean;
  foundShapes: string[];
  // NEW: Age for adaptive content
  age: number;
}

// NEW: Simplified and child-friendly challenges
const SHAPE_CHALLENGES: ShapeChallenge[] = [
  {
    id: 'basic-shapes',
    type: 'shape',
    description: 'Find the basic geometric shapes.',
    friendlyHint: 'Look for circles, squares, and triangles!',
    targetShapes: ['circle', 'square', 'triangle'],
    difficulty: 1,
  },
  {
    id: 'animal-shapes',
    type: 'object',
    description: 'Identify the friendly animal shapes.',
    friendlyHint: 'Can you find the cat, the dog, and the bird?',
    targetShapes: ['cat', 'dog', 'bird'],
    difficulty: 2,
  },
  {
    id: 'space-objects',
    type: 'object',
    description: 'Spot the objects in outer space!',
    friendlyHint: 'A rocket, a star, and a planet are hiding here.',
    targetShapes: ['rocket', 'star', 'planet'],
    difficulty: 3,
  },
];

// --- 3D Components ---

// A single shape to be found in the 3D scene
const DetectableShape = ({ position, shape, isFound, onDetect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case 'circle':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'square':
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'triangle':
        return <coneGeometry args={[1, 2, 3]} />;
      case 'cat': // Placeholder geometry
        return <boxGeometry args={[1, 1, 2]} />;
      case 'dog': // Placeholder geometry
        return <sphereGeometry args={[1.2, 32, 32]} />;
      case 'bird': // Placeholder geometry
        return <coneGeometry args={[1, 1.5, 8]} />;
      case 'rocket':
        return <cylinderGeometry args={[0.5, 1, 2, 8]} />;
      case 'star':
        return <torusKnotGeometry args={[1, 0.3, 100, 5]} />;
      case 'planet':
        return <sphereGeometry args={[1.5, 32, 32]} />;
      default:
        return <sphereGeometry args={[1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onDetect}
    >
      {getGeometry()}
      <meshStandardMaterial
        color={isFound ? '#34D399' : '#F87171'}
        emissive={isFound ? '#34D399' : '#991B1B'}
        emissiveIntensity={isFound ? 0.6 : 0.3}
        transparent
        opacity={hovered ? 1 : 0.8}
      />
    </mesh>
  );
};

// The main 3D scene where shapes appear
const GameScene = ({ challenge, onShapeDetect, foundShapes }) => {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#818CF8" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#F472B6" />

      {challenge.targetShapes.map((shape, index) => (
        <Suspense fallback={null} key={shape}>
          <DetectableShape
            position={[(index - 1) * 5, Math.sin(index * 2) * 2, 0]}
            shape={shape}
            isFound={foundShapes.includes(shape)}
            onDetect={() => onShapeDetect(shape)}
          />
        </Suspense>
      ))}

      <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={20} />
    </>
  );
};

// --- UI Components ---

// The Heads-Up Display for the game
const GameHUD = ({ gameState }) => (
  <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none text-white">
    <div className="flex justify-between items-start">
      <div className="bg-gray-800/70 backdrop-blur-sm border border-blue-500/50 rounded-lg p-4">
        <h3 className="text-blue-300 font-bold text-lg mb-2">Detective Board</h3>
        <div className="text-sm">
          <div>Level: <span className="text-blue-300">{gameState.level}</span></div>
          <div>Score: <span className="text-yellow-300">{gameState.score}</span></div>
        </div>
      </div>

      {gameState.currentChallenge && (
        <div className="bg-gray-800/70 backdrop-blur-sm border border-pink-500/50 rounded-lg p-4 max-w-md">
          <h4 className="text-pink-300 font-bold mb-2">Current Mission</h4>
          <p className="text-sm mb-2">{gameState.currentChallenge.description}</p>
          <p className="text-blue-200 text-xs italic">"{gameState.currentChallenge.friendlyHint}"</p>
          <div className="mt-2 text-xs">
            Shapes Found: {gameState.foundShapes.length}/{gameState.currentChallenge.targetShapes.length}
          </div>
        </div>
      )}

      <div className="bg-gray-800/70 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4">
        <div className="text-yellow-300 font-bold text-lg">{gameState.timeLeft}s</div>
        <div className="text-xs">Time Left</div>
      </div>
    </div>
  </div>
);

// --- Main Game Component ---

const VisionSystem = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: 60,
    currentChallenge: SHAPE_CHALLENGES[0],
    isActive: false,
    foundShapes: [],
    age: 8, // Default age, can be passed as a prop
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isActive: true,
      timeLeft: 60,
      foundShapes: [],
      currentChallenge: SHAPE_CHALLENGES[Math.min(prev.level - 1, SHAPE_CHALLENGES.length - 1)],
    }));
  }, []);

  const handleShapeDetect = useCallback((shape: string) => {
    if (!gameState.isActive || gameState.foundShapes.includes(shape)) return;

    setGameState(prev => {
      const newFoundShapes = [...prev.foundShapes, shape];
      const newScore = prev.score + 100;

      if (prev.currentChallenge && newFoundShapes.length === prev.currentChallenge.targetShapes.length) {
        // Level complete
        return {
          ...prev,
          foundShapes: newFoundShapes,
          score: newScore + 500, // Bonus for completing
          level: prev.level + 1,
          isActive: false,
        };
      }

      return { ...prev, foundShapes: newFoundShapes, score: newScore };
    });
  }, [gameState.isActive, gameState.foundShapes]);

  useEffect(() => {
    if (gameState.isActive && gameState.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, isActive: false }));
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.isActive, gameState.timeLeft]);

  return (
    <div className="h-screen bg-gray-900 text-white relative overflow-hidden">
      <GameHUD gameState={gameState} />

      {!gameState.isActive && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
          {gameState.level === 1 && gameState.timeLeft === 60 ? (
            <DetectiveTutorial onStart={startGame} age={gameState.age} />
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                {gameState.timeLeft === 0 ? 'Time's Up!' : `Level ${gameState.level -1} Complete!`}
              </h2>
              <p className="mb-6">Your Score: {gameState.score}</p>
              <GameButton onClick={startGame} className="bg-green-500 hover:bg-green-600 mr-4">
                {gameState.level > SHAPE_CHALLENGES.length ? 'Play Again' : 'Next Level'}
              </GameButton>
              <GameButton onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-700">
                Back to Home
              </GameButton>
            </div>
          )}
        </div>
      )}

      <Canvas className="absolute inset-0">
        {gameState.currentChallenge && (
          <GameScene
            challenge={gameState.currentChallenge}
            onShapeDetect={handleShapeDetect}
            foundShapes={gameState.foundShapes}
          />
        )}
      </Canvas>
    </div>
  );
};

export default VisionSystem;
