import React from 'react';
import Navigation from '@/components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { useTranslation } from 'react-i18next';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden">
      <Navigation />
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-myth-accent to-myth-secondary">
          {t('paymentPage.joinTitle', 'Join The AI Cube')}
        </h1>
        <p className="text-myth-textSecondary mb-12 max-w-2xl mx-auto">
          {t('paymentPage.joinDescription', 'Select your desired key and unlock the power to build your own AI myths. Secure payment processing via Stripe and account management via Supabase.')}
        </p>
        
        <div className="max-w-md mx-auto"> {/* Wrapper div for styling */}
          <MythCard title={t('paymentPage.paymentTitle', 'Payment & Sign Up')}>
            <p className="text-myth-textSecondary mb-6">
              {t('paymentPage.paymentDescription', 'Stripe payment form and Supabase sign-up/login will be integrated here.')}
            </p>
          <MythButton
            label={t('paymentPage.proceedButton', 'Proceed to Payment (Placeholder)')}
            onClick={() => alert('Payment integration pending.')} // Placeholder action
            className="w-full mb-4"
          />
          <MythButton
            label={t('paymentPage.returnHomeButton', 'Return to Home')}
            onClick={() => navigate('/')}
            className="w-full bg-myth-surface border border-myth-border hover:bg-myth-border/30" // Secondary button style
          />
          </MythCard>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;