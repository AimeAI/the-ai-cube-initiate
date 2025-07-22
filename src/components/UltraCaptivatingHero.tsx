import React, { useState, useEffect, useRef } from 'react';
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
  Gamepad2,
  Sparkles,
  Rocket,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';

interface UltraCaptivatingHeroProps {
  onTryFreeClick?: () => void;
  onPricingClick?: () => void;
}

const UltraCaptivatingHero: React.FC<UltraCaptivatingHeroProps> = ({
  onTryFreeClick,
  onPricingClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Particle animation counter
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleCount(prev => (prev + 1) % 50);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Enhanced cycling stats with more impact
  const stats = [
    { 
      icon: Users, 
      value: '2,847+', 
      label: 'families learning AI', 
      color: 'text-neonMint',
      bgColor: 'bg-neonMint/20',
      description: 'Join thousands of families'
    },
    { 
      icon: Star, 
      value: '4.9/5', 
      label: 'parent satisfaction', 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      description: 'Loved by parents worldwide'
    },
    { 
      icon: Shield, 
      value: '100%', 
      label: 'safe & educational', 
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      description: 'Completely safe for children'
    },
    { 
      icon: Brain, 
      value: '15+', 
      label: 'AI games available', 
      color: 'text-electricCyan',
      bgColor: 'bg-electricCyan/20',
      description: 'Comprehensive AI curriculum'
    },
    { 
      icon: TrendingUp, 
      value: '94%', 
      label: 'kids love learning', 
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      description: 'Engaging and fun'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const handleTryFreeClick = () => {
    const tryFreeSection = document.getElementById('try-free');
    if (tryFreeSection) {
      tryFreeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onTryFreeClick?.();
  };

  const handlePricingClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onPricingClick?.();
  };

  return (
    <section 
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8 z-10 overflow-hidden transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating AI Cubes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-electricCyan to-neonMint rounded opacity-20 animate-float"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          />
        ))}
        
        {/* Neural Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={100 + i * 150}
              y1={200}
              x2={200 + i * 150}
              y2={800}
              stroke="url(#neuralGradient)"
              strokeWidth="2"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
        
        {/* Particle System */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electricCyan rounded-full animate-ping opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Ultra-Attention-Grabbing Badge */}
          <div className={`inline-flex items-center gap-3 bg-gradient-to-r from-electricCyan/20 via-neonMint/20 to-purple-500/20 border-2 border-electricCyan/50 rounded-full px-8 py-3 mb-8 transition-all duration-700 hover:scale-105 ${isLoaded ? 'scale-100' : 'scale-95'}`}>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-electricCyan animate-pulse" />
              <span className="text-electricCyan font-bold text-lg">3 Games FREE</span>
            </div>
            <div className="w-px h-6 bg-electricCyan/30" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neonMint animate-spin" />
              <span className="text-neonMint font-semibold">No Signup Required</span>
            </div>
            <div className="w-px h-6 bg-electricCyan/30" />
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-400 animate-bounce" />
              <span className="text-purple-400 font-semibold">Start Now</span>
            </div>
          </div>
          
          {/* Massive Impact Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight transition-all duration-1000 ${isLoaded ? 'translate-y-0' : 'translate-y-4'}`}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-purple-400 animate-gradient-x">
              Your Child's
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-electricCyan to-neonMint animate-gradient-x">
              AI Future
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-neonMint via-electricCyan to-purple-400 animate-gradient-x">
              Starts With Play
            </span>
          </h1>
          
          {/* Powerful Value Proposition */}
          <div className={`max-w-5xl mx-auto mb-10 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-semibold leading-relaxed mb-6">
              Interactive 3D games that teach <span className="text-electricCyan font-bold">real AI concepts</span>
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              No boring lectures, just hands-on learning that prepares kids for tomorrow's world. 
              <span className="text-neonMint font-semibold"> Start playing in 30 seconds.</span>
            </p>
          </div>
          
          {/* Enhanced Dynamic Social Proof */}
          <div className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = index === currentStat;
                return (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl border transition-all duration-500 ${
                      isActive 
                        ? `${stat.bgColor} border-2 ${stat.color.replace('text-', 'border-')} scale-110 shadow-2xl` 
                        : 'bg-myth-surface/20 border-myth-surface hover:border-myth-accent/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isActive ? stat.bgColor : 'bg-myth-surface/30'
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? stat.color : 'text-myth-textSecondary'} ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isActive ? stat.color : 'text-myth-textPrimary'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${isActive ? 'text-myth-textPrimary font-semibold' : 'text-myth-textSecondary'}`}>
                      {stat.label}
                    </div>
                    {isActive && (
                      <div className="text-xs text-myth-textSecondary mt-2 opacity-80">
                        {stat.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Massive CTA Section */}
          <div className={`mb-10 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
              <button 
                onClick={handleTryFreeClick}
                className="group relative w-full lg:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-electricCyan to-neonMint rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                <MythButton 
                  className="relative w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-2xl px-12 py-6 rounded-2xl flex items-center justify-center gap-4 font-black transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  label={
                    <>
                      <Play className="w-8 h-8 group-hover:animate-bounce" />
                      Try 3 Games FREE Now
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  }
                />
              </button>
              
              <button 
                onClick={handlePricingClick}
                className="w-full lg:w-auto group"
              >
                <MythButton 
                  className="w-full border-3 border-electricCyan text-electricCyan hover:bg-electricCyan/10 text-xl px-10 py-5 rounded-2xl transition-all duration-300 hover:border-neonMint hover:text-neonMint hover:shadow-xl"
                  label={
                    <>
                      <Award className="w-6 h-6" />
                      See Family Plans
                    </>
                  }
                />
              </button>
            </div>
            
            {/* Urgency Element */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                <Target className="w-5 h-5" />
                <span className="font-semibold">2,847+ families already started</span>
              </div>
              <div className="hidden sm:block w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Join them in 30 seconds</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Risk Reversal */}
          <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {[
                { icon: CheckCircle, text: 'No signup for free games', color: 'text-green-400' },
                { icon: CheckCircle, text: '14-day free trial', color: 'text-blue-400' },
                { icon: CheckCircle, text: 'Cancel anytime', color: 'text-purple-400' },
                { icon: CheckCircle, text: '60-day guarantee', color: 'text-orange-400' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-myth-surface/20 rounded-lg hover:bg-myth-surface/30 transition-colors">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm text-myth-textSecondary font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            
            {/* Final Impact Statement */}
            <div className="bg-gradient-to-r from-electricCyan/10 via-neonMint/10 to-purple-500/10 border border-electricCyan/30 rounded-2xl p-6 max-w-3xl mx-auto">
              <p className="text-xl text-myth-textPrimary font-semibold mb-2">
                🚀 <span className="text-electricCyan">85% of jobs in 2030</span> will require AI skills
              </p>
              <p className="text-myth-textSecondary">
                Give your child the advantage they need. Start their AI journey today with games they'll love.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button
          onClick={handleTryFreeClick}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-electricCyan to-neonMint rounded-full blur-lg opacity-75 animate-pulse" />
          <div className="relative bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack p-4 rounded-full shadow-2xl hover:shadow-electricCyan/40 transform hover:scale-110 transition-all duration-300">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            FREE
          </div>
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Enhanced glow effects */
        .text-transparent {
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        /* Performance optimizations */
        .transform {
          will-change: transform;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-bounce,
          .animate-gradient-x,
          .animate-float,
          .animate-ping,
          .animate-spin {
            animation: none;
          }
          
          .transition-all {
            transition: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .text-gray-200,
          .text-gray-300 {
            color: #ffffff;
          }
          
          .bg-gradient-to-r {
            background: #00D4FF;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .text-5xl { font-size: 3rem; }
          .text-7xl { font-size: 4rem; }
          .text-8xl { font-size: 5rem; }
        }
      `}</style>
    </section>
  );
};

export default UltraCaptivatingHero;
