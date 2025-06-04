import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import * as Tone from 'tone';

// --- Game State Types ---
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
  | { type: 'WRONG_CLICK'; crystalId: string }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_HIGH_SCORE'; newScore?: number }
  | { type: 'GAME_OVER' };

// --- Constants for Game Logic ---
const INITIAL_ATTEMPTS = 3;
const SCORE_PER_LEVEL = 100;
const BASE_PATTERN_LENGTH = 3;
const LEVEL_PATTERN_INCREASE_INTERVAL = 2;
const MAX_PATTERN_LENGTH = 8;
const BASE_SHOW_SPEED_MS = 1500;
const MIN_SHOW_SPEED_MS = 600;
const SPEED_DECREASE_PER_LEVEL = 50;
const LEVEL_COMPLETE_DELAY_MS = 2000;
const WRONG_CLICK_FEEDBACK_DELAY_MS = 1500;
const INITIAL_PATTERN_SHOW_DELAY_MS = 500;
const CRYSTAL_SHOW_GAP_MS = 100;
const POST_PATTERN_SHOW_DELAY_MS = 500; // Delay after pattern fully shown before input is unlocked

// --- High Score Persistence ---
const getInitialHighScore = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedHighScore = localStorage.getItem('crystalResonanceHighScore');
    return storedHighScore ? parseInt(storedHighScore, 10) : 0;
  }
  return 0;
};

