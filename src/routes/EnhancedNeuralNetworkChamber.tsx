import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
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
    <h1 className="text-4xl font-bold text-yellow-300 mb-4">Brain Builder</h1>
    {age <= 8 && (
      <p className="text-gray-200 mb-6">
        Let's build a brain for a robot! Connect the colorful "neurons" to help the robot think.
      </p>
    )}
    {age > 8 && (
      <p className="text-gray-200 mb-6">
        Learn about neural networks by building one. Connect the input, hidden, and output layers to create a simple AI.
      </p>
    )}
    <GameButton onClick={onStart} className="bg-blue-500 hover:bg-blue-600">
      Start Building!
    </GameButton>
  </div>
);

// --- Game Logic and State ---

interface Neuron {
  id: string;
  position: [number, number, number];
  layer: number;
  type: 'input' | 'hidden' | 'output';
  label: string;
}

interface Connection {
  from: string;
  to: string;
}

interface GameState {
  level: number;
  score: number;
  neurons: Neuron[];
  connections: Connection[];
  isBuilding: boolean;
  result: string | null;
  age: number;
}

const getNeurons = (level: number): Neuron[] => {
  const neurons: Neuron[] = [];
  // Input Neurons
  neurons.push({ id: 'i1', position: [-4, 1, 0], layer: 0, type: 'input', label: 'Input 1' });
  neurons.push({ id: 'i2', position: [-4, -1, 0], layer: 0, type: 'input', label: 'Input 2' });
  // Hidden Neurons
  neurons.push({ id: 'h1', position: [0, 1, 0], layer: 1, type: 'hidden', label: 'Hidden 1' });
  neurons.push({ id: 'h2', position: [0, -1, 0], layer: 1, type: 'hidden', label: 'Hidden 2' });
  // Output Neuron
  neurons.push({ id: 'o1', position: [4, 0, 0], layer: 2, type: 'output', label: 'Output' });
  return neurons;
};

const EnhancedNeuralNetworkChamber: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    neurons: [],
    connections: [],
    isBuilding: false,
    result: null,
    age: 8, // Default age
  });

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      neurons: getNeurons(prev.level),
      connections: [],
      isBuilding: true,
      result: null,
    }));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleConnect = (from: string, to: string) => {
    if (!gameState.isBuilding) return;

    const newConnection = { from, to };
    const newConnections = [...gameState.connections, newConnection];
    setGameState(prev => ({ ...prev, connections: newConnections }));

    if (newConnections.length === 4) {
      setGameState(prev => ({
        ...prev,
        isBuilding: false,
        result: 'You built a neural network!',
        score: prev.score + 100,
        level: prev.level + 1,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Brain Builder</h1>
          <p className="text-gray-300">Level: {gameState.level} | Score: {gameState.score}</p>
        </div>

        {/* 3D Canvas */}
        <div className="h-96 bg-gray-700 rounded-lg mb-8">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enablePan={false} enableZoom={false} />
            {gameState.neurons.map(neuron => (
              <Sphere key={neuron.id} position={neuron.position} args={[0.5, 32, 32]}>
                <meshStandardMaterial color={neuron.type === 'input' ? 'blue' : neuron.type === 'hidden' ? 'purple' : 'green'} />
              </Sphere>
            ))}
            {gameState.connections.map((conn, i) => {
              const fromNeuron = gameState.neurons.find(n => n.id === conn.from);
              const toNeuron = gameState.neurons.find(n => n.id === conn.to);
              if (!fromNeuron || !toNeuron) return null;
              return <Line key={i} points={[fromNeuron.position, toNeuron.position]} color="white" lineWidth={2} />;
            })}
          </Canvas>
        </div>

        {/* Controls */}
        {gameState.isBuilding && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect the neurons!</h2>
            <div className="flex justify-center space-x-4">
              <GameButton onClick={() => handleConnect('i1', 'h1')} className="bg-blue-500 hover:bg-blue-600">Input 1 to Hidden 1</GameButton>
              <GameButton onClick={() => handleConnect('i2', 'h2')} className="bg-blue-500 hover:bg-blue-600">Input 2 to Hidden 2</GameButton>
              <GameButton onClick={() => handleConnect('h1', 'o1')} className="bg-purple-500 hover:bg-purple-600">Hidden 1 to Output</GameButton>
              <GameButton onClick={() => handleConnect('h2', 'o1')} className="bg-purple-500 hover:bg-purple-600">Hidden 2 to Output</GameButton>
            </div>
          </div>
        )}

        {/* Result Message */}
        {gameState.result && (
          <div className="text-center mt-8 p-4 rounded-lg bg-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-green-400">{gameState.result}</h2>
            <GameButton onClick={startNewRound} className="bg-purple-500 hover:bg-purple-600">
              Build Another!
            </GameButton>
          </div>
        )}
        
        {/* Tutorial Overlay */}
        {gameState.level === 1 && !gameState.isBuilding && !gameState.result && (
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

export default EnhancedNeuralNetworkChamber;