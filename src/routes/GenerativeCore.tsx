import React, { useState, useEffect, useRef } from 'react';

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

// Pattern descriptions for AI learning
const PATTERN_DESCRIPTIONS = {
  spiral: "Sequential Generation - Like how ChatGPT creates text word by word",
  fractal: "Recursive Patterns - Self-similar structures found in AI-generated art",
  wave: "Continuous Flow - Similar to AI audio and video generation",
  crystal: "Structured Data - How AI organizes and generates formatted content",
  neural: "Network Connections - Mimics how neural networks process information"
};

// Tutorial steps
const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to the Generative Core',
    content: 'You are about to embark on a journey into the heart of Generative AI. Here, you will learn how AI creates new patterns, ideas, and possibilities from learned knowledge.',
    highlight: null,
    action: 'Begin Journey'
  },
  {
    id: 'mission',
    title: 'Your Mission',
    content: 'As an AI Architect, you will channel energy through the Sacred Core to generate new patterns. Each pattern represents how AI models create new content - from text to images to ideas.',
    highlight: null,
    action: 'Accept Mission'
  },
  {
    id: 'patterns',
    title: 'Understanding Patterns',
    content: 'Just like AI models learn patterns from data, you will start with simple patterns and unlock more complex ones. The Spiral represents sequential generation, like how ChatGPT creates text word by word.',
    highlight: 'patterns',
    action: 'Explore Patterns'
  },
  {
    id: 'generation',
    title: 'The Generation Process',
    content: 'Click "Generate Sacred Pattern" to simulate how AI generates new content. Watch as the Core channels energy and creates something new - just like how AI models use learned patterns to create original outputs.',
    highlight: 'generate',
    action: 'Try Generating'
  },
  {
    id: 'energy',
    title: 'Core Energy = Model Confidence',
    content: 'The Core Energy represents the AI\'s confidence in its generation. Higher energy means better, more coherent outputs. In real AI, this is like the model\'s training quality and parameter tuning.',
    highlight: 'stats',
    action: 'Understand Energy'
  },
  {
    id: 'complete',
    title: 'Begin Your Journey',
    content: 'You now understand the basics! Each pattern you unlock teaches a new AI concept: Fractals (recursive generation), Waves (continuous outputs), Crystals (structured data), and Neural (network thinking).',
    highlight: null,
    action: 'Start Creating'
  }
];

