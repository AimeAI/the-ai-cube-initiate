
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Cube } from 'lucide-react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
        setNavVisible(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Set a timeout to initially display the navigation if user hasn't scrolled
    const timeout = setTimeout(() => {
      if (!navVisible) {
        setNavVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [navVisible]);

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      scrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'py-5',
      navVisible ? 'opacity-100' : 'opacity-0'
    )}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Cube className="h-8 w-8 text-cube-blue animate-cube-rotate" />
        </div>
        
        {/* Center - Navigation Links */}
        <div className={cn(
          'space-x-8',
          navVisible ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}>
          <NavLink href="#access" label="Access" delay={0} />
          <NavLink href="#echoes" label="Echoes" delay={100} />
          <NavLink href="#trial" label="Trial" delay={200} />
          <NavLink href="#ascend" label="Ascend" delay={300} />
        </div>
        
        {/* Right - CTA Button */}
        <div className={cn(
          'transition-opacity duration-500',
          navVisible ? 'opacity-100' : 'opacity-0',
        )}>
          <button className="bg-black border border-cube-blue px-4 py-2 text-cube-blue hover:bg-cube-blue/10 transition-colors duration-300 flex items-center space-x-2">
            <span className="text-lg">▣</span>
            <span>Initiate Access</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

type NavLinkProps = {
  href: string;
  label: string;
  delay: number;
};

const NavLink = ({ href, label, delay }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className="nav-link text-white font-heading tracking-wider text-sm uppercase" 
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </a>
  );
};

export default Navigation;
