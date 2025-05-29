import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import * as Tone from 'tone';

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

interface GameReducerState {
  gameState: GameState;
  level: number;
  score: number;
  highScore: number;
  attempts: number;
  pattern: string[];
  playerSequence: string[];
  activeCrystals: Set<string>;
  resonatingCrystals: Set<string>;
  errorCrystals: Set<string>;
  showPattern: boolean;
  inputLocked: boolean;
  currentShowingIndex: number;
  totalPatterns: number;
  perfectStreak: number;
}

type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_PATTERN'; pattern: string[] }
  | { type: 'START_SHOWING' }
  | { type: 'SHOW_CRYSTAL'; crystalId: string; index: number }
  | { type: 'END_SHOWING' }
  | { type: 'PLAYER_CLICK'; crystalId: string }
  | { type: 'CORRECT_CLICK' }
  | { type: 'WRONG_CLICK'; crystalId: string }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_HIGH_SCORE' }
  | { type: 'GAME_OVER' };

const initialState: GameReducerState = {
  gameState: 'menu',
  level: 1,
  score: 0,
  highScore: parseInt(localStorage.getItem('crystalResonanceHighScore') || '0'),
  attempts: 3,
  pattern: [],
  playerSequence: [],
  activeCrystals: new Set(),
  resonatingCrystals: new Set(),
  errorCrystals: new Set(),
  showPattern: false,
  inputLocked: true,
  currentShowingIndex: -1,
  totalPatterns: 0,
  perfectStreak: 0,
};

function gameReducer(state: GameReducerState, action: GameAction): GameReducerState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameState: 'showing',
        level: 1,
        score: 0,
        attempts: 3,
        totalPatterns: 0,
        perfectStreak: 0,
        playerSequence: [],
        activeCrystals: new Set(),
        resonatingCrystals: new Set(),
        errorCrystals: new Set(),
      };
    
    case 'RESET_GAME':
      return {
        ...state,
        gameState: 'menu',
        level: 1,
        score: 0,
        attempts: 3,
        pattern: [],
        playerSequence: [],
        activeCrystals: new Set(),
        resonatingCrystals: new Set(),
        errorCrystals: new Set(),
        showPattern: false,
        inputLocked: true,
        currentShowingIndex: -1,
      };
    
    case 'SET_PATTERN':
      return {
        ...state,
        pattern: action.pattern,
        playerSequence: [],
      };
    
    case 'START_SHOWING':
      return {
        ...state,
        gameState: 'showing',
        showPattern: true,
        inputLocked: true,
        activeCrystals: new Set(),
        resonatingCrystals: new Set(),
        errorCrystals: new Set(),
        currentShowingIndex: -1,
      };
    
    case 'SHOW_CRYSTAL':
      return {
        ...state,
        resonatingCrystals: new Set([action.crystalId]),
        currentShowingIndex: action.index,
      };
    
    case 'END_SHOWING':
      return {
        ...state,
        gameState: 'waiting',
        showPattern: false,
        inputLocked: false,
        resonatingCrystals: new Set(),
        currentShowingIndex: -1,
      };
    
    case 'PLAYER_CLICK':
      if (state.inputLocked) return state;
      
      const newSequence = [...state.playerSequence, action.crystalId];
      const isCorrect = state.pattern[newSequence.length - 1] === action.crystalId;
      
      if (isCorrect) {
        return {
          ...state,
          playerSequence: newSequence,
          activeCrystals: new Set([...state.activeCrystals, action.crystalId]),
        };
      } else {
        return {
          ...state,
          playerSequence: newSequence,
          errorCrystals: new Set([action.crystalId]),
          inputLocked: true,
          perfectStreak: 0,
        };
      }
    
    case 'WRONG_CLICK':
      const newAttempts = state.attempts - 1;
      return {
        ...state,
        attempts: newAttempts,
        gameState: newAttempts <= 0 ? 'failed' : state.gameState,
      };
    
    case 'LEVEL_COMPLETE':
      const newScore = state.score + state.level * 100;
      const newHighScore = Math.max(newScore, state.highScore);
      if (newHighScore > state.highScore) {
        localStorage.setItem('crystalResonanceHighScore', newHighScore.toString());
      }
      return {
        ...state,
        gameState: 'complete',
        score: newScore,
        highScore: newHighScore,
        level: state.level + 1,
        totalPatterns: state.totalPatterns + 1,
        perfectStreak: state.perfectStreak + 1,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        errorCrystals: new Set(),
        inputLocked: false,
        playerSequence: [],
        activeCrystals: new Set(),
      };
    
    case 'UPDATE_HIGH_SCORE':
      if (state.score > state.highScore) {
        localStorage.setItem('crystalResonanceHighScore', state.score.toString());
        return {
          ...state,
          highScore: state.score,
        };
      }
      return state;
    
    case 'GAME_OVER':
      return {
        ...state,
        gameState: 'failed',
      };
    
    default:
      return state;
  }
}

