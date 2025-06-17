import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import ChildSlotManager from '@/components/myth/ChildSlotManager';
import { getSlotCountFromPlan } from '../utils/getSlotCountFromPlan'; // Adjusted path

interface ProfileData {
  full_name?: string;
  preferred_language?: string;
}

interface UserSubscription { // Define if not already globally available
  plan_id: string;
  status: string;
}

const ParentProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth(); // Use authLoading
  const [fullName, setFullName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(i18n.language);
  const [profileLoading, setProfileLoading] = useState(false); // Renamed for clarity
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [slotCount, setSlotCount] = useState(0);
  const [message, setMessage] = useState('');


  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('full_name, preferred_language')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setMessage(t('parentProfilePage.fetchError', 'Error fetching profile.'));
        } else if (data) {
          setFullName(data.full_name || '');
          setPreferredLanguage(data.preferred_language || i18n.language);
          if (data.preferred_language && data.preferred_language !== i18n.language) {
            i18n.changeLanguage(data.preferred_language);
          }
        }
        setProfileLoading(false);
      };
      fetchProfile();
    }
  }, [user, t, i18n]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        setSubscriptionLoading(true);
        try {
          const { data, error } = await supabase
            .from('user_subscriptions')
            .select('plan_id, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching subscription for profile page:', error);
          } else if (data) {
            setSlotCount(getSlotCountFromPlan(data.plan_id));
          } else {
            setSlotCount(0); // No active subscription found
          }
        } catch (e) {
          console.error('Subscription fetch exception for profile page:', e);
          setSlotCount(0);
        } finally {
          setSubscriptionLoading(false);
        }
      } else if (!authLoading) {
        setSubscriptionLoading(false);
        setSlotCount(0);
      }
    };

    fetchSubscription();
  }, [user, authLoading]);


  const handleSaveProfile = async () => {
    if (!user) {
      setMessage(t('parentProfilePage.notLoggedInError', 'You are not logged in.'));
      return;
    }

    setProfileLoading(true); // Use profileLoading
    setMessage('');

    const profileData: ProfileData = {
      full_name: fullName,
      preferred_language: preferredLanguage,
    };

    // Upsert profile data
    const { error } = await supabase
      .from('users')
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    
    // Note: Supabase RLS policy should allow users to update their own 'users' table row.
    // If the 'users' table is new or doesn't exist, this will fail.
    // A more robust solution might involve a dedicated 'profiles' table.
    // For now, we assume 'users' table exists and RLS is configured.

    if (error) {
      console.error('Error updating profile:', error);
      setMessage(t('parentProfilePage.updateError', 'Error updating profile: ') + error.message);
    } else {
      setMessage(t('parentProfilePage.updateSuccess', 'Profile saved successfully!'));
      if (i18n.language !== preferredLanguage) {
        i18n.changeLanguage(preferredLanguage);
      }
    }
    setProfileLoading(false); // Use profileLoading
  };

  if (authLoading) { // Show loading if auth state is not determined
    return <div className="text-myth-textPrimary flex justify-center items-center min-h-screen">{t('loading')}...</div>;
  }

  return (
    <div className="bg-myth-background text-myth-textPrimary min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-myth-accent to-myth-secondary">
          {t('parentProfilePage.title', 'Parent Profile')}
        </h1>
        <div className="max-w-md mx-auto bg-myth-dark p-8 rounded-lg shadow-xl">
          { profileLoading ? (
            <p>{t('parentProfilePage.loadingProfile', 'Loading profile...')}</p>
          ) : (
            <>
              <div className="mb-6">
            <label htmlFor="fullName" className="block text-sm font-medium text-myth-textSecondary mb-1">
              {t('parentProfilePage.fullNameLabel', 'Full Name (Optional)')}
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('parentProfilePage.fullNamePlaceholder', 'Enter your full name')}
              className="bg-myth-darker border-myth-dark-light text-myth-textPrimary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="language" className="block text-sm font-medium text-myth-textSecondary mb-1">
              {t('parentProfilePage.languageLabel', 'Preferred Language')}
            </label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
              <SelectTrigger className="w-full bg-myth-darker border-myth-dark-light text-myth-textPrimary">
                <SelectValue placeholder={t('parentProfilePage.languagePlaceholder', 'Select language')} />
              </SelectTrigger>
              <SelectContent className="bg-myth-dark border-myth-dark-light text-myth-textPrimary">
                <SelectItem value="en" className="hover:bg-myth-dark-light">English</SelectItem>
                <SelectItem value="fr-CA" className="hover:bg-myth-dark-light">Français (Canada)</SelectItem>
                {/* Add other languages as needed */}
              </SelectContent>
            </Select>
          </div>

              <Button
                onClick={handleSaveProfile}
                disabled={profileLoading || subscriptionLoading}
                className="w-full bg-myth-accent hover:bg-myth-accent-dark text-white font-semibold py-3 rounded-md transition duration-150 ease-in-out"
              >
                {profileLoading ? t('parentProfilePage.savingButton', 'Saving...') : t('parentProfilePage.saveButton', 'Save Profile')}
              </Button>

              {message && (
                <p className={`mt-4 text-sm ${message.toLowerCase().includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}
            </>
          )}
        </div>
        {subscriptionLoading ? (
          <p className="text-center mt-8">{t('parentProfilePage.loadingSlots', 'Loading slot information...')}</p>
        ) : (
          <ChildSlotManager totalSlots={slotCount} />
        )}
      </div>
    </div>
  );
};

export default ParentProfilePage;