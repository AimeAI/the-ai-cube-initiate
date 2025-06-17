import React, { useCallback, useEffect, useRef } from 'react';

type GameState = 'playing' | 'gameover' | 'victory' | 'paused' | 'start';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'FORWARD' | 'BACKWARD' | null; // Export Direction
type GameAction = 'collect' | 'near-collision' | null;

interface VoiceGuidanceProps {
  gameState?: GameState;
  direction?: Direction;
  action?: GameAction;
  announce?: string; // For direct announcements
}

const VoiceGuidance: React.FC<VoiceGuidanceProps> = ({ gameState, direction, action, announce }) => {
  const synth = window.speechSynthesis;
  const lastGameState = useRef<GameState | undefined>();
  const lastDirection = useRef<Direction | undefined>();
  const lastAction = useRef<GameAction | undefined>();

  const speak = useCallback((text: string) => {
    if (synth.speaking) {
      // console.warn('Speech synthesis is already speaking. Queueing or skipping.');
      // Optionally, queue messages or cancel previous ones
      synth.cancel(); // Simple approach: cancel previous and speak new
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    // utterance.pitch = 1;
    // utterance.rate = 1;
    synth.speak(utterance);
  }, [synth]);

  useEffect(() => {
    if (announce) {
      speak(announce);
    }
  }, [announce, speak]);

  useEffect(() => {
    if (gameState && gameState !== lastGameState.current) {
      let message = '';
      switch (gameState) {
        case 'start':
          message = 'Game start.';
          break;
        case 'playing':
          // message = 'Playing.'; // Can be too noisy
          break;
        case 'gameover':
          message = 'Game over.';
          break;
        case 'victory':
          message = 'Victory achieved!';
          break;
        case 'paused':
          message = 'Game paused.';
          break;
      }
      if (message) speak(message);
      lastGameState.current = gameState;
    }
  }, [gameState, speak]);

  useEffect(() => {
    if (direction && direction !== lastDirection.current) {
      // Speak direction only if game is actively playing
      if (lastGameState.current === 'playing') {
         speak(`Moving ${direction.toLowerCase()}`);
      }
      lastDirection.current = direction;
    }
  }, [direction, speak]);

  useEffect(() => {
    if (action && action !== lastAction.current) {
      let message = '';
      switch (action) {
        case 'collect':
          message = 'Data node collected.';
          break;
        case 'near-collision':
          message = 'Warning: Obstacle ahead.'; // Placeholder
          break;
      }
      if (message) speak(message);
      lastAction.current = action;
      // Reset action after announcing to prevent re-announcement on re-render
      // This might need a more robust solution depending on how actions are triggered.
    }
  }, [action, speak]);

  return null; // This component does not render anything visible
};

export default VoiceGuidance;