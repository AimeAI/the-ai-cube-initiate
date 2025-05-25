import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game state types
type GameState = 'menu' | 'showing' | 'waiting' | 'complete' | 'failed';

interface Crystal {
  x: number;
  y: number;
  z: number;
  id: string;
  color: string;
  frequency: number;
}

const CrystalResonance: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [pattern, setPattern] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [currentShowingIndex, setCurrentShowingIndex] = useState(0);
  const [activeCrystals, setActiveCrystals] = useState<Set<string>>(new Set());
  const [resonatingCrystals, setResonatingCrystals] = useState<Set<string>>(new Set());
  const [errorCrystals, setErrorCrystals] = useState<Set<string>>(new Set());
  const [showPattern, setShowPattern] = useState(false);

  // Sacred geometry crystal configuration
  const crystalPositions: Crystal[] = [
    // Inner sacred circle - Core crystals
    { x: 400, y: 300, z: 0, id: 'SOUL', color: '#8b5cf6', frequency: 528 }, // Center crystal
    
    // First ring - Elemental crystals
    { x: 300, y: 200, z: -20, id: 'FIRE', color: '#ef4444', frequency: 639 },
    { x: 500, y: 200, z: -20, id: 'AIR', color: '#06b6d4', frequency: 741 },
    { x: 500, y: 400, z: -20, id: 'EARTH', color: '#22c55e', frequency: 417 },
    { x: 300, y: 400, z: -20, id: 'WATER', color: '#3b82f6', frequency: 396 },
    
    // Second ring - Transformation crystals
    { x: 250, y: 150, z: -40, id: 'AMOR', color: '#ec4899', frequency: 963 },
    { x: 550, y: 150, z: -40, id: 'LUMI', color: '#f59e0b', frequency: 852 },
    { x: 600, y: 300, z: -40, id: 'VITA', color: '#10b981', frequency: 693 },
    { x: 550, y: 450, z: -40, id: 'FLUX', color: '#8b5cf6', frequency: 174 },
    { x: 250, y: 450, z: -40, id: 'VOID', color: '#6b7280', frequency: 285 },
    { x: 200, y: 300, z: -40, id: 'TIME', color: '#a855f7', frequency: 432 },
  ];

  const generateNewPattern = useCallback(() => {
    const availableCrystals = crystalPositions.map(c => c.id);
    const patternLength = Math.min(3 + Math.floor(level / 2), 8);
    const newPattern: string[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      const randomCrystal = availableCrystals[Math.floor(Math.random() * availableCrystals.length)];
      newPattern.push(randomCrystal);
    }
    
    setPattern(newPattern);
    setPlayerSequence([]);
    setCurrentShowingIndex(0);
    return newPattern;
  }, [level]);

  const clearAllStates = useCallback(() => {
    setActiveCrystals(new Set());
    setResonatingCrystals(new Set());
    setErrorCrystals(new Set());
  }, []);

  const showPatternSequence = useCallback(() => {
    setGameState('showing');
    setShowPattern(true);
    clearAllStates();
    
    let index = 0;
    const showNext = () => {
      if (index >= pattern.length) {
        setTimeout(() => {
          setGameState('waiting');
          setShowPattern(false);
          clearAllStates();
        }, 1000);
        return;
      }
      
      clearAllStates();
      const crystalId = pattern[index];
      setResonatingCrystals(new Set([crystalId]));
      
      index++;
      setTimeout(showNext, 1500);
    };
    
    setTimeout(showNext, 500);
  }, [pattern, clearAllStates]);

  const handleCrystalClick = useCallback((crystalId: string) => {
    if (gameState !== 'waiting') return;
    
    const newSequence = [...playerSequence, crystalId];
    setPlayerSequence(newSequence);
    
    // Add to active crystals
    setActiveCrystals(prev => new Set([...prev, crystalId]));
    
    // Check if correct
    const isCorrect = pattern[newSequence.length - 1] === crystalId;
    
    if (isCorrect) {
      if (newSequence.length === pattern.length) {
        // Pattern complete!
        setGameState('complete');
        setScore(prev => prev + level * 100);
        setLevel(prev => prev + 1);
        
        setTimeout(() => {
          clearAllStates();
          const newPattern = generateNewPattern();
          setPattern(newPattern);
          setTimeout(() => showPatternSequence(), 500);
        }, 2000);
      }
    } else {
      // Wrong crystal
      setAttempts(prev => prev - 1);
      setErrorCrystals(new Set([crystalId]));
      setActiveCrystals(prev => {
        const newSet = new Set(prev);
        newSet.delete(crystalId);
        return newSet;
      });
      
      if (attempts <= 1) {
        setGameState('failed');
      } else {
        setTimeout(() => {
          clearAllStates();
          setPlayerSequence([]);
          showPatternSequence();
        }, 1500);
      }
    }
  }, [gameState, playerSequence, pattern, level, attempts, clearAllStates, generateNewPattern, showPatternSequence]);

  const startGame = useCallback(() => {
    setGameState('showing');
    setLevel(1);
    setScore(0);
    setAttempts(3);
    clearAllStates();
    
    const newPattern = generateNewPattern();
    setPattern(newPattern);
    setTimeout(() => showPatternSequence(), 1000);
  }, [clearAllStates, generateNewPattern, showPatternSequence]);

  const resetGame = useCallback(() => {
    setGameState('menu');
    clearAllStates();
  }, [clearAllStates]);

  const getCrystalClassName = (crystalId: string) => {
    let className = 'sacred-crystal';
    if (activeCrystals.has(crystalId)) className += ' active';
    if (resonatingCrystals.has(crystalId)) className += ' resonating';
    if (errorCrystals.has(crystalId)) className += ' error';
    return className;
  };

  const getCrystalByColor = (crystalId: string) => {
    return crystalPositions.find(c => c.id === crystalId)?.color || '#8b5cf6';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative" style={{ perspective: '2000px' }}>
      <style>{`
        .sacred-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 30px 30px, 30px 30px;
          animation: sacred-pulse 8s ease-in-out infinite;
        }
        
        @keyframes sacred-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .sacred-crystal {
          position: absolute;
          width: 60px;
          height: 60px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
          color: white;
          text-shadow: 0 0 10px currentColor;
          clip-path: polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%);
          backdrop-filter: blur(3px);
          border: 1px solid currentColor;
        }
        
        .sacred-crystal.active {
          transform: scale(1.2) rotateY(180deg);
          box-shadow: 0 0 30px currentColor, inset 0 0 20px rgba(255, 255, 255, 0.2);
          animation: crystal-harmonize 0.6s ease-in-out;
        }
        
        .sacred-crystal.resonating {
          animation: crystal-resonate 1.2s ease-in-out;
          box-shadow: 0 0 40px currentColor, 0 0 60px currentColor;
          transform: scale(1.3);
        }
        
        .sacred-crystal.error {
          animation: crystal-discord 0.8s ease-in-out;
          box-shadow: 0 0 20px #ef4444;
          filter: hue-rotate(120deg);
        }
        
        @keyframes crystal-harmonize {
          0%, 100% { transform: scale(1.2) rotateY(180deg); }
          50% { transform: scale(1.4) rotateY(270deg); }
        }
        
        @keyframes crystal-resonate {
          0%, 100% { transform: scale(1.3) rotateZ(0deg); opacity: 1; }
          25% { transform: scale(1.5) rotateZ(90deg); opacity: 0.8; }
          50% { transform: scale(1.4) rotateZ(180deg); opacity: 1; }
          75% { transform: scale(1.6) rotateZ(270deg); opacity: 0.9; }
        }
        
        @keyframes crystal-discord {
          0%, 100% { transform: translateX(0) scale(1); }
          25% { transform: translateX(-8px) scale(0.9); }
          75% { transform: translateX(8px) scale(0.9); }
        }
        
        .sacred-geometry {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          animation: geometry-rotate 120s linear infinite;
          opacity: 0.15;
          z-index: -1;
        }
        
        @keyframes geometry-rotate {
          from { transform: translate(-50%, -50%) rotateZ(0deg); }
          to { transform: translate(-50%, -50%) rotateZ(360deg); }
        }
        
        .energy-field {
          position: absolute;
          width: 2px;
          height: 200px;
          background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.6), transparent);
          animation: energy-flow 4s ease-in-out infinite;
          opacity: 0.7;
        }
        
        @keyframes energy-flow {
          0%, 100% { opacity: 0.3; transform: translateY(-20px); }
          50% { opacity: 1; transform: translateY(20px); }
        }
        
        .mystical-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 40%, rgba(139, 92, 246, 0.1) 70%, transparent 100%);
          animation: aura-breathe 6s ease-in-out infinite;
        }
        
        @keyframes aura-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
      `}</style>

      {/* Sacred Grid Background */}
      <div className="sacred-grid"></div>

      {/* Mystical Aura */}
      <div className="mystical-aura"></div>

      {/* Sacred Geometry */}
      <div className="sacred-geometry">
        {/* Flower of Life pattern */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          border: '1px solid #8b5cf6',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(60deg)',
          width: '400px',
          height: '400px',
          border: '1px solid #ec4899',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(120deg)',
          width: '400px',
          height: '400px',
          border: '1px solid #10b981',
          borderRadius: '50%'
        }}></div>
      </div>

      {/* Energy Fields */}
      <div className="energy-field" style={{ left: '15%', animationDelay: '0s' }}></div>
      <div className="energy-field" style={{ left: '30%', animationDelay: '1s' }}></div>
      <div className="energy-field" style={{ left: '70%', animationDelay: '2s' }}></div>
      <div className="energy-field" style={{ left: '85%', animationDelay: '0.5s' }}></div>

      {/* Crystal Array */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          width: '800px', 
          height: '600px',
          transformStyle: 'preserve-3d'
        }}
      >
        {crystalPositions.map(crystal => (
          <div
            key={crystal.id}
            className={getCrystalClassName(crystal.id)}
            style={{
              left: `${crystal.x}px`,
              top: `${crystal.y}px`,
              transform: `translateZ(${crystal.z}px)`,
              backgroundColor: crystal.color,
              color: crystal.color,
            }}
            onClick={() => handleCrystalClick(crystal.id)}
          >
            {crystal.id}
          </div>
        ))}
      </div>

      {/* Sacred HUD */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Crystal Resonance Status */}
        <div className="absolute top-5 left-5 bg-black/80 border border-purple-500 backdrop-blur-md p-5 pointer-events-auto min-w-[280px]">
          <div className="text-purple-400 text-lg mb-4 font-serif">
            ◊ CRYSTAL RESONANCE ◊
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            <span>HARMONIC LEVEL: </span><span>{level.toString().padStart(2, '0')}</span>
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-2 animate-pulse"></span>
            <span>RESONANCE SCORE: </span><span>{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="font-mono">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 animate-pulse ${
              gameState === 'waiting' ? 'bg-green-500' : 
              gameState === 'showing' ? 'bg-yellow-500' : 'bg-purple-500'
            }`}></span>
            <span>
              {gameState === 'showing' ? 'ATTUNING CRYSTALS...' :
               gameState === 'waiting' ? 'CHANNEL THE PATTERN...' :
               gameState === 'complete' ? 'HARMONY ACHIEVED!' :
               gameState === 'failed' ? 'RESONANCE BROKEN' : 'AWAKENING...'}
            </span>
          </div>
        </div>

        {/* Sacred Energy */}
        <div className="absolute top-5 right-5 bg-black/80 border border-green-500 backdrop-blur-md p-5 pointer-events-auto min-w-[220px]">
          <div className="text-green-400 text-lg mb-4 font-serif">
            ◊ SACRED ENERGY ◊
          </div>
          <div className="mb-2 font-mono">
            <span>LIFE FORCE: </span><span>{'◆'.repeat(attempts)}</span>
          </div>
          <div className="font-mono">
            <span>HARMONY: </span>
            <span className={`${
              Math.round((attempts / 3) * 100) > 66 ? 'text-green-400' : 
              Math.round((attempts / 3) * 100) > 33 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.max(0, Math.round((attempts / 3) * 100))}%
            </span>
          </div>
        </div>

        {/* Sacred Instructions */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 border border-yellow-500 backdrop-blur-md p-5 pointer-events-auto text-center">
          <div className="text-yellow-400 font-serif">
            {gameState === 'showing' ? 'Observe the Crystal Resonance Sequence' :
             gameState === 'waiting' ? 'Channel the Sacred Pattern → Touch the Crystals' :
             'Observe the Crystal Resonance → Channel the Sacred Pattern'}
          </div>
        </div>

        {/* Pattern Display */}
        {showPattern && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/90 border border-yellow-500 backdrop-blur-md p-5 pointer-events-auto text-center min-w-[320px]">
            <div className="text-yellow-400 text-lg mb-2 font-serif">Sacred Pattern</div>
            <div className="flex gap-2 justify-center">
              {pattern.map((crystalId, index) => (
                <div 
                  key={index}
                  className="w-8 h-8 flex items-center justify-center font-bold text-xs font-mono clip-path-hexagon"
                  style={{
                    backgroundColor: getCrystalByColor(crystalId),
                    clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)'
                  }}
                >
                  {crystalId}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sacred Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 backdrop-blur-md">
          <div className="text-center max-w-4xl p-10 border border-purple-500 bg-black/80 backdrop-blur-xl">
            <h1 className="text-6xl font-bold mb-5 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent font-serif">
              Crystal Resonance
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl font-serif">
              Enter the realm of sacred crystalline frequencies.<br/>
              Observe the harmonic patterns as they resonate through ancient crystals.<br/>
              Channel their energy by replicating the sacred sequences.<br/><br/>
              <em className="text-purple-400">Where science meets the mystical, transformation begins.</em>
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-green-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 uppercase tracking-wider font-serif"
            >
              ◊ Awaken the Crystals ◊
            </button>
          </div>
        </div>
      )}

      {/* Sacred Completion */}
      {gameState === 'failed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 backdrop-blur-md">
          <div className="text-center max-w-2xl p-10 border border-red-500 bg-black/80 backdrop-blur-xl">
            <h2 className="text-4xl font-bold text-red-400 mb-4 font-serif">Resonance Completed</h2>
            <div className="text-white mb-6 font-mono">
              <p className="text-xl mb-2">Harmonic Mastery: <span className="text-yellow-400 font-bold">{Math.round((score / (level * 100)) * 100)}%</span></p>
              <p className="text-lg mb-2">Sacred Patterns: <span className="text-purple-400 font-bold">{score / 100}</span></p>
              <p className="text-lg">Highest Frequency: <span className="text-pink-400 font-bold">{level}</span></p>
            </div>
            <p className="text-gray-400 mb-8 italic font-serif">Every discord teaches the soul a deeper harmony.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-purple-500 text-white font-bold hover:scale-105 transition-all duration-300 font-serif"
              >
                ◊ Restore Harmony ◊
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold hover:scale-105 transition-all duration-300 font-serif"
              >
                ◊ Return to Sanctuary ◊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrystalResonance;