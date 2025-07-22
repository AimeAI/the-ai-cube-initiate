import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { 
  TrendingUp, 
  Clock, 
  Trophy, 
  Brain, 
  Target, 
  Calendar,
  MessageCircle,
  Download,
  Settings,
  Plus,
  Star,
  PlayCircle
} from 'lucide-react';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  totalGamesPlayed: number;
  totalTimeSpent: number; // in minutes
  skillsEarned: string[];
  currentStreak: number;
  lastActive: string;
  favoriteGame: string;
  progressLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface FamilyStats {
  totalChildren: number;
  totalGamesPlayed: number;
  totalTimeSpent: number;
  skillsUnlocked: number;
  weeklyProgress: number;
}

const EnhancedParentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [familyStats, setFamilyStats] = useState<FamilyStats | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [weeklyInsights, setWeeklyInsights] = useState<string[]>([]);

  // Mock data for demonstration - replace with real Supabase queries
  useEffect(() => {
    const mockChildren: ChildProfile[] = [
      {
        id: '1',
        name: 'Emma',
        age: 12,
        totalGamesPlayed: 8,
        totalTimeSpent: 240, // 4 hours
        skillsEarned: ['Logic', 'Pattern Recognition', 'Problem Solving'],
        currentStreak: 5,
        lastActive: '2025-01-07',
        favoriteGame: 'Neural Network Chamber',
        progressLevel: 'Intermediate'
      },
      {
        id: '2',
        name: 'Alex',
        age: 9,
        totalGamesPlayed: 4,
        totalTimeSpent: 120, // 2 hours
        skillsEarned: ['Logic', 'Spatial Reasoning'],
        currentStreak: 3,
        lastActive: '2025-01-06',
        favoriteGame: 'Snake³',
        progressLevel: 'Beginner'
      }
    ];

    const mockFamilyStats: FamilyStats = {
      totalChildren: 2,
      totalGamesPlayed: 12,
      totalTimeSpent: 360,
      skillsUnlocked: 5,
      weeklyProgress: 25
    };

    const mockInsights = [
      "Emma showed strong improvement in logical thinking this week!",
      "Alex spent 30% more time learning compared to last week.",
      "Both children are most active between 4-6 PM on weekdays.",
      "Neural Network Chamber is becoming the family favorite game."
    ];

    setChildren(mockChildren);
    setFamilyStats(mockFamilyStats);
    setWeeklyInsights(mockInsights);
  }, []);

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-yellow-400';
      case 'Intermediate': return 'text-blue-400';
      case 'Advanced': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const generateWeeklyReport = () => {
    // This would generate a PDF report in a real implementation
    alert('Weekly report generated! Check your email.');
  };

  return (
    <div className="container mx-auto p-4 bg-myth-background text-myth-textPrimary min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-myth-accent mb-2">
            Family Learning Hub
          </h1>
          <p className="text-myth-textSecondary">
            Track your children's AI learning journey
          </p>
        </div>
        
        <div className="flex gap-3">
          <MythButton
            onClick={generateWeeklyReport}
            className="flex items-center gap-2 text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
            label={
              <>
                <Download className="w-4 h-4" />
                Weekly Report
              </>
            }
          />
          <MythButton
            onClick={() => navigate('/profile/parent')}
            className="flex items-center gap-2 text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
            label={
              <>
                <Settings className="w-4 h-4" />
                Settings
              </>
            }
          />
        </div>
      </div>

      {/* Family Overview Stats */}
      {familyStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MythCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-myth-textSecondary text-sm">Total Children</p>
                <p className="text-2xl font-bold text-myth-accent">{familyStats.totalChildren}</p>
              </div>
              <div className="w-12 h-12 bg-myth-accent/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-myth-accent" />
              </div>
            </div>
          </MythCard>

          <MythCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-myth-textSecondary text-sm">Games Played</p>
                <p className="text-2xl font-bold text-neonMint">{familyStats.totalGamesPlayed}</p>
              </div>
              <div className="w-12 h-12 bg-neonMint/20 rounded-full flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-neonMint" />
              </div>
            </div>
          </MythCard>

          <MythCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-myth-textSecondary text-sm">Learning Time</p>
                <p className="text-2xl font-bold text-electricCyan">{formatTime(familyStats.totalTimeSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-electricCyan/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-electricCyan" />
              </div>
            </div>
          </MythCard>

          <MythCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-myth-textSecondary text-sm">Skills Unlocked</p>
                <p className="text-2xl font-bold text-purple-400">{familyStats.skillsUnlocked}</p>
              </div>
              <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </MythCard>
        </div>
      )}

      {/* Children Profiles */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-orbitron font-semibold text-myth-accent">
            Children's Progress
          </h2>
          <MythButton
            onClick={() => setShowAddChild(true)}
            className="flex items-center gap-2 bg-myth-accent text-myth-background hover:bg-myth-secondary"
            label={
              <>
                <Plus className="w-4 h-4" />
                Add Child
              </>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <MythCard key={child.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold text-lg">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-myth-textPrimary">{child.name}</h3>
                    <p className="text-myth-textSecondary text-sm">Age {child.age}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getProgressColor(child.progressLevel)}`}>
                  {child.progressLevel}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-myth-textSecondary text-sm">Games Played</span>
                  <span className="text-myth-textPrimary font-semibold">{child.totalGamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-myth-textSecondary text-sm">Learning Time</span>
                  <span className="text-myth-textPrimary font-semibold">{formatTime(child.totalTimeSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-myth-textSecondary text-sm">Current Streak</span>
                  <span className="text-myth-textPrimary font-semibold flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    {child.currentStreak} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-myth-textSecondary text-sm">Favorite Game</span>
                  <span className="text-myth-textPrimary font-semibold text-xs">{child.favoriteGame}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-myth-textSecondary text-sm mb-2">Skills Earned ({child.skillsEarned.length})</p>
                <div className="flex flex-wrap gap-1">
                  {child.skillsEarned.map((skill) => (
                    <span key={skill} className="bg-myth-surface px-2 py-1 rounded text-xs text-myth-textSecondary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <MythButton
                  onClick={() => setSelectedChild(child.id)}
                  className="flex-1 text-sm"
                  label="View Details"
                />
                <MythButton
                  onClick={() => navigate('/dashboard/student')}
                  className="flex-1 text-sm text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
                  label="Play Games"
                />
              </div>
            </MythCard>
          ))}
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="mb-8">
        <MythCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-myth-accent/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-myth-accent" />
              </div>
              <h3 className="text-xl font-bold text-myth-accent">This Week's Insights</h3>
            </div>
            
            <div className="space-y-3">
              {weeklyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-myth-surface/30 rounded-lg">
                  <Star className="w-4 h-4 text-neonMint mt-0.5 flex-shrink-0" />
                  <p className="text-myth-textSecondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </MythCard>
      </div>

      {/* Discussion Prompts */}
      <div className="mb-8">
        <MythCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-neonMint/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-neonMint" />
              </div>
              <h3 className="text-xl font-bold text-neonMint">Family Discussion Starters</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-myth-surface/30 rounded-lg">
                <p className="text-myth-textPrimary font-semibold mb-2">
                  "What did you learn about neural networks today?"
                </p>
                <p className="text-myth-textSecondary text-sm">
                  Perfect for Emma after playing Neural Network Chamber
                </p>
              </div>
              
              <div className="p-4 bg-myth-surface/30 rounded-lg">
                <p className="text-myth-textPrimary font-semibold mb-2">
                  "How is AI similar to how our brains work?"
                </p>
                <p className="text-myth-textSecondary text-sm">
                  Great conversation starter for the whole family
                </p>
              </div>
            </div>
          </div>
        </MythCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/student">
          <MythCard className="p-6 hover:border-myth-accent/50 transition-all cursor-pointer">
            <div className="text-center">
              <PlayCircle className="w-12 h-12 text-myth-accent mx-auto mb-3" />
              <h3 className="font-bold text-myth-textPrimary mb-2">Play Games</h3>
              <p className="text-myth-textSecondary text-sm">
                Access the student dashboard and start learning
              </p>
            </div>
          </MythCard>
        </Link>

        <Link to="/pricing">
          <MythCard className="p-6 hover:border-neonMint/50 transition-all cursor-pointer">
            <div className="text-center">
              <Star className="w-12 h-12 text-neonMint mx-auto mb-3" />
              <h3 className="font-bold text-myth-textPrimary mb-2">Upgrade Plan</h3>
              <p className="text-myth-textSecondary text-sm">
                Unlock premium features and mentorship
              </p>
            </div>
          </MythCard>
        </Link>

        <MythCard className="p-6 hover:border-electricCyan/50 transition-all cursor-pointer">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-electricCyan mx-auto mb-3" />
            <h3 className="font-bold text-myth-textPrimary mb-2">Schedule Learning</h3>
            <p className="text-myth-textSecondary text-sm">
              Set up learning reminders and goals
            </p>
          </div>
        </MythCard>
      </div>

      {/* Add Child Modal */}
      {showAddChild && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MythCard className="max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-myth-accent mb-4">Add Child Profile</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-myth-textSecondary mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                    placeholder="Enter child's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-myth-textSecondary mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="18"
                    className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                    placeholder="Age"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <MythButton
                    type="submit"
                    className="flex-1"
                    label="Add Child"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddChild(false)}
                    className="flex-1 px-4 py-2 text-myth-textSecondary hover:text-myth-textPrimary transition-colors border border-myth-accent/30 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </MythCard>
        </div>
      )}
    </div>
  );
};

export default EnhancedParentDashboard;
