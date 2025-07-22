-- AI Cube Initiate - Complete Database Setup
-- Run this in your Supabase SQL Editor

-- Create user_subscriptions table for managing Stripe subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id text, -- Stripe customer ID
  subscription_id text UNIQUE, -- Stripe subscription ID
  plan_id text NOT NULL, -- Stripe product ID
  plan_tier text DEFAULT 'initiate', -- New pricing tier
  price_id text NOT NULL, -- Stripe price ID
  status text NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;

-- Create RLS policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role can manage all subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON user_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_tier ON user_subscriptions(plan_tier);

-- Add constraint to ensure valid plan tiers
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS valid_plan_tier;

ALTER TABLE user_subscriptions 
ADD CONSTRAINT valid_plan_tier 
CHECK (plan_tier IN ('explorer', 'initiate', 'master', 'family'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user's current plan tier
CREATE OR REPLACE FUNCTION get_user_plan_tier(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    SELECT plan_tier INTO tier
    FROM user_subscriptions
    WHERE user_id = user_uuid 
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(tier, 'none');
END;
$$;

-- Create function to check if user has access to specific features
CREATE OR REPLACE FUNCTION user_has_feature_access(user_uuid uuid, feature_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    tier := get_user_plan_tier(user_uuid);
    
    CASE feature_name
        WHEN 'basic_games' THEN
            RETURN tier IN ('explorer', 'initiate', 'master', 'family');
        WHEN 'all_games' THEN
            RETURN tier IN ('initiate', 'master', 'family');
        WHEN 'premium_features' THEN
            RETURN tier IN ('master', 'family');
        WHEN 'family_dashboard' THEN
            RETURN tier = 'family';
        WHEN 'tutoring' THEN
            RETURN tier = 'master';
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_plan_tier(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_feature_access(uuid, text) TO authenticated;

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  account_type text DEFAULT 'parent',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
