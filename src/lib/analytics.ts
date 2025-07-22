// Comprehensive analytics and monitoring system
export interface AnalyticsEvent {
  eventType: 'game_start' | 'game_complete' | 'achievement_earned' | 'skill_learned' | 
            'tutorial_complete' | 'hint_used' | 'mistake_made' | 'session_start' | 
            'session_end' | 'upgrade_prompt' | 'payment_complete' | 'guest_conversion';
  userId: string;
  sessionId: string;
  timestamp: string;
  gameId?: string;
  properties: Record<string, any>;
  childAge?: number;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  gamesPlayed: string[];
  achievementsEarned: number;
  hintsUsed: number;
  mistakesMade: number;
  childAge: number;
  conversionEvent?: 'guest_to_trial' | 'trial_to_paid';
}

export interface LearningMetrics {
  userId: string;
  gameId: string;
  conceptsLearned: string[];
  skillsImproved: string[];
  difficultyProgression: number[];
  timeToMastery: number; // minutes
  retentionScore: number; // 0-100
  engagementScore: number; // 0-100
  frustrationIndicators: FrustrationIndicator[];
}

export interface FrustrationIndicator {
  timestamp: string;
  type: 'repeated_mistakes' | 'long_pause' | 'hint_overuse' | 'rage_quit';
  severity: 'low' | 'medium' | 'high';
  gameContext: string;
}

export interface ConversionFunnelData {
  stage: 'landing' | 'guest_mode' | 'email_capture' | 'trial_signup' | 'payment' | 'active_user';
  userId: string;
  timestamp: string;
  source: string;
  previousStage?: string;
  timeInStage?: number;
  dropoffReason?: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessions: Map<string, SessionData> = new Map();
  private currentSessionId: string | null = null;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Initialize analytics
  initialize(userId: string): void {
    this.currentSessionId = this.generateSessionId();
    this.startSession(userId);
    this.setupEventListeners();
  }

  // Track events
  track(eventType: AnalyticsEvent['eventType'], properties: Record<string, any> = {}): void {
    if (!this.currentSessionId) return;

    const event: AnalyticsEvent = {
      eventType,
      userId: properties.userId || 'anonymous',
      sessionId: this.currentSessionId,
      timestamp: new Date().toISOString(),
      gameId: properties.gameId,
      properties,
      childAge: properties.childAge,
      deviceInfo: this.getDeviceInfo()
    };

    this.events.push(event);
    this.sendToAnalytics(event);
    
    // Update session data
    this.updateSession(event);
  }

  // Track game events
  trackGameStart(gameId: string, userId: string, childAge: number): void {
    this.track('game_start', {
      gameId,
      userId,
      childAge,
      timestamp: new Date().toISOString()
    });
  }

  trackGameComplete(gameId: string, userId: string, sessionData: {
    duration: number;
    score: number;
    level: number;
    hintsUsed: number;
    mistakes: number;
  }): void {
    this.track('game_complete', {
      gameId,
      userId,
      ...sessionData
    });
  }

  trackAchievement(achievementId: string, gameId: string, userId: string, rarity: string): void {
    this.track('achievement_earned', {
      achievementId,
      gameId,
      userId,
      rarity
    });
  }

  trackSkillLearned(skillId: string, gameId: string, userId: string, level: number): void {
    this.track('skill_learned', {
      skillId,
      gameId,
      userId,
      level
    });
  }

  trackTutorialComplete(gameId: string, userId: string, duration: number): void {
    this.track('tutorial_complete', {
      gameId,
      userId,
      duration
    });
  }

  trackHintUsed(gameId: string, userId: string, hintType: string, context: string): void {
    this.track('hint_used', {
      gameId,
      userId,
      hintType,
      context
    });
  }

  trackMistake(gameId: string, userId: string, mistakeType: string, context: string): void {
    this.track('mistake_made', {
      gameId,
      userId,
      mistakeType,
      context
    });
  }

