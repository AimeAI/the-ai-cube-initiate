import React, { useState } from 'react';

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  delay: number;
}

const PricingTier: React.FC<PricingTierProps> = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  isPopular = false,
  buttonText,
  delay 
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
      <div className="p-6 md:p-8">
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
          className={`w-full py-3.5 px-4 rounded-lg font-semibold transition-all duration-300 text-sm ${
            isPopular
              ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-lg hover:from-neonMint/80 hover:to-electricCyan/80 hover:shadow-xl hover:shadow-electricCyan/50 transform hover:scale-105'
              : 'bg-deepViolet/50 border border-electricCyan/50 text-electricCyan hover:bg-deepViolet/70 hover:text-neonMint hover:border-neonMint'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <section className="py-16 md:py-24 bg-void-black text-text-primary" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            Unlock the AI Cube: Choose Your Path
          </h2>
          <p className="text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select the key that unlocks your potential. Each tier grants access to deeper levels of The AI Cube's myth-building power.
          </p>
          
          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-purple-900/30 p-1 rounded-lg animate-fade-in border border-purple-700/50" style={{ animationDelay: '0.3s' }}>
            <button
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-md shadow-neonMint/50'
                  : 'text-neonMint hover:text-electricCyan'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack shadow-md shadow-neonMint/50'
                  : 'text-neonMint hover:text-electricCyan'
              }`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly <span className="text-xs text-sky-400 font-bold ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
        
        {/* Limited Time Offer Banner */}
        <div className="max-w-5xl mx-auto mb-10 bg-gradient-to-r from-deepViolet via-blue-600/80 to-sky-400 rounded-xl p-4 text-white text-center animate-fade-in shadow-lg shadow-blue-600/50 border border-blue-600/30" style={{ animationDelay: '0.4s' }}>
          <div className="font-bold text-lg [text-shadow:0_0_8px_theme(colors.sky.400)]">✨ Special Initiation: First Month $0.99! ✨</div>
          <p className="text-sm opacity-90">Begin your journey into The AI Cube risk-free with our 30-day satisfaction guarantee.</p>
        </div>
        
        {/* Pricing Tiers */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <PricingTier
            name="Apprentice Key"
            price={billingPeriod === 'monthly' ? '$19' : '$15'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Begin your journey into myth-building and AI fundamentals."
            features={[
              'Access to Core AI Modules',
              'Foundational Myth-Building Tools',
              'AI Pattern Recognition Games',
              'Progress Tracking & Insights',
              'Community Forum Access'
            ]}
            buttonText="Unlock Apprentice Key"
            delay={0.5}
          />
          
          <PricingTier
            name="Artisan Key"
            price={billingPeriod === 'monthly' ? '$49' : '$39'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Craft complex narratives and advanced AI models."
            features={[
              'All Apprentice Key Features',
              'Full Curriculum Access',
              'Advanced AI Model Creation Suite',
              'Save & Share Your AI Myths',
              'Exclusive Monthly Content Drops',
              'Priority Support Channel'
            ]}
            isPopular={true}
            buttonText="Forge Artisan Key"
            delay={0.6}
          />
          
          <PricingTier
            name="Architect Key"
            price={billingPeriod === 'monthly' ? '$99' : '$79'}
            period={billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}
            description="Master the art of AI creation and lead collaborative mythologies."
            features={[
              'All Artisan Key Features',
              'Up to 5 Creator Profiles',
              'Collaborative World-Building Projects',
              'Advanced Analytics Dashboard',
              'Personalized Learning Trajectories',
              'Quarterly 1-on-1 Mentorship'
            ]}
            buttonText="Claim Architect Key"
            delay={0.7}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;