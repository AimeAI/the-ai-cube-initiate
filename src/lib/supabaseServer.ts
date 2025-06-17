import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load server environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration for server-side operations');
}

// Create server-side Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface UserSubscription {
  id: string;
  user_id: string;
  customer_id?: string;
  subscription_id: string;
  plan_id: string;
  price_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's subscription by user ID
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabaseAdmin
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching user subscription:', error);
    return null;
  }

  return data as UserSubscription;
}

/**
 * Create or update user subscription
 */
export async function upsertUserSubscription(subscription: Partial<UserSubscription>): Promise<UserSubscription | null> {
  const { data, error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert(subscription, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user subscription:', error);
    return null;
  }

  return data as UserSubscription;
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  subscriptionId: string, 
  status: UserSubscription['status'],
  periodStart?: Date,
  periodEnd?: Date
): Promise<boolean> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (periodStart) {
    updateData.current_period_start = periodStart.toISOString();
  }
  
  if (periodEnd) {
    updateData.current_period_end = periodEnd.toISOString();
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update(updateData)
    .eq('subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription status:', error);
    return false;
  }

  return true;
}

/**
 * Cancel subscription
 */
export async function cancelUserSubscription(userId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error canceling user subscription:', error);
    return false;
  }

  return true;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.status === 'active' || false;
}