// Canvas-based visualization component
const GenerativeCanvas = ({ pattern, intensity, energy, isGenerating }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // Initialize particles
    const particleCount = Math.floor(500 * intensity);
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      life: 1,
      angle: (i / particleCount) * Math.PI * 2,
      radius: 0,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 3 + 1,
      color: SACRED_COLORS.energyGlow
    }));
    
    const animate = (time) => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw core
      const coreSize = 60 * energy;
      const pulse = Math.sin(time * 0.002) * 0.3 + 1;
      
      // Core glow
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, coreSize * pulse * 2);
      gradient.addColorStop(0, SACRED_COLORS.nodeCore);
      gradient.addColorStop(0.5, SACRED_COLORS.energyGlow + '40');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Core shape
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(time * 0.0005);
      
      // Draw geometric core
      ctx.strokeStyle = SACRED_COLORS.nodeCore;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * coreSize * pulse;
        const y = Math.sin(angle) * coreSize * pulse;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Inner geometry
      ctx.strokeStyle = SACRED_COLORS.axisX + '80';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.001;
        const x = Math.cos(angle) * coreSize * pulse * 0.6;
        const y = Math.sin(angle) * coreSize * pulse * 0.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
      
      // Update and draw particles based on pattern
      particlesRef.current.forEach((particle, i) => {
        switch (pattern) {
          case PATTERN_TYPES.SPIRAL:
            particle.angle += 0.02;
            particle.radius += particle.speed * 0.5;
            particle.x = width/2 + Math.cos(particle.angle) * particle.radius;
            particle.y = height/2 + Math.sin(particle.angle) * particle.radius;
            break;
            
          case PATTERN_TYPES.FRACTAL:
            const branch = Math.floor(i / 50);
            const branchAngle = (branch / 10) * Math.PI * 2;
            particle.x += Math.cos(branchAngle + time * 0.001) * particle.speed;
            particle.y += Math.sin(branchAngle + time * 0.001) * particle.speed;
            if (Math.random() < 0.01) {
              particle.x = width/2 + (Math.random() - 0.5) * 50;
              particle.y = height/2 + (Math.random() - 0.5) * 50;
            }
            break;
            
          case PATTERN_TYPES.WAVE:
            particle.x += particle.speed;
            particle.y = height/2 + Math.sin((particle.x / width) * Math.PI * 4 + time * 0.002) * 100;
            if (particle.x > width) {
              particle.x = 0;
              particle.y = height/2;
            }
            break;
            
          case PATTERN_TYPES.CRYSTAL:
            const crystalAngle = (i / particlesRef.current.length) * Math.PI * 2;
            const crystalRadius = 100 + Math.sin(time * 0.001 + i * 0.1) * 30;
            particle.x = width/2 + Math.cos(crystalAngle) * crystalRadius;
            particle.y = height/2 + Math.sin(crystalAngle) * crystalRadius;
            break;
            
          case PATTERN_TYPES.NEURAL:
            const layer = Math.floor(i / 50);
            const nodeInLayer = i % 50;
            const layerY = height/2 + (layer - 2) * 80;
            const nodeX = width/2 + (nodeInLayer - 25) * 15;
            particle.x += (nodeX - particle.x) * 0.05;
            particle.y += (layerY - particle.y) * 0.05;
            
            // Draw connections
            if (Math.random() < 0.01 && layer < 4) {
              ctx.strokeStyle = SACRED_COLORS.axisY + '20';
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              const targetNode = Math.floor(Math.random() * 50) + (layer + 1) * 50;
              if (particlesRef.current[targetNode]) {
                ctx.lineTo(particlesRef.current[targetNode].x, particlesRef.current[targetNode].y);
                ctx.stroke();
              }
            }
            break;
        }
        
        // Reset particles that go off screen
        if (particle.x < -50 || particle.x > width + 50 || 
            particle.y < -50 || particle.y > height + 50 ||
            (pattern === PATTERN_TYPES.SPIRAL && particle.radius > Math.max(width, height))) {
          particle.x = width/2;
          particle.y = height/2;
          particle.radius = 0;
          particle.angle = (i / particlesRef.current.length) * Math.PI * 2;
        }
        
        // Draw particle
        ctx.fillStyle = particle.color + (isGenerating ? 'FF' : '80');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, intensity, energy, isGenerating]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%)' }}
    />
  );
};

