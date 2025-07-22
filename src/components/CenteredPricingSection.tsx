import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Users, Gamepad2, Brain, Lock, Calendar, Zap, Crown, Gift } from 'lucide-react';
import { MythButton } from './myth/MythButton';
import { MythCard } from './myth/MythCard';

// Accurate pricing data reflecting actual platform features (15 total games)
const pricingPlans = [
  {
    id: 'free',
    name: 'Free Explorer',
    title: 'Try AI Cube',
    description: 'Get started with 3 AI learning games',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: 'Most Popular',
    badgeColor: 'bg-green-500',
    features: [
      '3 AI learning games available',
      'Snake³ - 3D programming navigation',
      'Crystal Resonance - Pattern recognition',
      'Neural Network Chamber - Basic neural networks',
      'No time limits on free games',
      'Works on desktop and mobile browsers',
      'Basic game completion tracking'
    ],
    icon: <Gift className="w-8 h-8" />,
    cta: 'Start Free Now',
    ctaLink: '#try-free',
    bestFor: 'Anyone wanting to try AI learning games',
    freeGames: 3,
    totalGames: 3,
    highlight: true,
    gradient: 'from-green-400 to-emerald-600'
  },
  {
    id: 'single',
    name: 'Single Learner',
    title: 'Individual Access',
    description: 'Full access for one learner',
    monthlyPrice: 12.99,
    yearlyPrice: null,
    features: [
      'All 15 AI learning games',
      'Student dashboard with progress tracking',
      'Cognitive skills badges and levels',
      'Game completion certificates',
      'Age-appropriate content adaptation',
      'Email support',
      'Single user account',
      'Access to new games as they\'re added'
    ],
    icon: <Brain className="w-8 h-8" />,
    cta: 'Start Single Plan',
    ctaLink: '/payment',
    bestFor: 'Individual learners or single child families',
    freeGames: 3,
    totalGames: 15,
    savings: null,
    gradient: 'from-blue-400 to-cyan-600'
  },
  {
    id: 'family',
    name: 'Family Plan',
    title: 'Best Value for Families',
    description: 'Perfect for multiple children',
    monthlyPrice: 22.99,
    yearlyPrice: null,
    badge: 'Best Value',
    badgeColor: 'bg-orange-500',
    features: [
      'All 15 AI learning games',
      'Up to 4 child accounts',
      'Parent dashboard with overview',
      'Individual progress tracking per child',
      'Cognitive skills tracking for each child',
      'Game completion certificates',
      'Family progress summaries',
      'Priority email support',
      'Access to new games as they\'re added'
    ],
    icon: <Users className="w-8 h-8" />,
    cta: 'Start Family Plan',
    ctaLink: '/payment',
    bestFor: 'Families with 2-4 children',
    freeGames: 3,
    totalGames: 15,
    savings: 'Save vs individual accounts',
    gradient: 'from-orange-400 to-red-500'
  }
];

const CenteredPricingSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = (plan: typeof pricingPlans[0]) => {
    if (plan.id === 'free') {
      const tryFreeSection = document.getElementById('try-free');
      if (tryFreeSection) {
        tryFreeSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (user) {
      navigate('/payment', { state: { selectedPlan: plan.id } });
    } else {
      navigate('/login', { state: { redirect: '/payment', selectedPlan: plan.id } });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-myth-background to-myth-surface/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-full px-6 py-2 mb-6">
            <Zap className="w-5 h-5 text-electricCyan animate-pulse" />
            <span className="text-electricCyan font-semibold">Choose Your AI Learning Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-myth-accent mb-4">
            Simple, Clear Pricing
          </h2>
          <p className="text-xl text-myth-textSecondary max-w-3xl mx-auto mb-12">
            Start with 3 free games forever, upgrade for access to all 15+ AI learning experiences. 
            <span className="text-electricCyan font-semibold"> No hidden fees, cancel anytime.</span>
          </p>
        </div>

        {/* Centered Pricing Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            {pricingPlans.map((plan, index) => (
              <div key={plan.id} className="relative">
                <MythCard 
                  className={`relative p-8 text-center transition-all duration-300 hover:scale-105 h-full flex flex-col ${
                    plan.highlight ? 'border-2 border-green-400 bg-green-400/5 shadow-2xl shadow-green-400/20' : 
                    plan.badge ? 'border-2 border-orange-400 bg-orange-400/5 shadow-2xl shadow-orange-400/20' : 
                    'hover:border-electricCyan/50'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`${plan.badgeColor} text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg`}>
                        <Star className="w-4 h-4 fill-current" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon and Title */}
                  <div className="mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <div className="text-white">
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-myth-textPrimary mb-2">{plan.name}</h3>
                    <p className="text-myth-textSecondary text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-myth-accent">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-myth-textSecondary text-lg">
                        {plan.monthlyPrice === 0 ? '' : '/month'}
                      </span>
                    </div>
                    {plan.savings && (
                      <p className="text-green-400 text-sm font-semibold mt-2 bg-green-400/10 px-3 py-1 rounded-full inline-block">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  {/* Games Count */}
                  <div className="text-center mb-6 p-4 bg-myth-surface/30 rounded-lg">
                    <div className="text-3xl font-bold text-myth-accent mb-1">
                      {plan.totalGames}
                    </div>
                    <div className="text-sm text-myth-textSecondary">
                      AI Learning Games
                    </div>
                    {plan.freeGames > 0 && plan.totalGames !== plan.freeGames && (
                      <div className="text-xs text-green-400 mt-1">
                        ({plan.freeGames} always free)
                      </div>
                    )}
                  </div>
                
                  {/* Features */}
                  <div className="mb-8 flex-grow">
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-myth-textSecondary text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <MythButton
                      onClick={() => handleGetStarted(plan)}
                      className={`w-full text-lg py-4 font-bold transition-all duration-300 ${
                        plan.highlight 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-400/30' 
                          : plan.badge
                          ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-xl hover:shadow-orange-400/30'
                          : 'border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10'
                      }`}
                      label={plan.cta}
                    />
                    
                    <p className="text-xs text-myth-textSecondary mt-3 italic">
                      {plan.bestFor}
                    </p>
                  </div>
                </MythCard>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16 mb-12">
          <div className="bg-gradient-to-r from-orange-400/10 to-red-500/10 border border-orange-400/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-myth-accent mb-4">
              💡 Family Plan = Best Value
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-myth-textPrimary mb-2">Individual accounts cost:</h4>
                <ul className="space-y-2 text-myth-textSecondary">
                  <li>• 2 Single Plans: <span className="line-through">$25.98/month</span></li>
                  <li>• 3 Single Plans: <span className="line-through">$38.97/month</span></li>
                  <li>• 4 Single Plans: <span className="line-through">$51.96/month</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-myth-textPrimary mb-2">Family Plan benefits:</h4>
                <ul className="space-y-2 text-myth-textSecondary">
                  <li>• Up to 4 children: <span className="text-green-400 font-bold">$22.99/month</span></li>
                  <li>• Save up to <span className="text-green-400 font-bold">$28.97/month</span></li>
                  <li>• Individual progress tracking per child</li>
                  <li>• Parent dashboard overview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-myth-textSecondary">
              <Check className="w-5 h-5 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-myth-textSecondary">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-myth-textSecondary">
              <Check className="w-5 h-5 text-green-400" />
              <span>60-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-myth-textSecondary">
              <Check className="w-5 h-5 text-green-400" />
              <span>Secure payment</span>
            </div>
          </div>
          
          <p className="text-myth-textSecondary text-lg">
            Join <span className="text-electricCyan font-semibold">2,847+ families</span> already giving their children the AI advantage
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-myth-accent mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-myth-surface/20 p-6 rounded-lg">
              <h4 className="font-semibold text-myth-textPrimary mb-2">Can I try before I buy?</h4>
              <p className="text-myth-textSecondary text-sm">
                Yes! 3 games are completely free with no signup required. Try them first to see if your child enjoys the learning experience.
              </p>
            </div>
            <div className="bg-myth-surface/20 p-6 rounded-lg">
              <h4 className="font-semibold text-myth-textPrimary mb-2">What ages are these games for?</h4>
              <p className="text-myth-textSecondary text-sm">
                Ages 6-16. Games automatically adapt their language and complexity based on your child's age and skill level.
              </p>
            </div>
            <div className="bg-myth-surface/20 p-6 rounded-lg">
              <h4 className="font-semibold text-myth-textPrimary mb-2">How many games are included?</h4>
              <p className="text-myth-textSecondary text-sm">
                Free tier includes 3 games. Paid plans include all currently available games plus any new games we add in the future.
              </p>
            </div>
            <div className="bg-myth-surface/20 p-6 rounded-lg">
              <h4 className="font-semibold text-myth-textPrimary mb-2">What features do I get?</h4>
              <p className="text-myth-textSecondary text-sm">
                Paid plans include student dashboards, progress tracking, cognitive skills badges, and parent oversight features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CenteredPricingSection;
