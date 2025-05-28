import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Star {
  id: number;
  x: number;
  y: number;
  selected: boolean;
}

interface Connection {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface GameStats {
  classified: number;
  accuracy: number;
  connected: number;
  patterns: number;
  correct: number;
}

interface SacredSymbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  delay: number;
}

const ClassifierConstruct: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedStars, setSelectedStars] = useState<Star[]>([]);
  const [currentPattern, setCurrentPattern] = useState<string>('geometric');
  const [stats, setStats] = useState<GameStats>({
    classified: 0,
    accuracy: 0,
    connected: 0,
    patterns: 0,
    correct: 0
  });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: ''
  });
  const [sacredSymbols] = useState<SacredSymbol[]>([
    { id: 1, symbol: '⟐', x: 10, y: 15, delay: 0 },
    { id: 2, symbol: '◊', x: 80, y: 25, delay: 0.5 },
    { id: 3, symbol: '△', x: 15, y: 70, delay: 1 },
    { id: 4, symbol: '○', x: 85, y: 60, delay: 1.5 },
    { id: 5, symbol: '※', x: 50, y: 10, delay: 2 },
    { id: 6, symbol: '⬟', x: 25, y: 45, delay: 2.5 },
    { id: 7, symbol: '⧫', x: 75, y: 80, delay: 3 },
    { id: 8, symbol: '⬢', x: 60, y: 35, delay: 3.5 }
  ]);

  const generateStars = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const numStars = 15 + Math.floor(Math.random() * 15);
    const newStars: Star[] = [];
    
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        x: Math.random() * (canvas.offsetWidth - 10),
        y: Math.random() * (canvas.offsetHeight - 10),
        selected: false
      });
    }
    
    setStars(newStars);
    setConnections([]);
    setSelectedStars([]);
  }, []);

  const selectStar = (starId: number) => {
    setStars(prevStars => {
      const updatedStars = prevStars.map(star => {
        if (star.id === starId) {
          return { ...star, selected: !star.selected };
        }
        return star;
      });

      const selectedStar = updatedStars.find(s => s.id === starId);
      if (!selectedStar) return updatedStars;

      setSelectedStars(prevSelected => {
        if (selectedStar.selected) {
          const newSelected = [...prevSelected, selectedStar];
          
          // Create connection if we have at least 2 selected stars
          if (newSelected.length > 1) {
            const lastStar = newSelected[newSelected.length - 2];
            setConnections(prevConnections => [
              ...prevConnections,
              {
                id: prevConnections.length,
                x1: lastStar.x + 2,
                y1: lastStar.y + 2,
                x2: selectedStar.x + 2,
                y2: selectedStar.y + 2
              }
            ]);
            
            setStats(prevStats => ({
              ...prevStats,
              connected: prevStats.connected + 1
            }));
          }
          
          return newSelected;
        } else {
          return prevSelected.filter(s => s.id !== starId);
        }
      });

      return updatedStars;
    });
  };

  const analyzePattern = (): number => {
    if (selectedStars.length === 0) return 0;
    
    let complexity = 0;
    complexity += selectedStars.length * 10;
    complexity += connections.length * 5;
    
    // Add bonus for different pattern types
    switch (currentPattern) {
      case 'geometric':
        complexity += selectedStars.length > 4 ? 20 : 0;
        break;
      case 'organic':
        complexity += calculateCurvature();
        break;
      case 'symbolic':
        complexity += selectedStars.length > 6 ? 30 : 0;
        break;
      case 'fractal':
        complexity += selectedStars.length > 5 ? 25 : 0;
        break;
    }
    
    return complexity;
  };

  const calculateCurvature = (): number => {
    if (selectedStars.length < 3) return 0;
    let curvature = 0;
    
    for (let i = 1; i < selectedStars.length - 1; i++) {
      const angle = calculateAngle(
        selectedStars[i - 1],
        selectedStars[i],
        selectedStars[i + 1]
      );
      curvature += Math.abs(angle - Math.PI);
    }
    
    return Math.round(curvature * 10);
  };

  const calculateAngle = (p1: Star, p2: Star, p3: Star): number => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    return Math.acos(dot / (mag1 * mag2));
  };

  const validatePattern = (complexity: number): boolean => {
    const threshold = {
      geometric: 50,
      organic: 40,
      symbolic: 60,
      fractal: 70
    };
    return complexity >= threshold[currentPattern as keyof typeof threshold];
  };

  const classifyPattern = () => {
    if (selectedStars.length < 3) {
      showFeedback('Connect at least 3 stars to classify a pattern', 'error');
      return;
    }

    const patternComplexity = analyzePattern();
    const isCorrect = validatePattern(patternComplexity);
    
    const newStats = {
      ...stats,
      classified: stats.classified + 1,
      correct: isCorrect ? stats.correct + 1 : stats.correct,
      patterns: isCorrect ? stats.patterns + 1 : stats.patterns
    };
    
    newStats.accuracy = Math.round((newStats.correct / newStats.classified) * 100);
    setStats(newStats);

    if (isCorrect) {
      showFeedback(`Sacred ${currentPattern} pattern recognized! +1 Neural Pattern`, 'success');
    } else {
      showFeedback('Pattern classification incomplete. Try connecting more stars.', 'error');
    }

    clearConnections();
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 3000);
  };

  const clearConnections = () => {
    setConnections([]);
    setSelectedStars([]);
    setStars(prevStars => prevStars.map(star => ({ ...star, selected: false })));
  };

  const clearCanvas = () => {
    setStars([]);
    setConnections([]);
    setSelectedStars([]);
    setStats(prevStats => ({ ...prevStats, connected: 0 }));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      clearConnections();
    }
  };

  useEffect(() => {
    generateStars();
  }, [generateStars]);

  const progress = Math.min((stats.patterns / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-void-black via-[#16213e] to-void-black text-crystal-white font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-axis-x mb-3 drop-shadow-lg">
            Classifier Construct
          </h1>
          <div className="text-axis-y text-lg mb-5">Adept Level Training</div>
          <p className="text-sacred-text max-w-2xl mx-auto leading-relaxed">
            Sculpt constellations and classify sacred gestures to understand AI patterns. 
            Connect the stars to form recognizable shapes and train your pattern recognition abilities.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-10">
          {/* Canvas Area */}
          <div 
            ref={canvasRef}
            className="relative bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] border-2 border-node-core rounded-2xl h-[500px] overflow-hidden cursor-crosshair shadow-inner"
            onClick={handleCanvasClick}
          >
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map(connection => (
                <line
                  key={connection.id}
                  x1={connection.x1}
                  y1={connection.y1}
                  x2={connection.x2}
                  y2={connection.y2}
                  stroke="#4fc3f7"
                  strokeWidth="2"
                  opacity="0.7"
                  filter="drop-shadow(0 0 3px rgba(79, 195, 247, 0.5))"
                />
              ))}
            </svg>

            {/* Stars */}
            {stars.map(star => (
              <div
                key={star.id}
                className={`absolute w-1 h-1 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-150 hover:shadow-axis-x ${
                  star.selected ? 'bg-axis-x scale-125 shadow-axis-x' : ''
                }`}
                style={{
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                  boxShadow: star.selected 
                    ? '0 0 20px rgba(79, 195, 247, 1)' 
                    : '0 0 10px rgba(255, 255, 255, 0.8)',
                  animation: `twinkle 2s infinite ${Math.random() * 2}s`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectStar(star.id);
                }}
              />
            ))}

            {/* Sacred Symbols */}
            {sacredSymbols.map(symbol => (
              <div
                key={symbol.id}
                className="absolute text-xl opacity-30 pointer-events-none"
                style={{
                  left: `${symbol.x}%`,
                  top: `${symbol.y}%`,
                  animation: `float 6s ease-in-out infinite ${symbol.delay}s`
                }}
              >
                {symbol.symbol}
              </div>
            ))}
          </div>

          {/* Control Panel */}
          <div className="bg-gradient-to-br from-[#1a2332] to-node-core border border-[#4a5568] rounded-2xl p-6 h-fit">
            {/* Pattern Types */}
            <div className="mb-6">
              <h3 className="text-axis-x text-lg mb-4 uppercase tracking-wider">Pattern Types</h3>
              <div className="grid gap-3">
                {['geometric', 'organic', 'symbolic', 'fractal'].map(pattern => (
                  <button
                    key={pattern}
                    onClick={() => setCurrentPattern(pattern)}
                    className={`p-3 rounded-lg transition-all duration-300 text-sm border hover:transform hover:-translate-y-0.5 ${
                      currentPattern === pattern
                        ? 'bg-gradient-to-r from-axis-x to-[#29b6f6] border-axis-x text-void-black font-bold'
                        : 'bg-gradient-to-r from-node-core to-[#4a5568] border-[#718096] text-crystal-white hover:border-axis-x'
                    }`}
                  >
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <h3 className="text-axis-x text-lg mb-4 uppercase tracking-wider">Actions</h3>
              <button
                onClick={classifyPattern}
                className="w-full bg-gradient-to-r from-axis-y to-[#66bb6a] text-[#1b5e20] p-3 rounded-lg font-bold mb-3 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Classify Pattern
              </button>
              <button
                onClick={generateStars}
                className="w-full bg-gradient-to-r from-axis-y to-[#66bb6a] text-[#1b5e20] p-3 rounded-lg font-bold mb-3 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Generate Stars
              </button>
              <button
                onClick={clearCanvas}
                className="w-full bg-gradient-to-r from-[#f48fb1] to-[#f06292] text-[#880e4f] p-3 rounded-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Clear Canvas
              </button>
            </div>

            {/* Statistics */}
            <div className="mb-6">
              <h3 className="text-axis-x text-lg mb-4 uppercase tracking-wider">Statistics</h3>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Patterns Classified:</span>
                  <span className="text-axis-x font-bold">{stats.classified}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Accuracy Rate:</span>
                  <span className="text-axis-x font-bold">{stats.accuracy}%</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Stars Connected:</span>
                  <span className="text-axis-x font-bold">{stats.connected}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span>Neural Patterns:</span>
                  <span className="text-axis-x font-bold">{stats.patterns}</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-axis-x to-axis-y transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback.message && (
              <div className={`p-4 rounded-lg text-center font-bold transition-opacity duration-300 ${
                feedback.type === 'success' 
                  ? 'bg-axis-y/20 border border-axis-y text-axis-y'
                  : 'bg-[#f48fb1]/20 border border-[#f48fb1] text-[#f48fb1]'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-sacred-text to-crystal-white text-void-black rounded-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
          >
            Return to Sacred Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default ClassifierConstruct;