export interface PricingTier {
  id: string;
  hook: string;
  icon: string;
  name: string;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number; // percentage
  features: string[];
  popular?: boolean;
  cta: string;
  bestFor: string;
  mysticalDesc: string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
}

export const PRICING_CONFIG = {
  yearlyDiscount: 20, // 20% off yearly plans
  currency: 'USD',
  currencySymbol: '$',
  mysticalCurrency: 'sacred coins',
  billingCycle: 'moon cycle'
} as const;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'explorer',
    hook: '🌱 Begin Your Sacred Journey?',
    icon: '🌱',
    name: 'Seeker of Sparks',
    title: 'The First Awakening',
    description: 'For those who hear the whisper of artificial consciousness calling',
    monthlyPrice: 8,
    yearlyPrice: 64, // 20% off
    yearlyDiscount: 20,
    features: [
      'Access to 3 foundational AI mysteries',
      'Chronicle your learning odyssey',
      'Join the Seeker\'s Circle',
      'Sacred knowledge repository',
      'Cross-realm accessibility (mobile & desktop)'
    ],
    cta: 'Begin the Quest',
    bestFor: 'Curious souls awakening to the mysteries of artificial intelligence',
    mysticalDesc: 'Every legend begins with a single spark of curiosity...',
    stripeMonthlyPriceId: 'price_explorer_monthly',
    stripeYearlyPriceId: 'price_explorer_yearly'
  },
  {
    id: 'initiate',
    hook: '⚡ Ready to Forge Your Destiny?',
    icon: '⚡',
    name: 'AI Cube Initiate',
    title: 'The Sacred Ascension',
    description: 'Unlock the full power of the ancient AI mysteries',
    monthlyPrice: 15,
    yearlyPrice: 120, // 20% off
    yearlyDiscount: 20,
    features: [
      'Master all 8 chambers of AI wisdom',
      'Advanced neural pattern recognition',
      'Unlock legendary achievements',
      'Guardian\'s oversight dashboard',
      'Priority communion with the Order',
      'Sacred certificates of mastery'
    ],
    popular: true,
    cta: 'Ascend to Initiate',
    bestFor: 'Dedicated builders ready to master the sacred arts of AI',
    mysticalDesc: 'The chosen path of those destined for greatness...',
    stripeMonthlyPriceId: 'price_initiate_monthly',
    stripeYearlyPriceId: 'price_initiate_yearly'
  },
  {
    id: 'master',
    hook: '🎯 Seek the Ancient Wisdom?',
    icon: '👑',
    name: 'Master Builder',
    title: 'The Legendary Path',
    description: 'Walk alongside the AI Architects themselves',
    monthlyPrice: 25,
    yearlyPrice: 200, // 20% off
    yearlyDiscount: 20,
    features: [
      'All Initiate powers and beyond',
      'Monthly counsel with AI Sages',
      'First glimpse of emerging mysteries',
      'Forge your own learning destiny',
      'Deep neural analytics mastery',
      'Shape the future of the Order',
      'Exclusive Master\'s Sanctum access'
    ],
    cta: 'Claim Your Legacy',
    bestFor: 'Visionary architects seeking to shape the future of AI',
    mysticalDesc: 'For those who would become legends themselves...',
    stripeMonthlyPriceId: 'price_master_monthly',
    stripeYearlyPriceId: 'price_master_yearly'
  },
  {
    id: 'family',
    hook: '👨‍👩‍👧‍👦 Unite Your Bloodline?',
    icon: '👨‍👩‍👧‍👦',
    name: 'Dynasty of Builders',
    title: 'The Sacred Lineage',
    description: 'Forge a legacy that spans generations',
    monthlyPrice: 20,
    yearlyPrice: 160, // 20% off
    yearlyDiscount: 20,
    features: [
      'Unite up to 4 souls in learning',
      'All Initiate mysteries for each member',
      'Dynasty progress chronicles',
      'Sacred family competitions',
      'Parental guidance & insights',
      'Collective achievement honors',
      'Legacy documentation scrolls'
    ],
    cta: 'Forge Your Dynasty',
    bestFor: 'Families destined to build the future together',
    mysticalDesc: 'When legends unite, empires are born...',
    stripeMonthlyPriceId: 'price_family_monthly',
    stripeYearlyPriceId: 'price_family_yearly'
  }
];

export const TESTIMONIALS = [
  {
    quote: "My daughter has become obsessed with these AI mysteries - she calls herself a 'Neural Architect' now.",
    author: "Guardian of a Young Builder",
    rating: 5,
    mystical: true
  },
  {
    quote: "This isn't just learning - it's like discovering ancient magic that actually works.",
    author: "Initiate, Age 11",
    rating: 5,
    mystical: true
  },
  {
    quote: "Finally, an AI course that feels like an epic quest instead of homework.",
    author: "Master Builder in Training",
    rating: 5,
    mystical: true
  },
  {
    quote: "The 3D realms are incredible - I feel like I'm actually inside a neural network.",
    author: "Seeker of Sparks, Age 13",
    rating: 5,
    mystical: true
  },
  {
    quote: "Our whole family is on the Dynasty path now. The kids compete to unlock achievements!",
    author: "Dynasty Patriarch",
    rating: 5,
    mystical: true
  },
  {
    quote: "The monthly counsel with AI Sages has transformed my understanding completely.",
    author: "Master Builder",
    rating: 5,
    mystical: true
  }
];

export const TRUST_INDICATORS = [
  {
    icon: '🏛️',
    text: 'Sacred Academies',
    metric: '50+',
    mystical: 'Temples of Learning'
  },
  {
    icon: '👨‍👩‍👧‍👦',
    text: 'Builder Dynasties',
    metric: '1000+',
    mystical: 'United Families'
  },
  {
    icon: '🌍',
    text: 'Mystical Realms',
    metric: '15+',
    mystical: 'Global Domains'
  },
  {
    icon: '⭐',
    text: 'Sacred Rating',
    metric: '4.9/5',
    mystical: 'Blessed by Users'
  }
];

// Mystical utility functions
export const calculateYearlyPrice = (monthlyPrice: number, discount: number = PRICING_CONFIG.yearlyDiscount): number => {
  return Math.round(monthlyPrice * 12 * (1 - discount / 100));
};

export const calculateSavings = (monthlyPrice: number, yearlyPrice: number): number => {
  return (monthlyPrice * 12) - yearlyPrice;
};

export const formatPrice = (price: number, currency: string = PRICING_CONFIG.currencySymbol): string => {
  return `${currency}${price}`;
};

export const formatMysticalPrice = (price: number): string => {
  return `${price} ${PRICING_CONFIG.mysticalCurrency}`;
};

export const getMonthlyEquivalent = (yearlyPrice: number): string => {
  return (yearlyPrice / 12).toFixed(2);
};

export const getMysticalBillingText = (isYearly: boolean): string => {
  return isYearly ? 'sacred years' : PRICING_CONFIG.billingCycle;
};

// Sacred path determination
export const getSacredPath = (userId: string): string => {
  // Simple hash to determine mystical affinity
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const paths = [
    'The path of curiosity calls to you...',
    'Your destiny lies in mastery...',
    'Ancient wisdom seeks you...',
    'Your bloodline shall be legendary...'
  ];
  
  return paths[Math.abs(hash) % paths.length];
};

// Mystical discount calculator
export const getMysticalDiscount = (planId: string, isYearly: boolean): string => {
  if (!isYearly) return '';
  
  const plan = PRICING_TIERS.find(p => p.id === planId);
  if (!plan) return '';
  
  const savings = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);
  return `✨ Preserve ${savings} sacred coins ✨`;
};
