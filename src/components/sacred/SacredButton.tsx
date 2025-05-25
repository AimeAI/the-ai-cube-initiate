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
  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`;

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  
  const sizeClasses = 
    size === 'large' ? 'text-lg px-8 py-4' : // Adjusted for HeroSection
    size === 'small' ? 'text-sm px-4 py-2' :
    'text-base px-6 py-3';


  const combinedClasses = cn(baseClasses, variantClasses, sizeClasses, className);

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...(props as any)}>
        <span className="relative z-10">{children}</span>
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