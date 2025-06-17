/// <reference types="vitest" />
import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';
import type { IncomingMessage, ServerResponse } from 'http';
import express from 'express'; // Added import
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // The custom-api-middleware plugin below will handle specific /api routes.
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom', '@tanstack/react-query'],
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tooltip',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion'
          ],
          // Heavy 3D libraries - lazy loaded
          three: ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          // Payment processing
          stripe: ['@stripe/stripe-js'],
          supabase: ['@supabase/supabase-js'],
          // Audio processing
          audio: ['tone'],
          // Internationalization
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Form handling
          forms: ['react-hook-form', '@hookform/resolvers', 'zod']
        },
        // Optimize asset handling
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit
    cssCodeSplit: true,
    assetsInlineLimit: 4096 // Inline assets smaller than 4KB
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Security: Prevent secret keys from being bundled
    {
      name: 'prevent-secret-keys',
      buildStart() {
        const dangerousPatterns = [
          /sk_live_/,
          /sk_test_.*[a-zA-Z0-9]{20,}/,
          /whsec_/,
          /eyJ.*\..*\./,  // JWT pattern
          /supabase.*service.*role/i
        ];
        
        const clientEnvVars = Object.entries(process.env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => ({ key, value: value || '' }));
        
        for (const { key, value } of clientEnvVars) {
          for (const pattern of dangerousPatterns) {
            if (pattern.test(value)) {
              throw new Error(`🚨 SECURITY: Client environment variable ${key} contains what appears to be a secret key. Move to server-side environment.`);
            }
          }
        }
      }
    },
    // Custom middleware plugin for /api/create-checkout-session
    {
      name: 'custom-api-middleware',
      configureServer(server: ViteDevServer) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          // Handle checkout session endpoint
          if (req.url === '/api/create-checkout-session' && req.method === 'POST') {
            try {
              const { default: checkoutSessionRouter } = await import('./src/server/routes/createCheckoutSession');
              const tempApp = express();
              tempApp.use(express.json());
              tempApp.use(checkoutSessionRouter);
              tempApp(req, res);
            } catch (error) {
              console.error('API handler error:', error);
              if (!res.writableEnded) {
                res.statusCode = 500;
                res.end('Internal Server Error');
              }
            }
          } 
          // Handle Stripe webhook endpoint
          else if (req.url === '/api/stripe-webhook' && req.method === 'POST') {
            try {
              const { default: webhookRouter } = await import('./src/server/routes/stripeWebhook');
              const tempApp = express();
              tempApp.use(webhookRouter);
              tempApp(req, res);
            } catch (error) {
              console.error('Webhook handler error:', error);
              if (!res.writableEnded) {
                res.statusCode = 500;
                res.end('Internal Server Error');
              }
            }
          }
          // Handle health check endpoints
          else if (req.url?.startsWith('/api/health')) {
            try {
              const { default: healthRouter } = await import('./src/server/routes/health');
              const tempApp = express();
              tempApp.use(express.json());
              tempApp.use(healthRouter);
              
              // Rewrite URL to remove /api/health prefix
              const originalUrl = req.url;
              req.url = req.url.replace('/api/health', '');
              if (req.url === '') req.url = '/';
              
              tempApp(req, res);
            } catch (error) {
              console.error('Health check handler error:', error);
              if (!res.writableEnded) {
                res.statusCode = 500;
                res.end('Internal Server Error');
              }
            }
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
}));
