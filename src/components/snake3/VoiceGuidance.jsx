import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

/**
 * VoiceGuidance Component
 * 
 * Provides voice announcements for the Snake³ game using the Web Speech API.
 * Announces direction changes, game events, and warnings.
 */
function VoiceGuidance() {
  // References for speech synthesis
  const synthRef = useRef(null);
  const voiceRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const queueRef = useRef([]);
  
  // Settings
  const settingsRef = useRef({
    enabled: true,
    volume: 0.8,
    rate: 1.0,
    pitch: 1.0
  });
  
  // Get game state from store
  const {
    snake,
    isPaused,
    isGameOver,
    isVictory,
    nodesCollected,
    lastDirection
  } = useGameStore();
  
  // Initialize speech synthesis
  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      // Get available voices
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          // Prefer a female voice if available
          const femaleVoice = voices.find(voice => 
            voice.name.includes('female') || voice.name.includes('Female')
          );
          voiceRef.current = femaleVoice || voices[0];
          
          // Initial announcement
          speak("Welcome to Snake Cubed: The Axis Mind. Use WASD to move in the X-Y plane, and Q-E to move along the Z axis.", true);
        }
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    } else {
      console.warn("Speech synthesis not supported in this browser");
    }
    
    // Cleanup
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Monitor direction changes
  useEffect(() => {
    if (!snake.direction || !lastDirection) return;
    
    // Check if direction has changed
    if (
      snake.direction.x !== lastDirection.x ||
      snake.direction.y !== lastDirection.y ||
      snake.direction.z !== lastDirection.z
    ) {
      announceDirection(snake.direction);
    }
  }, [snake.direction, lastDirection]);
  
  // Monitor game state changes
  useEffect(() => {
    if (isPaused) {
      speak("Game paused.", true);
    } else if (isGameOver) {
      speak("Game over.", true);
    } else if (isVictory) {
      speak("Victory!", true);
    }
  }, [isPaused, isGameOver, isVictory]);
  
  // Monitor data node collection
  useEffect(() => {
    if (nodesCollected > 0) {
      speak(`Data node collected. ${10 - nodesCollected} remaining.`, false);
    }
  }, [nodesCollected]);
  
  // Speak a message
  const speak = (message, priority = false) => {
    if (!settingsRef.current.enabled || !synthRef.current) return;
    
    if (priority) {
      // Cancel current speech for priority messages
      synthRef.current.cancel();
      isSpeakingRef.current = false;
    }
    
    if (isSpeakingRef.current) {
      // Add to queue if already speaking
      queueRef.current.push(message);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    
    utterance.volume = settingsRef.current.volume;
    utterance.rate = settingsRef.current.rate;
    utterance.pitch = settingsRef.current.pitch;
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      
      // Check if there are messages in the queue
      if (queueRef.current.length > 0) {
        const nextMessage = queueRef.current.shift();
        if (nextMessage) {
          speak(nextMessage);
        }
      }
    };
    
    isSpeakingRef.current = true;
    synthRef.current.speak(utterance);
  };
  
  // Announce direction
  const announceDirection = (direction) => {
    let message = "Moving ";
    
    if (direction.x === 1) message += "right";
    else if (direction.x === -1) message += "left";
    else if (direction.y === 1) message += "up";
    else if (direction.y === -1) message += "down";
    else if (direction.z === 1) message += "forward";
    else if (direction.z === -1) message += "backward";
    
    speak(message, false);
  };
  
  // Announce warning
  const announceWarning = (type) => {
    if (type === "boundary") {
      speak("Warning: Approaching boundary", true);
    } else if (type === "self") {
      speak("Warning: Approaching your tail", true);
    }
  };
  
  // Update settings
  const updateSettings = (settings) => {
    settingsRef.current = {
      ...settingsRef.current,
      ...settings
    };
  };
  
  // This component doesn't render anything visible
  return null;
}

export default VoiceGuidance;