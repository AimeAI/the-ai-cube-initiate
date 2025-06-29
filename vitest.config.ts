/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Mock external dependencies  
    server: {
      deps: {
        external: ['@supabase/supabase-js', '@stripe/stripe-js']
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});