import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'operational',
      stripe: 'unknown',
      supabase: 'unknown'
    }
  };

  try {
    // Check Stripe configuration
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
      healthCheck.services.stripe = 'configured';
    } else {
      healthCheck.services.stripe = 'misconfigured';
      healthCheck.status = 'degraded';
    }

    // Check Supabase configuration and connectivity
    if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.VITE_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        // Simple connectivity test
        const { error } = await supabase
          .from('user_subscriptions')
          .select('count')
          .limit(1);

        if (error) {
          healthCheck.services.supabase = 'error';
          healthCheck.status = 'degraded';
        } else {
          healthCheck.services.supabase = 'operational';
        }
      } catch (error) {
        healthCheck.services.supabase = 'connection_failed';
        healthCheck.status = 'degraded';
      }
    } else {
      healthCheck.services.supabase = 'misconfigured';
      healthCheck.status = 'degraded';
    }

    // Return appropriate status code
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    return res.status(statusCode).json(healthCheck);

  } catch (error: any) {
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}
