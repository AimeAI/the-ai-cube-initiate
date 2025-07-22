import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

interface UserBehavior {
  sessionId: string;
  userId?: string;
  timestamp: number;
  page: string;
  action: string;
  element?: string;
  duration?: number;
  scrollDepth?: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

class AdvancedAnalytics {
  private sessionId: string;
  private userId?: string;
  private startTime: number;
  private behaviors: UserBehavior[] = [];
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private timeOnPage: number = 0;
  private interactions: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private initializeTracking() {
    // Scroll depth tracking
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollDepth = Math.round((scrollTop / docHeight) * 100);
      this.maxScrollDepth = Math.max(this.maxScrollDepth, this.scrollDepth);
    };

    // Time on page tracking
    const trackTimeOnPage = () => {
      this.timeOnPage = Date.now() - this.startTime;
    };

    // Event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    
    // Track every 30 seconds
    setInterval(trackTimeOnPage, 30000);
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_map: event.customParameters,
          session_id: this.sessionId,
          user_id: this.userId
        });
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', event.event, {
          category: event.category,
          action: event.action,
          label: event.label,
          value: event.value
        });
      }

      // Custom analytics endpoint
      this.sendToCustomAnalytics(event);

      console.log('📊 Analytics Event:', event);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Track user behavior
  trackBehavior(action: string, element?: string, duration?: number) {
    const behavior: UserBehavior = {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      page: window.location.pathname,
      action,
      element,
      duration,
      scrollDepth: this.scrollDepth,
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent
    };

    this.behaviors.push(behavior);
    this.interactions++;

    // Send behavior data every 10 interactions or 5 minutes
    if (this.behaviors.length >= 10 || Date.now() - this.startTime > 300000) {
      this.flushBehaviors();
    }
  }

  // Track conversion funnel
  trackFunnelStep(step: string, value?: number) {
    this.trackEvent({
      event: 'funnel_step',
      category: 'Conversion',
      action: step,
      label: `Step: ${step}`,
      value,
      customParameters: {
        session_id: this.sessionId,
        time_on_site: this.timeOnPage,
        scroll_depth: this.maxScrollDepth,
        interactions: this.interactions,
        device_type: this.getDeviceType()
      }
    });
  }

  // Track video interactions
  trackVideoEvent(action: 'play' | 'pause' | 'complete' | 'seek', videoId: string, currentTime: number) {
    this.trackEvent({
      event: 'video_interaction',
      category: 'Video',
      action,
      label: videoId,
      value: Math.round(currentTime),
      customParameters: {
        video_id: videoId,
        current_time: currentTime,
        session_id: this.sessionId
      }
    });
  }

  // Track button clicks with heatmap data
  trackButtonClick(buttonId: string, buttonText: string, position: { x: number; y: number }) {
    this.trackEvent({
      event: 'button_click',
      category: 'Engagement',
      action: 'click',
      label: buttonText,
      customParameters: {
        button_id: buttonId,
        button_text: buttonText,
        click_x: position.x,
        click_y: position.y,
        session_id: this.sessionId,
        page: window.location.pathname
      }
    });

    this.trackBehavior('button_click', buttonId);
  }

  // Track form interactions
  trackFormEvent(action: 'start' | 'complete' | 'abandon', formId: string, fieldCount?: number) {
    this.trackEvent({
      event: 'form_interaction',
      category: 'Form',
      action,
      label: formId,
      value: fieldCount,
      customParameters: {
        form_id: formId,
        field_count: fieldCount,
        session_id: this.sessionId
      }
    });
  }

  // Track page performance
  trackPerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      const performanceData = {
        dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_connect: navigation.connectEnd - navigation.connectStart,
        server_response: navigation.responseEnd - navigation.requestStart,
        dom_load: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        page_load: navigation.loadEventEnd - navigation.navigationStart,
        first_paint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };

      this.trackEvent({
        event: 'page_performance',
        category: 'Performance',
        action: 'load_times',
        label: window.location.pathname,
        customParameters: performanceData
      });
    }
  }

  // Send data to custom analytics endpoint
  private async sendToCustomAnalytics(data: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          session_id: this.sessionId,
          timestamp: Date.now(),
          url: window.location.href,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.warn('Failed to send custom analytics:', error);
    }
  }

  // Flush behavior data
  private async flushBehaviors() {
    if (this.behaviors.length === 0) return;

    try {
      await fetch('/api/user-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          behaviors: this.behaviors,
          summary: {
            total_time: this.timeOnPage,
            max_scroll_depth: this.maxScrollDepth,
            total_interactions: this.interactions,
            device_type: this.getDeviceType()
          }
        })
      });

      this.behaviors = []; // Clear after sending
    } catch (error) {
      console.warn('Failed to flush behavior data:', error);
    }
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
    
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  }

  // Track A/B test variant
  trackABTest(testName: string, variant: string) {
    this.trackEvent({
      event: 'ab_test_view',
      category: 'Experiment',
      action: 'view',
      label: `${testName}:${variant}`,
      customParameters: {
        test_name: testName,
        variant,
        session_id: this.sessionId
      }
    });
  }

  // Get session summary
  getSessionSummary() {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      total_time: this.timeOnPage,
      max_scroll_depth: this.maxScrollDepth,
      total_interactions: this.interactions,
      device_type: this.getDeviceType(),
      behaviors_count: this.behaviors.length
    };
  }
}

// Global analytics instance
const analytics = new AdvancedAnalytics();

// React component for analytics initialization
const AdvancedAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    // Track page views
    if (location.pathname !== previousLocation.current) {
      analytics.trackEvent({
        event: 'page_view',
        category: 'Navigation',
        action: 'page_view',
        label: location.pathname,
        customParameters: {
          previous_page: previousLocation.current,
          referrer: document.referrer
        }
      });

      analytics.trackPerformance();
      previousLocation.current = location.pathname;
    }
  }, [location]);

  useEffect(() => {
    // Track session start
    analytics.trackEvent({
      event: 'session_start',
      category: 'Session',
      action: 'start',
      label: 'New Session',
      customParameters: {
        entry_page: location.pathname,
        referrer: document.referrer,
        device_type: analytics.getDeviceType()
      }
    });

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const summary = analytics.getSessionSummary();
      analytics.trackEvent({
        event: 'session_end',
        category: 'Session',
        action: 'end',
        label: 'Session End',
        value: summary.total_time,
        customParameters: summary
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return <>{children}</>;
};

// Hook for using analytics in components
export const useAnalytics = () => {
  return {
    trackEvent: (event: AnalyticsEvent) => analytics.trackEvent(event),
    trackBehavior: (action: string, element?: string, duration?: number) => 
      analytics.trackBehavior(action, element, duration),
    trackFunnelStep: (step: string, value?: number) => 
      analytics.trackFunnelStep(step, value),
    trackVideoEvent: (action: 'play' | 'pause' | 'complete' | 'seek', videoId: string, currentTime: number) =>
      analytics.trackVideoEvent(action, videoId, currentTime),
    trackButtonClick: (buttonId: string, buttonText: string, position: { x: number; y: number }) =>
      analytics.trackButtonClick(buttonId, buttonText, position),
    trackFormEvent: (action: 'start' | 'complete' | 'abandon', formId: string, fieldCount?: number) =>
      analytics.trackFormEvent(action, formId, fieldCount),
    setUserId: (userId: string) => analytics.setUserId(userId),
    trackABTest: (testName: string, variant: string) => analytics.trackABTest(testName, variant),
    getSessionSummary: () => analytics.getSessionSummary()
  };
};

export default AdvancedAnalyticsProvider;
