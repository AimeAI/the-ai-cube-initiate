import React from 'react';
import { useTranslation } from 'react-i18next';
import MetaHead from '@/components/MetaHead';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AccessSection from '@/components/AccessSection';
import CoreSection from '@/components/CoreSection';
import FeaturesSection from '@/components/FeaturesSection';
import ValueSection from '@/components/ValueSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PhilosophySection from '@/components/PhilosophySection'; // Added import
import PricingSection from '@/components/PricingSection';

const Index = () => {
  const { t } = useTranslation();
  // useEffect to set body background has been removed to allow CSS/Tailwind to control it.

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden">
      <MetaHead
        title={t('meta.home.title')}
        description={t('meta.home.description')}
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
      <PhilosophySection />
      <PricingSection />
      {/* More sections to be added later */}
    </div>
  );
};

export default Index;
