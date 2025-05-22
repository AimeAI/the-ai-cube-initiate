import { useState, useEffect, useCallback } from 'react';

interface UseVoiceSynthesisReturn {
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
  isSpeaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  setSelectedVoice: (voiceURI: string) => void;
  selectedVoice: SpeechSynthesisVoice | null;
}

const useVoiceSynthesis = (): UseVoiceSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      const synth = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          // Default to the first available voice or a preferred one
           const defaultVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
          setSelectedVoiceState(defaultVoice);
        }
      };

      loadVoices();
      // Voices might not be loaded immediately, so listen for the event
      synth.onvoiceschanged = loadVoices;

      // Cleanup function
      return () => {
        synth.cancel(); // Cancel any ongoing speech when the component unmounts
        synth.onvoiceschanged = null;
      };
    } else {
      setSupported(false);
      console.warn('Speech synthesis not supported by this browser.');
    }
  }, [selectedVoice]); // Re-run if selectedVoice changes to ensure it's valid

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!supported || !selectedVoice) {
      console.error('Speech synthesis not supported or no voice selected.');
      onEnd?.(); // Call onEnd even if speech fails, to not block subsequent logic
      return;
    }

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      // Optionally, cancel current speech before starting new one
      // console.log('Cancelling current speech to speak new text.');
      // synth.cancel(); 
      // setIsSpeaking(false); // This might be too quick, rely on onend
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setIsSpeaking(false);
      onEnd?.(); // Ensure callback is called on error too
    };
    
    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [supported, selectedVoice]);

  const cancel = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
  }, [supported]);

  const setSelectedVoice = useCallback((voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoiceState(voice);
    } else {
      console.warn(`Voice with URI "${voiceURI}" not found.`);
    }
  }, [voices]);


  return { speak, cancel, isSpeaking, supported, voices, selectedVoice, setSelectedVoice };
};

export default useVoiceSynthesis;
