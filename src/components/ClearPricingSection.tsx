import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Users, Gamepad2, Brain, Lock, Calendar } from 'lucide-react';
import { MythButton } from './myth/MythButton';
import { MythCard } from './myth/MythCard';

// Clear, honest pricing data
const pricingPlans = [
  {
    id: 'free',
    name: 'Free Trial',
    title: 'Try AI Cube',
    description: 'Explore AI learning with 3 free games',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '3 free AI learning games',
      'Snake³ - Programming fundamentals', 
      'Crystal Resonance - Pattern recognition',
      'Neural Network Chamber - Build AI brains',
      'No time limits on free games',
      'Works on desktop and mobile'
    ],
    icon: <Gamepad2 className="w-6 h-6" />,
    cta: 'Play Free Games',
    ctaLink: '#try-free',
    bestFor: 'Anyone wanting to try AI learning games',
    freeGames: 3,
    totalGames: 3
  },
  {
    id: 'monthly',
    name: 'Monthly Access',
    title: 'Full AI Cube Access',
    description: 'Access all AI learning games and features',
    monthlyPrice: 12,
    yearlyPrice: null,
    popular: true,
    features: [
      'All 15+ AI learning experiences',
      'Advanced games: Quantum Computing, Computer Vision',
      'Progress tracking and achievements',
      'Parent dashboard and insights',
      'Age-adaptive learning (6-16 years)',
      'Educational certificates',
      'Priority support'
    ],
    icon: <Brain className="w-6 h-6" />,
    cta: 'Start Monthly Plan',
    ctaLink: '/payment',
    bestFor: 'Families wanting flexible monthly access',
    freeGames: 3,
    totalGames: 15,
    savings: null
  },
  {
    id: 'yearly',
    name: 'Yearly Access',
    title: 'Best Value Plan',
    description: 'Full access with 2 months free',
    monthlyPrice: 10,
    yearlyPrice: 120,
    features: [
      'All 15+ AI learning experiences',
      'Advanced games: Quantum Computing, Computer Vision',
      'Progress tracking and achievements', 
      'Parent dashboard and insights',
      'Age-adaptive learning (6-16 years)',
      'Educational certificates',
      'Priority support',
      '2 months free (17% savings)'
    ],
    icon: <Calendar className="w-6 h-6" />,
    cta: 'Start Yearly Plan',
    ctaLink: '/payment',
    bestFor: 'Families committed to long-term AI learning',
    freeGames: 3,
    totalGames: 15,
    savings: '17% off'
  },
  {
    id: 'family',
    name: 'Family Plan',
    title: 'Multiple Children',
    description: 'Access for up to 4 children',
    monthlyPrice: 18,
    yearlyPrice: 180,
    features: [
      'All 15+ AI learning experiences',
      'Up to 4 children accounts',
      'Individual progress tracking per child',
      'Family progress dashboard',
      'Age-adaptive learning (6-16 years)',
      'Educational certificates for each child',
      'Family challenges and competitions',
      'Priority support'
    ],
    icon: <Users className="w-6 h-6" />,
    familyPlan: true,
    cta: 'Start Family Plan',
    ctaLink: '/payment',
    bestFor: 'Families with multiple children (ages 6-16)',
    freeGames: 3,
    totalGames: 15,
    savings: 'Save vs individual plans'
  }
];

// Actual games available
const gamesList = {
  free: [
    { name: 'Snake³', description: 'Learn programming through 3D snake navigation' },
    { name: 'Crystal Resonance', description: 'Master pattern recognition with music' },
    { name: 'Neural Network Chamber', description: 'Build and train AI neural networks' }
  ],
  premium: [
    { name: 'Classifier Construct', description: 'Build AI classification systems' },
    { name: 'Decision Tree Game', description: 'Learn AI decision-making logic' },
    { name: 'Vision System Challenge', description: 'Teach AI to see and recognize objects' },
    { name: 'Neural Forge', description: 'Advanced neural network engineering' },
    { name: 'Neural Pathways', description: 'Explore complex neural architectures' },
    { name: 'Predictor Engine', description: 'Build AI prediction systems' },
    { name: 'Quantum Chamber', description: 'Explore quantum computing concepts' },
    { name: 'Reinforcement Lab', description: 'Watch AI learn through trial and error' },
    { name: 'Trajectory Game', description: 'AI pathfinding and navigation' },
    { name: 'Ethics Framework', description: 'Learn AI ethics and responsible development' },
    { name: 'Generative Core', description: 'Create AI that generates content' },
    { name: 'Founders Chamber', description: 'Advanced AI leadership concepts' }
  ]
};

const ClearPricingSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleGetStarted = (plan: typeof pricingPlans[0]) => {
    if (plan.id === 'free') {
      // Scroll to try free section
      const tryFreeSection = document.getElementById('try-free');
      if (tryFreeSection) {
        tryFreeSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (user) {
      navigate('/payment', { state: { selectedPlan: plan.id, billingCycle } });
    } else {
      navigate('/login', { state: { redirect: '/payment', selectedPlan: plan.id, billingCycle } });
    }
  };

  const getDisplayedPlans = () => {
    if (billingCycle === 'monthly') {
      return pricingPlans.filter(plan => plan.id !== 'yearly');
    }
    return pricingPlans.filter(plan => plan.id !== 'monthly');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-myth-background to-myth-surface/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-myth-accent mb-4">
            Simple, Clear Pricing
          </h2>
          <p className="text-xl text-myth-textSecondary max-w-3xl mx-auto mb-8">
            Choose the plan that works for your family. Start with 3 free games, upgrade for access to all 15+ AI learning experiences.
          </p>
          
          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-myth-accent font-semibold' : 'text-myth-textSecondary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                billingCycle === 'yearly' ? 'bg-myth-accent' : 'bg-myth-surface'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-myth-accent font-semibold' : 'text-myth-textSecondary'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {getDisplayedPlans().map((plan) => (
            <MythCard 
              key={plan.id} 
              className={`relative p-8 text-center transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-2 border-myth-accent bg-myth-accent/5' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-myth-accent text-myth-background px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="w-16 h-16 bg-myth-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-myth-textPrimary mb-2">{plan.name}</h3>
                <p className="text-myth-textSecondary text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-myth-accent">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-myth-textSecondary">/month</span>
                </div>
                {plan.yearlyPrice && billingCycle === 'yearly' && (
                  <p className="text-sm text-myth-textSecondary mt-1">
                    ${plan.yearlyPrice}/year
                  </p>
                )}
                {plan.savings && (
                  <p className="text-green-400 text-sm font-semibold mt-1">
                    {plan.savings}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <div className="text-center mb-4">
                  <span className="text-myth-accent font-semibold">
                    {plan.totalGames} Total Games
                  </span>
                  {plan.freeGames > 0 && (
                    <span className="text-green-400 text-sm block">
                      ({plan.freeGames} always free)
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-myth-accent flex-shrink-0 mt-0.5" />
                      <span className="text-myth-textSecondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <MythButton
                onClick={() => handleGetStarted(plan)}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-myth-accent text-myth-background hover:bg-myth-secondary' 
                    : 'border border-myth-accent text-myth-accent hover:bg-myth-accent/10'
                }`}
                label={plan.cta}
              />

              <p className="text-xs text-myth-textSecondary mt-4 italic">
                {plan.bestFor}
              </p>
            </MythCard>
          ))}
        </div>

        {/* What's Included */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-myth-accent mb-6">
              Free Games (No Signup Required)
            </h3>
            <div className="space-y-4">
              {gamesList.free.map((game, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-myth-surface/30">
                  <Gamepad2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-myth-textPrimary">{game.name}</h4>
                    <p className="text-sm text-myth-textSecondary">{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-myth-accent mb-6">
              Premium AI Learning Experiences (Subscription Required)
            </h3>
            <div className="space-y-4">
              {gamesList.premium.map((game, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-myth-surface/30">
                  <Lock className="w-5 h-5 text-myth-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-myth-textPrimary">{game.name}</h4>
                    <p className="text-sm text-myth-textSecondary">{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-myth-accent mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-myth-textPrimary mb-2">Can I try before I buy?</h4>
              <p className="text-myth-textSecondary text-sm">
                Yes! 3 games are completely free with no signup required. Try them first to see if your child enjoys the learning experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-myth-textPrimary mb-2">What ages are these games for?</h4>
              <p className="text-myth-textSecondary text-sm">
                Ages 6-16. Games automatically adapt their language and complexity based on your child's age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-myth-textPrimary mb-2">Can I cancel anytime?</h4>
              <p className="text-myth-textSecondary text-sm">
                Yes, you can cancel your subscription at any time. The 3 free games will always remain available.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-myth-textPrimary mb-2">Do you offer refunds?</h4>
              <p className="text-myth-textSecondary text-sm">
                We offer a 14-day money-back guarantee if you're not satisfied with your subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClearPricingSection;