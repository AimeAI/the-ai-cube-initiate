import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import ErrorBoundary from '../components/ErrorBoundary';
import GuestGameWrapper from '../components/GuestGameWrapper';
import ChildFriendlyTutorial from '../components/ChildFriendlyTutorial';
import SmartHintSystem from '../components/SmartHintSystem';
import ProgressCelebration, { gameAchievements } from '../components/ProgressCelebration';
import AgeAdaptiveInterface from '../components/AgeAdaptiveInterface';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { Home, RotateCcw, Zap } from 'lucide-react';

// Game configuration
const GRID_SIZE = 12;
type GameState = 'tutorial' | 'playing' | 'paused' | 'levelComplete' | 'gameover' | 'victory';

interface GameStats {
  score: number;
  level: number;
  timeElapsed: number;
  hasMovedYet: boolean;
  nodesCollected: number;
  perfectRuns: number;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  visual?: string;
  interaction?: 'click' | 'drag' | 'keyboard' | 'watch';
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const EnhancedSnake3Game: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('tutorial');
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    level: 1,
    timeElapsed: 0,
    hasMovedYet: false,
    nodesCollected: 0,
    perfectRuns: 0
  });

  // Child-friendly features
  const [childAge, setChildAge] = useState(10);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [completedAchievements, setCompletedAchievements] = useState<string[]>([]);

  // Game mechanics
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const snakeRef = useRef<THREE.Mesh[]>([]);
  const [direction, setDirection] = useState({ x: 1, y: 0, z: 0 });
  const [gameRunning, setGameRunning] = useState(false);

  // Tutorial steps for different age groups
  const getTutorialSteps = (): TutorialStep[] => {
    if (childAge <= 8) {
      return [
        {
          id: 'welcome',
          title: 'Welcome to Snake³!',
          description: 'Hi there! I\'m going to teach you how to play this super fun game! You\'ll control a snake in 3D space and learn about how computers think!',
          visual: '🐍✨',
          interaction: 'watch',
          position: 'center'
        },
        {
          id: 'controls-simple',
          title: 'How to Move Your Snake',
          description: 'Use the arrow keys on your keyboard to move your snake around. It\'s like giving directions to a friend!',
          visual: '⬆️⬇️⬅️➡️',
          interaction: 'keyboard',
          position: 'center'
        },
        {
          id: 'goal-simple',
          title: 'Collect the Glowing Balls!',
          description: 'See those pretty glowing balls? Those are data nodes! Collect them to make your snake grow bigger and score points!',
          visual: '🐍 + ⚡ = 🌟',
          interaction: 'watch',
          position: 'center'
        },
        {
          id: 'safety',
          title: 'Stay Safe!',
          description: 'Don\'t let your snake hit the walls or itself! If it does, the game will end. But don\'t worry - you can always try again!',
          visual: '⚠️🐍',
          interaction: 'watch',
          position: 'center'
        }
      ];
    } else if (childAge <= 12) {
      return [
        {
          id: 'welcome',
          title: 'Welcome to Snake³!',
          description: 'This game teaches you about programming concepts! You\'ll control a snake using commands, just like programming a computer.',
          visual: '🐍💻',
          interaction: 'watch',
          position: 'center'
        },
        {
          id: 'controls',
          title: 'Programming Your Snake',
          description: 'Use arrow keys to give your snake instructions. Each key press is like writing a line of code that tells the computer what to do!',
          visual: '⌨️➡️🐍',
          interaction: 'keyboard',
          position: 'center'
        },
        {
          id: 'data-collection',
          title: 'Data Collection',
          description: 'The glowing nodes represent data. In AI, we collect data to help computers learn and make decisions!',
          visual: '📊⚡🧠',
          interaction: 'watch',
          position: 'center'
        },
        {
          id: 'algorithms',
          title: 'Think Like a Programmer',
          description: 'Plan your moves ahead! This is called algorithmic thinking - solving problems step by step.',
          visual: '🤔➡️🎯',
          interaction: 'watch',
          position: 'center'
        }
      ];
    } else {
      return [
        {
          id: 'welcome',
          title: 'Snake³: AI Fundamentals',
          description: 'This game demonstrates core AI concepts including pathfinding algorithms, decision trees, and sequential processing.',
          interaction: 'watch',
          position: 'center'
        },
        {
          id: 'algorithms',
          title: 'Algorithmic Thinking',
          description: 'Your snake follows a simple algorithm: move forward, check for collisions, collect data. This mirrors how AI systems process information sequentially.',
          interaction: 'keyboard',
          position: 'center'
        },
        {
          id: 'optimization',
          title: 'Path Optimization',
          description: 'Try to find the most efficient path to collect all nodes. This is similar to optimization problems in machine learning.',
          interaction: 'watch',
          position: 'center'
        }
      ];
    }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create game grid
    createGameGrid(scene);
    
    // Create initial snake
    createSnake(scene);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      moveSnake();
      setGameStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 500); // Slower for children

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameState, direction]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      let newDirection = { ...direction };
      let moved = false;

      switch (event.key) {
        case 'ArrowUp':
          newDirection = { x: 0, y: 1, z: 0 };
          moved = true;
          break;
        case 'ArrowDown':
          newDirection = { x: 0, y: -1, z: 0 };
          moved = true;
          break;
        case 'ArrowLeft':
          newDirection = { x: -1, y: 0, z: 0 };
          moved = true;
          break;
        case 'ArrowRight':
          newDirection = { x: 1, y: 0, z: 0 };
          moved = true;
          break;
        case ' ':
          // Auto-aim feature for younger children
          if (childAge <= 10) {
            autoAimToNearestNode();
          }
          break;
      }

      if (moved) {
        setDirection(newDirection);
        if (!gameStats.hasMovedYet) {
          setGameStats(prev => ({ ...prev, hasMovedYet: true }));
          checkAchievement('first-move');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameState, gameStats.hasMovedYet, childAge]);

  // Helper functions
  const createGameGrid = (scene: THREE.Scene) => {
    const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_SIZE);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create boundary walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: childAge <= 8 ? 0x00ffff : 0x333333,
      transparent: true,
      opacity: 0.3
    });
    
    const wallGeometry = new THREE.BoxGeometry(0.2, 2, GRID_SIZE);
    
    // Add walls around the grid
    [-GRID_SIZE/2, GRID_SIZE/2].forEach(x => {
      [-GRID_SIZE/2, GRID_SIZE/2].forEach(z => {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(x, 1, z);
        scene.add(wall);
      });
    });
  };

  const createSnake = (scene: THREE.Scene) => {
    const snakeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const snakeMaterial = new THREE.MeshLambertMaterial({ 
      color: childAge <= 8 ? 0x00ff00 : 0x00d4ff 
    });
    
    const snakeHead = new THREE.Mesh(snakeGeometry, snakeMaterial);
    snakeHead.position.set(0, 0.5, 0);
    snakeHead.castShadow = true;
    scene.add(snakeHead);
    
    snakeRef.current = [snakeHead];
  };

  const moveSnake = () => {
    if (!snakeRef.current.length) return;

    const head = snakeRef.current[0];
    const newPosition = {
      x: head.position.x + direction.x,
      y: head.position.y,
      z: head.position.z + direction.z
    };

    // Check boundaries
    if (Math.abs(newPosition.x) >= GRID_SIZE/2 || Math.abs(newPosition.z) >= GRID_SIZE/2) {
      setGameState('gameover');
      setGameRunning(false);
      return;
    }

    // Move snake
    head.position.set(newPosition.x, newPosition.y, newPosition.z);
  };

  const autoAimToNearestNode = () => {
    // Simple auto-aim for younger children
    // This would find the nearest data node and set direction towards it
    console.log('Auto-aim activated!');
  };

  const checkAchievement = (achievementId: string) => {
    if (completedAchievements.includes(achievementId)) return;

    const achievement = gameAchievements.snake3.find(a => a.id === achievementId);
    if (achievement) {
      setCurrentAchievement(achievement);
      setCompletedAchievements(prev => [...prev, achievementId]);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setGameRunning(true);
  };

  const resetGame = () => {
    setGameState('tutorial');
    setGameStats({
      score: 0,
      level: 1,
      timeElapsed: 0,
      hasMovedYet: false,
      nodesCollected: 0,
      perfectRuns: 0
    });
    setGameRunning(false);
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    startGame();
  };

  const handleAchievementComplete = () => {
    setCurrentAchievement(null);
  };

  return (
    <GuestGameWrapper gameId="snake-3" gameTitle="Snake³">
      <AgeAdaptiveInterface 
        childAge={childAge} 
        gameId="snake-3"
        onAgeChange={setChildAge}
      >
        <ErrorBoundary>
          <div className="relative w-full h-screen bg-myth-background overflow-hidden">
            {/* Game canvas */}
            <div ref={mountRef} className="absolute inset-0" />

            {/* Tutorial */}
            {showTutorial && gameState === 'tutorial' && (
              <ChildFriendlyTutorial
                gameId="snake-3"
                steps={getTutorialSteps()}
                onComplete={handleTutorialComplete}
                childAge={childAge}
              />
            )}

            {/* Smart hints during gameplay */}
            {gameState === 'playing' && (
              <SmartHintSystem
                gameId="snake-3"
                childAge={childAge}
                gameState={gameStats}
                onHintAction={(hintId, action) => {
                  console.log(`Hint ${hintId}: ${action}`);
                }}
              />
            )}

            {/* Achievement celebrations */}
            {currentAchievement && (
              <ProgressCelebration
                achievement={currentAchievement}
                onComplete={handleAchievementComplete}
                childAge={childAge}
                showConcept={childAge >= 9}
              />
            )}

            {/* Game UI */}
            <div className="absolute top-4 left-4 z-20">
              <MythCard className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-myth-accent">{gameStats.score}</div>
                    <div className="text-xs text-myth-textSecondary">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neonMint">{gameStats.level}</div>
                    <div className="text-xs text-myth-textSecondary">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electricCyan">{gameStats.timeElapsed}s</div>
                    <div className="text-xs text-myth-textSecondary">Time</div>
                  </div>
                </div>
              </MythCard>
            </div>

            {/* Game over screen */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
                <MythCard className="p-8 text-center max-w-md">
                  <h2 className="text-3xl font-bold text-myth-accent mb-4">
                    {childAge <= 8 ? 'Oops! Try Again!' : 'Game Over'}
                  </h2>
                  <p className="text-myth-textSecondary mb-6">
                    {childAge <= 8 
                      ? 'That\'s okay! Every programmer makes mistakes. Let\'s try again!'
                      : 'Great effort! You\'re learning valuable problem-solving skills.'
                    }
                  </p>
                  <div className="flex gap-3">
                    <MythButton
                      onClick={resetGame}
                      className="flex-1 flex items-center justify-center gap-2"
                      label={
                        <>
                          <RotateCcw className="w-4 h-4" />
                          {childAge <= 8 ? 'Play Again!' : 'Try Again'}
                        </>
                      }
                    />
                    <MythButton
                      onClick={() => window.location.href = '/'}
                      className="flex-1 flex items-center justify-center gap-2 text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
                      label={
                        <>
                          <Home className="w-4 h-4" />
                          Home
                        </>
                      }
                    />
                  </div>
                </MythCard>
              </div>
            )}

            {/* Special features for young children */}
            {childAge <= 8 && gameState === 'playing' && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                <MythButton
                  onClick={autoAimToNearestNode}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black flex items-center gap-2"
                  label={
                    <>
                      <Zap className="w-4 h-4" />
                      Magic Helper
                    </>
                  }
                />
              </div>
            )}
          </div>
        </ErrorBoundary>
      </AgeAdaptiveInterface>
    </GuestGameWrapper>
  );
};

export default EnhancedSnake3Game;
