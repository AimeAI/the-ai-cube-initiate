import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { Play, Star, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuestModeProps {
  onEmailCapture: (email: string) => void;
  onUpgrade: () => void;
}

const GUEST_GAMES = [
  {
    id: 'snake-3',
    title: 'Snake³',
    description: 'Navigate the cybernetic serpent through data nodes',
    path: '/games/snake-3',
    difficulty: 'Beginner',
    duration: '5-10 min',
    skills: ['Logic', 'Pattern Recognition']
  },
  {
    id: 'neural-network-chamber',
    title: 'Neural Network Chamber',
    description: 'Build your first neural network',
    path: '/games/neural-network-chamber',
    difficulty: 'Intermediate',
    duration: '10-15 min',
    skills: ['AI Fundamentals', 'Problem Solving']
  },
  {
    id: 'crystal-resonance',
    title: 'Crystal Resonance',
    description: 'Harmonize frequencies to unlock patterns',
    path: '/games/crystal-resonance',
    difficulty: 'Beginner',
    duration: '5-10 min',
    skills: ['Pattern Recognition', 'Spatial Reasoning']
  }
];

const GuestMode: React.FC<GuestModeProps> = ({ onEmailCapture, onUpgrade }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Track time spent in guest mode
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Show email capture after 10 minutes or 2 games
  useEffect(() => {
    if ((timeSpent >= 10 || gamesPlayed >= 2) && !showEmailCapture) {
      setShowEmailCapture(true);
    }
  }, [timeSpent, gamesPlayed, showEmailCapture]);

  // Show upgrade prompt after 3 games or 20 minutes
  useEffect(() => {
    if ((timeSpent >= 20 || gamesPlayed >= 3) && !showUpgradePrompt) {
      setShowUpgradePrompt(true);
    }
  }, [timeSpent, gamesPlayed, showUpgradePrompt]);

  const handleGameClick = (gameId: string, path: string) => {
    // Track game played
    setGamesPlayed(prev => prev + 1);
    
    // Store guest progress
    const guestProgress = JSON.parse(localStorage.getItem('guestProgress') || '{}');
    guestProgress[gameId] = {
      played: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('guestProgress', JSON.stringify(guestProgress));
    
    // Navigate to game
    navigate(path + '?guest=true');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onEmailCapture(email);
      setShowEmailCapture(false);
      // Store email for later conversion
      localStorage.setItem('guestEmail', email);
    }
  };

  return (
    <div className="min-h-screen bg-myth-background text-myth-textPrimary p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-4">
          Try AI Cube Free
        </h1>
        <p className="text-xl text-myth-textSecondary max-w-2xl mx-auto">
          Experience our interactive AI games with no signup required. Start learning immediately!
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-neonMint" />
            <span className="text-myth-textSecondary">{gamesPlayed}/3 games played</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-electricCyan" />
            <span className="text-myth-textSecondary">{timeSpent} minutes</span>
          </div>
        </div>
      </div>

      {/* Free Games Grid */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-myth-accent mb-6 text-center">
          Free AI Learning Games
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUEST_GAMES.map((game) => (
            <MythCard key={game.id} className="hover:border-myth-accent/50 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-myth-accent">{game.title}</h3>
                  <div className="text-xs bg-myth-accent/20 text-myth-accent px-2 py-1 rounded">
                    {game.difficulty}
                  </div>
                </div>
                
                <p className="text-myth-textSecondary mb-4">{game.description}</p>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-myth-textSecondary">
                  <Clock className="w-4 h-4" />
                  <span>{game.duration}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-6">
                  {game.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-myth-surface px-2 py-1 rounded text-myth-textSecondary">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <MythButton
                  onClick={() => handleGameClick(game.id, game.path)}
                  className="w-full"
                  label="Play Now"
                />
              </div>
            </MythCard>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-4xl mx-auto mb-12">
        <MythCard>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-myth-accent mb-4">
              Why Parents Choose AI Cube
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-electricCyan" />
                </div>
                <h4 className="font-bold mb-2">Real Learning</h4>
                <p className="text-myth-textSecondary text-sm">
                  Games designed by AI experts to teach genuine computer science concepts
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-neonMint" />
                </div>
                <h4 className="font-bold mb-2">Family Friendly</h4>
                <p className="text-myth-textSecondary text-sm">
                  Safe environment with parent dashboards and progress tracking
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-bold mb-2">Engaging</h4>
                <p className="text-myth-textSecondary text-sm">
                  3D interactive experiences that make learning AI fun and memorable
                </p>
              </div>
            </div>
          </div>
        </MythCard>
      </div>

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MythCard className="max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-myth-accent mb-4">
                Loving the games? 🎮
              </h3>
              <p className="text-myth-textSecondary mb-6">
                Get notified when we add new AI games and unlock exclusive content!
              </p>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                  required
                />
                
                <div className="flex gap-3">
                  <MythButton type="submit" className="flex-1" label="Get Updates" />
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </form>
            </div>
          </MythCard>
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MythCard className="max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-myth-accent mb-4">
                Ready for the Full AI Adventure? 🚀
              </h3>
              <p className="text-myth-textSecondary mb-6">
                You've experienced the power of AI Cube! Unlock all 14 games, progress tracking, and parent insights.
              </p>
              
              <div className="bg-myth-surface/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Family Plan</span>
                  <span className="text-2xl font-bold text-myth-accent">$15/month</span>
                </div>
                <ul className="text-sm text-myth-textSecondary space-y-1">
                  <li>✓ All 14 AI games</li>
                  <li>✓ Up to 4 children</li>
                  <li>✓ Progress tracking</li>
                  <li>✓ Parent dashboard</li>
                  <li>✓ 14-day free trial</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <MythButton onClick={onUpgrade} className="flex-1" label="Start Free Trial" />
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors"
                >
                  Continue Free
                </button>
              </div>
            </div>
          </MythCard>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-myth-textSecondary mb-4">
          Ready to unlock the full AI learning experience?
        </p>
        <MythButton
          onClick={onUpgrade}
          className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30"
          label="Start 14-Day Free Trial"
        />
        <p className="text-xs text-myth-textSecondary mt-2">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default GuestMode;
