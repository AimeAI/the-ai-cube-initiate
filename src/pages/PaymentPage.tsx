import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
import React from 'react';
import Navigation from '@/components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';
import { useTranslation } from 'react-i18next';
import { getPlans, Plan } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, getToken, loading } = useAuth();
  const plans = getPlans();

  const handleCheckout = async (planId: string) => {
    try {
      // Check if user is authenticated
      if (!user) {
        alert('Please log in to purchase a subscription.');
        navigate('/login');
        return;
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

      if (!stripe) {
        console.error('Stripe.js has not loaded.');
        return;
      }

      // Get auth token from Supabase
      const token = await getToken();
      
      if (!token) {
        alert('Authentication required. Please log in and try again.');
        navigate('/login');
        return;
      }
      
      // Call the backend API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add auth header
        },
        body: JSON.stringify({ 
          productId: planId, 
          billingPeriod: 'monthly', // Default to monthly, can be made dynamic
          quantity: 1 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
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
    } catch (error: unknown) {
      console.error('Error during checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      alert(`Failed to initiate checkout: ${errorMessage}`);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="bg-myth-background text-myth-textPrimary min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myth-accent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan: Plan) => (
            <MythCard key={plan.id} title={plan.name}>
              <p className="text-myth-textSecondary mb-4">
                {t('paymentPage.price', { price: plan.price, currency: plan.currency.toUpperCase(), interval: t(`paymentPage.interval.${plan.interval}`) })}
              </p>
              <p className="text-myth-textSecondary text-sm mb-6">
                {t('paymentPage.fullPrice', { fullPrice: plan.metadata.full_price, currency: plan.currency.toUpperCase() })}
              </p>
              <MythButton
                label={t('paymentPage.selectPlanButton', 'Select Plan')}
                onClick={() => handleCheckout(plan.id)}
                className="w-full"
              />
            </MythCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;