
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link, useLocation, useNavigate
import { cn } from '@/lib/utils';
import { Box } from 'lucide-react';
import LanguageToggle from './LanguageToggle'; // Import LanguageToggle

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
      <div className="container mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Box className="h-8 w-8 text-cube-blue animate-cube-rotate" />
        </div>
        
        {/* Center - Navigation Links */}
        <div className={cn(
          'space-x-8',
          navVisible ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}>
          <NavLink to="/" label="Access" delay={0} />
          <NavLink to="/#value" label="Echoes" delay={100} />
          <NavLink to="/payment" label="Trial" delay={200} />
          <NavLink to="/#philosophy" label="Ascend" delay={300} />
          <NavLink to="/dashboard/student" label="Student View" delay={500} />
        </div>
        
        {/* Right - CTA Button & Language Toggle */}
        <div className={cn(
          'flex items-center space-x-4 transition-opacity duration-500',
          navVisible ? 'opacity-100' : 'opacity-0',
        )}>
          <LanguageToggle />
          <Link to="/dashboard/parent" className="bg-black border border-cube-blue px-4 py-2 text-cube-blue hover:bg-cube-blue/10 transition-colors duration-300 flex items-center space-x-2">
            <span className="text-lg">▣</span>
            <span>Parent View</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

type NavLinkProps = {
  to: string;
  label: string;
  delay: number;
};

const NavLink = ({ to, label, delay }: NavLinkProps) => {
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

  if (isAnchorLink) {
    // For anchor links, use a regular <a> tag with a click handler
    // The href will be the hash part for direct linking if JS is disabled or for context
    return (
      <a
        href={to.substring(1)} // e.g., #value
        onClick={handleClick}
        className="nav-link text-white font-heading tracking-wider text-sm uppercase"
        style={{ animationDelay: `${delay}ms` }}
      >
        {label}
      </a>
    );
  }

  // For internal page links, use react-router-dom Link
  return (
    <Link
      to={to}
      className="nav-link text-white font-heading tracking-wider text-sm uppercase"
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </Link>
  );
};

export default Navigation;
