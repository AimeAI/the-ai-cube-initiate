import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import SacredButton from '../components/sacred/SacredButton';
import CrystalCard from '../components/sacred/CrystalCard';
import { Lock, Play, CheckCircle, Star } from 'lucide-react';

// Sacred floating cube component using React Three Fiber
const SacredFloatingCube: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && outerRef.current) {
      // Golden ratio rotation speeds
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.z += delta * 0.15;
      
      // Outer cube counter-rotation
      outerRef.current.rotation.x -= delta * 0.2;
      outerRef.current.rotation.y -= delta * 0.3;
      
      // Sacred floating motion
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.3;
      outerRef.current.position.y = Math.cos(time * 0.6) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial 
          color="#00D4FF"
          transparent 
          opacity={0.6}
          wireframe={true}
          emissive="#00D4FF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh ref={outerRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#8B5FFF"
          transparent 
          opacity={0.3}
          wireframe={true}
          emissive="#8B5FFF"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

// Game configuration with all 10 sacred simulations
const SACRED_GAMES = [
  {
    id: 'snake3d',
    name: 'Snake³: Axis Mind',
    route: '/snake3',
    primaryColor: 'cyan',
    description: 'Navigate the void, master spatial reasoning, and awaken your axis mind.',
    skills: ['Spatial Reasoning', 'Dimensional Thinking', 'Pattern Recognition'],
    status: 'available',
    difficulty: 'Initiate',
    completionRate: 85,
  },
  {
    id: 'crystal-resonance',
    name: 'Crystal Resonance',
    route: '/crystal-resonance', 
    primaryColor: 'violet',
    description: 'Harmonize with mystical frequencies and unlock resonance patterns.',
    skills: ['Pattern Matching', 'Frequency Analysis', 'Harmonic Thinking'],
    status: 'available',
    difficulty: 'Adept',
    completionRate: 72,
  },
  {
    id: 'classifier',
    name: 'Classifier Construct',
    route: '/classifier-construct',
    primaryColor: 'violet',
    description: 'Sculpt constellations and classify sacred gestures to understand AI patterns.',
    skills: ['Pattern Recognition', 'Classification', 'Feature Extraction'],
    status: 'available',
    difficulty: 'Adept',
    completionRate: 0,
  },
  {
    id: 'vision-system',
    name: 'Vision System',
    route: '/vision-system',
    primaryColor: 'gold',
    description: 'Perceive hidden dimensions and understand AI vision.',
    skills: ['Image Recognition', 'Object Detection', 'Scene Understanding'],
    status: 'available',
    difficulty: 'Mystic',
    completionRate: 0,
  },
  {
    id: 'predictor',
    name: 'Predictor Engine',
    route: '/predictor-engine',
    primaryColor: 'orange',
    description: 'Foresee cosmic events and master the art of predictive modeling.',
    skills: ['Predictive Analysis', 'Probability', 'Data Interpretation'],
    status: 'available',
    difficulty: 'Master',
    completionRate: 0,
  },
  {
    id: 'ethics',
    name: 'Ethics Framework',
    route: '/ethics-framework',
    primaryColor: 'blue',
    description: 'Navigate moral labyrinths and build ethical AI constructs.',
    skills: ['Ethical Reasoning', 'Bias Detection', 'Decision Making'],
    status: 'available',
    difficulty: 'Sage',
    completionRate: 0,
  },
  {
    id: 'reinforcement-lab',
    name: 'Reinforcement Lab',
    route: '/reinforcement-lab',
    primaryColor: 'purple',
    description: 'Train celestial agents through trial, error, and reward.',
    skills: ['Reinforcement Learning', 'Strategy', 'Optimization'],
    status: 'available',
    difficulty: 'Master',
    completionRate: 0,
  },
  {
    id: 'neural-forge',
    name: 'Neural Forge',
    route: '/neural-forge',
    primaryColor: 'emerald',
    description: 'Architect consciousness and forge neural pathways.',
    skills: ['Neural Networks', 'Architecture Design', 'Deep Learning'],
    status: 'available',
    difficulty: 'Architect',
    completionRate: 0,
  },
  {
    id: 'quantum-mind',
    name: 'Quantum Mind',
    route: '/quantum-mind',
    primaryColor: 'indigo',
    description: 'Transcend classical computation and embrace quantum consciousness.',
    skills: ['Quantum Computing', 'Superposition', 'Entanglement'],
    status: 'coming-soon',
    difficulty: 'Transcendent',
    completionRate: 0,
  },
  {
    id: 'generative-core',
    name: 'Generative Core',
    route: '/generative-core',
    primaryColor: 'gold',
    description: 'Master sacred geometry and generative AI patterns through divine chamber experiences.',
    skills: ['Generative AI', 'Sacred Geometry', 'Pattern Creation'],
    status: 'available',
    difficulty: 'Mystic',
    completionRate: 0,
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree Oracle',
    route: '/decision-tree-game',
    primaryColor: 'emerald',
    description: 'Navigate mystical paths and master the art of intelligent decision-making through sacred classification.',
    skills: ['Decision Trees', 'Binary Classification', 'Path Analysis'],
    status: 'available',
    difficulty: 'Adept',
    completionRate: 0,
  },
  {
    id: 'neural-network-chamber',
    name: 'Neural Network Chamber',
    route: '/neural-network-chamber',
    primaryColor: 'cyan',
    description: 'Explore the sacred architecture of consciousness through 3D neural network visualization and training.',
    skills: ['Neural Networks', '3D Visualization', 'Network Training'],
    status: 'available',
    difficulty: 'Mystic',
    completionRate: 0,
  },
  {
    id: 'founders-chamber-module-1',
    name: 'Founders Chamber: Vision Genesis',
    route: '/founders-chamber-module-1',
    primaryColor: 'gold',
    description: 'Enter the Vision Genesis chamber to crystallize your founder\'s sight.',
    skills: ['Vision Casting', 'Problem Identification', 'Solution Design'],
    status: 'available',
    difficulty: 'Initiate',
    completionRate: 0,
  },
  {
    id: 'neural-pathways',
    name: 'Neural Pathways',
    route: '/neural-pathways',
    primaryColor: 'orange', // Example color, can be adjusted
    description: 'Connect neural nodes and find hidden patterns to advance your consciousness.',
    skills: ['Pattern Recognition', 'Spatial Reasoning', 'Three.js'],
    status: 'available',
    difficulty: 'Adept', // Example difficulty
    completionRate: 0,
  },
  {
    id: 'neural-pathways',
    name: 'Neural Pathways',
    route: '/neural-pathways',
    primaryColor: 'orange',
    description: 'Connect neural nodes and find hidden patterns to advance your consciousness.',
    skills: ['Pattern Recognition', 'Spatial Reasoning', 'Three.js'],
    status: 'available',
    difficulty: 'Adept',
    completionRate: 0,
  },
  {
    id: 'quantum-chamber',
    name: 'Quantum Chamber',
    route: '/quantum-chamber',
    primaryColor: 'indigo', // Matching the 'Quantum Mind' theme for consistency
    description: 'Explore the mysteries of quantum mechanics, superposition, and entanglement.',
    skills: ['Quantum Mechanics', 'Superposition', 'Entanglement', 'Three.js'],
    status: 'available',
    difficulty: 'Mystic', // Or choose an appropriate difficulty
    completionRate: 0, // Initial completion rate
  },
  {
    id: 'singularity-gate',
    name: 'Singularity Gate',
    route: '/singularity',
    primaryColor: 'white',
    description: 'Unlock the final mysteries of artificial consciousness.',
    skills: ['AGI Concepts', 'Consciousness', 'Transcendence'],
    status: 'locked',
    difficulty: 'Omega',
    completionRate: 0,
  },
];

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Play className="w-5 h-5 text-green-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'coming-soon':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'locked':
      default:
        return <Lock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Initiate': 'text-green-400',
      'Adept': 'text-blue-400',
      'Mystic': 'text-purple-400',
      'Master': 'text-orange-400',
      'Sage': 'text-red-400',
      'Architect': 'text-emerald-400',
      'Transcendent': 'text-indigo-400',
      'Omega': 'text-white',
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  const handleGameSelect = (game: any) => {
    if (game.status === 'available') {
      navigate(game.route);
    } else if (game.status === 'coming-soon') {
      setSelectedGame(game.id);
      // Show coming soon message
    }
  };

  return (
    <div className="min-h-screen bg-void-black text-crystal-white">
      {/* Sacred header with floating cube */}
      <header className="relative py-12 px-6 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-orbitron font-bold mb-2 sacred-text">
                Sacred Learning Portal
              </h1>
              <p className="text-text-secondary">
                Your journey through the ten sacred simulations
              </p>
            </div>
            
            {/* Floating sacred cube */}
            <div className="w-32 h-32 relative">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={0.8} color="#00D4FF" />
                <React.Suspense fallback={null}>
                  <SacredFloatingCube />
                </React.Suspense>
              </Canvas>
            </div>
          </div>
          
          {/* Progress overview */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">5</div>
              <div className="text-sm text-text-secondary">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">4</div>
              <div className="text-sm text-text-secondary">Coming Soon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">1</div>
              <div className="text-sm text-text-secondary">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">52%</div>
              <div className="text-sm text-text-secondary">Avg Progress</div>
            </div>
          </div>
        </div>
      </header>

      {/* Games grid */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-orbitron text-center mb-12 sacred-text">
            Ten Sacred Simulations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SACRED_GAMES.map((game, index) => (
              <CrystalCard 
                key={game.id} 
                glow={game.primaryColor as any}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  game.status === 'locked' ? 'opacity-50' : ''
                }`}
                onClick={() => handleGameSelect(game)}
              >
                <div className="text-center flex flex-col h-full p-4">
                  {/* Game number and status */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-orbitron text-gray-400">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    {getStatusIcon(game.status)}
                  </div>
                  
                  {/* Game title */}
                  <h3 className="text-lg font-orbitron mb-2 text-crystal-white">
                    {game.name}
                  </h3>
                  
                  {/* Difficulty badge */}
                  <div className={`text-xs font-orbitron mb-3 ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </div>
                  
                  {/* Description */}
                  <p className="text-text-secondary mb-4 text-sm flex-grow leading-relaxed">
                    {game.description}
                  </p>
                  
                  {/* Skills */}
                  <div className="text-xs text-[var(--axis-x)] mb-4">
                    {game.skills.join(' • ')}
                  </div>
                  
                  {/* Progress bar for available games */}
                  {game.status === 'available' && game.completionRate > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{game.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-violet-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${game.completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Action button */}
                  <div className="mt-auto">
                    {game.status === 'available' && (
                      <SacredButton 
                        variant="primary" 
                        size="small"
                        className="w-full"
                      >
                        Enter Simulation
                      </SacredButton>
                    )}
                    {game.status === 'coming-soon' && (
                      <SacredButton 
                        variant="secondary" 
                        size="small"
                        className="w-full opacity-75"
                        disabled
                      >
                        Coming Soon
                      </SacredButton>
                    )}
                    {game.status === 'locked' && (
                      <SacredButton 
                        variant="secondary" 
                        size="small"
                        className="w-full opacity-50"
                        disabled
                      >
                        Locked
                      </SacredButton>
                    )}
                  </div>
                </div>
              </CrystalCard>
            ))}
          </div>
        </div>
      </main>

      {/* Return to home */}
      <footer className="py-8 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <SacredButton 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            Return to Sacred Portal
          </SacredButton>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;