import React from 'react';
import { Link } from 'react-router-dom';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import FeedbackButton from '@/components/FeedbackButton';
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
  Clock,
  Trophy,
  BookOpen,
  Heart,
  Lightbulb,
  Rocket,
  Globe,
  MessageCircle
} from 'lucide-react';

// Import all 3 videos
import aicubeVideo from '../../assets/aicubevideo.mp4';
import aicube2Video from '../../assets/aicube2.mp4';
import aicube3Video from '../../assets/aicube3.mp4';

const ComprehensiveHomepage = () => {
  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden">
      <MetaHead
        title="AI Cube - Complete AI Education Platform | Learn Through Play"
        description="The complete AI education platform for children. 3 free games, comprehensive curriculum, parent insights, and family learning - all in one place."
        url="https://aicube.ai/"
        image="https://aicube.ai/og-image-home.png"
      />
      <Navigation />
      
      {/* HERO SECTION - Ultimate conversion focus */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x leading-tight">
            Your Child's AI Future
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl">Starts Here</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            The complete AI education platform. Interactive games, parent insights, progress tracking, and family learning - everything you need in one place.
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
            <a href="#try-free" className="w-full sm:w-auto">
              <MythButton 
                className="w-full sm:w-auto bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-2xl hover:shadow-electricCyan/40 text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300"
                label={
                  <>
                    <Play className="w-6 h-6" />
                    Try 3 Games FREE Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                }
              />
            </a>
            <a href="#pricing" className="w-full sm:w-auto">
              <MythButton 
                className="w-full sm:w-auto border-2 border-electricCyan text-electricCyan hover:bg-electricCyan/10 text-lg px-8 py-4 transition-all duration-300"
                label="See Family Plans"
              />
            </a>
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
      </section>

      {/* VIDEO SHOWCASE - All 3 videos in large format */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-myth-background to-myth-surface/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              See AI Learning In Action
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Watch how our interactive 3D games make complex AI concepts simple and fun for children of all ages
            </p>
          </div>
          
          {/* VIDEO 1 - Primary Demo */}
          <div className="mb-20">
            <div className="relative max-w-6xl mx-auto">
              <video
                className="w-full h-auto rounded-2xl shadow-2xl border border-myth-accent/20"
                style={{ minHeight: '400px', maxHeight: '700px' }}
                autoPlay
                loop
                muted
                playsInline
                aria-label="AI Cube Main Demo"
              >
                <source src={aicubeVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <a href="#try-free">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center gap-3 font-bold"
                    label={
                      <>
                        <Play className="w-6 h-6" />
                        Try These Games Now
                      </>
                    }
                  />
                </a>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-myth-textPrimary mb-3">Complete AI Learning Platform</h3>
              <p className="text-myth-textSecondary text-lg max-w-2xl mx-auto">
                Interactive 3D games, progress tracking, parent insights, and family learning tools - everything you need to prepare your child for an AI-powered future.
              </p>
            </div>
          </div>

          {/* VIDEO 2 - Neural Network Demo */}
          <div className="mb-20">
            <div className="relative max-w-6xl mx-auto">
              <video
                className="w-full h-auto rounded-2xl shadow-2xl border border-myth-accent/20"
                style={{ minHeight: '400px', maxHeight: '700px' }}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Neural Network Chamber Demo"
              >
                <source src={aicube2Video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <a href="#try-free">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center gap-3 font-bold"
                    label={
                      <>
                        <Brain className="w-6 h-6" />
                        Build Neural Networks
                      </>
                    }
                  />
                </a>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-myth-textPrimary mb-3">Neural Network Chamber</h3>
              <p className="text-myth-textSecondary text-lg max-w-2xl mx-auto">
                Build AI brains by connecting neurons in 3D space. Children learn how artificial intelligence actually works by constructing and training their own neural networks.
              </p>
            </div>
          </div>

          {/* VIDEO 3 - Snake Game Demo */}
          <div className="mb-16">
            <div className="relative max-w-6xl mx-auto">
              <video
                className="w-full h-auto rounded-2xl shadow-2xl border border-myth-accent/20"
                style={{ minHeight: '400px', maxHeight: '700px' }}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Snake3 Programming Game Demo"
              >
                <source src={aicube3Video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <a href="#try-free">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center gap-3 font-bold"
                    label={
                      <>
                        <Gamepad2 className="w-6 h-6" />
                        Learn Programming
                      </>
                    }
                  />
                </a>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-myth-textPrimary mb-3">Snake³ Programming Adventure</h3>
              <p className="text-myth-textSecondary text-lg max-w-2xl mx-auto">
                Learn programming fundamentals through 3D snake navigation. Master sequential instructions, loops, and algorithmic thinking in an engaging game environment.
              </p>
            </div>
          </div>

          {/* CTA after videos */}
          <div className="text-center">
            <a href="#try-free">
              <MythButton 
                className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-12 py-6 flex items-center gap-3 mx-auto font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl"
                label={
                  <>
                    <Play className="w-6 h-6" />
                    Experience All Games FREE
                    <ArrowRight className="w-5 h-5" />
                  </>
                }
              />
            </a>
            <p className="text-myth-textSecondary mt-4">No signup required • Instant access • 3 full games</p>
          </div>
        </div>
      </section>

      {/* TRY FREE SECTION - Embedded in scroll */}
      <section id="try-free" className="py-20 md:py-24 bg-gradient-to-b from-myth-surface/10 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-neonMint/10 border border-neonMint/30 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-neonMint" />
              <span className="text-neonMint font-semibold">No Signup Required</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-6">
              Try 3 AI Games FREE
            </h2>
            
            <p className="text-xl text-myth-textSecondary max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience the future of AI education instantly. No forms, no waiting, no credit card required. 
              Just click and start learning!
            </p>
          </div>

          {/* Free Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                id: 'snake3',
                title: 'Snake³',
                description: 'Learn programming basics through 3D snake navigation',
                duration: '10-15 min',
                concept: 'Sequential Programming',
                difficulty: 'Beginner',
                icon: '🐍',
                path: '/games/snake-3'
              },
              {
                id: 'crystal-resonance',
                title: 'Crystal Resonance',
                description: 'Master pattern recognition through musical sequences',
                duration: '8-12 min',
                concept: 'Pattern Recognition',
                difficulty: 'Beginner',
                icon: '🎵',
                path: '/games/crystal-resonance'
              },
              {
                id: 'neural-network-chamber',
                title: 'Neural Network Chamber',
                description: 'Build and train artificial neural networks',
                duration: '15-20 min',
                concept: 'Neural Networks',
                difficulty: 'Intermediate',
                icon: '🧠',
                path: '/games/neural-network-chamber'
              }
            ].map((game) => (
              <MythCard key={game.id} className="relative overflow-hidden hover:border-myth-accent/50 transition-all duration-300 group">
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{game.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {game.difficulty}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-myth-textPrimary mb-2">{game.title}</h3>
                  <p className="text-myth-textSecondary text-sm mb-4 leading-relaxed">{game.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                      <Clock className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                      <Brain className="w-4 h-4" />
                      <span>Learn: {game.concept}</span>
                    </div>
                  </div>
                  
                  <Link to={game.path}>
                    <MythButton 
                      className="w-full bg-myth-accent text-myth-background hover:bg-myth-secondary transition-all duration-300 flex items-center justify-center gap-2"
                      label={
                        <>
                          <Play className="w-4 h-4" />
                          Play Now FREE
                        </>
                      }
                    />
                  </Link>
                </div>
              </MythCard>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-myth-textSecondary mb-6">
              Love the free games? Unlock 11 more AI adventures with a family plan.
            </p>
            <a href="#pricing">
              <MythButton 
                className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-3"
                label="See Family Plans"
              />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Embedded */}
      <section id="features" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
              Complete AI Education Platform
            </h2>
            <p className="text-lg text-myth-textSecondary max-w-3xl mx-auto">
              Everything you need to give your child the AI advantage - games, progress tracking, parent insights, and family learning tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: '14 Interactive Games',
                description: 'From neural networks to quantum computing - comprehensive AI curriculum',
                color: 'electricCyan'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Progress Tracking',
                description: 'Detailed analytics showing skill development and learning milestones',
                color: 'neonMint'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Parent Dashboard',
                description: 'Real-time insights, discussion prompts, and family engagement tools',
                color: 'purple-400'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Age-Adaptive',
                description: 'Automatically adjusts complexity for ages 6-16 with perfect difficulty',
                color: 'yellow-400'
              }
            ].map((feature, index) => (
              <MythCard key={index} className="p-6 text-center hover:border-myth-accent/50 transition-all duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  feature.color === 'electricCyan' ? 'bg-electricCyan/20 text-electricCyan' :
                  feature.color === 'neonMint' ? 'bg-neonMint/20 text-neonMint' :
                  feature.color === 'purple-400' ? 'bg-purple-400/20 text-purple-400' :
                  'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-myth-textPrimary mb-3">{feature.title}</h3>
                <p className="text-myth-textSecondary leading-relaxed">{feature.description}</p>
              </MythCard>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Embedded */}
      <section id="testimonials" className="py-20 md:py-24 bg-gradient-to-b from-myth-background to-myth-surface/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                location: 'Parent, California',
                rating: 5,
                text: 'My 10-year-old daughter now explains neural networks to her friends. She plays this more than Roblox!',
                avatar: 'S'
              },
              {
                name: 'Mike R.',
                location: 'Homeschool Dad, Texas',
                rating: 5,
                text: 'Finally, an AI course that doesn\'t put kids to sleep! Both my boys are obsessed and actually learning.',
                avatar: 'M'
              },
              {
                name: 'Jennifer L.',
                location: 'Parent, New York',
                rating: 5,
                text: 'The parent dashboard helps me track progress and start amazing conversations about AI with my kids.',
                avatar: 'J'
              }
            ].map((testimonial, index) => (
              <MythCard key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-myth-textSecondary italic mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-myth-textPrimary">{testimonial.name}</p>
                    <p className="text-sm text-myth-textSecondary">{testimonial.location}</p>
                  </div>
                </div>
              </MythCard>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - Embedded */}
      <section id="pricing" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-6">
              Choose Your Family Plan
            </h2>
            <p className="text-xl text-myth-textSecondary max-w-3xl mx-auto mb-8">
              Simple, transparent pricing that grows with your family's AI learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Family Plan */}
            <MythCard className="relative p-8 border-2 border-electricCyan shadow-lg shadow-electricCyan/20 scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-electricCyan mr-2" />
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
                    Family Plan
                  </h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-gray-400 ml-1">/month</span>
                  <div className="text-sm text-gray-400">or $120/year (save 33%)</div>
                </div>
                
                <div className="bg-myth-surface/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-myth-textSecondary">
                    Just <span className="text-electricCyan font-bold">$3.75/child/month</span> for complete AI education
                  </p>
                </div>
                
                <div className="space-y-3 mb-8 text-left">
                  {[
                    'All 14 interactive AI games',
                    'Up to 4 child profiles',
                    'Parent progress dashboard',
                    'Real-time learning insights',
                    'Achievement system & certificates',
                    'Family challenges & competitions',
                    'Email support',
                    '14-day free trial'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-neonMint mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/payment">
                  <MythButton
                    className="w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30 font-bold"
                    label="Start Free Trial"
                  />
                </Link>
              </div>
            </MythCard>

            {/* Premium Family Plan */}
            <MythCard className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-purple-400 mr-2" />
                  <h3 className="text-2xl font-bold text-myth-textPrimary">Premium Family</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$25</span>
                  <span className="text-gray-400 ml-1">/month</span>
                  <div className="text-sm text-gray-400">or $200/year (save 33%)</div>
                </div>
                
                <div className="space-y-3 mb-8 text-left">
                  {[
                    'Everything in Family Plan',
                    'Monthly 1-on-1 AI mentorship calls',
                    'Custom learning paths for each child',
                    'Advanced progress analytics',
                    'Early access to new games',
                    'Priority support (24hr response)',
                    'Exclusive premium community',
                    'Downloadable progress reports'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-neonMint mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/payment">
                  <MythButton
                    className="w-full border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10"
                    label="Unlock Premium"
                  />
                </Link>
              </div>
            </MythCard>
          </div>

          {/* Trust indicators */}
          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                60-day money-back guarantee
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                No setup fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT/PHILOSOPHY SECTION - Embedded */}
      <section id="about" className="py-20 md:py-24 bg-gradient-to-b from-myth-surface/10 to-myth-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
                Our Mission: Prepare Every Child for an AI Future
              </h2>
              <div className="space-y-4 text-lg text-myth-textSecondary">
                <p>
                  We believe every child deserves to understand and shape the AI-powered world they'll inherit. 
                  Traditional education isn't keeping pace with technological advancement.
                </p>
                <p>
                  That's why we created AI Cube - to make artificial intelligence accessible, engaging, 
                  and educational for children of all ages through the power of interactive play.
                </p>
                <p>
                  Our games don't just entertain; they build genuine understanding of neural networks, 
                  machine learning, computer vision, and other AI concepts that will define the future.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-myth-accent">2,847+</div>
                  <div className="text-myth-textSecondary">Families Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neonMint">15+</div>
                  <div className="text-myth-textSecondary">Countries Reached</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  icon: <Lightbulb className="w-6 h-6" />,
                  title: 'Learn Through Discovery',
                  description: 'Children learn best when they discover concepts through hands-on exploration and play.'
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: 'Family-Centered Learning',
                  description: 'Parents and children learn together, creating shared understanding and meaningful conversations.'
                },
                {
                  icon: <Rocket className="w-6 h-6" />,
                  title: 'Future-Ready Skills',
                  description: 'We focus on skills that will matter in 2030 and beyond, not just today\'s technology.'
                }
              ].map((principle, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-myth-accent/20 rounded-lg flex items-center justify-center text-myth-accent flex-shrink-0">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-myth-textPrimary mb-2">{principle.title}</h3>
                    <p className="text-myth-textSecondary">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-myth-surface/30 to-myth-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-6">
            Give Your Child the AI Advantage Today
          </h2>
          <p className="text-lg text-myth-textSecondary mb-8 leading-relaxed">
            Don't let your child fall behind in the AI revolution. Start their journey with 3 free games - no signup required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="#try-free" className="w-full sm:w-auto">
              <MythButton 
                className="w-full sm:w-auto bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center justify-center gap-3 font-bold transform hover:scale-105 transition-all duration-300"
                label={
                  <>
                    <Play className="w-6 h-6" />
                    Start FREE Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                }
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
      </section>

      <FeedbackButton />
    </div>
  );
};

export default ComprehensiveHomepage;
