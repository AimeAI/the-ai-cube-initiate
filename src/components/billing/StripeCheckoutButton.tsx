import React, { useState } from 'react';
import { loadStripe, StripeError } from '@stripe/stripe-js';

const StripeCheckoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    // Check for internet connection
    if (!navigator.onLine) {
      setError("Offline: Cannot connect to Stripe. Please check your internet connection.");
      setIsLoading(false);
      return;
    }

    // Get Stripe Publishable Key
    const publishableKey = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      setError("Stripe configuration error: Publishable key not found.");
      setIsLoading(false);
      console.error("VITE_APP_STRIPE_PUBLISHABLE_KEY is not set in .env file");
      return;
    }

    // Get Placeholder Price ID
    const priceId = import.meta.env.VITE_APP_STRIPE_SINGLE_LICENSE_PRICE_ID;
    if (!priceId) {
      setError("Stripe configuration error: Price ID not found.");
      setIsLoading(false);
      console.error("VITE_APP_STRIPE_SINGLE_LICENSE_PRICE_ID is not set in .env file");
      return;
    }

    try {
      const stripe = await loadStripe(publishableKey);
      if (!stripe) {
        setError("Failed to initialize Stripe.");
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const checkoutResult = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      });

      // If redirectToCheckout returns an error (e.g., client-side validation, network issue before redirect)
      if (checkoutResult.error) {
        console.error("Stripe redirectToCheckout error:", checkoutResult.error);
        setError(checkoutResult.error.message || "An unexpected error occurred during checkout.");
        setIsLoading(false); // Only set if there's an error, otherwise user is redirected
      }
      // If successful, the user is redirected, so no need to set isLoading(false) here unless error.
      
    } catch (e) {
      // Catch any other unexpected errors during the process
      console.error("Unexpected error during checkout process:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="px-8 py-4 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                   text-lg text-white border-2 
                   bg-purple-600 border-purple-400 
                   hover:bg-purple-500 hover:shadow-purple-400/50 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing Payment...' : 'Upgrade to Premium Access'}
      </button>
      {error && (
        <div 
          className="mt-2 p-3 bg-red-700 border border-red-900 text-white text-sm rounded-md shadow-lg"
          role="alert"
        >
          <p className="font-semibold">Payment Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StripeCheckoutButton;
