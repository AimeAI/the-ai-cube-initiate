#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test basic connection
try {
  console.log('📡 Testing basic connection...');
  const { data, error } = await supabase.from('user_subscriptions').select('count').limit(1);
  
  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('⚠️  Connected but tables missing - need to run migrations');
    } else {
      console.log('❌ Connection failed:', error.message);
    }
  } else {
    console.log('✅ Connection successful!');
  }
} catch (err) {
  console.log('❌ Connection error:', err.message);
}

// Test authentication
try {
  console.log('🔐 Testing authentication...');
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.log('❌ Auth error:', error.message);
  } else {
    console.log('✅ Authentication system working');
  }
} catch (err) {
  console.log('❌ Auth test failed:', err.message);
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Find your project: jtnmrxgdtjupfvaoddif');
console.log('3. Go to SQL Editor');
console.log('4. Run the SQL from supabase-setup.sql');
console.log('5. Go to Authentication > Users');
console.log('6. Add demo user: demo@aicube.ai / Demo123!');
