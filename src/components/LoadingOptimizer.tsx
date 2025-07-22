import React, { useEffect, useState } from 'react';
import { performanceOptimizer } from '@/utils/performanceOptimization';

interface LoadingOptimizerProps {
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  threshold?: number;
  fallback?: React.ReactNode;
}

// Skeleton components for different content types
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800/30 rounded-lg ${className}`}>
    <div className="h-48 bg-gray-700/30 rounded-t-lg mb-4"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-600/30 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-600/30 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-600/30 rounded w-full"></div>
    </div>
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`h-4 bg-gray-600/30 rounded ${
          i === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse h-10 bg-gray-600/30 rounded-md ${className}`} />
);

export const SkeletonGameCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800/30 rounded-xl p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-600/30 rounded-lg"></div>
      <div className="w-16 h-6 bg-gray-600/30 rounded-full"></div>
    </div>
    <div className="h-6 bg-gray-600/30 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-600/30 rounded w-full mb-4"></div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-gray-600/30 rounded w-1/2"></div>
      <div className="h-3 bg-gray-600/30 rounded w-2/3"></div>
    </div>
    <div className="h-10 bg-gray-600/30 rounded-md"></div>
  </div>
);

const LoadingOptimizer: React.FC<LoadingOptimizerProps> = ({
  children,
  priority = 'medium',
  threshold = 0.1,
  fallback = null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(priority === 'high');

  useEffect(() => {
    if (priority === 'high') {
      setIsLoaded(true);
      return;
    }

    const config = performanceOptimizer.getOptimizedConfig();
    
    // Delay loading based on priority and device performance
    const delay = priority === 'medium' ? 100 : 300;
    const adjustedDelay = config.enableThreeJS ? delay : delay * 2;

    const timer = setTimeout(() => {
      setShouldRender(true);
      
      // Use requestIdleCallback for low priority components
      if (priority === 'low' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setIsLoaded(true);
        });
      } else {
        requestAnimationFrame(() => {
          setIsLoaded(true);
        });
      }
    }, adjustedDelay);

    return () => clearTimeout(timer);
  }, [priority]);

  if (!shouldRender) {
    return fallback as React.ReactElement;
  }

  if (!isLoaded) {
    return fallback as React.ReactElement;
  }

  return <>{children}</>;
};

export default LoadingOptimizer;