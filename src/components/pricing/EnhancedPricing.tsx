import React, { useState } from 'react';
import { Check, Star, Users, Zap, Target, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface PricingTier {
  id: string;
  hook: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  cta: string;
  bestFor: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'explorer',
    hook: '🌱 Just starting out?',
    icon: <Sprout className="w-6 h-6" />,
    name: 'Explorer',
    description: 'Perfect for curious minds beginning their AI journey',
    monthlyPrice: 8,
    yearlyPrice: 64, // 20% off
    features: [
      'Access to 3 core AI games',
      'Basic progress tracking',
      'Student dashboard',
      'Community support',
      'Mobile-friendly experience'
    ],
    cta: 'Start Exploring',
    bestFor: 'Curious learners exploring AI for the first time'
  },
  {
    id: 'initiate',
    hook: '⚡ Ready to master AI?',
    icon: <Zap className="w-6 h-6" />,
    name: 'Initiate',
    description: 'Full access to accelerate your AI learning',
    monthlyPrice: 15,
    yearlyPrice: 120, // 20% off
    features: [
      'Access to all 8 AI games',
      'Advanced progress analytics',
      'Achievement system',
      'Parent dashboard',
      'Priority support',
      'Downloadable certificates'
    ],
    popular: true,
    cta: 'Become an Initiate',
    bestFor: 'Dedicated learners who want full access and progress tools'
  },
  {
    id: 'master',
    hook: '🎯 Want expert help?',
    icon: <Target className="w-6 h-6" />,
    name: 'Master',
    description: 'Premium experience with mentorship and early access',
    monthlyPrice: 25,
    yearlyPrice: 200, // 20% off
    features: [
      'Everything in Initiate',
      'Monthly 1-on-1 AI mentorship',
      'Early access to new games',
      'Custom learning paths',
      'Advanced analytics',
      'Priority feature requests',
      'Exclusive Master community'
    ],
    cta: 'Unlock Mastery',
    bestFor: 'Ambitious learners needing mentorship and early access'
  },
  {
    id: 'family',
    hook: '👨‍👩‍👧‍👦 Learning as a family?',
    icon: <Users className="w-6 h-6" />,
    name: 'Family',
    description: 'Perfect for families learning AI together',
    monthlyPrice: 20,
    yearlyPrice: 160, // 20% off
    features: [
      'Up to 4 student accounts',
      'All Initiate features for each',
      'Family progress dashboard',
      'Sibling competitions',
      'Parent controls & insights',
      'Family achievement badges',
      'Bulk certificate downloads'
    ],
    cta: 'Start Family Journey',
    bestFor: 'Parents and siblings learning AI together'
  }
];

const testimonials = [
  {
    quote: "My daughter plays this more than Roblox.",
    author: "Beta Parent"
  },
  {
    quote: "Way cooler than any school app.",
    author: "Student, 11"
  },
  {
    quote: "Finally, an AI course that doesn't put kids to sleep!",
    author: "Homeschool Mom"
  }
];

export default function EnhancedPricing() {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (tier: PricingTier) => {
    const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
    const monthlyEquivalent = isYearly ? (tier.yearlyPrice / 12).toFixed(2) : price;
    
    if (isYearly) {
      return {
        display: `$${monthlyEquivalent}/mo`,
        subtitle: `billed yearly ($${tier.yearlyPrice})`
      };
    } else {
      return {
        display: `$${price}/mo`,
        subtitle: 'billed monthly'
      };
    }
  };

  const getSavings = (tier: PricingTier) => {
    if (!isYearly) return null;
    const monthlyCost = tier.monthlyPrice * 12;
    const savings = monthlyCost - tier.yearlyPrice;
    return `Save $${savings}/year`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your AI Learning Adventure
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From curious beginners to AI masters, we have the perfect plan to accelerate your journey into artificial intelligence.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
              💳 Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-lg font-medium ${isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
              📅 Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const pricing = formatPrice(tier);
            const savings = getSavings(tier);
            
            return (
              <Card 
                key={tier.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  tier.popular 
                    ? 'border-purple-500 shadow-lg scale-105 bg-gradient-to-br from-purple-50 to-indigo-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  {/* Hook */}
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    {tier.hook}
                  </div>
                  
                  {/* Icon & Name */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-purple-600">
                      {tier.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {tier.name}
                    </CardTitle>
                  </div>
                  
                  <CardDescription className="text-gray-600 mb-4">
                    {tier.description}
                  </CardDescription>
                  
                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-gray-900">
                      {pricing.display}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pricing.subtitle}
                    </div>
                    {savings && (
                      <div className="text-sm text-green-600 font-medium">
                        {savings}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Best For Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Which Plan is Best for You?
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Tier</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Best for...</th>
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, index) => (
                  <tr key={tier.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-600">{tier.icon}</div>
                        <span className="font-medium text-gray-900">{tier.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {tier.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            What Our AI Learners Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </div>
                <div className="text-sm text-gray-500">
                  – {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-4">Trusted by families worldwide</div>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl">🏫</div>
            <div className="text-sm">Used in 50+ Schools</div>
            <div className="text-2xl">👨‍👩‍👧‍👦</div>
            <div className="text-sm">1000+ Families</div>
            <div className="text-2xl">🌍</div>
            <div className="text-sm">15+ Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
}
