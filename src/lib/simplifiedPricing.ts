// Simplified pricing structure to reduce decision paralysis
export interface SimplifiedPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  familyPlan?: boolean;
  maxChildren: number;
  hook: string;
  cta: string;
  bestFor: string;
}

export const simplifiedPlans: SimplifiedPlan[] = [
  {
    id: 'family',
    name: 'Family Plan',
    description: 'Perfect for families learning AI together',
    monthlyPrice: 15,
    yearlyPrice: 120, // 33% discount
    maxChildren: 4,
    popular: true,
    familyPlan: true,
    hook: '👨‍👩‍👧‍👦 Learning as a family?',
    cta: 'Start Family Journey',
    bestFor: 'Families with 1-4 children who want comprehensive AI education',
    features: [
      'All 14 interactive AI games',
      'Up to 4 child profiles',
      'Parent progress dashboard',
      'Real-time learning insights',
      'Achievement system & certificates',
      'Family challenges & competitions',
      'Email support',
      '14-day free trial'
    ]
  },
  {
    id: 'premium-family',
    name: 'Premium Family',
    description: 'Family plan with expert mentorship',
    monthlyPrice: 25,
    yearlyPrice: 200, // 33% discount
    maxChildren: 4,
    familyPlan: true,
    hook: '🎯 Want expert guidance?',
    cta: 'Unlock Premium',
    bestFor: 'Ambitious families who want personalized AI mentorship',
    features: [
      'Everything in Family Plan',
      'Monthly 1-on-1 AI mentorship calls',
      'Custom learning paths for each child',
      'Advanced progress analytics',
      'Early access to new games',
      'Priority support (24hr response)',
      'Exclusive premium community',
      'Downloadable progress reports'
    ]
  }
];

// Helper functions
export const getYearlySavings = (plan: SimplifiedPlan): number => {
  return (plan.monthlyPrice * 12) - plan.yearlyPrice;
};

export const getMonthlyEquivalent = (plan: SimplifiedPlan): number => {
  return Math.round((plan.yearlyPrice / 12) * 100) / 100;
};

export const getSavingsPercentage = (plan: SimplifiedPlan): number => {
  const yearlyTotal = plan.monthlyPrice * 12;
  const savings = yearlyTotal - plan.yearlyPrice;
  return Math.round((savings / yearlyTotal) * 100);
};

// Value proposition helpers
export const getValueProposition = (planId: string): string => {
  switch (planId) {
    case 'family':
      return 'Complete AI education for your entire family at just $3.75 per child per month';
    case 'premium-family':
      return 'Premium AI education with expert mentorship - like having a personal AI tutor';
    default:
      return 'Comprehensive AI learning experience';
  }
};

export const getRiskReversalMessage = (): string => {
  return '✓ 14-day free trial ✓ 60-day money-back guarantee ✓ Cancel anytime ✓ No setup fees';
};

export const getSocialProof = (): string => {
  return 'Join 2,847+ families already mastering AI with our interactive games';
};
