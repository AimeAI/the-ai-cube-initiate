import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Brain, Loader2 } from 'lucide-react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      // Smooth transition timing
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-myth-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <Brain className="w-12 h-12 text-electricCyan mx-auto animate-pulse" />
            <Loader2 className="w-8 h-8 text-neonMint absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          <p className="text-myth-textSecondary animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={displayLocation.pathname}
      className="animate-fadeIn"
      style={{
        animationDuration: '0.2s',
        animationTimingFunction: 'ease-out'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;