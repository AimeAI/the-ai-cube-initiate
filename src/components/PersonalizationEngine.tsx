import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from './AdvancedAnalytics';

interface UserProfile {
  id?: string;
  childAge?: number;
  interests?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: string;
  timezone?: string;
  visitCount: number;
  lastVisit?: Date;
  totalTimeSpent: number;
  completedGames: string[];
  favoriteGames: string[];
  conversionIntent: 'low' | 'medium' | 'high';
  pricesensitivity: 'low' | 'medium' | 'high';
}

interface PersonalizationContext {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getPersonalizedContent: (contentType: string) => any;
  getRecommendedGames: () => string[];
  getOptimalPricing: () => 'monthly' | 'yearly';
  shouldShowUrgency: () => boolean;
  getPersonalizedCTA: (context: string) => string;
}

const PersonalizationContext = createContext<PersonalizationContext | null>(null);

// AI-powered content variants
const contentVariants = {
  headlines: {
    young_beginner: "Fun AI Games for Kids - Start Learning Today!",
    young_intermediate: "Master AI Concepts Through Interactive Games",
    teen_beginner: "Learn AI Skills That Matter for Your Future",
    teen_advanced: "Advanced AI Learning for Tomorrow's Leaders",
    parent_focused: "Give Your Child the AI Advantage They Need"
  },
  
  descriptions: {
    young_beginner: "Simple, fun games that teach AI basics through play and exploration.",
    young_intermediate: "Interactive challenges that build real AI understanding step by step.",
    teen_beginner: "Practical AI skills for the jobs of tomorrow, learned through gaming.",
    teen_advanced: "Deep dive into neural networks, machine learning, and cutting-edge AI.",
    parent_focused: "Comprehensive AI education that prepares your child for future success."
  },

  ctas: {
    low_intent: "Explore Free Games",
    medium_intent: "Try 3 Games FREE",
    high_intent: "Start Learning Now",
    returning_user: "Continue Your Journey",
    price_sensitive: "See Free Options",
    premium_ready: "Get Full Access"
  },

  urgency: {
    first_visit: "Join 2,847+ families learning AI",
    returning: "Don't fall behind - continue learning",
    high_intent: "Limited time: Start your AI journey today",
    price_sensitive: "Free games available - no commitment needed"
  }
};

// Game recommendations based on profile
const gameRecommendations = {
  beginner: ['snake-3', 'crystal-resonance', 'neural-network-chamber'],
  intermediate: ['decision-tree', 'vision-system', 'predictor-engine'],
  advanced: ['quantum-chamber', 'neural-forge', 'ethics-framework'],
  visual_learner: ['neural-network-chamber', 'vision-system', 'quantum-chamber'],
  auditory_learner: ['crystal-resonance', 'ethics-framework', 'decision-tree'],
  kinesthetic_learner: ['snake-3', 'neural-forge', 'predictor-engine']
};

