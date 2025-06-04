import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prefer Vercel's process.env (for server-side/build time) or Vite's import.meta.env (for client-side dev)
const supabaseUrl = (typeof process !== 'undefined' && process.env.SUPABASE_URL)
  ? process.env.SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY)
  ? process.env.SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: SUPABASE_URL or SUPABASE_ANON_KEY environment variables are not set. ' +
    'Attempting to initialize Supabase with potentially empty or undefined values. ' +
    'This may lead to errors if Supabase features are used, but the site should load.'
  );
  // Initialize with the resolved values (which might be undefined, so fallback to '').
  // If they are defined but empty, they will be used as is.
  supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };