import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line, Effects, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { MythTechTheme } from '@/styles/theme'; // Import MythTechTheme

// ===== GAME CONSTANTS =====
const GRID_SIZE = 8;
const CELL_SIZE = 1;

type Coord3D = [number, number, number];

interface Level {
  id: number;
  name: string;
  description: string;
  playerStart: Coord3D;
  targets: Coord3D[];
  orbs: Coord3D[];
  superpositionZones: Coord3D[];
  entanglementGates: Coord3D[];
  obstacles: Coord3D[];
  requiredOrbs: number;
  tip: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Quantum Discovery",
    description: "Learn about superposition! Collect the glowing orbs while in superposition state.",
    playerStart: [4, 0, 4],
    targets: [[2, 0, 2], [6, 0, 6]],
    orbs: [[3, 0.5, 3], [5, 0.5, 5]],
    superpositionZones: [[4, 0, 4]],
    entanglementGates: [],
    obstacles: [],
    requiredOrbs: 2,
    tip: "Superposition lets quantum bits be 0 AND 1 at the same time!"
  },
  {
    id: 2,
    name: "Entanglement Bridge",
    description: "Use entanglement gates to teleport across gaps!",
    playerStart: [1, 0, 4],
    targets: [[7, 0, 4]],
    orbs: [[4, 0.5, 2], [4, 0.5, 6]],
    superpositionZones: [[1, 0, 4]],
    entanglementGates: [[3, 0, 4], [5, 0, 4]],
    obstacles: [[2, 0, 4], [6, 0, 4]],
    requiredOrbs: 2,
    tip: "Entangled particles affect each other instantly, no matter the distance!"
  },
  {
    id: 3,
    name: "Quantum Maze",
    description: "Navigate through obstacles using quantum mechanics!",
    playerStart: [1, 0, 1],
    targets: [[7, 0, 7]],
    orbs: [[2, 0.5, 3], [5, 0.5, 2], [6, 0.5, 5]],
    superpositionZones: [[1, 0, 1], [4, 0, 4]],
    entanglementGates: [[3, 0, 3], [5, 0, 5]],
    obstacles: [[2, 0, 1], [3, 0, 2], [4, 0, 3], [5, 0, 4], [6, 0, 3]],
    requiredOrbs: 3,
    tip: "Quantum computers can explore multiple paths simultaneously!"
  }
];

// ===== 3D COMPONENTS =====

// Animated Grid Floor
const GridFloor = () => {
  const [opacities, setOpacities] = useState(() => Array(GRID_SIZE * 2 + 2).fill(0.3));

  useFrame((state) => {
    setOpacities(prevOpacities =>
      prevOpacities.map((_, i) => 0.2 + 0.1 * Math.sin(state.clock.elapsedTime * 2 + i * 0.5))
    );
  });

  const lines: JSX.Element[] = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
    // Horizontal lines
    lines.push(
      <Line
        key={`h-${i}`}
        points={[[0, 0, i], [GRID_SIZE, 0, i]] as [Coord3D, Coord3D]}
        color="#00d4ff"
        lineWidth={1}
        transparent
        opacity={opacities[i * 2]}
      />
    );
    // Vertical lines
    lines.push(
      <Line
        key={`v-${i}`}
        points={[[i, 0, 0], [i, 0, GRID_SIZE]] as [Coord3D, Coord3D]}
        color="#8b5fff"
        lineWidth={1}
        transparent
        opacity={opacities[i * 2 + 1]}
      />
    );
  }
  
  return <group position={[-GRID_SIZE/2, 0, -GRID_SIZE/2]}>{lines}</group>;
};

// Player Qubit Component
const PlayerQubit = ({ position, isInSuperposition, isEntangled }: { position: Coord3D, isInSuperposition: boolean, isEntangled: boolean }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Pulsing effect when in superposition
      if (isInSuperposition) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        meshRef.current.scale.setScalar(scale);
      }
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshPhongMaterial
          color={isEntangled ? "#ffd700" : (isInSuperposition ? "#00ffff" : "#00d4ff")}
          emissive={isEntangled ? "#ffd700" : (isInSuperposition ? "#00ffff" : "#00d4ff")}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
      {isInSuperposition && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html position={[0, 1, 0]} center>
        <div style={{
          color: '#00ffff',
          fontSize: '12px',
          fontFamily: 'Orbitron, monospace',
          textShadow: '0 0 10px #00ffff'
        }}>
          |ψ⟩
        </div>
      </Html>
    </group>
  );
};

