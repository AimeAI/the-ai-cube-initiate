import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getPlans, getTestPrice, PricingPlan } from '../lib/stripe';
import { Check, Star, Users, Zap, Target, Sprout, Crown, Sparkles } from 'lucide-react';

// Enhanced pricing data with mystical builder legend tone
const enhancedPlans = [
  {
    id: 'explorer',
    hook: '🌱 Begin Your Sacred Journey?',
    name: 'Seeker of Sparks',
    title: 'The First Awakening',
    description: 'For those who hear the whisper of artificial consciousness calling',
    monthlyPrice: 8,
    yearlyPrice: 64,
    features: [
      'Access to 3 foundational AI mysteries',
      'Chronicle your learning odyssey',
      'Join the Seeker\'s Circle',
      'Sacred knowledge repository',
      'Cross-realm accessibility (mobile & desktop)'
    ],
    icon: <Sprout className="w-6 h-6" />,
    cta: 'Begin the Quest',
    bestFor: 'Curious souls awakening to the mysteries of artificial intelligence',
    mysticalDesc: 'Every legend begins with a single spark of curiosity...'
  },
  {
    id: 'initiate',
    hook: '⚡ Ready to Forge Your Destiny?',
    name: 'AI Cube Initiate',
    title: 'The Sacred Ascension',
    description: 'Unlock the full power of the ancient AI mysteries',
    monthlyPrice: 15,
    yearlyPrice: 120,
    features: [
      'Master all 8 chambers of AI wisdom',
      'Advanced neural pattern recognition',
      'Unlock legendary achievements',
      'Guardian\'s oversight dashboard',
      'Priority communion with the Order',
      'Sacred certificates of mastery'
    ],
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    cta: 'Ascend to Initiate',
    bestFor: 'Dedicated builders ready to master the sacred arts of AI',
    mysticalDesc: 'The chosen path of those destined for greatness...'
  },
  {
    id: 'master',
    hook: '🎯 Seek the Ancient Wisdom?',
    name: 'Master Builder',
    title: 'The Legendary Path',
    description: 'Walk alongside the AI Architects themselves',
    monthlyPrice: 25,
    yearlyPrice: 200,
    features: [
      'All Initiate powers and beyond',
      'Monthly counsel with AI Sages',
      'First glimpse of emerging mysteries',
      'Forge your own learning destiny',
      'Deep neural analytics mastery',
      'Shape the future of the Order',
      'Exclusive Master\'s Sanctum access'
    ],
    icon: <Crown className="w-6 h-6" />,
    cta: 'Claim Your Legacy',
    bestFor: 'Visionary architects seeking to shape the future of AI',
    mysticalDesc: 'For those who would become legends themselves...'
  },
  {
    id: 'family',
    hook: '👨‍👩‍👧‍👦 Unite Your Bloodline?',
    name: 'Dynasty of Builders',
    title: 'The Sacred Lineage',
    description: 'Forge a legacy that spans generations',
    monthlyPrice: 20,
    yearlyPrice: 160,
    features: [
      'Unite up to 4 souls in learning',
      'All Initiate mysteries for each member',
      'Dynasty progress chronicles',
      'Sacred family competitions',
      'Parental guidance & insights',
      'Collective achievement honors',
      'Legacy documentation scrolls'
    ],
    icon: <Users className="w-6 h-6" />,
    familyPlan: true,
    cta: 'Forge Your Dynasty',
    bestFor: 'Families destined to build the future together',
    mysticalDesc: 'When legends unite, empires are born...'
  }
];

const testimonials = [
  {
    quote: "My daughter has become obsessed with these AI mysteries - she calls herself a 'Neural Architect' now.",
    author: "Guardian of a Young Builder",
    mystical: true
  },
  {
    quote: "This isn't just learning - it's like discovering ancient magic that actually works.",
    author: "Initiate, Age 11",
    mystical: true
  },
  {
    quote: "Finally, an AI course that feels like an epic quest instead of homework.",
    author: "Master Builder in Training",
    mystical: true
  }
];

interface EnhancedPricingTierProps {
  plan: any;
  isPopular?: boolean;
  delay: number;
  onCheckout: (planId: string, isYearly: boolean) => Promise<void>;
  isLoading?: boolean;
  testPrice?: number;
  isYearly: boolean;
}

