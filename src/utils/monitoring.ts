/**
 * Production Monitoring & Error Tracking
 * Centralized system for application health monitoring
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: Date;
  environment: string;
  version?: string;
  additionalData?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: Date;
}

/**
 * Error tracking and reporting system
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private sentryDsn?: string;
  private environment: string;
  private errorBuffer: Array<{ error: Error; context: ErrorContext }> = [];
  private readonly maxBufferSize = 100;

  private constructor() {
    this.environment = import.meta.env.MODE || 'development';
    this.sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    
    this.initializeSentry();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Initialize Sentry for error tracking (if configured)
   */
  private async initializeSentry(): Promise<void> {
    if (!this.sentryDsn) {
      console.warn('Sentry DSN not configured. Error tracking will use local logging only.');
      return;
    }

    try {
      const Sentry = await import('@sentry/browser');
      
      Sentry.init({
        dsn: this.sentryDsn,
        environment: this.environment,
        release: import.meta.env.VITE_APP_VERSION || 'unknown',
        integrations: [
          new Sentry.BrowserTracing({
            tracePropagationTargets: ['localhost', /^https:\/\/.*\.aicube\.ai/],
          }),
        ],
        tracesSampleRate: this.environment === 'production' ? 0.1 : 1.0,
        beforeSend(event) {
          // Filter out sensitive information
          return ErrorTracker.sanitizeEvent(event);
        },
      });

      console.log('✅ Sentry error tracking initialized');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        timestamp: new Date(),
        environment: this.environment,
        additionalData: { type: 'unhandledRejection' }
      });
    });

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        timestamp: new Date(),
        environment: this.environment,
        url: event.filename,
        additionalData: { 
          type: 'globalError',
          line: event.lineno,
          column: event.colno
        }
      });
    });

    // React error boundaries will call captureError directly
  }

  /**
   * Capture and report an error
   */
  captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    const fullContext: ErrorContext = {
      timestamp: new Date(),
      environment: this.environment,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };

    // Add to local buffer
    this.errorBuffer.push({ error, context: fullContext });
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift();
    }

    // Log to console for immediate visibility
    console.error('🚨 Error captured:', error.message, {
      stack: error.stack,
      context: fullContext
    });

    // Send to external service if available
    this.sendToExternalService(error, fullContext);
  }

  /**
   * Send error to external monitoring service
   */
  private async sendToExternalService(error: Error, context: ErrorContext): Promise<void> {
    try {
      if (this.sentryDsn) {
        const Sentry = await import('@sentry/browser');
        
        Sentry.withScope((scope) => {
          scope.setUser({ id: context.userId });
          scope.setTag('environment', context.environment);
          scope.setContext('errorContext', context);
          
          if (context.additionalData) {
            Object.entries(context.additionalData).forEach(([key, value]) => {
              scope.setExtra(key, value);
            });
          }
          
          Sentry.captureException(error);
        });
      }
    } catch (sentryError) {
      console.error('Failed to send error to Sentry:', sentryError);
    }
  }

  /**
   * Sanitize event before sending to external service
   */
  private static sanitizeEvent(event: any): any {
    // Remove sensitive information
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'authorization',
      'stripe_secret', 'supabase_key', 'session_secret'
    ];

    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const sanitized = { ...obj };
      
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => 
          key.toLowerCase().includes(sensitive.toLowerCase())
        )) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object') {
          sanitized[key] = sanitize(sanitized[key]);
        }
      }
      
      return sanitized;
    };

    return sanitize(event);
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(count = 10): Array<{ error: Error; context: ErrorContext }> {
    return this.errorBuffer.slice(-count);
  }

  /**
   * Clear error buffer
   */
  clearErrors(): void {
    this.errorBuffer = [];
  }
}

