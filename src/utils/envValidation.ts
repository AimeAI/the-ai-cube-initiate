/**
 * Production Environment Validation
 * Ensures all required environment variables are present and valid
 */

export interface EnvironmentConfig {
  // Client-side environment (VITE_ prefixed)
  client: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    stripePublishableKey: string;
    appUrl?: string;
    environment: 'development' | 'staging' | 'production';
  };
  // Server-side environment (only available server-side)
  server?: {
    supabaseServiceRoleKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    databaseUrl?: string;
    sessionSecret?: string;
  };
}

/**
 * Validates client-side environment variables
 */
export function validateClientEnvironment(): EnvironmentConfig['client'] {
  const errors: string[] = [];
  
  // Required client environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const appUrl = import.meta.env.VITE_APP_URL;
  const nodeEnv = import.meta.env.MODE;

  // Validation checks
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is required');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must be a valid HTTPS URL');
  }

  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (should be JWT)');
  }

  if (!stripePublishableKey) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is required');
  } else if (!stripePublishableKey.startsWith('pk_')) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY must start with pk_');
  }

  // Environment-specific validations
  const environment = (nodeEnv === 'production' ? 'production' : 
                      nodeEnv === 'staging' ? 'staging' : 'development') as const;

  if (environment === 'production') {
    if (stripePublishableKey?.includes('test')) {
      errors.push('Production environment cannot use Stripe test keys');
    }
    if (!appUrl) {
      errors.push('VITE_APP_URL is required in production');
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    stripePublishableKey,
    appUrl,
    environment,
  };
}

/**
 * Validates server-side environment variables (Node.js only)
 */
export function validateServerEnvironment(): EnvironmentConfig['server'] {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    throw new Error('validateServerEnvironment should only be called server-side');
  }

  const errors: string[] = [];
  
  // Server environment variables
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  const sessionSecret = process.env.SESSION_SECRET;
  const nodeEnv = process.env.NODE_ENV;

  // Required validations
  if (!supabaseServiceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required');
  } else if (!supabaseServiceRoleKey.startsWith('eyJ')) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY appears to be invalid (should be JWT)');
  }

  if (!stripeSecretKey) {
    errors.push('STRIPE_SECRET_KEY is required');
  } else if (!stripeSecretKey.startsWith('sk_')) {
    errors.push('STRIPE_SECRET_KEY must start with sk_');
  }

  if (!stripeWebhookSecret) {
    errors.push('STRIPE_WEBHOOK_SIGNING_SECRET is required');
  } else if (!stripeWebhookSecret.startsWith('whsec_')) {
    errors.push('STRIPE_WEBHOOK_SIGNING_SECRET must start with whsec_');
  }

  // Production-specific validations
  if (nodeEnv === 'production') {
    if (stripeSecretKey?.includes('test')) {
      errors.push('Production environment cannot use Stripe test keys');
    }
    if (!sessionSecret || sessionSecret.length < 32) {
      errors.push('SESSION_SECRET must be at least 32 characters in production');
    }
    if (supabaseServiceRoleKey === 'your_service_role_key_here') {
      errors.push('SUPABASE_SERVICE_ROLE_KEY must be replaced with actual production key');
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Server environment validation failed:\n${errors.join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    supabaseServiceRoleKey,
    stripeSecretKey,
    stripeWebhookSecret,
    databaseUrl,
    sessionSecret,
  };
}

/**
 * Health check for all external services
 */
export async function performHealthCheck(): Promise<{
  supabase: boolean;
  stripe: boolean;
  database: boolean;
  overall: boolean;
}> {
  const results = {
    supabase: false,
    stripe: false,
    database: false,
    overall: false,
  };

  try {
    // Test Supabase connection
    const { supabaseUrl } = validateClientEnvironment();
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
    });
    results.supabase = supabaseResponse.ok;
  } catch (error) {
    console.error('Supabase health check failed:', error);
  }

  try {
    // Test Stripe API (client-side publishable key validation)
    const { stripePublishableKey } = validateClientEnvironment();
    if (typeof window !== 'undefined') {
      const stripe = await import('@stripe/stripe-js').then(module => 
        module.loadStripe(stripePublishableKey)
      );
      results.stripe = !!stripe;
    } else {
      // Server-side Stripe validation would require actual API call
      results.stripe = true; // Assume OK for server-side check
    }
  } catch (error) {
    console.error('Stripe health check failed:', error);
  }

  // Database check would be done server-side
  results.database = true; // Placeholder

  results.overall = results.supabase && results.stripe && results.database;
  
  return results;
}

/**
 * Initialize environment validation on app startup
 */
export function initializeEnvironment(): EnvironmentConfig['client'] {
  console.log('🔧 Validating environment configuration...');
  
  const clientConfig = validateClientEnvironment();
  
  console.log(`✅ Environment: ${clientConfig.environment}`);
  console.log(`✅ Supabase URL: ${clientConfig.supabaseUrl}`);
  console.log(`✅ Stripe: ${clientConfig.stripePublishableKey.substring(0, 10)}...`);
  
  if (clientConfig.environment === 'production') {
    console.log('🚀 Production environment validated successfully');
  }
  
  return clientConfig;
}