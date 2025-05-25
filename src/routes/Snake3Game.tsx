import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GRID_SIZE = 16;
type GameState = 'start' | 'playing' | 'gameover';

function getRandomPosition(): [number, number, number] {
  return [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ];
}

// Simple Grid component
const TronGrid = ({ crashed = false }) => {
  return (
    <group>
      {/* Main cube outline */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[GRID_SIZE, GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial 
          color={crashed ? "#666666" : "#00D4FF"}
          wireframe={true}
          transparent={true}
          opacity={crashed ? 0.3 : 0.8}
        />
      </mesh>
      
      {/* Grid lines */}
      <gridHelper 
        args={[GRID_SIZE, 8, crashed ? '#666666' : '#00D4FF', crashed ? '#222222' : '#444444']} 
        position={[0, -GRID_SIZE/2, 0]}
      />
    </group>
  );
};

// Simple DataNode
const TronDataNode = ({ position = [0, 0, 0], crashed = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && !crashed) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial 
          color={crashed ? "#888888" : "#40ffff"}
          emissive={crashed ? "#444444" : "#40ffff"}
          emissiveIntensity={crashed ? 0.1 : 0.3}
          wireframe={true}
        />
      </mesh>
      {!crashed && <pointLight color="#40ffff" intensity={1} distance={2} />}
    </group>
  );
};

// Enhanced Snake with front face and back
const TronSnake = ({ 
  onCollectDataNode,
  dataNodePosition,
  onGameOver,
  crashed = false
}) => {
  const [snakeSegments, setSnakeSegments] = useState([[8, 8, 8], [7, 8, 8], [6, 8, 8]]);
  const [direction, setDirection] = useState([1, 0, 0]);

  const gridToWorld = (x: number, y: number, z: number) => [
    x - GRID_SIZE/2, 
    y - GRID_SIZE/2, 
    z - GRID_SIZE/2
  ];

  // Handle keyboard input
  useEffect(() => {
    if (crashed) return;
    
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setDirection([0, 1, 0]);
          break;
        case 'KeyS':
        case 'ArrowDown':
          setDirection([0, -1, 0]);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setDirection([-1, 0, 0]);
          break;
        case 'KeyD':
        case 'ArrowRight':
          setDirection([1, 0, 0]);
          break;
        case 'KeyQ':
          setDirection([0, 0, 1]);
          break;
        case 'KeyE':
          setDirection([0, 0, -1]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [crashed]);

  // Snake movement
  useEffect(() => {
    if (crashed) return;
    
    const moveSnake = () => {
      setSnakeSegments(prevSegments => {
        const newSegments = [...prevSegments];
        const head = newSegments[0];
        const newHead = [
          head[0] + direction[0],
          head[1] + direction[1],
          head[2] + direction[2]
        ];

        // Check boundaries
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
            newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
            newHead[2] < 0 || newHead[2] >= GRID_SIZE) {
          onGameOver();
          return prevSegments;
        }

        // Check self collision
        if (newSegments.some(segment => 
          segment[0] === newHead[0] && 
          segment[1] === newHead[1] && 
          segment[2] === newHead[2]
        )) {
          onGameOver();
          return prevSegments;
        }

        newSegments.unshift(newHead);

        // Check data node collision
        if (dataNodePosition && 
            newHead[0] === dataNodePosition[0] &&
            newHead[1] === dataNodePosition[1] &&
            newHead[2] === dataNodePosition[2]) {
          onCollectDataNode();
          return newSegments;
        }

        newSegments.pop();
        return newSegments;
      });
    };

    const interval = setInterval(moveSnake, 400);
    return () => clearInterval(interval);
  }, [direction, dataNodePosition, onCollectDataNode, onGameOver, crashed]);

  // Snake Segment with front face and back details
  const SnakeSegment = ({ position, isHead, isTail, segmentIndex }: { 
    position: number[], 
    isHead: boolean, 
    isTail: boolean,
    segmentIndex: number 
  }) => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
      if (meshRef.current && isHead && !crashed) {
        meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 4) * 0.02;
      }
    });

    const segmentColor = crashed ? "#666666" : (isHead ? "#00ff88" : "#00D4FF");
    const emissiveColor = crashed ? "#333333" : (isHead ? "#00ff44" : "#0088ff");
    const emissiveIntensity = crashed ? 0.1 : 0.3;

    return (
      <group ref={meshRef} position={position}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial 
            color={segmentColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        
        {/* Wireframe outline */}
        <mesh>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshBasicMaterial 
            color={segmentColor}
            wireframe={true}
            transparent
            opacity={crashed ? 0.3 : 0.6}
          />
        </mesh>
        
        {/* Front face for head */}
        {isHead && (
          <group>
            {/* Face panel */}
            <mesh position={[0, 0, 0.5]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshBasicMaterial color={crashed ? "#222222" : "#001122"} />
            </mesh>
            
            {/* Glowing eyes */}
            <mesh position={[-0.2, 0.1, 0.51]}>
              <boxGeometry args={[0.12, 0.12, 0.02]} />
              <meshBasicMaterial 
                color={crashed ? "#444444" : "#00ffff"} 
                emissive={crashed ? "#222222" : "#00ffff"}
                emissiveIntensity={crashed ? 0.1 : 0.8}
              />
            </mesh>
            <mesh position={[0.2, 0.1, 0.51]}>
              <boxGeometry args={[0.12, 0.12, 0.02]} />
              <meshBasicMaterial 
                color={crashed ? "#444444" : "#00ffff"}
                emissive={crashed ? "#222222" : "#00ffff"} 
                emissiveIntensity={crashed ? 0.1 : 0.8}
              />
            </mesh>
            
            {/* Mouth */}
            <mesh position={[0, -0.1, 0.51]}>
              <boxGeometry args={[0.3, 0.02, 0.02]} />
              <meshBasicMaterial 
                color={crashed ? "#444444" : "#00ff88"}
                emissive={crashed ? "#222222" : "#00ff88"}
                emissiveIntensity={crashed ? 0.1 : 0.6}
              />
            </mesh>
          </group>
        )}

        {/* Back details for tail */}
        {isTail && (
          <group>
            {/* Back panel */}
            <mesh position={[0, 0, -0.5]}>
              <planeGeometry args={[0.6, 0.6]} />
              <meshBasicMaterial color={crashed ? "#222222" : "#001122"} />
            </mesh>
            
            {/* Exhaust ports */}
            <mesh position={[-0.15, 0, -0.51]}>
              <circleGeometry args={[0.08, 6]} />
              <meshBasicMaterial 
                color={crashed ? "#444444" : "#ff4400"}
                emissive={crashed ? "#222222" : "#ff4400"}
                emissiveIntensity={crashed ? 0.1 : 0.5}
              />
            </mesh>
            <mesh position={[0.15, 0, -0.51]}>
              <circleGeometry args={[0.08, 6]} />
              <meshBasicMaterial 
                color={crashed ? "#444444" : "#ff4400"}
                emissive={crashed ? "#222222" : "#ff4400"}
                emissiveIntensity={crashed ? 0.1 : 0.5}
              />
            </mesh>

            {/* Center exhaust */}
            <mesh position={[0, 0, -0.51]}>
              <circleGeometry args={[0.06, 6]} />
              <meshBasicMaterial 
                color={crashed ? "#666666" : "#ffff00"}
                emissive={crashed ? "#333333" : "#ffff00"}
                emissiveIntensity={crashed ? 0.1 : 0.7}
              />
            </mesh>
          </group>
        )}
        
        {isHead && !crashed && <pointLight color="#00ff88" intensity={0.8} distance={2} />}
      </group>
    );
  };

  return (
    <group>
      {snakeSegments.map((segment, index) => {
        const worldPos = gridToWorld(segment[0], segment[1], segment[2]);
        const isHead = index === 0;
        const isTail = index === snakeSegments.length - 1;
        
        return (
          <SnakeSegment 
            key={`${segment[0]}-${segment[1]}-${segment[2]}-${index}`}
            position={worldPos}
            isHead={isHead}
            isTail={isTail}
            segmentIndex={index}
          />
        );
      })}
    </group>
  );
};

