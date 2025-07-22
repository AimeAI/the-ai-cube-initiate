import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getPlans, getTestPrice, PricingPlan } from '../lib/stripe';
import { Check, Star, Users, Zap } from 'lucide-react';

interface PricingTierProps {
  plan: PricingPlan;
  isPopular?: boolean;
  delay: number;
  onCheckout: (planId: string) => Promise<void>;
  isLoading?: boolean;
  testPrice?: number;
}

const PricingTier: React.FC<PricingTierProps> = ({
  plan,
  isPopular = false,
  delay,
  onCheckout,
  isLoading = false,
  testPrice
}) => {
  const displayPrice = testPrice || plan.price;
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'explorer': return <Zap className="w-6 h-6" />;
      case 'master': return <Star className="w-6 h-6" />;
      case 'family': return <Users className="w-6 h-6" />;
      default: return <Check className="w-6 h-6" />;
    }
  };

  return (
    <div 
      className={`bg-void-black/50 backdrop-blur-md rounded-xl shadow-xl overflow-hidden animate-fade-in border hover:border-purple-400/70 transition-all duration-300 ${
        isPopular ? 'border-purple-500 relative transform scale-105 md:scale-110 shadow-purple-500/30' : 'border-purple-500/30'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {isPopular && (
        <div className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack text-xs font-bold uppercase py-1.5 px-3 absolute top-0 right-0 rounded-bl-lg shadow-md shadow-neonMint/50">
          Most Popular
        </div>
      )}
      
      <div className="p-6 md:p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-electricCyan mr-2">
            {getPlanIcon(plan.id)}
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            {plan.name}
          </h3>
        </div>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">${displayPrice}</span>
          <span className="text-gray-400 ml-1">/month</span>
          {testPrice && testPrice !== plan.price && (
            <div className="text-sm text-gray-500 line-through">
              ${plan.price}/month
            </div>
          )}
        </div>
        
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          {plan.description}
        </p>
        
        <div className="space-y-3 mb-8 text-left">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-4 h-4 text-neonMint mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => onCheckout(plan.id)}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            isPopular
              ? 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {isLoading ? 'Processing...' : 'Get Started'}
        </button>
        
        {plan.familyPlan && (
          <p className="text-xs text-gray-400 mt-2">
            Perfect for families with multiple learners
          </p>
        )}
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const plans = getPlans();

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

      // Call the new API endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: planId,
          billingPeriod: 'monthly'
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

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-void-black to-obsidianBlack relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electricCyan/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neonMint/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x">
            Choose Your Learning Journey
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock the power of AI education with our interactive 3D learning platform. 
            Start your journey today with the perfect plan for your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingTier
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
              delay={index * 0.1}
              onCheckout={handleCheckout}
              isLoading={isLoading === plan.id}
              testPrice={user ? getTestPrice(plan.id, user.id) : undefined}
            />
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-void-black/30 backdrop-blur-md rounded-xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
              Why Choose AI Cube?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-electricCyan/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Zap className="w-4 h-4 text-electricCyan" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Interactive 3D Learning</h4>
                  <p className="text-gray-400 text-sm">Experience AI concepts through immersive 3D games and simulations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-neonMint/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Star className="w-4 h-4 text-neonMint" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Expert-Designed Curriculum</h4>
                  <p className="text-gray-400 text-sm">Learn from industry experts with structured, progressive content</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Family-Friendly</h4>
                  <p className="text-gray-400 text-sm">Perfect for students of all ages with parental oversight tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            🛡️ 30-day money-back guarantee • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
