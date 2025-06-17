import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user && requiresSubscription) {
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
          setHasActiveSubscription(false);
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    checkSubscription();
  }, [user, requiresSubscription]);

  if (authLoading || isCheckingSubscription) {
    return <LoadingSpinner fullScreen message="Verifying access..." />;
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Authenticated but no subscription - redirect to payment
  if (requiresSubscription && !hasActiveSubscription) {
    return <Navigate to="/payment" replace />;
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;