import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Brain, Target, Sparkles, ChevronRight, Settings, HelpCircle, Award } from 'lucide-react';

const ReinforcementLab = () => {
  // Game state
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [score, setScore] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [agentPosition, setAgentPosition] = useState({ x: 4, y: 4 });
  const [targetPosition, setTargetPosition] = useState({ x: 7, y: 7 });
  const [obstacles, setObstacles] = useState<{x: number, y: number}[]>([]);
  const [trail, setTrail] = useState<{x: number, y: number, opacity: number}[]>([]);
  const [rewards, setRewards] = useState<{x: number, y: number, value: number, id: number}[]>([]);
  const [qTable, setQTable] = useState<Record<string, Record<string, number>>>({});
  const [epsilon, setEpsilon] = useState(1.0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [speed, setSpeed] = useState(200);
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [targetReached, setTargetReached] = useState(false);
  const [showParameterPanel, setShowParameterPanel] = useState(false);
  
  const gridSize = 10;

  // Level configurations
  const levels = [
    {
      name: "Discovery Chamber",
      description: "Watch how an AI learns from scratch",
      obstacles: [{ x: 2, y: 2 }, { x: 5, y: 5 }, { x: 3, y: 6 }, { x: 6, y: 3 }],
      targetEpisodes: 5,
      lesson: "AI starts knowing nothing and learns through trial and error!"
    },
    {
      name: "Memory Palace",
      description: "See how AI remembers successful paths",
      obstacles: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 8 }],
      targetEpisodes: 10,
      lesson: "The AI builds a 'memory' of which actions work best from each position!"
    },
    {
      name: "Efficiency Core",
      description: "Observe how AI optimizes its path",
      obstacles: [{ x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }],
      targetEpisodes: 15,
      lesson: "Over time, AI finds the shortest path by remembering rewards and penalties!"
    }
  ];

  // Tutorial messages
  const tutorialMessages = [
    {
      title: "Welcome to the Reinforcement Lab!",
      content: "You're about to watch an AI agent learn to navigate through a maze. The agent starts knowing nothing!",
      icon: Brain
    },
    {
      title: "The Goal",
      content: "The cyan brain (AI agent) needs to reach the golden target. Purple blocks are obstacles it must avoid.",
      icon: Target
    },
    {
      title: "Learning Through Rewards",
      content: "The AI gets +100 points for reaching the goal, -1 for each step (to encourage efficiency), and +10 for getting close!",
      icon: Award
    },
    {
      title: "Watch It Learn!",
      content: "At first, the agent moves randomly. Over time, it will learn the best path. The purple glow shows its growing knowledge!",
      icon: Sparkles
    }
  ];

  // Initialize Q-table
  useEffect(() => {
    const initQTable = {};
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const state = `${x},${y}`;
        initQTable[state] = {
          up: 0,
          down: 0,
          left: 0,
          right: 0
        };
      }
    }
    setQTable(initQTable);
  }, []);

  // Load level
  useEffect(() => {
    if (currentLevel < levels.length) {
      const level = levels[currentLevel];
      setObstacles(level.obstacles);
      setEpisode(0);
      setScore(0);
      setAgentPosition({ x: 4, y: 4 });
      setTargetPosition({ x: 7, y: 7 });
      setTrail([]);
      setEpsilon(1.0);
      setTargetReached(false);
      setShowTutorial(true);
      setTutorialStep(0);
      setIsPaused(true);
    }
  }, [currentLevel]);

  // Get valid actions from current position
  const getValidActions = useCallback((pos) => {
    const actions = [];
    const { x, y } = pos;
    
    if (y > 0 && !obstacles.some(o => o.x === x && o.y === y - 1)) actions.push('up');
    if (y < gridSize - 1 && !obstacles.some(o => o.x === x && o.y === y + 1)) actions.push('down');
    if (x > 0 && !obstacles.some(o => o.x === x - 1 && o.y === y)) actions.push('left');
    if (x < gridSize - 1 && !obstacles.some(o => o.x === x + 1 && o.y === y)) actions.push('right');
    
    return actions;
  }, [obstacles]);

  // Get next position based on action
  const getNextPosition = (pos, action) => {
    const { x, y } = pos;
    switch (action) {
      case 'up': return { x, y: y - 1 };
      case 'down': return { x, y: y + 1 };
      case 'left': return { x: x - 1, y };
      case 'right': return { x: x + 1, y };
      default: return pos;
    }
  };

  // Calculate reward
  const calculateReward = (pos) => {
    const distance = Math.abs(pos.x - targetPosition.x) + Math.abs(pos.y - targetPosition.y);
    
    if (pos.x === targetPosition.x && pos.y === targetPosition.y) {
      return 100; // Sacred orb collected!
    } else if (distance < 2) {
      return 10; // Getting warmer
    } else {
      return -1; // Step penalty
    }
  };

  // Q-learning algorithm
  const selectAction = useCallback((pos) => {
    const validActions = getValidActions(pos);
    if (validActions.length === 0) return null;
    
    // Epsilon-greedy strategy
    if (Math.random() < epsilon) {
      // Explore: random action
      return validActions[Math.floor(Math.random() * validActions.length)];
    } else {
      // Exploit: best known action
      const state = `${pos.x},${pos.y}`;
      const qValues = qTable[state] || {};
      
      let bestAction = validActions[0];
      let bestValue = qValues[bestAction] || 0;
      
      validActions.forEach(action => {
        const value = qValues[action] || 0;
        if (value > bestValue) {
          bestValue = value;
          bestAction = action;
        }
      });
      
      return bestAction;
    }
  }, [epsilon, qTable, getValidActions]);

  // Update Q-value
  const updateQValue = useCallback((state, action, reward, nextState) => {
    const currentQ = qTable[state]?.[action] || 0;
    const nextStateQ = qTable[nextState] || { up: 0, down: 0, left: 0, right: 0 };
    const maxNextQ = Math.max(...Object.values(nextStateQ).map(val => Number(val)), 0);
    
    const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
    
    setQTable(prev => ({
      ...prev,
      [state]: {
        ...prev[state],
        [action]: newQ
      }
    }));
  }, [qTable, learningRate, discountFactor]);

  // Move agent
  const moveAgent = useCallback(() => {
    if (isPaused || gameState !== 'playing' || targetReached) return;
    
    const currentState = `${agentPosition.x},${agentPosition.y}`;
    const action = selectAction(agentPosition);
    
    if (!action) return;
    
    const nextPos = getNextPosition(agentPosition, action);
    const nextState = `${nextPos.x},${nextPos.y}`;
    const reward = calculateReward(nextPos);
    
    // Update Q-table
    updateQValue(currentState, action, reward, nextState);
    
    // Update trail
    setTrail(prev => [...prev.slice(-20), { ...agentPosition, opacity: 1 }]);
    
    // Move agent
    setAgentPosition(nextPos);
    
    // Update score and energy
    setScore(prev => prev + reward);
    setMysticalEnergy(prev => Math.min(100, prev + Math.abs(reward)));
    
    // Show reward animation
    if (reward > 0) {
      setRewards(prev => [...prev, {
        x: nextPos.x,
        y: nextPos.y,
        value: reward,
        id: Date.now()
      }]);
    }
    
    // Check if target reached
    if (nextPos.x === targetPosition.x && nextPos.y === targetPosition.y) {
      handleTargetReached();
    }
  }, [agentPosition, isPaused, gameState, targetReached, selectAction, updateQValue]);

  // Handle target reached
  const handleTargetReached = () => {
    setTargetReached(true);
    setEpisode(prev => prev + 1);
    setEpsilon(prev => Math.max(0.1, prev * 0.95)); // Decay exploration
    
    // Check if level complete
    const level = levels[currentLevel];
    if (episode + 1 >= level.targetEpisodes) {
      setTimeout(() => {
        setIsPaused(true);
        setShowTutorial(true);
        setTutorialStep(10); // Special step for level complete
      }, 1000);
    } else {
      // Reset for next episode
      setTimeout(() => {
        setAgentPosition({ x: 4, y: 4 });
        setTargetPosition({
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize)
        });
        setTrail([]);
        setTargetReached(false);
      }, 1000);
    }
  };

  // Manual control
  const handleManualMove = (direction) => {
    if (!isAutoMode && !isPaused) {
      const currentState = `${agentPosition.x},${agentPosition.y}`;
      const nextPos = getNextPosition(agentPosition, direction);
      
      if (getValidActions(agentPosition).includes(direction)) {
        const nextState = `${nextPos.x},${nextPos.y}`;
        const reward = calculateReward(nextPos);
        
        updateQValue(currentState, direction, reward, nextState);
        setAgentPosition(nextPos);
        setScore(prev => prev + reward);
        
        if (nextPos.x === targetPosition.x && nextPos.y === targetPosition.y) {
          handleTargetReached();
        }
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isAutoMode) {
        switch (e.key) {
          case 'ArrowUp': handleManualMove('up'); break;
          case 'ArrowDown': handleManualMove('down'); break;
          case 'ArrowLeft': handleManualMove('left'); break;
          case 'ArrowRight': handleManualMove('right'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAutoMode, agentPosition]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing' && !isPaused && isAutoMode) {
      const interval = setInterval(moveAgent, speed);
      return () => clearInterval(interval);
    }
  }, [gameState, isPaused, isAutoMode, moveAgent, speed]);

  // Fade trail
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.map(t => ({ ...t, opacity: t.opacity * 0.9 })).filter(t => t.opacity > 0.1));
      setRewards(prev => prev.filter(r => Date.now() - r.id < 1000));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Render grid cell
  const renderCell = (x, y) => {
    const isAgent = agentPosition.x === x && agentPosition.y === y;
    const isTarget = targetPosition.x === x && targetPosition.y === y;
    const isObstacle = obstacles.some(o => o.x === x && o.y === y);
    const isTrail = trail.some(t => t.x === x && t.y === y);
    
    const state = `${x},${y}`;
    const qValues = qTable[state] || { up: 0, down: 0, left: 0, right: 0 };
    const maxQ = Math.max(...Object.values(qValues).map(val => Number(val)), 0);
    const heatmapIntensity = maxQ > 0 ? Math.min(maxQ / 50, 1) : 0;
    
    return (
      <div
        key={`${x}-${y}`}
        className="relative border border-purple-900/30 transition-all duration-300"
        style={{
          backgroundColor: isObstacle ? '#1a0f2e' : 
                          heatmapIntensity > 0 ? `rgba(139, 95, 255, ${heatmapIntensity * 0.3})` : 'rgba(26, 15, 46, 0.3)',
          boxShadow: isTrail ? `0 0 20px rgba(0, 212, 255, 0.5)` : 'none'
        }}
      >
        {isAgent && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50">
              <Brain className="w-full h-full p-1 text-white" />
            </div>
          </div>
        )}
        
        {isTarget && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse shadow-lg shadow-yellow-500/50">
              <Target className="w-full h-full p-1 text-white" />
            </div>
          </div>
        )}
        
        {isObstacle && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-900/80 rounded shadow-inner" />
          </div>
        )}
        
        {rewards.map(r => r.x === x && r.y === y && (
          <div
            key={r.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping"
          >
            <span className="text-yellow-400 font-bold text-sm">+{r.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Tutorial overlay
  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    const isLevelComplete = tutorialStep === 10;
    const message = isLevelComplete ? {
      title: "Level Complete!",
      content: levels[currentLevel].lesson,
      icon: Award
    } : tutorialMessages[tutorialStep];
    
    const Icon = message.icon;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-8">
        <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 max-w-2xl border border-purple-500/50 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">{message.title}</h2>
          </div>
          
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">{message.content}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {!isLevelComplete && `Step ${tutorialStep + 1} of ${tutorialMessages.length}`}
            </div>
            <button
              onClick={() => {
                if (isLevelComplete) {
                  if (currentLevel < levels.length - 1) {
                    setCurrentLevel(prev => prev + 1);
                  } else {
                    setGameState('complete');
                  }
                } else if (tutorialStep < tutorialMessages.length - 1) {
                  setTutorialStep(prev => prev + 1);
                } else {
                  setShowTutorial(false);
                  setIsPaused(false);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-white hover:scale-105 transition-transform duration-300 flex items-center gap-2"
            >
              {isLevelComplete ? (currentLevel < levels.length - 1 ? "Next Level" : "Complete") : 
               tutorialStep < tutorialMessages.length - 1 ? "Next" : "Start Learning!"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-blue-950 text-white p-8">
      {/* Header with better contrast */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-lg">
          REINFORCEMENT LAB
        </h1>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 inline-block">
          <p className="text-lg text-gray-200">
            Level {currentLevel + 1}: {levels[currentLevel]?.name} - {levels[currentLevel]?.description}
          </p>
        </div>
      </div>

      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">Welcome, Young Codekeeper</h2>
            <div className="space-y-4 text-lg mb-8">
              <p>You're about to discover how AI learns through reinforcement learning!</p>
              <p>Watch, experiment, and understand the magic of machine intelligence.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-purple-800/30 p-6 rounded-lg border border-purple-600/30">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
                  <h3 className="font-bold text-yellow-400 mb-2">Observe</h3>
                  <p className="text-sm">Watch the AI explore and learn from nothing</p>
                </div>
                <div className="bg-purple-800/30 p-6 rounded-lg border border-purple-600/30">
                  <Settings className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-bold text-cyan-400 mb-2">Experiment</h3>
                  <p className="text-sm">Adjust parameters and see how learning changes</p>
                </div>
                <div className="bg-purple-800/30 p-6 rounded-lg border border-purple-600/30">
                  <Brain className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-bold text-purple-400 mb-2">Understand</h3>
                  <p className="text-sm">Learn how real AI systems work</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setGameState('playing')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
            >
              Enter the Lab
            </button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState === 'playing' && (
        <div className="max-w-6xl mx-auto">
          {renderTutorial()}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Grid */}
            <div className="lg:col-span-2">
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 shadow-2xl">
                <div className="grid grid-cols-10 gap-1 aspect-square max-w-2xl mx-auto">
                  {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                    const x = i % gridSize;
                    const y = Math.floor(i / gridSize);
                    return renderCell(x, y);
                  })}
                </div>
                
                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-6 py-3 bg-purple-600/50 rounded-lg flex items-center gap-2 hover:bg-purple-600/70 transition-colors"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="px-6 py-3 bg-purple-600/50 rounded-lg flex items-center gap-2 hover:bg-purple-600/70 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5" />
                    Tutorial
                  </button>
                  
                  <button
                    onClick={() => setShowParameterPanel(!showParameterPanel)}
                    className="px-6 py-3 bg-purple-600/50 rounded-lg flex items-center gap-2 hover:bg-purple-600/70 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Parameters
                  </button>
                  
                  <button
                    onClick={() => {
                      setAgentPosition({ x: 4, y: 4 });
                      setScore(0);
                      setEpisode(0);
                      setEpsilon(1.0);
                      setTrail([]);
                      setTargetReached(false);
                    }}
                    className="px-6 py-3 bg-purple-600/50 rounded-lg flex items-center gap-2 hover:bg-purple-600/70 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
                
                {/* Manual control info */}
                {!isAutoMode && (
                  <div className="mt-4 text-center text-sm text-gray-400">
                    Use arrow keys to control the agent manually
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Learning Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Episode</span>
                      <span className="font-mono text-yellow-400">{episode}/{levels[currentLevel]?.targetEpisodes}</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(episode / (levels[currentLevel]?.targetEpisodes || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Score</span>
                      <span className="font-mono text-green-400">{score}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Exploration Rate</span>
                      <span className="font-mono text-cyan-400">{(epsilon * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${epsilon * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameter Panel */}
              {showParameterPanel && (
                <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">Experiment Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Auto Mode</span>
                        <button
                          onClick={() => setIsAutoMode(!isAutoMode)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            isAutoMode ? 'bg-cyan-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            isAutoMode ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Speed: {speed}ms
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="50"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Learning Rate: {learningRate}
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.5"
                        step="0.01"
                        value={learningRate}
                        onChange={(e) => setLearningRate(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Current Phase */}
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Learning Phase
                </h3>
                <div className={`p-4 rounded-lg border ${
                  epsilon > 0.7 ? 'bg-blue-900/30 border-blue-500/50' :
                  epsilon > 0.3 ? 'bg-purple-900/30 border-purple-500/50' :
                  'bg-green-900/30 border-green-500/50'
                }`}>
                  <h4 className="font-bold mb-2">
                    {epsilon > 0.7 ? 'Exploration Phase' : epsilon > 0.3 ? 'Refinement Phase' : 'Mastery Phase'}
                  </h4>
                  <p className="text-sm text-gray-200">
                    {epsilon > 0.7 && "The AI is largely exploring new paths, trying to understand its environment."}
                    {epsilon <= 0.7 && epsilon > 0.3 && "The AI is balancing exploration with exploiting known good paths."}
                    {epsilon <= 0.3 && "The AI is mostly exploiting its learned knowledge, focusing on optimal paths."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {gameState === 'complete' && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 border border-purple-500/50 shadow-2xl">
            <Award className="w-20 h-20 mx-auto mb-6 text-yellow-400 animate-bounce" />
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">Congratulations!</h2>
            <p className="text-lg text-gray-200 mb-8">
              You've successfully guided the AI through all the Reinforcement Lab levels. You've witnessed the power of reinforcement learning firsthand!
            </p>
            <button
              onClick={() => {
                setCurrentLevel(0);
                setGameState('intro');
                // Re-initialize QTable for a fresh start if needed, or clear specific level data
                const initQTable = {};
                for (let x = 0; x < gridSize; x++) {
                  for (let y = 0; y < gridSize; y++) {
                    const state = `${x},${y}`;
                    initQTable[state] = { up: 0, down: 0, left: 0, right: 0 };
                  }
                }
                setQTable(initQTable);
              }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
            >
              Restart Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReinforcementLab;