import React from 'react';
import { cn } from '@/lib/utils';

interface SacredButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large'; // Added size prop as per HeroSection example
  href?: string; // Added href for potential link-like behavior
}

const SacredButton: React.FC<SacredButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium', // Default size
  href,
  className,
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center rounded-md font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`;

  const variantClasses =
    variant === 'primary'
      ? 'bg-[#1e3a8a] text-white hover:bg-[#1e40af] shadow-lg shadow-blue-900/30 border border-blue-700/50 hover:shadow-xl hover:shadow-blue-800/40 hover:scale-105 transform'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  
  const sizeClasses = 
    size === 'large' ? 'text-lg px-8 py-4' : // Adjusted for HeroSection
    size === 'small' ? 'text-sm px-4 py-2' :
    'text-base px-6 py-3';


  const combinedClasses = cn(baseClasses, variantClasses, sizeClasses, className);

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <span className="relative z-10 font-bold tracking-wide">{children}</span>
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default SacredButton;