#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🎯 AI Cube Enhanced Pricing Migration');
console.log('=====================================\n');

// Check if we're in the right directory
if (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

let migrationSteps = 0;
let completedSteps = 0;

function logStep(message, success = true) {
  migrationSteps++;
  if (success) {
    completedSteps++;
    console.log(`✅ ${message}`);
  } else {
    console.log(`❌ ${message}`);
  }
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

// Step 1: Check for required files
console.log('📋 Step 1: Checking enhanced pricing files...\n');

const requiredFiles = [
  'src/components/EnhancedPricingSection.tsx',
  'src/lib/enhancedStripe.ts',
  'src/server/routes/enhancedCheckoutSession.ts',
  'src/config/pricing.ts'
];

for (const file of requiredFiles) {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    logStep(`Found ${file}`);
  } else {
    logStep(`Missing ${file}`, false);
  }
}

// Step 2: Backup existing pricing section
console.log('\n📋 Step 2: Backing up existing files...\n');

const pricingSectionPath = path.join(projectRoot, 'src/components/PricingSection.tsx');
const backupPath = path.join(projectRoot, 'src/components/PricingSection.backup.tsx');

if (fs.existsSync(pricingSectionPath)) {
  try {
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(pricingSectionPath, backupPath);
      logStep('Backed up existing PricingSection.tsx');
    } else {
      logStep('Backup already exists - skipping');
    }
  } catch (error) {
    logStep(`Failed to backup: ${error.message}`, false);
  }
} else {
  logWarning('No existing PricingSection.tsx found to backup');
}

// Step 3: Check environment variables
console.log('\n📋 Step 3: Checking environment configuration...\n');

const envPath = path.join(projectRoot, '.env');
const envServerPath = path.join(projectRoot, '.env.server');

// Check client-side env
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredClientVars = [
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  for (const varName of requiredClientVars) {
    if (envContent.includes(varName)) {
      logStep(`Found ${varName} in .env`);
    } else {
      logStep(`Missing ${varName} in .env`, false);
    }
  }
} else {
  logStep('Missing .env file', false);
}

// Check server-side env
if (fs.existsSync(envServerPath)) {
  const envServerContent = fs.readFileSync(envServerPath, 'utf8');
  const requiredServerVars = [
    'STRIPE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  for (const varName of requiredServerVars) {
    if (envServerContent.includes(varName)) {
      logStep(`Found ${varName} in .env.server`);
    } else {
      logStep(`Missing ${varName} in .env.server`, false);
    }
  }
} else {
  logStep('Missing .env.server file', false);
}

// Step 4: Generate Stripe configuration guide
console.log('\n📋 Step 4: Generating setup guides...\n');

const stripeGuide = `# Stripe Configuration for Enhanced Pricing

## Products to Create in Stripe Dashboard

1. **AI Cube Explorer**
   - Product ID: prod_explorer
   - Monthly Price: $8.00 (price_explorer_monthly)
   - Yearly Price: $64.00 (price_explorer_yearly)

2. **AI Cube Initiate** 
   - Product ID: prod_initiate
   - Monthly Price: $15.00 (price_initiate_monthly)
   - Yearly Price: $120.00 (price_initiate_yearly)

3. **AI Cube Master**
   - Product ID: prod_master
   - Monthly Price: $25.00 (price_master_monthly)
   - Yearly Price: $200.00 (price_master_yearly)

4. **AI Cube Family**
   - Product ID: prod_family
   - Monthly Price: $20.00 (price_family_monthly)
   - Yearly Price: $160.00 (price_family_yearly)

## Webhook Configuration

Endpoint: https://yourdomain.com/api/stripe-webhook
Events to listen for:
- checkout.session.completed
- invoice.payment_succeeded
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

## Testing

Use Stripe CLI to test webhooks locally:
\`\`\`bash
stripe listen --forward-to localhost:8080/api/stripe-webhook
\`\`\`
`;

const stripeGuidePath = path.join(projectRoot, 'STRIPE-ENHANCED-SETUP.md');
try {
  fs.writeFileSync(stripeGuidePath, stripeGuide);
  logStep('Created Stripe setup guide');
} catch (error) {
  logStep(`Failed to create Stripe guide: ${error.message}`, false);
}

// Migration Summary
console.log('\n🎊 Migration Summary');
console.log('===================\n');

console.log(`✅ Completed: ${completedSteps}/${migrationSteps} steps`);

if (completedSteps >= migrationSteps * 0.8) {
  console.log('🎉 Migration completed successfully!\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Configure Stripe products using STRIPE-ENHANCED-SETUP.md');
  console.log('2. Update your .env and .env.server files');
  console.log('3. Replace PricingSection with EnhancedPricingSection');
  console.log('4. Run verification: npm run verify');
  console.log('5. Start development server: npm run dev\n');
  
  console.log('🚀 Your enhanced pricing system is ready!');
} else {
  console.log('⚠️  Migration completed with some issues.\n');
  
  console.log('📋 Please address the failed steps above.');
  console.log('For help, check ENHANCED-PRICING-INTEGRATION.md');
}

console.log('\n' + '='.repeat(50));
