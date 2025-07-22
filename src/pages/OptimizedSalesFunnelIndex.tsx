import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import UltraCaptivatingHero from '@/components/UltraCaptivatingHero';
import CyclingVideoShowcase from '@/components/CyclingVideoShowcase';
import EnhancedTestimonialsSection from '@/components/EnhancedTestimonialsSection';
import EnticingGamesShowcase from '@/components/EnticingGamesShowcase';
import CenteredPricingSection from '@/components/CenteredPricingSection';
import SmoothLoader from '@/components/SmoothLoader';
import OptimizedVideo from '@/components/OptimizedVideo';
import FeedbackButton from '@/components/FeedbackButton';
import OptimizedFloatingCubes from '@/components/3D/OptimizedFloatingCubes';
import OptimizedEnergyField from '@/components/3D/OptimizedEnergyField';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { usePerformanceOptimization } from '@/utils/performanceOptimization';
import { 
  Play, 
  Star, 
  Users, 
  Brain, 
  Gamepad2, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Award,
  Eye,
  Clock,
  Sparkles,
  Rocket,
  Heart
} from 'lucide-react';

const OptimizedSalesFunnelIndex = () => {
  const { t } = useTranslation();
  const { shouldRenderThreeJS, shouldRenderParticles } = usePerformanceOptimization();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Smooth loading sequence
  useEffect(() => {
    const loadingSteps = [
      { progress: 20, delay: 200 },
      { progress: 40, delay: 400 },
      { progress: 60, delay: 600 },
      { progress: 80, delay: 800 },
      { progress: 100, delay: 1000 }
    ];

    loadingSteps.forEach(({ progress, delay }) => {
      setTimeout(() => {
        setLoadingProgress(progress);
        if (progress === 100) {
          setTimeout(() => setIsLoading(false), 300);
        }
      }, delay);
    });
  }, []);

  // Smooth scroll handler with performance optimization
  React.useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            requestAnimationFrame(() => {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });
            });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll, { passive: false });
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  if (isLoading) {
    return (
      <SmoothLoader 
        isLoading={isLoading}
        progress={loadingProgress}
        showProgress={true}
        variant="page"
        message="Preparing your AI learning experience..."
      />
    );
  }

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden relative">
      <MetaHead
        title="AI Cube - Learn AI Through Interactive 3D Games | Free Trial"
        description="Transform your child's future with interactive AI games. 3 free games, no signup required. Join 2,847+ families learning AI through play."
        url="https://aicube.ai/"
        image="https://aicube.ai/og-image-home.png"
      />
      <Navigation />
      
      {/* Enhanced 3D Immersive Background */}
      <OptimizedEnergyField className="fixed inset-0 pointer-events-none z-0" />
      {shouldRenderThreeJS && <OptimizedFloatingCubes className="fixed inset-0 pointer-events-none z-0" />}
      
      {/* HERO SECTION - Ultra-captivating with immersive elements */}
      <UltraCaptivatingHero />

      {/* TOP VIDEO - Immediate engagement after hero */}
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
          
          {/* TOP VIDEO - Neural Network Demo */}
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
              
              {/* Video overlay with CTA */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <a href="#try-free">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
                    label={
                      <>
                        <Play className="w-5 h-5" />
                        Try This Game Now
                      </>
                    }
                  />
                </a>
              </div>
            </div>
            
            {/* Game description with CTA */}
            <div className="text-center mt-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-myth-textPrimary mb-4">Neural Network Chamber</h3>
              <p className="text-lg text-myth-textSecondary mb-6">Build AI brains by connecting neurons - learn how artificial intelligence actually works!</p>
              
              {/* Immediate CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#try-free" className="inline-block">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                    label={
                      <>
                        <Play className="w-5 h-5" />
                        Try This Game FREE
                      </>
                    }
                  />
                </a>
                <a href="#pricing" className="inline-block">
                  <MythButton 
                    className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-4 transition-all duration-300"
                    label="See All 15 Games"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION - Create urgency */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-myth-surface/30 to-myth-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2 mb-6">
                <Zap className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">Urgent: AI Skills Gap Growing</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
                AI Will Shape Your Child's Future
              </h2>
              
              <div className="space-y-4 text-lg text-myth-textSecondary mb-8">
                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 mt-1 text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-myth-textPrimary mb-1">85% of jobs in 2030</p>
                    <p>will require AI skills that don't exist today</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 mt-1 text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-myth-textPrimary mb-1">Traditional education is 5-10 years behind</p>
                    <p>AI advancement - your child needs to start now</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 mt-1 text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-myth-textPrimary mb-1">Children who don't learn AI early</p>
                    <p>will be left behind in the job market</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-electricCyan/10 to-neonMint/10 border border-electricCyan/30 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-electricCyan" />
                  <h3 className="text-xl font-bold text-electricCyan">The Solution: Start Now</h3>
                </div>
                <p className="text-myth-textSecondary">
                  Give your child the AI advantage through play-based learning that makes complex concepts simple and fun. Join 2,847+ families already preparing their kids for the future.
                </p>
              </div>
              
              <div className="text-center lg:text-left">
                <TryFreeButton 
                  size="lg"
                  trackingId="problem-solution-cta"
                  className="mb-4"
                />
                
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Don't wait - every day matters in AI education</span>
                </div>
              </div>
            </div>
            
            <div className="relative max-w-2xl mx-auto lg:mx-0">
              {/* Stats showcase */}
              <div className="grid grid-cols-2 gap-4">
                <MythCard className="p-6 text-center hover:border-electricCyan/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-electricCyan mb-2">85%</div>
                  <div className="text-sm text-myth-textSecondary">Future jobs need AI skills</div>
                </MythCard>
                
                <MythCard className="p-6 text-center hover:border-neonMint/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-neonMint mb-2">2,847+</div>
                  <div className="text-sm text-myth-textSecondary">Families already learning</div>
                </MythCard>
                
                <MythCard className="p-6 text-center hover:border-yellow-400/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">4.9/5</div>
                  <div className="text-sm text-myth-textSecondary">Parent satisfaction</div>
                </MythCard>
                
                <MythCard className="p-6 text-center hover:border-green-400/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
                  <div className="text-sm text-myth-textSecondary">AI learning games</div>
                </MythCard>
              </div>
              
              {/* Floating benefit callouts */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                Ages 6-16
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                No Coding Required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES SHOWCASE - Enhanced and enticing with better spacing */}
      <EnticingGamesShowcase />

      {/* FEATURES/BENEFITS - Build desire */}
      <section className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-neonMint/10 border border-neonMint/30 rounded-full px-6 py-2 mb-6">
              <Award className="w-5 h-5 text-neonMint" />
              <span className="text-neonMint font-semibold">Why Parents Choose AI Cube</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              The Only Platform That Makes AI Education Fun & Effective
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Designed by AI experts and child development specialists for maximum learning impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <MythCard className="p-8 text-center hover:border-electricCyan/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-electricCyan" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Real AI Learning</h3>
              <p className="text-myth-textSecondary leading-relaxed mb-4">
                Not just games - actual AI concepts like neural networks, machine learning, and computer vision taught through interactive 3D experiences.
              </p>
              <div className="text-sm text-electricCyan font-semibold">
                ✓ Neural Networks ✓ Machine Learning ✓ Computer Vision
              </div>
            </MythCard>

            {/* Benefit 2 */}
            <MythCard className="p-8 text-center hover:border-neonMint/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-neonMint" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Age-Perfect Design</h3>
              <p className="text-myth-textSecondary leading-relaxed mb-4">
                Automatically adapts to your child's age (6-16) with appropriate language, visuals, and complexity levels for optimal learning.
              </p>
              <div className="text-sm text-neonMint font-semibold">
                ✓ Ages 6-16 ✓ Auto-Adaptive ✓ Personalized
              </div>
            </MythCard>

            {/* Benefit 3 */}
            <MythCard className="p-8 text-center hover:border-purple-400/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Parent Insights</h3>
              <p className="text-myth-textSecondary leading-relaxed mb-4">
                Track your child's progress with detailed analytics, achievement notifications, and discussion prompts for family conversations.
              </p>
              <div className="text-sm text-purple-400 font-semibold">
                ✓ Progress Tracking ✓ Analytics ✓ Family Discussions
              </div>
            </MythCard>
          </div>

          {/* CTA after benefits */}
          <div className="text-center">
            <TryFreeButton 
              size="xl"
              trackingId="benefits-cta"
              className="mb-4"
            />
            <p className="text-sm text-gray-500">Join 2,847+ families • No credit card required</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Enhanced testimonials with better placement */}
      <EnhancedTestimonialsSection showCTA={true} />

      {/* MIDDLE VIDEO - Advanced Features Demo */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-surface/10 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-neonMint/10 border border-neonMint/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-neonMint animate-spin" />
              <span className="text-neonMint font-semibold">Advanced AI Learning</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Experience 3D Programming Adventures
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Watch children master programming logic through our engaging 3D Snake game
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video showcase */}
            <div className="order-2 lg:order-1">
              <div className="relative video-container">
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
                
                {/* Video overlay with features */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <a href="#try-free">
                      <MythButton 
                        className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 mx-auto mb-4 transform hover:scale-105 transition-all duration-300"
                        label={
                          <>
                            <Play className="w-5 h-5" />
                            Play Snake³ FREE
                          </>
                        }
                      />
                    </a>
                    <p className="text-white text-sm">No signup required</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-myth-accent mb-6">
                Programming Made Fun & Visual
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neonMint/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-neonMint" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">3D Programming Logic</h4>
                    <p className="text-myth-textSecondary">Learn loops, conditionals, and algorithms through 3D snake navigation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electricCyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-electricCyan" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Visual Problem Solving</h4>
                    <p className="text-myth-textSecondary">See programming concepts come to life in interactive 3D environments</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Beginner Friendly</h4>
                    <p className="text-myth-textSecondary">Perfect introduction to programming for ages 6+ with no prior experience needed</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Instant Gratification</h4>
                    <p className="text-myth-textSecondary">See results immediately as your code controls the 3D snake's movement</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="#try-free">
                  <MythButton 
                    className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack px-8 py-3 flex items-center gap-2 font-bold"
                    label={
                      <>
                        <Rocket className="w-5 h-5" />
                        Try Snake³ Game FREE
                      </>
                    }
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Centered and optimized for conversion */}
      <section id="pricing" className="py-16 md:py-20">
        <CenteredPricingSection />
      </section>

      {/* BOTTOM VIDEO - Final Engagement Before CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-surface/20 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Rocket className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-400 font-semibold">Advanced AI Concepts</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Explore the Full AI Learning Universe
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              See the complete range of AI concepts your child will master - from basic programming to advanced neural networks
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto mb-12">
            {/* BOTTOM VIDEO - Complete Platform Demo */}
            <div className="relative video-container">
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
              
              {/* Video overlay with final CTA */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <a href="#try-free">
                    <MythButton 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xl px-10 py-5 flex items-center gap-3 mx-auto mb-4 transform hover:scale-105 transition-all duration-300 font-bold"
                      label={
                        <>
                          <Play className="w-6 h-6" />
                          Start Your AI Journey
                          <ArrowRight className="w-5 h-5" />
                        </>
                      }
                    />
                  </a>
                  <p className="text-white text-sm">Experience all 15 AI learning games</p>
                </div>
              </div>
            </div>
            
            {/* Floating feature callouts */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
              15 Games Total
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              Ages 6-16
            </div>
          </div>
          
          {/* Feature grid showcasing platform breadth */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-4 bg-myth-surface/20 rounded-lg">
              <Brain className="w-8 h-8 text-electricCyan mx-auto mb-2" />
              <h4 className="font-semibold text-myth-textPrimary text-sm">Neural Networks</h4>
              <p className="text-xs text-myth-textSecondary">Build AI brains</p>
            </div>
            <div className="text-center p-4 bg-myth-surface/20 rounded-lg">
              <Eye className="w-8 h-8 text-neonMint mx-auto mb-2" />
              <h4 className="font-semibold text-myth-textPrimary text-sm">Computer Vision</h4>
              <p className="text-xs text-myth-textSecondary">Teach AI to see</p>
            </div>
            <div className="text-center p-4 bg-myth-surface/20 rounded-lg">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-myth-textPrimary text-sm">Decision Trees</h4>
              <p className="text-xs text-myth-textSecondary">AI logic systems</p>
            </div>
            <div className="text-center p-4 bg-myth-surface/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-myth-textPrimary text-sm">Quantum Computing</h4>
              <p className="text-xs text-myth-textSecondary">Future technology</p>
            </div>
          </div>
          
          {/* Pre-final CTA */}
          <div className="text-center">
            <p className="text-xl text-myth-textSecondary mb-6">
              Ready to give your child the AI advantage?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#try-free">
                <MythButton 
                  className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-5 h-5" />
                      Try 3 Games FREE
                    </>
                  }
                />
              </a>
              <a href="#pricing">
                <MythButton 
                  className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-4 transition-all duration-300"
                  label="View All Plans"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Last chance to convert */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-myth-surface/30 to-myth-background">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2 mb-6">
              <Rocket className="w-5 h-5 text-electricCyan animate-pulse" />
              <span className="text-electricCyan font-semibold">Last Chance - Don't Miss Out</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
              Give Your Child the AI Advantage Today
            </h2>
            <p className="text-lg text-myth-textSecondary mb-8 leading-relaxed">
              Don't let your child fall behind in the AI revolution. Start their journey with 3 free games - no signup required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <TryFreeButton 
                size="xl"
                trackingId="final-cta-primary"
                className="w-full sm:w-auto max-w-sm"
              />
              <PricingButton 
                size="lg"
                trackingId="final-cta-secondary"
                className="w-full sm:w-auto max-w-sm"
              />
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-400" />
                3 games free forever
              </span>
              <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-400" />
                14-day full trial
              </span>
              <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-400" />
                60-day money-back guarantee
              </span>
            </div>
            
            {/* Final urgency element */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Heart className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Join 2,847+ families already giving their kids the AI advantage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeedbackButton />
      
      {/* Enhanced Performance Styles */}
      <style jsx>{`
        /* Optimized animations and transitions */
        .bg-myth-background {
          background: 
            radial-gradient(circle at 25% 25%, #00D4FF08 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #7C3AED08 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #10B98108 0%, transparent 50%),
            #0A0A0A;
          background-attachment: scroll;
        }
        
        section {
          position: relative;
          z-index: 10;
          background: rgba(10, 10, 10, 0.4);
          border-radius: 16px;
          margin: 2rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }
        
        #pricing {
          background: 
            radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 70%),
            rgba(10, 10, 10, 0.6);
          border: 2px solid rgba(0, 212, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(0, 212, 255, 0.05);
        }
        
        #try-free {
          background: 
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%),
            rgba(10, 10, 10, 0.6);
          border: 2px solid rgba(16, 185, 129, 0.2);
        }
        
        /* Performance optimizations */
        * {
          will-change: auto;
        }
        
        .transform {
          will-change: transform;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          section {
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00D4FF;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedSalesFunnelIndex;
