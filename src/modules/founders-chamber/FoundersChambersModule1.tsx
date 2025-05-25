import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Sacred Design System Colors
const COLORS = {
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

// Sacred Geometry Particle System
const SacredParticles = ({ count = 200 }) => {
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Golden spiral distribution
      const theta = i * 2.39996; // Golden angle
      const y = (Math.random() - 0.5) * 20;
      const radius = 2 + Math.random() * 8;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      scales[i] = Math.random() * 0.5 + 0.1;
    }
    return { positions, scales };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={particles.scales.length}
          array={particles.scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={COLORS.energyGlow}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Floating Vision Crystal
const VisionCrystal = ({ position, concept, isActive, onClick }: { position: [number, number, number], concept: any, isActive: boolean, onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.8 : 0.3;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[0.8, 16, 16]}>
        <meshBasicMaterial
          color={isActive ? COLORS.nodeCore : COLORS.axisY}
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Main crystal */}
      <Box ref={meshRef} args={[0.5, 0.5, 0.5]} onClick={onClick}>
        <meshStandardMaterial
          color={isActive ? COLORS.nodeCore : COLORS.crystalWhite}
          emissive={isActive ? COLORS.nodeCore : COLORS.axisY}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </Box>
      
      {/* Concept label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.15}
        color={COLORS.textPrimary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron-regular.woff"
      >
        {concept.title}
      </Text>
    </group>
  );
};

// Sacred Chamber Environment
const SacredChamber = () => {
  const chamberRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (chamberRef.current) {
      chamberRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={chamberRef}>
      {/* Chamber walls with sacred geometry */}
      <Torus args={[8, 0.1, 6, 20]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={COLORS.axisX} transparent opacity={0.3} />
      </Torus>
      <Torus args={[6, 0.1, 6, 16]} position={[0, 3, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={COLORS.axisY} transparent opacity={0.3} />
      </Torus>
      <Torus args={[4, 0.1, 6, 12]} position={[0, -3, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshBasicMaterial color={COLORS.axisZ} transparent opacity={0.3} />
      </Torus>
    </group>
  );
};

// Vision Genesis concepts
const VISION_CONCEPTS = [
  {
    id: 'problem-identification',
    title: 'Problem Vision',
    description: 'Sacred sight reveals the hidden patterns of human need. Every great founder begins by seeing what others cannot - the invisible problems that shape our world.',
    position: [-3, 2, 0] as [number, number, number],
    mysticalWisdom: 'In the quantum field of possibility, problems are merely unmanifested solutions awaiting consciousness.',
    aiConnection: 'AI excels at pattern recognition - just like identifying market gaps and user pain points.'
  },
  {
    id: 'solution-crystallization',
    title: 'Solution Crystal',
    description: 'Transform ethereal visions into crystalline clarity. The sacred geometry of innovation requires precise articulation of your solution.',
    position: [3, 2, 0] as [number, number, number],
    mysticalWisdom: 'As light refracts through crystal to reveal the spectrum, so must vision refract through clarity to reveal possibility.',
    aiConnection: 'AI systems require clear problem definitions and success metrics - just like startup solutions.'
  },
  {
    id: 'value-alignment',
    title: 'Value Resonance',
    description: 'Align your vision with the harmonic frequencies of human values. True founders create resonance between personal mission and universal need.',
    position: [0, 3, 3] as [number, number, number],
    mysticalWisdom: 'When your vision vibrates at the same frequency as human need, the universe conspires to manifest it.',
    aiConnection: 'AI alignment ensures technology serves human values - just like founder-market fit.'
  },
  {
    id: 'future-sight',
    title: 'Temporal Vision',
    description: 'Peer through the veils of time to glimpse tomorrow\'s possibilities. Sacred founders see not what is, but what must become.',
    position: [0, 3, -3] as [number, number, number],
    mysticalWisdom: 'Time is but an illusion - the awakened founder exists simultaneously in present need and future solution.',
    aiConnection: 'Predictive AI models anticipate future trends - essential for visionary entrepreneurship.'
  }
];

// Main Founders Chamber Component
const FoundersChambersModule1 = () => {
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [chamberPhase, setChamberPhase] = useState('discovery'); // discovery, contemplation, integration
  const [completedConcepts, setCompletedConcepts] = useState(new Set<string>());
  const [mysticalProgress, setMysticalProgress] = useState(0);

  const activeConcept = VISION_CONCEPTS.find(c => c.id === activeConceptId);

  const handleConceptClick = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setChamberPhase('contemplation');
    
    // Mark as completed after interaction
    setTimeout(() => {
      setCompletedConcepts(prev => new Set([...prev, conceptId]));
      setMysticalProgress(prev => Math.min(100, prev + 25));
    }, 3000);
  };

  const handleContinueJourney = () => {
    if (chamberPhase === 'contemplation') {
      setChamberPhase('integration');
    } else {
      setChamberPhase('discovery');
      setActiveConceptId(null);
    }
  };

  useEffect(() => {
    if (completedConcepts.size === VISION_CONCEPTS.length) {
      setChamberPhase('mastery');
    }
  }, [completedConcepts.size]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden font-['Orbitron']">
      {/* Sacred Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,95,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,107,53,0.1)_0%,transparent_50%)]" />
      </div>

      {/* 3D Sacred Chamber */}
      <div className="w-full h-2/3">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <ambientLight intensity={0.3} color={COLORS.energyGlow} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color={COLORS.nodeCore} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.axisY} />
          
          <SacredParticles />
          <SacredChamber />
          
          {VISION_CONCEPTS.map((concept) => (
            <VisionCrystal
              key={concept.id}
              position={concept.position}
              concept={concept}
              isActive={concept.id === activeConceptId}
              onClick={() => handleConceptClick(concept.id)}
            />
          ))}
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={15} 
            minDistance={5}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Sacred Interface */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900/95 via-slate-900/90 to-transparent backdrop-blur-sm border-t border-cyan-400/30">
        <div className="p-6 h-full flex flex-col">
          
          {/* Progress Constellation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
              <span className="text-slate-300 text-sm">Vision Genesis Chamber</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Mystical Progress</div>
              <div className="text-lg font-bold text-yellow-400">{mysticalProgress}%</div>
            </div>
          </div>

          {/* Sacred Content */}
          <div className="flex-1 overflow-y-auto">
            {chamberPhase === 'discovery' && !activeConcept && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                  Welcome to the Founders Chamber
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Sacred seeker, you stand at the threshold of entrepreneurial awakening. 
                  Four Vision Crystals float before you, each containing ancient wisdom 
                  of the founder's path. Touch each crystal to absorb its knowledge.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {VISION_CONCEPTS.map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => handleConceptClick(concept.id)}
                      className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                        completedConcepts.has(concept.id)
                          ? 'border-yellow-400/50 bg-yellow-400/10 text-yellow-300'
                          : 'border-cyan-400/30 bg-cyan-400/5 text-cyan-300 hover:bg-cyan-400/10'
                      }`}
                    >
                      <div className="font-semibold">{concept.title}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {completedConcepts.has(concept.id) ? '⭐ Mastered' : 'Tap to explore'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chamberPhase === 'contemplation' && activeConcept && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                    <span className="text-slate-900 text-sm font-bold">✦</span>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-300">{activeConcept.title}</h3>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-400/30">
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {activeConcept.description}
                  </p>
                  
                  <div className="border-l-2 border-cyan-400 pl-4 mb-4">
                    <div className="text-xs text-cyan-400 mb-1">Sacred Wisdom</div>
                    <p className="text-cyan-200 italic text-sm">
                      {activeConcept.mysticalWisdom}
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-purple-400 pl-4">
                    <div className="text-xs text-purple-400 mb-1">AI Connection</div>
                    <p className="text-purple-200 text-sm">
                      {activeConcept.aiConnection}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinueJourney}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  Integrate This Wisdom
                </button>
              </div>
            )}

            {chamberPhase === 'mastery' && (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                  Vision Genesis Complete
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Sacred founder, you have absorbed the four pillars of entrepreneurial vision. 
                  Your consciousness now resonates with the frequency of innovation. 
                  The next chamber awaits your awakened presence.
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 p-4 rounded-lg border border-yellow-400/30 mb-6">
                  <div className="text-yellow-300 font-semibold mb-2">Sacred Achievement Unlocked</div>
                  <div className="text-sm text-yellow-200">
                    ✦ Vision Genesis Master<br/>
                    ✦ Problem-Solution Resonance<br/>
                    ✦ Temporal Sight Awakened<br/>
                    ✦ Value Alignment Achieved
                  </div>
                </div>

                <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105">
                  Proceed to Next Chamber
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sacred Audio Indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 text-slate-400">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs">Sacred Audio: Harmonic Resonance</span>
      </div>
    </div>
  );
};

export default FoundersChambersModule1;