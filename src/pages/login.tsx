// pages/login.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MythCard } from '@/components/myth/MythCard';
import HomeButton from '../components/ui/HomeButton';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const { loginUser, registerUser, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Redirect based on user state and subscription
  useEffect(() => {
    const checkUserStatusAndRedirect = async () => {
      if (user && !authLoading) {
        setIsCheckingSubscription(true);
        try {
          // Check if user has an active subscription
          const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (subscription) {
            // User has active subscription - redirect to parent portal or requested page
            const from = location.state?.from || '/dashboard/parent';
            navigate(from);
          } else {
            // User has no active subscription - redirect to payment
            navigate('/payment');
          }
        } catch (error) {
          // No subscription found - redirect to payment
          navigate('/payment');
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    checkUserStatusAndRedirect();
  }, [user, authLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(email, password);
      // Redirect will be handled by useEffect
    } catch (err) {
      setError(t('login.loginError', 'Invalid email or password. Please try again.'));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(t('login.passwordMismatch', 'Passwords do not match. Please ensure both password fields are identical.'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('login.passwordTooShort', 'Password must be at least 6 characters long for security.'));
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError(t('login.invalidEmail', 'Please enter a valid email address.'));
      return;
    }
    
    try {
      await registerUser(email, password);
      
      // Wait for profile creation and set account type to parent
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Wait for profile to exist by polling
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
          try {
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('user_id', user.id)
              .single();
            
            if (profile) {
              // Profile exists, update account type
              await supabase
                .from('user_profiles')
                .update({ account_type: 'parent' })
                .eq('user_id', user.id);
              break;
            }
          } catch (profileError) {
            // Profile doesn't exist yet, wait and retry
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn('Could not set parent account type: profile creation timeout');
        }
      }
      
      // Redirect will be handled by useEffect
    } catch (err) {
      setError(t('login.registrationError', 'Registration failed. This email may already be in use.'));
    }
  };

  if (authLoading || isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-myth-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myth-accent mx-auto mb-4"></div>
          <p className="text-myth-textSecondary">{t('loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-myth-background">
      <HomeButton />
      
      <div className="w-full max-w-md px-4">
        {/* AI Cube Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint mb-2">
            AI CUBE
          </h1>
          <p className="text-myth-textSecondary">
            {t('login.subtitle', 'Your gateway to AI-powered learning')}
          </p>
        </div>

        <MythCard title={isRegistering ? t('login.createAccount', 'Create Your Account') : t('login.welcomeBack', 'Welcome Back')}>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-myth-textSecondary mb-2">
                {t('login.email', 'Email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                placeholder={t('login.emailPlaceholder', 'your@email.com')}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-myth-textSecondary mb-2">
                {t('login.password', 'Password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                placeholder="••••••••"
              />
            </div>
            
            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-myth-textSecondary mb-2">
                  {t('login.confirmPassword', 'Confirm Password')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-myth-accent text-myth-background rounded-md hover:bg-myth-secondary transition-colors font-medium"
            >
              {isRegistering ? t('login.register', 'Create Account') : t('login.loginButton', 'Login')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-myth-accent hover:text-myth-secondary underline text-sm"
            >
              {isRegistering 
                ? t('login.alreadyHaveAccount', 'Already have an account? Login')
                : t('login.needAccount', 'Need an account? Register')}
            </button>
          </div>
        </MythCard>

        {/* Registration Benefits */}
        {isRegistering && (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-myth-accent mb-4">
              {t('login.whatYouGet', 'What You Get With AI Cube')}
            </h3>
            <div className="space-y-3 text-myth-textSecondary text-sm">
              <div className="flex items-start">
                <span className="text-neonMint mr-2">✓</span>
                <span>{t('login.benefit1', 'Full access to all AI learning games')}</span>
              </div>
              <div className="flex items-start">
                <span className="text-neonMint mr-2">✓</span>
                <span>{t('login.benefit2', 'Parent dashboard to track progress')}</span>
              </div>
              <div className="flex items-start">
                <span className="text-neonMint mr-2">✓</span>
                <span>{t('login.benefit3', 'Multiple child accounts per subscription')}</span>
              </div>
              <div className="flex items-start">
                <span className="text-neonMint mr-2">✓</span>
                <span>{t('login.benefit4', 'New content and features added monthly')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps Indicator */}
        <div className="mt-8 text-center">
          <p className="text-myth-textSecondary text-sm">
            {isRegistering 
              ? t('login.nextSteps', 'Next: Choose your subscription plan')
              : t('login.returningUser', 'Welcome back to your AI learning journey')}
          </p>
        </div>
      </div>
    </div>
  );
}