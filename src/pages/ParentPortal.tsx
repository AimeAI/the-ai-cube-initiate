import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { getSlotCountFromPlan } from '../utils/getSlotCountFromPlan';
import EnhancedParentDashboard from '../components/EnhancedParentDashboard';
import { Play, Star, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface UserSubscription {
  plan_id: string;
  status: string;
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

  // Redirect unauthenticated users to the unified login page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/dashboard/parent' } });
    }
  }, [authLoading, user, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-myth-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myth-accent mx-auto mb-4"></div>
          <p className="text-myth-textSecondary">{t('loading')}...</p>
        </div>
      </div>
    );
  }
  
  // This should not be reached due to redirect, but keep as fallback
  if (!user) {
    return null;
  }
  
  const canAccessStudentDashboard = subscription && subscription.status === 'active';

  // If user has active subscription, show the enhanced dashboard
  if (canAccessStudentDashboard) {
    return <EnhancedParentDashboard />;
  }

  // Show onboarding/upgrade flow for users without subscription
  return (
    <div className="container mx-auto p-4 bg-myth-background text-myth-textPrimary min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-orbitron font-bold text-myth-accent">Welcome to AI Cube!</h1>
        <div className="flex gap-3">
          <LanguageToggle />
          <MythButton
            label={t('parentPortal.returnToMainPage', 'Return to Main Page')}
            onClick={() => navigate('/')}
            className="text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
          />
        </div>
      </div>

      {/* Welcome Hero Section */}
      <div className="mb-12">
        <MythCard className="p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-obsidianBlack" />
            </div>
            
            <h2 className="text-3xl font-bold text-myth-accent mb-4">
              Ready to unlock your family's AI potential?
            </h2>
            
            <p className="text-xl text-myth-textSecondary mb-8 leading-relaxed">
              You're one step away from giving your children the tools to thrive in an AI-driven world. 
              Join thousands of families already learning together.
            </p>
            
            {/* Social Proof */}
            <div className="flex justify-center items-center gap-8 mb-8 text-sm text-myth-textSecondary">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>2,847+ families learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neonMint" />
                <span>14-day free trial</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/payment">
                <MythButton 
                  className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30 text-lg px-8 py-4 flex items-center gap-2"
                  label={
                    <>
                      Start Free Trial
                      <ArrowRight className="w-5 h-5" />
                    </>
                  }
                />
              </Link>
              <Link to="/try-free">
                <MythButton 
                  className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 text-lg px-8 py-4 flex items-center gap-2"
                  label={
                    <>
                      <Play className="w-5 h-5" />
                      Try 3 Games Free
                    </>
                  }
                />
              </Link>
            </div>
          </div>
        </MythCard>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MythCard className="p-6 text-center">
          <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-electricCyan" />
          </div>
          <h3 className="text-xl font-bold text-myth-textPrimary mb-3">Interactive Learning</h3>
          <p className="text-myth-textSecondary">
            14 immersive 3D games that teach real AI concepts through hands-on experience
          </p>
        </MythCard>

        <MythCard className="p-6 text-center">
          <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-neonMint" />
          </div>
          <h3 className="text-xl font-bold text-myth-textPrimary mb-3">Family Dashboard</h3>
          <p className="text-myth-textSecondary">
            Track progress, celebrate achievements, and guide your children's learning journey
          </p>
        </MythCard>

        <MythCard className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-myth-textPrimary mb-3">Expert Curriculum</h3>
          <p className="text-myth-textSecondary">
            Designed by AI professionals to build real skills for the future
          </p>
        </MythCard>
      </div>

      {/* Pricing Preview */}
      <div className="mb-12">
        <MythCard className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-myth-accent mb-2">Simple Family Pricing</h3>
            <p className="text-myth-textSecondary">One plan, unlimited learning for your entire family</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-myth-surface/30 rounded-lg p-6 border border-myth-accent/30">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-myth-accent">$15/month</div>
                <div className="text-myth-textSecondary">or $120/year (save 33%)</div>
              </div>
              
              <ul className="space-y-2 mb-6 text-myth-textSecondary">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neonMint" />
                  All 14 interactive AI games
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neonMint" />
                  Up to 4 child profiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neonMint" />
                  Parent progress dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neonMint" />
                  Achievement system & certificates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neonMint" />
                  14-day free trial
                </li>
              </ul>
              
              <div className="text-center">
                <Link to="/payment">
                  <MythButton 
                    className="w-full bg-myth-accent text-myth-background hover:bg-myth-secondary"
                    label="Start Free Trial"
                  />
                </Link>
                <p className="text-xs text-myth-textSecondary mt-2">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </MythCard>
      </div>

      {/* Testimonials */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-center text-myth-accent mb-8">
          What Parents Are Saying
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MythCard className="p-6">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-myth-textSecondary italic mb-4">
              "My daughter plays this more than Roblox. She's actually learning real AI concepts!"
            </p>
            <p className="text-myth-textPrimary font-semibold">- Sarah M., Parent</p>
          </MythCard>

          <MythCard className="p-6">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-myth-textSecondary italic mb-4">
              "Finally, an AI course that doesn't put kids to sleep. Both my boys are obsessed!"
            </p>
            <p className="text-myth-textPrimary font-semibold">- Mike R., Homeschool Dad</p>
          </MythCard>

          <MythCard className="p-6">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-myth-textSecondary italic mb-4">
              "The parent dashboard helps me track their progress and start great conversations about AI."
            </p>
            <p className="text-myth-textPrimary font-semibold">- Jennifer L., Parent</p>
          </MythCard>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <MythCard className="p-8">
          <h3 className="text-2xl font-bold text-center text-myth-accent mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h4 className="font-bold text-myth-textPrimary mb-2">
                Is this suitable for my child's age?
              </h4>
              <p className="text-myth-textSecondary">
                AI Cube is designed for ages 8-16, with adaptive difficulty that grows with your child. 
                Younger children can start with visual games, while teens tackle advanced concepts.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-myth-textPrimary mb-2">
                How much time should my child spend learning?
              </h4>
              <p className="text-myth-textSecondary">
                We recommend 15-30 minutes per day. Our games are designed for focused learning sessions 
                that build skills progressively without overwhelming young minds.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-myth-textPrimary mb-2">
                What if my child doesn't like it?
              </h4>
              <p className="text-myth-textSecondary">
                We offer a 14-day free trial and 60-day money-back guarantee. Most children are 
                engaged within the first few games, but we want you to be completely satisfied.
              </p>
            </div>
          </div>
        </MythCard>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <MythCard className="p-8">
          <h3 className="text-2xl font-bold text-myth-accent mb-4">
            Ready to Start Your Family's AI Journey?
          </h3>
          <p className="text-myth-textSecondary mb-6">
            Join thousands of families already preparing their children for an AI-powered future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/payment">
              <MythButton 
                className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-lg hover:shadow-electricCyan/30 text-lg px-8 py-4"
                label="Start 14-Day Free Trial"
              />
            </Link>
            <Link to="/try-free">
              <MythButton 
                className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 text-lg px-8 py-4"
                label="Try 3 Games Free First"
              />
            </Link>
          </div>
          
          <p className="text-xs text-myth-textSecondary mt-4">
            No credit card required for free trial • Cancel anytime • 60-day money-back guarantee
          </p>
        </MythCard>
      </div>
    </div>
  );
};

export default ParentPortal;