/**
 * Performance monitoring system
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;
  private performanceObserver?: PerformanceObserver;

  private constructor() {
    this.initializePerformanceObserver();
    this.monitorCoreWebVitals();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance observer for automated metrics
   */
  private initializePerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: `navigation.${entry.name}`,
            value: entry.duration,
            unit: 'ms',
            timestamp: new Date(),
            tags: { type: entry.entryType }
          });
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure'] 
      });
    } catch (error) {
      console.error('Failed to initialize PerformanceObserver:', error);
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  private async monitorCoreWebVitals(): Promise<void> {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

      getCLS((metric) => {
        this.recordMetric({
          name: 'core_web_vitals.cls',
          value: metric.value,
          unit: 'count',
          timestamp: new Date(),
          tags: { vital: 'cls', rating: this.getVitalRating(metric.value, 'cls') }
        });
      });

      getFID((metric) => {
        this.recordMetric({
          name: 'core_web_vitals.fid',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
          tags: { vital: 'fid', rating: this.getVitalRating(metric.value, 'fid') }
        });
      });

      getFCP((metric) => {
        this.recordMetric({
          name: 'core_web_vitals.fcp',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
          tags: { vital: 'fcp', rating: this.getVitalRating(metric.value, 'fcp') }
        });
      });

      getLCP((metric) => {
        this.recordMetric({
          name: 'core_web_vitals.lcp',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
          tags: { vital: 'lcp', rating: this.getVitalRating(metric.value, 'lcp') }
        });
      });

      getTTFB((metric) => {
        this.recordMetric({
          name: 'core_web_vitals.ttfb',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
          tags: { vital: 'ttfb', rating: this.getVitalRating(metric.value, 'ttfb') }
        });
      });

      console.log('✅ Core Web Vitals monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize Core Web Vitals monitoring:', error);
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log significant performance issues
    if (this.isSignificantMetric(metric)) {
      console.warn('⚠️ Performance issue detected:', metric);
    }
  }

  /**
   * Get vital rating (good, needs-improvement, poor)
   */
  private getVitalRating(value: number, vital: string): string {
    const thresholds: Record<string, { good: number; poor: number }> = {
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[vital];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Check if metric indicates a significant performance issue
   */
  private isSignificantMetric(metric: PerformanceMetric): boolean {
    const significantThresholds: Record<string, number> = {
      'core_web_vitals.lcp': 4000, // LCP > 4s
      'core_web_vitals.fid': 300,  // FID > 300ms
      'core_web_vitals.cls': 0.25, // CLS > 0.25
      'api_response_time': 5000    // API > 5s
    };

    const threshold = significantThresholds[metric.name];
    return threshold !== undefined && metric.value > threshold;
  }

  /**
   * Get recent metrics
   */
  getMetrics(name?: string, limit = 100): PerformanceMetric[] {
    let filtered = this.metrics;
    
    if (name) {
      filtered = this.metrics.filter(m => m.name === name);
    }
    
    return filtered.slice(-limit);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    coreWebVitals: Record<string, { value: number; rating: string }>;
    apiPerformance: { averageResponseTime: number; errorRate: number };
    resourcesLoaded: number;
  } {
    const vitals = ['cls', 'fid', 'fcp', 'lcp', 'ttfb'];
    const coreWebVitals: Record<string, { value: number; rating: string }> = {};

    vitals.forEach(vital => {
      const metric = this.metrics
        .filter(m => m.name === `core_web_vitals.${vital}`)
        .slice(-1)[0];
      
      if (metric) {
        coreWebVitals[vital] = {
          value: metric.value,
          rating: metric.tags?.rating || 'unknown'
        };
      }
    });

    const apiMetrics = this.metrics.filter(m => m.name.includes('api_'));
    const avgResponseTime = apiMetrics.length > 0
      ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
      : 0;

    return {
      coreWebVitals,
      apiPerformance: {
        averageResponseTime: avgResponseTime,
        errorRate: 0 // Would be calculated from error metrics
      },
      resourcesLoaded: this.metrics.filter(m => m.name.includes('resource')).length
    };
  }
}

/**
 * Health check system for external services
 */
export class HealthChecker {
  private static instance: HealthChecker;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private checkInterval: number | null = null;

  private constructor() {}

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  /**
   * Start periodic health checks
   */
  startPeriodicChecks(intervalMs = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = window.setInterval(async () => {
      await this.runAllHealthChecks();
    }, intervalMs);

    // Run initial check
    this.runAllHealthChecks();
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Run all configured health checks
   */
  async runAllHealthChecks(): Promise<void> {
    const checks = [
      this.checkSupabase(),
      this.checkStripe(),
      this.checkAPI()
    ];

    await Promise.allSettled(checks);
  }

  /**
   * Check Supabase connectivity
   */
  private async checkSupabase(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        timeout: 5000
      });

      const responseTime = Date.now() - startTime;
      
      this.healthChecks.set('supabase', {
        service: 'supabase',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        lastChecked: new Date()
      });
    } catch (error) {
      this.healthChecks.set('supabase', {
        service: 'supabase',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    }
  }

  /**
   * Check Stripe service availability
   */
  private async checkStripe(): Promise<void> {
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error('Stripe key not configured');
      }

      // Simple check - validate key format
      const isValidKey = stripeKey.startsWith('pk_');
      
      this.healthChecks.set('stripe', {
        service: 'stripe',
        status: isValidKey ? 'healthy' : 'unhealthy',
        error: isValidKey ? undefined : 'Invalid Stripe key format',
        lastChecked: new Date()
      });
    } catch (error) {
      this.healthChecks.set('stripe', {
        service: 'stripe',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    }
  }

  /**
   * Check API endpoints
   */
  private async checkAPI(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // In production, this would check your actual API health endpoint
      const response = await fetch('/api/health', {
        method: 'GET',
        timeout: 5000
      });

      const responseTime = Date.now() - startTime;
      
      this.healthChecks.set('api', {
        service: 'api',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        lastChecked: new Date()
      });
    } catch (error) {
      this.healthChecks.set('api', {
        service: 'api',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: HealthCheck[];
  } {
    const services = Array.from(this.healthChecks.values());
    
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (services.some(s => s.status === 'unhealthy')) {
      overall = 'unhealthy';
    } else if (services.some(s => s.status === 'degraded')) {
      overall = 'degraded';
    }

    return { overall, services };
  }
}

/**
 * Initialize all monitoring systems
 */
export function initializeMonitoring(): {
  errorTracker: ErrorTracker;
  performanceMonitor: PerformanceMonitor;
  healthChecker: HealthChecker;
} {
  console.log('🔍 Initializing production monitoring...');
  
  const errorTracker = ErrorTracker.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const healthChecker = HealthChecker.getInstance();
  
  // Start health checks every 2 minutes
  healthChecker.startPeriodicChecks(120000);
  
  console.log('✅ Monitoring systems initialized');
  
  return { errorTracker, performanceMonitor, healthChecker };
}

// Global access for debugging
if (typeof window !== 'undefined') {
  (window as any).__monitoring = {
    errorTracker: ErrorTracker.getInstance(),
    performanceMonitor: PerformanceMonitor.getInstance(),
    healthChecker: HealthChecker.getInstance()
  };
}