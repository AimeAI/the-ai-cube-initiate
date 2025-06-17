// hooks/useAuth.tsx
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // <- Named import

interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: Session | null;
  getToken: () => Promise<string | null>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      setLoading(false);
      console.warn("Supabase client not initialized. Skipping getSession.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error.message);
      setUser(data?.session?.user ?? null);
      setSession(data?.session ?? null);
    } catch (e) {
      console.error("Error in getSession:", e);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (!supabase) {
      console.error('Cannot get token: Supabase client not initialized.');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting token:', error.message);
        return null;
      }
      return data?.session?.access_token ?? null;
    } catch (e) {
      console.error("Error in getToken:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false); // Ensure loading is false if supabase is not there
      console.warn("Supabase client not initialized. Skipping auth listener setup.");
      return;
    }

    getSession(); // Initial session check

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      // setLoading(false); // Already handled by getSession and initial load
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []); // supabase is not in dependency array as it's a module-level const

  const loginUser = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Login attempt failed: Supabase client not initialized.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('Login error:', error.message);
      // getSession will be called by onAuthStateChange or manually if needed
    } catch (e) {
      console.error("Error in loginUser:", e);
    } finally {
      // getSession will update user and loading state via onAuthStateChange
      // or call getSession directly if onAuthStateChange is not reliable enough for immediate feedback
      await getSession(); // Explicitly refresh session info
    }
  };

  const registerUser = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Register attempt failed: Supabase client not initialized.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) console.error('Register error:', error.message);
    } catch (e) {
      console.error("Error in registerUser:", e);
    } finally {
      await getSession(); // Explicitly refresh session info
    }
  };

  const signOut = async () => {
    if (!supabase) {
      console.error('SignOut attempt failed: Supabase client not initialized.');
      setUser(null); // Clear user state locally
      return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null); // Ensure user is cleared immediately
    } catch (e) {
      console.error("Error in signOut:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, getToken, loginUser, registerUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};