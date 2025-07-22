import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MythButton } from './myth/MythButton';
import { 
  Play, 
  Star, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Gamepad2
} from 'lucide-react';

interface OptimizedHeroSectionProps {
  onTryFreeClick?: () => void;
  onPricingClick?: () => void;
}

const OptimizedHeroSection: React.FC<OptimizedHeroSectionProps> = ({
  onTryFreeClick,
  onPricingClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  // Smooth loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cycling stats for engagement
  const stats = [
    { icon: Users, value: '2,847+', label: 'families learning', color: 'text-neonMint' },
    { icon: Star, value: '4.9/5', label: 'parent rating', color: 'text-yellow-400' },
    { icon: Shield, value: '100%', label: 'safe & educational', color: 'text-green-400' },
    { icon: Brain, value: '15+', label: 'AI games available', color: 'text-electricCyan' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const handleTryFreeClick = () => {
    // Smooth scroll to try-free section
    const tryFreeSection = document.getElementById('try-free');
    if (tryFreeSection) {
      tryFreeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onTryFreeClick?.();
  };

  const handlePricingClick = () => {
    // Smooth scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onPricingClick?.();
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center max-w-6xl mx-auto">
          {/* Attention-grabbing badge */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2 mb-6 transition-all duration-700 ${isLoaded ? 'scale-100' : 'scale-95'}`}>
            <Zap className="w-5 h-5 text-electricCyan animate-pulse" />
            <span className="text-electricCyan font-semibold">3 Games FREE • No Signup Required</span>
          </div>
          
          {/* Main headline with power words */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x leading-tight transition-all duration-1000 ${isLoaded ? 'translate-y-0' : 'translate-y-4'}`}>
            Your Child's AI Future
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl">Starts With Play</span>
          </h1>
          
          {/* Value proposition - clear and compelling */}
          <p className={`text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Interactive 3D games that teach real AI concepts. No boring lectures, just hands-on learning that prepares kids for tomorrow's world.
          </p>
          
          {/* Dynamic social proof - builds trust immediately */}
          <div className={`flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8 text-sm md:text-base text-gray-400 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isActive = index === currentStat;
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    isActive ? `${stat.color} scale-110 font-bold` : 'text-gray-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? stat.color : 'text-gray-500'} ${isActive ? 'animate-pulse' : ''}`} />
                  <span>
                    <strong className={isActive ? 'text-white' : 'text-gray-300'}>
                      {stat.value}
                    </strong> {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Primary CTA - prominent and action-oriented */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button 
              onClick={handleTryFreeClick}
              className="w-full sm:w-auto max-w-sm group"
            >
              <MythButton 
                className="w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-2xl hover:shadow-electricCyan/40 text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300 group-hover:animate-pulse"
                label={
                  <>
                    <Play className="w-6 h-6 group-hover:animate-bounce" />
                    Try 3 Games FREE Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                }
              />
            </button>
            <button 
              onClick={handlePricingClick}
              className="w-full sm:w-auto max-w-sm"
            >
              <MythButton 
                className="w-full border-2 border-electricCyan text-electricCyan hover:bg-electricCyan/10 text-lg px-8 py-4 transition-all duration-300 hover:border-neonMint hover:text-neonMint"
                label="See Family Plans"
              />
            </button>
          </div>
          
          {/* Risk reversal - removes purchase anxiety */}
          <div className={`flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <CheckCircle className="w-4 h-4 text-green-400" />
              No signup for free games
            </span>
            <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <CheckCircle className="w-4 h-4 text-green-400" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Cancel anytime
            </span>
          </div>
          
          {/* Urgency element */}
          <div className={`mt-6 flex items-center justify-center gap-2 text-sm text-yellow-400 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="animate-pulse">Join 2,847+ families already giving their kids the AI advantage</span>
          </div>
        </div>
      </div>
      
      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={handleTryFreeClick}
          className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack p-4 rounded-full shadow-2xl hover:shadow-electricCyan/40 transform hover:scale-110 transition-all duration-300 animate-bounce"
          aria-label="Try free games"
        >
          <Gamepad2 className="w-6 h-6" />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        /* Smooth hover effects */
        .group:hover .group-hover\\:animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .group:hover .group-hover\\:translate-x-1 {
          transform: translateX(0.25rem);
        }
        
        /* Performance optimizations */
        .transform {
          will-change: transform;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-bounce,
          .animate-gradient-x {
            animation: none;
          }
          
          .transition-all {
            transition: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .text-gray-300,
          .text-gray-400,
          .text-gray-500 {
            color: #ffffff;
          }
          
          .bg-gradient-to-r {
            background: #00D4FF;
          }
        }
      `}</style>
    </section>
  );
};

export default OptimizedHeroSection;
