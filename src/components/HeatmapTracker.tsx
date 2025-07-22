import React, { useEffect, useRef, useState } from 'react';
import { useAnalytics } from './AdvancedAnalytics';

interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  elementId?: string;
  elementType?: string;
  pageUrl: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  sessionId: string;
}

interface ScrollData {
  depth: number;
  timestamp: number;
  pageHeight: number;
  viewportHeight: number;
  sessionId: string;
}

interface ClickData {
  x: number;
  y: number;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  timestamp: number;
  pageUrl: string;
  sessionId: string;
}

interface HoverData {
  elementId: string;
  elementType: string;
  duration: number;
  timestamp: number;
  sessionId: string;
}

class HeatmapTracker {
  private heatmapData: HeatmapData[] = [];
  private scrollData: ScrollData[] = [];
  private clickData: ClickData[] = [];
  private hoverData: HoverData[] = [];
  private sessionId: string;
  private isTracking: boolean = false;
  private hoverStartTime: number = 0;
  private currentHoverElement: string | null = null;
  private scrollDepthMarkers: Set<number> = new Set();

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.initializeTracking();
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getElementInfo(element: Element) {
    return {
      id: element.id || undefined,
      type: element.tagName.toLowerCase(),
      text: element.textContent?.slice(0, 100) || undefined,
      className: element.className || undefined
    };
  }

  public startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    // Mouse movement tracking for heatmap
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    
    // Click tracking
    document.addEventListener('click', this.handleClick, { passive: true });
    
    // Scroll tracking
    document.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // Hover tracking
    document.addEventListener('mouseenter', this.handleMouseEnter, true);
    document.addEventListener('mouseleave', this.handleMouseLeave, true);
    
    // Touch tracking for mobile
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    
    // Form interaction tracking
    document.addEventListener('focus', this.handleFocus, true);
    document.addEventListener('blur', this.handleBlur, true);
    document.addEventListener('input', this.handleInput, true);
    
