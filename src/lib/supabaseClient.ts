import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prefer Vercel's process.env (for server-side/build time) or Vite's import.meta.env (for client-side dev)
const supabaseUrl = (typeof process !== 'undefined' && process.env.SUPABASE_URL)
  ? process.env.SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY)
  ? process.env.SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    'Critical Warning: SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY) ' +
    'environment variables are not set or are empty. Supabase client will NOT be initialized. ' +
    'Supabase features will not work. Please ensure these variables are correctly set in your environment (e.g., Vercel settings).'
  );
  // supabase remains undefined, or you could assign a specific marker like null
  // For now, leaving it undefined is consistent with `let supabase: SupabaseClient;`
}

export { supabase };