import React, { useState } from 'react';
import type { ModuleConfig, ModuleProgress } from '../../vault/unlockLogic';
import { Lock, Info, BarChart2 } from 'lucide-react'; // ShieldCheck not used

interface ModuleTileProps {
  moduleConfig: ModuleConfig;
  isUnlocked: boolean;
  progress?: ModuleProgress;
  onClick: () => void;
  // Props for voice feedback
  speak?: (text: string, onEnd?: () => void) => void;
  getCueScript?: (cueId: string, params?: Record<string, string>) => string;
  voiceSupported?: boolean;
}

const ModuleTile: React.FC<ModuleTileProps> = ({ 
  moduleConfig, 
  isUnlocked, 
  progress, 
  onClick,
  speak,
  getCueScript,
  voiceSupported
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tileBaseClasses = "p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer min-h-[180px] flex flex-col justify-between items-center text-center relative"; // Added relative for tooltip positioning
  
  const lockedClasses = "bg-gray-800 border-2 border-red-700 text-gray-500 opacity-70 hover:opacity-90 focus-within:opacity-90";
  const unlockedClasses = "bg-gray-700 border-2 border-cyan-500 text-white hover:shadow-cyan-500/50 hover:shadow-lg focus-within:shadow-cyan-500/50 focus-within:shadow-lg";

  // const iconSize = 36; // Not explicitly used with new icon placement

  const handleTileClick = () => {
    if (isUnlocked) {
      onClick();
    } else {
      console.log(`Module "${moduleConfig.name}" is locked. Attempting to play lock attempt sound.`);
      if (voiceSupported && speak && getCueScript) {
        const script = getCueScript('moduleLockAttempt', { moduleName: moduleConfig.name });
        if (script) {
          speak(script);
        }
      }
    }
  };

  return (
    <div
      className={`${tileBaseClasses} ${isUnlocked ? unlockedClasses : lockedClasses}`}
      onClick={handleTileClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTileClick();}} // Accessibility for keyboard
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0} // Make it focusable
      role="button"
      aria-pressed={isUnlocked ? "false" : undefined}
      aria-label={`${moduleConfig.name} - ${isUnlocked ? 'Unlocked' : 'Locked'}`}
    >
      <div className="flex flex-col items-center w-full"> {/* Ensure content takes full width for centering icon */}
        <div className="text-4xl mb-2" role="img" aria-label={`${moduleConfig.name} icon`}>{moduleConfig.icon}</div>
        <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-cyan-300' : 'text-red-400'}`}>
          {moduleConfig.name}
        </h3>
        {!isUnlocked && <Lock size={20} className="text-red-500 mb-1 absolute top-2 right-2" />}
        {isUnlocked && progress && (
          <p className="text-xs text-green-400">Best: {progress.bestScore}%</p>
        )}
      </div>

      {/* Tooltip: improved positioning and consistent width */}
      {showTooltip && (
        <div 
          className="absolute z-10 p-3 text-xs text-left text-white bg-gray-900 border border-gray-600 rounded-md shadow-xl
                     w-64 bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-100 transition-opacity duration-200"
          style={{ backdropFilter: 'blur(5px)' }}
          role="tooltip"
        >
          {isUnlocked ? (
            <>
              <p className="font-semibold text-cyan-400 mb-1 flex items-center"><Info size={14} className="mr-1"/>Description:</p>
              <p className="text-gray-300 mb-2 text-xs">{moduleConfig.description}</p>
              {progress && (
                <>
                  <p className="font-semibold text-green-400 mb-1 flex items-center"><BarChart2 size={14} className="mr-1"/>Progress:</p>
                  <p className="text-gray-300 text-xs">Last Score: {progress.score}%</p>
                  <p className="text-gray-300 text-xs">Attempts: {progress.attempts}</p>
                  <p className="text-gray-300 text-xs">Status: {progress.completed ? "Completed" : "Incomplete"}</p>
                </>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-red-400 mb-1 flex items-center"><Lock size={14} className="mr-1"/>Phase Clearance Required</p>
              {moduleConfig.unlocksRequired && moduleConfig.unlocksRequired.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-400">Prerequisites:</p>
                  <ul className="list-disc list-inside text-xs text-gray-500">
                    {moduleConfig.unlocksRequired.map(reqId => <li key={reqId}>{reqId.replace(/([A-Z])/g, ' $1').trim()}</li>)}
                    {moduleConfig.minScoreToUnlock && <li>Min. Score on Prereqs: {moduleConfig.minScoreToUnlock}%</li>}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {!isUnlocked && (
         <p className="text-xs text-red-300 italic mt-auto">"Pattern Locked"</p>
      )}
       {isUnlocked && (
         <p className="text-xs text-green-300 italic mt-auto">"System Online"</p>
      )}
    </div>
  );
};

export default ModuleTile;