// Audio synthesis setup
const initAudio = async () => {
  await Tone.start();
  // We'll adjust the main synth for a softer, more ethereal sound overall
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' }, // Sine waves are pure and good for ethereal sounds
    envelope: {
      attack: 0.5, // Slower attack for gentler entry
      decay: 0.8,
      sustain: 0.5,
      release: 2, // Longer release for a more lingering sound
    },
    volume: -10 // Slightly lower volume for the main synth
  }).toDestination();

  const errorSynth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.1,
      release: 0.5,
    },
  }).toDestination();

  // Create a dedicated winning synth with more ethereal properties
  const winningSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' }, // Triangle wave for a softer, flute-like tone
    envelope: {
      attack: 1.5, // Even slower attack for a gentle swell
      decay: 2,
      sustain: 0.8,
      release: 3, // Long, drawn-out release
    },
    volume: -8 // A bit louder for prominence
  }).toDestination();

  // Add effects for enlightenment sound: Reverb and Shimmer
  const reverb = new Tone.Reverb({
    decay: 4, // Long decay for a spacious feel
    preDelay: 0.01,
    wet: 0.8 // High wetness for pronounced effect
  }).toDestination();

  const shimmer = new Tone.FeedbackDelay({
    delayTime: '8n',
    feedback: 0.6,
    wet: 0.3 // Subtle shimmer
  }).toDestination();

  // Connect the winning synth to reverb and shimmer
  winningSynth.connect(reverb);
  reverb.connect(shimmer); // shimmer after reverb for a trailing effect

  return { synth, errorSynth, winningSynth };
};

