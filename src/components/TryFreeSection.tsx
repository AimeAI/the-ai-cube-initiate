import React from 'react';
import { Link } from 'react-router-dom';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { 
  Play, 
  Star, 
  Clock, 
  Brain, 
  Gamepad2, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

const TryFreeSection: React.FC = () => {
  const freeGames = [
    {
      id: 'snake-3',
      title: 'Snake³',
      description: 'Learn programming basics through 3D snake navigation',
      duration: '10-15 min',
      concept: 'Sequential Programming',
      difficulty: 'Beginner',
      icon: '🐍',
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'crystal-resonance',
      title: 'Crystal Resonance',
      description: 'Master pattern recognition through musical sequences',
      duration: '8-12 min',
      concept: 'Pattern Recognition',
      difficulty: 'Beginner',
      icon: '🎵',
      color: 'from-purple-400 to-pink-600'
    },
    {
      id: 'neural-network-chamber',
      title: 'Neural Network Chamber',
      description: 'Build and train artificial neural networks',
      duration: '15-20 min',
      concept: 'Neural Networks',
      difficulty: 'Intermediate',
      icon: '🧠',
      color: 'from-blue-400 to-cyan-600'
    }
  ];

  return (
    <section id="try-free" className="py-20 md:py-24 bg-gradient-to-b from-myth-background via-myth-surface/10 to-myth-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
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
          
          {/* Immediate CTA */}
          <Link to="/try-free">
            <MythButton 
              className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-xl px-10 py-5 flex items-center gap-3 mx-auto font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-electricCyan/40"
              label={
                <>
                  <Play className="w-6 h-6" />
                  Start Playing Now
                  <ArrowRight className="w-5 h-5" />
                </>
              }
            />
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">
            ⚡ Instant access • 🎮 3 full games • 🧠 Real AI learning
          </p>
        </div>

        {/* Free Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {freeGames.map((game, index) => (
            <MythCard key={game.id} className="relative overflow-hidden hover:border-myth-accent/50 transition-all duration-300 group">
              {/* Game preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300" 
                   style={{ background: `linear-gradient(135deg, var(--electricCyan), var(--neonMint))` }} />
              
              <div className="relative p-6">
                {/* Game header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{game.icon}</div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {game.difficulty}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-myth-textPrimary mb-2">{game.title}</h3>
                <p className="text-myth-textSecondary text-sm mb-4 leading-relaxed">{game.description}</p>
                
                {/* Game details */}
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
                
                {/* Play button */}
                <Link to={`/games/${game.id}`}>
                  <MythButton 
                    className="w-full bg-myth-accent text-myth-background hover:bg-myth-secondary transition-all duration-300 flex items-center justify-center gap-2"
                    label={
                      <>
                        <Play className="w-4 h-4" />
                        Play Now
                      </>
                    }
                  />
                </Link>
              </div>
            </MythCard>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-myth-surface/30 to-myth-accent/5 rounded-2xl p-8 md:p-12 border border-myth-accent/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-myth-accent mb-6">
                Why Start with Free Games?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-neonMint mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-myth-textPrimary">Instant Gratification</p>
                    <p className="text-myth-textSecondary text-sm">See your child engaged and learning within minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-neonMint mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-myth-textPrimary">Risk-Free Experience</p>
                    <p className="text-myth-textSecondary text-sm">No commitment, no signup, no credit card required</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-neonMint mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-myth-textPrimary">Real AI Learning</p>
                    <p className="text-myth-textSecondary text-sm">Genuine educational value, not just entertainment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-neonMint mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-myth-textPrimary">Age-Appropriate</p>
                    <p className="text-myth-textSecondary text-sm">Automatically adapts to your child's age and skill level</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <div className="bg-myth-accent/10 border border-myth-accent/30 rounded-xl p-6 mb-6">
                <div className="text-3xl font-bold text-myth-accent mb-2">2,847+</div>
                <p className="text-myth-textSecondary">Families started with free games</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-myth-textPrimary font-semibold ml-2">4.9/5 rating</span>
              </div>
              
              <Link to="/try-free">
                <MythButton 
                  className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-8 py-4 flex items-center gap-2 mx-auto lg:mx-0 font-bold"
                  label={
                    <>
                      <Gamepad2 className="w-5 h-5" />
                      Try All 3 Games FREE
                    </>
                  }
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Transition to paid plans */}
        <div className="text-center mt-16">
          <p className="text-lg text-myth-textSecondary mb-6">
            Love the free games? Unlock 12 more AI adventures with a family plan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="#pricing">
              <MythButton 
                className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-3"
                label="See Family Plans"
              />
            </Link>
            
            <span className="text-myth-textSecondary text-sm">
              or continue with free games forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryFreeSection;
