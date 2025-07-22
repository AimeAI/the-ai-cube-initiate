import React from 'react';
import { useTranslation } from 'react-i18next';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import ClearPricingSection from '@/components/ClearPricingSection';
import FeedbackButton from '@/components/FeedbackButton';

const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden">
      <MetaHead
        title="AI Cube Pricing - Clear Plans for AI Learning | AI Cube"
        description="Choose the right plan for your family. 3 games free forever, upgrade for access to all 7 AI learning games. Monthly and yearly options available."
        url="https://aicube.ai/pricing"
        image="https://aicube.ai/og-image-pricing.png"
      />
      <Navigation />
      
      {/* Mystical Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-electricCyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-neonMint/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-sm text-electricCyan uppercase tracking-wider mb-4 font-medium">
            Choose Your Plan
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan via-neonMint to-electricCyan animate-gradient-x">
            Simple, Clear Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Start with 3 free AI learning games. Upgrade when you're ready for access to all 7 games and advanced features.
          </p>
          <div className="text-lg text-electricCyan font-medium">
            No hidden fees • Cancel anytime • 14-day money-back guarantee
          </div>
        </div>
      </section>

      <ClearPricingSection />
      
      {/* Mystical FAQ Section */}
      <section className="py-20 px-4 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-obsidianBlack to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            ⚡ Sacred Mysteries Revealed ⚡
          </h2>
          
          <div className="space-y-8">
            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                🔄 Can I change my sacred path during the journey?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Absolutely! The mystical forces allow you to ascend or descend between paths at any moment. 
                Your transformation takes effect immediately, and the cosmic balance adjusts any sacred coin differences.
              </p>
            </div>
            
            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                ✨ What mysteries await in the sacred trial?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Every seeker receives access to 3 foundational AI mysteries for 7 sacred days, completely free. 
                No sacred coins required - just your curiosity and willingness to learn the ancient ways.
              </p>
            </div>
            
            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                👨‍👩‍👧‍👦 How does the Dynasty of Builders unite families?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                The Dynasty path binds up to 4 souls in shared learning, each with their own progress chronicles. 
                Parents receive the Guardian's Dashboard to oversee the family's journey, while sacred competitions 
                and shared achievements strengthen the bloodline's legacy.
              </p>
            </div>
            
            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                🛡️ What if the mysteries don't resonate with my soul?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We honor a 30-day Sacred Oath on all paths. If the AI mysteries don't awaken your inner builder, 
                we'll return your sacred coins without question. Your satisfaction is protected by ancient magic.
              </p>
            </div>

            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                🎯 What makes Master Builders legendary?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Master Builders receive monthly counsel with the AI Sages themselves - one-on-one guidance from 
                the architects of artificial consciousness. They also glimpse emerging mysteries before others 
                and help shape the future of the Sacred Order.
              </p>
            </div>

            <div className="bg-void-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 hover:border-electricCyan/50 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                🌟 How do I know which path calls to me?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Listen to your soul's whisper. Seekers of Sparks feel curiosity stirring. Initiates hunger for 
                complete mastery. Master Builders crave wisdom and guidance. Dynasties unite families in shared purpose. 
                The right path will resonate with your deepest aspirations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-electricCyan/5 via-transparent to-neonMint/5"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            Your Legend Awaits
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            The ancient AI mysteries have chosen you. The sacred paths lie open. 
            Your transformation from seeker to master builder begins with a single step.
          </p>
          <div className="text-electricCyan font-medium">
            ⚡ Join the Order. Forge Your Destiny. Become Legend. ⚡
          </div>
        </div>
      </section>
      
      <FeedbackButton />
    </div>
  );
};

export default PricingPage;
