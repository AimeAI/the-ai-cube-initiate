import React from 'react';
import { useTranslation } from 'react-i18next';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import EnticingGamesShowcase from '@/components/EnticingGamesShowcase';
import CenteredPricingSection from '@/components/CenteredPricingSection';
import FeedbackButton from '@/components/FeedbackButton';
import OptimizedVideo from '@/components/OptimizedVideo';
import { MythButton } from '@/components/myth/MythButton';
import { 
  Play, 
  Star, 
  Users, 
  Brain, 
  Gamepad2, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Award,
  Eye,
  Sparkles,
  Rocket,
  Heart
} from 'lucide-react';

const SimplifiedSalesFunnelIndex = () => {
  const { t } = useTranslation();

  const handleTryFreeClick = () => {
    const tryFreeSection = document.getElementById('try-free');
    if (tryFreeSection) {
      tryFreeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePricingClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden relative">
      <MetaHead
        title="AI Cube - Learn AI Through Interactive 3D Games | Free Trial"
        description="Transform your child's future with interactive AI games. 3 free games, no signup required. Join 2,847+ families learning AI through play."
        url="https://aicube.ai/"
        image="https://aicube.ai/og-image-home.png"
      />
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8 z-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-6xl mx-auto">
            {/* Attention-grabbing badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-electricCyan animate-pulse" />
              <span className="text-electricCyan font-semibold">3 Games FREE • No Signup Required</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan leading-tight">
              Your Child's AI Future
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">Starts With Play</span>
            </h1>
            
            {/* Value proposition */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Interactive 3D games that teach real AI concepts. No boring lectures, just hands-on learning that prepares kids for tomorrow's world.
            </p>
            
            {/* Social proof */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8 text-sm md:text-base text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neonMint" />
                <span><strong className="text-white">2,847+</strong> families learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span><strong className="text-white">4.9/5</strong> parent rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span><strong className="text-white">100%</strong> safe & educational</span>
              </div>
            </div>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={handleTryFreeClick}
                className="w-full sm:w-auto max-w-sm group"
              >
                <MythButton 
                  className="w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-2xl hover:shadow-electricCyan/40 text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-6 h-6" />
                      Try 3 Games FREE Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  }
                />
              </button>
              <button 
                onClick={handlePricingClick}
                className="w-full sm:w-auto max-w-sm"
              >
                <MythButton 
                  className="w-full border-2 border-electricCyan text-electricCyan hover:bg-electricCyan/10 text-lg px-8 py-4 transition-all duration-300"
                  label="See Family Plans"
                />
              </button>
            </div>
            
            {/* Risk reversal */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                No signup for free games
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TOP VIDEO - Neural Network Demo */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-myth-background to-myth-surface/20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-electricCyan/10 border border-electricCyan/30 rounded-full px-6 py-2 mb-6">
              <Eye className="w-5 h-5 text-electricCyan" />
              <span className="text-electricCyan font-semibold">See AI Learning In Action</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Watch Neural Networks Come to Life
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              See how children build and train actual AI neural networks in our most popular game
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative max-w-6xl mx-auto video-container">
              <OptimizedVideo
                src="assets/aicube2.mp4"
                className="w-full h-auto shadow-2xl transition-all duration-500 rounded-2xl"
                style={{ minHeight: '400px', maxHeight: '600px' }}
                autoPlay
                loop
                muted
                playsInline
                aria-label="AI Cube Neural Network Game Demo"
              />
            </div>
            
            <div className="text-center mt-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-myth-textPrimary mb-4">Neural Network Chamber</h3>
              <p className="text-lg text-myth-textSecondary mb-6">Build AI brains by connecting neurons - learn how artificial intelligence actually works!</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={handleTryFreeClick}>
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                    label={
                      <>
                        <Play className="w-5 h-5" />
                        Try This Game FREE
                      </>
                    }
                  />
                </button>
                <button onClick={handlePricingClick}>
                  <MythButton 
                    className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-4 transition-all duration-300"
                    label="See All 15 Games"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES SHOWCASE */}
      <EnticingGamesShowcase />

      {/* MIDDLE VIDEO - Snake Game Demo */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-surface/10 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-neonMint/10 border border-neonMint/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-neonMint" />
              <span className="text-neonMint font-semibold">3D Programming Adventures</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Experience Programming Made Visual
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Watch children master programming logic through our engaging 3D Snake game
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto mb-12">
            <OptimizedVideo
              src="assets/aicube3.mp4"
              className="w-full h-auto shadow-2xl transition-all duration-500 rounded-2xl"
              style={{ minHeight: '300px', maxHeight: '450px' }}
              autoPlay
              loop
              muted
              playsInline
              aria-label="AI Cube Snake Game Demo"
            />
          </div>
          
          <div className="text-center">
            <button onClick={handleTryFreeClick}>
              <MythButton 
                className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 mx-auto font-bold transform hover:scale-105 transition-all duration-300"
                label={
                  <>
                    <Rocket className="w-5 h-5" />
                    Try Snake³ Game FREE
                  </>
                }
              />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 md:py-20">
        <CenteredPricingSection />
      </section>

      {/* BOTTOM VIDEO - Platform Overview */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-surface/20 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Rocket className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-400 font-semibold">Complete AI Learning Platform</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Explore the Full AI Learning Universe
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              See the complete range of AI concepts your child will master - from basic programming to advanced neural networks
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto mb-12">
            <OptimizedVideo
              src="assets/aicubevideo.mp4"
              className="w-full h-auto shadow-2xl transition-all duration-500 rounded-2xl"
              style={{ minHeight: '350px', maxHeight: '500px' }}
              autoPlay
              loop
              muted
              playsInline
              aria-label="AI Cube Complete Platform Demo"
            />
            
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
              15 Games Total
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              Ages 6-16
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xl text-myth-textSecondary mb-6">
              Ready to give your child the AI advantage?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleTryFreeClick}>
                <MythButton 
                  className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-5 h-5" />
                      Try 3 Games FREE
                    </>
                  }
                />
              </button>
              <button onClick={handlePricingClick}>
                <MythButton 
                  className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-4 transition-all duration-300"
                  label="View All Plans"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-myth-surface/30 to-myth-background">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
              Give Your Child the AI Advantage Today
            </h2>
            <p className="text-lg text-myth-textSecondary mb-8 leading-relaxed">
              Don't let your child fall behind in the AI revolution. Start their journey with 3 free games - no signup required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button onClick={handleTryFreeClick}>
                <MythButton 
                  className="w-full sm:w-auto bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-6 h-6" />
                      Start FREE Trial Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  }
                />
              </button>
              <button onClick={handlePricingClick}>
                <MythButton 
                  className="w-full sm:w-auto border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 text-lg px-8 py-4 transition-all duration-300"
                  label="View All Plans"
                />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                3 games free forever
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                14-day full trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      <FeedbackButton />
    </div>
  );
};

export default SimplifiedSalesFunnelIndex;
