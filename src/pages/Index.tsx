import React from 'react';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AccessSection from '@/components/AccessSection';
import CoreSection from '@/components/CoreSection';
import FeaturesSection from '@/components/FeaturesSection';
import ValueSection from '@/components/ValueSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';

const Index = () => {
  // useEffect to set body background has been removed to allow CSS/Tailwind to control it.

  return (
    <div className="bg-void-black text-text-primary min-h-screen overflow-x-hidden">
      <MetaHead
        title="AI Cube - Home"
        description="Welcome to AI Cube – Learn AI Through Play. A simulation-based learning platform."
        url="https://aicube.ai/"
        image="https://aicube.ai/og-image-home.png"
      />
      <Navigation />
      <HeroSection />
      <AccessSection />
      <CoreSection />
      <FeaturesSection />
      <ValueSection />
      <TestimonialsSection />
      <PricingSection />
      {/* More sections to be added later */}
    </div>
  );
};

export default Index;