  trackConversion(userId: string, fromStage: string, toStage: string, source: string): void {
    this.track('guest_conversion', {
      userId,
      fromStage,
      toStage,
      source
    });
  }

  // Session management
  private startSession(userId: string): void {
    if (!this.currentSessionId) return;

    const session: SessionData = {
      sessionId: this.currentSessionId,
      userId,
      startTime: new Date().toISOString(),
      gamesPlayed: [],
      achievementsEarned: 0,
      hintsUsed: 0,
      mistakesMade: 0,
      childAge: 10 // Default, will be updated
    };

    this.sessions.set(this.currentSessionId, session);
    this.track('session_start', { userId });
  }

  endSession(): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.endTime = new Date().toISOString();
      session.duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
      
      this.track('session_end', {
        userId: session.userId,
        duration: session.duration,
        gamesPlayed: session.gamesPlayed.length,
        achievementsEarned: session.achievementsEarned
      });
    }

    this.currentSessionId = null;
  }

  private updateSession(event: AnalyticsEvent): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.get(this.currentSessionId);
    if (!session) return;

    switch (event.eventType) {
      case 'game_start':
        if (event.gameId && !session.gamesPlayed.includes(event.gameId)) {
          session.gamesPlayed.push(event.gameId);
        }
        break;
      case 'achievement_earned':
        session.achievementsEarned++;
        break;
      case 'hint_used':
        session.hintsUsed++;
        break;
      case 'mistake_made':
        session.mistakesMade++;
        break;
    }

    if (event.childAge) {
      session.childAge = event.childAge;
    }
  }

  // Analytics insights
  generateEngagementReport(userId: string, timeframe: 'day' | 'week' | 'month'): EngagementReport {
    const userEvents = this.events.filter(e => e.userId === userId);
    const cutoffDate = this.getCutoffDate(timeframe);
    const recentEvents = userEvents.filter(e => new Date(e.timestamp) > cutoffDate);

    const gamesPlayed = new Set(recentEvents.filter(e => e.eventType === 'game_start').map(e => e.gameId)).size;
    const totalTime = this.calculateTotalTime(recentEvents);
    const achievements = recentEvents.filter(e => e.eventType === 'achievement_earned').length;
    const hintsUsed = recentEvents.filter(e => e.eventType === 'hint_used').length;
    const mistakes = recentEvents.filter(e => e.eventType === 'mistake_made').length;

    const engagementScore = this.calculateEngagementScore({
      gamesPlayed,
      totalTime,
      achievements,
      hintsUsed,
      mistakes
    });

    return {
      userId,
      timeframe,
      gamesPlayed,
      totalTime,
      achievements,
      engagementScore,
      retentionIndicators: this.calculateRetentionIndicators(recentEvents),
      learningVelocity: this.calculateLearningVelocity(recentEvents),
      frustrationLevel: this.calculateFrustrationLevel(recentEvents)
    };
  }

  generateConversionFunnelReport(): ConversionFunnelReport {
    const funnelStages = ['landing', 'guest_mode', 'email_capture', 'trial_signup', 'payment', 'active_user'];
    const conversionData: Record<string, number> = {};

    funnelStages.forEach(stage => {
      conversionData[stage] = this.events.filter(e => 
        e.properties.stage === stage || e.properties.toStage === stage
      ).length;
    });

    const conversionRates: Record<string, number> = {};
    for (let i = 1; i < funnelStages.length; i++) {
      const currentStage = funnelStages[i];
      const previousStage = funnelStages[i - 1];
      conversionRates[`${previousStage}_to_${currentStage}`] = 
        conversionData[previousStage] > 0 ? 
        (conversionData[currentStage] / conversionData[previousStage]) * 100 : 0;
    }

    return {
      stageData: conversionData,
      conversionRates,
      dropoffPoints: this.identifyDropoffPoints(conversionData),
      recommendations: this.generateConversionRecommendations(conversionRates)
    };
  }

  // Learning analytics
  analyzeLearningPatterns(userId: string): LearningAnalysis {
    const userEvents = this.events.filter(e => e.userId === userId);
    
    const gameProgression = this.analyzeGameProgression(userEvents);
    const skillDevelopment = this.analyzeSkillDevelopment(userEvents);
    const conceptMastery = this.analyzeConceptMastery(userEvents);
    const learningStyle = this.identifyLearningStyle(userEvents);

    return {
      userId,
      gameProgression,
      skillDevelopment,
      conceptMastery,
      learningStyle,
      recommendations: this.generateLearningRecommendations(userEvents)
    };
  }

  // Private helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    return {
      userAgent: ua,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(ua),
      os: this.getOS(ua)
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.screen.width;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('session_pause', {});
      } else {
        this.track('session_resume', {});
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // In production, this would send to your analytics service
    // For now, store locally and log
    console.log('Analytics Event:', event);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('analytics_events') || '[]';
    const events = JSON.parse(stored);
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
  }

  private getCutoffDate(timeframe: 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private calculateTotalTime(events: AnalyticsEvent[]): number {
    // Calculate total time from session events
    const sessions = events.filter(e => e.eventType === 'session_start' || e.eventType === 'session_end');
    let totalTime = 0;
    
    for (let i = 0; i < sessions.length - 1; i += 2) {
      if (sessions[i].eventType === 'session_start' && sessions[i + 1]?.eventType === 'session_end') {
        const start = new Date(sessions[i].timestamp).getTime();
        const end = new Date(sessions[i + 1].timestamp).getTime();
        totalTime += end - start;
      }
    }
    
    return Math.round(totalTime / (1000 * 60)); // Convert to minutes
  }

  private calculateEngagementScore(metrics: {
    gamesPlayed: number;
    totalTime: number;
    achievements: number;
    hintsUsed: number;
    mistakes: number;
  }): number {
    // Weighted engagement score calculation
    const gameWeight = metrics.gamesPlayed * 10;
    const timeWeight = Math.min(metrics.totalTime, 120) * 0.5; // Cap at 2 hours
    const achievementWeight = metrics.achievements * 15;
    const hintPenalty = metrics.hintsUsed * -2;
    const mistakePenalty = metrics.mistakes * -1;
    
    const rawScore = gameWeight + timeWeight + achievementWeight + hintPenalty + mistakePenalty;
    return Math.max(0, Math.min(100, rawScore));
  }

  private calculateRetentionIndicators(events: AnalyticsEvent[]): string[] {
    const indicators: string[] = [];
    
    const sessionStarts = events.filter(e => e.eventType === 'session_start');
    if (sessionStarts.length > 1) {
      indicators.push('Multiple sessions');
    }
    
    const gameCompletes = events.filter(e => e.eventType === 'game_complete');
    if (gameCompletes.length > 0) {
      indicators.push('Game completion');
    }
    
    return indicators;
  }

  private calculateLearningVelocity(events: AnalyticsEvent[]): number {
    const skillEvents = events.filter(e => e.eventType === 'skill_learned');
    const timeSpan = this.getTimeSpan(events);
    
    if (timeSpan === 0) return 0;
    return skillEvents.length / (timeSpan / (1000 * 60 * 60)); // Skills per hour
  }

  private calculateFrustrationLevel(events: AnalyticsEvent[]): 'low' | 'medium' | 'high' {
    const mistakes = events.filter(e => e.eventType === 'mistake_made').length;
    const hints = events.filter(e => e.eventType === 'hint_used').length;
    const total = events.length;
    
    const frustrationRatio = (mistakes + hints) / total;
    
    if (frustrationRatio > 0.3) return 'high';
    if (frustrationRatio > 0.15) return 'medium';
    return 'low';
  }

  private getTimeSpan(events: AnalyticsEvent[]): number {
    if (events.length === 0) return 0;
    
    const timestamps = events.map(e => new Date(e.timestamp).getTime()).sort();
    return timestamps[timestamps.length - 1] - timestamps[0];
  }

  private identifyDropoffPoints(conversionData: Record<string, number>): string[] {
    const dropoffs: string[] = [];
    const stages = Object.keys(conversionData);
    
    for (let i = 1; i < stages.length; i++) {
      const current = conversionData[stages[i]];
      const previous = conversionData[stages[i - 1]];
      const dropoffRate = (previous - current) / previous;
      
      if (dropoffRate > 0.5) { // More than 50% dropoff
        dropoffs.push(`High dropoff from ${stages[i - 1]} to ${stages[i]}`);
      }
    }
    
    return dropoffs;
  }

  private generateConversionRecommendations(conversionRates: Record<string, number>): string[] {
    const recommendations: string[] = [];
    
    Object.entries(conversionRates).forEach(([transition, rate]) => {
      if (rate < 30) {
        recommendations.push(`Improve ${transition} conversion (currently ${rate.toFixed(1)}%)`);
      }
    });
    
    return recommendations;
  }

  private analyzeGameProgression(events: AnalyticsEvent[]): any {
    // Analyze how user progresses through games
    const gameStarts = events.filter(e => e.eventType === 'game_start');
    const gameCompletes = events.filter(e => e.eventType === 'game_complete');
    
    return {
      gamesStarted: gameStarts.length,
      gamesCompleted: gameCompletes.length,
      completionRate: gameStarts.length > 0 ? (gameCompletes.length / gameStarts.length) * 100 : 0
    };
  }

  private analyzeSkillDevelopment(events: AnalyticsEvent[]): any {
    const skillEvents = events.filter(e => e.eventType === 'skill_learned');
    const skillsByCategory: Record<string, number> = {};
    
    skillEvents.forEach(event => {
      const category = event.properties.category || 'general';
      skillsByCategory[category] = (skillsByCategory[category] || 0) + 1;
    });
    
    return skillsByCategory;
  }

  private analyzeConceptMastery(events: AnalyticsEvent[]): any {
    const achievementEvents = events.filter(e => e.eventType === 'achievement_earned');
    const conceptsMastered = achievementEvents.filter(e => e.properties.concept).length;
    
    return {
      totalConcepts: conceptsMastered,
      masteryRate: achievementEvents.length > 0 ? (conceptsMastered / achievementEvents.length) * 100 : 0
    };
  }

  private identifyLearningStyle(events: AnalyticsEvent[]): string {
    const hints = events.filter(e => e.eventType === 'hint_used').length;
    const mistakes = events.filter(e => e.eventType === 'mistake_made').length;
    const tutorials = events.filter(e => e.eventType === 'tutorial_complete').length;
    
    if (tutorials > hints && mistakes < 5) return 'methodical';
    if (hints > tutorials && mistakes > 10) return 'exploratory';
    return 'balanced';
  }

  private generateLearningRecommendations(events: AnalyticsEvent[]): string[] {
    const recommendations: string[] = [];
    
    const mistakes = events.filter(e => e.eventType === 'mistake_made').length;
    if (mistakes > 20) {
      recommendations.push('Consider reviewing fundamental concepts');
    }
    
    const hints = events.filter(e => e.eventType === 'hint_used').length;
    if (hints > 15) {
      recommendations.push('Try solving problems independently before using hints');
    }
    
    return recommendations;
  }
}

// Supporting interfaces
export interface EngagementReport {
  userId: string;
  timeframe: 'day' | 'week' | 'month';
  gamesPlayed: number;
  totalTime: number;
  achievements: number;
  engagementScore: number;
  retentionIndicators: string[];
  learningVelocity: number;
  frustrationLevel: 'low' | 'medium' | 'high';
}

export interface ConversionFunnelReport {
  stageData: Record<string, number>;
  conversionRates: Record<string, number>;
  dropoffPoints: string[];
  recommendations: string[];
}

export interface LearningAnalysis {
  userId: string;
  gameProgression: any;
  skillDevelopment: any;
  conceptMastery: any;
  learningStyle: string;
  recommendations: string[];
}