// Collectible Orb Component
const QuantumOrb = ({ position, collected, onCollect }: { position: Coord3D, collected: boolean, onCollect: () => void }) => {
  const orbRef = useRef<THREE.Group | null>(null);
  
  useFrame((state) => {
    if (orbRef.current && !collected) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.rotation.y += 0.03;
      orbRef.current.rotation.z += 0.02;
    }
  });

  if (collected) return null;

  return (
    <group ref={orbRef} position={position}>
      <Sphere args={[0.2, 16, 16]}>
        <meshPhongMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[0.3, 8, 8]}>
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
};

// Superposition Zone Component
const SuperpositionZone = ({ position }: { position: Coord3D }) => {
  const zoneRef = useRef<THREE.Mesh | null>(null);
  
  useFrame((state) => {
    if (zoneRef.current) {
      zoneRef.current.rotation.y += 0.01;
      if (zoneRef.current.material && !Array.isArray(zoneRef.current.material)) {
        (zoneRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={zoneRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1, 6, 1, true]} />
        <meshBasicMaterial
          color="#8b5fff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Html position={[0, 1.5, 0]} center>
        <div style={{
          color: '#8b5fff',
          fontSize: '10px',
          fontFamily: 'Orbitron, monospace',
          textShadow: '0 0 10px #8b5fff'
        }}>
          Superposition
        </div>
      </Html>
    </group>
  );
};

// Entanglement Gate Component
const EntanglementGate = ({ position }: { position: Coord3D }) => {
  const gate1Ref = useRef<THREE.Mesh | null>(null);
  const gate2Ref = useRef<THREE.Mesh | null>(null);
  
  useFrame((state) => {
    if (gate1Ref.current && gate2Ref.current) {
      gate1Ref.current.rotation.z += 0.02;
      gate2Ref.current.rotation.z -= 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={gate1Ref} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.5, 0.05, 8, 16]} />
        <meshPhongMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={gate2Ref} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 8, 16]} />
        <meshPhongMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 1.2, 0]} center>
        <div style={{
          color: '#ffd700',
          fontSize: '10px',
          fontFamily: 'Orbitron, monospace',
          textShadow: '0 0 10px #ffd700'
        }}>
          Entangle
        </div>
      </Html>
    </group>
  );
};

