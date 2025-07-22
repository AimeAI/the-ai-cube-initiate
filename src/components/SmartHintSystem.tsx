import React, { useState, useEffect } from 'react';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { Lightbulb, X, HelpCircle, Zap, Target } from 'lucide-react';

interface HintConfig {
  id: string;
  trigger: 'time' | 'stuck' | 'error' | 'achievement';
  delay: number; // seconds
  condition?: () => boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Hint {
  id: string;
  title: string;
  message: string;
  type: 'tip' | 'encouragement' | 'instruction' | 'concept';
  visual?: React.ReactNode;
  actionable?: boolean;
  ageGroup: 'young' | 'middle' | 'teen' | 'all';
}

interface SmartHintSystemProps {
  gameId: string;
  childAge?: number;
  gameState: any;
  onHintAction?: (hintId: string, action: string) => void;
}

const SmartHintSystem: React.FC<SmartHintSystemProps> = ({
  gameId,
  childAge = 10,
  gameState,
  onHintAction
}) => {
  const [activeHint, setActiveHint] = useState<Hint | null>(null);
  const [shownHints, setShownHints] = useState<string[]>([]);
  const [hintQueue, setHintQueue] = useState<Hint[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Age-appropriate hint database
  const getHintsForGame = (gameId: string): Hint[] => {
    const baseHints: Record<string, Hint[]> = {
      'snake-3': [
        {
          id: 'snake-3-welcome',
          title: 'Welcome to Snake³!',
          message: childAge <= 8 
            ? "Hi! I'm your AI buddy! Let's learn to control the snake together! 🐍"
            : "Welcome! This game teaches you how computers follow instructions, just like programming!",
          type: 'instruction',
          visual: <div className="text-4xl text-center">🐍➡️🎯</div>,
          actionable: true,
          ageGroup: 'all'
        },
        {
          id: 'snake-3-controls',
          title: 'How to Move',
          message: childAge <= 8
            ? "Use the arrow keys to tell your snake where to go! ⬆️⬇️⬅️➡️"
            : "Use arrow keys to control the snake. This is like giving commands to a computer program!",
          type: 'instruction',
          visual: (
            <div className="grid grid-cols-3 gap-2 max-w-24 mx-auto">
              <div></div>
              <div className="bg-electricCyan/20 p-2 rounded text-center">↑</div>
              <div></div>
              <div className="bg-electricCyan/20 p-2 rounded text-center">←</div>
              <div className="bg-electricCyan/20 p-2 rounded text-center">↓</div>
              <div className="bg-electricCyan/20 p-2 rounded text-center">→</div>
            </div>
          ),
          actionable: true,
          ageGroup: 'all'
        },
        {
          id: 'snake-3-goal',
          title: 'Your Mission',
          message: childAge <= 8
            ? "Collect the glowing balls to make your snake grow! Avoid hitting walls or yourself!"
            : "Collect data nodes (glowing orbs) to grow. This simulates how AI systems collect and process information!",
          type: 'concept',
          visual: <div className="text-4xl text-center">🐍 + ⚡ = 🌟</div>,
          actionable: false,
          ageGroup: 'all'
        },
        {
          id: 'snake-3-stuck',
          title: 'Need Help?',
          message: childAge <= 8
            ? "Try moving in a different direction! Remember, you can't go backwards!"
            : "Think ahead! In programming, we plan our moves to avoid errors. Try a different path!",
          type: 'tip',
          actionable: true,
          ageGroup: 'all'
        },
        {
          id: 'snake-3-encouragement',
          title: "You're Doing Great!",
          message: childAge <= 8
            ? "Awesome job! You're learning how to give instructions to computers! 🎉"
            : "Excellent! You're mastering the basics of algorithmic thinking - planning steps ahead!",
          type: 'encouragement',
          visual: <div className="text-4xl text-center">🌟🎉🏆</div>,
          actionable: false,
          ageGroup: 'all'
        }
      ],
      'neural-network-chamber': [
        {
          id: 'neural-welcome',
          title: 'Welcome to Neural Networks!',
          message: childAge <= 8
            ? "Let's build a brain for computers! It's like connecting dots to make smart decisions! 🧠"
            : "Neural networks are inspired by how our brains work. Let's build one together!",
          type: 'concept',
          visual: <div className="text-4xl text-center">🧠⚡🤖</div>,
          actionable: true,
          ageGroup: 'all'
        },
        {
          id: 'neural-connections',
          title: 'Making Connections',
          message: childAge <= 8
            ? "Click to connect the circles! Each connection helps the computer learn!"
            : "Connect neurons by clicking. Each connection has a weight that determines how information flows!",
          type: 'instruction',
          actionable: true,
          ageGroup: 'all'
        }
      ],
      'crystal-resonance': [
        {
          id: 'crystal-welcome',
          title: 'Crystal Resonance Magic!',
          message: childAge <= 8
            ? "Help the crystals sing together! Match their colors and sounds! ✨"
            : "Learn about pattern recognition by harmonizing crystal frequencies!",
          type: 'concept',
          visual: <div className="text-4xl text-center">💎🎵✨</div>,
          actionable: true,
          ageGroup: 'all'
        }
      ]
    };

    return baseHints[gameId] || [];
  };

  // Hint triggering logic
  useEffect(() => {
    const hints = getHintsForGame(gameId);
    
    // Welcome hint
    if (!shownHints.includes(`${gameId}-welcome`)) {
      const welcomeHint = hints.find(h => h.id.includes('welcome'));
      if (welcomeHint) {
        setTimeout(() => {
          setActiveHint(welcomeHint);
          setShownHints(prev => [...prev, welcomeHint.id]);
        }, 2000);
      }
    }

    // Controls hint after 10 seconds if no movement
    if (!shownHints.includes(`${gameId}-controls`) && gameState?.timeElapsed > 10 && !gameState?.hasMovedYet) {
      const controlsHint = hints.find(h => h.id.includes('controls'));
      if (controlsHint) {
        setActiveHint(controlsHint);
        setShownHints(prev => [...prev, controlsHint.id]);
      }
    }

    // Stuck hint if no progress for 30 seconds
    if (!shownHints.includes(`${gameId}-stuck`) && gameState?.timeElapsed > 30 && gameState?.score === 0) {
      const stuckHint = hints.find(h => h.id.includes('stuck'));
      if (stuckHint) {
        setActiveHint(stuckHint);
        setShownHints(prev => [...prev, stuckHint.id]);
      }
    }

    // Encouragement after first success
    if (!shownHints.includes(`${gameId}-encouragement`) && gameState?.score > 0 && gameState?.score <= 2) {
      const encouragementHint = hints.find(h => h.id.includes('encouragement'));
      if (encouragementHint) {
        setTimeout(() => {
          setActiveHint(encouragementHint);
          setShownHints(prev => [...prev, encouragementHint.id]);
        }, 1000);
      }
    }
  }, [gameId, gameState, shownHints]);

  const handleHintAction = (action: string) => {
    if (activeHint && onHintAction) {
      onHintAction(activeHint.id, action);
    }
    
    if (action === 'close') {
      setActiveHint(null);
    } else if (action === 'minimize') {
      setIsMinimized(true);
    }
  };

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'instruction': return <Target className="w-5 h-5 text-electricCyan" />;
      case 'encouragement': return <Zap className="w-5 h-5 text-neonMint" />;
      case 'concept': return <HelpCircle className="w-5 h-5 text-purple-400" />;
      default: return <Lightbulb className="w-5 h-5 text-myth-accent" />;
    }
  };

