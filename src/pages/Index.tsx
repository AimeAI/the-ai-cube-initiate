import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AccessSection from '@/components/AccessSection';
import CoreSection from '@/components/CoreSection';
import FeaturesSection from '@/components/FeaturesSection';

const Index = () => {
  // useEffect to set body background has been removed to allow CSS/Tailwind to control it.

  return (
    <div className="bg-void-black text-text-primary min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AccessSection />
      <CoreSection />
      <FeaturesSection />
      
      {/* More sections to be added later */}
    </div>
  );
};

export default Index;
