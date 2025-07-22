import React, { useState, useEffect } from 'react';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { ArrowRight, Lightbulb, Target, Star, Play } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  visual?: string;
  interaction?: 'click' | 'drag' | 'keyboard' | 'watch';
  highlight?: string; // CSS selector to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface ChildFriendlyTutorialProps {
  gameId: string;
  steps: TutorialStep[];
  onComplete: () => void;
  childAge?: number;
}

const ChildFriendlyTutorial: React.FC<ChildFriendlyTutorialProps> = ({
  gameId,
  steps,
  onComplete,
  childAge = 10
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Age-appropriate language adjustments
  const getLanguageLevel = () => {
    if (childAge <= 8) return 'simple';
    if (childAge <= 12) return 'intermediate';
    return 'advanced';
  };

  const getEncouragementMessage = () => {
    const messages = {
      simple: ["Great job!", "You're awesome!", "Keep going!", "Amazing work!"],
      intermediate: ["Excellent!", "You're getting it!", "Nice work!", "Well done!"],
      advanced: ["Outstanding!", "Perfect execution!", "Impressive!", "Brilliant!"]
    };
    const level = getLanguageLevel();
    return messages[level][Math.floor(Math.random() * messages[level].length)];
  };

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStepData.id]);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible || !currentStepData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Highlight overlay for specific elements */}
      {currentStepData.highlight && (
        <div 
          className="absolute border-4 border-neonMint rounded-lg animate-pulse"
          style={{
            // This would be calculated based on the highlighted element's position
            // For demo purposes, showing the concept
          }}
        />
      )}

      <MythCard className="max-w-lg w-full relative">
        <div className="p-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-neonMint' : 'bg-myth-surface'
                  }`}
                />
              ))}
            </div>
            <span className="text-myth-textSecondary text-sm">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Animated character guide */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center animate-bounce">
              <Lightbulb className="w-6 h-6 text-obsidianBlack" />
            </div>
            <div className="bg-myth-surface/50 rounded-lg px-3 py-2 relative">
              <p className="text-myth-textPrimary font-semibold text-sm">
                AI Buddy says:
              </p>
              {/* Speech bubble tail */}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-myth-surface/50"></div>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-myth-accent mb-3 flex items-center gap-2">
              {currentStepData.interaction === 'click' && <Target className="w-5 h-5" />}
              {currentStepData.interaction === 'keyboard' && <Play className="w-5 h-5" />}
              {currentStepData.interaction === 'watch' && <Star className="w-5 h-5" />}
              {currentStepData.title}
            </h3>
            
            <p className="text-myth-textSecondary leading-relaxed mb-4">
              {currentStepData.description}
            </p>

            {/* Visual aid */}
            {currentStepData.visual && (
              <div className="bg-myth-surface/30 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{currentStepData.visual}</div>
                  <p className="text-myth-textSecondary text-sm">Visual guide</p>
                </div>
              </div>
            )}

            {/* Interaction-specific guidance */}
            {currentStepData.interaction === 'keyboard' && (
              <div className="bg-electricCyan/10 border border-electricCyan/30 rounded-lg p-3 mb-4">
                <p className="text-electricCyan text-sm font-semibold">
                  🎮 Use your keyboard arrow keys to move!
                </p>
              </div>
            )}

            {currentStepData.interaction === 'click' && (
              <div className="bg-neonMint/10 border border-neonMint/30 rounded-lg p-3 mb-4">
                <p className="text-neonMint text-sm font-semibold">
                  👆 Click on the highlighted area!
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <MythButton
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack flex items-center justify-center gap-2"
              label={
                <>
                  {currentStep === steps.length - 1 ? "Let's Play!" : "Got it!"}
                  <ArrowRight className="w-4 h-4" />
                </>
              }
            />
            
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors text-sm"
            >
              Skip Tutorial
            </button>
          </div>

          {/* Encouragement message */}
          {completedSteps.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-neonMint font-semibold animate-pulse">
                {getEncouragementMessage()} You're learning fast! 🌟
              </p>
            </div>
          )}
        </div>
      </MythCard>
    </div>
  );
};

export default ChildFriendlyTutorial;
