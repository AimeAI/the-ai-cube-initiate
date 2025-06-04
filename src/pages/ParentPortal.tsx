import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { getSlotCountFromPlan } from '../../src/utils/getSlotCountFromPlan';
import { games } from '../../src/gamesConfig'; // Import games configuration

interface UserSubscription {
  plan_id: string;
  status: string; // e.g., 'active', 'cancelled', 'past_due'
}

const ParentPortal: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slotCount, setSlotCount] = useState(0);

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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || isLoading || !user) {
    return <div className="text-myth-textPrimary flex justify-center items-center min-h-screen">{t('loading')}...</div>;
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
        <MythCard title={t('parentPortal.noActiveSubscriptionTitle', 'No Active Subscription')}>
          <p className="text-myth-textSecondary mb-4">{t('parentPortal.noActiveSubscriptionMessage', 'Please subscribe to access student features.')}</p>
          <Link to="/payment">
            <MythButton label={t('parentPortal.subscribeButton', 'Subscribe Now')} />
          </Link>
        </MythCard>
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