const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const analytics = useAnalytics();
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Load from localStorage or create new profile
    const saved = localStorage.getItem('ai_cube_user_profile');
    const defaultProfile: UserProfile = {
      deviceType: getDeviceType(),
      visitCount: 1,
      totalTimeSpent: 0,
      completedGames: [],
      favoriteGames: [],
      conversionIntent: 'medium',
      pricesensitivity: 'medium'
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultProfile, ...parsed, visitCount: parsed.visitCount + 1 };
    }
    
    return defaultProfile;
  });

  function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Update profile and persist to localStorage
  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updates, lastVisit: new Date() };
    setUserProfile(newProfile);
    localStorage.setItem('ai_cube_user_profile', JSON.stringify(newProfile));
    
    // Track profile updates
    analytics.trackEvent({
      event: 'profile_update',
      category: 'Personalization',
      action: 'update',
      label: Object.keys(updates).join(','),
      customParameters: updates
    });
  };

  // AI-powered content personalization
  const getPersonalizedContent = (contentType: string) => {
    const { childAge, skillLevel, conversionIntent, visitCount } = userProfile;
    
    let contentKey = '';
    
    if (contentType === 'headline') {
      if (childAge && childAge < 10) {
        contentKey = skillLevel === 'beginner' ? 'young_beginner' : 'young_intermediate';
      } else if (childAge && childAge >= 13) {
        contentKey = skillLevel === 'advanced' ? 'teen_advanced' : 'teen_beginner';
      } else {
        contentKey = 'parent_focused';
      }
      return contentVariants.headlines[contentKey as keyof typeof contentVariants.headlines];
    }
    
    if (contentType === 'description') {
      if (childAge && childAge < 10) {
        contentKey = skillLevel === 'beginner' ? 'young_beginner' : 'young_intermediate';
      } else if (childAge && childAge >= 13) {
        contentKey = skillLevel === 'advanced' ? 'teen_advanced' : 'teen_beginner';
      } else {
        contentKey = 'parent_focused';
      }
      return contentVariants.descriptions[contentKey as keyof typeof contentVariants.descriptions];
    }
    
    return null;
  };

  // Game recommendations based on profile
  const getRecommendedGames = (): string[] => {
    const { skillLevel, preferredLearningStyle, completedGames } = userProfile;
    
    let recommendations: string[] = [];
    
    // Add skill-based recommendations
    if (skillLevel) {
      recommendations.push(...gameRecommendations[skillLevel]);
    }
    
    // Add learning style recommendations
    if (preferredLearningStyle) {
      const styleKey = `${preferredLearningStyle}_learner` as keyof typeof gameRecommendations;
      recommendations.push(...gameRecommendations[styleKey]);
    }
    
    // Remove already completed games
    recommendations = recommendations.filter(game => !completedGames.includes(game));
    
    // Remove duplicates and limit to 6
    return [...new Set(recommendations)].slice(0, 6);
  };

  // Optimal pricing strategy
  const getOptimalPricing = (): 'monthly' | 'yearly' => {
    const { pricesensitivity, conversionIntent, visitCount } = userProfile;
    
    // High intent users with low price sensitivity prefer yearly
    if (conversionIntent === 'high' && pricesensitivity === 'low') {
      return 'yearly';
    }
    
    // Returning users with medium intent prefer yearly
    if (visitCount > 3 && conversionIntent === 'medium') {
      return 'yearly';
    }
    
    // Default to monthly for flexibility
    return 'monthly';
  };

  // Dynamic urgency messaging
  const shouldShowUrgency = (): boolean => {
    const { visitCount, conversionIntent, totalTimeSpent } = userProfile;
    
    // Show urgency for high-intent users
    if (conversionIntent === 'high') return true;
    
    // Show urgency for returning users who haven't converted
    if (visitCount > 2 && totalTimeSpent > 300000) return true; // 5+ minutes
    
    // Show urgency for users who've spent significant time
    if (totalTimeSpent > 600000) return true; // 10+ minutes
    
    return false;
  };

  // Personalized CTA text
  const getPersonalizedCTA = (context: string): string => {
    const { conversionIntent, pricesensitivity, visitCount } = userProfile;
    
    if (visitCount > 1) return contentVariants.ctas.returning_user;
    if (pricesensitivity === 'high') return contentVariants.ctas.price_sensitive;
    if (conversionIntent === 'high') return contentVariants.ctas.premium_ready;
    if (conversionIntent === 'low') return contentVariants.ctas.low_intent;
    
    return contentVariants.ctas.medium_intent;
  };

  // Behavioral analysis and profile updates
  useEffect(() => {
    const analyzeUserBehavior = () => {
      const timeSpent = Date.now() - (userProfile.lastVisit?.getTime() || Date.now());
      
      // Update total time spent
      updateProfile({ totalTimeSpent: userProfile.totalTimeSpent + timeSpent });
      
      // Analyze conversion intent based on behavior
      let newIntent = userProfile.conversionIntent;
      
      if (timeSpent > 300000) { // 5+ minutes
        newIntent = 'high';
      } else if (timeSpent > 120000) { // 2+ minutes
        newIntent = 'medium';
      }
      
      if (newIntent !== userProfile.conversionIntent) {
        updateProfile({ conversionIntent: newIntent });
      }
    };

    // Analyze behavior every 30 seconds
    const interval = setInterval(analyzeUserBehavior, 30000);
    
    // Analyze on page unload
    window.addEventListener('beforeunload', analyzeUserBehavior);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', analyzeUserBehavior);
    };
  }, [userProfile]);

  // Detect user preferences from interactions
  useEffect(() => {
    const detectPreferences = () => {
      // Detect learning style from game preferences
      const visualGames = userProfile.favoriteGames.filter(game => 
        ['neural-network-chamber', 'vision-system', 'quantum-chamber'].includes(game)
      );
      
      const auditoryGames = userProfile.favoriteGames.filter(game => 
        ['crystal-resonance', 'ethics-framework'].includes(game)
      );
      
      const kinestheticGames = userProfile.favoriteGames.filter(game => 
        ['snake-3', 'neural-forge', 'predictor-engine'].includes(game)
      );
      
      let preferredStyle: 'visual' | 'auditory' | 'kinesthetic' | undefined;
      
      if (visualGames.length > auditoryGames.length && visualGames.length > kinestheticGames.length) {
        preferredStyle = 'visual';
      } else if (auditoryGames.length > kinestheticGames.length) {
        preferredStyle = 'auditory';
      } else if (kinestheticGames.length > 0) {
        preferredStyle = 'kinesthetic';
      }
      
      if (preferredStyle && preferredStyle !== userProfile.preferredLearningStyle) {
        updateProfile({ preferredLearningStyle: preferredStyle });
      }
    };

    if (userProfile.favoriteGames.length > 0) {
      detectPreferences();
    }
  }, [userProfile.favoriteGames]);

  // A/B testing integration
  useEffect(() => {
    // Randomly assign A/B test variants
    const abTests = {
      pricing_display: Math.random() > 0.5 ? 'monthly_first' : 'yearly_first',
      cta_style: Math.random() > 0.5 ? 'gradient' : 'outline',
      testimonial_style: Math.random() > 0.5 ? 'carousel' : 'grid'
    };

    Object.entries(abTests).forEach(([testName, variant]) => {
      analytics.trackABTest(testName, variant);
    });

    // Store A/B test variants in profile
    updateProfile({ ...userProfile, abTests } as any);
  }, []);

  const contextValue: PersonalizationContext = {
    userProfile,
    updateProfile,
    getPersonalizedContent,
    getRecommendedGames,
    getOptimalPricing,
    shouldShowUrgency,
    getPersonalizedCTA
  };

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};

// Hook for using personalization
export const usePersonalization = (): PersonalizationContext => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
};

// Higher-order component for personalized content
export const withPersonalization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const personalization = usePersonalization();
    return <Component {...props} personalization={personalization} />;
  };
};

export default PersonalizationProvider;
