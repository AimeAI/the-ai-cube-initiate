import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  validateStripeWebhook,
  WebhookRateLimiter,
  WebhookEventProcessor,
  WebhookAuditor,
  type WebhookAuditEntry
} from '../utils/stripeWebhookValidator';

// Load server environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const router: Router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase admin client
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

if (!stripeSecretKey || !webhookSecret) {
  console.error('Stripe configuration missing. Webhooks disabled.');
}

if (!supabaseAdmin) {
  console.error('Supabase admin client not initialized. Database operations disabled.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
}) : null;

// Production webhook utilities
const rateLimiter = new WebhookRateLimiter(100, 60000); // 100 requests per minute
const eventProcessor = new WebhookEventProcessor(3, 1000); // 3 retries with exponential backoff
const auditor = new WebhookAuditor(5000); // Keep 5000 audit entries

// Webhook needs raw body, so we use express.raw() instead of express.json()
router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Check rate limiting
    if (rateLimiter.isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: 60
      });
    }

    if (!stripe || !webhookSecret) {
      return res.status(500).json({ error: 'Webhook configuration missing' });
    }

    // Validate webhook signature and extract event
    const validation = validateStripeWebhook(req, stripe, webhookSecret);
    
    if (!validation.isValid || !validation.event) {
      const auditEntry: WebhookAuditEntry = {
        eventId: 'unknown',
        eventType: 'validation_failed',
        processedAt: new Date(),
        success: false,
        error: validation.error,
        riskLevel: validation.riskLevel,
        processingTimeMs: Date.now() - startTime,
        retryCount: 0
      };
      auditor.logWebhookAttempt(auditEntry);
      
      console.error('Webhook validation failed:', validation.error);
      return res.status(400).send(`Webhook Error: ${validation.error}`);
    }

    const event = validation.event;

    // Process event with automatic retry and auditing
    const processingResult = await eventProcessor.processEvent(event, async (event) => {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutSessionCompleted(session);
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentSucceeded(paymentIntent);
          break;
        }

        case 'payment_intent.payment_failed': {
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          await handlePaymentFailed(failedPayment);
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionChange(subscription);
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    });

    // Log audit entry
    const auditEntry: WebhookAuditEntry = {
      eventId: event.id,
      eventType: event.type,
      processedAt: new Date(),
      success: processingResult.success,
      error: processingResult.error,
      riskLevel: validation.riskLevel,
      processingTimeMs: Date.now() - startTime,
      retryCount: processingResult.attempts - 1
    };
    auditor.logWebhookAttempt(auditEntry);

    if (processingResult.success) {
      res.json({ received: true, eventId: event.id });
    } else {
      console.error(`Webhook processing failed after ${processingResult.attempts} attempts:`, processingResult.error);
      res.status(500).json({ 
        error: 'Webhook processing failed',
        eventId: event.id,
        attempts: processingResult.attempts
      });
    }
  }
);

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  console.log('💰 Payment succeeded:', paymentIntent.id);
  
  // Log payment success to payment_history table
  try {
    const { error } = await supabaseAdmin
      .from('payment_history')
      .insert({
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        payment_method_type: paymentIntent.payment_method_types?.[0] || 'unknown',
        paid_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log payment success:', error);
    }
  } catch (error) {
    console.error('Error logging payment success:', error);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  console.error('💸 Payment failed:', paymentIntent.id);
  
  // Log payment failure
  try {
    const { error } = await supabaseAdmin
      .from('payment_history')
      .insert({
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        payment_method_type: paymentIntent.payment_method_types?.[0] || 'unknown',
        failure_code: paymentIntent.last_payment_error?.code || 'unknown',
        failure_message: paymentIntent.last_payment_error?.message || 'Payment failed',
        failed_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log payment failure:', error);
    }

    // TODO: Send notification email to user about payment failure
    // TODO: Consider updating subscription status if needed
  } catch (error) {
    console.error('Error logging payment failure:', error);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  if (!supabaseAdmin) {
    console.error('Cannot fulfill subscription: Supabase admin client not available');
    return;
  }

  const customerEmail = session.customer_email;
  const customerId = session.customer;
  
  if (!customerEmail) {
    console.error('No customer email found in session');
    return;
  }

  try {
    // Find the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(customerEmail);
    
    if (userError || !userData.user) {
      console.error('User not found:', customerEmail, userError);
      return;
    }

    const userId = userData.user.id;

    // Get line items to determine what was purchased
    if (!stripe) {
      console.error('Stripe client not available');
      return;
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });

    // Create or update subscription record
    for (const item of lineItems.data) {
      const priceId = item.price?.id;
      const productId = typeof item.price?.product === 'string' 
        ? item.price.product 
        : item.price?.product?.id;

      if (priceId && productId) {
        const { error: subscriptionError } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            customer_id: customerId,
            subscription_id: session.subscription || session.id,
            plan_id: productId,
            price_id: priceId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (subscriptionError) {
          console.error('Error creating subscription record:', subscriptionError);
        } else {
          console.log('Successfully created subscription for user:', userId, 'plan:', productId);
        }
      }
    }
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Subscription changed:', subscription.id, subscription.status);
  
  if (!supabaseAdmin) {
    console.error('Cannot update subscription: Supabase admin client not available');
    return;
  }

  try {
    // Update subscription status in database
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
    } else {
      console.log('Successfully updated subscription:', subscription.id, 'status:', subscription.status);
    }
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

export default router;