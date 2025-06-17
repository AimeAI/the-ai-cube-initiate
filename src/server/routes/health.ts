/**
 * Health Check API Endpoint
 * Provides system health status for monitoring and deployment verification
 */

import express, { Request, Response, Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const router: Router = express.Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    stripe: ServiceHealth;
    environment: ServiceHealth;
  };
  performance: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

/**
 * Check Supabase database connectivity
 */
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return {
        status: 'unhealthy',
        error: 'Database credentials not configured',
        lastChecked: new Date().toISOString()
      };
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    
    // Test database connection with a simple query
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('count')
      .limit(1)
      .single();

    const responseTime = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return {
        status: 'unhealthy',
        responseTime,
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }

    return {
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString()
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown database error',
      lastChecked: new Date().toISOString()
    };
  }
}

/**
 * Check Stripe API connectivity
 */
async function checkStripeHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return {
        status: 'unhealthy',
        error: 'Stripe credentials not configured',
        lastChecked: new Date().toISOString()
      };
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    // Test Stripe API with account retrieval
    await stripe.accounts.retrieve();
    
    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString()
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown Stripe error',
      lastChecked: new Date().toISOString()
    };
  }
}

/**
 * Check environment configuration
 */
function checkEnvironmentHealth(): ServiceHealth {
  try {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SIGNING_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        status: 'unhealthy',
        error: `Missing environment variables: ${missingVars.join(', ')}`,
        lastChecked: new Date().toISOString()
      };
    }

    // Check for placeholder values in production
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
      const placeholderPatterns = ['your_', '_here', 'test_', 'example'];
      const envValues = requiredVars.map(varName => process.env[varName] || '');
      
      for (const value of envValues) {
        if (placeholderPatterns.some(pattern => value.includes(pattern))) {
          return {
            status: 'unhealthy',
            error: 'Production environment contains placeholder values',
            lastChecked: new Date().toISOString()
          };
        }
      }
    }

    return {
      status: 'healthy',
      lastChecked: new Date().toISOString()
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown environment error',
      lastChecked: new Date().toISOString()
    };
  }
}

/**
 * Get overall health status based on service statuses
 */
function getOverallStatus(services: HealthStatus['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(service => service.status);
  
  if (statuses.includes('unhealthy')) {
    return 'unhealthy';
  }
  
  if (statuses.includes('degraded')) {
    return 'degraded';
  }
  
  return 'healthy';
}

/**
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Run health checks in parallel for faster response
    const [databaseHealth, stripeHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkStripeHealth()
    ]);

    const environmentHealth = checkEnvironmentHealth();

    const services = {
      database: databaseHealth,
      stripe: stripeHealth,
      environment: environmentHealth
    };

    const healthStatus: HealthStatus = {
      status: getOverallStatus(services),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services,
      performance: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };

    // Set appropriate HTTP status code
    const httpStatus = healthStatus.status === 'healthy' ? 200 :
                     healthStatus.status === 'degraded' ? 200 : 503;

    // Add response time header
    res.set('X-Response-Time', `${Date.now() - startTime}ms`);
    
    // Set cache headers to prevent caching of health checks
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.status(httpStatus).json(healthStatus);

  } catch (error) {
    // Fallback error response
    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: 'unknown',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: { status: 'unhealthy', error: 'Health check failed', lastChecked: new Date().toISOString() },
        stripe: { status: 'unhealthy', error: 'Health check failed', lastChecked: new Date().toISOString() },
        environment: { status: 'unhealthy', error: 'Health check failed', lastChecked: new Date().toISOString() }
      },
      performance: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };

    res.set('X-Response-Time', `${Date.now() - startTime}ms`);
    res.status(503).json(errorResponse);
  }
});

/**
 * Readiness check endpoint (simpler check for load balancers)
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Quick check - just verify essential services
    const databaseHealth = await checkDatabaseHealth();
    const environmentHealth = checkEnvironmentHealth();

    const isReady = databaseHealth.status !== 'unhealthy' && 
                   environmentHealth.status !== 'unhealthy';

    if (isReady) {
      res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
    } else {
      res.status(503).json({ status: 'not ready', timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    });
  }
});

/**
 * Liveness check endpoint (minimal check for container orchestration)
 */
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - just verify the process is running
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;