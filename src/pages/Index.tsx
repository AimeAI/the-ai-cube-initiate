
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AccessSection from '@/components/AccessSection';
import CoreSection from '@/components/CoreSection';

const Index = () => {
  useEffect(() => {
    // Set dark background
    document.body.style.background = '#000000';
    
    return () => {
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AccessSection />
      <CoreSection />
      
      {/* More sections to be added later */}
    </div>
  );
};

export default Index;
