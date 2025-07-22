#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Tests all Supabase integrations and provides setup guidance
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../.env.server') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 AI Cube Supabase Connection Test\n');

// Test 1: Environment Variables
console.log('📋 Step 1: Checking Environment Variables');
console.log('─'.repeat(50));

if (!SUPABASE_URL) {
  console.log('❌ VITE_SUPABASE_URL is missing');
} else {
  console.log('✅ VITE_SUPABASE_URL:', SUPABASE_URL);
}

if (!SUPABASE_ANON_KEY) {
  console.log('❌ VITE_SUPABASE_ANON_KEY is missing');
} else {
  console.log('✅ VITE_SUPABASE_ANON_KEY: [PRESENT]');
}

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === '<YOUR_SUPABASE_SERVICE_ROLE_KEY>') {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY is missing or placeholder');
} else {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY: [PRESENT]');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('\n🚨 CRITICAL: Missing Supabase configuration!');
  console.log('\n📝 To fix this:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Find your project: jtnmrxgdtjupfvaoddif');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the Project URL and anon/public key');
  console.log('5. Update your .env file');
  process.exit(1);
}

// Test 2: Basic Connection
console.log('\n🔌 Step 2: Testing Basic Connection');
console.log('─'.repeat(50));

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

try {
  const { data, error } = await supabase.from('user_subscriptions').select('count').limit(1);
  
  if (error) {
    if (error.message.includes('relation "user_subscriptions" does not exist')) {
      console.log('⚠️  Database connected but user_subscriptions table missing');
      console.log('   → Need to run database migrations');
    } else if (error.message.includes('JWT expired')) {
      console.log('❌ Connection failed: JWT token expired');
      console.log('   → Need to refresh Supabase keys');
    } else {
      console.log('❌ Connection failed:', error.message);
    }
  } else {
    console.log('✅ Basic connection successful');
  }
} catch (err) {
  console.log('❌ Connection error:', err.message);
}

// Test 3: Service Role Connection (if available)
if (SUPABASE_SERVICE_KEY && SUPABASE_SERVICE_KEY !== '<YOUR_SUPABASE_SERVICE_ROLE_KEY>') {
  console.log('\n🔑 Step 3: Testing Service Role Connection');
  console.log('─'.repeat(50));
  
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const { data, error } = await supabaseAdmin.from('user_subscriptions').select('*').limit(1);
    
    if (error) {
      console.log('❌ Service role connection failed:', error.message);
    } else {
      console.log('✅ Service role connection successful');
    }
  } catch (err) {
    console.log('❌ Service role error:', err.message);
  }
} else {
  console.log('\n⏭️  Step 3: Skipping Service Role Test (key not configured)');
}

// Test 4: Database Schema Check
console.log('\n🗄️  Step 4: Checking Database Schema');
console.log('─'.repeat(50));

try {
  // Check if user_subscriptions table exists
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'user_subscriptions');

  if (tablesError) {
    console.log('⚠️  Cannot check schema:', tablesError.message);
  } else if (tables && tables.length > 0) {
    console.log('✅ user_subscriptions table exists');
    
    // Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'user_subscriptions')
      .eq('table_schema', 'public');

    if (!columnsError && columns) {
      console.log('📋 Table columns:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    }
  } else {
    console.log('❌ user_subscriptions table does not exist');
    console.log('   → Need to run database migrations');
  }
} catch (err) {
  console.log('⚠️  Schema check failed:', err.message);
}

// Test 5: Authentication Test
console.log('\n🔐 Step 5: Testing Authentication');
console.log('─'.repeat(50));

try {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.log('⚠️  Auth check failed:', error.message);
  } else {
    console.log('✅ Authentication system accessible');
    console.log('   Current session:', session ? 'Active' : 'None');
  }
} catch (err) {
  console.log('❌ Auth test error:', err.message);
}

// Test 6: RLS Policies Check
console.log('\n🛡️  Step 6: Checking Row Level Security');
console.log('─'.repeat(50));

try {
  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('policyname, tablename')
    .eq('tablename', 'user_subscriptions');

  if (policiesError) {
    console.log('⚠️  Cannot check RLS policies:', policiesError.message);
  } else if (policies && policies.length > 0) {
    console.log('✅ RLS policies found:');
    policies.forEach(policy => {
      console.log(`   - ${policy.policyname}`);
    });
  } else {
    console.log('⚠️  No RLS policies found for user_subscriptions');
    console.log('   → May need to apply security policies');
  }
} catch (err) {
  console.log('⚠️  RLS check failed:', err.message);
}

// Summary and Recommendations
console.log('\n📊 Summary & Recommendations');
console.log('═'.repeat(50));

console.log('\n🔧 Next Steps:');

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === '<YOUR_SUPABASE_SERVICE_ROLE_KEY>') {
  console.log('1. 🔑 Configure Service Role Key in .env.server');
  console.log('   → Go to Supabase Dashboard > Settings > API');
  console.log('   → Copy the service_role key (keep it secret!)');
}

console.log('2. 🗄️  Apply Database Migrations');
console.log('   → Run: npm run db:migrate (if available)');
console.log('   → Or manually apply migrations from supabase/migrations/');

console.log('3. 👤 Create Demo User');
console.log('   → Go to Supabase Dashboard > Authentication > Users');
console.log('   → Add user: demo@aicube.ai / Demo123!');

console.log('4. 🧪 Test Payment Flow');
console.log('   → Configure Stripe keys');
console.log('   → Test subscription creation');

console.log('\n✨ Once configured, your AI Cube platform will be fully operational!');
