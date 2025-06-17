-- Production Database Setup for AI Cube
-- Run this after creating production Supabase project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enhanced user_subscriptions table with comprehensive tracking
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT UNIQUE NOT NULL, -- Stripe subscription ID
  customer_id TEXT NOT NULL, -- Stripe customer ID
  plan_id TEXT NOT NULL, -- Stripe product ID
  price_id TEXT NOT NULL, -- Stripe price ID
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Billing information
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'cad',
  
  -- Metadata for analytics
  signup_source TEXT, -- Where user came from
  coupon_code TEXT, -- Applied coupon
  referral_code TEXT, -- Referral tracking
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (current_period_start < current_period_end),
  CONSTRAINT valid_trial CHECK (trial_start IS NULL OR trial_end IS NULL OR trial_start < trial_end)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON user_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period_end ON user_subscriptions(current_period_end);

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Profile information
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Toronto',
  language TEXT DEFAULT 'en',
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  game_sounds BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  
  -- Progress tracking
  games_completed INTEGER DEFAULT 0,
  total_play_time INTEGER DEFAULT 0, -- In minutes
  achievements JSONB DEFAULT '[]'::jsonb,
  progress_data JSONB DEFAULT '{}'::jsonb,
  
  -- Parent/Student relationship
  account_type TEXT DEFAULT 'student' CHECK (account_type IN ('student', 'parent', 'educator')),
  parent_email TEXT, -- For student accounts
  students JSONB DEFAULT '[]'::jsonb, -- For parent accounts
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type ON user_profiles(account_type);

-- Create payment_history table for transaction tracking
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  
  -- Stripe payment information
  payment_intent_id TEXT UNIQUE NOT NULL,
  invoice_id TEXT,
  charge_id TEXT,
  
  -- Payment details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'cad',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending', 'refunded')),
  payment_method_type TEXT, -- card, bank_transfer, etc.
  
  -- Failure information
  failure_code TEXT,
  failure_message TEXT,
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payment_history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_paid_at ON payment_history(paid_at);

-- Create audit_logs table for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL, -- login, logout, subscription_change, payment, etc.
  event_category TEXT NOT NULL CHECK (event_category IN ('auth', 'payment', 'subscription', 'security', 'admin')),
  description TEXT NOT NULL,
  
  -- Context information
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Risk assessment
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON audit_logs(risk_level);

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Subscriptions RLS Policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage all subscriptions" ON user_subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- User Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Parents can view their students' profiles
CREATE POLICY "Parents can view student profiles" ON user_profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles up
      WHERE up.account_type = 'parent' 
      AND user_profiles.parent_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Payment History RLS Policies
CREATE POLICY "Users can view own payment history" ON payment_history
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payments" ON payment_history
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Audit Logs RLS Policies
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all audit logs" ON audit_logs
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  -- Log user registration
  INSERT INTO audit_logs (user_id, event_type, event_category, description, metadata)
  VALUES (
    NEW.id, 
    'user_registered', 
    'auth', 
    'New user account created',
    jsonb_build_object('email', NEW.email, 'provider', NEW.app_metadata->>'provider')
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Create function for subscription analytics
CREATE OR REPLACE FUNCTION get_subscription_analytics(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days')
RETURNS TABLE (
  active_subscriptions BIGINT,
  new_subscriptions BIGINT,
  canceled_subscriptions BIGINT,
  total_revenue NUMERIC,
  average_revenue_per_user NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
    COUNT(*) FILTER (WHERE created_at >= start_date) as new_subscriptions,
    COUNT(*) FILTER (WHERE status = 'canceled' AND canceled_at >= start_date) as canceled_subscriptions,
    COALESCE(SUM(amount) FILTER (WHERE status = 'active'), 0)::NUMERIC / 100 as total_revenue,
    CASE 
      WHEN COUNT(*) FILTER (WHERE status = 'active') > 0 
      THEN (COALESCE(SUM(amount) FILTER (WHERE status = 'active'), 0)::NUMERIC / 100) / COUNT(*) FILTER (WHERE status = 'active')
      ELSE 0 
    END as average_revenue_per_user
  FROM user_subscriptions
  WHERE created_at >= start_date OR status = 'active';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON payment_history TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active 
  ON user_subscriptions(user_id, status) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_payment_history_recent 
  ON payment_history(user_id, created_at DESC, status);

COMMENT ON TABLE user_subscriptions IS 'Tracks user subscription status and billing information from Stripe';
COMMENT ON TABLE user_profiles IS 'Extended user profile information and preferences';
COMMENT ON TABLE payment_history IS 'Complete history of all payment transactions';
COMMENT ON TABLE audit_logs IS 'Security and activity audit trail for compliance';

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';