import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from './AdvancedAnalytics';
import { usePersonalization } from './PersonalizationEngine';

interface ConversionEvent {
  type: 'page_view' | 'button_click' | 'form_start' | 'form_complete' | 'purchase' | 'signup';
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

interface ConversionFunnel {
  stage: string;
  users: number;
  conversions: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
}

interface OptimizationRule {
  id: string;
  name: string;
  condition: (userProfile: any, sessionData: any) => boolean;
  action: (element: HTMLElement) => void;
  priority: number;
  active: boolean;
}

interface ConversionOptimizerContext {
  trackConversion: (event: ConversionEvent) => void;
  getFunnelData: () => ConversionFunnel[];
  getOptimizationSuggestions: () => string[];
  applyOptimizations: () => void;
  isOptimizationActive: (ruleId: string) => boolean;
}

// Predefined optimization rules
const optimizationRules: OptimizationRule[] = [
  {
    id: 'urgent_cta_high_intent',
    name: 'Show urgent CTA for high-intent users',
    condition: (profile, session) => 
      profile.conversionIntent === 'high' && session.timeOnPage > 120000,
    action: (element) => {
      if (element.classList.contains('cta-button')) {
        element.style.animation = 'pulse 2s infinite';
        element.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
      }
    },
    priority: 1,
    active: true
  },
  {
    id: 'price_highlight_sensitive',
    name: 'Highlight free options for price-sensitive users',
    condition: (profile) => profile.pricesensitivity === 'high',
    action: (element) => {
      if (element.classList.contains('free-option')) {
        element.style.border = '3px solid #10B981';
        element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        const badge = document.createElement('div');
        badge.textContent = 'FREE';
        badge.style.cssText = `
          position: absolute;
          top: -10px;
          right: -10px;
          background: #10B981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        `;
        element.style.position = 'relative';
        element.appendChild(badge);
      }
    },
    priority: 2,
    active: true
  },
  {
    id: 'social_proof_boost',
    name: 'Boost social proof for uncertain users',
    condition: (profile, session) => 
      profile.conversionIntent === 'medium' && session.scrollDepth > 50,
    action: (element) => {
      if (element.classList.contains('social-proof')) {
        element.style.transform = 'scale(1.05)';
        element.style.border = '2px solid #F59E0B';
        element.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
      }
    },
    priority: 3,
    active: true
  },
  {
    id: 'mobile_sticky_cta',
    name: 'Add sticky CTA for mobile users',
    condition: (profile) => profile.deviceType === 'mobile',
    action: () => {
      const existingSticky = document.getElementById('mobile-sticky-cta');
      if (existingSticky) return;

      const stickyButton = document.createElement('div');
      stickyButton.id = 'mobile-sticky-cta';
      stickyButton.innerHTML = `
        <button style="
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(45deg, #00D4FF, #10B981);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          cursor: pointer;
          animation: bounce 2s infinite;
        ">
          Try FREE Games
        </button>
      `;
      
      stickyButton.onclick = () => {
        const tryFreeSection = document.getElementById('try-free');
        if (tryFreeSection) {
          tryFreeSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      document.body.appendChild(stickyButton);
    },
    priority: 4,
    active: true
  },
  {
    id: 'exit_intent_popup',
    name: 'Show exit intent offer',
    condition: (profile, session) => 
      session.exitIntent && profile.conversionIntent !== 'low',
    action: () => {
      const existingPopup = document.getElementById('exit-intent-popup');
      if (existingPopup) return;

      const popup = document.createElement('div');
      popup.id = 'exit-intent-popup';
      popup.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background: #1a1a1a;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            border: 2px solid #00D4FF;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
          ">
            <h2 style="color: #00D4FF; margin-bottom: 20px;">Wait! Don't Miss Out</h2>
            <p style="color: white; margin-bottom: 30px;">
              Try our 3 FREE AI games before you go. No signup required!
            </p>
            <button id="exit-cta" style="
              background: linear-gradient(45deg, #00D4FF, #10B981);
              color: #000;
              border: none;
              padding: 15px 30px;
              border-radius: 10px;
              font-weight: bold;
              font-size: 18px;
              margin-right: 15px;
              cursor: pointer;
            ">Try Free Games</button>
            <button id="exit-close" style="
              background: transparent;
              color: #666;
              border: 1px solid #666;
              padding: 15px 30px;
              border-radius: 10px;
              cursor: pointer;
            ">No Thanks</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(popup);
      
      document.getElementById('exit-cta')?.addEventListener('click', () => {
        const tryFreeSection = document.getElementById('try-free');
        if (tryFreeSection) {
          tryFreeSection.scrollIntoView({ behavior: 'smooth' });
        }
        popup.remove();
      });
      
      document.getElementById('exit-close')?.addEventListener('click', () => {
        popup.remove();
      });
    },
    priority: 5,
    active: true
  },
  {
    id: 'testimonial_highlight',
    name: 'Highlight relevant testimonials',
    condition: (profile) => profile.childAge && profile.childAge > 0,
    action: (element) => {
      if (element.classList.contains('testimonial')) {
        const ageText = element.textContent?.toLowerCase();
        const userAge = profile.childAge;
        
        if (ageText && userAge) {
          const ageMatch = ageText.match(/(\d+)[\s-]?year/);
          if (ageMatch) {
            const testimonialAge = parseInt(ageMatch[1]);
            if (Math.abs(testimonialAge - userAge) <= 2) {
              element.style.border = '3px solid #F59E0B';
              element.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
              const relevantBadge = document.createElement('div');
              relevantBadge.textContent = 'Similar Age';
              relevantBadge.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #F59E0B;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
              `;
              element.style.position = 'relative';
              element.appendChild(relevantBadge);
            }
          }
        }
      }
    },
    priority: 6,
    active: true
  },
  {
    id: 'scarcity_timer',
    name: 'Add scarcity timer for high-intent users',
    condition: (profile, session) => 
      profile.conversionIntent === 'high' && session.timeOnPage > 300000,
    action: () => {
      const existingTimer = document.getElementById('scarcity-timer');
      if (existingTimer) return;

      const timer = document.createElement('div');
      timer.id = 'scarcity-timer';
      timer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #EF4444, #F59E0B);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: pulse 2s infinite;
      `;
      
      let timeLeft = 15 * 60; // 15 minutes
      
      const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.innerHTML = `
          <div style="font-size: 12px; opacity: 0.9;">Limited Time Offer</div>
          <div style="font-size: 18px;">${minutes}:${seconds.toString().padStart(2, '0')}</div>
        `;
        
        if (timeLeft > 0) {
          timeLeft--;
          setTimeout(updateTimer, 1000);
        } else {
          timer.remove();
        }
      };
      
      updateTimer();
      document.body.appendChild(timer);
    },
    priority: 7,
    active: true
  }
];

const ConversionOptimizerContext = createContext<ConversionOptimizerContext | null>(null);

const ConversionOptimizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const analytics = useAnalytics();
  const personalization = usePersonalization();
  const [conversionEvents, setConversionEvents] = useState<ConversionEvent[]>([]);
  const [sessionData, setSessionData] = useState({
    timeOnPage: 0,
    scrollDepth: 0,
    exitIntent: false,
    interactions: 0
  });
  const [activeOptimizations, setActiveOptimizations] = useState<Set<string>>(new Set());

  // Track conversion events
  const trackConversion = (event: ConversionEvent) => {
    setConversionEvents(prev => [...prev, event]);
    
    analytics.trackEvent({
      event: 'conversion_event',
      category: 'Conversion',
      action: event.type,
      label: event.type,
      value: event.value,
      customParameters: {
        ...event.metadata,
        session_id: event.sessionId,
        timestamp: event.timestamp
      }
    });
  };

  // Calculate funnel data
  const getFunnelData = (): ConversionFunnel[] => {
    const stages = [
      { name: 'Page View', type: 'page_view' },
      { name: 'Button Click', type: 'button_click' },
      { name: 'Form Start', type: 'form_start' },
      { name: 'Form Complete', type: 'form_complete' },
      { name: 'Purchase', type: 'purchase' }
    ];

    return stages.map((stage, index) => {
      const stageEvents = conversionEvents.filter(e => e.type === stage.type);
      const previousStageEvents = index > 0 
        ? conversionEvents.filter(e => e.type === stages[index - 1].type)
        : stageEvents;

      const users = stageEvents.length;
      const conversions = index < stages.length - 1 
        ? conversionEvents.filter(e => e.type === stages[index + 1].type).length
        : users;

      const conversionRate = users > 0 ? (conversions / users) * 100 : 0;
      const dropoffRate = users > 0 ? ((users - conversions) / users) * 100 : 0;

      return {
        stage: stage.name,
        users,
        conversions,
        conversionRate,
        dropoffRate,
        averageTime: 0 // Calculate based on timestamps
      };
    });
  };

  // Get optimization suggestions
  const getOptimizationSuggestions = (): string[] => {
    const suggestions: string[] = [];
    const funnelData = getFunnelData();

    // Analyze funnel for optimization opportunities
    funnelData.forEach((stage, index) => {
      if (stage.dropoffRate > 50) {
        suggestions.push(`High dropoff at ${stage.stage} (${stage.dropoffRate.toFixed(1)}%)`);
      }
      
      if (stage.conversionRate < 20 && index > 0) {
        suggestions.push(`Low conversion from ${stage.stage} (${stage.conversionRate.toFixed(1)}%)`);
      }
    });

    // User-specific suggestions
    const { userProfile } = personalization;
    
    if (userProfile.conversionIntent === 'low') {
      suggestions.push('Consider showing more social proof to build trust');
    }
    
    if (userProfile.pricesensitivity === 'high') {
      suggestions.push('Emphasize free options and value proposition');
    }
    
    if (sessionData.timeOnPage > 300000 && userProfile.conversionIntent !== 'high') {
      suggestions.push('User is highly engaged but not converting - show urgency');
    }

    return suggestions;
  };

  // Apply optimizations based on rules
  const applyOptimizations = () => {
    const { userProfile } = personalization;
    
    optimizationRules.forEach(rule => {
      if (!rule.active || activeOptimizations.has(rule.id)) return;
      
      if (rule.condition(userProfile, sessionData)) {
        // Find relevant elements and apply optimization
        const elements = document.querySelectorAll('[data-optimize]');
        elements.forEach(element => {
          rule.action(element as HTMLElement);
        });
        
        // For rules that don't target specific elements
        if (elements.length === 0) {
          rule.action(document.body);
        }
        
        setActiveOptimizations(prev => new Set([...prev, rule.id]));
        
        analytics.trackEvent({
          event: 'optimization_applied',
          category: 'Conversion',
          action: 'apply_rule',
          label: rule.name,
          customParameters: {
            rule_id: rule.id,
            user_profile: userProfile,
            session_data: sessionData
          }
        });
      }
    });
  };

  // Check if optimization is active
  const isOptimizationActive = (ruleId: string): boolean => {
    return activeOptimizations.has(ruleId);
  };

  // Update session data
  useEffect(() => {
    const updateSessionData = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setSessionData(prev => ({
        ...prev,
        timeOnPage: Date.now() - (personalization.userProfile.lastVisit?.getTime() || Date.now()),
        scrollDepth: Math.max(prev.scrollDepth, scrollDepth)
      }));
    };

    const interval = setInterval(updateSessionData, 5000);
    window.addEventListener('scroll', updateSessionData, { passive: true });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', updateSessionData);
    };
  }, [personalization.userProfile.lastVisit]);

  // Exit intent detection
  useEffect(() => {
    let exitIntentTriggered = false;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        setSessionData(prev => ({ ...prev, exitIntent: true }));
        
        analytics.trackEvent({
          event: 'exit_intent',
          category: 'Behavior',
          action: 'mouse_leave',
          label: 'exit_intent_detected'
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Apply optimizations when conditions change
  useEffect(() => {
    const timer = setTimeout(applyOptimizations, 1000);
    return () => clearTimeout(timer);
  }, [sessionData, personalization.userProfile]);

  // Real-time optimization monitoring
  useEffect(() => {
    const monitorOptimizations = () => {
      const suggestions = getOptimizationSuggestions();
      
      if (suggestions.length > 0) {
        analytics.trackEvent({
          event: 'optimization_opportunity',
          category: 'Conversion',
          action: 'suggestion_generated',
          label: suggestions.join('; '),
          customParameters: {
            suggestions_count: suggestions.length,
            funnel_data: getFunnelData(),
            session_data: sessionData
          }
        });
      }
    };

    const interval = setInterval(monitorOptimizations, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [conversionEvents, sessionData]);

  const contextValue: ConversionOptimizerContext = {
    trackConversion,
    getFunnelData,
    getOptimizationSuggestions,
    applyOptimizations,
    isOptimizationActive
  };

  return (
    <ConversionOptimizerContext.Provider value={contextValue}>
      {children}
    </ConversionOptimizerContext.Provider>
  );
};

// Hook for using conversion optimizer
export const useConversionOptimizer = (): ConversionOptimizerContext => {
  const context = useContext(ConversionOptimizerContext);
  if (!context) {
    throw new Error('useConversionOptimizer must be used within ConversionOptimizerProvider');
  }
  return context;
};

// Component for tracking conversion events
export const ConversionTracker: React.FC<{
  eventType: ConversionEvent['type'];
  value?: number;
  metadata?: Record<string, any>;
  children: ReactNode;
}> = ({ eventType, value, metadata, children }) => {
  const { trackConversion } = useConversionOptimizer();
  
  const handleClick = () => {
    trackConversion({
      type: eventType,
      value,
      metadata,
      timestamp: Date.now(),
      sessionId: 'current_session' // Get from analytics
    });
  };

  return (
    <div onClick={handleClick} data-optimize>
      {children}
    </div>
  );
};

export default ConversionOptimizerProvider;
