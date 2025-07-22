import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import LoadingFallback from './ui/LoadingFallback';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        if (sessionData.isAdmin && Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
          setIsAdmin(true);
          setHasActiveSubscription(true); // Admin bypasses subscription check
          return;
        }
      } catch (e) {
        console.error('Invalid admin session');
      }
    }

    // Regular user flow
    const checkSubscription = async () => {
      if (!requiresSubscription || !user) {
        setHasActiveSubscription(true);
        return;
      }

      setIsCheckingSubscription(true);
      try {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        setHasActiveSubscription(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    if (!authLoading && user) {
      checkSubscription();
    }
  }, [user, authLoading, requiresSubscription]);

  // Admin bypass - show content immediately
  if (isAdmin) {
    return <>{children}</>;
  }

  // Loading states
  if (authLoading || isCheckingSubscription) {
    return <LoadingFallback message="Checking access..." />;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Needs subscription but doesn't have one
  if (requiresSubscription && !hasActiveSubscription) {
    return <Navigate to="/payment" replace />;
  }

  // All checks passed
  return <>{children}</>;
};

export default AdminProtectedRoute;