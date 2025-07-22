import React, { useState, useEffect } from 'react';
import { MythCard } from '@/components/myth/MythCard';
import { Star, Trophy, Zap, Target, Brain, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  concept?: string; // AI concept learned
}

interface ProgressCelebrationProps {
  achievement: Achievement;
  onComplete: () => void;
  childAge?: number;
  showConcept?: boolean;
}

const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({
  achievement,
  onComplete,
  childAge = 10,
  showConcept = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase('celebrate'), 500);
    const timer2 = setTimeout(() => setAnimationPhase('exit'), 3000);
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-electricCyan to-neonMint';
    }
  };

  const getEncouragementMessage = () => {
    if (childAge <= 8) {
      return [
        "Wow! You're amazing! 🌟",
        "Super job! Keep going! 🚀",
        "You're so smart! 🧠",
        "Fantastic work! 🎉"
      ];
    } else if (childAge <= 12) {
      return [
        "Excellent work! You're mastering AI! 🤖",
        "Outstanding! You're thinking like a programmer! 💻",
        "Brilliant! You understand the concept! ⚡",
        "Impressive! Keep up the great work! 🏆"
      ];
    } else {
      return [
        "Exceptional achievement! You're developing real AI skills! 🧠",
        "Outstanding work! You're thinking algorithmically! 🔬",
        "Impressive mastery of AI concepts! 🚀",
        "Excellent problem-solving! You're ready for advanced challenges! 🎯"
      ];
    }
  };

  const getRandomMessage = () => {
    const messages = getEncouragementMessage();
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti effect */}
      {animationPhase === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <MythCard 
        className={`max-w-md w-full text-center transform transition-all duration-500 ${
          animationPhase === 'enter' ? 'scale-50 opacity-0' :
          animationPhase === 'celebrate' ? 'scale-100 opacity-100' :
          'scale-110 opacity-0'
        }`}
      >
        <div className="p-8">
          {/* Achievement icon with glow effect */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center relative`}>
            <div className="text-white text-4xl">
              {achievement.icon}
            </div>
            {animationPhase === 'celebrate' && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/50 to-orange-500/50 animate-ping"></div>
            )}
          </div>

          {/* Achievement title */}
          <h2 className="text-2xl font-bold text-myth-accent mb-2">
            {achievement.title}
          </h2>

          {/* Rarity badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)} mb-4`}>
            {achievement.rarity.toUpperCase()} ACHIEVEMENT
          </div>

          {/* Description */}
          <p className="text-myth-textSecondary mb-4 leading-relaxed">
            {achievement.description}
          </p>

          {/* Points earned */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-myth-textPrimary font-bold">
              +{achievement.points} XP
            </span>
          </div>

          {/* AI Concept learned */}
          {showConcept && achievement.concept && (
            <div className="bg-myth-surface/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm">
                  AI Concept Learned
                </span>
              </div>
              <p className="text-myth-textSecondary text-sm">
                {achievement.concept}
              </p>
            </div>
          )}

          {/* Encouragement message */}
          <div className="bg-gradient-to-r from-electricCyan/10 to-neonMint/10 rounded-lg p-4 mb-6">
            <p className="text-myth-textPrimary font-semibold">
              {getRandomMessage()}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-4 text-sm text-myth-textSecondary">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Level Progress</span>
            </div>
            <div className="flex-1 bg-myth-surface rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-electricCyan to-neonMint h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (achievement.points / 100) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </MythCard>
    </div>
  );
};

// Achievement definitions for different games
export const gameAchievements = {
  'snake-3': [
    {
      id: 'first-move',
      title: 'First Steps!',
      description: 'You made your first move! Every programmer starts with a single command.',
      icon: <Zap />,
      rarity: 'common' as const,
      points: 10,
      concept: 'Sequential Instructions: Computers follow commands one after another, just like your snake moves step by step!'
    },
    {
      id: 'first-collect',
      title: 'Data Collector!',
      description: 'You collected your first data node! This is how AI systems gather information.',
      icon: <Target />,
      rarity: 'common' as const,
      points: 25,
      concept: 'Data Collection: AI needs data to learn and make decisions, just like collecting these nodes!'
    },
    {
      id: 'no-crash-level',
      title: 'Perfect Navigation!',
      description: 'You completed a level without crashing! That\'s excellent planning ahead.',
      icon: <Trophy />,
      rarity: 'rare' as const,
      points: 50,
      concept: 'Algorithm Planning: Good algorithms think ahead to avoid problems, just like you did!'
    },
    {
      id: 'speed-demon',
      title: 'Lightning Fast!',
      description: 'You completed a level in record time! Quick thinking and execution.',
      icon: <Zap />,
      rarity: 'epic' as const,
      points: 75,
      concept: 'Optimization: Making programs run faster and more efficiently is a key skill in AI!'
    }
  ],
  'neural-network-chamber': [
    {
      id: 'first-connection',
      title: 'Neural Pioneer!',
      description: 'You made your first neural connection! This is how AI brains are built.',
      icon: <Brain />,
      rarity: 'common' as const,
      points: 15,
      concept: 'Neural Networks: AI learns by connecting simple units together, just like brain neurons!'
    },
    {
      id: 'pattern-master',
      title: 'Pattern Master!',
      description: 'You recognized a complex pattern! This is core to how AI thinks.',
      icon: <Star />,
      rarity: 'rare' as const,
      points: 40,
      concept: 'Pattern Recognition: AI excels at finding patterns in data that humans might miss!'
    }
  ],
  'crystal-resonance': [
    {
      id: 'first-harmony',
      title: 'Harmony Creator!',
      description: 'You created your first crystal harmony! This shows understanding of frequencies.',
      icon: <Sparkles />,
      rarity: 'common' as const,
      points: 20,
      concept: 'Signal Processing: AI often works with waves and frequencies, like sound and images!'
    }
  ]
};

export default ProgressCelebration;
