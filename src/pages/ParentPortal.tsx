import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { getSlotCountFromPlan } from '../utils/getSlotCountFromPlan';
import { games } from '../gamesConfig'; // Import games configuration

interface UserSubscription {
  plan_id: string;
  status: string; // e.g., 'active', 'cancelled', 'past_due'
}

const ParentPortal: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading, registerUser, loginUser } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slotCount, setSlotCount] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('user_subscriptions')
            .select('plan_id, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching subscription:', error);
          } else if (data) {
            setSubscription(data as UserSubscription);
            setSlotCount(getSlotCountFromPlan(data.plan_id));
          }
        } catch (e) {
          console.error('Subscription fetch exception:', e);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading) {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, authLoading]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(t('parentPortal.passwordMismatch', 'Passwords do not match'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('parentPortal.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }
    
    try {
      await registerUser(email, password);
      
      // After successful registration, update the profile to set account_type as 'parent'
      // Wait a moment for the profile to be created by the database trigger
      setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('user_profiles')
              .update({ account_type: 'parent' })
              .eq('user_id', user.id);
          }
        } catch (profileError) {
          console.warn('Could not set parent account type:', profileError);
          // Don't show error to user as registration was successful
        }
      }, 1000);
      
    } catch (err) {
      setError(t('parentPortal.registrationError', 'Registration failed. Please try again.'));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(email, password);
      // After successful login, the auth state will update automatically
    } catch (err) {
      setError(t('parentPortal.loginError', 'Login failed. Please check your credentials.'));
    }
  };

  // Redirect unauthenticated users to the unified login page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/dashboard/parent' } });
    }
  }, [authLoading, user, navigate]);

  if (authLoading || isLoading) {
    return <div className="text-myth-textPrimary flex justify-center items-center min-h-screen">{t('loading')}...</div>;
  }
  
  // This should not be reached due to redirect, but keep as fallback
  if (!user) {
    return null;
  }
  
  const canAccessStudentDashboard = subscription && subscription.status === 'active';

  return (
    <div className="container mx-auto p-4 bg-myth-background text-myth-textPrimary min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-orbitron font-bold text-myth-accent">{t('parentPortal.title', 'Parent Portal')}</h1>
        <div>
          <MythButton
            label={t('parentPortal.editProfile', 'Edit Profile')}
            onClick={() => navigate('/profile/parent')}
            className="mr-2 text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
          />
          <MythButton
            label={t('parentPortal.returnToMainPage', 'Return to Main Page')}
            onClick={() => navigate('/')}
            className="text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
          />
        </div>
      </div>

      <div className="mb-6">
        <LanguageToggle />
      </div>

      {canAccessStudentDashboard ? (
        <Link to="/dashboard/student">
          <MythButton label={t('parentPortal.viewStudentDashboard', 'View Student Dashboard')} className="mb-6 w-full" />
        </Link>
      ) : (
        <div className="space-y-6">
          <MythCard title={t('parentPortal.welcomeTitle', 'Welcome to AI Cube Parent Portal')}>
            <p className="text-myth-textSecondary mb-4">
              {t('parentPortal.welcomeMessage', 'Thank you for joining AI Cube! To get started, please subscribe to one of our plans to unlock the full learning experience for your children.')}
            </p>
            <div className="space-y-3">
              <Link to="/payment">
                <MythButton label={t('parentPortal.subscribeButton', 'View Subscription Plans')} className="w-full" />
              </Link>
              <Link to="/#pricing">
                <MythButton 
                  label={t('parentPortal.learnMoreButton', 'Learn More About AI Cube')} 
                  className="w-full text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
                />
              </Link>
            </div>
          </MythCard>
          
          <MythCard title={t('parentPortal.noActiveSubscriptionTitle', 'No Active Subscription')}>
            <p className="text-myth-textSecondary mb-4">
              {t('parentPortal.noActiveSubscriptionMessage', 'You currently don\'t have an active subscription. Subscribe now to:')}
            </p>
            <ul className="text-myth-textSecondary text-sm list-disc list-inside space-y-1 mb-4">
              <li>{t('parentPortal.subscriptionBenefit1', 'Give your children access to AI-powered learning games')}</li>
              <li>{t('parentPortal.subscriptionBenefit2', 'Track their progress and achievements')}</li>
              <li>{t('parentPortal.subscriptionBenefit3', 'Manage multiple child accounts')}</li>
              <li>{t('parentPortal.subscriptionBenefit4', 'Access educational content and resources')}</li>
            </ul>
            <Link to="/payment">
              <MythButton label={t('parentPortal.getStartedButton', 'Get Started')} />
            </Link>
          </MythCard>
        </div>
      )}
      
      <p className="text-myth-textSecondary mb-4">{t('parentPortal.slotsAvailable', { count: slotCount, defaultValue: `Child Slots Available: ${slotCount}` })}</p>
    
      <div className="mt-8">
        <h2 className="text-2xl font-orbitron font-semibold text-myth-accent mb-4">{t('parentPortal.gamesOverviewTitle', 'Games Overview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <MythCard key={game.id} title={t(`games.${game.id}.name`, game.name)}>
              <p className="text-myth-textSecondary">{t(`games.${game.id}.description`, game.description)}</p>
            </MythCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;