// Target Zone Component
const TargetZone = ({ position, isActive }: { position: Coord3D, isActive: boolean }) => {
  const targetRef = useRef<THREE.Mesh | null>(null);
  
  useFrame((state) => {
    if (targetRef.current) {
      targetRef.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      targetRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={targetRef} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
        <meshPhongMaterial
          color={isActive ? "#00ff00" : "#ff0066"}
          emissive={isActive ? "#00ff00" : "#ff0066"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html position={[0, 1, 0]} center>
        <div style={{
          color: isActive ? '#00ff00' : '#ff0066',
          fontSize: '12px',
          fontFamily: 'Orbitron, monospace',
          textShadow: `0 0 10px ${isActive ? '#00ff00' : '#ff0066'}`
        }}>
          Target
        </div>
      </Html>
    </group>
  );
};

// Obstacle Component
const Obstacle = ({ position }: { position: Coord3D }) => {
  return (
    <Box position={[position[0], 0.5, position[2]]} args={[0.8, 1, 0.8]}>
      <meshPhongMaterial color="#ff0066" opacity={0.8} transparent />
    </Box>
  );
};

// ===== GAME SCENE COMPONENT =====
interface GameState {
  energy: number;
  collectedOrbs: number[];
  isInSuperposition: boolean;
  isEntangled: boolean;
  levelComplete: boolean;
  message: string;
}

interface GameSceneProps {
  level: Level;
  playerPos: Coord3D;
  setPlayerPos: React.Dispatch<React.SetStateAction<Coord3D>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameScene = ({ level, playerPos, setPlayerPos, gameState, setGameState }: GameSceneProps) => {
  const { camera } = useThree();
  
  // Update camera to follow player
  useEffect(() => {
    camera.position.set(
      playerPos[0] + 5,
      8,
      playerPos[2] + 5
    );
    camera.lookAt(playerPos[0], 0, playerPos[2]);
  }, [playerPos, camera]);

  // Check collisions
  useEffect(() => {
    // Check superposition zones
    const inSuperposition = level.superpositionZones.some(zone =>
      Math.abs(zone[0] - playerPos[0]) < 0.5 && Math.abs(zone[2] - playerPos[2]) < 0.5
    );
    
    if (inSuperposition !== gameState.isInSuperposition) {
      setGameState(prev => ({ ...prev, isInSuperposition: inSuperposition }));
    }

    // Check entanglement gates
    const nearGate = level.entanglementGates.find(gate =>
      Math.abs(gate[0] - playerPos[0]) < 0.5 && Math.abs(gate[2] - playerPos[2]) < 0.5
    );
    
    if (nearGate && !gameState.isEntangled) {
      // Teleport to paired gate
      const gateIndex = level.entanglementGates.indexOf(nearGate);
      const pairedGate = level.entanglementGates[gateIndex % 2 === 0 ? gateIndex + 1 : gateIndex - 1];
      if (pairedGate) {
        setPlayerPos(pairedGate);
        setGameState(prev => ({ ...prev, isEntangled: true, message: "Quantum teleportation!" }));
        setTimeout(() => setGameState(prev => ({ ...prev, isEntangled: false })), 2000);
      }
    }

    // Check orb collection
    level.orbs.forEach((orb, index) => {
      if (!gameState.collectedOrbs.includes(index) && 
          Math.abs(orb[0] - playerPos[0]) < 0.5 && 
          Math.abs(orb[2] - playerPos[2]) < 0.5) {
        if (gameState.isInSuperposition) {
          setGameState(prev => ({
            ...prev,
            collectedOrbs: [...prev.collectedOrbs, index],
            energy: prev.energy + 10,
            message: "Quantum orb collected! +10 energy"
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            message: "Must be in superposition to collect orbs!"
          }));
        }
      }
    });

    // Check win condition
    if (gameState.collectedOrbs.length >= level.requiredOrbs) {
      const onTarget = level.targets.some(target =>
        Math.abs(target[0] - playerPos[0]) < 0.5 && Math.abs(target[2] - playerPos[2]) < 0.5
      );
      
      if (onTarget && !gameState.levelComplete) {
        setGameState(prev => ({ ...prev, levelComplete: true }));
      }
    }
  }, [playerPos, level, gameState, setGameState]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#8b5fff" />
      
      <GridFloor />
      
      <PlayerQubit 
        position={playerPos}
        isInSuperposition={gameState.isInSuperposition}
        isEntangled={gameState.isEntangled}
      />
      
      {level.orbs.map((orb, i) => (
        <QuantumOrb
          key={`orb-${i}`}
          position={orb}
          collected={gameState.collectedOrbs.includes(i)}
          onCollect={() => {}}
        />
      ))}
      
      {level.superpositionZones.map((zone, i) => (
        <SuperpositionZone key={`sz-${i}`} position={zone} />
      ))}
      
      {level.entanglementGates.map((gate, i) => (
        <EntanglementGate key={`eg-${i}`} position={gate} />
      ))}
      
      {level.targets.map((target, i) => (
        <TargetZone
          key={`target-${i}`}
          position={target}
          isActive={gameState.collectedOrbs.length >= level.requiredOrbs}
        />
      ))}
      
      {level.obstacles.map((obstacle, i) => (
        <Obstacle key={`obs-${i}`} position={obstacle} />
      ))}
    </>
  );
};

// ===== UI COMPONENTS =====

// Tutorial Modal
const TutorialModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: `rgba(${parseInt(MythTechTheme.colors.background.slice(1,3),16)}, ${parseInt(MythTechTheme.colors.background.slice(3,5),16)}, ${parseInt(MythTechTheme.colors.background.slice(5,7),16)}, 0.9)`, // Theme background with opacity
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(5px)',
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        background: `linear-gradient(145deg, ${MythTechTheme.colors.surface}BF, ${MythTechTheme.colors.secondary}26)`, // Theme surface and secondary with opacity
        border: `2px solid ${MythTechTheme.colors.accent}80`, // Theme accent with opacity
        borderRadius: '16px', // Consistent with MythCard
        padding: '30px', // Adjusted padding
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        color: MythTechTheme.colors.textPrimary,
        boxShadow: `0 0 30px ${MythTechTheme.colors.accent}40`, // Panel glow
        fontFamily: MythTechTheme.fonts.mono, // Mono font for content
      }}
    >
      <h2 style={{ color: MythTechTheme.colors.accent, fontSize: '2.2em', marginBottom: '25px', fontFamily: MythTechTheme.fonts.display, textTransform: 'uppercase', letterSpacing: '1px', textShadow: `0 0 10px ${MythTechTheme.colors.accent}` }}>
        How to Play Quantum Mind
      </h2>
      
      <div style={{ textAlign: 'left', marginBottom: '35px', fontSize: '1.05em' }}>
        <p style={{ marginBottom: '18px', color: MythTechTheme.colors.textSecondary }}>
          🎮 <strong style={{ color: MythTechTheme.colors.accent }}>Movement:</strong> Use arrow keys or WASD to move
        </p>
        <p style={{ marginBottom: '18px', color: MythTechTheme.colors.textSecondary }}>
          ✨ <strong style={{ color: MythTechTheme.colors.secondary }}>Superposition:</strong> Stand on purple zones to enter superposition
        </p>
        <p style={{ marginBottom: '18px', color: MythTechTheme.colors.textSecondary }}>
          🔮 <strong style={{ color: MythTechTheme.colors.positive }}>Collect Orbs:</strong> You must be in superposition to collect golden orbs
        </p>
        <p style={{ marginBottom: '18px', color: MythTechTheme.colors.textSecondary }}>
          🌀 <strong style={{ color: MythTechTheme.colors.positive }}>Entanglement:</strong> Step on golden gates to teleport
        </p>
        <p style={{ marginBottom: '18px', color: MythTechTheme.colors.textSecondary }}>
          🎯 <strong style={{ color: MythTechTheme.colors.danger }}>Goal:</strong> Collect all orbs then reach the target
        </p>
      </div>
      
      <button
        onClick={onClose}
        style={{
          background: `linear-gradient(135deg, ${MythTechTheme.colors.accent}33, ${MythTechTheme.colors.secondary}33)`,
          border: `2px solid ${MythTechTheme.colors.accent}`,
          color: MythTechTheme.colors.textPrimary,
          padding: '12px 35px', // Adjusted padding
          fontSize: '1.1em', // Adjusted font size
          borderRadius: '10px', // Consistent with MythButton
          cursor: 'pointer',
          fontFamily: MythTechTheme.fonts.display,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease-in-out',
          boxShadow: `0 0 15px ${MythTechTheme.colors.accent}00`,
        }}
        onMouseOver={(e) => { e.currentTarget.style.boxShadow = `0 0 25px ${MythTechTheme.colors.accent}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${MythTechTheme.colors.accent}55, ${MythTechTheme.colors.secondary}55)`;}}
        onMouseOut={(e) => { e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.accent}00`; e.currentTarget.style.background = `linear-gradient(135deg, ${MythTechTheme.colors.accent}33, ${MythTechTheme.colors.secondary}33)`;}}
      >
        Start Playing
      </button>
    </motion.div>
  </motion.div>
);

// HUD Component
const HUD = ({ level, gameState }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    left: '20px',
    backgroundColor: `rgba(${parseInt(MythTechTheme.colors.surface.slice(1, 3), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(3, 5), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(5, 7), 16)}, 0.85)`, // Use theme surface color with opacity
    padding: '20px',
    borderRadius: '12px', // Slightly larger radius
    border: `2px solid ${MythTechTheme.colors.accent}66`, // Theme accent with opacity
    backdropFilter: 'blur(10px)',
    fontFamily: MythTechTheme.fonts.display, // Theme display font
    minWidth: '220px',
    color: MythTechTheme.colors.textPrimary, // Theme text primary
    boxShadow: `0 0 25px ${MythTechTheme.colors.accent}33`, // Panel glow
  }}>
    <h3 style={{ color: MythTechTheme.colors.accent, marginBottom: '12px', fontSize: '1.3em', textShadow: `0 0 8px ${MythTechTheme.colors.accent}` }}>
      Level {level.id}: {level.name}
    </h3>
    <p style={{ color: MythTechTheme.colors.textPrimary, marginBottom: '8px', fontSize: '1em', textShadow: `0 0 5px ${MythTechTheme.colors.textPrimary}80` }}>
      Energy: <span style={{color: MythTechTheme.colors.positive, fontWeight: 'bold'}}>{gameState.energy}</span>
    </p>
    <p style={{ color: MythTechTheme.colors.textPrimary, marginBottom: '8px', fontSize: '1em', textShadow: `0 0 5px ${MythTechTheme.colors.textPrimary}80` }}>
      Orbs: <span style={{color: MythTechTheme.colors.secondary, fontWeight: 'bold'}}>{gameState.collectedOrbs.length}/{level.requiredOrbs}</span>
    </p>
    <p style={{ color: gameState.isInSuperposition ? MythTechTheme.colors.accent : MythTechTheme.colors.textSecondary, fontSize: '1em', textShadow: `0 0 5px ${(gameState.isInSuperposition ? MythTechTheme.colors.accent : MythTechTheme.colors.textSecondary)}80` }}>
      State: {gameState.isInSuperposition ? '|ψ⟩ Superposition' : '|0⟩ Classical'}
    </p>
  </div>
);

// Controls Component
const Controls = ({ onMove }) => (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    backgroundColor: `rgba(${parseInt(MythTechTheme.colors.surface.slice(1, 3), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(3, 5), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(5, 7), 16)}, 0.85)`,
    padding: '15px', // Reduced padding
    borderRadius: '12px',
    border: `2px solid ${MythTechTheme.colors.accent}66`,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 0 25px ${MythTechTheme.colors.accent}33`,
    fontFamily: MythTechTheme.fonts.mono, // Use mono font for controls
  }}>
    <button
      onClick={() => onMove([0, 0, -1])}
      style={{
        width: '50px', // Slightly smaller buttons
        height: '50px',
        background: `linear-gradient(135deg, ${MythTechTheme.colors.surface}00, ${MythTechTheme.colors.secondary}33, ${MythTechTheme.colors.surface}00)`,
        border: `2px solid ${MythTechTheme.colors.secondary}80`,
        borderRadius: '8px',
        color: MythTechTheme.colors.textPrimary,
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        textShadow: `0 0 8px ${MythTechTheme.colors.secondary}`,
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = MythTechTheme.colors.secondary; e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.secondary}80`; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = `${MythTechTheme.colors.secondary}80`; e.currentTarget.style.boxShadow = 'none'; }}
    >
      ↑
    </button>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onMove([-1, 0, 0])}
          style={{
            width: '50px',
            height: '50px',
            background: `linear-gradient(135deg, ${MythTechTheme.colors.surface}00, ${MythTechTheme.colors.secondary}33, ${MythTechTheme.colors.surface}00)`,
            border: `2px solid ${MythTechTheme.colors.secondary}80`,
            borderRadius: '8px',
            color: MythTechTheme.colors.textPrimary,
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            textShadow: `0 0 8px ${MythTechTheme.colors.secondary}`,
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = MythTechTheme.colors.secondary; e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.secondary}80`; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = `${MythTechTheme.colors.secondary}80`; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ←
        </button>
        <button
          onClick={() => onMove([0, 0, 1])}
          style={{
            width: '50px',
            height: '50px',
            background: `linear-gradient(135deg, ${MythTechTheme.colors.surface}00, ${MythTechTheme.colors.secondary}33, ${MythTechTheme.colors.surface}00)`,
            border: `2px solid ${MythTechTheme.colors.secondary}80`,
            borderRadius: '8px',
            color: MythTechTheme.colors.textPrimary,
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            textShadow: `0 0 8px ${MythTechTheme.colors.secondary}`,
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = MythTechTheme.colors.secondary; e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.secondary}80`; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = `${MythTechTheme.colors.secondary}80`; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ↓
        </button>
        <button
          onClick={() => onMove([1, 0, 0])}
          style={{
            width: '50px',
            height: '50px',
            background: `linear-gradient(135deg, ${MythTechTheme.colors.surface}00, ${MythTechTheme.colors.secondary}33, ${MythTechTheme.colors.surface}00)`,
            border: `2px solid ${MythTechTheme.colors.secondary}80`,
            borderRadius: '8px',
            color: MythTechTheme.colors.textPrimary,
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            textShadow: `0 0 8px ${MythTechTheme.colors.secondary}`,
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = MythTechTheme.colors.secondary; e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.secondary}80`; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = `${MythTechTheme.colors.secondary}80`; e.currentTarget.style.boxShadow = 'none'; }}
        >
          →
        </button>
      </div>
    </div>
  </div>
);

