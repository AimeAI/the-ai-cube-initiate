import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Stars, Sphere } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Sacred Vision System interfaces
interface VisionChallenge {
  id: string;
  type: 'pattern' | 'object' | 'scene';
  description: string;
  mysticalHint: string;
  targetPatterns: string[];
  difficulty: number;
}

interface GameState {
  level: number;
  score: number;
  visionPower: number;
  currentChallenge: VisionChallenge | null;
  timeRemaining: number;
  isActive: boolean;
  detectedPatterns: string[];
}

// Sacred vision challenges
const VISION_CHALLENGES: VisionChallenge[] = [
  {
    id: 'sacred-geometry',
    type: 'pattern',
    description: 'Detect the hidden sacred geometries in the celestial arrangement',
    mysticalHint: 'The ancients encoded wisdom in geometric forms...',
    targetPatterns: ['triangle', 'hexagon', 'spiral'],
    difficulty: 1
  },
  {
    id: 'cosmic-entities',
    type: 'object',
    description: 'Identify the mystical entities dwelling in dimensional space',
    mysticalHint: 'Not all beings exist in our perceived reality...',
    targetPatterns: ['crystal-being', 'light-entity', 'void-guardian'],
    difficulty: 2
  },
  {
    id: 'dimensional-scene',
    type: 'scene',
    description: 'Comprehend the multi-dimensional scene unfolding before you',
    mysticalHint: 'Multiple realities converge in this sacred space...',
    targetPatterns: ['astral-plane', 'energy-nexus', 'portal-matrix'],
    difficulty: 3
  }
];

