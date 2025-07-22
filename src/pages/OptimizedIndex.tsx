import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import ClearPricingSection from '@/components/ClearPricingSection';
import TryFreeSection from '@/components/TryFreeSection';
import FeedbackButton from '@/components/FeedbackButton';
import OptimizedFloatingCubes from '@/components/3D/OptimizedFloatingCubes';
import OptimizedEnergyField from '@/components/3D/OptimizedEnergyField';
import OptimizedVideo from '@/components/OptimizedVideo';
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
  Award
} from 'lucide-react';
import aicubeVideo from '../../assets/aicubevideo.mp4';
import aicube2Video from '../../assets/aicube2.mp4';
import aicube3Video from '../../assets/aicube3.mp4';

const OptimizedIndex = () => {
  const { t } = useTranslation();
  const { shouldRenderThreeJS, shouldRenderParticles } = usePerformanceOptimization();

  // Optimized smooth scroll handler
  React.useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      // Check if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Let browser handle default scrolling
      }
      
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          // Use requestAnimationFrame for smoother scrolling
          requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          });
        }
      }
    };

    // Add smooth scrolling to all anchor links with delegation
    const handleDelegatedClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        handleSmoothScroll(e);
      }
    };

    document.addEventListener('click', handleDelegatedClick, { passive: false });

    return () => {
      document.removeEventListener('click', handleDelegatedClick);
    };
  }, []);

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
      
      {/* HERO SECTION - Optimized for conversion */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8 z-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main headline with power words */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x leading-tight">
              Your Child's AI Future
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">Starts With Play</span>
            </h1>
            
            {/* Value proposition - clear and compelling */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Interactive 3D games that teach real AI concepts. No boring lectures, just hands-on learning that prepares kids for tomorrow's world.
            </p>
            
            {/* Social proof - builds trust immediately */}
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
            
            {/* Primary CTA - prominent and action-oriented */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="#try-free" className="w-full sm:w-auto max-w-sm">
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
              </a>
              <a href="#pricing" className="w-full sm:w-auto max-w-sm">
                <MythButton 
                  className="w-full border-2 border-electricCyan text-electricCyan hover:bg-electricCyan/10 text-lg px-8 py-4 transition-all duration-300"
                  label="See Family Plans"
                />
              </a>
            </div>
            
            {/* Risk reversal - removes purchase anxiety */}
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

      {/* IMMEDIATE VALUE DEMO - Show don't tell */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-myth-background to-myth-surface/20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              See AI Learning In Action
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Watch how our interactive 3D games make complex AI concepts simple and fun for children
            </p>
          </div>
          
          {/* ENLARGED VIDEO 1 - Primary demo */}
          <div className="mb-16">
            <div className="relative max-w-6xl mx-auto video-container">
              <OptimizedVideo
                src={aicube2Video}
                className="w-full h-auto shadow-2xl transition-all duration-500"
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
                    label="See All 15+ Games"
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
              <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
                AI Will Shape Your Child's Future
              </h2>
              <div className="space-y-4 text-lg text-myth-textSecondary mb-8">
                <p className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">⚠️</span>
                  <span><strong>85% of jobs in 2030</strong> will require AI skills that don't exist today</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">⚠️</span>
                  <span>Traditional education is <strong>5-10 years behind</strong> AI advancement</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">⚠️</span>
                  <span>Children who don't learn AI early will be <strong>left behind</strong></span>
                </p>
              </div>
              
              <div className="bg-myth-accent/10 border border-myth-accent/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-myth-accent mb-3">The Solution: Start Now</h3>
                <p className="text-myth-textSecondary">
                  Give your child the AI advantage through play-based learning that makes complex concepts simple and fun.
                </p>
              </div>
              
              {/* CTA after problem/solution */}
              <div className="text-center lg:text-left">
                <a href="#try-free" className="inline-block">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                    label={
                      <>
                        <Play className="w-5 h-5" />
                        Start Learning Now - FREE
                      </>
                    }
                  />
                </a>
                
                {/* Urgency element */}
                <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400">
                  <Zap className="w-4 h-4" />
                  <span>Join 2,847+ families already giving their kids the AI advantage</span>
                </div>
              </div>
            </div>
            
            <div className="relative max-w-2xl mx-auto lg:mx-0 video-container">
              {/* ENLARGED VIDEO 2 - Problem/solution demo */}
              <OptimizedVideo
                src={aicube3Video}
                className="w-full h-auto shadow-2xl transition-all duration-500"
                style={{ minHeight: '350px', maxHeight: '500px' }}
                autoPlay
                loop
                muted
                playsInline
                aria-label="AI Cube Snake Game Demo"
              />
              
              {/* Floating benefit callouts */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Ages 6-16
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                No Coding Required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRY FREE SECTION - Strategic placement after problem/solution */}
      <TryFreeSection />

      {/* FEATURES/BENEFITS - Build desire */}
      <section className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Why Parents Choose AI Cube
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              The only platform that makes AI education fun, effective, and age-appropriate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <MythCard className="p-8 text-center hover:border-electricCyan/50 transition-all duration-300">
              <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-electricCyan" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Real AI Learning</h3>
              <p className="text-myth-textSecondary leading-relaxed">
                Not just games - actual AI concepts like neural networks, machine learning, and computer vision taught through interactive 3D experiences.
              </p>
            </MythCard>

            {/* Benefit 2 */}
            <MythCard className="p-8 text-center hover:border-neonMint/50 transition-all duration-300">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-neonMint" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Age-Perfect Design</h3>
              <p className="text-myth-textSecondary leading-relaxed">
                Automatically adapts to your child's age (6-16) with appropriate language, visuals, and complexity levels for optimal learning.
              </p>
            </MythCard>

            {/* Benefit 3 */}
            <MythCard className="p-8 text-center hover:border-purple-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-4">Parent Insights</h3>
              <p className="text-myth-textSecondary leading-relaxed">
                Track your child's progress with detailed analytics, achievement notifications, and discussion prompts for family conversations.
              </p>
            </MythCard>
          </div>

          {/* CTA after benefits */}
          <div className="text-center">
            <a href="#try-free">
              <MythButton 
                className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center gap-3 mx-auto font-bold transform hover:scale-105 transition-all duration-300"
                label={
                  <>
                    <Gamepad2 className="w-6 h-6" />
                    Start Learning AI Now - FREE
                  </>
                }
              />
            </a>
            <p className="text-sm text-gray-500 mt-3">Join 2,847+ families • No credit card required</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Build trust */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-background to-myth-surface/20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Loved by Families Worldwide
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-xl font-bold text-myth-textPrimary ml-2">4.9/5</span>
              <span className="text-myth-textSecondary ml-2">(1,247 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Testimonial 1 */}
            <MythCard className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-myth-textSecondary italic mb-4">
                "My 10-year-old daughter now explains neural networks to her friends. She plays this more than Roblox!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-myth-textPrimary">Sarah M.</p>
                  <p className="text-sm text-myth-textSecondary">Parent, California</p>
                </div>
              </div>
            </MythCard>

            {/* Testimonial 2 */}
            <MythCard className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-myth-textSecondary italic mb-4">
                "Finally, an AI course that doesn't put kids to sleep! Both my boys are obsessed and actually learning."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold text-myth-textPrimary">Mike R.</p>
                  <p className="text-sm text-myth-textSecondary">Homeschool Dad, Texas</p>
                </div>
              </div>
            </MythCard>

            {/* Testimonial 3 */}
            <MythCard className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-myth-textSecondary italic mb-4">
                "The parent dashboard helps me track progress and start amazing conversations about AI with my kids."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold">
                  J
                </div>
                <div>
                  <p className="font-semibold text-myth-textPrimary">Jennifer L.</p>
                  <p className="text-sm text-myth-textSecondary">Parent, New York</p>
                </div>
              </div>
            </MythCard>
          </div>
          
          {/* CTA after testimonials */}
          <div className="text-center">
            <a href="#pricing" className="inline-block">
              <MythButton 
                className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                label={
                  <>
                    <Award className="w-5 h-5" />
                    Join These Happy Families
                  </>
                }
              />
            </a>
            <p className="text-sm text-gray-500 mt-3">Start with 3 free games • No credit card required</p>
          </div>
        </div>
      </section>

      {/* THIRD VIDEO SHOWCASE - Advanced Features */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-surface/10 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Advanced AI Learning Features
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Explore our cutting-edge 3D environments designed to make artificial intelligence concepts accessible and engaging
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video showcase */}
            <div className="order-2 lg:order-1">
              <div className="relative video-container">
                <OptimizedVideo
                  src={aicubeVideo}
                  className="w-full h-auto shadow-2xl transition-all duration-500"
                  style={{ minHeight: '300px', maxHeight: '450px' }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="AI Cube Advanced Features Demo"
                />
                
                {/* Video overlay with features */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <a href="#pricing">
                      <MythButton 
                        className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 mx-auto mb-4 transform hover:scale-105 transition-all duration-300"
                        label={
                          <>
                            <Play className="w-5 h-5" />
                            Explore All Features
                          </>
                        }
                      />
                    </a>
                    <p className="text-white text-sm">See all games in action</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-myth-accent mb-6">
                Immersive Learning Technology
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electricCyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-electricCyan" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Neural Network Visualization</h4>
                    <p className="text-myth-textSecondary">Watch AI brains form connections in real-time as your child builds and trains neural networks</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neonMint/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-neonMint" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Adaptive Difficulty</h4>
                    <p className="text-myth-textSecondary">AI-powered system adjusts challenges based on your child's progress and understanding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Interactive 3D Environments</h4>
                    <p className="text-myth-textSecondary">Explore AI concepts through immersive 3D worlds that respond to every action</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-myth-textPrimary mb-2">Real-Time Progress Tracking</h4>
                    <p className="text-myth-textSecondary">Parents get detailed insights into learning progress and skill development</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/games">
                  <MythButton 
                    className="bg-myth-accent text-myth-background hover:bg-myth-secondary px-8 py-3"
                    label="Explore All Games"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Optimized for conversion */}
      <section id="pricing" className="py-16 md:py-20">
        <ClearPricingSection />
      </section>

      {/* FINAL CTA - Last chance to convert */}
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
              <a href="#try-free" className="w-full sm:w-auto max-w-sm">
                <MythButton 
                  className="w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-6 h-6" />
                      Start FREE Trial Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  }
                />
              </a>
              <a href="#pricing" className="w-full sm:w-auto max-w-sm">
                <MythButton 
                  className="w-full border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 text-lg px-8 py-4 transition-all duration-300"
                  label="View All Plans"
                />
              </a>
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
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                60-day money-back guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      <FeedbackButton />
      
      {/* Enhanced Immersive 3D Styles */}
      <style jsx>{`
        /* Main container enhancements - optimized for performance */
        .bg-myth-background {
          background: 
            radial-gradient(circle at 25% 25%, #00D4FF08 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #7C3AED08 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #10B98108 0%, transparent 50%),
            #0A0A0A;
          background-attachment: scroll; /* Fixed attachment causes scroll lag */
        }
        
        /* Enhanced section styling - balanced performance */
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
        
        /* Pricing section special styling */
        #pricing {
          background: 
            radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 70%),
            rgba(10, 10, 10, 0.6);
          border: 2px solid rgba(0, 212, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(0, 212, 255, 0.05);
        }
        
        /* Try-free section highlighting */
        #try-free {
          background: 
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%),
            rgba(10, 10, 10, 0.6);
          border: 2px solid rgba(16, 185, 129, 0.2);
        }
        
        /* Hero section special effects - enhanced */
        section:first-of-type {
          background: 
            radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%),
            rgba(10, 10, 10, 0.4);
          border: 2px solid rgba(0, 212, 255, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(0, 212, 255, 0.1);
        }
        
        /* Video sections enhancement - dramatic but performant */
        video {
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(0, 212, 255, 0.3);
          border: 2px solid rgba(0, 212, 255, 0.4);
          border-radius: 16px;
          transform: translateZ(0);
        }
        
        /* Video container hover effects */
        .video-container:hover video {
          transform: scale(1.02);
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(0, 212, 255, 0.4);
        }
        
        /* Enhanced button effects */
        button, .myth-button {
          position: relative;
          overflow: hidden;
        }
        
        button::before, .myth-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        button:hover::before, .myth-button:hover::before {
          left: 100%;
        }
        
        /* Scroll-based animations */
        @keyframes float-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .myth-card {
          animation: float-in 0.8s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        
        /* Enhanced glow effects for impact */
        h1, h2 {
          text-shadow: 
            0 0 20px rgba(0, 212, 255, 0.6),
            0 0 40px rgba(0, 212, 255, 0.3);
        }
        
        /* Special hero title glow */
        h1 {
          text-shadow: 
            0 0 30px rgba(0, 212, 255, 0.8),
            0 0 60px rgba(0, 212, 255, 0.4),
            0 0 90px rgba(0, 212, 255, 0.2);
        }
        
        /* Removed section hover effects to prevent scroll lag */
        /* Heavy transforms and shadows on scroll are performance killers */
        
        /* Performance optimizations */
        * {
          will-change: auto;
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selective smooth transitions - only on interactive elements */
        button, .myth-button, a, .myth-card, video {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced card hover effects */
        .myth-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        /* Button hover enhancements */
        button:hover, .myth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .immersive-floating-cubes,
        .energy-field {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Responsive optimizations */
        @media (max-width: 1200px) {
          section {
            margin: 0.5rem 0;
          }
        }
        
        @media (max-width: 768px) {
          section {
            background: rgba(10, 10, 10, 0.8);
            margin: 0;
            border-radius: 0;
          }
          
          h1, h2 {
            text-shadow: 0 0 5px rgba(0, 212, 255, 0.2);
          }
        }
        
        @media (max-width: 480px) {
          section {
            background: rgba(10, 10, 10, 0.95);
          }
        }
        
        /* High performance mode */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          
          section {
            background: rgba(10, 10, 10, 0.9);
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          .bg-myth-background {
            background: 
              radial-gradient(circle at 25% 25%, #00D4FF12 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #7C3AED12 0%, transparent 50%),
              #000000;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          section {
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00D4FF;
          }
          
          h1, h2 {
            text-shadow: none;
            color: #FFFFFF;
          }
        }
        
        /* Performance optimizations for scroll smoothness */
        .immersive-floating-cubes,
        .energy-field,
        video {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Optimize scroll performance */
        body {
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(10, 10, 10, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00D4FF, #7C3AED);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #00B4DF, #6C2ACD);
        }
      `}</style>
    </div>
  );
};

export default OptimizedIndex;
