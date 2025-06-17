// This file should now only contain client-side safe code or types.
// Server-side Stripe instance and checkout session creation are moved to an API route.

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  currency: string;
  metadata: {
    full_price: number;
  };
}

export function getPlans(): Plan[] {
  return [
    {
      id: 'beta_single',
      name: 'Beta Single Plan',
      price: 10,
      interval: 'month',
      currency: 'usd',
      metadata: {
        full_price: 20,
      },
    },
    {
      id: 'beta_family',
      name: 'Beta Family Plan',
      price: 22.50,
      interval: 'month',
      currency: 'usd',
      metadata: {
        full_price: 45,
      },
    },
  ];
}

export const PRICE_IDS = {
  seekersSparkMonthly: 'price_abc123', // Placeholder for prod_SR1HZbeBKyNXsk monthly
  // seekersSparkYearly: 'price_xyz789', // Placeholder for yearly if needed
};

// createCheckoutSession has been moved to src/server/routes/createCheckoutSession.ts
// The client will now call the API endpoint /api/create-checkout-session