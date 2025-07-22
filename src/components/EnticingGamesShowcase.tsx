import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MythButton } from './myth/MythButton';
import { MythCard } from './myth/MythCard';
import { 
  Play, 
  Lock, 
  Star, 
  Clock, 
  Brain, 
  Gamepad2, 
  Zap,
  Crown,
  Sparkles,
  Target,
  Eye,
  Rocket,
  Award,
  Unlock
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  concept: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: string;
  color: string;
  gradient: string;
  isFree: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  skills: string[];
  ageRange: string;
  preview?: string;
}

const gamesData: Game[] = [
  // Free Games - Actually available
  {
    id: 'snake-3',
    title: 'Snake³',
    description: 'Navigate a 3D snake through data nodes and learn programming logic',
    longDescription: 'Master programming fundamentals through this engaging 3D twist on the classic Snake game. Learn loops, conditionals, and basic algorithmic thinking.',
    concept: 'Programming Logic',
    difficulty: 'Beginner',
    duration: '10-15 min',
    icon: '🐍',
    color: 'from-green-400 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-400/20 to-emerald-600/20',
    isFree: true,
    isPopular: true,
    skills: ['Programming Logic', 'Problem Solving', 'Spatial Reasoning'],
    ageRange: '6+ years',
    preview: 'Navigate through 3D space with programming logic'
  },
  {
    id: 'crystal-resonance',
    title: 'Crystal Resonance',
    description: 'Harmonize crystal frequencies and master pattern recognition',
    longDescription: 'Develop pattern recognition skills through beautiful musical sequences and crystal harmonics. Learn the foundation of how AI recognizes patterns.',
    concept: 'Pattern Recognition',
    difficulty: 'Beginner',
    duration: '8-12 min',
    icon: '🎵',
    color: 'from-purple-400 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-400/20 to-pink-600/20',
    isFree: true,
    skills: ['Pattern Recognition', 'Memory', 'Audio Processing'],
    ageRange: '6+ years',
    preview: 'Create beautiful patterns with musical sequences'
  },
  {
    id: 'neural-network-chamber',
    title: 'Neural Network Chamber',
    description: 'Experiment with neural architectures in a virtual lab environment',
    longDescription: 'Get hands-on experience with neural networks in an interactive virtual laboratory. Learn the basics of how AI systems process information.',
    concept: 'Neural Networks',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    icon: '🧠',
    color: 'from-blue-400 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-400/20 to-cyan-600/20',
    isFree: true,
    isPopular: true,
    skills: ['Neural Networks', 'Data Processing', 'AI Concepts'],
    ageRange: '8+ years',
    preview: 'Experiment with AI neural network architectures'
  },

  // Premium Games - Available with subscription
  {
    id: 'neural-forge',
    title: 'Neural Forge',
    description: 'Craft and train neural networks in advanced simulations',
    longDescription: 'Advanced neural network training and experimentation. Build more complex AI systems and understand deep learning concepts.',
    concept: 'Advanced Neural Networks',
    difficulty: 'Advanced',
    duration: '20-25 min',
    icon: '⚒️',
    color: 'from-red-400 to-orange-600',
    gradient: 'bg-gradient-to-br from-red-400/20 to-orange-600/20',
    isFree: false,
    skills: ['Deep Learning', 'AI Training', 'Advanced Concepts'],
    ageRange: '10+ years',
    preview: 'Build and train advanced neural networks'
  },
  {
    id: 'decision-tree',
    title: 'Decision Tree Mastery',
    description: 'Master decision tree algorithms and logical reasoning',
    longDescription: 'Learn how AI systems make decisions through decision trees. Understand logical reasoning and algorithmic decision-making.',
    concept: 'Decision Trees & Logic',
    difficulty: 'Intermediate',
    duration: '15-18 min',
    icon: '🌳',
    color: 'from-green-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-green-500/20 to-teal-600/20',
    isFree: false,
    skills: ['Logical Reasoning', 'Decision Making', 'Algorithms'],
    ageRange: '8+ years',
    preview: 'Build decision trees that make smart choices'
  },
  {
    id: 'classifier-construct',
    title: 'Classifier Construct',
    description: 'Build and test data classifiers in competitive challenges',
    longDescription: 'Create AI systems that can classify and categorize data. Learn how AI recognizes and sorts different types of information.',
    concept: 'Data Classification',
    difficulty: 'Intermediate',
    duration: '16-20 min',
    icon: '📊',
    color: 'from-cyan-400 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-400/20 to-blue-600/20',
    isFree: false,
    skills: ['Data Analysis', 'Classification', 'AI Logic'],
    ageRange: '9+ years',
    preview: 'Train AI to classify and sort data'
  },
  {
    id: 'vision-system',
    title: 'Vision System Challenge',
    description: 'Develop and test computer vision systems',
    longDescription: 'Learn how AI "sees" and processes visual information. Understand the basics of computer vision and image recognition.',
    concept: 'Computer Vision',
    difficulty: 'Advanced',
    duration: '18-22 min',
    icon: '👁️',
    color: 'from-orange-400 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-400/20 to-red-600/20',
    isFree: false,
    skills: ['Computer Vision', 'Image Processing', 'AI Recognition'],
    ageRange: '10+ years',
    preview: 'Teach AI to see and recognize images'
  },
  {
    id: 'ethics-framework',
    title: 'Ethics Framework',
    description: 'Navigate ethical dilemmas in AI development',
    longDescription: 'Explore important questions about AI ethics and responsible technology development. Learn to think critically about AI\'s impact on society.',
    concept: 'AI Ethics & Responsibility',
    difficulty: 'Advanced',
    duration: '20-25 min',
    icon: '⚖️',
    color: 'from-slate-400 to-gray-600',
    gradient: 'bg-gradient-to-br from-slate-400/20 to-gray-600/20',
    isFree: false,
    skills: ['Ethics', 'Critical Thinking', 'Social Responsibility'],
    ageRange: '12+ years',
    preview: 'Explore the ethical dimensions of AI technology'
  }
];

const EnticingGamesShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'free' | 'premium'>('all');
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const freeGames = gamesData.filter(game => game.isFree);
  const premiumGames = gamesData.filter(game => !game.isFree);

  const getFilteredGames = () => {
    switch (selectedCategory) {
      case 'free': return freeGames;
      case 'premium': return premiumGames;
      default: return gamesData;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2 mb-6">
            <Gamepad2 className="w-5 h-5 text-electricCyan animate-pulse" />
            <span className="text-electricCyan font-semibold">15 AI Learning Games Available</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-6">
            Start Learning AI Through Play
          </h2>
          
          <p className="text-xl text-myth-textSecondary max-w-4xl mx-auto mb-8 leading-relaxed">
            From beginner-friendly games to advanced AI concepts, our curriculum includes 15 interactive games. 
            <span className="text-electricCyan font-semibold"> Start with 3 free games, unlock all 15 with a subscription.</span>
          </p>

          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-12">
            {[
              { id: 'all', label: 'All Games', count: gamesData.length },
              { id: 'free', label: 'Free Games', count: freeGames.length },
              { id: 'premium', label: 'Premium Games', count: premiumGames.length }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack shadow-lg'
                    : 'bg-myth-surface/30 text-myth-textSecondary hover:bg-myth-surface/50 hover:text-myth-textPrimary'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Free Games Section */}
        {(selectedCategory === 'all' || selectedCategory === 'free') && (
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1" />
              <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-full px-6 py-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-lg">FREE FOREVER</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {freeGames.map((game, index) => (
                <MythCard 
                  key={game.id} 
                  className="relative overflow-hidden hover:border-green-400/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                  {/* Game preview overlay */}
                  <div className={`absolute inset-0 ${game.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      FREE
                    </div>
                    {game.isPopular && (
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    )}
                  </div>
                  
                  <div className="relative p-6 flex-1 flex flex-col">
                    {/* Game header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{game.icon}</div>
                      <div className="flex-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(game.difficulty)} mb-2 inline-block`}>
                          {game.difficulty}
                        </div>
                        <h3 className="text-xl font-bold text-myth-textPrimary">{game.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-myth-textSecondary text-sm mb-4 leading-relaxed flex-1">{game.description}</p>
                    
                    {/* Game details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                        <Clock className="w-4 h-4" />
                        <span>{game.duration}</span>
                        <span className="text-myth-accent">•</span>
                        <span>{game.ageRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                        <Brain className="w-4 h-4" />
                        <span>Learn: {game.concept}</span>
                      </div>
                      {hoveredGame === game.id && game.preview && (
                        <div className="flex items-center gap-2 text-sm text-electricCyan animate-fade-in">
                          <Eye className="w-4 h-4" />
                          <span>{game.preview}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-myth-surface/50 text-myth-textSecondary px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Play button */}
                    <Link to={`/games/${game.id}`} className="mt-auto">
                      <MythButton 
                        className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-400/30 transition-all duration-300 flex items-center justify-center gap-2 py-3"
                        label={
                          <>
                            <Play className="w-5 h-5" />
                            Play Free Now
                          </>
                        }
                      />
                    </Link>
                  </div>
                </MythCard>
              ))}
            </div>

            {/* Free games CTA */}
            <div className="text-center">
              <Link to="/try-free">
                <MythButton 
                  className="bg-gradient-to-r from-green-400 to-emerald-600 text-white text-lg px-8 py-4 flex items-center gap-2 mx-auto font-bold transform hover:scale-105 transition-all duration-300 shadow-xl"
                  label={
                    <>
                      <Rocket className="w-6 h-6" />
                      Start Playing Free Games Now
                    </>
                  }
                />
              </Link>
              <p className="text-sm text-myth-textSecondary mt-3">No signup required • Play instantly</p>
            </div>
          </div>
        )}

        {/* Premium Games Section */}
        {(selectedCategory === 'all' || selectedCategory === 'premium') && (
          <div>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-electricCyan to-transparent flex-1" />
              <div className="flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2">
                <Crown className="w-5 h-5 text-electricCyan" />
                <span className="text-electricCyan font-bold text-lg">PREMIUM COLLECTION</span>
                <Sparkles className="w-5 h-5 text-neonMint animate-spin" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-electricCyan to-transparent flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {premiumGames.map((game, index) => (
                <MythCard 
                  key={game.id} 
                  className="relative overflow-hidden hover:border-electricCyan/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                  {/* Game preview overlay */}
                  <div className={`absolute inset-0 ${game.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Premium overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-electricCyan/5 to-neonMint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      PREMIUM
                    </div>
                    {game.isNew && (
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        NEW
                      </div>
                    )}
                    {game.isPopular && (
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    )}
                  </div>
                  
                  <div className="relative p-6 flex-1 flex flex-col">
                    {/* Game header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{game.icon}</div>
                      <div className="flex-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(game.difficulty)} mb-2 inline-block`}>
                          {game.difficulty}
                        </div>
                        <h3 className="text-xl font-bold text-myth-textPrimary">{game.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-myth-textSecondary text-sm mb-4 leading-relaxed flex-1">{game.description}</p>
                    
                    {/* Game details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                        <Clock className="w-4 h-4" />
                        <span>{game.duration}</span>
                        <span className="text-myth-accent">•</span>
                        <span>{game.ageRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-myth-textSecondary">
                        <Brain className="w-4 h-4" />
                        <span>Learn: {game.concept}</span>
                      </div>
                      {hoveredGame === game.id && game.preview && (
                        <div className="flex items-center gap-2 text-sm text-electricCyan animate-fade-in">
                          <Eye className="w-4 h-4" />
                          <span>{game.preview}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-myth-surface/50 text-myth-textSecondary px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Unlock button */}
                    <Link to="/pricing" className="mt-auto">
                      <MythButton 
                        className="w-full bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-xl hover:shadow-electricCyan/30 transition-all duration-300 flex items-center justify-center gap-2 py-3 font-bold"
                        label={
                          <>
                            <Unlock className="w-5 h-5" />
                            Unlock This Game
                          </>
                        }
                      />
                    </Link>
                  </div>
                </MythCard>
              ))}
            </div>

            {/* Premium games CTA */}
            <div className="text-center bg-gradient-to-r from-electricCyan/10 to-neonMint/10 border border-electricCyan/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-myth-accent mb-4">
                Unlock All 15 AI Learning Games
              </h3>
              <p className="text-lg text-myth-textSecondary mb-6 max-w-2xl mx-auto">
                Get access to all 15 AI learning games including advanced concepts like quantum computing, computer vision, and reinforcement learning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/pricing">
                  <MythButton 
                    className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300 shadow-xl"
                    label={
                      <>
                        <Crown className="w-6 h-6" />
                        View Subscription Plans
                      </>
                    }
                  />
                </Link>
                
                <div className="text-sm text-myth-textSecondary">
                  Starting at <span className="text-electricCyan font-semibold">$12.99/month</span> • 14-day free trial
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Hover effects */
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        
        /* Performance optimizations */
        .transform {
          will-change: transform;
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-spin,
          .transition-all {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default EnticingGamesShowcase;
