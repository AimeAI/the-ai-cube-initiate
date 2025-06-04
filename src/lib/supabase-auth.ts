import { supabase } from '../../lib/supabaseClient';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

/**
 * Registers a new user.
 * @param credentials - The user's email and password.
 * @returns The user object and session, or an error.
 */
export const register = async (credentials: SignUpWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  return { data, error };
};

/**
 * Logs in an existing user.
 * @param credentials - The user's email and password.
 * @returns The user object and session, or an error.
 */
export const login = async (credentials: SignUpWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { data, error };
};

/**
 * Logs out the current user.
 * @returns An error if logout fails.
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};