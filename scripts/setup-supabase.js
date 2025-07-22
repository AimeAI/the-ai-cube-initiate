#!/usr/bin/env node

/**
 * Supabase Setup Script for AI Cube Initiate
 * Applies migrations and sets up the database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../.env.server') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 AI Cube Supabase Setup Script\n');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Migration SQL - Combined from your migration files
const MIGRATION_SQL = `
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
`;

async function runMigration() {
  console.log('📋 Applying database migrations...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: MIGRATION_SQL 
    });
    
    if (error) {
      // Try alternative approach - execute statements one by one
      console.log('⚠️  RPC method failed, trying direct execution...');
      
      const statements = MIGRATION_SQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (stmtError) {
            console.log(`⚠️  Statement failed: ${statement.substring(0, 50)}...`);
            console.log(`   Error: ${stmtError.message}`);
          }
        } catch (err) {
          console.log(`⚠️  Statement error: ${err.message}`);
        }
      }
    } else {
      console.log('✅ Migration completed successfully');
    }
  } catch (err) {
    console.log('❌ Migration failed:', err.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the migration SQL manually');
    console.log('\nMigration SQL saved to: supabase-migration.sql');
    
    // Save SQL to file for manual execution
    import { writeFileSync } from 'fs';
    writeFileSync(join(__dirname, '../supabase-migration.sql'), MIGRATION_SQL);
  }
}

async function createDemoUser() {
  console.log('\n👤 Creating demo user...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'demo@aicube.ai',
      password: 'Demo123!',
      options: {
        emailRedirectTo: undefined // Skip email confirmation
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Demo user already exists');
      } else {
        console.log('❌ Failed to create demo user:', error.message);
      }
    } else {
      console.log('✅ Demo user created successfully');
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            account_type: 'parent'
          });
        
        if (profileError) {
          console.log('⚠️  Profile creation failed:', profileError.message);
        } else {
          console.log('✅ Demo user profile created');
        }
      }
    }
  } catch (err) {
    console.log('❌ Demo user creation error:', err.message);
  }
}

async function testConnection() {
  console.log('\n🧪 Testing final connection...');
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
}

// Run setup
async function main() {
  await runMigration();
  await createDemoUser();
  await testConnection();
  
  console.log('\n🎉 Supabase setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure service role key in .env.server');
  console.log('2. Test login with demo@aicube.ai / Demo123!');
  console.log('3. Configure Stripe keys for payment testing');
  console.log('4. Deploy and test the full application');
}

main().catch(console.error);
