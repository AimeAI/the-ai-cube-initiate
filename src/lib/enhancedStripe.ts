import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// Enhanced pricing structure with monthly and yearly options
export interface EnhancedPricingPlan {
  id: string;
  name: string;
  description: string;
  hook: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceId: string;
  yearlyPriceId: string;
  productId: string;
  features: string[];
  gameAccess: number | 'all';
  popular?: boolean;
  familyPlan?: boolean;
  icon: string;
  cta: string;
  bestFor: string;
}

export const ENHANCED_PRICING_PLANS: EnhancedPricingPlan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Perfect for curious minds beginning their AI journey',
    hook: '🌱 Just starting out?',
    monthlyPrice: 8,
    yearlyPrice: 64, // 20% off
    monthlyPriceId: 'price_explorer_monthly',
    yearlyPriceId: 'price_explorer_yearly',
    productId: 'prod_explorer',
    gameAccess: 3,
    features: [
      'Access to 3 core AI games',
      'Basic progress tracking',
      'Student dashboard',
      'Community support',
      'Mobile-friendly experience'
    ],
    icon: '🌱',
    cta: 'Start Exploring',
    bestFor: 'Curious learners exploring AI for the first time'
  },
  {
    id: 'initiate',
    name: 'Initiate',
    description: 'Full access to accelerate your AI learning',
    hook: '⚡ Ready to master AI?',
    monthlyPrice: 15,
    yearlyPrice: 120, // 20% off
    monthlyPriceId: 'price_initiate_monthly',
    yearlyPriceId: 'price_initiate_yearly',
    productId: 'prod_initiate',
    gameAccess: 'all',
    popular: true,
    features: [
      'Access to all 8 AI games',
      'Advanced progress analytics',
      'Achievement system',
      'Parent dashboard',
      'Priority support',
      'Downloadable certificates'
    ],
    icon: '⚡',
    cta: 'Become an Initiate',
    bestFor: 'Dedicated learners who want full access and progress tools'
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Premium experience with mentorship and early access',
    hook: '🎯 Want expert help?',
    monthlyPrice: 25,
    yearlyPrice: 200, // 20% off
    monthlyPriceId: 'price_master_monthly',
    yearlyPriceId: 'price_master_yearly',
    productId: 'prod_master',
    gameAccess: 'all',
    features: [
      'Everything in Initiate',
      'Monthly 1-on-1 AI mentorship',
      'Early access to new games',
      'Custom learning paths',
      'Advanced analytics',
      'Priority feature requests',
      'Exclusive Master community'
    ],
    icon: '🎯',
    cta: 'Unlock Mastery',
    bestFor: 'Ambitious learners needing mentorship and early access'
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Perfect for families learning AI together',
    hook: '👨‍👩‍👧‍👦 Learning as a family?',
    monthlyPrice: 20,
    yearlyPrice: 160, // 20% off
    monthlyPriceId: 'price_family_monthly',
    yearlyPriceId: 'price_family_yearly',
    productId: 'prod_family',
    gameAccess: 'all',
    familyPlan: true,
    features: [
      'Up to 4 student accounts',
      'All Initiate features for each',
      'Family progress dashboard',
      'Sibling competitions',
      'Parent controls & insights',
      'Family achievement badges',
      'Bulk certificate downloads'
    ],
    icon: '👨‍👩‍👧‍👦',
    cta: 'Start Family Journey',
    bestFor: 'Parents and siblings learning AI together'
  }
];

// Price ID mapping for both billing periods
export const ENHANCED_PRICE_IDS = {
  // Monthly prices
  explorerMonthly: 'price_explorer_monthly',
  initiateMonthly: 'price_initiate_monthly',
  masterMonthly: 'price_master_monthly',
  familyMonthly: 'price_family_monthly',
  
  // Yearly prices
  explorerYearly: 'price_explorer_yearly',
  initiateYearly: 'price_initiate_yearly',
  masterYearly: 'price_master_yearly',
  familyYearly: 'price_family_yearly'
};

// Billing period type
export type BillingPeriod = 'monthly' | 'yearly';

// Helper functions
export function getEnhancedPlanById(planId: string): EnhancedPricingPlan | undefined {
  return ENHANCED_PRICING_PLANS.find(plan => plan.id === planId);
}

export function getEnhancedPlanByPriceId(priceId: string): EnhancedPricingPlan | undefined {
  return ENHANCED_PRICING_PLANS.find(plan => 
    plan.monthlyPriceId === priceId || plan.yearlyPriceId === priceId
  );
}

