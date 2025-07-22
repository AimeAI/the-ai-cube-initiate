import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Check, Star, Users, ArrowLeft, Shield, Clock } from 'lucide-react';
import { simplifiedPlans, getYearlySavings, getMonthlyEquivalent, getRiskReversalMessage, getSocialProof } from '../lib/simplifiedPricing';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getToken, loading } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  
  const cancelled = searchParams.get('cancelled') === 'true';

  const handleCheckout = async (planId: string) => {
    try {
      setIsLoading(planId);

      // Check if user is authenticated
      if (!user) {
        alert('Please log in to purchase a subscription.');
        navigate('/login');
        return;
      }

      // Get auth token
      const token = await getToken();
      if (!token) {
        alert('Authentication required. Please log in and try again.');
        navigate('/login');
        return;
      }

      // Call the API endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: planId,
          billingPeriod: isYearly ? 'yearly' : 'monthly'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error: any) {
      console.error('Error during checkout:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-myth-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electricCyan mx-auto mb-4"></div>
          <p className="text-myth-textPrimary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-myth-background text-myth-textPrimary">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-electricCyan hover:text-neonMint transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            Choose Your Family Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Unlock the complete AI education experience for your entire family
          </p>
          
          {/* Social Proof */}
          <p className="text-myth-textSecondary mb-6">{getSocialProof()}</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isYearly ? 'text-electricCyan' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-gradient-to-r from-electricCyan to-neonMint' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isYearly ? 'text-electricCyan' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack px-3 py-1 rounded-full text-sm font-bold ml-2">
                Save 33%
              </span>
            )}
          </div>
          
          {cancelled && (
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg max-w-md mx-auto">
              <p className="text-yellow-300">
                Payment was cancelled. You can try again anytime!
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {simplifiedPlans.map((plan) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyEquivalent = isYearly ? getMonthlyEquivalent(plan) : plan.monthlyPrice;
            const savings = isYearly ? getYearlySavings(plan) : 0;
            const isPopular = plan.popular;
            
            return (
              <MythCard 
                key={plan.id}
                className={`relative transition-all duration-300 hover:scale-105 ${
                  isPopular ? 'border-electricCyan shadow-lg shadow-electricCyan/20 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8 text-center">
                  {/* Hook */}
                  <div className="text-sm text-electricCyan font-medium mb-3">
                    {plan.hook}
                  </div>
                  
                  {/* Icon & Name */}
                  <div className="flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-electricCyan mr-2" />
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
                      {plan.name}
                    </h3>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    {isYearly ? (
                      <>
                        <span className="text-4xl font-bold text-white">${monthlyEquivalent}</span>
                        <span className="text-gray-400 ml-1">/mo</span>
                        <div className="text-sm text-gray-400">
                          billed yearly (${plan.yearlyPrice})
                        </div>
                        {savings > 0 && (
                          <div className="text-sm text-neonMint font-medium mt-1">
                            Save ${savings}/year
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-white">${currentPrice}</span>
                        <span className="text-gray-400 ml-1">/month</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                  
                  {/* Value Proposition */}
                  <div className="bg-myth-surface/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-myth-textSecondary">
                      Just <span className="text-electricCyan font-bold">
                        ${(monthlyEquivalent / plan.maxChildren).toFixed(2)}/child/month
                      </span> for complete AI education
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-neonMint mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <MythButton
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isLoading === plan.id}
                    className={`w-full ${
                      isPopular 
                        ? 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30' 
                        : ''
                    }`}
                  >
                    {isLoading === plan.id ? 'Processing...' : plan.cta}
                  </MythButton>
                  
                  <p className="text-xs text-gray-400 mt-3">
                    {plan.bestFor}
                  </p>
                </div>
              </MythCard>
            );
          })}
        </div>

        {/* Trust & Risk Reversal */}
        <div className="max-w-4xl mx-auto mb-12">
          <MythCard>
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-neonMint mr-3" />
                <h3 className="text-xl font-bold text-neonMint">Risk-Free Trial</h3>
              </div>
              
              <p className="text-myth-textSecondary mb-6">
                {getRiskReversalMessage()}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-electricCyan" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-neonMint" />
                  <span>60-day money-back guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </MythCard>
        </div>

        {/* What's Included */}
        <div className="max-w-4xl mx-auto mb-12">
          <MythCard>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
                What's Included in Every Plan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-electricCyan" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">14 Interactive Games</h3>
                  <p className="text-gray-400 text-sm">
                    From neural networks to quantum computing - comprehensive AI curriculum
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-neonMint" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Family Dashboard</h3>
                  <p className="text-gray-400 text-sm">
                    Track progress, celebrate achievements, and guide your children's learning
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Safe Environment</h3>
                  <p className="text-gray-400 text-sm">
                    Kid-safe platform with parental controls and progress monitoring
                  </p>
                </div>
              </div>
            </div>
          </MythCard>
        </div>

        {/* Security & Guarantee */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            🔒 Secure payment powered by Stripe • 🛡️ 60-day money-back guarantee
          </p>
          <p className="text-gray-500 text-xs">
            Cancel anytime • No hidden fees • Instant access after trial
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
