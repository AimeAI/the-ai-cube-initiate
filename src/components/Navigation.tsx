
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Box, Play } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

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
    <nav
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'py-5',
        navVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Box className="h-8 w-8 text-cube-blue animate-cube-rotate mr-2" />
          <span className="text-xl font-orbitron font-bold text-white">AI CUBE</span>
        </Link>
        
        {/* Center - Navigation Links */}
        <div className={cn(
          'hidden md:flex space-x-8',
          navVisible ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}>
          <NavLink to="/" label="Home" delay={0} />
          <NavLink to="/try-free" label="Try Free" delay={100} highlight />
          <NavLink to="/#value" label="Features" delay={200} />
          <NavLink to="/pricing" label="Pricing" delay={300} />
          <NavLink to="/#philosophy" label="About" delay={400} />
        </div>
        
        {/* Right - CTA Buttons & Language Toggle */}
        <div className={cn(
          'flex items-center space-x-4 transition-opacity duration-500',
          navVisible ? 'opacity-100' : 'opacity-0',
        )}>
          <LanguageToggle />
          
          {/* Mobile Try Free Button */}
          <Link 
            to="/try-free" 
            className="md:hidden bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4" />
            Try Free
          </Link>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/login" 
              className="text-white hover:text-electricCyan transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link 
              to="/dashboard/student" 
              className="bg-black border border-neonMint px-4 py-2 text-neonMint hover:bg-neonMint/10 transition-colors duration-300 rounded-lg"
            >
              Student Portal
            </Link>
            <Link 
              to="/dashboard/parent" 
              className="bg-black border border-cube-blue px-4 py-2 text-cube-blue hover:bg-cube-blue/10 transition-colors duration-300 rounded-lg"
            >
              Parent Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

type NavLinkProps = {
  to: string;
  label: string;
  delay: number;
  highlight?: boolean;
};

const NavLink = ({ to, label, delay, highlight = false }: NavLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAnchorLink = to.startsWith('/#');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isAnchorLink) {
      event.preventDefault();
      const hash = to.substring(1); // Get the #section-id part
      if (location.pathname === '/') {
        // Already on the home page, just scroll
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Not on the home page, navigate to home then scroll
        navigate(`/${hash}`);
      }
    }
  };

  const baseClasses = "font-heading tracking-wider text-sm uppercase transition-all duration-300 hover:text-electricCyan";
  const highlightClasses = highlight 
    ? "text-electricCyan font-bold border-b-2 border-electricCyan pb-1" 
    : "text-white";

  if (isAnchorLink) {
    return (
      <a
        href={to.substring(1)}
        onClick={handleClick}
        className={`${baseClasses} ${highlightClasses}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${highlightClasses}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </Link>
  );
};

export default Navigation;