// Main Generative Core game component
const GenerativeCore = () => {
  const [gameState, setGameState] = useState({
    stage: 'awakening',
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
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Get current tutorial info
  const currentTutorial = TUTORIAL_STEPS[tutorialStep];

  // Handle tutorial progression
  const nextTutorialStep = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setVoiceGuidance("The journey begins. Channel your creativity through the Sacred Core...");
    }
  };

  // Pattern generation logic
  const generatePattern = async (patternType) => {
    // If in tutorial, advance after first generation
    if (showTutorial && currentTutorial.id === 'generation') {
      nextTutorialStep();
    }

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
      setVoiceGuidance("The Fractal mysteries reveal themselves to you... Fractals represent recursive generation in AI!");
    } else if (gameState.mysticalMoments >= 4 && !gameState.patternsUnlocked.includes(PATTERN_TYPES.WAVE)) {
      setGameState(prev => ({
        ...prev,
        patternsUnlocked: [...prev.patternsUnlocked, PATTERN_TYPES.WAVE]
      }));
      setVoiceGuidance("Wave patterns emerge... Like continuous AI outputs in audio or video generation!");
    } else if (gameState.mysticalMoments >= 6 && !gameState.patternsUnlocked.includes(PATTERN_TYPES.CRYSTAL)) {
      setGameState(prev => ({
        ...prev,
        patternsUnlocked: [...prev.patternsUnlocked, PATTERN_TYPES.CRYSTAL]
      }));
      setVoiceGuidance("Crystal structures form... Representing structured data generation in AI!");
    } else if (gameState.mysticalMoments >= 8 && !gameState.patternsUnlocked.includes(PATTERN_TYPES.NEURAL)) {
      setGameState(prev => ({
        ...prev,
        patternsUnlocked: [...prev.patternsUnlocked, PATTERN_TYPES.NEURAL]
      }));
      setVoiceGuidance("Neural pathways activate... You now understand how AI networks think and create!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/30 to-black text-white overflow-hidden">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full mx-auto p-8 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl border border-cyan-400/50 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {currentTutorial.title}
            </h2>
            <p className="text-lg mb-8 leading-relaxed text-gray-100">
              {currentTutorial.content}
            </p>
            <button
              onClick={nextTutorialStep}
              className="px-8 py-4 font-mono text-base tracking-wider bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/70 text-white rounded-lg hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300 animate-pulse"
            >
              {currentTutorial.action}
            </button>
          </div>
        </div>
      )}

      {/* Sacred HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div 
            className={`bg-black/50 backdrop-blur-sm rounded-lg p-4 border transition-all duration-300 ${
              currentTutorial?.highlight === 'stats' ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-blue-400/30'
            }`}
          >
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

      {/* Generative Canvas Visualization */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ height: '60vh', top: '10vh' }}>
        <div className="w-full h-full max-w-4xl mx-auto relative">
          <GenerativeCanvas 
            pattern={gameState.currentPattern}
            intensity={gameState.patternIntensity}
            energy={gameState.coreEnergy}
            isGenerating={isGenerating}
          />
          
          {/* Pattern Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-3 max-w-sm">
            <div className="text-xs text-cyan-300 mb-1">Current Pattern:</div>
            <div className="text-sm font-bold text-white">{gameState.currentPattern.toUpperCase()}</div>
            <div className="text-xs text-gray-300 mt-1">{PATTERN_DESCRIPTIONS[gameState.currentPattern]}</div>
          </div>
        </div>
      </div>

      {/* Sacred Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="bg-black/70 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30">
          {/* Pattern Selection */}
          <div 
            className={`mb-6 transition-all duration-300 ${
              currentTutorial?.highlight === 'patterns' ? 'ring-4 ring-yellow-400/50 rounded-lg p-2' : ''
            }`}
          >
            <h3 className="font-mono text-lg mb-4 text-cyan-300">Sacred Pattern Genesis</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Object.values(PATTERN_TYPES).map(pattern => (
                <button
                  key={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                  disabled={!gameState.patternsUnlocked.includes(pattern)}
                  className={`
                    relative px-4 py-2 font-mono text-xs tracking-wider
                    ${selectedPattern === pattern 
                      ? 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent border-blue-400/70' 
                      : 'bg-gradient-to-r from-transparent via-purple-500/20 to-transparent border-purple-400/50'
                    }
                    border text-white rounded-lg backdrop-blur-sm
                    hover:shadow-lg hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                  `}
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  {!gameState.patternsUnlocked.includes(pattern) && ' 🔒'}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={() => generatePattern(selectedPattern)}
              disabled={isGenerating}
              className={`
                px-8 py-4 font-mono text-lg tracking-wider
                bg-gradient-to-r from-transparent via-blue-500/20 to-transparent
                border-2 text-white rounded-lg backdrop-blur-sm
                hover:shadow-lg hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                ${currentTutorial?.highlight === 'generate' 
                  ? 'border-yellow-400 ring-4 ring-yellow-400/50 animate-pulse' 
                  : 'border-blue-400/70'
                }
              `}
            >
              {isGenerating ? 'Channeling...' : 'Generate Sacred Pattern'}
            </button>
            
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

          {/* Tutorial Restart Button */}
          {!showTutorial && (
            <button
              onClick={() => {
                setTutorialStep(0);
                setShowTutorial(true);
              }}
              className="mt-4 text-xs text-purple-300 hover:text-purple-100 transition-colors"
            >
              Replay Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerativeCore;