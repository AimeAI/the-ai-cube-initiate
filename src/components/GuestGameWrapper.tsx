import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { Clock, Star, ArrowRight } from 'lucide-react';

interface GuestGameWrapperProps {
  children: React.ReactNode;
  gameId: string;
  gameTitle: string;
}

const GuestGameWrapper: React.FC<GuestGameWrapperProps> = ({ 
  children, 
  gameId, 
  gameTitle 
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeSpent, setTimeSpent] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const isGuestMode = searchParams.get('guest') === 'true';

  // Track time spent in game for guest users
  useEffect(() => {
    if (!isGuestMode) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [isGuestMode]);

  // Show upgrade prompt after 15 minutes in guest mode
  useEffect(() => {
    if (isGuestMode && timeSpent >= 15 && !showUpgradePrompt) {
      setShowUpgradePrompt(true);
    }
  }, [timeSpent, isGuestMode, showUpgradePrompt]);

  // Track game completion for guest users
  useEffect(() => {
    if (isGuestMode) {
      const guestProgress = JSON.parse(localStorage.getItem('guestProgress') || '{}');
      guestProgress[gameId] = {
        ...guestProgress[gameId],
        timeSpent: timeSpent,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem('guestProgress', JSON.stringify(guestProgress));
    }
  }, [timeSpent, gameId, isGuestMode]);

  const handleUpgrade = () => {
    const guestEmail = localStorage.getItem('guestEmail');
    if (guestEmail) {
      navigate(`/login?email=${encodeURIComponent(guestEmail)}`);
    } else {
      navigate('/login');
    }
  };

  if (!isGuestMode) {
    // Regular authenticated user - render game normally
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-myth-background">
      {/* Guest Mode Header */}
      <div className="bg-myth-surface/30 border-b border-myth-accent/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-neonMint/20 px-3 py-1 rounded-full">
              <span className="text-neonMint text-sm font-semibold">FREE TRIAL</span>
            </div>
            <span className="text-myth-textSecondary">
              Playing: <span className="text-myth-textPrimary font-semibold">{gameTitle}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-myth-textSecondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{timeSpent} min played</span>
            </div>
            <MythButton
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-sm px-4 py-2"
              label="Unlock All Games"
            />
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative">
        {children}
        
        {/* Upgrade Overlay */}
        {showUpgradePrompt && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <MythCard className="max-w-lg w-full">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-obsidianBlack" />
                </div>
                
                <h3 className="text-2xl font-bold text-myth-accent mb-4">
                  Loving the AI experience?
                </h3>
                
                <p className="text-myth-textSecondary mb-6">
                  You've spent {timeSpent} minutes exploring AI concepts! 
                  Unlock all 14 games and track your progress with a full account.
                </p>
                
                <div className="bg-myth-surface/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Family Plan</span>
                    <span className="text-2xl font-bold text-myth-accent">$15/month</span>
                  </div>
                  <ul className="text-sm text-myth-textSecondary space-y-1 text-left">
                    <li>✓ All 14 interactive AI games</li>
                    <li>✓ Progress tracking & achievements</li>
                    <li>✓ Parent dashboard</li>
                    <li>✓ Up to 4 children</li>
                    <li>✓ 14-day free trial</li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <MythButton
                    onClick={handleUpgrade}
                    className="flex-1 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack flex items-center justify-center gap-2"
                    label={
                      <>
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                      </>
                    }
                  />
                  <button
                    onClick={() => setShowUpgradePrompt(false)}
                    className="px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors"
                  >
                    Continue Free
                  </button>
                </div>
                
                <p className="text-xs text-myth-textSecondary mt-4">
                  No credit card required for trial
                </p>
              </div>
            </MythCard>
          </div>
        )}
      </div>

      {/* Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-myth-surface/90 backdrop-blur-md border-t border-myth-accent/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-myth-textSecondary text-sm">
              Enjoying {gameTitle}? Unlock 13 more AI games!
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-myth-textSecondary text-sm">
              Just $3.75/child/month
            </span>
            <MythButton
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack"
              label="Start Free Trial"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestGameWrapper;