  if (!activeHint) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-myth-accent hover:bg-myth-secondary text-myth-background rounded-full p-3 shadow-lg transition-all duration-300 animate-pulse"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <MythCard className="relative animate-slide-in-right">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getHintIcon(activeHint.type)}
              <h4 className="font-bold text-myth-textPrimary text-sm">
                {activeHint.title}
              </h4>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleHintAction('minimize')}
                className="text-myth-textSecondary hover:text-myth-textPrimary transition-colors p-1"
              >
                <div className="w-3 h-0.5 bg-current"></div>
              </button>
              <button
                onClick={() => handleHintAction('close')}
                className="text-myth-textSecondary hover:text-myth-textPrimary transition-colors p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Visual aid */}
          {activeHint.visual && (
            <div className="mb-3">
              {activeHint.visual}
            </div>
          )}

          {/* Message */}
          <p className="text-myth-textSecondary text-sm leading-relaxed mb-3">
            {activeHint.message}
          </p>

          {/* Action buttons */}
          {activeHint.actionable && (
            <div className="flex gap-2">
              <MythButton
                onClick={() => handleHintAction('got-it')}
                className="flex-1 text-xs py-2"
                label="Got it!"
              />
              <button
                onClick={() => handleHintAction('show-more')}
                className="text-myth-accent hover:text-myth-secondary text-xs transition-colors"
              >
                Tell me more
              </button>
            </div>
          )}
        </div>

        {/* Animated indicator */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-neonMint rounded-full animate-ping"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-neonMint rounded-full"></div>
      </MythCard>
    </div>
  );
};

export default SmartHintSystem;
