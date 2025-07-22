// Comprehensive user progress tracking system
export interface UserProgress {
  userId: string;
  childAge: number;
  totalTimeSpent: number; // minutes
  gamesCompleted: string[];
  currentStreak: number;
  longestStreak: number;
  skillsEarned: Skill[];
  achievements: CompletedAchievement[];
  gameProgress: Record<string, GameProgress>;
  learningPath: LearningPathProgress;
  parentNotes: ParentNote[];
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  earnedAt: string;
  gameSource: string;
  description: string;
  category: 'cognitive' | 'technical' | 'creative' | 'social';
}

export interface CompletedAchievement {
  id: string;
  gameId: string;
  earnedAt: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  concept?: string;
}

export interface GameProgress {
  gameId: string;
  timesPlayed: number;
  totalTimeSpent: number;
  bestScore: number;
  currentLevel: number;
  maxLevelReached: number;
  completionPercentage: number;
  lastPlayed: string;
  achievements: string[];
  skillsLearned: string[];
  mistakes: GameMistake[];
  improvements: GameImprovement[];
}

export interface GameMistake {
  timestamp: string;
  type: string;
  description: string;
  resolved: boolean;
}

export interface GameImprovement {
  timestamp: string;
  metric: string;
  previousValue: number;
  newValue: number;
  improvement: number;
}

export interface LearningPathProgress {
  currentPath: 'beginner' | 'intermediate' | 'advanced' | 'custom';
  pathProgress: number; // 0-100
  recommendedNextGames: string[];
  completedMilestones: string[];
  estimatedCompletionDate: string;
  adaptiveAdjustments: AdaptiveAdjustment[];
}

export interface AdaptiveAdjustment {
  timestamp: string;
  reason: string;
  adjustment: string;
  impact: string;
}

export interface ParentNote {
  id: string;
  timestamp: string;
  gameId?: string;
  note: string;
  category: 'observation' | 'concern' | 'celebration' | 'question';
  resolved: boolean;
}

