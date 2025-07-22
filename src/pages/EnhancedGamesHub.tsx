import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import AgeAdaptiveInterface from '../components/AgeAdaptiveInterface';
import { ProgressTracker, UserProgress } from '../lib/progressTracking';
import { gamesConfig, getAgeAppropriateDescription, getRecommendedGames, GameConfig } from '../config/gamesConfig';
import { useAuth } from '../hooks/useAuth';
import { 
  Play, 
  Star, 
  Clock, 
  Trophy, 
  Lock, 
  CheckCircle, 
  Brain, 
  Zap, 
  Target,
  Filter,
  Search,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

interface GameCardProps {
  game: GameConfig;
  progress?: any;
  isRecommended?: boolean;
  isLocked?: boolean;
  childAge: number;
  onPlay: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  progress, 
  isRecommended, 
  isLocked, 
  childAge, 
  onPlay 
}) => {
  const ageConfig = getAgeAppropriateDescription(game, childAge);
  const gameProgress = progress?.gameProgress[game.id];
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  return (
    <MythCard className={`relative transition-all duration-300 hover:scale-105 ${
      isRecommended ? 'border-electricCyan shadow-lg shadow-electricCyan/20' : ''
    } ${isLocked ? 'opacity-60' : ''}`}>
      {/* Recommendation badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" />
            Recommended
          </div>
        </div>
      )}

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute top-4 right-4 z-10">
          <Lock className="w-5 h-5 text-myth-textSecondary" />
        </div>
      )}

      <div className="p-6">
        {/* Game header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-myth-textPrimary mb-1">
              {ageConfig.title}
            </h3>
            <p className="text-myth-textSecondary text-sm mb-2">
              {ageConfig.description}
            </p>
          </div>
        </div>

        {/* Game stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-myth-textSecondary" />
            <span className="text-myth-textSecondary">{game.estimatedDuration}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className={`w-4 h-4 ${getDifficultyColor(game.difficulty)}`} />
            <span className={getDifficultyColor(game.difficulty)}>
              {getDifficultyLabel(game.difficulty)}
            </span>
          </div>
          {game.isEnhanced && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-neonMint" />
              <span className="text-neonMint text-xs">Enhanced</span>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {gameProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-myth-textSecondary text-sm">Progress</span>
              <span className="text-myth-textPrimary text-sm font-semibold">
                {gameProgress.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-myth-surface rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-electricCyan to-neonMint h-2 rounded-full transition-all duration-300"
                style={{ width: `${gameProgress.completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Skills and concepts */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {ageConfig.keyLearning.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="bg-myth-surface px-2 py-1 rounded text-xs text-myth-textSecondary"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {childAge >= 9 && (
            <p className="text-myth-textSecondary text-xs italic">
              {ageConfig.metaphor}
            </p>
          )}
        </div>

        {/* Achievements preview */}
        {gameProgress?.achievements.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-myth-textSecondary text-sm">
              {gameProgress.achievements.length} achievement{gameProgress.achievements.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Play button */}
        <MythButton
          onClick={() => onPlay(game.id)}
          disabled={isLocked}
          className={`w-full ${
            isRecommended 
              ? 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30'
              : gameProgress?.completionPercentage > 0
                ? 'bg-myth-accent text-myth-background hover:bg-myth-secondary'
                : ''
          }`}
          label={
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              {isLocked ? 'Locked' : 
               gameProgress?.completionPercentage > 0 ? 'Continue' : 'Start'}
            </div>
          }
        />

        {/* Prerequisites info */}
        {isLocked && game.prerequisites && (
          <p className="text-myth-textSecondary text-xs mt-2 text-center">
            Complete {game.prerequisites.join(', ')} first
          </p>
        )}
      </div>
    </MythCard>
  );
};

const EnhancedGamesHub: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [childAge, setChildAge] = useState(10);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const progressTracker = ProgressTracker.getInstance();

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        setIsLoading(true);
        let progress = await progressTracker.getUserProgress(user.id);
        
        if (!progress) {
          // Initialize new user progress
          progress = await progressTracker.initializeUserProgress(user.id, childAge);
        }
        
        setUserProgress(progress);
        setChildAge(progress.childAge);
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, childAge]);

  // Filter games based on selections
  const filteredGames = React.useMemo(() => {
    let games = gamesConfig;

    // Filter by category
    if (selectedCategory !== 'all') {
      games = games.filter(game => game.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      games = games.filter(game => {
        const ageConfig = getAgeAppropriateDescription(game, childAge);
        return (
          ageConfig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ageConfig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.aiConcepts.some(concept => concept.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Filter by recommended only
    if (showOnlyRecommended && userProgress) {
      const recommended = getRecommendedGames(childAge, userProgress.gamesCompleted);
      games = games.filter(game => recommended.some(r => r.id === game.id));
    }

    return games;
  }, [selectedCategory, searchTerm, showOnlyRecommended, childAge, userProgress]);

  // Get recommended games
  const recommendedGames = React.useMemo(() => {
    if (!userProgress) return [];
    return getRecommendedGames(childAge, userProgress.gamesCompleted);
  }, [childAge, userProgress]);

  // Check if game is locked
  const isGameLocked = (game: GameConfig): boolean => {
    if (!userProgress) return false;
    if (!game.prerequisites) return false;
    
    return !game.prerequisites.every(prereq => 
      userProgress.gamesCompleted.includes(prereq)
    );
  };

  // Handle game play
  const handlePlayGame = (gameId: string) => {
    const game = gamesConfig.find(g => g.id === gameId);
    if (game && !isGameLocked(game)) {
      navigate(game.path);
    }
  };

  // Generate learning insights
  const learningInsights = React.useMemo(() => {
    if (!userProgress) return [];
    return progressTracker.generateLearningInsights(userProgress);
  }, [userProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-myth-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myth-accent mx-auto mb-4"></div>
          <p className="text-myth-textSecondary">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <AgeAdaptiveInterface 
      childAge={childAge} 
      gameId="games-hub"
      onAgeChange={setChildAge}
    >
      <div className="min-h-screen bg-myth-background text-myth-textPrimary p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-myth-accent mb-2">
                {childAge <= 8 ? 'AI Adventure Games!' : 
                 childAge <= 12 ? 'AI Learning Hub' : 
                 'AI Mastery Center'}
              </h1>
              <p className="text-myth-textSecondary">
                {childAge <= 8 ? 'Choose your next fun adventure!' :
                 childAge <= 12 ? 'Explore interactive AI concepts through games' :
                 'Master artificial intelligence through hands-on experience'}
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <MythButton
                onClick={() => navigate('/dashboard/parent')}
                className="text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
                label="Parent Dashboard"
              />
              <MythButton
                onClick={() => navigate('/')}
                className="text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
                label="Home"
              />
            </div>
          </div>

          {/* Learning insights */}
          {learningInsights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-myth-accent mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Learning Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningInsights.slice(0, 3).map((insight, index) => (
                  <MythCard key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div>
                        <h3 className="font-semibold text-myth-textPrimary">{insight.title}</h3>
                        <p className="text-myth-textSecondary text-sm">{insight.description}</p>
                      </div>
                    </div>
                  </MythCard>
                ))}
              </div>
            </div>
          )}

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-myth-textSecondary" />
              <input
                type="text"
                placeholder={childAge <= 8 ? "Search for games..." : "Search games, concepts, or skills..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-myth-surface border border-myth-accent/30 rounded-lg text-myth-textPrimary focus:outline-none focus:border-myth-accent"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-4 py-2 bg-myth-surface border border-myth-accent/30 rounded-lg text-myth-textPrimary focus:outline-none focus:border-myth-accent"
            >
              <option value="all">All Games</option>
              <option value="beginner">{childAge <= 8 ? 'Easy' : 'Beginner'}</option>
              <option value="intermediate">{childAge <= 8 ? 'Medium' : 'Intermediate'}</option>
              <option value="advanced">{childAge <= 8 ? 'Hard' : 'Advanced'}</option>
            </select>

            {/* Recommended filter */}
            <button
              onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showOnlyRecommended
                  ? 'bg-myth-accent text-myth-background border-myth-accent'
                  : 'bg-myth-surface text-myth-textPrimary border-myth-accent/30 hover:bg-myth-accent/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recommended
              </div>
            </button>
          </div>

          {/* Games grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                progress={userProgress}
                isRecommended={recommendedGames.some(r => r.id === game.id)}
                isLocked={isGameLocked(game)}
                childAge={childAge}
                onPlay={handlePlayGame}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-myth-textPrimary mb-2">
                No games found
              </h3>
              <p className="text-myth-textSecondary mb-4">
                Try adjusting your search or filters
              </p>
              <MythButton
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowOnlyRecommended(false);
                }}
                label="Clear Filters"
              />
            </div>
          )}

          {/* Progress summary */}
          {userProgress && (
            <div className="mt-12">
              <MythCard className="p-6">
                <h2 className="text-xl font-bold text-myth-accent mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Progress Summary
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-myth-accent">
                      {userProgress.gamesCompleted.length}
                    </div>
                    <div className="text-myth-textSecondary text-sm">Games Completed</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neonMint">
                      {userProgress.achievements.length}
                    </div>
                    <div className="text-myth-textSecondary text-sm">Achievements</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electricCyan">
                      {Math.round(userProgress.totalTimeSpent / 60)}h
                    </div>
                    <div className="text-myth-textSecondary text-sm">Learning Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {userProgress.skillsEarned.length}
                    </div>
                    <div className="text-myth-textSecondary text-sm">Skills Learned</div>
                  </div>
                </div>
              </MythCard>
            </div>
          )}
        </div>
      </div>
    </AgeAdaptiveInterface>
  );
};

export default EnhancedGamesHub;
