import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  delay: number;
  productId?: string; // Added productId
  billingPeriod: 'monthly' | 'yearly'; // Added billingPeriod
  onCheckout: (productId: string, billingPeriod: 'monthly' | 'yearly') => Promise<void>; // Added checkout handler
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  buttonText,
  delay,
  productId,
  billingPeriod,
  onCheckout
}) => {
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
        <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400">/{period}</span>
        </div>
        <p className="text-gray-300 mb-6 text-sm">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={async () => {
            if (productId) {
              await onCheckout(productId, billingPeriod);
            } else {
              console.warn('No productId provided for this tier.');
            }
          }}
          className={`w-full py-3.5 px-4 rounded-lg font-semibold transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-void-black ${
            isPopular
              ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-lg hover:from-neonMint/80 hover:to-electricCyan/80 hover:shadow-xl hover:shadow-electricCyan/50 transform hover:scale-105'
              : 'bg-deepViolet/50 border border-electricCyan/50 text-electricCyan hover:bg-deepViolet/70 hover:text-neonMint hover:border-neonMint'
          }`}
          aria-label={`Subscribe to ${name} plan for ${price} per ${period}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  // Handle checkout with authentication
  const handleCheckout = async (productId: string, billingPeriod: 'monthly' | 'yearly') => {
    try {
      // Check if user is authenticated
      if (!user) {
        alert('Please log in to purchase a subscription.');
        navigate('/login');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe.js has not loaded.');
        alert('Payment system is not available. Please try again later.');
        return;
      }

      // Get auth token from Supabase
      const token = await getToken();
      
      if (!token) {
        alert('Authentication required. Please log in and try again.');
        navigate('/login');
        return;
      }
      
      console.log('Attempting to checkout with productId:', productId);
      
      // Call the backend API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add auth header
        },
        body: JSON.stringify({ 
          productId, 
          billingPeriod,
          quantity: 1 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating checkout session:', errorData.error);
        alert(`Error: ${errorData.error || 'Could not create checkout session.'}`);
        return;
      }

      const session = await response.json();
      
      if (session.sessionId) {
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId
        });

        if (error) {
          console.error('Stripe checkout error:', error);
          alert(`Checkout failed: ${error.message}`);
        }
      } else {
        console.error('Stripe session ID not found.');
        alert('Failed to initiate checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      alert(`Failed to initiate checkout: ${errorMessage}`);
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-void-black text-text-primary" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            AI Cube is the world’s first mythic simulator for todays AI-native learners.
          </h2>
          <p className="text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select the key that unlocks your potential. Each tier grants access to deeper levels of The AI Cube's myth-building power.
          </p>
          
          {/* Billing Period Toggle */}
          <div 
            className="inline-flex items-center bg-purple-900/30 p-1 rounded-lg animate-fade-in border border-purple-700/50" 
            style={{ animationDelay: '0.3s' }}
            role="tablist" 
            aria-label="Billing period selection"
          >
            <button
              className={`py-2 px-3 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electricCyan ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-md shadow-neonMint/50'
                  : 'text-neonMint hover:text-electricCyan'
              }`}
              onClick={() => setBillingPeriod('monthly')}
              role="tab"
              aria-selected={billingPeriod === 'monthly'}
              aria-controls="pricing-content"
            >
              Monthly
            </button>
            <button
              className={`py-2 px-3 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electricCyan ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-md shadow-neonMint/50'
                  : 'text-neonMint hover:text-electricCyan'
              }`}
              onClick={() => setBillingPeriod('yearly')}
              role="tab"
              aria-selected={billingPeriod === 'yearly'}
              aria-controls="pricing-content"
            >
              Yearly <span className="text-xs text-sky-400 font-bold ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
        
        {/* Limited Time Offer Banner */}
        <div className="max-w-5xl mx-auto mb-10 bg-gradient-to-r from-deepViolet via-blue-600/80 to-sky-400 rounded-xl p-4 text-white text-center animate-fade-in shadow-lg shadow-blue-600/50 border border-blue-600/30" style={{ animationDelay: '0.4s' }}>
          <div className="font-bold text-lg [text-shadow:0_0_8px_theme(colors.sky.400)]">Beta Pricing — 50% Off the regular $20/month plan.</div>
        </div>
        
        {/* Pricing Tiers */}
        <div 
          id="pricing-content" 
          className="max-w-5xl mx-auto flex justify-center gap-6 md:gap-8"
          role="tabpanel"
          aria-label={`${billingPeriod} pricing options`}
        >
          <PricingTier
            name="Seeker's Spark"
            price={billingPeriod === 'monthly' ? '$10' : '$8'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Ignite your curiosity. A perfect first step to explore the AI Cube's foundational wonders."
            features={[
              'Access to Introductory AI Modules',
              'Basic Myth-Weaving Tools',
              'Sample AI-Powered Mini-Games'
            ]}
            buttonText="Begin with Spark"
            delay={0.5}
            productId="prod_SR1HZbeBKyNXsk" // Added productId for Seeker's Spark
            billingPeriod={billingPeriod} // Pass billingPeriod
            onCheckout={handleCheckout} // Pass the authentication-aware checkout handler
          />
          
          {/* <PricingTier
            name="Creator's Compass"
            price={billingPeriod === 'monthly' ? '$22.50' : '$18'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Navigate the full expanse of AI creation. Unleash your potential to build and share intricate mythologies."
            features={[
              "Everything in Seeker's Spark",
              'Complete Access to All AI Learning Modules',
              'Advanced Myth-Crafting Suite & Custom AI Model Training',
              'Save, Share & Showcase Your AI Myths',
              'Priority Access to New Content & Features'
            ]}
            isPopular={true}
            buttonText="Chart with Compass"
            delay={0.6}
          /> */}
          
          {/* <PricingTier
            name="World Weaver's Loom"
            price={billingPeriod === 'monthly' ? '$99' : '$79'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Shape entire realities. Lead collaborative epics and master the deepest arts of AI simulation."
            features={[
              "Everything in Creator's Compass",
              'Multi-User Collaboration Tools (Up to 5 Weavers)',
              'Personalized AI Mentorship & Advanced Analytics',
              'Early Access to Beta Features & Developer Insights',
              'Dedicated Support Channel'
            ]}
            buttonText="Weave with Loom"
            delay={0.7}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;