-- Create user_subscriptions table to store subscription status from Stripe
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE, -- Each user has one subscription row
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT, -- e.g., 'plan_beta_solo', 'plan_beta_family'
  status TEXT, -- e.g., 'active', 'cancelled', 'incomplete', 'past_due'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_subscriptions_updated ON public.user_subscriptions;
CREATE TRIGGER on_user_subscriptions_updated
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_subscriptions_updated_at();

-- RLS Policies for user_subscriptions
-- Ensure RLS is enabled for the table
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can select their own subscription details
DROP POLICY IF EXISTS "Allow individual user select access" ON public.user_subscriptions;
CREATE POLICY "Allow individual user select access"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role or specific backend functions would handle inserts/updates.
-- For example, a webhook handler for Stripe events.
-- Users should NOT be able to directly insert or update their subscriptions from the client-side.

-- Example: Allow service_role to do everything (typical for backend processes)
-- DROP POLICY IF EXISTS "Allow service_role full access" ON public.user_subscriptions;
-- CREATE POLICY "Allow service_role full access"
--   ON public.user_subscriptions
--   FOR ALL
--   USING (true) -- Or specify role: current_user_is_service_role() if such a function exists
--   WITH CHECK (true);

COMMENT ON TABLE public.user_subscriptions IS 'Stores user subscription data, typically managed via Stripe webhooks.';
COMMENT ON COLUMN public.user_subscriptions.user_id IS 'Links to the authenticated user.';
COMMENT ON COLUMN public.user_subscriptions.stripe_customer_id IS 'Stripe Customer ID.';
COMMENT ON COLUMN public.user_subscriptions.stripe_subscription_id IS 'Stripe Subscription ID.';
COMMENT ON COLUMN public.user_subscriptions.plan_id IS 'Identifier for the subscribed plan (e.g., from your pricing table or Stripe).';
COMMENT ON COLUMN public.user_subscriptions.status IS 'Current status of the subscription (e.g., active, canceled).';

-- Reminder: Review and apply these policies in your Supabase dashboard.
-- You will also need a secure way (e.g., Stripe webhook handler implemented as a Supabase Edge Function)
-- to populate and update this table based on Stripe events.