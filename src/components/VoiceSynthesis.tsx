
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface VoiceSynthesisProps {
  text: string;
  autoSpeak?: boolean;
  delay?: number;
}

const VoiceSynthesis = ({ text, autoSpeak = false, delay = 0 }: VoiceSynthesisProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const speak = () => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast.error("Your browser doesn't support speech synthesis.");
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set properties for a mysterious AI voice
    utterance.rate = 0.9;  // Slightly slower
    utterance.pitch = 0.8; // Lower pitch for more AI-like feeling
    utterance.volume = 0.8;
    
    // Get available voices and select a good one if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      voice.name.includes('Google UK English Male') || 
      voice.name.includes('Microsoft David')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error("Speech synthesis error occurred");
    };
    
    // Speak
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };
  
  // If voices aren't loaded yet, wait for them
  useEffect(() => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.onvoiceschanged = () => {
      // Voices are now loaded
    };
    
    // Auto speak with delay if enabled
    if (autoSpeak) {
      const timer = setTimeout(() => {
        speak();
      }, delay);
      
      return () => {
        clearTimeout(timer);
        if (isPlaying && utteranceRef.current) {
          window.speechSynthesis.cancel();
        }
      };
    }
    
    return () => {
      if (isPlaying && utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [autoSpeak, delay]);

  return (
    <button 
      onClick={speak}
      disabled={isPlaying}
      className="flex items-center space-x-2 text-cube-blue text-sm border border-cube-blue/30 px-3 py-1 bg-black/80 hover:bg-cube-blue/10 transition-colors duration-300"
    >
      <span>{isPlaying ? "Listening..." : "Listen"}</span>
      <span className={isPlaying ? "animate-pulse" : ""}>
        ◉
      </span>
    </button>
  );
};

export default VoiceSynthesis;