// --- Initial Game State ---
const initialState: GameReducerState = {
  gameState: 'menu',
  level: 1,
  score: 0,
  highScore: getInitialHighScore(),
  attempts: INITIAL_ATTEMPTS,
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

// --- Game Reducer Function ---
function gameReducer(state: GameReducerState, action: GameAction): GameReducerState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameState: 'showing',
        level: 1,
        score: 0,
        attempts: INITIAL_ATTEMPTS,
        totalPatterns: 0,
        perfectStreak: 0,
        playerSequence: [],
        activeCrystals: new Set(),
        resonatingCrystals: new Set(),
        errorCrystals: new Set(),
        showPattern: true,
        inputLocked: true,
        currentShowingIndex: -1,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        highScore: getInitialHighScore(),
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
        playerSequence: [],
      };

    case 'SHOW_CRYSTAL':
      return {
        ...state,
        resonatingCrystals: action.crystalId ? new Set([action.crystalId]) : new Set(),
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
      const newPlayerSequence = [...state.playerSequence, action.crystalId];
      const expectedCrystalId = state.pattern[newPlayerSequence.length - 1];
      const isCorrect = expectedCrystalId === action.crystalId;

      if (isCorrect) {
        return {
          ...state,
          playerSequence: newPlayerSequence,
          activeCrystals: new Set([...state.activeCrystals, action.crystalId]),
          resonatingCrystals: new Set([action.crystalId]),
        };
      } else {
        return {
          ...state,
          playerSequence: newPlayerSequence,
          errorCrystals: new Set([action.crystalId]),
          inputLocked: true,
          perfectStreak: 0,
        };
      }

    case 'WRONG_CLICK':
      const remainingAttempts = state.attempts - 1;
      return {
        ...state,
        attempts: remainingAttempts,
        gameState: remainingAttempts <= 0 ? 'failed' : state.gameState,
      };

    case 'LEVEL_COMPLETE':
      const calculatedScore = state.score + state.level * SCORE_PER_LEVEL;
      return {
        ...state,
        gameState: 'complete',
        score: calculatedScore,
        level: state.level + 1,
        totalPatterns: state.totalPatterns + 1,
        perfectStreak: state.perfectStreak + 1,
        playerSequence: [],
        activeCrystals: new Set(),
        resonatingCrystals: new Set(),
        errorCrystals: new Set(),
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
      const finalScore = action.newScore !== undefined ? action.newScore : state.score;
      if (finalScore > state.highScore) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('crystalResonanceHighScore', finalScore.toString());
        }
        return {
          ...state,
          highScore: finalScore,
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

// --- Audio Synthesis Setup (Removed) ---
// const initAudio = async () => { ... };

// --- React Component: CrystalResonance ---
const CrystalResonance: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // const [audioEnabled, setAudioEnabled] = useState(true); // Removed

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const patternTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const audioRef = useRef<{ synth: Tone.PolySynth; errorSynth: Tone.Synth; winningSynth: Tone.PolySynth } | null>(null); // Removed

  const crystalPositions: Crystal[] = [
    { x: 50, y: 50, z: 0, id: 'SOUL', color: '#8b5cf6', frequency: 528 },
    { x: 25, y: 20, z: -20, id: 'FIRE', color: '#ef4444', frequency: 639 },
    { x: 75, y: 20, z: -20, id: 'AIR', color: '#06b6d4', frequency: 741 },
    { x: 75, y: 80, z: -20, id: 'EARTH', color: '#22c55e', frequency: 417 },
    { x: 25, y: 80, z: -20, id: 'WATER', color: '#3b82f6', frequency: 396 },
    { x: 15, y: 10, z: -40, id: 'AMOR', color: '#ec4899', frequency: 963 },
    { x: 85, y: 10, z: -40, id: 'LUMI', color: '#f59e0b', frequency: 852 },
    { x: 95, y: 50, z: -40, id: 'VITA', color: '#10b981', frequency: 693 },
    { x: 85, y: 90, z: -40, id: 'FLUX', color: '#8b5cf6', frequency: 174 },
    { x: 15, y: 90, z: -40, id: 'VOID', color: '#6b7280', frequency: 285 },
    { x: 5, y: 50, z: -40, id: 'TIME', color: '#a855f7', frequency: 432 },
  ];

  const playCrystalSound = useCallback((_crystal: Crystal, _isError: boolean = false) => {
    // if (!audioEnabled || !audioRef.current) return; // Removed
    // if (isError) { // Removed
    //   audioRef.current.errorSynth.triggerAttackRelease('C2', '0.2'); // Removed
    // } else { // Removed
    //   const note = Tone.Frequency(crystal.frequency, 'hz').toNote(); // Removed
    //   audioRef.current.synth.triggerAttackRelease(note, '0.5'); // Removed
    // } // Removed
  }, []); // Removed audioEnabled

  const playEnlightenmentSound = useCallback(() => {
    // if (!audioEnabled || !audioRef.current?.winningSynth) return; // Removed
    // const notes = ['A4', 'C#5', 'E5', 'G#5', 'C6']; // Removed
    // audioRef.current.winningSynth.triggerAttackRelease(notes, '4n', Tone.now()); // Removed
    // audioRef.current.winningSynth.triggerAttackRelease('A6', '8n', Tone.now() + Tone.Time('4n').toSeconds() + 0.1); // Removed
  }, []); // Removed audioEnabled

  const generateNewPattern = useCallback((level: number) => {
    const availableCrystals = crystalPositions.map(c => c.id);
    const patternLength = Math.min(BASE_PATTERN_LENGTH + Math.floor(level / LEVEL_PATTERN_INCREASE_INTERVAL), MAX_PATTERN_LENGTH);
    const newPattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      const randomCrystal = availableCrystals[Math.floor(Math.random() * availableCrystals.length)];
      newPattern.push(randomCrystal);
    }
    return newPattern;
  }, []);

  // showPatternSequence now accepts the pattern directly
  const showPatternSequence = useCallback((patternToShow: string[]) => {
    if (patternTimeoutRef.current) {
      clearTimeout(patternTimeoutRef.current);
      patternTimeoutRef.current = null;
    }

    dispatch({ type: 'START_SHOWING' });

    const speedMs = Math.max(MIN_SHOW_SPEED_MS, BASE_SHOW_SPEED_MS - state.level * SPEED_DECREASE_PER_LEVEL);
    let index = 0;

    const showNext = () => {
      dispatch({ type: 'SHOW_CRYSTAL', crystalId: '', index: -1 }); // Clear previous

      if (index >= patternToShow.length) { // Use patternToShow here
        patternTimeoutRef.current = setTimeout(() => {
          dispatch({ type: 'END_SHOWING' });
        }, POST_PATTERN_SHOW_DELAY_MS);
        return;
      }

      const crystalId = patternToShow[index]; // Use patternToShow here
      const crystal = crystalPositions.find(c => c.id === crystalId);

      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SHOW_CRYSTAL', crystalId, index });
        if (crystal) {
          // playCrystalSound(crystal); // Removed
        }

        index++;
        patternTimeoutRef.current = setTimeout(showNext, speedMs);
      }, CRYSTAL_SHOW_GAP_MS);
    };

    patternTimeoutRef.current = setTimeout(showNext, INITIAL_PATTERN_SHOW_DELAY_MS);
  }, [state.level, playCrystalSound, dispatch]); // Removed state.pattern from dependencies

  const handleCrystalClick = useCallback((crystalId: string) => {
    if (state.inputLocked || state.gameState !== 'waiting') return;

    const crystal = crystalPositions.find(c => c.id === crystalId);
    if (!crystal) return;

    dispatch({ type: 'PLAYER_CLICK', crystalId });

    // Anticipate correctness for immediate sound feedback // Removed
    // const anticipatedIsCorrect = state.pattern[state.playerSequence.length] === crystalId; // Removed
    // playCrystalSound(crystal, !anticipatedIsCorrect); // Removed

  }, [state.inputLocked, state.gameState, state.pattern, state.playerSequence.length, playCrystalSound, dispatch]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // This effect should only run when the game is in 'waiting' state
    // and a player action (or error state change) needs processing.
    if (state.gameState !== 'waiting') {
      return;
    }

    // Case 1: Player made a wrong click (errorCrystals is set by PLAYER_CLICK in reducer)
    if (state.errorCrystals.size > 0 && state.inputLocked) {
      console.log("useEffect: Handling wrong click consequence.");
      // Dispatch WRONG_CLICK if not already in failed state
      if (state.attempts > 0) { // Check attempts before dispatching WRONG_CLICK
         dispatch({ type: 'WRONG_CLICK', crystalId: Array.from(state.errorCrystals)[0] });
      }

      timeoutRef.current = setTimeout(() => {
        // After WRONG_CLICK has processed, check the *current* state.
        if (state.gameState === 'failed') {
          console.log("useEffect: Game Over. Updating high score.");
          dispatch({ type: 'UPDATE_HIGH_SCORE', newScore: state.score });
        } else {
          console.log("useEffect: Attempts remain. Clearing error and showing pattern again.");
          dispatch({ type: 'CLEAR_ERROR' });
          timeoutRef.current = setTimeout(() => {
            showPatternSequence(state.pattern); // Pass current pattern
          }, INITIAL_PATTERN_SHOW_DELAY_MS);
        }
      }, WRONG_CLICK_FEEDBACK_DELAY_MS);
      return; // Exit after scheduling error handling
    }

    // Case 2: Player made a correct click and pattern is not yet complete
    if (state.playerSequence.length > 0 && state.errorCrystals.size === 0 && !state.inputLocked) {
      const lastClickedId = state.playerSequence[state.playerSequence.length - 1];
      const expectedId = state.pattern[state.playerSequence.length - 1];

      if (lastClickedId === expectedId) {
        if (state.playerSequence.length === state.pattern.length) {
          console.log("useEffect: Level Complete!");
          dispatch({ type: 'LEVEL_COMPLETE' });
          // playEnlightenmentSound(); // Removed

          timeoutRef.current = setTimeout(() => {
            const nextLevelPattern = generateNewPattern(state.level); // state.level is already updated by LEVEL_COMPLETE
            dispatch({ type: 'SET_PATTERN', pattern: nextLevelPattern });
            timeoutRef.current = setTimeout(() => {
              showPatternSequence(nextLevelPattern); // Pass the new pattern
            }, INITIAL_PATTERN_SHOW_DELAY_MS);
          }, LEVEL_COMPLETE_DELAY_MS);
        } else {
          // Correct click, but pattern incomplete. Clear temporary resonance.
          timeoutRef.current = setTimeout(() => {
            dispatch({ type: 'SHOW_CRYSTAL', crystalId: '', index: -1 });
          }, 200);
        }
      }
    }
  }, [
    state.playerSequence.length,
    state.errorCrystals.size,
    state.gameState,
    state.inputLocked,
    state.attempts,
    state.pattern, // Keep pattern here as it's used for comparison
    state.level,
    state.score,
    generateNewPattern,
    showPatternSequence,
    playEnlightenmentSound,
    dispatch
  ]);


  const startGame = useCallback(async () => {
    // if (audioEnabled && !audioRef.current) { // Removed
    //   try { // Removed
    //     audioRef.current = await initAudio(); // Removed
    //   } catch (error) { // Removed
    //     console.error("Failed to initialize audio on game start:", error); // Removed
    //     setAudioEnabled(false); // Removed
    //   } // Removed
    // } // Removed

    dispatch({ type: 'START_GAME' });
    const newPattern = generateNewPattern(1);
    dispatch({ type: 'SET_PATTERN', pattern: newPattern });

    // Pass the newPattern directly to showPatternSequence
    setTimeout(() => {
      showPatternSequence(newPattern);
    }, 100);
  }, [generateNewPattern, showPatternSequence, dispatch]); // Removed audioEnabled

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  useEffect(() => {
    if (state.gameState === 'menu') {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
          event.preventDefault();
          startGame();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [state.gameState, startGame]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current);
      // if (audioRef.current) { // Removed
      //   audioRef.current.synth.dispose(); // Removed
      //   audioRef.current.errorSynth.dispose(); // Removed
      //   audioRef.current.winningSynth.dispose(); // Removed
      // } // Removed
    };
  }, []);

  const getCrystalClassName = (crystalId: string) => {
    let className = 'sacred-crystal';
    if (state.activeCrystals.has(crystalId)) className += ' active';
    if (state.resonatingCrystals.has(crystalId)) className += ' resonating';
    if (state.errorCrystals.has(crystalId)) className += ' error';
    return className;
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
          z-index: 10;
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
          z-index: 0;
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
          z-index: 5;
        }
      `}</style>

      {/* Sacred Grid Background */}
      <div className="sacred-grid" role="presentation"></div>

      {/* Mystical Aura */}
      <div className="mystical-aura" role="presentation"></div>

      {/* Sacred Geometry (Decorative Circles) */}
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

      {/* Energy Fields (Animated vertical lines) */}
      <div className="energy-field" style={{ left: '15%', animationDelay: '0s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '30%', animationDelay: '1s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '70%', animationDelay: '2s' }} role="presentation"></div>
      <div className="energy-field" style={{ left: '85%', animationDelay: '0.5s' }} role="presentation"></div>

      {/* Crystal Array (Interactive Game Elements) */}
      <div className="crystal-container pointer-events-auto" role="main" aria-label="Crystal game board">
        {crystalPositions.map((crystal, index) => (
          <button
            key={`${index}-${crystal.id}`}
            className={`${getCrystalClassName(crystal.id)} pointer-events-auto`}
            style={{
              left: `${crystal.x}%`,
              top: `${crystal.y}%`,
              transform: `translate(-50%, -50%) translateZ(${crystal.z}px)`,
              backgroundColor: crystal.color,
              color: crystal.color,
            }}
            onClick={() => handleCrystalClick(crystal.id)}
            aria-label={`Crystal ${crystal.id}, ${state.activeCrystals.has(crystal.id) ? 'activated' : 'inactive'}`}
            disabled={state.inputLocked}
          >
            {crystal.id}
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
      </div>

      {/* Sacred HUD (Heads-Up Display for Game Info) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Crystal Resonance Status Panel */}
        <div className="absolute top-5 right-5 bg-black/80 border border-purple-500 backdrop-blur-md p-5 rounded-lg pointer-events-auto min-w-[280px]" role="region" aria-label="Game status">
          <div className="text-purple-400 text-lg mb-4 font-serif">
            ◊ CRYSTAL RESONANCE ◊
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            <span>HARMONIC LEVEL: </span><span aria-live="polite">{state.level.toString().padStart(2, '0')}</span>
          </div>
          <div className="mb-2 font-mono">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></span>
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

        {/* Sacred Energy Panel */}
        <div className="absolute bottom-5 right-5 bg-black/80 border border-green-500 backdrop-blur-md p-5 rounded-lg pointer-events-auto min-w-[220px]" role="region" aria-label="Life force status">
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
              Math.round((state.attempts / INITIAL_ATTEMPTS) * 100) > 66 ? 'text-green-400' :
              Math.round((state.attempts / INITIAL_ATTEMPTS) * 100) > 33 ? 'text-yellow-400' : 'text-red-400'
            }`} aria-live="polite">
              {Math.max(0, Math.round((state.attempts / INITIAL_ATTEMPTS) * 100))}%
            </span>
          </div>
        </div>

        {/* Audio Toggle Button (Removed) */}
        {/* <button ... /> */}

        {/* Game Menu / Game Over Screens */}
        {state.gameState === 'menu' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-purple-500 p-8 rounded-lg shadow-xl text-center pointer-events-auto">
            <h2 className="text-purple-300 text-3xl font-serif mb-6 animate-pulse">
              CRYSTAL RESONANCE
            </h2>
            <p className="text-white text-lg mb-8 max-w-sm">
              Attune with the ancient crystals. Observe their harmonic patterns and channel their frequencies back to achieve enlightenment.
            </p>
            <p className="text-yellow-400 text-md mb-6 animate-pulse">
              Press Spacebar to Start
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
              HIGH SCORE: <span className="font-bold text-xl text-green-400">{state.highScore}</span>
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