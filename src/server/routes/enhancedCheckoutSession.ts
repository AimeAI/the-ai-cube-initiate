import express, { Request, Response, NextFunction, RequestHandler, Router } from 'express';
import Stripe from 'stripe';
import { ENHANCED_PRICE_IDS, getEnhancedPlanById, getPriceId, BillingPeriod } from '../../lib/enhancedStripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load server environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | undefined;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia',
  });
} else {
  console.error('FATAL: STRIPE_SECRET_KEY is not set. Payment processing will be disabled.');
}

import { requireAuth, rateLimit } from '../middleware/auth';

const router: Router = express.Router();

// Apply rate limiting and authentication
router.use(rateLimit(20, 60000)); // 20 requests per minute

interface CheckoutRequest extends Request {
  body: {
    planId: string;
    billingPeriod: BillingPeriod;
    quantity?: number;
  };
  user?: {
    id: string;
    email: string;
  };
}

const enhancedCheckoutSessionHandler: RequestHandler = async (req: CheckoutRequest, res: Response, next: NextFunction) => {
  if (!stripe || !stripeSecretKey) {
    const err = new Error('Payment system is not configured or STRIPE_SECRET_KEY is missing.');
    console.error(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  try {
    const { planId, billingPeriod, quantity: rawQuantity } = req.body;

    // Validate planId
    if (typeof planId !== 'string' || planId.trim() === '') {
      res.status(400).json({ error: 'Plan ID is required and must be a non-empty string.' });
      return;
    }

    // Validate billingPeriod
    if (typeof billingPeriod !== 'string' || (billingPeriod !== 'monthly' && billingPeriod !== 'yearly')) {
      res.status(400).json({ error: 'Billing period is required and must be "monthly" or "yearly".' });
      return;
    }

    // Validate plan exists
    const plan = getEnhancedPlanById(planId.trim());
    if (!plan) {
      console.error(`Plan not found: ${planId}`);
      res.status(400).json({ error: 'Invalid plan ID.' });
      return;
    }

    // Get the appropriate price ID
    let priceId: string;
    try {
      priceId = getPriceId(planId.trim(), billingPeriod);
    } catch (error) {
      console.error(`Error getting price ID for plan ${planId} with billing period ${billingPeriod}:`, error);
      res.status(400).json({ error: 'Invalid plan or billing period combination.' });
      return;
    }

    // Validate quantity
    let quantity: number = 1;
    if (rawQuantity !== undefined) {
      const parsedQuantity = Number(rawQuantity);
      if (Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
        quantity = parsedQuantity;
      } else {
        res.status(400).json({ error: 'Quantity, if provided, must be a positive integer.' });
        return;
      }
    }

    // Get origin for redirect URLs
    const origin = req.headers.origin || process.env.PUBLIC_APP_URL || 'http://localhost:8080';
    
    // Get user information
    const userEmail = req.user?.email;
    const userId = req.user?.id;
    
    if (!userEmail || !userId) {
      res.status(400).json({ error: 'User authentication required for checkout' });
      return;
    }

    console.log(`Creating checkout session for user ${userId}, plan ${planId}, billing ${billingPeriod}`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'subscription',
      customer_email: userEmail,
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: planId,
        billing_period: billingPeriod,
        plan_name: plan.name,
        created_at: new Date().toISOString()
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
          billing_period: billingPeriod,
          plan_name: plan.name
        }
      },
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
      // Set billing address collection
      billing_address_collection: 'required',
      // Add tax calculation if configured
      automatic_tax: {
        enabled: false // Set to true if you have tax calculation configured
      }
    });

    console.log(`Checkout session created: ${session.id}`);

    res.json({ 
      sessionId: session.id,
      url: session.url,
      planName: plan.name,
      billingPeriod: billingPeriod,
      amount: billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
    });

  } catch (error: unknown) {
    console.error('Error creating enhanced checkout session:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error:', error.type, error.message);
      res.status(400).json({ 
        error: 'Payment processing error', 
        details: error.message 
      });
      return;
    }

    // Handle general errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

// Health check endpoint for the enhanced checkout
const healthCheckHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const isStripeConfigured = !!stripe && !!stripeSecretKey;
    const plans = Object.keys(ENHANCED_PRICE_IDS);
    
    res.json({
      status: 'ok',
      stripe_configured: isStripeConfigured,
      available_plans: plans,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Routes
router.post('/', requireAuth, enhancedCheckoutSessionHandler);
router.get('/health', healthCheckHandler);

export default router;
