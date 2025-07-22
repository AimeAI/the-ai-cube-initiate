import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MythButton } from './myth/MythButton';
import { 
  Play, 
  ArrowRight, 
  Gamepad2, 
  CreditCard, 
  Users, 
  Star,
  Zap,
  Brain,
  Award,
  Eye
} from 'lucide-react';

interface EnhancedCTAButtonProps {
  variant: 'try-free' | 'pricing' | 'signup' | 'login' | 'dashboard' | 'game' | 'upgrade' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
  customText?: string;
  customIcon?: React.ReactNode;
  customAction?: () => void;
  trackingId?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  target?: '_blank' | '_self';
}

const EnhancedCTAButton: React.FC<EnhancedCTAButtonProps> = ({
  variant,
  size = 'md',
  className = '',
  children,
  customText,
  customIcon,
  customAction,
  trackingId,
  disabled = false,
  loading = false,
  href,
  target = '_self'
}) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  // Button configurations
  const buttonConfigs = {
    'try-free': {
      text: 'Try 3 Games FREE',
      icon: <Play className="w-5 h-5" />,
      className: 'bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack hover:shadow-2xl hover:shadow-electricCyan/40 font-bold transform hover:scale-105',
      action: () => scrollToSection('try-free'),
      trackingEvent: 'try_free_clicked'
    },
    'pricing': {
      text: 'See Family Plans',
      icon: <CreditCard className="w-5 h-5" />,
      className: 'border-2 border-electricCyan text-electricCyan hover:bg-electricCyan/10 hover:border-neonMint hover:text-neonMint',
      action: () => scrollToSection('pricing'),
      trackingEvent: 'pricing_clicked'
    },
    'signup': {
      text: 'Start Free Trial',
      icon: <Users className="w-5 h-5" />,
      className: 'bg-gradient-to-r from-neonMint to-electricCyan text-obsidianBlack hover:shadow-xl font-bold',
      action: () => navigate('/login'),
      trackingEvent: 'signup_clicked'
    },
    'login': {
      text: 'Login',
      icon: <ArrowRight className="w-4 h-4" />,
      className: 'text-white hover:text-electricCyan border border-transparent hover:border-electricCyan/50',
      action: () => navigate('/login'),
      trackingEvent: 'login_clicked'
    },
    'dashboard': {
      text: 'Parent Dashboard',
      icon: <Eye className="w-5 h-5" />,
      className: 'bg-black border border-cube-blue text-cube-blue hover:bg-cube-blue/10',
      action: () => navigate('/dashboard/parent'),
      trackingEvent: 'dashboard_clicked'
    },
    'game': {
      text: 'Play Now',
      icon: <Gamepad2 className="w-5 h-5" />,
      className: 'bg-myth-accent text-myth-background hover:bg-myth-secondary',
      action: customAction || (() => {}),
      trackingEvent: 'game_play_clicked'
    },
    'upgrade': {
      text: 'Upgrade Now',
      icon: <Star className="w-5 h-5" />,
      className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-xl font-bold',
      action: () => navigate('/pricing'),
      trackingEvent: 'upgrade_clicked'
    },
    'custom': {
      text: customText || 'Click Here',
      icon: customIcon || <ArrowRight className="w-5 h-5" />,
      className: 'bg-myth-accent text-myth-background hover:bg-myth-secondary',
      action: customAction || (() => {}),
      trackingEvent: 'custom_button_clicked'
    }
  };

  const config = buttonConfigs[variant];
  
  // Size configurations
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Analytics tracking
  const trackEvent = (eventName: string) => {
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
          event_category: 'CTA',
          event_label: variant,
          custom_parameter_1: trackingId || 'unknown'
        });
      }
      
      // Custom analytics
      if (window.analytics) {
        window.analytics.track(eventName, {
          buttonVariant: variant,
          trackingId: trackingId,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`CTA Event: ${eventName}`, { variant, trackingId });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  // Handle click
  const handleClick = async (e: React.MouseEvent) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    setIsClicked(true);
    
    // Track the event
    trackEvent(config.trackingEvent);
    
    // Handle external links
    if (href) {
      if (target === '_blank') {
        window.open(href, '_blank', 'noopener,noreferrer');
        e.preventDefault();
      } else {
        window.location.href = href;
        e.preventDefault();
      }
      return;
    }

    // Execute the action
    try {
      await config.action();
    } catch (error) {
      console.error('Button action failed:', error);
    }

    // Reset click state
    setTimeout(() => setIsClicked(false), 300);
  };

  // Loading state
  if (loading) {
    return (
      <MythButton
        className={`${config.className} ${sizeClasses[size]} ${className} opacity-75 cursor-not-allowed`}
        disabled={true}
        label={
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        }
      />
    );
  }

  // Disabled state
  if (disabled) {
    return (
      <MythButton
        className={`${config.className} ${sizeClasses[size]} ${className} opacity-50 cursor-not-allowed`}
        disabled={true}
        label={
          <div className="flex items-center gap-2">
            {config.icon}
            {config.text}
          </div>
        }
      />
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${config.className} 
        ${sizeClasses[size]} 
        ${className}
        ${isClicked ? 'scale-95' : ''}
        flex items-center justify-center gap-2 
        transition-all duration-300 
        rounded-lg 
        font-semibold 
        focus:outline-none 
        focus:ring-2 
        focus:ring-electricCyan/50 
        focus:ring-offset-2 
        focus:ring-offset-myth-background
        active:scale-95
        disabled:opacity-50 
        disabled:cursor-not-allowed
        relative
        overflow-hidden
      `}
      disabled={disabled || loading}
      aria-label={config.text}
      type="button"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 hover:translate-x-full" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {config.icon}
        {children || config.text}
        {variant === 'try-free' && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
      
      {/* Pulse effect for primary CTAs */}
      {(variant === 'try-free' || variant === 'upgrade') && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-electricCyan/20 to-neonMint/20 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

// Convenience components for common use cases
export const TryFreeButton: React.FC<Omit<EnhancedCTAButtonProps, 'variant'>> = (props) => (
  <EnhancedCTAButton variant="try-free" {...props} />
);

export const PricingButton: React.FC<Omit<EnhancedCTAButtonProps, 'variant'>> = (props) => (
  <EnhancedCTAButton variant="pricing" {...props} />
);

export const SignupButton: React.FC<Omit<EnhancedCTAButtonProps, 'variant'>> = (props) => (
  <EnhancedCTAButton variant="signup" {...props} />
);

export const GameButton: React.FC<Omit<EnhancedCTAButtonProps, 'variant'>> = (props) => (
  <EnhancedCTAButton variant="game" {...props} />
);

export default EnhancedCTAButton;
