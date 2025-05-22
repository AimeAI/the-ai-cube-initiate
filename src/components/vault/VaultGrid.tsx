import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import ModuleTile from './ModuleTile';
import { loadProgress } from '../../vault/vaultProgress';
import { getUnlockableModules } from '../../vault/unlockLogic';
import type { ModuleConfig, VaultData } from '../../vault/unlockLogic';
import useVoiceSynthesis from '../../hooks/useVoiceSynthesis';
import vaultScriptCues from '../../../public/voice/vaultCues.json';

interface VaultGridProps {
  onModuleSelect: (moduleId: string, moduleName: string) => void; // Updated prop
}

// Helper function to get and format cue scripts
const getCueScript = (cueId: string, params?: Record<string, string>): string => {
  const cue = vaultScriptCues.cues.find(c => c.id === cueId);
  if (!cue) {
    console.warn(`TTS Script cue not found for ID: ${cueId}`);
    return ""; // Return empty string or a default error message
  }
  let script = cue.script;
  if (params) {
    for (const key in params) {
      script = script.replace(new RegExp(`{${key}}`, 'g'), params[key]);
    }
  }
  return script;
};


const VaultGrid: React.FC<VaultGridProps> = ({ onModuleSelect }) => {
  const [allModulesConfig, setAllModulesConfig] = useState<ModuleConfig[]>([]);
  const [playerProgress, setPlayerProgress] = useState<VaultData>({});
  const [moduleUnlockStates, setModuleUnlockStates] = useState<Record<string, boolean>>({});
  const prevModuleUnlockStatesRef = useRef<Record<string, boolean>>({}); // For tracking changes
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { speak, supported: voiceSupported, voices, selectedVoice, setSelectedVoice } = useVoiceSynthesis();
  const welcomePlayedRef = useRef(false); // To ensure welcome message plays only once

  // Effect for initial voice selection
  useEffect(() => {
    if (voiceSupported && voices.length > 0 && !selectedVoice) {
      const enVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (enVoice) {
        setSelectedVoice(enVoice.voiceURI);
        console.log('Default Vault voice set to:', enVoice.name);
      }
    }
  }, [voiceSupported, voices, selectedVoice, setSelectedVoice]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      prevModuleUnlockStatesRef.current = moduleUnlockStates; // Store current before fetching new
      try {
        // Fetch module configurations
        const response = await fetch('/data/modules.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch modules.json: ${response.statusText}`);
        }
        const modulesData: ModuleConfig[] = await response.json();
        setAllModulesConfig(modulesData);

        // Load player progress
        const progressData = loadProgress();
        setPlayerProgress(progressData);

        // Determine unlock statuses
        if (modulesData.length > 0) {
          const currentUnlockStates = getUnlockableModules(modulesData, progressData);
          setModuleUnlockStates(currentUnlockStates);

          // Play welcome message only once after initial data load and voice support check
          if (voiceSupported && !welcomePlayedRef.current && Object.keys(currentUnlockStates).length > 0) {
            const welcomeScript = getCueScript('vaultWelcome');
            if (welcomeScript) {
              speak(welcomeScript);
              welcomePlayedRef.current = true;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching vault data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    // Only run on mount, or if specific dependencies for re-fetching are added.
    // For now, moduleUnlockStates is handled in a separate effect.
  }, []); 

  // Effect for module unlocked announcements
  useEffect(() => {
    if (!voiceSupported || isLoading || Object.keys(prevModuleUnlockStatesRef.current).length === 0) {
      // Don't run on initial load if previous states are empty or still loading, or if voice not supported
      prevModuleUnlockStatesRef.current = moduleUnlockStates; // Sync ref if we bail early
      return;
    }

    for (const moduleId in moduleUnlockStates) {
      const currentStatus = moduleUnlockStates[moduleId];
      const prevStatus = prevModuleUnlockStatesRef.current[moduleId];

      if (currentStatus === true && prevStatus === false) {
        // Module transitioned from locked to unlocked
        const moduleConfig = allModulesConfig.find(m => m.id === moduleId);
        if (moduleConfig) {
          const script = getCueScript('moduleUnlocked', { moduleName: moduleConfig.name });
          if (script) {
            console.log(`Announcing unlock for: ${moduleConfig.name}`);
            speak(script);
          }
        }
      }
    }
    // Update previous states ref for the next render
    prevModuleUnlockStatesRef.current = moduleUnlockStates;
  }, [moduleUnlockStates, allModulesConfig, voiceSupported, speak, isLoading]);


  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-2xl text-cyan-400 animate-pulse">Loading Vault Modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-2xl text-red-500">Error loading modules: {error}</p>
        <p className="text-gray-400 mt-2">Please ensure 'public/data/modules.json' is accessible and correctly formatted.</p>
      </div>
    );
  }

  if (allModulesConfig.length === 0) {
    return <div className="text-center p-10 text-xl text-gray-500">No modules available.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-900 min-h-screen">
      <h1 
        className="text-4xl md:text-5xl font-extrabold text-center mb-8 md:mb-12 text-cyan-300"
        style={{ textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }} // Cyan glow
      >
        Project Chimera - Module Vault
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {allModulesConfig.map((moduleConfig) => {
          const isUnlocked = moduleUnlockStates[moduleConfig.id] || false;
          const progress = playerProgress[moduleConfig.id];
          return (
            <ModuleTile
              key={moduleConfig.id}
              moduleConfig={moduleConfig}
              isUnlocked={isUnlocked}
              progress={progress}
              onClick={() => {
                if (isUnlocked) {
                  onModuleSelect(moduleConfig.id, moduleConfig.name); // Pass name too
                } else {
                  // Voice feedback for locked attempt will be handled in ModuleTile
                }
              }}
              // Pass down speak and getCueScript for moduleLockAttempt
              speak={speak}
              getCueScript={getCueScript}
              voiceSupported={voiceSupported}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VaultGrid;
