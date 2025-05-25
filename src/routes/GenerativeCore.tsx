import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// Sacred color palette
const SACRED_COLORS = {
  axisX: '#00D4FF',
  axisY: '#8B5FFF', 
  axisZ: '#FF6B35',
  voidBlack: '#0A0A0F',
  nodeCore: '#FFD700',
  textPrimary: '#E8E8FF',
  textSecondary: '#A8A8C8',
  crystalWhite: '#F8F8FF',
  energyGlow: '#00FFFF'
};

// Generative patterns that players can create
const PATTERN_TYPES = {
  SPIRAL: 'spiral',
  FRACTAL: 'fractal',
  WAVE: 'wave',
  CRYSTAL: 'crystal',
  NEURAL: 'neural'
};

const SACRED_GEOMETRIES = [
  { name: 'Tetrahedron', vertices: 4, sides: 4 },
  { name: 'Cube', vertices: 8, sides: 6 },
  { name: 'Octahedron', vertices: 6, sides: 8 },
  { name: 'Dodecahedron', vertices: 20, sides: 12 },
  { name: 'Icosahedron', vertices: 12, sides: 20 }
];

// Sacred particle system for generative effects
const GenerativeParticles = ({ pattern, intensity, color }: {
  pattern: string;
  intensity: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 1000 * intensity;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;
      
      switch (pattern) {
        case PATTERN_TYPES.SPIRAL:
          const theta = i * 0.1;
          const radius = Math.sqrt(i) * 0.1;
          pos[index] = Math.cos(theta) * radius;
          pos[index + 1] = (i / particleCount) * 10 - 5;
          pos[index + 2] = Math.sin(theta) * radius;
          break;
          
        case PATTERN_TYPES.FRACTAL:
          const scale = Math.pow(0.5, Math.floor(i / 100));
          pos[index] = (Math.random() - 0.5) * scale * 10;
          pos[index + 1] = (Math.random() - 0.5) * scale * 10;
          pos[index + 2] = (Math.random() - 0.5) * scale * 10;
          break;
          
        case PATTERN_TYPES.WAVE:
          const x = (i / particleCount) * 20 - 10;
          pos[index] = x;
          pos[index + 1] = Math.sin(x * 0.5) * 2;
          pos[index + 2] = Math.cos(x * 0.3) * 2;
          break;
          
        case PATTERN_TYPES.CRYSTAL:
          const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
          const angleStep = 2 * Math.PI / phi;
          const angle = i * angleStep;
          const y = 1 - (i / particleCount) * 2;
          const radiusAtY = Math.sqrt(1 - y * y);
          pos[index] = Math.cos(angle) * radiusAtY * 3;
          pos[index + 1] = y * 3;
          pos[index + 2] = Math.sin(angle) * radiusAtY * 3;
          break;
          
        case PATTERN_TYPES.NEURAL:
          const layer = Math.floor(i / 100);
          const nodeInLayer = i % 100;
          pos[index] = (nodeInLayer / 100) * 10 - 5;
          pos[index + 1] = layer * 2 - 5;
          pos[index + 2] = Math.sin(nodeInLayer * 0.1) * 2;
          break;
          
        default:
          pos[index] = (Math.random() - 0.5) * 10;
          pos[index + 1] = (Math.random() - 0.5) * 10;
          pos[index + 2] = (Math.random() - 0.5) * 10;
      }
    }
    
    return pos;
  }, [pattern, particleCount]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) },
          size: { value: 2.0 }
        }}
        vertexShader={`
          uniform float time;
          uniform float size;
          attribute vec3 position;
          varying vec3 vColor;
          
          void main() {
            vColor = vec3(0.5 + 0.5 * sin(time + position.x), 
                         0.5 + 0.5 * sin(time + position.y), 
                         0.5 + 0.5 * sin(time + position.z));
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          varying vec3 vColor;
          
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(color * vColor, alpha * 0.8);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Sacred geometric core that responds to generation
const SacredCore = ({ energy, pattern, pulseRate }: {
  energy: number;
  pattern: string;
  pulseRate: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseRate) * 0.3 + 1.0;
      meshRef.current.scale.setScalar(pulse * energy);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Icosahedron args={[1, 1]}>
        <shaderMaterial
          uniforms={{
            time: { value: 0 },
            energy: { value: energy },
            color: { value: new THREE.Color(SACRED_COLORS.nodeCore) }
          }}
          vertexShader={`
            uniform float time;
            uniform float energy;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              
              vec3 newPosition = position + normal * sin(time * 2.0 + position.x * 3.0) * 0.1 * energy;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            uniform float energy;
            uniform vec3 color;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              vec3 finalColor = color + fresnel * vec3(0.3, 0.6, 1.0) * energy;
              gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2);
            }
          `}
          transparent={true}
        />
      </Icosahedron>
    </group>
  );
};

// Main Generative Core game component
const GenerativeCore = () => {
  const [gameState, setGameState] = useState({
    stage: 'awakening', // awakening, creating, mastering
    currentPattern: PATTERN_TYPES.SPIRAL,
    patternIntensity: 0.5,
    coreEnergy: 0.3,
    creativityScore: 0,
    patternsUnlocked: [PATTERN_TYPES.SPIRAL],
    mysticalMoments: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(PATTERN_TYPES.SPIRAL);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [voiceGuidance, setVoiceGuidance] = useState("Welcome to the Generative Core, young architect of possibilities...");

  // Sacred button component
  const SacredButton = ({ children, variant = 'primary', onClick, disabled = false, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-mono text-sm tracking-wider
        bg-gradient-to-r from-transparent via-${variant === 'primary' ? 'blue' : 'purple'}-500/20 to-transparent
        border border-${variant === 'primary' ? 'blue' : 'purple'}-400/50
        text-white rounded-lg backdrop-blur-sm
        hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-500
        before:absolute before:inset-0 before:bg-gradient-to-r
        before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%]
        before:transition-transform before:duration-700
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );

  // Pattern generation logic
  const generatePattern = async (patternType) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setVoiceGuidance("Feel the sacred mathematics flowing through your consciousness...");
    
    // Simulate generative AI process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setGenerationProgress(i);
    }
    
    setGameState(prev => ({
      ...prev,
      currentPattern: patternType,
      patternIntensity: Math.random() * 0.5 + 0.5,
      coreEnergy: Math.min(prev.coreEnergy + 0.1, 1.0),
      creativityScore: prev.creativityScore + Math.floor(Math.random() * 100) + 50,
      mysticalMoments: prev.mysticalMoments + 1
    }));
    
    setIsGenerating(false);
    setVoiceGuidance("Magnificent! You've channeled the essence of creation itself.");
    
    // Unlock new patterns based on progress
    if (gameState.mysticalMoments >= 2 && !gameState.patternsUnlocked.includes(PATTERN_TYPES.FRACTAL)) {
      setGameState(prev => ({
        ...prev,
        patternsUnlocked: [...prev.patternsUnlocked, PATTERN_TYPES.FRACTAL]
      }));
      setVoiceGuidance("The Fractal mysteries reveal themselves to you...");
    }
  };

  // Sacred chamber background
  const SacredChamber = () => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      }
    });
    
    return (
      <group ref={meshRef}>
        {/* Sacred geometric backdrop */}
        <Torus args={[8, 0.5, 8, 32]} position={[0, 0, -10]}>
          <meshBasicMaterial color={SACRED_COLORS.axisX} opacity={0.1} transparent />
        </Torus>
        <Torus args={[6, 0.3, 6, 24]} position={[0, 0, -8]} rotation={[Math.PI/2, 0, 0]}>
          <meshBasicMaterial color={SACRED_COLORS.axisY} opacity={0.15} transparent />
        </Torus>
        <Sphere args={[12, 32, 32]} position={[0, 0, -15]}>
          <meshBasicMaterial color={SACRED_COLORS.voidBlack} opacity={0.3} transparent side={THREE.BackSide} />
        </Sphere>
      </group>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/30 to-black text-white overflow-hidden">
      {/* Sacred HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
            <h2 className="font-mono text-lg mb-2 text-yellow-300">Generative Core</h2>
            <div className="space-y-1 text-sm">
              <div>Creativity Score: <span className="text-cyan-400">{gameState.creativityScore.toLocaleString()}</span></div>
              <div>Core Energy: <span className="text-orange-400">{Math.floor(gameState.coreEnergy * 100)}%</span></div>
              <div>Mystical Moments: <span className="text-purple-400">{gameState.mysticalMoments}</span></div>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 max-w-md">
            <div className="text-xs text-purple-200 mb-2">Codekeeper Wisdom:</div>
            <div className="text-sm italic text-white/90">{voiceGuidance}</div>
          </div>
        </div>
      </div>

      {/* 3D Sacred Chamber */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 5]} intensity={1} color={SACRED_COLORS.energyGlow} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color={SACRED_COLORS.axisX} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color={SACRED_COLORS.axisY} />
          
          <SacredChamber />
          <SacredCore 
            energy={gameState.coreEnergy} 
            pattern={gameState.currentPattern}
            pulseRate={2 + gameState.mysticalMoments * 0.5}
          />
          <GenerativeParticles 
            pattern={gameState.currentPattern}
            intensity={gameState.patternIntensity}
            color={SACRED_COLORS.energyGlow}
          />
        </Canvas>
      </div>

      {/* Sacred Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="bg-black/70 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30">
          {/* Pattern Selection */}
          <div className="mb-6">
            <h3 className="font-mono text-lg mb-4 text-cyan-300">Sacred Pattern Genesis</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Object.values(PATTERN_TYPES).map(pattern => (
                <SacredButton
                  key={pattern}
                  variant={selectedPattern === pattern ? 'primary' : 'secondary'}
                  onClick={() => setSelectedPattern(pattern)}
                  disabled={!gameState.patternsUnlocked.includes(pattern)}
                  className="text-xs py-2 px-3"
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  {!gameState.patternsUnlocked.includes(pattern) && ' 🔒'}
                </SacredButton>
              ))}
            </div>
          </div>

          {/* Generation Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <SacredButton
              onClick={() => generatePattern(selectedPattern)}
              disabled={isGenerating}
              className="text-lg px-8 py-4"
            >
              {isGenerating ? 'Channeling...' : 'Generate Sacred Pattern'}
            </SacredButton>
            
            {isGenerating && (
              <div className="flex-1 max-w-xs">
                <div className="bg-black/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-200"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1 text-cyan-300">{generationProgress}%</div>
              </div>
            )}
          </div>

          {/* AI Concepts Learning */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-purple-200 mb-2">Generative AI Concepts Mastered:</div>
            <div className="flex flex-wrap gap-2">
              {gameState.mysticalMoments >= 1 && (
                <span className="px-2 py-1 bg-purple-500/20 rounded text-xs border border-purple-400/30">
                  Pattern Recognition
                </span>
              )}
              {gameState.mysticalMoments >= 3 && (
                <span className="px-2 py-1 bg-blue-500/20 rounded text-xs border border-blue-400/30">
                  Creative Generation
                </span>
              )}
              {gameState.mysticalMoments >= 5 && (
                <span className="px-2 py-1 bg-orange-500/20 rounded text-xs border border-orange-400/30">
                  Latent Space Navigation
                </span>
              )}
              {gameState.mysticalMoments >= 8 && (
                <span className="px-2 py-1 bg-green-500/20 rounded text-xs border border-green-400/30">
                  Emergent Complexity
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerativeCore;