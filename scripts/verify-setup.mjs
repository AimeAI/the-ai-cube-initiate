#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.server' });

console.log('🔍 AI Cube Complete Integration Verification\n');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STRIPE_PUBLISHABLE = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

let score = 0;
let maxScore = 0;

function checkItem(name, condition, fix = '') {
  maxScore++;
  if (condition) {
    console.log(`✅ ${name}`);
    score++;
  } else {
    console.log(`❌ ${name}`);
    if (fix) console.log(`   → ${fix}`);
  }
}

// Environment Variables Check
console.log('📋 Environment Variables');
console.log('─'.repeat(40));

checkItem(
  'Supabase URL configured', 
  SUPABASE_URL && SUPABASE_URL.includes('supabase.co'),
  'Check VITE_SUPABASE_URL in .env'
);

checkItem(
  'Supabase Anon Key configured', 
  SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 100,
  'Check VITE_SUPABASE_ANON_KEY in .env'
);

checkItem(
  'Supabase Service Key configured', 
  SUPABASE_SERVICE_KEY && SUPABASE_SERVICE_KEY !== '<YOUR_SUPABASE_SERVICE_ROLE_KEY>',
  'Add service role key to .env.server'
);

checkItem(
  'Stripe Publishable Key configured', 
  STRIPE_PUBLISHABLE && STRIPE_PUBLISHABLE.startsWith('pk_'),
  'Check VITE_STRIPE_PUBLISHABLE_KEY in .env'
);

checkItem(
  'Stripe Secret Key configured', 
  STRIPE_SECRET && STRIPE_SECRET.startsWith('sk_'),
  'Add STRIPE_SECRET_KEY to .env.server'
);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('\n❌ Cannot proceed without basic Supabase configuration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database Connection Tests
console.log('\n🗄️  Database Connection');
console.log('─'.repeat(40));

try {
  const { data, error } = await supabase.from('user_subscriptions').select('count').limit(1);
  checkItem(
    'user_subscriptions table exists',
    !error,
    'Run SQL migration in Supabase dashboard'
  );
} catch (err) {
  checkItem('Database connection', false, 'Check Supabase project status');
}

try {
  const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
  checkItem(
    'user_profiles table exists',
    !error,
    'Run SQL migration in Supabase dashboard'
  );
} catch (err) {
  checkItem('user_profiles table', false, 'Run SQL migration');
}

// Authentication Tests
console.log('\n🔐 Authentication System');
console.log('─'.repeat(40));

try {
  const { data: { session }, error } = await supabase.auth.getSession();
  checkItem(
    'Authentication system accessible',
    !error,
    'Check Supabase auth configuration'
  );
} catch (err) {
  checkItem('Auth system', false, 'Check Supabase configuration');
}

// Demo User Test
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@aicube.ai',
    password: 'Demo123!'
  });
  
  checkItem(
    'Demo user exists and can login',
    !error && data.user,
    'Create demo user in Supabase Auth > Users'
  );
  
  if (data.session) {
    await supabase.auth.signOut();
  }
} catch (err) {
  checkItem('Demo user login', false, 'Create demo user');
}

// Function Tests (if service key available)
if (SUPABASE_SERVICE_KEY && SUPABASE_SERVICE_KEY !== '<YOUR_SUPABASE_SERVICE_ROLE_KEY>') {
  console.log('\n⚙️  Database Functions');
  console.log('─'.repeat(40));
  
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  try {
    const { data, error } = await supabaseAdmin.rpc('get_user_plan_tier', {
      user_uuid: '00000000-0000-0000-0000-000000000000'
    });
    
    checkItem(
      'get_user_plan_tier function exists',
      !error || error.message.includes('invalid input syntax'),
      'Run SQL migration to create functions'
    );
  } catch (err) {
    checkItem('Database functions', false, 'Run SQL migration');
  }
}

// API Endpoints Test
console.log('\n🌐 API Endpoints');
console.log('─'.repeat(40));

try {
  const response = await fetch('http://localhost:8080/api/health');
  checkItem(
    'Health endpoint accessible',
    response.ok,
    'Start dev server with npm run dev'
  );
} catch (err) {
  checkItem('API endpoints', false, 'Start development server');
}

// Final Score
console.log('\n📊 Setup Completion Score');
console.log('═'.repeat(40));
console.log(`Score: ${score}/${maxScore} (${Math.round(score/maxScore*100)}%)`);

if (score === maxScore) {
  console.log('🎉 Perfect! Your AI Cube setup is complete and ready for launch!');
} else if (score >= maxScore * 0.8) {
  console.log('✅ Great! Your setup is mostly complete. Address the remaining items for full functionality.');
} else if (score >= maxScore * 0.6) {
  console.log('⚠️  Good progress! Complete the database setup and configuration to proceed.');
} else {
  console.log('❌ Setup incomplete. Follow the SUPABASE-SETUP-GUIDE.md for step-by-step instructions.');
}

console.log('\n📋 Quick Actions:');
console.log('• Run SQL migration: Copy supabase-setup.sql to Supabase SQL Editor');
console.log('• Create demo user: demo@aicube.ai / Demo123! in Supabase Auth');
console.log('• Configure .env.server with service keys');
console.log('• Test login: npm run dev then visit /login');

process.exit(score === maxScore ? 0 : 1);