// Progress tracking service
export class ProgressTracker {
  private static instance: ProgressTracker;
  private progressData: Map<string, UserProgress> = new Map();

  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker();
    }
    return ProgressTracker.instance;
  }

  // Initialize user progress
  async initializeUserProgress(userId: string, childAge: number): Promise<UserProgress> {
    const progress: UserProgress = {
      userId,
      childAge,
      totalTimeSpent: 0,
      gamesCompleted: [],
      currentStreak: 0,
      longestStreak: 0,
      skillsEarned: [],
      achievements: [],
      gameProgress: {},
      learningPath: {
        currentPath: 'beginner',
        pathProgress: 0,
        recommendedNextGames: this.getInitialRecommendations(childAge),
        completedMilestones: [],
        estimatedCompletionDate: this.calculateEstimatedCompletion(childAge),
        adaptiveAdjustments: []
      },
      parentNotes: [],
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.progressData.set(userId, progress);
    await this.saveProgress(progress);
    return progress;
  }

  // Update game progress
  async updateGameProgress(
    userId: string, 
    gameId: string, 
    sessionData: {
      timeSpent: number;
      score: number;
      level: number;
      completed: boolean;
      achievements?: string[];
      mistakes?: GameMistake[];
    }
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;

    // Update or create game progress
    if (!progress.gameProgress[gameId]) {
      progress.gameProgress[gameId] = {
        gameId,
        timesPlayed: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        currentLevel: 1,
        maxLevelReached: 1,
        completionPercentage: 0,
        lastPlayed: new Date().toISOString(),
        achievements: [],
        skillsLearned: [],
        mistakes: [],
        improvements: []
      };
    }

    const gameProgress = progress.gameProgress[gameId];
    
    // Update game-specific progress
    gameProgress.timesPlayed += 1;
    gameProgress.totalTimeSpent += sessionData.timeSpent;
    gameProgress.lastPlayed = new Date().toISOString();
    
    // Track improvements
    if (sessionData.score > gameProgress.bestScore) {
      gameProgress.improvements.push({
        timestamp: new Date().toISOString(),
        metric: 'score',
        previousValue: gameProgress.bestScore,
        newValue: sessionData.score,
        improvement: sessionData.score - gameProgress.bestScore
      });
      gameProgress.bestScore = sessionData.score;
    }

    if (sessionData.level > gameProgress.maxLevelReached) {
      gameProgress.maxLevelReached = sessionData.level;
    }

    gameProgress.currentLevel = sessionData.level;

    // Add mistakes if any
    if (sessionData.mistakes) {
      gameProgress.mistakes.push(...sessionData.mistakes);
    }

    // Add achievements
    if (sessionData.achievements) {
      sessionData.achievements.forEach(achievementId => {
        if (!gameProgress.achievements.includes(achievementId)) {
          gameProgress.achievements.push(achievementId);
        }
      });
    }

    // Update overall progress
    progress.totalTimeSpent += sessionData.timeSpent;
    progress.lastActive = new Date().toISOString();
    progress.updatedAt = new Date().toISOString();

    // Check for game completion
    if (sessionData.completed && !progress.gamesCompleted.includes(gameId)) {
      progress.gamesCompleted.push(gameId);
      this.updateStreak(progress);
      this.updateLearningPath(progress);
    }

    await this.saveProgress(progress);
  }

  // Add achievement
  async addAchievement(
    userId: string, 
    gameId: string, 
    achievementId: string, 
    points: number, 
    rarity: 'common' | 'rare' | 'epic' | 'legendary',
    concept?: string
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;

    const achievement: CompletedAchievement = {
      id: achievementId,
      gameId,
      earnedAt: new Date().toISOString(),
      points,
      rarity,
      concept
    };

    progress.achievements.push(achievement);
    progress.updatedAt = new Date().toISOString();

    await this.saveProgress(progress);
  }

  // Add skill
  async addSkill(
    userId: string, 
    gameId: string, 
    skillData: {
      id: string;
      name: string;
      level: number;
      description: string;
      category: 'cognitive' | 'technical' | 'creative' | 'social';
    }
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;

    const existingSkill = progress.skillsEarned.find(s => s.id === skillData.id);
    
    if (existingSkill) {
      // Level up existing skill
      if (skillData.level > existingSkill.level) {
        existingSkill.level = skillData.level;
        existingSkill.earnedAt = new Date().toISOString();
      }
    } else {
      // Add new skill
      const skill: Skill = {
        ...skillData,
        earnedAt: new Date().toISOString(),
        gameSource: gameId
      };
      progress.skillsEarned.push(skill);
    }

    progress.updatedAt = new Date().toISOString();
    await this.saveProgress(progress);
  }

  // Add parent note
  async addParentNote(
    userId: string, 
    note: string, 
    category: 'observation' | 'concern' | 'celebration' | 'question',
    gameId?: string
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;

    const parentNote: ParentNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      gameId,
      note,
      category,
      resolved: false
    };

    progress.parentNotes.push(parentNote);
    progress.updatedAt = new Date().toISOString();

    await this.saveProgress(progress);
  }

  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    // Try to get from memory first
    let progress = this.progressData.get(userId);
    
    if (!progress) {
      // Try to load from storage (localStorage for now, Supabase later)
      const stored = localStorage.getItem(`progress-${userId}`);
      if (stored) {
        progress = JSON.parse(stored);
        this.progressData.set(userId, progress!);
      }
    }

    return progress || null;
  }

  // Generate learning insights
  generateLearningInsights(progress: UserProgress): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Time-based insights
    if (progress.totalTimeSpent > 60) {
      insights.push({
        type: 'time',
        title: 'Great Dedication!',
        description: `You've spent ${Math.round(progress.totalTimeSpent / 60)} hours learning AI concepts!`,
        icon: '⏰',
        priority: 'medium'
      });
    }

    // Streak insights
    if (progress.currentStreak >= 3) {
      insights.push({
        type: 'streak',
        title: 'Learning Streak!',
        description: `Amazing! You've been learning for ${progress.currentStreak} days in a row!`,
        icon: '🔥',
        priority: 'high'
      });
    }

    // Skill development insights
    const skillsByCategory = this.groupSkillsByCategory(progress.skillsEarned);
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      if (skills.length >= 3) {
        insights.push({
          type: 'skill',
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Skills Developing!`,
          description: `You're building strong ${category} skills with ${skills.length} abilities learned!`,
          icon: this.getCategoryIcon(category),
          priority: 'medium'
        });
      }
    });

    // Achievement insights
    const rareAchievements = progress.achievements.filter(a => a.rarity === 'rare' || a.rarity === 'epic' || a.rarity === 'legendary');
    if (rareAchievements.length > 0) {
      insights.push({
        type: 'achievement',
        title: 'Exceptional Achievements!',
        description: `You've earned ${rareAchievements.length} rare achievements! You're mastering advanced concepts!`,
        icon: '🏆',
        priority: 'high'
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Generate parent report
  generateParentReport(progress: UserProgress): ParentReport {
    const weeklyTimeSpent = this.calculateWeeklyTimeSpent(progress);
    const skillsThisWeek = this.getSkillsEarnedThisWeek(progress);
    const improvementAreas = this.identifyImprovementAreas(progress);
    const strengths = this.identifyStrengths(progress);
    const recommendations = this.generateRecommendations(progress);

    return {
      childName: `Student`, // Would come from profile
      reportPeriod: 'This Week',
      timeSpent: weeklyTimeSpent,
      gamesPlayed: Object.keys(progress.gameProgress).length,
      skillsLearned: skillsThisWeek,
      achievements: progress.achievements.length,
      strengths,
      improvementAreas,
      recommendations,
      discussionPrompts: this.generateDiscussionPrompts(progress),
      nextWeekGoals: this.generateNextWeekGoals(progress)
    };
  }

  // Private helper methods
  private updateStreak(progress: UserProgress): void {
    const today = new Date().toDateString();
    const lastActive = new Date(progress.lastActive).toDateString();
    
    if (today === lastActive) {
      // Same day, don't update streak
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      // Consecutive day
      progress.currentStreak += 1;
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }
    } else {
      // Streak broken
      progress.currentStreak = 1;
    }
  }

  private updateLearningPath(progress: UserProgress): void {
    const completedCount = progress.gamesCompleted.length;
    const totalGames = 14; // Total number of games
    
    progress.learningPath.pathProgress = Math.round((completedCount / totalGames) * 100);
    
    // Update path level based on progress
    if (completedCount >= 10) {
      progress.learningPath.currentPath = 'advanced';
    } else if (completedCount >= 5) {
      progress.learningPath.currentPath = 'intermediate';
    }
    
    // Update recommendations
    progress.learningPath.recommendedNextGames = this.getNextRecommendations(progress);
  }

  private getInitialRecommendations(childAge: number): string[] {
    if (childAge <= 8) {
      return ['snake3', 'crystal-resonance'];
    } else if (childAge <= 12) {
      return ['snake3', 'crystal-resonance', 'neural-network-chamber'];
    } else {
      return ['snake3', 'neural-network-chamber', 'reinforcement-lab'];
    }
  }

  private getNextRecommendations(progress: UserProgress): string[] {
    // This would use the game configuration to determine next games
    // based on completed games and prerequisites
    return ['quantum-chamber', 'vision-system'];
  }

  private calculateEstimatedCompletion(childAge: number): string {
    // Estimate based on age and typical learning pace
    const weeksToComplete = childAge <= 8 ? 12 : childAge <= 12 ? 8 : 6;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (weeksToComplete * 7));
    return completionDate.toISOString();
  }

  private async saveProgress(progress: UserProgress): Promise<void> {
    // Save to localStorage for now (would be Supabase in production)
    localStorage.setItem(`progress-${progress.userId}`, JSON.stringify(progress));
    this.progressData.set(progress.userId, progress);
  }

  private groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  }

  private getCategoryIcon(category: string): string {
    const icons = {
      cognitive: '🧠',
      technical: '⚙️',
      creative: '🎨',
      social: '👥'
    };
    return icons[category as keyof typeof icons] || '📚';
  }

  private calculateWeeklyTimeSpent(progress: UserProgress): number {
    // This would calculate time spent in the last week
    // For now, return a portion of total time
    return Math.round(progress.totalTimeSpent * 0.3);
  }

  private getSkillsEarnedThisWeek(progress: UserProgress): Skill[] {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return progress.skillsEarned.filter(skill => 
      new Date(skill.earnedAt) > oneWeekAgo
    );
  }

  private identifyStrengths(progress: UserProgress): string[] {
    const strengths: string[] = [];
    
    if (progress.currentStreak >= 3) {
      strengths.push('Consistent daily learning');
    }
    
    if (progress.achievements.filter(a => a.rarity === 'rare').length > 0) {
      strengths.push('Mastering advanced concepts');
    }
    
    const skillLevels = progress.skillsEarned.map(s => s.level);
    const avgSkillLevel = skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
    if (avgSkillLevel >= 3) {
      strengths.push('Strong skill development');
    }
    
    return strengths;
  }

  private identifyImprovementAreas(progress: UserProgress): string[] {
    const areas: string[] = [];
    
    if (progress.totalTimeSpent < 30) {
      areas.push('Could benefit from more practice time');
    }
    
    if (progress.currentStreak === 0) {
      areas.push('Building consistent learning habits');
    }
    
    return areas;
  }

  private generateRecommendations(progress: UserProgress): string[] {
    const recommendations: string[] = [];
    
    if (progress.currentStreak < 3) {
      recommendations.push('Try to play for 15 minutes each day to build a learning habit');
    }
    
    if (progress.gamesCompleted.length < 3) {
      recommendations.push('Focus on completing beginner games before moving to advanced topics');
    }
    
    return recommendations;
  }

  private generateDiscussionPrompts(progress: UserProgress): string[] {
    return [
      'What was the most interesting thing you learned about AI this week?',
      'How do you think AI might help people in the future?',
      'What was challenging about the games you played?'
    ];
  }

  private generateNextWeekGoals(progress: UserProgress): string[] {
    return [
      'Complete one new AI game',
      'Earn at least one new achievement',
      'Practice for 15 minutes each day'
    ];
  }
}

// Supporting interfaces
export interface LearningInsight {
  type: 'time' | 'streak' | 'skill' | 'achievement' | 'improvement';
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ParentReport {
  childName: string;
  reportPeriod: string;
  timeSpent: number;
  gamesPlayed: number;
  skillsLearned: Skill[];
  achievements: number;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  discussionPrompts: string[];
  nextWeekGoals: string[];
}
