import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Plan tier mapping
const PLAN_TIERS = {
  'prod_explorer': 'explorer',
  'prod_initiate': 'initiate', 
  'prod_master': 'master',
  'prod_family': 'family'
};

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;
  const productId = session.metadata?.product_id;

  if (!userId || !planId || !productId) {
    throw new Error('Missing required metadata in checkout session');
  }

  // Get subscription details
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const priceId = subscription.items.data[0]?.price.id;
  const customerId = subscription.customer as string;

  // Determine plan tier
  const planTier = PLAN_TIERS[productId as keyof typeof PLAN_TIERS] || 'initiate';

  // Upsert user subscription in database
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      customer_id: customerId,
      subscription_id: subscriptionId,
      plan_id: productId,
      plan_tier: planTier,
      price_id: priceId,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'subscription_id'
    });

  if (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }

  console.log(`Subscription activated for user ${userId} with plan ${planTier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.warn('No user_id in subscription metadata');
    return;
  }

  // Update subscription status
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log(`Subscription ${subscription.id} updated to status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  // Mark subscription as canceled
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Failed to cancel subscription:', error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log(`Subscription ${subscription.id} marked as canceled`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  if (invoice.subscription) {
    // Update subscription status to past_due
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', invoice.subscription as string);

    if (error) {
      console.error('Failed to update subscription status:', error);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
      throw new Error('Stripe configuration missing');
    }

    // Get raw body for signature verification
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        process.env.STRIPE_WEBHOOK_SIGNING_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        console.log('Payment succeeded for invoice:', event.data.object.id);
        // Could add logic to send confirmation emails, etc.
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
}
