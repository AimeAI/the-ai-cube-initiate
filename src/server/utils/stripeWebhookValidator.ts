/**
 * Production Stripe Webhook Validator
 * Ensures webhooks are properly authenticated and processed
 */

import Stripe from 'stripe';
import { Request, Response } from 'express';

export interface WebhookValidationResult {
  isValid: boolean;
  event?: Stripe.Event;
  error?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Validates Stripe webhook signature and returns parsed event
 */
export function validateStripeWebhook(
  req: Request,
  stripe: Stripe,
  webhookSecret: string
): WebhookValidationResult {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return {
        isValid: false,
        error: 'Missing Stripe signature header',
        riskLevel: 'high'
      };
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    // Additional security validations
    const validationResult = performSecurityValidations(event, req);
    
    return {
      isValid: true,
      event,
      riskLevel: validationResult.riskLevel
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine risk level based on error type
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (errorMessage.includes('signature')) {
      riskLevel = 'high'; // Potential attack
    } else if (errorMessage.includes('timestamp')) {
      riskLevel = 'medium'; // Possible replay attack
    }

    return {
      isValid: false,
      error: errorMessage,
      riskLevel
    };
  }
}

/**
 * Additional security validations for webhook events
 */
function performSecurityValidations(
  event: Stripe.Event,
  req: Request
): { riskLevel: 'low' | 'medium' | 'high'; warnings: string[] } {
  const warnings: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check event age (should be recent)
  const eventAge = Date.now() - (event.created * 1000);
  const maxAgeMs = 5 * 60 * 1000; // 5 minutes
  
  if (eventAge > maxAgeMs) {
    warnings.push(`Event is ${Math.round(eventAge / 1000)}s old`);
    riskLevel = 'medium';
  }

  // Check for duplicate events (basic check)
  if (isLikelyDuplicateEvent(event)) {
    warnings.push('Potential duplicate event detected');
    riskLevel = 'medium';
  }

  // Validate event data structure
  if (!isValidEventStructure(event)) {
    warnings.push('Event structure validation failed');
    riskLevel = 'high';
  }

  // Check request metadata
  const userAgent = req.headers['user-agent'] || '';
  if (!userAgent.includes('Stripe')) {
    warnings.push('Unexpected user agent');
    riskLevel = 'medium';
  }

  return { riskLevel, warnings };
}

/**
 * Check if event is likely a duplicate (basic implementation)
 */
function isLikelyDuplicateEvent(event: Stripe.Event): boolean {
  // In production, you'd want to store processed event IDs in Redis/DB
  // and check against them. For now, this is a placeholder.
  return false;
}

/**
 * Validate event structure matches expected format
 */
function isValidEventStructure(event: Stripe.Event): boolean {
  // Basic structure validation
  if (!event.id || !event.type || !event.data || !event.created) {
    return false;
  }

  // Validate specific event types we handle
  const validEventTypes = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
  ];

  if (!validEventTypes.includes(event.type)) {
    return false;
  }

  // Event-specific validations
  switch (event.type) {
    case 'checkout.session.completed':
      return validateCheckoutSessionEvent(event);
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      return validatePaymentIntentEvent(event);
    default:
      return true;
  }
}

/**
 * Validate checkout session event structure
 */
function validateCheckoutSessionEvent(event: Stripe.Event): boolean {
  const session = event.data.object as Stripe.Checkout.Session;
  
  return !!(
    session.id &&
    session.customer &&
    session.subscription &&
    session.status === 'complete'
  );
}

/**
 * Validate payment intent event structure
 */
function validatePaymentIntentEvent(event: Stripe.Event): boolean {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  return !!(
    paymentIntent.id &&
    paymentIntent.amount &&
    paymentIntent.currency &&
    paymentIntent.status
  );
}

/**
 * Rate limiting for webhook endpoints
 */
export class WebhookRateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 50, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if request should be rate limited
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier);

    if (!attempts || now > attempts.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return false;
    }

    if (attempts.count >= this.maxAttempts) {
      return true;
    }

    attempts.count++;
    return false;
  }

  /**
   * Get remaining attempts for identifier
   */
  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier);
    if (!attempts || Date.now() > attempts.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - attempts.count);
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Webhook event processor with error handling and retry logic
 */
export class WebhookEventProcessor {
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(maxRetries = 3, retryDelayMs = 1000) {
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  /**
   * Process webhook event with automatic retry on failure
   */
  async processEvent(
    event: Stripe.Event,
    handler: (event: Stripe.Event) => Promise<void>
  ): Promise<{ success: boolean; error?: string; attempts: number }> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < this.maxRetries) {
      attempts++;
      
      try {
        await handler(event);
        return { success: true, attempts };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Log attempt failure
        console.warn(`Webhook event ${event.id} processing failed (attempt ${attempts}/${this.maxRetries}):`, lastError.message);
        
        // Don't retry on certain error types
        if (this.isNonRetryableError(lastError)) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempts < this.maxRetries) {
          await this.delay(this.retryDelayMs * Math.pow(2, attempts - 1));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Unknown error',
      attempts
    };
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: Error): boolean {
    const nonRetryablePatterns = [
      'duplicate',
      'already exists',
      'invalid format',
      'validation failed'
    ];

    return nonRetryablePatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern)
    );
  }

  /**
   * Promise-based delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Webhook audit logger for compliance and debugging
 */
export interface WebhookAuditEntry {
  eventId: string;
  eventType: string;
  processedAt: Date;
  success: boolean;
  error?: string;
  riskLevel: 'low' | 'medium' | 'high';
  processingTimeMs: number;
  retryCount: number;
}

export class WebhookAuditor {
  private auditLog: WebhookAuditEntry[] = [];
  private readonly maxLogSize: number;

  constructor(maxLogSize = 1000) {
    this.maxLogSize = maxLogSize;
  }

  /**
   * Log webhook processing attempt
   */
  logWebhookAttempt(entry: WebhookAuditEntry): void {
    this.auditLog.push(entry);
    
    // Keep log size manageable
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog.shift();
    }

    // Log to console for immediate visibility
    const status = entry.success ? '✅' : '❌';
    console.log(`${status} Webhook ${entry.eventType} (${entry.eventId}) - ${entry.processingTimeMs}ms`);
    
    if (!entry.success && entry.error) {
      console.error(`   Error: ${entry.error}`);
    }
  }

  /**
   * Get recent audit entries
   */
  getRecentEntries(count = 10): WebhookAuditEntry[] {
    return this.auditLog.slice(-count);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalEvents: number;
    successRate: number;
    errorRate: number;
    avgProcessingTime: number;
  } {
    const total = this.auditLog.length;
    const successful = this.auditLog.filter(e => e.success).length;
    const avgTime = this.auditLog.reduce((sum, e) => sum + e.processingTimeMs, 0) / total;

    return {
      totalEvents: total,
      successRate: total > 0 ? successful / total : 0,
      errorRate: total > 0 ? (total - successful) / total : 0,
      avgProcessingTime: avgTime || 0
    };
  }
}