export function getEnhancedPlans(): EnhancedPricingPlan[] {
  return ENHANCED_PRICING_PLANS;
}

export function getPriceId(planId: string, billingPeriod: BillingPeriod): string {
  const plan = getEnhancedPlanById(planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  
  return billingPeriod === 'yearly' ? plan.yearlyPriceId : plan.monthlyPriceId;
}

export function getPrice(planId: string, billingPeriod: BillingPeriod): number {
  const plan = getEnhancedPlanById(planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  
  return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

export function calculateSavings(planId: string): number {
  const plan = getEnhancedPlanById(planId);
  if (!plan) return 0;
  
  const yearlyTotal = plan.monthlyPrice * 12;
  return yearlyTotal - plan.yearlyPrice;
}

export function getMonthlyEquivalent(planId: string): number {
  const plan = getEnhancedPlanById(planId);
  if (!plan) return 0;
  
  return Math.round((plan.yearlyPrice / 12) * 100) / 100;
}

export function getDiscountPercentage(planId: string): number {
  const plan = getEnhancedPlanById(planId);
  if (!plan) return 0;
  
  const yearlyTotal = plan.monthlyPrice * 12;
  return Math.round(((yearlyTotal - plan.yearlyPrice) / yearlyTotal) * 100);
}

// Plan feature access helpers
export function hasEnhancedGameAccess(planId: string, gameCount: number): boolean {
  const plan = getEnhancedPlanById(planId);
  if (!plan) return false;
  
  return plan.gameAccess === 'all' || (typeof plan.gameAccess === 'number' && gameCount <= plan.gameAccess);
}

export function canAccessEnhancedPremiumFeatures(planId: string): boolean {
  const plan = getEnhancedPlanById(planId);
  return plan?.id === 'master' || plan?.id === 'family';
}

export function isEnhancedFamilyPlan(planId: string): boolean {
  const plan = getEnhancedPlanById(planId);
  return plan?.familyPlan === true;
}

// A/B testing support for enhanced pricing
export interface EnhancedPricingTest {
  testId: string;
  variants: {
    [key: string]: {
      monthlyPrice: number;
      yearlyPrice: number;
      weight: number; // 0-100
    }
  }
}

export const ENHANCED_PRICING_TESTS: { [planId: string]: EnhancedPricingTest } = {
  initiate: {
    testId: 'initiate_enhanced_pricing_v1',
    variants: {
      'control': { monthlyPrice: 15, yearlyPrice: 120, weight: 34 },
      'variant_a': { monthlyPrice: 12, yearlyPrice: 96, weight: 33 },
      'variant_b': { monthlyPrice: 18, yearlyPrice: 144, weight: 33 }
    }
  }
};

export function getEnhancedTestPrice(planId: string, billingPeriod: BillingPeriod, userId?: string): number {
  const plan = getEnhancedPlanById(planId);
  if (!plan) return 0;

  const test = ENHANCED_PRICING_TESTS[planId];
  if (!test || !userId) {
    return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  }

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
      return billingPeriod === 'yearly' ? config.yearlyPrice : config.monthlyPrice;
    }
  }
  
  return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

// Stripe checkout session creation helper
export interface CheckoutSessionData {
  planId: string;
  billingPeriod: BillingPeriod;
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

export function createCheckoutSessionData(data: CheckoutSessionData) {
  const plan = getEnhancedPlanById(data.planId);
  if (!plan) throw new Error(`Plan ${data.planId} not found`);

  const priceId = getPriceId(data.planId, data.billingPeriod);
  const price = getPrice(data.planId, data.billingPeriod);

  return {
    priceId,
    price,
    planName: plan.name,
    billingPeriod: data.billingPeriod,
    userId: data.userId,
    userEmail: data.userEmail,
    successUrl: data.successUrl || `${window.location.origin}/dashboard?success=true`,
    cancelUrl: data.cancelUrl || `${window.location.origin}/pricing?canceled=true`,
    metadata: {
      planId: data.planId,
      billingPeriod: data.billingPeriod,
      userId: data.userId
    }
  };
}

// Legacy compatibility - export original functions
export { 
  PRICING_PLANS, 
  getPlanById, 
  getPlanByPriceId, 
  getDefaultPlan, 
  getPlans,
  getTestPrice
} from './stripe';