// Message Display
const MessageDisplay = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: `rgba(${parseInt(MythTechTheme.colors.surface.slice(1, 3), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(3, 5), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(5, 7), 16)}, 0.9)`, // Theme surface with more opacity
          border: `2px solid ${MythTechTheme.colors.accent}80`, // Theme accent with opacity
          borderRadius: '12px',
          padding: '25px', // Increased padding
          fontSize: '1.6em', // Slightly larger font
          color: MythTechTheme.colors.accent, // Theme accent color for text
          textShadow: `0 0 15px ${MythTechTheme.colors.accent}`, // Accent glow
          fontFamily: MythTechTheme.fonts.display, // Theme display font
          textAlign: 'center',
          pointerEvents: 'none',
          boxShadow: `0 0 30px ${MythTechTheme.colors.accent}40`, // Panel glow
          backdropFilter: 'blur(5px)', // Subtle blur for the panel
        }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// Level Complete Modal
const LevelCompleteModal = ({ level, onNext }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: `rgba(${parseInt(MythTechTheme.colors.background.slice(1,3),16)}, ${parseInt(MythTechTheme.colors.background.slice(3,5),16)}, ${parseInt(MythTechTheme.colors.background.slice(5,7),16)}, 0.92)`, // Theme background with opacity
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(5px)',
    }}
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        background: `linear-gradient(145deg, ${MythTechTheme.colors.surface}C0, ${MythTechTheme.colors.positive}26)`, // Theme surface and positive with opacity
        border: `2px solid ${MythTechTheme.colors.positive}99`, // Theme positive with opacity
        borderRadius: '16px',
        padding: '35px', // Adjusted padding
        textAlign: 'center',
        maxWidth: '550px', // Slightly wider
        color: MythTechTheme.colors.textPrimary,
        boxShadow: `0 0 35px ${MythTechTheme.colors.positive}50`, // Panel glow with positive color
        fontFamily: MythTechTheme.fonts.mono,
      }}
    >
      <h1 style={{
        color: MythTechTheme.colors.positive, // Theme positive color
        fontSize: '2.8em', // Adjusted font size
        marginBottom: '20px',
        fontFamily: MythTechTheme.fonts.display,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        textShadow: `0 0 20px ${MythTechTheme.colors.positive}` // Positive glow
      }}>
        Level Complete!
      </h1>
      
      <p style={{
        color: MythTechTheme.colors.accent, // Theme accent color
        fontSize: '1.4em', // Adjusted font size
        marginBottom: '25px',
        fontFamily: MythTechTheme.fonts.display,
        textShadow: `0 0 8px ${MythTechTheme.colors.accent}`
      }}>
        {level.name} Mastered
      </p>
      
      <div style={{
        background: `${MythTechTheme.colors.surface}99`, // Theme surface with opacity
        border: `1px solid ${MythTechTheme.colors.border}80`, // Theme border with opacity
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px',
        color: MythTechTheme.colors.textSecondary,
      }}>
        <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
          💡 <strong style={{ color: MythTechTheme.colors.accent }}>Quantum Insight:</strong> {level.tip}
        </p>
      </div>
      
      <button
        onClick={onNext}
        style={{
          background: `linear-gradient(135deg, ${MythTechTheme.colors.positive}33, ${MythTechTheme.colors.accent}33)`,
          border: `2px solid ${MythTechTheme.colors.positive}`,
          color: MythTechTheme.colors.textPrimary,
          padding: '12px 35px',
          fontSize: '1.1em',
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: MythTechTheme.fonts.display,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease-in-out',
          boxShadow: `0 0 15px ${MythTechTheme.colors.positive}00`,
        }}
        onMouseOver={(e) => { e.currentTarget.style.boxShadow = `0 0 25px ${MythTechTheme.colors.positive}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${MythTechTheme.colors.positive}55, ${MythTechTheme.colors.accent}55)`;}}
        onMouseOut={(e) => { e.currentTarget.style.boxShadow = `0 0 15px ${MythTechTheme.colors.positive}00`; e.currentTarget.style.background = `linear-gradient(135deg, ${MythTechTheme.colors.positive}33, ${MythTechTheme.colors.accent}33)`;}}
      >
        Next Level
      </button>
    </motion.div>
  </motion.div>
);

