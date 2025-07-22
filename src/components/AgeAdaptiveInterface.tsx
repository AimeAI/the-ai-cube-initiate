import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, Settings, Pause, Play } from 'lucide-react';

interface AgeAdaptiveInterfaceProps {
  childAge: number;
  gameId: string;
  onAgeChange?: (age: number) => void;
  children: React.ReactNode;
}

interface InterfaceConfig {
  fontSize: string;
  buttonSize: string;
  spacing: string;
  complexity: 'simple' | 'medium' | 'advanced';
  showAdvancedControls: boolean;
  voiceInstructions: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  colorContrast: 'high' | 'normal';
}

const AgeAdaptiveInterface: React.FC<AgeAdaptiveInterfaceProps> = ({
  childAge,
  gameId,
  onAgeChange,
  children
}) => {
  const [config, setConfig] = useState<InterfaceConfig>({
    fontSize: 'text-base',
    buttonSize: 'p-3',
    spacing: 'gap-4',
    complexity: 'medium',
    showAdvancedControls: false,
    voiceInstructions: false,
    animationSpeed: 'normal',
    colorContrast: 'normal'
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Adapt interface based on age
  useEffect(() => {
    let newConfig: InterfaceConfig;

    if (childAge <= 8) {
      // Young children (6-8): Large, simple, colorful
      newConfig = {
        fontSize: 'text-xl',
        buttonSize: 'p-4 text-lg',
        spacing: 'gap-6',
        complexity: 'simple',
        showAdvancedControls: false,
        voiceInstructions: true,
        animationSpeed: 'slow',
        colorContrast: 'high'
      };
    } else if (childAge <= 12) {
      // Middle children (9-12): Balanced complexity
      newConfig = {
        fontSize: 'text-lg',
        buttonSize: 'p-3',
        spacing: 'gap-4',
        complexity: 'medium',
        showAdvancedControls: true,
        voiceInstructions: false,
        animationSpeed: 'normal',
        colorContrast: 'normal'
      };
    } else {
      // Teens (13+): Full complexity, smaller UI
      newConfig = {
        fontSize: 'text-base',
        buttonSize: 'p-2',
        spacing: 'gap-3',
        complexity: 'advanced',
        showAdvancedControls: true,
        voiceInstructions: false,
        animationSpeed: 'fast',
        colorContrast: 'normal'
      };
    }

    setConfig(newConfig);
  }, [childAge]);

  // Voice instruction system for young children
  const speakInstruction = (text: string) => {
    if (config.voiceInstructions && soundEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for children
      utterance.pitch = 1.2; // Higher pitch for friendliness
      speechSynthesis.speak(utterance);
    }
  };

  // Age-appropriate control panel
  const ControlPanel = () => (
    <div className={`fixed top-4 right-4 z-30 flex ${config.spacing}`}>
      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`${config.buttonSize} bg-myth-surface/80 backdrop-blur-md rounded-lg text-myth-textPrimary hover:bg-myth-surface transition-all duration-200 ${
          config.colorContrast === 'high' ? 'border-2 border-electricCyan' : ''
        }`}
        title={soundEnabled ? 'Turn off sound' : 'Turn on sound'}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Pause/Play for young children */}
      {childAge <= 10 && (
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`${config.buttonSize} bg-myth-surface/80 backdrop-blur-md rounded-lg text-myth-textPrimary hover:bg-myth-surface transition-all duration-200 ${
            config.colorContrast === 'high' ? 'border-2 border-neonMint' : ''
          }`}
          title={isPaused ? 'Continue game' : 'Pause game'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      )}

      {/* Help button */}
      <button
        onClick={() => speakInstruction('Click the help button if you need assistance!')}
        className={`${config.buttonSize} bg-myth-accent/80 backdrop-blur-md rounded-lg text-myth-background hover:bg-myth-accent transition-all duration-200 ${
          config.colorContrast === 'high' ? 'border-2 border-yellow-400' : ''
        }`}
        title="Get help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Settings (for older children) */}
      {config.showAdvancedControls && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`${config.buttonSize} bg-myth-surface/80 backdrop-blur-md rounded-lg text-myth-textPrimary hover:bg-myth-surface transition-all duration-200`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  // Age-appropriate instructions overlay
  const InstructionsOverlay = () => {
    if (childAge <= 8) {
      return (
        <div className="fixed bottom-4 left-4 right-4 z-30">
          <div className="bg-myth-surface/90 backdrop-blur-md rounded-xl p-4 border-2 border-electricCyan">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-electricCyan rounded-full flex items-center justify-center animate-bounce">
                <span className="text-obsidianBlack font-bold">!</span>
              </div>
              <p className={`${config.fontSize} text-myth-textPrimary font-semibold`}>
                Use arrow keys to move! Collect the glowing balls! 🎯
              </p>
            </div>
          </div>
        </div>
      );
    } else if (childAge <= 12) {
      return (
        <div className="fixed bottom-4 left-4 z-30">
          <div className="bg-myth-surface/80 backdrop-blur-md rounded-lg p-3">
            <p className={`${config.fontSize} text-myth-textSecondary`}>
              Arrow keys to move • Space for auto-aim
            </p>
          </div>
        </div>
      );
    }
    return null; // Teens don't need constant instructions
  };

  // Settings panel for older children
  const SettingsPanel = () => {
    if (!showSettings || !config.showAdvancedControls) return null;

    return (
      <div className="fixed top-16 right-4 z-40 bg-myth-surface/95 backdrop-blur-md rounded-xl p-4 border border-myth-accent/30 min-w-48">
        <h3 className="text-myth-textPrimary font-semibold mb-3">Game Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-myth-textSecondary text-sm mb-1">
              My Age
            </label>
            <select
              value={childAge}
              onChange={(e) => onAgeChange?.(parseInt(e.target.value))}
              className="w-full bg-myth-background border border-myth-accent/30 rounded px-2 py-1 text-myth-textPrimary text-sm"
            >
              {[...Array(13)].map((_, i) => (
                <option key={i} value={i + 6}>{i + 6} years old</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-myth-textSecondary text-sm mb-1">
              Animation Speed
            </label>
            <select
              value={config.animationSpeed}
              onChange={(e) => setConfig({...config, animationSpeed: e.target.value as any})}
              className="w-full bg-myth-background border border-myth-accent/30 rounded px-2 py-1 text-myth-textPrimary text-sm"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-myth-textSecondary text-sm">High Contrast</span>
            <button
              onClick={() => setConfig({...config, colorContrast: config.colorContrast === 'high' ? 'normal' : 'high'})}
              className={`w-10 h-6 rounded-full transition-colors ${
                config.colorContrast === 'high' ? 'bg-electricCyan' : 'bg-myth-accent/30'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                config.colorContrast === 'high' ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Apply age-appropriate styling to the entire interface
  const interfaceClasses = `
    ${config.fontSize}
    ${config.colorContrast === 'high' ? 'contrast-125 saturate-125' : ''}
    transition-all duration-300
  `;

  return (
    <div className={interfaceClasses}>
      {/* Pause overlay for young children */}
      {isPaused && childAge <= 10 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-myth-surface rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-myth-accent mb-4">Game Paused</h2>
            <p className="text-myth-textSecondary mb-6">Take a break! Click play when you're ready.</p>
            <button
              onClick={() => setIsPaused(false)}
              className="bg-neonMint text-obsidianBlack px-6 py-3 rounded-lg font-semibold hover:bg-neonMint/80 transition-colors"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Continue Playing
            </button>
          </div>
        </div>
      )}

      {/* Main game content */}
      {children}

      {/* Age-appropriate UI overlays */}
      <ControlPanel />
      <InstructionsOverlay />
      <SettingsPanel />

      {/* Age-appropriate encouragement messages */}
      {childAge <= 8 && (
        <div className="fixed top-4 left-4 z-30">
          <div className="bg-neonMint/20 backdrop-blur-md rounded-lg p-3 border border-neonMint/30">
            <p className="text-neonMint font-semibold text-sm">
              You're doing great! Keep learning! 🌟
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeAdaptiveInterface;
