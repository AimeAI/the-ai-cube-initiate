import React, { useState, useEffect } from 'react';
import { Brain, Zap, Gamepad2, Sparkles } from 'lucide-react';

interface SmoothLoaderProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'game' | 'page';
  className?: string;
}

const SmoothLoader: React.FC<SmoothLoaderProps> = ({
  isLoading,
  message = 'Loading AI Cube...',
  progress = 0,
  showProgress = false,
  variant = 'default',
  className = ''
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [animationStep, setAnimationStep] = useState(0);

  const loadingMessages = [
    'Initializing AI systems...',
    'Loading neural networks...',
    'Preparing 3D environments...',
    'Optimizing for your device...',
    'Almost ready to play!'
  ];

  const gameLoadingMessages = [
    'Spawning AI cubes...',
    'Calibrating neural pathways...',
    'Rendering quantum chambers...',
    'Synchronizing game logic...',
    'Ready to learn!'
  ];

  const pageLoadingMessages = [
    'Loading AI Cube platform...',
    'Preparing your dashboard...',
    'Fetching latest content...',
    'Optimizing experience...',
    'Welcome to AI Cube!'
  ];

  useEffect(() => {
    if (!isLoading) return;

    const messages = variant === 'game' ? gameLoadingMessages : 
                    variant === 'page' ? pageLoadingMessages : 
                    loadingMessages;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
      
      // Change message every 2 seconds
      if (Math.random() > 0.7) {
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading, variant]);

  if (!isLoading) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'game':
        return <Gamepad2 className="w-8 h-8 text-electricCyan animate-pulse" />;
      case 'page':
        return <Sparkles className="w-8 h-8 text-neonMint animate-spin" />;
      case 'minimal':
        return <Zap className="w-6 h-6 text-electricCyan animate-pulse" />;
      default:
        return <Brain className="w-8 h-8 text-electricCyan animate-pulse" />;
    }
  };

  const renderLoader = () => {
    if (variant === 'minimal') {
      return (
        <div className="flex items-center gap-3">
          {renderIcon()}
          <span className="text-myth-textPrimary">{currentMessage}</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-electricCyan rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-electricCyan/20 rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-neonMint/30 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {renderIcon()}
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-electricCyan rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-myth-textPrimary mb-2">
            {currentMessage}
          </h3>
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-electricCyan rounded-full transition-opacity duration-300 ${
                  animationStep === i ? 'opacity-100' : 'opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="flex justify-between text-sm text-myth-textSecondary mb-2">
              <span>Loading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-myth-surface rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-electricCyan to-neonMint h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div className="text-sm text-myth-textSecondary max-w-md mx-auto">
          <p className="opacity-70">
            {variant === 'game' 
              ? "Did you know? AI can learn to play games faster than humans!"
              : "Fun fact: Neural networks are inspired by how our brains work!"
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-myth-background/95 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="bg-myth-surface/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-myth-accent/20 shadow-2xl max-w-md w-full mx-4">
        {renderLoader()}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
          }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Smooth transitions */
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Performance optimizations */
        .animate-spin,
        .animate-pulse,
        .animate-bounce,
        .animate-ping {
          will-change: transform;
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin,
          .animate-pulse,
          .animate-bounce,
          .animate-ping {
            animation: none;
          }
          
          .animate-float,
          .animate-pulse-glow {
            animation: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .bg-myth-background\\/95 {
            background: rgba(0, 0, 0, 0.98);
          }
          
          .bg-myth-surface\\/80 {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #00D4FF;
          }
        }
      `}</style>
    </div>
  );
};

export default SmoothLoader;