// ===== MAIN GAME COMPONENT =====
export default function QuantumMindGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPos, setPlayerPos] = useState<Coord3D>([4, 0.5, 4]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    energy: 0,
    collectedOrbs: [],
    isInSuperposition: false,
    isEntangled: false,
    levelComplete: false,
    message: ''
  });

  const level = LEVELS[currentLevel];

  // Initialize level
  useEffect(() => {
    setPlayerPos(level.playerStart);
    setGameState(prevGameState => ({
      ...prevGameState, // Preserve energy and other relevant state
      collectedOrbs: [],
      isInSuperposition: false,
      isEntangled: false,
      levelComplete: false,
      message: `Level ${level.id}: ${level.description}`
    }));
  }, [currentLevel, level.playerStart, level.id, level.description]);

  // Clear messages
  useEffect(() => {
    if (gameState.message) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, message: '' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.message]);

  const handleMove = useCallback((direction: Coord3D) => {
    setPlayerPos(prevPlayerPos => {
      const newPos: Coord3D = [
        prevPlayerPos[0] + direction[0],
        prevPlayerPos[1],
        prevPlayerPos[2] + direction[2]
      ];

      // Check boundaries
      if (newPos[0] < 0 || newPos[0] >= GRID_SIZE ||
          newPos[2] < 0 || newPos[2] >= GRID_SIZE) {
        setGameState(prev => ({ ...prev, message: "Can't move there!" }));
        return prevPlayerPos;
      }

      // Check obstacles
      const hitObstacle = level.obstacles.some(obs =>
        Math.abs(obs[0] - newPos[0]) < 0.5 && Math.abs(obs[2] - newPos[2]) < 0.5
      );

      if (hitObstacle) {
        setGameState(prev => ({ ...prev, message: "Obstacle blocks your path!" }));
        return prevPlayerPos;
      }
      return newPos;
    });
  }, [level.obstacles, setPlayerPos, setGameState, level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: Event) => {
      const e = event as KeyboardEvent; // Type assertion
      if (gameState.levelComplete) return;
      
      let move: Coord3D = [0, 0, 0];
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          move = [0, 0, -1];
          break;
        case 's':
        case 'arrowdown':
          move = [0, 0, 1];
          break;
        case 'a':
        case 'arrowleft':
          move = [-1, 0, 0];
          break;
        case 'd':
        case 'arrowright':
          move = [1, 0, 0];
          break;
        default:
          return;
      }
      handleMove(move);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.levelComplete, handleMove]); // Ensured handleMove is in dependency array

  const handleNextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      // Game complete
      setGameState(prev => ({ 
        ...prev, 
        message: "🎉 You've mastered Quantum Mind! You understand quantum computing!" 
      }));
      setTimeout(() => setCurrentLevel(0), 5000);
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      fontFamily: 'Orbitron, monospace',
      background: '#0a0a0f',
      position: 'relative'
    }}>
      <AnimatePresence>
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {gameState.levelComplete && (
          <LevelCompleteModal level={level} onNext={handleNextLevel} />
        )}
      </AnimatePresence>

      <HUD level={level} gameState={gameState} />
      <Controls onMove={handleMove} />
      <MessageDisplay message={gameState.message} />

      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Suspense fallback={null}>
          <GameScene
            level={level}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            gameState={gameState}
            setGameState={setGameState}
          />
        </Suspense>
      </Canvas>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: `rgba(${parseInt(MythTechTheme.colors.surface.slice(1, 3), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(3, 5), 16)}, ${parseInt(MythTechTheme.colors.surface.slice(5, 7), 16)}, 0.85)`,
          padding: '15px',
          borderRadius: '12px',
          border: `2px solid ${MythTechTheme.colors.secondary}66`, // Use secondary for tip box border
          backdropFilter: 'blur(8px)', // Slightly less blur
          fontSize: '0.95em', // Slightly larger
          color: MythTechTheme.colors.textSecondary, // Theme text secondary
          maxWidth: '320px', // Slightly wider
          fontFamily: MythTechTheme.fonts.mono, // Mono font for tips
          boxShadow: `0 0 20px ${MythTechTheme.colors.secondary}33`, // Panel glow with secondary color
        }}
      >
        <p style={{ margin: 0, textShadow: `0 0 4px ${MythTechTheme.colors.textSecondary}70` }}>
          💡 <strong style={{ color: MythTechTheme.colors.secondary, textShadow: `0 0 6px ${MythTechTheme.colors.secondary}` }}>Tip:</strong> {level.description}
        </p>
      </motion.div>
    </div>
  );
}