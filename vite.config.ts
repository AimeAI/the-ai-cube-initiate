/// <reference types="vitest" />
import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
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
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Custom middleware plugin for /api/create-checkout-session
    {
      name: 'custom-api-middleware',
      configureServer(server: ViteDevServer) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          // Ensure we only handle POST requests for this specific path
          if (req.url === '/api/create-checkout-session' && req.method === 'POST') {
            try {
              // Dynamically import the handler
              const { default: checkoutSessionRouter } = await import('./src/server/routes/createCheckoutSession');

              const tempApp = express();
              tempApp.use(express.json()); // For req.body parsing
              tempApp.use(checkoutSessionRouter); // Use the imported router

              tempApp(req, res); // Let Express handle the req/res
            } catch (error) {
              console.error('API handler error:', error);
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