const CrystalResonance: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'reconnecting'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const patternTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<{ synth: Tone.PolySynth; errorSynth: Tone.Synth; winningSynth: Tone.PolySynth } | null>(null); // Updated type
  const flowLinesRef = useRef<{ from: Crystal; to: Crystal }[]>([]);
  
  // Sacred geometry crystal configuration
  const crystalPositions: Crystal[] = [
    { x: 50, y: 50, z: 0, id: 'SOUL', color: '#8b5cf6', frequency: 528 }, // 528 Hz - "Love frequency", "Miracle tone"
    { x: 25, y: 20, z: -20, id: 'FIRE', color: '#ef4444', frequency: 639 }, // 639 Hz - Relationships, connecting
    { x: 75, y: 20, z: -20, id: 'AIR', color: '#06b6d4', frequency: 741 }, // 741 Hz - Intuition, awakening
    { x: 75, y: 80, z: -20, id: 'EARTH', color: '#22c55e', frequency: 417 }, // 417 Hz - Undoing situations, facilitating change
    { x: 25, y: 80, z: -20, id: 'WATER', color: '#3b82f6', frequency: 396 }, // 396 Hz - Liberating guilt and fear
    { x: 15, y: 10, z: -40, id: 'AMOR', color: '#ec4899', frequency: 963 }, // 963 Hz - Pineal Gland Activation, Divine Consciousness
    { x: 85, y: 10, z: -40, id: 'LUMI', color: '#f59e0b', frequency: 852 }, // 852 Hz - Unconditional Love, Spiritual Guidance
    { x: 95, y: 50, z: -40, id: 'VITA', color: '#10b981', frequency: 693 }, // 693 Hz - Inner Harmony, Healing
    { x: 85, y: 90, z: -40, id: 'FLUX', color: '#8b5cf6', frequency: 174 }, // 174 Hz - Pain relief, security
    { x: 15, y: 90, z: -40, id: 'VOID', color: '#6b7280', frequency: 285 }, // 285 Hz - Energy, intuition, health
    { x: 5, y: 50, z: -40, id: 'TIME', color: '#a855f7', frequency: 432 }, // 432 Hz - Universal frequency, balance
  ];

  // Initialize audio
  useEffect(() => {
    if (audioEnabled && !audioRef.current) {
      initAudio().then(audio => {
        audioRef.current = audio;
      });
    }
  }, [audioEnabled]);

  // Play crystal sound
  const playCrystalSound = useCallback((crystal: Crystal, isError: boolean = false) => {
    if (!audioEnabled || !audioRef.current) return;
    
    if (isError) {
      audioRef.current.errorSynth.triggerAttackRelease('C2', '0.2');
    } else {
      const note = Tone.Frequency(crystal.frequency, 'hz').toNote();
      audioRef.current.synth.triggerAttackRelease(note, '0.5');
    }
  }, [audioEnabled]);

  // WebSocket connection with exponential backoff
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8080/ai-cube');
        
        wsRef.current.onopen = () => {
          console.log('Connected to AI Cube');
          setConnectionStatus('connected');
          setReconnectAttempts(0);
          sendGameState();
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'ai_input' && message.data.crystalId) {
              handleCrystalClick(message.data.crystalId);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('disconnected');
        };
        
        wsRef.current.onclose = () => {
          console.log('Disconnected from AI Cube');
          setConnectionStatus('reconnecting');
          
          // Exponential backoff with max delay of 30 seconds
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          setReconnectAttempts(prev => prev + 1);
          
          reconnectTimeout = setTimeout(connectWebSocket, delay);
        };
      } catch (error) {
        console.error('Failed to connect to AI Cube:', error);
        setConnectionStatus('disconnected');
      }
    };
    
    // Uncomment to enable WebSocket connection
    // connectWebSocket();
    
    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [reconnectAttempts]);

  // Send game state to AI Cube
  const sendGameState = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'game_state',
        timestamp: Date.now(),
        data: {
          gameState: state.gameState,
          level: state.level,
          score: state.score,
          attempts: state.attempts,
          patternLength: state.pattern.length,
          playerProgress: state.playerSequence.length,
          activeCrystals: Array.from(state.activeCrystals),
          errorCrystals: Array.from(state.errorCrystals),
          perfectStreak: state.perfectStreak,
        }
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, [state]);

  // Generate new pattern with correct level
  const generateNewPattern = useCallback((level: number) => {
    const availableCrystals = crystalPositions.map(c => c.id);
    const patternLength = Math.min(3 + Math.floor(level / 2), 8);
    const newPattern: string[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      const randomCrystal = availableCrystals[Math.floor(Math.random() * availableCrystals.length)];
      newPattern.push(randomCrystal);
    }
    
    return newPattern;
  }, []);

  // Calculate flow lines between crystals
  const calculateFlowLines = useCallback((pattern: string[]) => {
    const lines: { from: Crystal; to: Crystal }[] = [];
    
    for (let i = 0; i < pattern.length - 1; i++) {
      const fromCrystal = crystalPositions.find(c => c.id === pattern[i]);
      const toCrystal = crystalPositions.find(c => c.id === pattern[i + 1]);
      
      if (fromCrystal && toCrystal) {
        lines.push({ from: fromCrystal, to: toCrystal });
      }
    }
    
    flowLinesRef.current = lines;
  }, []);

  // Show pattern sequence with visual flow
  const showPatternSequence = useCallback(() => {
    dispatch({ type: 'START_SHOWING' });
    calculateFlowLines(state.pattern);
    
    const speedMs = Math.max(600, 1500 - state.level * 50);
    let index = 0;
    
    const showNext = () => {
      if (index >= state.pattern.length) {
        patternTimeoutRef.current = setTimeout(() => {
          dispatch({ type: 'END_SHOWING' });
          flowLinesRef.current = [];
        }, speedMs);
        return;
      }
      
      const crystalId = state.pattern[index];
      const crystal = crystalPositions.find(c => c.id === crystalId);
      
      dispatch({ type: 'SHOW_CRYSTAL', crystalId, index });
      
      if (crystal) {
        playCrystalSound(crystal);
      }
      
      index++;
      patternTimeoutRef.current = setTimeout(showNext, speedMs);
    };
    
    patternTimeoutRef.current = setTimeout(showNext, 500);
  }, [state.pattern, state.level, playCrystalSound, calculateFlowLines]);

  // Play an enlightening harmonic progression for level complete
  const playEnlightenmentSound = useCallback(() => {
    if (!audioEnabled || !audioRef.current?.winningSynth) return;

    // Use a sustained, high-frequency, consonant chord, possibly with added harmonics.
    // Example: A major 7th or a suspended chord resolving
    // A more ethereal, open chord or a gentle arpeggio
    const notes = [
      'A4', // Root
      'C#5', // Major 3rd
      'E5', // Perfect 5th
      'G#5', // Major 7th
      'C6' // Higher octave
    ];
    // Or a more open, "om" like chord using higher frequencies and perfect intervals
    // const notes = ['C5', 'G5', 'C6', 'E6']; // Pure 5ths and octaves, with a high 3rd
    // Or based on Solfeggio 528 Hz and its harmonics
    // const notes = [Tone.Frequency(528, 'hz').toNote(), Tone.Frequency(528 * 1.5, 'hz').toNote(), Tone.Frequency(528 * 2, 'hz').toNote()];

    audioRef.current.winningSynth.triggerAttackRelease(notes, '4n', Tone.now()); // Play for 4 beats
    audioRef.current.winningSynth.triggerAttackRelease('A6', '8n', Tone.now() + Tone.Time('4n').toSeconds() + 0.1); // Add a high, shimmering tone
  }, [audioEnabled]);

  // Handle crystal click with audio feedback
  const handleCrystalClick = useCallback((crystalId: string) => {
    if (state.inputLocked || state.gameState !== 'waiting') return;
    
    const crystal = crystalPositions.find(c => c.id === crystalId);
    if (!crystal) return;
    
    dispatch({ type: 'PLAYER_CLICK', crystalId });
    
    const newSequence = [...state.playerSequence, crystalId];
    const isCorrect = state.pattern[newSequence.length - 1] === crystalId;
    
    if (isCorrect) {
      playCrystalSound(crystal);
      
      if (newSequence.length === state.pattern.length) {
        dispatch({ type: 'LEVEL_COMPLETE' });
        
        // Play the enlightened success sound
        playEnlightenmentSound();
        
        timeoutRef.current = setTimeout(() => {
          const nextLevel = state.level + 1;
          const newPattern = generateNewPattern(nextLevel);
          dispatch({ type: 'SET_PATTERN', pattern: newPattern });
          
          timeoutRef.current = setTimeout(() => {
            showPatternSequence();
          }, 500);
        }, 2000);
      }
    } else {
      playCrystalSound(crystal, true);
      dispatch({ type: 'WRONG_CLICK', crystalId });
      
      timeoutRef.current = setTimeout(() => {
        if (state.attempts > 1) {
          dispatch({ type: 'CLEAR_ERROR' });
          timeoutRef.current = setTimeout(() => {
            showPatternSequence();
          }, 500);
        } else {
          dispatch({ type: 'UPDATE_HIGH_SCORE' });
        }
      }, 1500);
    }
  }, [state, generateNewPattern, showPatternSequence, playCrystalSound, audioEnabled, playEnlightenmentSound]); // Added playEnlightenmentSound to dependency array

  // Start game
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    
    const newPattern = generateNewPattern(1);
    dispatch({ type: 'SET_PATTERN', pattern: newPattern });
    
    timeoutRef.current = setTimeout(() => {
      showPatternSequence();
    }, 1000);
  }, [generateNewPattern, showPatternSequence]);

  // Reset game
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current);
      if (audioRef.current) {
        audioRef.current.synth.dispose();
        audioRef.current.errorSynth.dispose();
        if (audioRef.current.winningSynth) { // Dispose winning synth if it exists
          audioRef.current.winningSynth.dispose();
        }
      }
    };
  }, []);

  // Update AI Cube when state changes
  useEffect(() => {
    sendGameState();
  }, [state, sendGameState]);

  const getCrystalClassName = (crystalId: string) => {
    let className = 'sacred-crystal';
    if (state.activeCrystals.has(crystalId)) className += ' active';
    if (state.resonatingCrystals.has(crystalId)) className += ' resonating';
    if (state.errorCrystals.has(crystalId)) className += ' error';
    return className;
  };

  const getCrystalByColor = (crystalId: string) => {
    return crystalPositions.find(c => c.id === crystalId)?.color || '#8b5cf6';
  };

  const getCrystalById = (crystalId: string) => {
    return crystalPositions.find(c => c.id === crystalId);
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
          width: 4rem;
          height: 4rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.625rem;
          color: white;
          text-shadow: 0 0 10px currentColor;
          clip-path: polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%);
          backdrop-filter: blur(3px);
          border: 1px solid currentColor;
          transform-origin: center;
        }
        
        @media (max-width: 768px) {
          .sacred-crystal {
            width: 3rem;
            height: 3rem;
            font-size: 0.5rem;
          }
        }
        
        .sacred-crystal:hover:not(.resonating):not(.error) {
          transform: scale(1.1);
          box-shadow: 0 0 20px currentColor, inset 0 0 15px rgba(255, 255, 255, 0.3);
          filter: brightness(1.2);
        }
        
        .sacred-crystal.active {
          transform: scale(1.2) rotateY(180deg);
          box-shadow: 0 0 30px currentColor, inset 0 0 20px rgba(255, 255, 255, 0.2);
          animation: crystal-harmonize 0.6s ease-in-out;
        }
        
        .sacred-crystal.resonating {
          animation: crystal-resonate 1.2s ease-in-out;
          box-shadow: 0 0 40px currentColor, 0 0 60px currentColor, 0 0 80px currentColor;
          transform: scale(1.3);
          filter: brightness(1.5) saturate(1.5);
        }
        
        .sacred-crystal.error {
          animation: crystal-discord 1.5s ease-in-out;
          box-shadow: 0 0 30px #ef4444, inset 0 0 20px #ef4444;
          filter: saturate(0.3) brightness(0.8);
          background-color: #ef4444 !important;
        }
        
        @keyframes crystal-harmonize {
          0%, 100% { transform: scale(1.2) rotateY(180deg); }
          50% { transform: scale(1.4) rotateY(270deg); }
        }
        
        @keyframes crystal-resonate {
          0%, 100% { 
            transform: scale(1.3) rotateZ(0deg); 
            opacity: 1; 
            filter: brightness(1.5) saturate(1.5) hue-rotate(0deg);
          }
          25% { 
            transform: scale(1.5) rotateZ(90deg); 
            opacity: 0.8;
            filter: brightness(2) saturate(2) hue-rotate(30deg);
          }
          50% { 
            transform: scale(1.4) rotateZ(180deg); 
            opacity: 1;
            filter: brightness(1.8) saturate(1.8) hue-rotate(-30deg);
          }
          75% { 
            transform: scale(1.6) rotateZ(270deg); 
            opacity: 0.9;
            filter: brightness(2.2) saturate(2.2) hue-rotate(60deg);
          }
        }
        
        @keyframes crystal-discord {
          0% { 
            transform: translateX(0) scale(1) rotateZ(0deg); 
            opacity: 1;
          }
          10% { 
            transform: translateX(-4px) scale(0.95) rotateZ(-5deg); 
            opacity: 0.9;
          }
          20% { 
            transform: translateX(4px) scale(0.95) rotateZ(5deg); 
            opacity: 0.8;
          }
          30% { 
            transform: translateX(-6px) scale(0.9) rotateZ(-10deg); 
            opacity: 0.9;
          }
          40% { 
            transform: translateX(6px) scale(0.9) rotateZ(10deg); 
            opacity: 1;
          }
          100% { 
            transform: translateX(0) scale(1) rotateZ(0deg); 
            opacity: 1;
          }
        }
        
        .pattern-flow-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--flow-color), transparent);
          transform-origin: left center;
          animation: flow-pulse 0.8s ease-out;
          pointer-events: none;
        }
        
        @keyframes flow-pulse {
          0% { 
            opacity: 0;
            transform: scaleX(0);
          }
          50% { 
            opacity: 1;
            transform: scaleX(1);
          }
          100% { 
            opacity: 0;
            transform: scaleX(1);
          }
        }
        
        .frequency-ripple {
          position: absolute;
          border-radius: 50%;
          border: 2px solid var(--ripple-color);
          opacity: 0;
          animation: ripple-expand 1.5s ease-out;
          pointer-events: none;
        }
        
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 150px;
            height: 150px;
            opacity: 0;
          }
        }
        
        .sacred-geometry {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80vw;
          max-width: 800px;
          height: 80vw;
          max-height: 800px;
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
          width: 60vw;
          max-width: 600px;
          height: 60vw;
          max-height: 600px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 40%, rgba(139, 92, 246, 0.1) 70%, transparent 100%);
          animation: aura-breathe 6s ease-in-out infinite;
        }
        
        @keyframes aura-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
        
        .crystal-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 800px;
          height: 80vh;
          max-height: 600px;
          transform-style: preserve-3d;
        }
        
        .connection-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .connection-indicator.connected {
          background-color: #22c55e;
        }
        
        .connection-indicator.reconnecting {
          background-color: #f59e0b;
        }
        
        .connection-indicator.disconnected {
          background-color: #ef4444;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>

      {/* Sacred Grid Background */}
      <div className="sacred-grid" role="presentation"></div>

      {/* Mystical Aura */}
      <div className="mystical-aura" role="presentation"></div>

      {/* Sacred Geometry */}
      <div className="sacred-geometry" role="presentation">
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          height: '50%',
          border: '1px solid #8b5cf6',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(60deg)',
          width: '50%',
          height: '50%',
          border: '1px solid #ec4899',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(120deg)',
          width: '50%',
          height: '50%',
          border: '1px solid #10b981',
          borderRadius: '50%'
        }}></div>
      </div>

      {/* Energy Fields */}
      <div className="energy-field" style={{ left: '15%', animationDelay: '0s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '30%', animationDelay: '1s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '70%', animationDelay: '2s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '85%', animationDelay: '0.5s' }} role="presentation"></div>

      {/* Crystal Array */}
      <div className="crystal-container" role="main" aria-label="Crystal game board">
        {crystalPositions.map((crystal, index) => (
          <button
            key={`${index}-${crystal.id}`}
            className={getCrystalClassName(crystal.id)}
            style={{
              left: `${crystal.x}%`,
              top: `${crystal.y}%`,
              transform: `translate(-50%, -50%) translateZ(${crystal.z}px)`,
              backgroundColor: crystal.color,
              color: crystal.color,
            }}
            onClick={() => handleCrystalClick(crystal.id)}
            aria-label={`Crystal ${crystal.id}, ${state.activeCrystals.has(crystal.id) ? 'activated' : 'inactive'}`}
            aria-pressed={state.activeCrystals.has(crystal.id)}
            disabled={state.inputLocked}
          >
            {crystal.id}
            {/* Frequency ripple effect */}
            {state.resonatingCrystals.has(crystal.id) && (
              <div 
                className="frequency-ripple"
                style={{
                  '--ripple-color': crystal.color,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                } as React.CSSProperties}
              />
            )}
          </button>
        ))}
        
        {/* Pattern Flow Lines */}
        {state.showPattern && state.currentShowingIndex >= 0 && state.currentShowingIndex < state.pattern.length - 1 && (
          (() => {
            const fromCrystal = getCrystalById(state.pattern[state.currentShowingIndex]);
            const toCrystal = getCrystalById(state.pattern[state.currentShowingIndex + 1]);
            
            if (fromCrystal && toCrystal) {
              const dx = (toCrystal.x - fromCrystal.x) * 8; // Scale by container width percentage
              const dy = (toCrystal.y - fromCrystal.y) * 6; // Scale by container height percentage
              const distance = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              
              return (
                <div
                  className="pattern-flow-line"
                  style={{
                    '--flow-color': fromCrystal.color,
                    left: `${fromCrystal.x}%`,
                    top: `${fromCrystal.y}%`,
                    width: `${distance}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${distance/2}px)`,
                  } as React.CSSProperties}
                />
              );
            }
            return null;
          })()
        )}
      </div>

      {/* Sacred HUD */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Connection Status Indicator */}
        <div 
          className={`connection-indicator ${connectionStatus}`}
          title={`AI Cube: ${connectionStatus}`}
          role="status"
          aria-label={`AI Cube connection status: ${connectionStatus}`}
        ></div>

        {/* Crystal Resonance Status */}
        <div className="absolute top-5 left-5 bg-black/80 border border-purple-500 backdrop-blur-md p-5 pointer-events-auto min-w-[280px]" role="region" aria-label="Game status">
          <div className="text-purple-400 text-lg mb-4 font-serif">
            ◊ CRYSTAL RESONANCE ◊
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            <span>HARMONIC LEVEL: </span><span aria-live="polite">{state.level.toString().padStart(2, '0')}</span>
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-neonMint mr-2 animate-pulse"></span>
            <span>RESONANCE SCORE: </span><span aria-live="polite">{state.score.toString().padStart(4, '0')}</span>
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>HIGH SCORE: </span><span>{state.highScore.toString().padStart(4, '0')}</span>
          </div>
          <div className="font-mono">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 animate-pulse ${
              state.gameState === 'waiting' ? 'bg-green-500' : 
              state.gameState === 'showing' ? 'bg-yellow-500' : 'bg-purple-500'
            }`}></span>
            <span aria-live="assertive">
              {state.gameState === 'showing' ? 'ATTUNING CRYSTALS...' :
               state.gameState === 'waiting' ? 'CHANNEL THE PATTERN...' :
               state.gameState === 'complete' ? 'HARMONY ACHIEVED!' :
               state.gameState === 'failed' ? 'RESONANCE BROKEN' : 'AWAKENING...'}
            </span>
          </div>
        </div>

        {/* Sacred Energy */}
        <div className="absolute top-5 right-5 bg-black/80 border border-green-500 backdrop-blur-md p-5 pointer-events-auto min-w-[220px]" role="region" aria-label="Life force status">
          <div className="text-green-400 text-lg mb-4 font-serif">
            ◊ SACRED ENERGY ◊
          </div>
          <div className="mb-2 font-mono">
            <span>LIFE FORCE: </span><span aria-live="polite">{'◆'.repeat(Math.max(0, state.attempts))}</span>
          </div>
          <div className="mb-2 font-mono">
            <span>PERFECT STREAK: </span><span aria-live="polite">{state.perfectStreak}</span>
          </div>
          <div className="font-mono">
            <span>HARMONY: </span>
            <span className={`${
              Math.round((state.attempts / 3) * 100) > 66 ? 'text-green-400' : 
              Math.round((state.attempts / 3) * 100) > 33 ? 'text-yellow-400' : 'text-red-400'
            }`} aria-live="polite">
              {Math.max(0, Math.round((state.attempts / 3) * 100))}%
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setAudioEnabled(prev => !prev)}
          className="absolute bottom-5 left-5 bg-gray-800/80 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 pointer-events-auto"
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H3a1 1 0 01-1-1V9a1 1 0 011-1h2.586l4.707-4.707A1 1 0 0112 3v18a1 1 0 01-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.293 17.293A8 8 0 015.707 5.707m0 0a8 8 0 0111.586 11.586m-11.586 2.828a1 1 0 00-1.707.707L2 15h2.586l4.707 4.707A1 1 0 0012 21v-4m-7-2H3a1 1 0 01-1-1V9a1 1 0 011-1h2.586l4.707-4.707A1 1 0 0112 3v7l-3 3" />
            </svg>
          )}
        </button>

        {/* Game Controls */}
        {state.gameState === 'menu' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-purple-500 p-8 rounded-lg shadow-xl text-center pointer-events-auto">
            <h2 className="text-purple-300 text-3xl font-serif mb-6 animate-pulse">
              CRYSTAL RESONANCE
            </h2>
            <p className="text-white text-lg mb-8 max-w-sm">
              Attune with the ancient crystals. Observe their harmonic patterns and channel their frequencies back to achieve enlightenment.
            </p>
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75"
            >
              BEGIN ATTUNEMENT
            </button>
          </div>
        )}

        {(state.gameState === 'failed' || state.gameState === 'complete') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-purple-500 p-8 rounded-lg shadow-xl text-center pointer-events-auto">
            <h2 className={`text-3xl font-serif mb-4 animate-bounce ${state.gameState === 'complete' ? 'text-green-400' : 'text-red-400'}`}>
              {state.gameState === 'complete' ? 'HARMONY ACHIEVED!' : 'RESONANCE BROKEN!'}
            </h2>
            <p className="text-white text-lg mb-2">
              FINAL SCORE: <span className="font-bold text-xl text-yellow-300">{state.score}</span>
            </p>
            <p className="text-white text-lg mb-6">
              HIGH SCORE: <span className="font-bold text-xl text-neonMint">{state.highScore}</span>
            </p>
            <button
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75"
            >
              ATTUNE AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrystalResonance;