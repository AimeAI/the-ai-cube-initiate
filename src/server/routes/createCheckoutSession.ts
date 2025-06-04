import express, { Request, Response, NextFunction, RequestHandler, Router } from 'express';
import Stripe from 'stripe';
import { PRICE_IDS } from '../../../lib/stripe'; // Adjusted import path

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | undefined; // Declare stripe, potentially undefined

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-05-28.basil', // Consider using a standard, valid API version e.g. '2024-04-10'
  });
} else {
  console.error('FATAL: STRIPE_SECRET_KEY is not set. Payment processing will be disabled.');
}

const router: Router = express.Router();

const createCheckoutSessionHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!stripe || !stripeSecretKey) { // Check if stripe is initialized and key is present
    const err = new Error('Payment system is not configured or STRIPE_SECRET_KEY is missing.');
    console.error(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
  try {
    const { productId: rawProductId, quantity: rawQuantity, billingPeriod: rawBillingPeriod } = req.body;

    if (typeof rawProductId !== 'string' || rawProductId.trim() === '') {
      res.status(400).json({ error: 'Product ID is required and must be a non-empty string.' });
      return;
    }
    const productId: string = rawProductId.trim();

    if (typeof rawBillingPeriod !== 'string' || (rawBillingPeriod !== 'monthly' && rawBillingPeriod !== 'yearly')) {
      res.status(400).json({ error: 'Billing period is required and must be "monthly" or "yearly".' });
      return;
    }
    const billingPeriod: 'monthly' | 'yearly' = rawBillingPeriod as 'monthly' | 'yearly';

    let priceId: string | undefined;

    if (productId === 'prod_SR1HZbeBKyNXsk' && billingPeriod === 'monthly') {
      priceId = PRICE_IDS.seekersSparkMonthly;
    }
    // else if (productId === 'prod_SR1HZbeBKyNXsk' && billingPeriod === 'yearly') {
    //   priceId = PRICE_IDS.seekersSparkYearly; // Uncomment when yearly price ID is available
    // }

    if (!priceId) {
      console.error(`No matching Price ID found for Product ID: ${productId} and Billing Period: ${billingPeriod}`);
      res.status(400).json({ error: 'Invalid product or billing period combination.' });
      return;
    }

    let quantity: number = 1; // Default quantity
    if (rawQuantity !== undefined) {
      const parsedQuantity = Number(rawQuantity);
      if (Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
        quantity = parsedQuantity;
      } else {
        res.status(400).json({ error: 'Quantity, if provided, must be a positive integer.' });
        return;
      }
    }

    const origin = req.headers.origin || process.env.PUBLIC_APP_URL;
    if (!origin) {
      const errMsg = "Error: Could not determine origin for redirect URLs. Configure PUBLIC_APP_URL or ensure 'Origin' header is present.";
      console.error(errMsg);
      res.status(500).json({ error: 'Could not determine redirect URL origin.' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
    });

    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    // If using next for error handling:
    // next(error);
    // For now, direct response:
    res.status(500).json({ error: error.message });
  }
};

router.post('/', createCheckoutSessionHandler);

export default router;