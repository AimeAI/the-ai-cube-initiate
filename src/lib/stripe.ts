import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// Updated pricing structure with multiple tiers
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  productId: string;
  features: string[];
  gameAccess: number | 'all';
  popular?: boolean;
  familyPlan?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Perfect for getting started with AI learning',
    price: 7.99,
    priceId: 'price_explorer_monthly', // Replace with actual Stripe price ID
    productId: 'prod_explorer',
    gameAccess: 5,
    features: [
      'Access to 5 foundational games',
      'Basic progress tracking',
      'Email support',
      'Mobile & desktop access'
    ]
  },
  {
    id: 'initiate',
    name: 'Initiate',
    description: 'Complete AI education experience',
    price: 14.99,
    priceId: 'price_initiate_monthly', // Replace with actual Stripe price ID
    productId: 'prod_initiate',
    gameAccess: 'all',
    popular: true,
    features: [
      'Access to all 15+ games',
      'Advanced progress tracking',
      'Parent dashboard',
      'Priority support',
      'Learning certificates',
      'Offline mode'
    ]
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Premium experience with personalized guidance',
    price: 24.99,
    priceId: 'price_master_monthly', // Replace with actual Stripe price ID
    productId: 'prod_master',
    gameAccess: 'all',
    features: [
      'Everything in Initiate',
      '1-on-1 virtual tutoring (monthly)',
      'Advanced analytics & insights',
      'Early access to new games',
      'Custom learning paths',
      'Priority feature requests'
    ]
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Perfect for families with multiple learners',
    price: 19.99,
    priceId: 'price_family_monthly', // Replace with actual Stripe price ID
    productId: 'prod_family',
    gameAccess: 'all',
    familyPlan: true,
    features: [
      'Up to 4 student accounts',
      'Family progress dashboard',
      'All Initiate features',
      'Bulk progress reports',
      'Family challenges',
      'Shared achievements'
    ]
  }
];

// Legacy support - map old plan IDs to new structure
export const PRICE_IDS = {
  // Legacy
  seekersSparkMonthly: 'price_initiate_monthly',
  
  // New structure
  explorerMonthly: 'price_explorer_monthly',
  initiateMonthly: 'price_initiate_monthly', 
  masterMonthly: 'price_master_monthly',
  familyMonthly: 'price_family_monthly'
};

// Legacy Plan interface for backward compatibility
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  currency: string;
  metadata: {
    full_price: number;
  };
}

// Helper functions
export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

export function getPlanByPriceId(priceId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.priceId === priceId);
}

export function getDefaultPlan(): PricingPlan {
  return PRICING_PLANS.find(plan => plan.popular) || PRICING_PLANS[1];
}

export function getPlans(): PricingPlan[] {
  return PRICING_PLANS;
}

// Legacy function for backward compatibility
export function getLegacyPlans(): Plan[] {
  return [
    {
      id: 'initiate',
      name: 'Initiate Plan',
      price: 14.99,
      interval: 'month',
      currency: 'usd',
      metadata: {
        full_price: 14.99,
      },
    }
  ];
}

// Plan feature access helpers
export function hasGameAccess(planId: string, gameCount: number): boolean {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  return plan.gameAccess === 'all' || (typeof plan.gameAccess === 'number' && gameCount <= plan.gameAccess);
}

export function canAccessPremiumFeatures(planId: string): boolean {
  const plan = getPlanById(planId);
  return plan?.id === 'master' || plan?.id === 'family';
}

export function isFamilyPlan(planId: string): boolean {
  const plan = getPlanById(planId);
  return plan?.familyPlan === true;
}

// A/B testing support
export interface PricingTest {
  testId: string;
  variants: {
    [key: string]: {
      price: number;
      weight: number; // 0-100
    }
  }
}

export const PRICING_TESTS: { [planId: string]: PricingTest } = {
  initiate: {
    testId: 'initiate_pricing_v1',
    variants: {
      'control': { price: 14.99, weight: 34 },
      'variant_a': { price: 12.99, weight: 33 },
      'variant_b': { price: 17.99, weight: 33 }
    }
  }
};

export function getTestPrice(planId: string, userId?: string): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;

  const test = PRICING_TESTS[planId];
  if (!test || !userId) return plan.price;

  // Simple hash-based assignment for consistent user experience
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const bucket = Math.abs(hash) % 100;
  let cumulative = 0;
  
  for (const [variant, config] of Object.entries(test.variants)) {
    cumulative += config.weight;
    if (bucket < cumulative) {
      return config.price;
    }
  }
  
  return plan.price;
}