    // Visibility change tracking
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Resize tracking
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  public stopTracking() {
    if (!this.isTracking) return;
    this.isTracking = false;

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('mouseenter', this.handleMouseEnter, true);
    document.removeEventListener('mouseleave', this.handleMouseLeave, true);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('focus', this.handleFocus, true);
    document.removeEventListener('blur', this.handleBlur, true);
    document.removeEventListener('input', this.handleInput, true);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.handleResize);
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isTracking) return;
    
    // Throttle mouse movement tracking
    if (Math.random() > 0.1) return; // Only track 10% of movements
    
    const heatmapPoint: HeatmapData = {
      x: event.clientX,
      y: event.clientY + window.scrollY,
      intensity: 1,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      deviceType: this.getDeviceType(),
      sessionId: this.sessionId
    };
    
    this.heatmapData.push(heatmapPoint);
    
    // Limit data points to prevent memory issues
    if (this.heatmapData.length > 1000) {
      this.heatmapData = this.heatmapData.slice(-800);
    }
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.isTracking) return;
    
    const target = event.target as Element;
    const elementInfo = this.getElementInfo(target);
    
    const clickPoint: ClickData = {
      x: event.clientX,
      y: event.clientY + window.scrollY,
      elementId: elementInfo.id,
      elementType: elementInfo.type,
      elementText: elementInfo.text,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      sessionId: this.sessionId
    };
    
    this.clickData.push(clickPoint);
    
    // Track click in analytics
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'element_click',
        category: 'Interaction',
        action: 'click',
        label: elementInfo.text || elementInfo.type,
        customParameters: {
          element_id: elementInfo.id,
          element_type: elementInfo.type,
          click_x: event.clientX,
          click_y: event.clientY,
          page_url: window.location.pathname
        }
      });
    }
  };

  private handleScroll = () => {
    if (!this.isTracking) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollDepth = Math.round((scrollTop / (docHeight - viewportHeight)) * 100);
    
    const scrollPoint: ScrollData = {
      depth: scrollDepth,
      timestamp: Date.now(),
      pageHeight: docHeight,
      viewportHeight,
      sessionId: this.sessionId
    };
    
    this.scrollData.push(scrollPoint);
    
    // Track scroll depth milestones
    const milestones = [25, 50, 75, 90, 100];
    milestones.forEach(milestone => {
      if (scrollDepth >= milestone && !this.scrollDepthMarkers.has(milestone)) {
        this.scrollDepthMarkers.add(milestone);
        
        if (window.analytics) {
          window.analytics.trackEvent({
            event: 'scroll_depth',
            category: 'Engagement',
            action: 'scroll',
            label: `${milestone}%`,
            value: milestone,
            customParameters: {
              scroll_depth: milestone,
              page_url: window.location.pathname,
              session_id: this.sessionId
            }
          });
        }
      }
    });
  };

  private handleMouseEnter = (event: MouseEvent) => {
    if (!this.isTracking) return;
    
    const target = event.target as Element;
    const elementInfo = this.getElementInfo(target);
    
    if (elementInfo.id) {
      this.currentHoverElement = elementInfo.id;
      this.hoverStartTime = Date.now();
    }
  };

  private handleMouseLeave = (event: MouseEvent) => {
    if (!this.isTracking || !this.currentHoverElement) return;
    
    const duration = Date.now() - this.hoverStartTime;
    
    if (duration > 500) { // Only track hovers longer than 500ms
      const target = event.target as Element;
      const elementInfo = this.getElementInfo(target);
      
      const hoverPoint: HoverData = {
        elementId: this.currentHoverElement,
        elementType: elementInfo.type,
        duration,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.hoverData.push(hoverPoint);
      
      if (window.analytics) {
        window.analytics.trackEvent({
          event: 'element_hover',
          category: 'Interaction',
          action: 'hover',
          label: this.currentHoverElement,
          value: duration,
          customParameters: {
            element_id: this.currentHoverElement,
            element_type: elementInfo.type,
            hover_duration: duration,
            session_id: this.sessionId
          }
        });
      }
    }
    
    this.currentHoverElement = null;
    this.hoverStartTime = 0;
  };

  private handleTouchStart = (event: TouchEvent) => {
    if (!this.isTracking) return;
    
    const touch = event.touches[0];
    const target = event.target as Element;
    const elementInfo = this.getElementInfo(target);
    
    const touchPoint: ClickData = {
      x: touch.clientX,
      y: touch.clientY + window.scrollY,
      elementId: elementInfo.id,
      elementType: elementInfo.type,
      elementText: elementInfo.text,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      sessionId: this.sessionId
    };
    
    this.clickData.push(touchPoint);
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.isTracking) return;
    
    // Throttle touch movement tracking
    if (Math.random() > 0.2) return; // Only track 20% of movements
    
    const touch = event.touches[0];
    const heatmapPoint: HeatmapData = {
      x: touch.clientX,
      y: touch.clientY + window.scrollY,
      intensity: 1,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      deviceType: this.getDeviceType(),
      sessionId: this.sessionId
    };
    
    this.heatmapData.push(heatmapPoint);
  };

  private handleFocus = (event: FocusEvent) => {
    if (!this.isTracking) return;
    
    const target = event.target as Element;
    const elementInfo = this.getElementInfo(target);
    
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'form_field_focus',
        category: 'Form',
        action: 'focus',
        label: elementInfo.id || elementInfo.type,
        customParameters: {
          element_id: elementInfo.id,
          element_type: elementInfo.type,
          session_id: this.sessionId
        }
      });
    }
  };

  private handleBlur = (event: FocusEvent) => {
    if (!this.isTracking) return;
    
    const target = event.target as HTMLInputElement;
    const elementInfo = this.getElementInfo(target);
    
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'form_field_blur',
        category: 'Form',
        action: 'blur',
        label: elementInfo.id || elementInfo.type,
        customParameters: {
          element_id: elementInfo.id,
          element_type: elementInfo.type,
          has_value: !!target.value,
          session_id: this.sessionId
        }
      });
    }
  };

  private handleInput = (event: InputEvent) => {
    if (!this.isTracking) return;
    
    const target = event.target as HTMLInputElement;
    const elementInfo = this.getElementInfo(target);
    
    // Throttle input tracking
    if (Math.random() > 0.3) return;
    
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'form_field_input',
        category: 'Form',
        action: 'input',
        label: elementInfo.id || elementInfo.type,
        customParameters: {
          element_id: elementInfo.id,
          element_type: elementInfo.type,
          input_length: target.value.length,
          session_id: this.sessionId
        }
      });
    }
  };

  private handleVisibilityChange = () => {
    if (!this.isTracking) return;
    
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'page_visibility',
        category: 'Engagement',
        action: document.hidden ? 'hidden' : 'visible',
        label: window.location.pathname,
        customParameters: {
          visibility_state: document.visibilityState,
          session_id: this.sessionId
        }
      });
    }
  };

  private handleResize = () => {
    if (!this.isTracking) return;
    
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'window_resize',
        category: 'Technical',
        action: 'resize',
        label: `${window.innerWidth}x${window.innerHeight}`,
        customParameters: {
          window_width: window.innerWidth,
          window_height: window.innerHeight,
          device_type: this.getDeviceType(),
          session_id: this.sessionId
        }
      });
    }
  };

  private initializeTracking() {
    // Send data periodically
    setInterval(() => {
      this.sendHeatmapData();
    }, 30000); // Every 30 seconds

    // Send data on page unload
    window.addEventListener('beforeunload', () => {
      this.sendHeatmapData();
    });
  }

  private async sendHeatmapData() {
    if (this.heatmapData.length === 0 && this.clickData.length === 0) return;

    const payload = {
      session_id: this.sessionId,
      page_url: window.location.pathname,
      timestamp: Date.now(),
      device_type: this.getDeviceType(),
      heatmap_data: this.heatmapData,
      click_data: this.clickData,
      scroll_data: this.scrollData,
      hover_data: this.hoverData
    };

    try {
      await fetch('/api/heatmap-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Clear sent data
      this.heatmapData = [];
      this.clickData = [];
      this.scrollData = [];
      this.hoverData = [];
    } catch (error) {
      console.warn('Failed to send heatmap data:', error);
    }
  }

  public getHeatmapData() {
    return {
      heatmap: this.heatmapData,
      clicks: this.clickData,
      scrolls: this.scrollData,
      hovers: this.hoverData
    };
  }
}

// React component for heatmap tracking
const HeatmapTrackerComponent: React.FC<{ sessionId: string; enabled?: boolean }> = ({ 
  sessionId, 
  enabled = true 
}) => {
  const trackerRef = useRef<HeatmapTracker | null>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    if (!enabled) return;

    trackerRef.current = new HeatmapTracker(sessionId);
    trackerRef.current.startTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
      }
    };
  }, [sessionId, enabled]);

  return null; // This component doesn't render anything
};

// Hook for using heatmap tracker
export const useHeatmapTracker = (sessionId: string) => {
  const [tracker] = useState(() => new HeatmapTracker(sessionId));

  useEffect(() => {
    tracker.startTracking();
    return () => tracker.stopTracking();
  }, [tracker]);

  return {
    getHeatmapData: () => tracker.getHeatmapData(),
    startTracking: () => tracker.startTracking(),
    stopTracking: () => tracker.stopTracking()
  };
};

export default HeatmapTrackerComponent;