// Simple HUD
const GameHUD = ({ score }: { score: number }) => (
  <div style={{ 
    position: 'absolute', 
    top: 20, 
    left: 20, 
    color: 'white', 
    fontFamily: 'Arial, sans-serif',
    fontSize: '18px',
    zIndex: 100,
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #00D4FF'
  }}>
    <div>Score: {score}</div>
  </div>
);

function Snake3Game(): JSX.Element {
  const [dataNodePosition, setDataNodePosition] = useState(getRandomPosition());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameStarted, setGameStarted] = useState(false);

  const handleDataNodeCollected = useCallback(() => {
    if (gameState !== 'playing') return;
    setDataNodePosition(getRandomPosition());
    setScore(prev => prev + 1);
  }, [gameState]);

  const handleGameOver = useCallback(() => {
    setGameState('gameover');
  }, []);

  const resetGame = () => {
    setDataNodePosition(getRandomPosition());
    setScore(0);
    setGameState('start');
    setGameStarted(false);
  };

  // Space bar to start or try again
  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameState === 'start' && !gameStarted) {
          setGameStarted(true);
          setTimeout(() => setGameState('playing'), 1000);
        } else if (gameState === 'gameover') {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [gameState, gameStarted]);

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100vw', 
      background: 'linear-gradient(135deg, #0A0A0F 0%, #050515 50%, #0A0A0F 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <GameHUD score={score} />

      {/* Start screen */}
      {gameState === 'start' && !gameStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '40px',
          borderRadius: '15px',
          border: '2px solid #00D4FF'
        }}>
          <h1 style={{ fontSize: '3rem', color: '#00D4FF', marginBottom: '20px' }}>
            TRON SNAKE
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            🎮 WASD or Arrow Keys: Move your snake<br/>
            🔼 Q & E: Up and Down<br/>
            🖱️ Mouse: Look around | Wheel: Zoom
          </p>
          <div style={{ 
            fontSize: '1.5rem', 
            color: '#FFD700', 
            marginTop: '30px',
            padding: '15px',
            border: '2px solid #FFD700',
            borderRadius: '10px'
          }}>
            <strong>Press SPACEBAR to Start!</strong>
          </div>
        </div>
      )}

      {/* Game over overlay with black and white filter */}
      {gameState === 'gameover' && (
        <>
          {/* Black and white overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 5,
            filter: 'grayscale(100%)'
          }} />
          
          {/* Try Again box */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            color: 'white', 
            textAlign: 'center', 
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '30px',
            borderRadius: '15px',
            border: '2px solid #ffffff'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#ffffff' }}>
              Try Again
            </h1>
            <button 
              onClick={resetGame} 
              style={{ 
                padding: '15px 30px', 
                fontSize: '18px', 
                cursor: 'pointer',
                background: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                color: 'black',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              Click Here
            </button>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              or press SPACEBAR
            </p>
          </div>
        </>
      )}

      {/* 3D Canvas - always visible when playing or crashed */}
      <Canvas 
        camera={{ position: [20, 20, 20], fov: 50 }} 
        style={{ 
          display: gameState === 'start' ? 'none' : 'block',
          filter: gameState === 'gameover' ? 'grayscale(100%)' : 'none'
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={gameState === 'gameover' ? 0.2 : 0.4} />
          <pointLight position={[10, 10, 10]} intensity={gameState === 'gameover' ? 0.3 : 0.8} color="#00D4FF" />
          <pointLight position={[-10, 10, -10]} intensity={gameState === 'gameover' ? 0.1 : 0.4} color="#8B5FFF" />
          
          <TronGrid crashed={gameState === 'gameover'} />
          
          <TronSnake
            onCollectDataNode={handleDataNodeCollected}
            dataNodePosition={dataNodePosition}
            onGameOver={handleGameOver}
            crashed={gameState === 'gameover'}
          />
          
          <TronDataNode 
            position={[
              dataNodePosition[0] - GRID_SIZE/2,
              dataNodePosition[1] - GRID_SIZE/2,
              dataNodePosition[2] - GRID_SIZE/2
            ]} 
            crashed={gameState === 'gameover'}
          />
          
          <OrbitControls 
            enablePan={false}
            maxDistance={40}
            minDistance={10}
            enableDamping={true}
            zoomSpeed={1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Snake3Game;