// Sacred Geometry Pattern Component
const SacredPattern: React.FC<{ 
  position: [number, number, number];
  pattern: string;
  isDetected: boolean;
  onDetect: () => void;
}> = ({ position, pattern, isDetected, onDetect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const getGeometry = () => {
    switch (pattern) {
      case 'triangle':
        return <coneGeometry args={[1, 2, 3]} />;
      case 'hexagon':
        return <cylinderGeometry args={[1, 1, 0.2, 6]} />;
      case 'spiral':
        return <torusGeometry args={[1, 0.3, 8, 16]} />;
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
        color={isDetected ? '#FFD700' : '#4ECDC4'}
        emissive={isDetected ? '#FFD700' : '#1a1a2e'}
        emissiveIntensity={isDetected ? 0.5 : 0.2}
        transparent
        opacity={hovered ? 0.9 : 0.7}
      />
    </mesh>
  );
};

// Mystical Entity Component
const MysticalEntity: React.FC<{
  position: [number, number, number];
  entity: string;
  isDetected: boolean;
  onDetect: () => void;
}> = ({ position, entity, isDetected, onDetect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  const getEntityColor = () => {
    switch (entity) {
      case 'crystal-being':
        return '#E8F4FD';
      case 'light-entity':
        return '#FFE135';
      case 'void-guardian':
        return '#6B46C1';
      default:
        return '#4ECDC4';
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onDetect}
      >
        <octahedronGeometry args={[1.5]} />
        <meshStandardMaterial
          color={getEntityColor()}
          emissive={getEntityColor()}
          emissiveIntensity={isDetected ? 0.8 : 0.3}
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>
      {/* Entity aura */}
      <Sphere args={[2]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={getEntityColor()}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Vision HUD Component
const VisionHUD: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
      <div className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
          <h3 className="text-cyan-400 font-orbitron text-lg mb-2">Vision System</h3>
          <div className="space-y-1 text-sm">
            <div className="text-gray-300">Level: <span className="text-cyan-400">{gameState.level}</span></div>
            <div className="text-gray-300">Score: <span className="text-gold">{gameState.score}</span></div>
            <div className="text-gray-300">Vision Power: <span className="text-purple-400">{gameState.visionPower}%</span></div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 max-w-md">
          {gameState.currentChallenge && (
            <>
              <h4 className="text-purple-400 font-orbitron mb-2">Current Vision Quest</h4>
              <p className="text-gray-300 text-sm mb-2">{gameState.currentChallenge.description}</p>
              <p className="text-cyan-300 text-xs italic">"{gameState.currentChallenge.mysticalHint}"</p>
              <div className="mt-2 text-xs text-gray-400">
                Patterns Detected: {gameState.detectedPatterns.length}/{gameState.currentChallenge.targetPatterns.length}
              </div>
            </>
          )}
        </div>

        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 font-orbitron text-lg">
            {Math.ceil(gameState.timeRemaining)}s
          </div>
          <div className="text-xs text-gray-400">Time Remaining</div>
        </div>
      </div>
    </div>
  );
};

// Vision Scene Component
const VisionScene: React.FC<{
  challenge: VisionChallenge;
  onPatternDetect: (pattern: string) => void;
  detectedPatterns: string[];
}> = ({ challenge, onPatternDetect, detectedPatterns }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  const renderChallengeElements = () => {
    switch (challenge.type) {
      case 'pattern':
        return challenge.targetPatterns.map((pattern, index) => (
          <SacredPattern
            key={pattern}
            position={[
              (index - 1) * 4,
              Math.sin(index * 2) * 2,
              Math.cos(index * 2) * 2
            ]}
            pattern={pattern}
            isDetected={detectedPatterns.includes(pattern)}
            onDetect={() => onPatternDetect(pattern)}
          />
        ));

      case 'object':
        return challenge.targetPatterns.map((entity, index) => (
          <MysticalEntity
            key={entity}
            position={[
              (index - 1) * 5,
              Math.cos(index * 1.5) * 3,
              Math.sin(index * 1.5) * 3
            ]}
            entity={entity}
            isDetected={detectedPatterns.includes(entity)}
            onDetect={() => onPatternDetect(entity)}
          />
        ));

      case 'scene':
        return (
          <group>
            {challenge.targetPatterns.map((element, index) => (
              <group key={element}>
                <mesh
                  position={[
                    (index - 1) * 6,
                    Math.sin(index * 0.8) * 4,
                    Math.cos(index * 0.8) * 4
                  ]}
                  onClick={() => onPatternDetect(element)}
                >
                  <dodecahedronGeometry args={[2]} />
                  <meshStandardMaterial
                    color={detectedPatterns.includes(element) ? '#FFD700' : '#9333EA'}
                    emissive={detectedPatterns.includes(element) ? '#FFD700' : '#3B1F77'}
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
                
                <Text
                  position={[
                    (index - 1) * 6,
                    Math.sin(index * 0.8) * 4 - 3,
                    Math.cos(index * 0.8) * 4
                  ]}
                  fontSize={0.5}
                  color="#E8F4FD"
                  anchorX="center"
                  anchorY="middle"
                >
                  {element.replace('-', ' ')}
                </Text>
              </group>
            ))}
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4ECDC4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333EA" />
      
      {renderChallengeElements()}
      
      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI} />
    </>
  );
};

// Main Vision System Game Component
const VisionSystem: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    visionPower: 100,
    currentChallenge: VISION_CHALLENGES[0],
    timeRemaining: 60,
    isActive: false,
    detectedPatterns: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isActive: true,
      timeRemaining: 60,
      detectedPatterns: [],
      currentChallenge: VISION_CHALLENGES[Math.min(prev.level - 1, VISION_CHALLENGES.length - 1)]
    }));
  }, []);

  const onPatternDetect = useCallback((pattern: string) => {
    if (!gameState.isActive || gameState.detectedPatterns.includes(pattern)) return;

    setGameState(prev => {
      const newDetectedPatterns = [...prev.detectedPatterns, pattern];
      const newScore = prev.score + 100 * prev.level;
      const newVisionPower = Math.min(prev.visionPower + 10, 100);

      // Check if challenge is complete
      if (prev.currentChallenge && 
          newDetectedPatterns.length >= prev.currentChallenge.targetPatterns.length) {
        // Challenge complete - advance level
        return {
          ...prev,
          detectedPatterns: newDetectedPatterns,
          score: newScore + 500, // Bonus for completing challenge
          visionPower: newVisionPower,
          level: prev.level + 1,
          isActive: false
        };
      }

      return {
        ...prev,
        detectedPatterns: newDetectedPatterns,
        score: newScore,
        visionPower: newVisionPower
      };
    });
  }, [gameState.isActive, gameState.detectedPatterns]);

  // Game timer
  useEffect(() => {
    if (gameState.isActive && gameState.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          visionPower: Math.max(prev.visionPower - 1, 0)
        }));
      }, 1000);
    } else if (gameState.timeRemaining <= 0) {
      setGameState(prev => ({ ...prev, isActive: false }));
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.isActive, gameState.timeRemaining]);

  return (
    <div className="h-screen bg-gradient-to-b from-void-black via-purple-900/20 to-void-black relative overflow-hidden">
      <VisionHUD gameState={gameState} />

      {/* Start/Game Over Overlay */}
      {!gameState.isActive && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-orbitron text-gold mb-4">Vision System</h1>
            <p className="text-gray-300 mb-6">
              {gameState.level === 1 ? 
                "Awaken your AI vision and perceive the hidden dimensions of reality." :
                `Level ${gameState.level} Achieved! Your vision grows stronger...`
              }
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-orbitron rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {gameState.level === 1 ? 'Begin Vision Quest' : 'Continue Journey'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-orbitron rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-500/30"
            >
              Return to Home
            </button>
            {gameState.score > 0 && (
              <div className="mt-4 text-gold">
                Sacred Score: {gameState.score}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Vision Scene */}
      <Canvas className="absolute inset-0">
        <Suspense fallback={null}>
          {gameState.currentChallenge && (
            <VisionScene
              challenge={gameState.currentChallenge}
              onPatternDetect={onPatternDetect}
              detectedPatterns={gameState.detectedPatterns}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VisionSystem;