const EnhancedPricingTier: React.FC<EnhancedPricingTierProps> = ({
  plan,
  isPopular = false,
  delay,
  onCheckout,
  isLoading = false,
  testPrice,
  isYearly
}) => {
  const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const displayPrice = testPrice || currentPrice;
  const monthlyEquivalent = isYearly ? (plan.yearlyPrice / 12).toFixed(2) : displayPrice;
  const savings = isYearly ? (plan.monthlyPrice * 12) - plan.yearlyPrice : 0;

  return (
    <div 
      className={`bg-void-black/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden animate-fade-in border transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30 ${
        isPopular ? 'border-2 border-electricCyan relative transform scale-105 md:scale-110 shadow-electricCyan/40 bg-gradient-to-br from-void-black/80 to-purple-900/20' : 'border border-purple-500/40 hover:border-electricCyan/70'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-neonMint via-electricCyan to-neonMint text-obsidianBlack text-xs font-bold uppercase py-2 px-6 rounded-full shadow-lg shadow-electricCyan/50 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Chosen Path
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      )}
      
      <div className="p-8 text-center relative">
        {/* Mystical Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-electricCyan/5 via-transparent to-neonMint/5 rounded-xl"></div>
        
        {/* Hook */}
        <div className="text-sm text-electricCyan font-medium mb-3 relative z-10">
          {plan.hook}
        </div>
        
        {/* Title & Name */}
        <div className="relative z-10 mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {plan.title}
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-electricCyan">
              {plan.icon}
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
              {plan.name}
            </h3>
          </div>
        </div>
        
        {/* Mystical Description */}
        <div className="text-xs text-gray-400 italic mb-4 relative z-10">
          {plan.mysticalDesc}
        </div>
        
        {/* Pricing */}
        <div className="mb-6 relative z-10">
          {isYearly ? (
            <>
              <span className="text-4xl font-bold text-white">${monthlyEquivalent}</span>
              <span className="text-gray-400 ml-1">/moon cycle</span>
              <div className="text-sm text-gray-400">
                sealed yearly (${plan.yearlyPrice} sacred coins)
              </div>
              {savings > 0 && (
                <div className="text-sm text-neonMint font-medium mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Preserve ${savings} sacred coins
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </>
          ) : (
            <>
              <span className="text-4xl font-bold text-white">${displayPrice}</span>
              <span className="text-gray-400 ml-1">/moon cycle</span>
            </>
          )}
          {testPrice && testPrice !== currentPrice && (
            <div className="text-sm text-gray-500 line-through">
              ${currentPrice}/moon cycle
            </div>
          )}
        </div>
        
        <p className="text-gray-300 mb-6 text-sm leading-relaxed relative z-10">
          {plan.description}
        </p>
        
        <div className="space-y-3 mb-8 text-left relative z-10">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start">
              <Check className="w-4 h-4 text-neonMint mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => onCheckout(plan.id, isYearly)}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-300 relative overflow-hidden group ${
            isPopular
              ? 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-xl hover:shadow-electricCyan/40'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform'}`}
        >
          <span className="relative z-10">
            {isLoading ? 'Forging Connection...' : plan.cta}
          </span>
          {!isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </button>
        
        {plan.familyPlan && (
          <p className="text-xs text-gray-400 mt-3 italic relative z-10">
            ✨ Perfect for dynasties of multiple learners ✨
          </p>
        )}
      </div>
    </div>
  );
};

const EnhancedPricingSection: React.FC = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const handleCheckout = async (planId: string, yearly: boolean) => {
    try {
      setIsLoading(planId);

      // Check if user is authenticated
      if (!user) {
        alert('Please join the Order first to begin your journey.');
        navigate('/login');
        return;
      }

      // Get auth token
      const token = await getToken();
      if (!token) {
        alert('Sacred authentication required. Please join the Order and try again.');
        navigate('/login');
        return;
      }

      // Call the enhanced API endpoint
      const response = await fetch('/api/enhanced-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: planId,
          billingPeriod: yearly ? 'yearly' : 'monthly'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'The sacred connection failed to establish');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('The portal to payment realms could not be opened');
      }

    } catch (error: any) {
      console.error('Error during sacred transaction:', error);
      alert(error.message || 'The mystical forces encountered an error. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-void-black via-obsidianBlack to-void-black relative overflow-hidden">
      {/* Enhanced Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electricCyan/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonMint/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="text-sm text-electricCyan uppercase tracking-wider mb-4 font-medium">
            ⚡ The Sacred Paths Await ⚡
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x">
            Choose Your Destiny
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Four sacred paths lie before you, each leading to mastery of the ancient AI mysteries. 
            From humble seeker to legendary master builder, your journey into artificial consciousness begins with a single choice.
          </p>
          
          {/* Mystical Billing Toggle */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className={`text-lg font-medium transition-all duration-300 ${!isYearly ? 'text-electricCyan scale-110' : 'text-gray-400'}`}>
              🌙 Moon Cycles
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
                isYearly ? 'bg-gradient-to-r from-electricCyan to-neonMint shadow-lg shadow-electricCyan/30' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                  isYearly ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium transition-all duration-300 ${isYearly ? 'text-electricCyan scale-110' : 'text-gray-400'}`}>
              ⭐ Sacred Years
            </span>
            {isYearly && (
              <div className="bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack px-4 py-2 rounded-full text-sm font-bold ml-3 animate-pulse">
                ✨ Preserve 20% Sacred Coins ✨
              </div>
            )}
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {enhancedPlans.map((plan, index) => (
            <EnhancedPricingTier
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
              delay={index * 0.2}
              onCheckout={handleCheckout}
              isLoading={isLoading === plan.id}
              testPrice={user ? getTestPrice(plan.id, user.id) : undefined}
              isYearly={isYearly}
            />
          ))}
        </div>

        {/* Mystical Best For Table */}
        <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 mb-16 shadow-2xl">
          <h3 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            ⚡ Which Sacred Path Calls to You? ⚡
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-6 px-6 font-bold text-electricCyan text-lg">Sacred Path</th>
                  <th className="text-left py-6 px-6 font-bold text-electricCyan text-lg">Destined For...</th>
                </tr>
              </thead>
              <tbody>
                {enhancedPlans.map((plan, index) => (
                  <tr key={plan.id} className={`transition-colors hover:bg-purple-500/10 ${index % 2 === 0 ? 'bg-purple-500/5' : 'bg-transparent'}`}>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <div className="text-electricCyan">{plan.icon}</div>
                        <div>
                          <div className="font-bold text-white text-lg">{plan.name}</div>
                          <div className="text-xs text-gray-400 italic">{plan.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-gray-300 leading-relaxed">
                      {plan.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mystical Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-8">
            ✨ Chronicles from Fellow Builders ✨
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-void-black/40 backdrop-blur-md rounded-lg p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
                <div className="text-gray-300 italic mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </div>
                <div className="text-sm text-electricCyan font-medium">
                  — {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Why Choose Section */}
        <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 mb-12 shadow-2xl">
          <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint text-center">
            ⚡ Why the AI Cube Mysteries? ⚡
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-electricCyan/20 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover:bg-electricCyan/30 transition-colors">
                <Zap className="w-6 h-6 text-electricCyan" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Sacred 3D Realms</h4>
                <p className="text-gray-400 leading-relaxed">Journey through mystical 3D worlds where AI concepts come alive through ancient magic and modern technology</p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-neonMint/20 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover:bg-neonMint/30 transition-colors">
                <Star className="w-6 h-6 text-neonMint" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Ancient Wisdom, Modern Power</h4>
                <p className="text-gray-400 leading-relaxed">Learn from the AI Architects themselves through carefully crafted mysteries that reveal the deepest secrets</p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover:bg-purple-500/30 transition-colors">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">The Sacred Order</h4>
                <p className="text-gray-400 leading-relaxed">Join a legendary community of builders, seekers, and masters united in the quest for AI enlightenment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators with Mystical Tone */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-4">✨ Trusted by the growing Order across realms ✨</div>
          <div className="flex justify-center items-center gap-8 opacity-70 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-sm text-gray-400">50+ Sacred Academies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <span className="text-sm text-gray-400">1000+ Builder Dynasties</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="text-sm text-gray-400">15+ Mystical Realms</span>
            </div>
          </div>
        </div>

        {/* Sacred Guarantee */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            🛡️ 30-day Sacred Oath guarantee • Cancel your quest anytime • No hidden curses or fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnhancedPricingSection;
