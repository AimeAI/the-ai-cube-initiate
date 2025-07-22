import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

// Updated pricing structure
const PRICING_PLANS = {
  explorer: {
    monthly: 'price_explorer_monthly', // Replace with actual Stripe price ID
    productId: 'prod_explorer'
  },
  initiate: {
    monthly: 'price_initiate_monthly', // Replace with actual Stripe price ID
    productId: 'prod_initiate'
  },
  master: {
    monthly: 'price_master_monthly', // Replace with actual Stripe price ID
    productId: 'prod_master'
  },
  family: {
    monthly: 'price_family_monthly', // Replace with actual Stripe price ID
    productId: 'prod_family'
  }
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] as string || req.headers['x-real-ip'] as string || 'unknown';
  if (!rateLimit(clientIP)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration is missing');
    }

    // Extract and validate request data
    const { planId, billingPeriod = 'monthly' } = req.body;

    if (!planId || typeof planId !== 'string') {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    if (billingPeriod !== 'monthly') {
      return res.status(400).json({ error: 'Only monthly billing is currently supported' });
    }

    // Validate plan exists
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!user.email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Determine success and cancel URLs
    const origin = req.headers.origin || process.env.VERCEL_URL || 'https://aicube.ai';
    const successUrl = `${origin}/dashboard/student?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`;
    const cancelUrl = `${origin}/payment?cancelled=true`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.monthly,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        product_id: plan.productId
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_id: planId
        }
      }
    });

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    
    // Don't expose internal errors to client
    const errorMessage = error.message?.includes('Invalid API Key') 
      ? 'Payment system configuration error'
      : 'Failed to create checkout session';
      
    return res.status(500).json({ error: errorMessage });
  }
}
